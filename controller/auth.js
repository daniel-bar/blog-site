const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { findOne } = require('../models/user');

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
    } catch {
        res.status(500).send({
            success: false,
            message: 'Server error',
        });
    }
}

const handleRegister = (req, res) => {
    res.status(200).send(req.body);
}


module.exports = {
    handleLogin,
    handleRegister,
}