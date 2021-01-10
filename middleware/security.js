const bodyKeys = (fields) => {
    return (req, res, next) => {
        const keys = Object.keys(req.body);
        const invalidFields = [];

        for (const field of fields) {
            const key = keys.find((key) => field.key === key);

            // Validate existance and type
            if (!key || field.type !== typeof req.body[key]) {
                invalidFields.push(field);
                continue;
            }
        }

        if (!!invalidFields.length) {
            const fieldsList = invalidFields.map((field) => `${field.key} (${field.type})`);

            return res.status(406).send({
                success: false,
                message: `Please provide ${fieldsList.join(', ')}.`,
            });
        }

        next();
    };
};

module.exports = {
    bodyKeys,
}