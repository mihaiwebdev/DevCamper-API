const ErrorResponse = require("../utils/errorResponse");

const errorHandler = (err, req, res, next) => {
    console.log(err.stack.red);

    let error = { ...err };
    error.message = err.message;

    // Mongoose bad ObjectID
    if (err.name === 'CastError') {
        const message = `Resource not found`
        error = new ErrorResponse(message, 404);
    }

    // Mongoose duplicate key
    if (err.code === 11000) {
        const message = 'Duplicate field value entered'
        error = new ErrorResponse(message, 400);
    }

    // Mongoose validaton error
    if (err.name === 'ValidationError'){
        const message = Object.values(err.errors).map(item => item.message);
        error = new ErrorResponse(message, 400);
    }

    res.status(error.statusCode || 500).json({
        success: false, error: error.message || 'Server Error'
    });

}

module.exports = errorHandler;