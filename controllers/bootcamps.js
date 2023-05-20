const Bootcamp = require('../models/Bootcamp');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get all bootcamps
// @route   GET /api/v1/bootcamps
// @access   Public
exports.getBootcamps = async (req, res, next) => {
    try {
        const data = await Bootcamp.find();

        res.status(200).json({success: true, count: data.length, data});

    } catch (error) {
        res.status(500).json({success: false})
    }
    
};

// @desc    Get single bootcamp
// @route   GET /api/v1/bootcamps/:id
// @access  Public
exports.getBootcamp = async (req, res, next) => {
    try {
        const data = await Bootcamp.findById(req.params.id);

        if (!data) {
            return next(
                new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
            );            
        };

        res.status(200).json({success: true, data});

    } catch (error) {
        next(error);
    }
};

// @desc    Create bootcamp
// @route   POST /api/v1/bootcamps
// @access  Private
exports.createBootcamp = async (req, res, next) => {
    try {
        const data = await Bootcamp.create(req.body);

        res.status(201).json({success: true, data})
    } catch (error) {
        res.status(400).json({success: false, error: error})
    }
};

// @desc    Update bootcamp
// @route   PUT /api/v1/bootcamps/:id
// @access  Private
exports.updateBootcamp = async (req, res, next) => {
    try {
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

    } catch (error) {
        res.status(500).json({success: false})
    }
};

// @desc    Delete bootcamp
// @route   DELETE /api/v1/bootcamps:/id
// @access  Private
exports.deleteBootcamp = async (req, res, next) => {
    try {
        const data = await Bootcamp.findByIdAndDelete(req.params.id)

        if (!data) {
            return next(
                new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
            );  
        };

        res.status(200).json({success: true, data: {}});

    } catch (error) {
        res.status(500).json({success: false})
    }
};