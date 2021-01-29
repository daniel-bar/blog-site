const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const Post = require('../models/post');

const handleLogin = async (req, res, next) => {
    try {
        // Find matching user by email address
        const userByEmail = await User.findOne({ email: req.body.email });

        // There is no such user with the provided email
        if (!userByEmail) {
            return res.status(400).send({
                success: false,
                message: 'Authentication failed',
            });
        }

        // Check whether the provided password is as same as the stored hashed one
        const compareResult = await bcrypt.compare(req.body.password, userByEmail.password);

        if (!compareResult) {
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

        userByEmail.tokens = [{ token: newToken }, ...userByEmail.tokens];

        res.status(200).send({
            success: true,
            message: 'Successfully authenticated',
            data: { token: newToken },
        });
    } catch {
        res.status(500).send({
            success: false,
            message: 'Server error',
        });
    }
}

const handleRegister = async (req, res, next) => {
    // Validate client provided password to be in the valid length
    if (req.body.password.length < 7 || req.body.password.length > 24) {
        return res.status(400).send({
            success: false,
            message: 'Please provide password of at-least 7 and at most 24 characters length',
        });
    }

    try {
        // Find a document with the provided email
        const userByEmail = await User.findOne({ email: req.body.email });

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
        const hashedPassword = await bcrypt.hash(req.body.password, 8);

        // Creating the user document
        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword,
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

const getUsername = async (req, res, next) => {
    try {
        const userByID = await User.findById(req.userID, { username: 1 });

        // Check for existence - If exists, fetch username
        if (userByID) {
            return res.status(200).send({
                success: true,
                message: 'Successfully fetched username',
                data: {
                    username: userByID.username
                }
            });
        }

        res.status(401).send({
            success: false,
            message: 'Unable to authenticate',
        });
    } catch {
        res.status(500).send({
            success: false,
            message: 'Server error',
        });
    }
}

const postBlog = async (req, res, next) => {
    // Validate client provided description and text to be in the valid length
    if (req.body.description.length < 3 || req.body.description.length > 50) {
        return res.status(400).send({
            success: false,
            message: 'Please provide description of at-least 3 and at most 50 characters length',
        });
    } else if (req.body.text.length < 3 || req.body.text.length > 1000) {
        return res.status(400).send({
            success: false,
            message: 'Please provide text of at-least 3 and at most 1000 characters length',
        });
    }

    try {
        // Find a document with the provided text
        const postByText = await Post.findOne({ text: req.body.text });

        // Check for existence - If exists, user cannot post with the provided text
        if (postByText) {
            return res.status(400).send({
                success: false,
                message: 'Posting failed - provided post is already exist'
            });
        }

        // Creating the post
        const newPost = new Post({
            description: req.body.description,
            text: req.body.text,
        });

        console.log(newPost)

        // Saving the post in DB
        await newPost.save();

        res.status(201).send({
            success: true,
            message: 'Successfully created a new post',
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
    getUsername,
    postBlog,
}