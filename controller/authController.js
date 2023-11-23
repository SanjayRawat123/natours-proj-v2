/* eslint-disable import/no-extraneous-dependencies */

const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/appError')

exports.signUp = catchAsync(async (req, res, next) => {
    const newUser = await User.create({
        name:req.body.name,
        email:req.body.email,
        password:req.body.password,
        passwordConfirm:req.body.passwordConfirm
    });
    // eslint-disable-next-line no-unused-vars
    const token = jwt.sign({id:newUser._id},process.env.JWT_SECRET,{
        expiresIn:process.env.JWT_EXPIRES_IN
    })
    res.status(201).json({
        status: 'success',
        token,
         data:{
            user:newUser
         }
    });

});

exports.login = (req,res,next)=>{
  
    const {email,password,} = req.body;

    // 1) check if email and password exist
       if(!email || !password){
        return next(new AppError('please provide email and password!',400)); 
       }
    // 2) check if password correct 
    const user = User.findOne({email})

    // 3) if everthing in ok ,send token to client
     res.status(200).json({
        status:"success",
         token:""
     })
}