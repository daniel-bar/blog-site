const express = require('express');

const {
    editProfile,
} = require('../controller/user');

const {
    bodyKeys,
} = require('../middleware/security');
const auth = require('../middleware/auth');

const router = express.Router();

router.patch(
    '/editProfile',
    auth,
    bodyKeys([
        { key: 'currentPassword', type: 'string' },
        { key: 'newEmail', type: 'string' },
        { key: 'newPassword', type: 'string' },
        { key: 'newPasswordRepeat', type: 'string' },
    ]),
    editProfile,
);

module.exports = router;