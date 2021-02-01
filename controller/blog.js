const Post = require('../models/post');

const postBlog = async (req, res, next) => {
    // Validate client provided description and text to be of valid length
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

    try {
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

module.exports = {
    postBlog,
}