const path = require('path');
const Bootcamp = require('../models/Bootcamp');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const geocoder = require('../utils/geocoder');

// @desc    Get all bootcamps
// @route   GET /api/v1/bootcamps
// @access   Public
exports.getBootcamps = asyncHandler(async (req, res, next) => {

    res.status(200).json(res.advancedResults);    
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
    req.body.user = req.user.id;

    const createdBootcamp = await Bootcamp.findOne({ user: req.user.id });

    if (createdBootcamp && req.user.role !== 'admin') {
        return next(
            new ErrorResponse(`User has already published a bootcamp`, 400)
        );
    };

    const data = await Bootcamp.create(req.body);

    res.status(201).json({success: true, data});
});

// @desc    Update bootcamp
// @route   PUT /api/v1/bootcamps/:id
// @access  Private
exports.updateBootcamp = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.findById(req.params.id);

    if (!bootcamp) {
        return next(
            new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
        );  
    };

    if (bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(
            new ErrorResponse(`Not authorized to update the bootcamp`, 401)
        );
    };

    const data = await bootcamp.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });

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

    if (bootcamp.user.toString() !== req.user.id && req.user.role !==  'admin') {
        return next(
            new ErrorResponse('Not authorized to delete the bootcamp', 401)
        )
    };

    await bootcamp.deleteOne();

    res.status(200).json({success: true, data: {}});

});

// @desc    Upload bootcamp image
// @route   PUT /api/v1/bootcamps:/id/photo
// @access  Private
exports.uploadBootcampImage = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.findById(req.params.id);

    if (!bootcamp) {
        return next(
            new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
        );  
    };

    if (bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(
            new ErrorResponse(`Not authorized to upload image to the bootcamp`, 401)
        );
    };

    if (!req.files) {
        return next(
            new ErrorResponse(`Please upload an image`, 400)
        )
    };

    const file = req.files.file;

    // Make sure the file is an image
    if (!file.mimetype.startsWith('image')) {
        return next(
            new ErrorResponse(`Please upload an image`, 400)
        )
    };

    // Check filesize
    if (file.size > process.env.MAX_FILE_UPLOAD) {
        return next(
            new ErrorResponse(`Please upload an image less than ${process.env.MAX_FILE_UPLOAD} bytes`, 400)
        )
    }

    // Create custom filename
    file.name = `photo_${req.params.id}${path.parse(file.name).ext}`;

    file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async err => {
        if (err) {
            console.log(err);

            return next(
                new ErrorResponse(`Problem with file upload`, 500)
            )
        };

        await Bootcamp.findByIdAndUpdate(req.params.id, {
            photo: file.name
        })

        res.status(200).json({ success: true, data: file.name });
    })
});