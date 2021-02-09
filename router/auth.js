const express = require('express');

const {
    handleLogin,
    handleRegister,
    getUsername,
    getSelfDetails,
} = require('../controller/auth');

const { bodyKeys } = require('../middleware/security');
const auth = require('../middleware/auth');

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

router.get(
    '/getUsername',
    auth,
    getUsername,
);

router.get(
    '/getSelfDetails',
    auth,
    getSelfDetails,
);

module.exports = router;