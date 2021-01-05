const mongoose = require('mongoose');

mongoose.connect(`${process.env.DB_URL}/blog?authSource=admin`, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
});