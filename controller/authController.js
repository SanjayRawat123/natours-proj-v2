/* eslint-disable import/no-extraneous-dependencies */
const { promisify } = require('util')
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const sendEmail = require('../utils/email');


const signToken = id => jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
})


exports.signUp = catchAsync(async (req, res, next) => {
    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm,
        passwordChangedAt: req.body.passwordChangedAt
    });
    // eslint-disable-next-line no-unused-vars
    const token = signToken(newUser._id)
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

exports.protect = catchAsync(async (req, res, next) => {
    let token;
    // 1) Getting token and checking if it is there
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }
    console.log(token)
    if (!token) {
        return next(new AppError('You are not logged in ! Please login to get access.', 404))
    }
    // 2) verification token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    //3 ) check if user exists
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
        return next(
            new AppError(
                'The user belonging to this token does no longer exist.',
                401
            )
        );
    }
    //4) check if user changed password after jwt token was issued
    if (currentUser.changedPasswordAfter(decoded.iat)) {
        return next(
            new AppError('User recently changed password! Please log in again.', 401)
        );
    }
    // GRANT ACCESS TO PROTECTED ROUTE
    req.user = currentUser;
    next()
})


exports.restrictTo = (...roles) => (req, res, next) => {
    //roles ['admin','lead-guide'] . roles is just now user
    console.log(req.user.role);
    if (!roles.includes(req.user.role)) {
        return next(new AppError('You hove not permission to perform this action', 403))
    }
    next()
}

exports.forgotPassword = catchAsync(async (req, res, next) => {
    // 1) Get user based on POSTed email
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        return next(new AppError('There is no user with email address.', 404));
    }

    // 2) Generate the random reset token
    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    // 3) Send it to user's email
    const resetURL = `${req.protocol}://${req.get(
        'host'
    )}/api/v1/users/resetPassword/${resetToken}`;
    console.log(resetURL);
    const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\nIf you didn't forget your password, please ignore this email!`;

    try {
        console.log(user.email)
        await sendEmail({
            email: user.email,
            subject: 'Your password reset token (valid for 10 min)',
            message
        });

        res.status(200).json({
            status: 'success',
            message: 'Token sent to email!'
        });
    } catch (err) {
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save({ validateBeforeSave: false });

        return next(
            new AppError('There was an error sending the email. Try again later!'),
            500
        );
    }
});


exports.resetPassword = (req, res, next) => {

}