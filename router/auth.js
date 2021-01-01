const express = require('express');

const {
    handleLogin,
} = require('../controller/auth');

const router = express.Router();

router.post('/handleLogin', handleLogin);

module.exports = router;