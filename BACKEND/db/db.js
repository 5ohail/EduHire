// config/db.js - Handles the connection to MongoDB using Mongoose.

const mongoose = require('mongoose');

// The MONGO_URI should be loaded from an environment file (.env) in a real application.
// For this example, we'll use a hardcoded fallback.
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/eduhireDB';

/**
 * @function connectDB
 * @description Connects the Express application to the MongoDB database.
 */
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error connecting to MongoDB: ${error.message}`);
        // Exit process with failure
        process.exit(1);
    }
};

module.exports = connectDB;
