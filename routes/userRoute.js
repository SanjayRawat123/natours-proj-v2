const express = require('express');

const userController = require('../controller/user-controller');
const authController = require('../controller/authController');

const router = express.Router();

router
    .route('/signup')
    .post(authController.signUp);
    router.post('/login',authController.login);

router
    .route('/')
    .get(userController.getAllUsers)
    .post(userController.createUser);
router
    .route('/:id')
    .get(userController.getUser)
    .put(userController.UpdateUser)
    .delete(userController.deleteUser);

module.exports = router;