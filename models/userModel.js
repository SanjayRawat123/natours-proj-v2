const mongoose = require('mongoose');
const validator = require('validator');
// eslint-disable-next-line import/no-extraneous-dependencies
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please tell us your name!']
        },
        email: {
            type: String,
            required: [true, 'Please provide use email!'],
            unique: true,
            lowercase: true,
            validate: [validator.isEmail, 'Please provide a valid email!']
        },
        photo: {
            type: String
        },
        password: {
            type: String,
            required: [true, 'Please provide a password'],
            minlenfth: 8,
            select: false
        },
        passwordConfirm: {
            type: String,
            required: [true, 'Please confirm your  password'],
            minlenfth: 8,
            validate: {
                // This only works on CREATE and SAVE!!!
                validator: function (el) {
                    return el === this.password;
                },
                message: 'Passwords are not the same!'
            }
        }
    });
// npm i bcryptjs this package for password bcryptjs

userSchema.pre('save', async function (next) {
    // Only run this function if password was actually modified
    if (!this.isModified('password')) return next();

    // Hash the password with cost of 12
    this.password = await bcrypt.hash(this.password, 12);

    // Delete passwordConfirm field
    this.passwordConfirm = undefined;
    next();
});


const User = mongoose.model('User', userSchema);

module.exports = User;