const fs = require('fs/promises');
const path = require('path');

const mongoose = require('mongoose');

const Post = require('../models/post');

const postBlog = async (req, res, next) => {
    // Validate client provided title and content of valid length
    if (req.body.title.length < 3 || req.body.title.length > 50) {
        return res.status(400).send({
            success: false,
            message: 'Please provide title of at-least 3 and at most 50 characters length',
        });
    } else if (req.body.content.length < 3 || req.body.content.length > 1000) {
        return res.status(400).send({
            success: false,
            message: 'Please provide content of at-least 3 and at most 1000 characters length',
        });
    }

    const categoriesFilePath = path.join(__dirname, '../data/categories.json');

    try {
        // Check whether category is valid
        const categoriesFileData = await fs.readFile(categoriesFilePath, 'utf-8');
        const categoriesJSON = JSON.parse(categoriesFileData);

        if (!(categoriesJSON.includes(req.body.category))) {
            return res.status(400).send({
                success: false,
                message: 'Invalid category was provided',
            });
        }

        // Find a document with the provided content
        const postByContent = await Post.findOne({ content: req.body.content }, { _id: 1 });

        // Check for existence - If exists, user cannot post with the provided text
        if (postByContent) {
            return res.status(400).send({
                success: false,
                message: 'Posting failed - provided post is already exist'
            });
        }

        // Creating the post
        const newPost = new Post({
            title: req.body.title,
            content: req.body.content,
            category: req.body.category,
            owner: req.userID,
        });

        // Saving the post in DB
        await newPost.save();

        return res.status(201).send({
            success: true,
            message: 'Successfully created a new post',
        });
    } catch {
        return res.status(500).send({
            success: false,
            message: 'Server error',
        });
    }
}

const getCategories = async (req, res, next) => {
    const categoriesFilePath = path.join(__dirname, '../data/categories.json');

    try {
        const categoriesFileData = await fs.readFile(categoriesFilePath, 'utf-8');
        const categoriesJSON = JSON.parse(categoriesFileData);

        return res.status(200).send({
            success: true,
            message: 'Successfully retrieved categories',
            data: {
                categories: categoriesJSON,
            },
        });
    } catch {
        return res.status(500).send({
            success: false,
            message: 'Server error',
        });
    }
}

const getCategoryPosts = async (req, res, next) => {
    try {
        const posts = await Post.aggregate([
            {
                $match: { category: req.query.category }
            },
            {
                $sort: { createdAt: -1 },
            },
            {
                $lookup: {
                    from: 'users',
                    foreignField: '_id',
                    localField: 'owner',
                    as: 'ownerData',
                },
            },
            {
                $project: {
                    title: 1,
                    content: 1,
                    ownerID: { $arrayElemAt: ['$ownerData._id', 0] },
                    ownerUsername: { $arrayElemAt: ['$ownerData.username', 0] },
                },
            },
        ]);

        return res.status(200).send({
            success: true,
            message: 'Successfully retrieved category',
            data: {
                posts,
            },
        });
    } catch {
        return res.status(500).send({
            success: false,
            message: 'Server error',
        });
    }
}

const getPosts = async (req, res, next) => {
    try {
        const posts = await Post.aggregate([
            {
                $sort: { createdAt: -1 },
            },
            {
                $lookup: {
                    from: 'users',
                    foreignField: '_id',
                    localField: 'owner',
                    as: 'ownerData',
                },
            },
            {
                $project: {
                    title: 1,
                    content: 1,
                    category: 1,
                    ownerID: { $arrayElemAt: ['$ownerData._id', 0] },
                    ownerUsername: { $arrayElemAt: ['$ownerData.username', 0] },
                },
            },
        ]);

        return res.status(200).send({
            success: true,
            message: 'Successfully retrieved posts',
            data: {
                posts,
            },
        });
    } catch {
        return res.status(500).send({
            success: false,
            message: 'Server error',
        });
    }
}

const getPost = async (req, res, next) => {
    try {
        const post = await Post.aggregate([
            {
                $match: { _id: mongoose.Types.ObjectId(req.query.postID) },
            },
            {
                $limit: 1,
            },
            {
                $lookup: {
                    from: 'users',
                    foreignField: '_id',
                    localField: 'owner',
                    as: 'postOwnerData',
                },
            },
            {
                $unwind: {
                    path: '$comments',
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $sort: { 'comments.createdAt': 1 },
            },
            {
                $lookup: {
                    from: 'users',
                    foreignField: '_id',
                    localField: 'comments.owner',
                    as: 'commentOwnerData',
                },
            },
            {
                $project: {
                    title: 1,
                    content: 1,
                    category: 1,
                    'comment.content': '$comments.content',
                    'comment.username': { $arrayElemAt: ["$commentOwnerData.username", 0] },
                    ownerUsername: { $arrayElemAt: ["$postOwnerData.username", 0] },
                },
            },
            {
                $group: {
                    _id: '$_id',
                    title: { $first: '$title' },
                    content: { $first: '$content' },
                    category: { $first: '$category' },
                    comments: { $push: '$comment' },
                    ownerUsername: { $first: '$ownerUsername' },
                },
            },
            {
                $unset: ['_id'],
            },
        ]);

        if (post.length !== 1) {
            return res.status(400).send({
                success: false,
                message: 'Unexpected error',
            });
        }

        if (JSON.stringify(post[0].comments) === JSON.stringify([{}])) {
            post[0].comments = [];
        }

        return res.status(200).send({
            success: true,
            message: 'Successfully retrieved post',
            data: {
                post: post[0],
            },
        });
    } catch {
        return res.status(500).send({
            success: false,
            message: 'Server error',
        });
    }
}

const postComment = async (req, res, next) => {
    // Validate client provided content of valid length
    if (req.body.content.length < 3 || req.body.content.length > 1000) {
        return res.status(400).send({
            success: false,
            message: 'Please provide content of at-least 3 and at most 1000 characters length',
        });
    }

    try {
        // Check whether the post exists
        const postToComment = await Post.findById(req.body.postID);

        if (!postToComment) {
            return res.status(400).send({
                success: false,
                message: 'Failed to post comment - post does not exist',
            });
        }

        postToComment.comments = [
            ...postToComment.comments,
            {
                content: req.body.content,
                owner: req.userID,
            }
        ];

        // Saving the comment in DB
        await postToComment.save();

        return res.status(201).send({
            success: true,
            message: 'Successfully created a new comment',
        });
    } catch {
        return res.status(500).send({
            success: false,
            message: 'Server error',
        });
    }
}

const getHotPosts = async (req, res, next) => {
    try {
        const posts = await Post.aggregate([
            {
                $lookup: {
                    from: 'users',
                    foreignField: '_id',
                    localField: 'owner',
                    as: 'ownerData',
                },
            },
            {
                $project: {
                    title: 1,
                    content: 1,
                    category: 1,
                    ownerID: { $arrayElemAt: ['$ownerData._id', 0] },
                    ownerUsername: { $arrayElemAt: ['$ownerData.username', 0] },
                    commentCount: { $size: '$comments' },
                    createdAt: 1,
                }
            },
            {
                $sort: {
                    commentCount: -1,
                    createdAt: -1,
                },
            },
            {
                $unset: ['commentCount'],
            },
        ]);

        return res.status(200).send({
            success: true,
            message: 'Successfully retrieved posts',
            data: {
                posts,
            },
        });
    } catch {
        return res.status(500).send({
            success: false,
            message: 'Server error',
        });
    }
}

module.exports = {
    postBlog,
    getCategories,
    getPosts,
    getPost,
    postComment,
    getCategoryPosts,
    getHotPosts,
}