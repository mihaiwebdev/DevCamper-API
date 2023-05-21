const Bootcamp = require('../models/Bootcamp');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const geocoder = require('../utils/geocoder');

// @desc    Get all bootcamps
// @route   GET /api/v1/bootcamps
// @access   Public
exports.getBootcamps = asyncHandler(async (req, res, next) => {
    const data = await Bootcamp.find();

    res.status(200).json({success: true, count: data.length, data});    
});

// @desc    Get all bootcamps within a radius
// @route   GET /api/v1/bootcamps/radius/:zipcode/:distance
// @access   Public
exports.getBootcampsInRadius = asyncHandler(async (req,res,next) => {
    const { zipcode, distance } = req.params;

    const location = await geocoder.geocode(zipcode);
    const lat = location[0].latitude;
    const long = location[0].longitude;

    // Calc radius using radians / Earth Radius = 6378km
    const radius = distance / 6378;

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
    const data = await Bootcamp.findByIdAndDelete(req.params.id)

    if (!data) {
        return next(
            new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
        );  
    };

    res.status(200).json({success: true, data: {}});

});