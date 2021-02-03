const validator = require('validator');
const bcrypt = require('bcryptjs');

const User = require('../models/user');

const editProfile = async (req, res, next) => {
    // Check whether provided fields are valid
    if (
        req.body.currentPassword === '' ||
        !validator.isEmail(req.body.newEmail) ||
        (req.body.newPassword.length < 7 && req.body.newPassword !== '') ||
        req.body.newPassword.length > 24 ||
        req.body.newPassword !== req.body.newPasswordRepeat
    ) {
        return res.status(400).send({
            success: false,
            message: 'Invalid form fields',
        });
    }

    try {
        // Find the user
        const userByID = await User.findById(req.userID, { password: 1 });

        // Check whether provided current password is correct
        const compareResult = await bcrypt.compare(req.body.currentPassword, userByID.password);

        if (!compareResult) {
            return res.status(400).send({
                success: false,
                message: 'Edit profile failed - incorrect current password',
            });
        }

        // Update user email
        userByID.email = req.body.newEmail;

        // Check whether client wants to change the password
        if (req.body.newPassword !== '') {
            const hashedNewPassword = await bcrypt.hash(req.body.newPassword, 8);

            userByID.password = hashedNewPassword;
        }

        await userByID.save();

        return res.status(200).send({
            success: true,
            message: 'Successfully edited user details',
        });
    } catch {
        return res.status(500).send({
            success: false,
            message: 'Server error',
        });
    }
}

module.exports = {
    editProfile,
}