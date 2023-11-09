const express = require('express');

const userController = require('./../controller/user-controller')

const router = express.Router();

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