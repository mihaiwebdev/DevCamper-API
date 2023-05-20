// @desc    Get all bootcamps
// @route   GET /api/v1/bootcamps
// @access   Public
exports.getBootcamps = (req, res, next) => {
    
    res.send('get bootcamps');
};

// @desc    Get single bootcamp
// @route   GET /api/v1/bootcamps/:id
// @access  Public
exports.getBootcamp = (req, res, next) => {
    res.send('get single bootcamp');
};

// @desc    Create bootcamp
// @route   POST /api/v1/bootcamps
// @access  Private
exports.createBootcamp = (req, res, next) => {
    res.send('create bootcamp');
};

// @desc    Update bootcamp
// @route   PUT /api/v1/bootcamps/:id
// @access  Private
exports.updateBootcamp = (req, res, next) => {
    res.send('uppdate bootcamp');
};

// @desc    Delete bootcamp
// @route   DELETE /api/v1/bootcamps:/id
// @access  Private
exports.deleteBootcamp = (req, res, next) => {
    res.send('delete bootcamp');
};