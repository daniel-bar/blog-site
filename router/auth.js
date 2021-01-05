const express = require('express');

const {
    handleLogin,
    handleRegister,
} = require('../controller/auth');

const router = express.Router();

router.post('/handleLogin', handleLogin);
router.post('/handleRegister', handleRegister);

module.exports = router;