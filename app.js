const path = require('path');

const express = require('express');

const authRouter = require('./router/auth');

require('./db/mongoose');

const app = express();

app.use((req, res, next) => {
    !process.env.HTTP_ACCESS_IP || res.setHeader('Access-Control-Allow-Origin', process.env.HTTP_ACCESS_IP);
    res.setHeader(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
    res.setHeader(
        'Access-Control-Allow-Methods',
        'GET, POST, PATCH, PUT, DELETE, OPTIONS',
    );
    next();
});

const publicDirectoryPath = path.join(__dirname, 'public');
app.use(express.static(publicDirectoryPath));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRouter);

module.exports = app;