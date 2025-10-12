// server.js - The main entry point for the EduHire MERN backend.

// Core Imports
const express = require('express');
const cors = require('cors');
// We use dotenv to load environment variables from a .env file (e.g., PORT, MONGO_URI, JWT_SECRET)
const dotenv = require('dotenv');

// Configuration and Database Connection
const connectDB = require('./db/db');

// Import Routers
// These files contain the logic that maps URLs to Controller functions
const authRoutes = require('./routes/authRoutes');
const jobRoutes = require('./routes/jobRoutes');
const applicationRoutes = require('./routes/applicationRoutes');

// Load environment variables from .env file
dotenv.config();

// Initialize the Database Connection
connectDB();

// Initialize Express App
const app = express();

// --- Middleware Setup ---
// 1. CORS: Allows requests from different domains (important for frontend communication)
app.use(cors());
// 2. Body Parser: Allows parsing of incoming request bodies in JSON format
app.use(express.json());

// --- Health Check Route ---
// Simple route to verify the server is running
app.get('/', (req, res) => {
    res.send('EduHire API is running successfully in MVC mode!');
});

// --- Mount Routes ---
// Base URL for Authentication: /api/auth
app.use('/api/auth', authRoutes);
// Base URL for Jobs: /api/jobs
app.use('/api/jobs', jobRoutes);
app.use('/api/applications', applicationRoutes);

// --- Error Handling Middleware (optional but highly recommended for production) ---
const notFound = (req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404);
    next(error);
};
const errorHandler = (err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode);
    res.json({
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
};
app.use(notFound);
app.use(errorHandler);


// --- Server Start ---
// Use the PORT from environment variables or default to 5000
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
