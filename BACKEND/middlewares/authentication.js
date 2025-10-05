// middleware/authMiddleware.js - Handles JWT generation, verification, and role restriction.

const jsonwebtoken = require('jsonwebtoken');

// Load JWT_SECRET from environment variables (conceptual)
const JWT_SECRET = process.env.JWT_SECRET || 'YOUR_SUPER_SECRET_KEY';

/**
 * @function generateToken
 * @description Creates a signed JWT for a user.
 * @param {string} id - User ID
 * @param {string} role - User role ('student' or 'employer')
 * @returns {string} The signed JWT.
 */
const generateToken = (id, role) => {
    return jsonwebtoken.sign({ id, role }, JWT_SECRET, { expiresIn: '30d' });
};

/**
 * @function protect
 * @description Middleware to verify JWT validity and extract user payload.
 * Requires a Bearer token in the Authorization header.
 */
const protect = (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            // Decodes token and verifies signature
            const decoded = jsonwebtoken.verify(token, JWT_SECRET);
            // Attach user ID and role to the request object
            req.user = decoded;
            next();
        } catch (error) {
            console.error('JWT Verification Error:', error.message);
            return res.status(401).json({ message: 'Not authorized, token failed or expired.' });
        }
    } else {
        return res.status(401).json({ message: 'Not authorized, no token provided.' });
    }
};

/**
 * @function restrictTo
 * @description Middleware to ensure the authenticated user has a specific role.
 * @param {string} role - The required role ('student' or 'employer').
 */
const restrictTo = (role) => (req, res, next) => {
    // Check if the user is authenticated and has the required role
    if (!req.user || req.user.role !== role) {
        return res.status(403).json({ message: `Forbidden: Access restricted to ${role} role.` });
    }
    next();
};

module.exports = { generateToken, protect, restrictTo };
