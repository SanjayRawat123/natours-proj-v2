/* eslint-disable import/no-extraneous-dependencies */

const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/appError')



const signToken = id => jwt.sign({id}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    })


exports.signUp = catchAsync(async (req, res, next) => {
    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm
    });
    // eslint-disable-next-line no-unused-vars
    const token =signToken(newUser._id)
    res.status(201).json({
        status: 'success',
        token,
        data: {
            user: newUser
        }
    });

});

exports.login = catchAsync(async (req, res, next) => {

    const { email, password, } = req.body;

    // 1) check if email and password exist
    if (!email || !password) {
        return next(new AppError('please provide email and password!', 400));
    }
    // 2) check if password correct 
    const user = await User.findOne({ email }).select('+password')
    if (!user || !(await user.correctPassword(password, user.password))) {
        return next(new AppError('Incorrect email or password', 401));
    }
    // 3) if everthing in ok ,send token to client
    const token = signToken(user._id)

    res.status(200).json({
        status: "success",
        token
    })
});

exports.protect = catchAsync(async(req,res,next)=>{
     // 1) Getting token and checking if it is there
     

     // 2) verification token


     //3 ) check if user exists


     //4) check if user changed password after jwt token was issued
     
     
     next()
})