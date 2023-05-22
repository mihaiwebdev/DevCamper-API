const Bootcamp = require('../models/Bootcamp');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const geocoder = require('../utils/geocoder');

// @desc    Get all bootcamps
// @route   GET /api/v1/bootcamps
// @access   Public
exports.getBootcamps = asyncHandler(async (req, res, next) => {
    let query;

    const reqQuery = {...req.query};
    
    // Remove fields which don't need to be searched for in the model
    const removeFields = ['select', 'sort', 'limit', 'page'];
    removeFields.map(field => delete reqQuery[field]);

    // Create MongoDB operators ($gt, $gte, etc)
    let queryStr = JSON.stringify(reqQuery);    
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

    // Finding bootcamps by queries
    query = Bootcamp.find(JSON.parse(queryStr)).populate('courses');

    // Get only selected fields from bootcamp data
    if (req.query.select) {
        const fields = req.query.select.replace(',', ' ');
        query = query.select(fields);
    }

    // Sort data
    if (req.query.sort) {
        const sortBy = req.query.sort.replace(',', ' ');
        query = query.sort(sortBy);

    } else {
        query = query.sort('-createdAt');
    }
    
    // Pagination
    const page = +req.query.page || 1;
    const limit = +req.query.limit || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await Bootcamp.countDocuments();

    query = query.skip(startIndex).limit(limit);

    const pagination = {};
    if (endIndex < total) {
        pagination.next = {
            page: page + 1,
            limit
        }
    }
    if (startIndex > 0) {
        pagination.prev = {
            page: page - 1,
            limit
        }
    }

    // Executing query
    const data = await query;

    res.status(200).json({success: true, count: data.length, pagination, data});    
});

// @desc    Get all bootcamps within a radius
// @route   GET /api/v1/bootcamps/radius/:zipcode/:distance
// @access   Public
exports.getBootcampsInRadius = asyncHandler(async (req, res, next) => {
    const { zipcode, distance } = req.params;

    // Get location coords by zipcode with geocode
    const location = await geocoder.geocode(zipcode);
    const lat = location[0].latitude;
    const long = location[0].longitude;

    // Calc radius using radians - Earth Radius = 6378km
    const radius = distance / 6378;

    // Filter bootcamps within the radius
    const bootcamps = await Bootcamp.find({
        location: { $geoWithin: { $centerSphere : [ [long, lat], radius ]}}
    });

    res.status(200).json({success: true, count: bootcamps.length, data: bootcamps});
})

// @desc    Get single bootcamp
// @route   GET /api/v1/bootcamps/:id
// @access  Public
exports.getBootcamp = asyncHandler(async (req, res, next) => {
    const data = await Bootcamp.findById(req.params.id);

    if (!data) {
        return next(
            new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
        );            
    };

    res.status(200).json({success: true, data});
});

// @desc    Create bootcamp
// @route   POST /api/v1/bootcamps
// @access  Private
exports.createBootcamp = asyncHandler(async (req, res, next) => {
    const data = await Bootcamp.create(req.body);

    res.status(201).json({success: true, data});
});

// @desc    Update bootcamp
// @route   PUT /api/v1/bootcamps/:id
// @access  Private
exports.updateBootcamp = asyncHandler(async (req, res, next) => {
    const data = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    })

    if (!data) {
        return next(
            new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
        );  
    }

    res.status(200).json({success: true, data});
});

// @desc    Delete bootcamp
// @route   DELETE /api/v1/bootcamps:/id
// @access  Private
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.findById(req.params.id);

    if (!bootcamp) {
        return next(
            new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
        );  
    };

    await bootcamp.deleteOne();

    res.status(200).json({success: true, data: {}});

});