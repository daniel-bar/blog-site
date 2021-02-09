const express = require('express');

const {
    postBlog,
    getCategories,
    getCategoryPosts,
    getPosts,
    getPost,
    postComment,
    getHotPosts,
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
    '/getCategoryPosts',
    queryKeys([{ key: 'category', type: 'string' }]),
    getCategoryPosts,
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

router.get(
    '/getHotPosts',
    getHotPosts,
);

module.exports = router;