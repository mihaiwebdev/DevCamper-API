const asyncHandler = require('../middleware/async');
const Course = require('../models/Course');
const Bootcamp = require('../models/Bootcamp');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get all courses
// @route   GET /api/v1/courses
// @route   GET /api/v1/bootcamps/:bootcampId/courses
// @access  Public
exports.getCourses = asyncHandler(async (req, res, next) => {
    let query;

    if (req.params.bootcampId) {
        query = Course.find({ bootcamp: req.params.bootcampId });
        
    } else {
        query = Course.find().populate({
            path: 'bootcamp',
            select: 'name description'
        });
    }
    const data = await query;

    res.status(200).json({success: true, count: data.length, data});
});

// @desc    Get single course
// @route   GET /api/v1/courses/:id
// @access  Public
exports.getCourse = asyncHandler(async (req, res, next) => {
    const data = await Course.findById(req.params.id).populate({
        path: 'bootcamp',
        select: 'name description'
    });

    if(!data) {
        return next(
            new ErrorResponse(`Course not found with Id of ${req.params.id}`, 404)
        )
    };

    res.status(200).json({success: true, data});
});

// @desc    Create course
// @route   POST /api/v1/bootcamps/:bootcampId/courses
// @access  Private
exports.createCourse = asyncHandler(async (req, res, next) => {
    req.body.bootcamp = req.params.bootcampId;

    const bootcamp = await Bootcamp.findById(req.params.bootcampId);

    if (!bootcamp) {
        return next(
            new ErrorResponse(`Bootcamp not found with id ${req.params.bootcampId}`, 404)
        )
    };

    const course = await Course.create(req.body);

    res.status(201).json({success: true, data: course});
});

// @desc    Update course
// @route   PUT /api/v1/courses/:id
// @access  Private
exports.updateCourse = asyncHandler(async (req, res, next) => {
    const data = await Course.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    if (!data) {
        return next(
            new ErrorResponse(`Course not found with id of ${req.params.id}`, 404)
        )
    };

    res.status(200).json({success: true, data})
});


// @desc    Delete course
// @route   DELETE /api/v1/course/:id
// @access  Private
exports.deleteCourse = asyncHandler(async (req, res, next) => {
    const data = await Course.findById(req.params.id);
    
    if (!data) {
        return next(
            new ErrorResponse(`Course not foud with id of ${req.params.id}`, 404)
        )
    };

    await data.deleteOne();

    res.status(200).json({success: true, data: { }});
});