const express = require('express');
const router = express.Router();
const { getBootcamps, getBootcamp, createBootcamp,
     updateBootcamp, deleteBootcamp, getBootcampsInRadius} = require('../controllers/bootcamps')

// Include other resource router
const courseRouter = require('./courses');

// Re-route into other resource router
router.use('/:bootcampId/courses', courseRouter);

router.route('/').get(getBootcamps).post(createBootcamp);
router.route('/radius/:zipcode/:distance').get(getBootcampsInRadius);
router.route('/:id').get(getBootcamp).put(updateBootcamp).delete(deleteBootcamp);

module.exports = router;


