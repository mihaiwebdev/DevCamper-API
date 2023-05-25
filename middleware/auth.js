const asyncHandler = require('./async');
const ErrorResponse = require('../utils/errorResponse');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.protect = asyncHandler(async (req, res, next) =>{
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];

    } 
    // else if (req.cookies.token) {
    //     token = req.cookies.token
    // }

    if (!token) {
        return next(
            new ErrorResponse('Not authorized to access this route', 401)
        );
    };
    
    try {
        const decoded = jwt.decode(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id);
        next();

    } catch (error) {
        return next(
            new ErrorResponse('Not authorized to access this route', 401)
        );
    };
})

// Grant access to specific roles
exports.authorize = (...roles) => (req, res, next) => {
    if (!roles.includes(req.user.role)) {
        return next(
            new ErrorResponse(`User role ${req.user.role} is not authorized to access this route`, 403)
        );
    };

    next();
}