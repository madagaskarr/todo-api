const mongoose = require('mongoose');
const config = require('config');
const {DbConnectionError} = require("../error/errorTypes");

const connectDB = async () => {
    try {
        await mongoose.connect(config.get('MONGO_URI'), {
            useUnifiedTopology: true
        });
        console.log(`MongoDB connected in ${config.get('NODE_ENV')} mode`);
    } catch (err) {
        // TODO: We need to handle the case with production. Research on if we need to restart process or something similar...
        throw DbConnectionError("DB Connection failed!");
        console.error(err.message);
        process.exit(1);
    }
};

module.exports = connectDB;