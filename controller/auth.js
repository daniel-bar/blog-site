const User = require('../models/user');

const handleLogin = (req, res) => {
    try {
        // mongoose function - 
        // const user = User.findByCredentials(req.body.email, req.body.password);

        const user = {
            email: req.body.email,
            password: req.body.password
        }
        res.status(200).send(user);

        // testing
        console.log(user);
    } catch (e) {
        res.status(400).send();
        console.log(e);
    }
}

const handleRegister = (req, res) => {
    res.status(200).send(req.body);
}


module.exports = {
    handleLogin,
    handleRegister,
}