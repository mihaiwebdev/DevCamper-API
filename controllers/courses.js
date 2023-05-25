const asyncHandler = require('../middleware/async');
const Course = require('../models/Course');
const Bootcamp = require('../models/Bootcamp');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get all courses
// @route   GET /api/v1/courses
// @route   GET /api/v1/bootcamps/:bootcampId/courses
// @access  Public
exports.getCourses = asyncHandler(async (req, res, next) => {
    if (req.params.bootcampId) {
        const query = await Course.find({ bootcamp: req.params.bootcampId });

        return res.stauts(200).json({ success: true, count: query.length, data: query});

    } else {
        res.status(200).json(res.advancedResults);
    };
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
    req.body.user = req.user.id;

    const bootcamp = await Bootcamp.findById(req.params.bootcampId);

    if (!bootcamp) {
        return next(
            new ErrorResponse(`Bootcamp not found with id ${req.params.bootcampId}`, 404)
        )
    };

    if (bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(
            new ErrorResponse('Not authorized to add a course', 401)
        );
    };

    const course = await Course.create(req.body);

    res.status(201).json({success: true, data: course});
});

// @desc    Update course
// @route   PUT /api/v1/courses/:id
// @access  Private
exports.updateCourse = asyncHandler(async (req, res, next) => {
    const course = await Course.findOne({ user: req.user.id });
    
    if (!course) {
        return next(
            new ErrorResponse(`Course not found with id of ${req.params.id}`, 404)
        )
    };

    if (course.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(
            new ErrorResponse('Not authorized to update the course', 401)
        );
    };

    const data = await Course.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    res.status(200).json({success: true, data})
});


// @desc    Delete course
// @route   DELETE /api/v1/course/:id
// @access  Private
exports.deleteCourse = asyncHandler(async (req, res, next) => {
    const course = await Course.findById(req.params.id);
    
    if (!course) {
        return next(
            new ErrorResponse(`Course not foud with id of ${req.params.id}`, 404)
        )
    };

    if (course.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(
            new ErrorResponse('Not authorized to delete the course', 401)
        );
    };

    await course.deleteOne();

    res.status(200).json({success: true, data: { }});
});