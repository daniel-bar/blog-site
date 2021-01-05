const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true,
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        unique: true,
        maxlength: 320,
        required: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid');
            }
        },
    },
    password: {
        type: String,
        minlength: 7,
        maxlength: 24,
        required: true,
    },
    tokens: {
        type: [{
            token: { type: String },
        }],
        default: [],
    },
});

const User = mongoose.model('User', userSchema);

module.exports = User;