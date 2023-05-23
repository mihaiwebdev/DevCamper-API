const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');
const User = require('../models/User');

// @desc    Register user
// @route   POST /api/v1/auth/register
// @access  Public
exports.register = asyncHandler(async (req, res, next) => {
    const { email, name, password, role } = req.body;

    const user = await User.create({
        email,
        name,
        password,
        role
    });

    const token = user.getSignedJwtToken();

    res.status(201).json({ success: true, token });
});