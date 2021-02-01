const express = require('express');

const {
    postBlog,
} = require('../controller/blog');

const {
    bodyKeys,
} = require('../middleware/security');
const auth = require('../middleware/auth');

const router = express.Router();

router.post(
    '/postBlog',
    auth,
    bodyKeys([
        { key: 'title', type: 'string' },
        { key: 'content', type: 'string' },
    ]),
    postBlog,
);

module.exports = router;