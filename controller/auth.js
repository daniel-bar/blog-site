const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

const handleLogin = async (req, res, next) => {
    try {
        // Find matching user by email address
        const userByEmail = await User.findOne({ email: req.body.email });

        // Authentication failed when either there is no user found with the provided email,
        // Or the client provided mismatching password
        if (!userByEmail || !bcrypt.compareSync(userByEmail.password, req.body.password)) {
            return res.status(400).send({
                success: false,
                message: 'Authentication failed',
            });
        }

        // Create new token to insert
        const newToken = jwt.sign({ id: userByEmail.id }, process.env.JWT_PWD, { expiresIn: '7 days' });

        if (userByEmail.tokens.length === 5) {
            userByEmail.tokens.pop();
        }

        userByEmail.tokens = [newToken, ...userByEmail.tokens];

        res.status(200).send({
            success: true,
            message: 'Successfully authenticated',
            data: { token: newToken },
        });
    } catch (e) {
        console.log(e)
        res.status(500).send({
            success: false,
            message: 'Server error',
        });
    }
}

const handleRegister = async (req, res, next) => {
    // Validate client provided password to be in the valid length
    if (res.body.password.length < 7 || req.body.password.length > 24) {
        return res.status(400).send({
            success: false,
            message: 'Please provide password of at-least 7 and at most 24 characters length',
        });
    }

    try {
        // Find a document with the provided email
        const userByEmail = await User.findOne({ email: req.body.Email });

        // Check for existence - If exists, user cannot register with the provided email
        if (userByEmail) {
            return res.status(400).send({
                success: false,
                message: 'Registration failed - provided email is already exist'
            });
        }

        // Find a document with the provided username
        const userByUsername = await User.findOne({ username: req.body.username });

        // Check for existence - If exists, user cannot register with the provided username
        if (userByUsername) {
            return res.status(400).send({
                success: false,
                message: 'Registration failed - provided username is already exist'
            });
        }

        // From now on, the client is allowed to register

        // Creating the user document
        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password, 8),
        });
        const newToken = jwt.sign({ id: newUser.id }, process.env.JWT_PWD, { expiresIn: '7 days' });

        // Insert to client`s token
        newUser.tokens = [{ token: newToken }];

        // Saving the user document in DB
        await newUser.save();

        res.status(201).send({
            success: true,
            message: 'Successfully created a new user',
            data: { token: newToken },
        });
    } catch {
        res.status(500).send({
            success: false,
            message: 'Server error',
        });
    }
}

module.exports = {
    handleLogin,
    handleRegister,
}