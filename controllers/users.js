const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');
const User = require('../models/User');

// @desc    Get all users
// @route   GET /api/v1/users
// @access  Private(admin)
exports.getUsers = asyncHandler(async (req, res, next) => {
    res.status(200).send(res.advancedResults);
});

// @desc    Get single user
// @route   GET /api/v1/users/:id
// @access  Private(admin)
exports.getUser = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.params.id);

    if (!user) {
        return next(
            new ErrorResponse('User not found', 404)
        );
    };

    res.status(200).json({success: true, data: user});
});

// @desc    Create user
// @route   POST /api/v1/users
// @access  Private(admin)
exports.createUser = asyncHandler(async (req, res, next) => {
    const user = await User.create(req.body);

    res.status(200).json({success: true, data: user});
});


// @desc    Update a user
// @route   PUT /api/v1/users/:id
// @access  Private(admin)
exports.updateUser = asyncHandler(async (req, res, next) => {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    if (!user) {
        return next(
            new ErrorResponse('User not found', 404)
        );
    };

    res.status(200).json({success: true, data: user});
});


// @desc    Delete user
// @route   DELETE /api/v1/users/:id
// @access  Private(admin)
exports.deleteUser = asyncHandler(async (req, res, next) => {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
        return next(
            new ErrorResponse('User not found', 404)
        );
    };

    res.status(200).json({success: true, data: {}})
});

