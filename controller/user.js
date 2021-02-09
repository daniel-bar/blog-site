const validator = require('validator');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

const User = require('../models/user');

const editProfile = async (req, res, next) => {
    // Check whether provided fields are valid
    if (
        req.body.currentPassword === '' ||
        !validator.isEmail(req.body.newEmail) ||
        (req.body.newPassword.length < 7 && req.body.newPassword !== '') ||
        req.body.newPassword.length > 24 ||
        req.body.newPassword !== req.body.newPasswordRepeat
    ) {
        return res.status(400).send({
            success: false,
            message: 'Invalid form fields',
        });
    }

    try {
        // Find the user
        const userByID = await User.findById(req.userID, { password: 1 });

        // Check whether provided current password is correct
        const compareResult = await bcrypt.compare(req.body.currentPassword, userByID.password);

        if (!compareResult) {
            return res.status(400).send({
                success: false,
                message: 'Edit profile failed - incorrect current password',
            });
        }

        // Update user email
        userByID.email = req.body.newEmail;

        // Check whether client wants to change the password
        if (req.body.newPassword !== '') {
            const hashedNewPassword = await bcrypt.hash(req.body.newPassword, 8);

            userByID.password = hashedNewPassword;
        }

        await userByID.save();

        return res.status(200).send({
            success: true,
            message: 'Successfully edited user details',
        });
    } catch {
        return res.status(500).send({
            success: false,
            message: 'Server error',
        });
    }
};

const getUserDetails = async (req, res, next) => {
    try {
        const details = await User.aggregate([
            {
                $match: { _id: mongoose.Types.ObjectId(req.query.id) },
            },
            {
                $limit: 1,
            },
            {
                $lookup: {
                    from: 'posts',
                    foreignField: 'owner',
                    localField: '_id',
                    as: 'posts',
                },
            },
            {
                $lookup: {
                    from: 'posts',
                    foreignField: 'comments.owner',
                    localField: '_id',
                    as: 'comments',
                },
            },
            {
                $project: {
                    username: 1,
                    email: 1,
                    postsCounter: { $size: '$posts' },
                    commentsCounter: { $size: '$comments' },
                    'posts._id': 1,
                    'posts.title': 1,
                    'posts.content': 1,
                    'posts.category': 1,
                    'posts.createdAt': 1,
                },
            },
            {
                $unwind: {
                    path: '$posts',
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $sort: { 'posts.createdAt': -1 },
            },
            {
                $group: {
                    _id: '$_id',
                    username: { $first: '$username' },
                    email: { $first: '$email' },
                    postsCounter: { $first: '$postsCounter' },
                    commentsCounter: { $first: '$commentsCounter' },
                    posts: { $push: '$posts' },
                },
            },
            {
                $unset: ['_id', 'posts.createdAt'],
            },
        ]);

        return res.status(200).send({
            success: true,
            message: 'Successfully retrieved user details',
            data: { ...details[0] },
        })
    } catch {
        return res.status(500).send({
            success: false,
            message: 'Server error',
        });
    }
};

module.exports = {
    editProfile,
    getUserDetails,
}