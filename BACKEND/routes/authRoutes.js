// routes/authRoutes.js - Defines API endpoints for authentication.

const express = require('express');
const { registerUser, loginUser, getMe } = require('../controllers/Authentication');
const { protect } = require('../middlewares/authentication');

const router = express.Router();

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Protected routes
router.get('/me', protect, getMe);

module.exports = router;
