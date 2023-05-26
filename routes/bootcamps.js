const express = require('express');
const router = express.Router();
const Bootcamp = require('../models/Bootcamp');
const { getBootcamps, getBootcamp, createBootcamp, uploadBootcampImage,
     updateBootcamp, deleteBootcamp, getBootcampsInRadius} = require('../controllers/bootcamps')

const { protect, authorize } = require('../middleware/auth');
const advancedResults = require('../middleware/advancedResults');

// Include other resource router
const courseRouter = require('./courses');
const reviewRouter = require('./reviews');

// Re-route into other resource router
router.use('/:bootcampId/courses', courseRouter);
router.use('/:bootcampId/reviews', reviewRouter);

router.route('/')
     .get(advancedResults(Bootcamp, 'courses'), getBootcamps)
     .post(protect, authorize('publisher', 'admin'), createBootcamp);

router.route('/radius/:zipcode/:distance').get(getBootcampsInRadius);

router.route('/:id')
     .get(getBootcamp)
     .put(protect, authorize('publisher', 'admin'), updateBootcamp)
     .delete(protect, authorize('publisher', 'admin'), deleteBootcamp);
     
router.route('/:id/photo').put(protect, authorize('publisher', 'admin'), uploadBootcampImage);

module.exports = router;


