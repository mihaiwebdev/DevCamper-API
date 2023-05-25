const express = require('express');
const router = express.Router();
const { getBootcamps, getBootcamp, createBootcamp, uploadBootcampImage,
     updateBootcamp, deleteBootcamp, getBootcampsInRadius} = require('../controllers/bootcamps')

const { protect, authorize } = require('../middleware/auth');
const Bootcamp = require('../models/Bootcamp');
const advancedResults = require('../middleware/advancedResults');

// Include other resource router
const courseRouter = require('./courses');

// Re-route into other resource router
router.use('/:bootcampId/courses', courseRouter);

router.route('/').get(advancedResults(Bootcamp, 'courses'), getBootcamps).post(protect, authorize('publisher', 'admin'), createBootcamp);
router.route('/radius/:zipcode/:distance').get(getBootcampsInRadius);
router.route('/:id').get(getBootcamp).put(protect, authorize('publisher', 'admin'), updateBootcamp).delete(protect, authorize('publisher', 'admin'), deleteBootcamp);
router.route('/:id/photo').put(protect, authorize('publisher', 'admin'), uploadBootcampImage);

module.exports = router;


