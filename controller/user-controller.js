const User = require('../models/userModel');
// const APIFeatures = require("../utils/apiFeatures");
// const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync')

exports.getAllUsers = catchAsync(async(req, res,next) => {
    const users = await User.find();


    res.status(200).json({
        status: 'success',
        results:users.length,
       data:{
        users
       }
    });
});
exports.getUser = (req, res) => {

    res.status(500).json({
        status: 'error',
        message: 'this route is not implemented'
    });
};
exports.createUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'this route is not implemented'
    });
};

exports.UpdateUser = (req, res) => {

    res.status(500).json({
        status: 'error',
        message: 'this route is not implemented'
    });
};
exports.deleteUser = (req, res) => {

    res.status(500).json({
        status: 'error',
        message: 'this route is not implemented'
    });
};
