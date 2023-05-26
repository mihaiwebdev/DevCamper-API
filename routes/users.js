const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { getUsers, getUser, createUser, updateUser,
        deleteUser } = require('../controllers/users');

const advancedResults = require('../middleware/advancedResults')
const { authorize, protect } = require('../middleware/auth')

router.use(protect);
router.use(authorize('admin'));

router.route('/')
    .get(advancedResults(User), getUsers)
    .post(createUser);
    
router.route('/:id')
    .get(getUser)
    .put(updateUser)
    .delete(deleteUser);

module.exports = router;