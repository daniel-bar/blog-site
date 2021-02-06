const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        trim: true,
        minlength: 3,
        maxlength: 30,
        unique: true,
        required: true,
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        unique: true,
        maxlength: 320,
        unique: true,
        required: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid');
            }
        },
    },
    password: {
        type: String,
        required: true,
    },
    tokens: {
        type: [{
            token: { type: String },
        }],
        default: [],
    },
}, {
    timestamps: true,
});

const User = mongoose.model('User', userSchema);

module.exports = User;