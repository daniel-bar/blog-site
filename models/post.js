const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    description: {
        type: String,
        minlength: 3,
        maxlength: 50,
        required: true,
    },
    text: {
        type: String,
        minlength: 3,
        maxlength: 1000,
        required: true,
    },
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
