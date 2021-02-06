const express = require('express');

const {
    contact,
} = require('../controller/contact');

const {
    bodyKeys,
} = require('../middleware/security');
const auth = require('../middleware/auth');

const router = express.Router();

router.post(
    '/',
    auth,
    bodyKeys([{ key: 'message', type: 'string' }]),
    contact,
);

module.exports = router;