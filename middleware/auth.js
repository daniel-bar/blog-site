const jwt = require('jsonwebtoken');

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');

        const userData = jwt.verify(token, process.env.JWT_PWD);

        req.userID = userData.id;

        next();
    } catch {
        return res.status(401).send({
            success: false,
            message: 'Unable to authenticate',
        });
    }
};

module.exports = auth;