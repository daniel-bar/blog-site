const nodemailer = require('nodemailer');

const contact = async (req, res, next) => {
    // Validate client provided message of valid length
    if (req.body.message.length < 3 || req.body.message.length > 1000) {
        return res.status(400).send({
            success: false,
            message: 'Please provide message of at-least 3 and at most 1000 characters length',
        });
    }

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'mhfchelloworld@gmail.com',
            pass: '1379Daniel1379',
        },
    });

    try {
        await transporter.sendMail({
            from: 'mhfchelloworld@gmail.com',
            to: "mhfchelloworld@gmail.com",
            subject: "Welcome Email",
            text: req.body.message,
        });

        return res.status(200).send({
            success: true,
            message: 'Successfully sent an email',
        });
    } catch {
        return res.status(500).send({
            success: false,
            message: 'Server error',
        });
    }
}

module.exports = {
    contact,
}