const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    content: {
        type: String,
        minlength: 3,
        maxlength: 1000,
        required: true,
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
}, {
    timestamps: true,
});

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        minlength: 3,
        maxlength: 50,
        required: true,
    },
    content: {
        type: String,
        minlength: 3,
        maxlength: 1000,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    comments: {
        type: [commentSchema],
        default: [],
    },
}, {
    timestamps: true,
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;