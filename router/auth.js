const express = require('express');

const {
    handleLogin,
    handleRegister,
} = require('../controller/auth');
const {
    bodyKeys,
} = require('../middleware/security');

const router = express.Router();

router.post(
    '/handleLogin',
    bodyKeys([
        { key: 'email', type: 'string' },
        { key: 'password', type: 'string' },
    ]),
    handleLogin,
);

router.post(
    '/handleRegister',
    bodyKeys([
        { key: 'username', type: 'string' },
        { key: 'email', type: 'string' },
        { key: 'password', type: 'string' },
    ]),
    handleRegister,
);

module.exports = router;