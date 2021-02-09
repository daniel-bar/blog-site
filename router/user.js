const express = require('express');

const {
    editProfile,
    getUserDetails,
} = require('../controller/user');

const {
    bodyKeys,
    queryKeys,
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

router.get(
    '/getUserDetails',
    queryKeys([{ key: 'id', type: 'string' }]),
    getUserDetails,
);

module.exports = router;