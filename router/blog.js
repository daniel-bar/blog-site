const express = require('express');

const {
    postBlog,
    getCategories,
    getPosts,
    getPost,
    postComment,
} = require('../controller/blog');

const {
    bodyKeys,
    queryKeys,
} = require('../middleware/security');
const auth = require('../middleware/auth');

const router = express.Router();

router.post(
    '/postBlog',
    auth,
    bodyKeys([
        { key: 'title', type: 'string' },
        { key: 'content', type: 'string' },
        { key: 'category', type: 'string' },
    ]),
    postBlog,
);

router.get(
    '/getCategories',
    getCategories,
);

router.get(
    '/getPosts',
    getPosts,
);

router.get(
    '/getPost',
    queryKeys([{ key: 'postID', type: 'string' }]),
    getPost,
);

router.post(
    '/postComment',
    auth,
    bodyKeys([
        { key: 'postID', type: 'string' },
        { key: 'content', type: 'string' },
    ]),
    postComment,
);

module.exports = router;