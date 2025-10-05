// controllers/authController.js - Handles registration, login, and user profile retrieval.

const User = require('../models/User'); // Import the Mongoose User Model
const { generateToken } = require('../middlewares/authentication'); // Import the token utility

/**
 * @async
 * @function registerUser
 * @description Handles POST /api/auth/register. Creates a new user.
 */
const registerUser = async (req, res) => {
    const { email, password, role, name } = req.body;

    if (!email || !password || !role || !name) {
        return res.status(400).json({ message: 'Please enter all required fields: email, password, role, and name.' });
    }

    try {
        // 1. Check if user already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists.' });
        }

        // 2. The password hashing is handled by the pre-save hook in models/User.js

        // 3. Create and save new user
        const user = await User.create({
            name,
            email,
            password, // Mongoose will handle hashing via the pre-save hook
            role
        });

        // Respond with user details and JWT
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id, user.role),
        });

    } catch (error) {
        res.status(500).json({ message: 'Server error during registration.', error: error.message });
    }
};

/**
 * @async
 * @function loginUser
 * @description Handles POST /api/auth/login. Authenticates user and returns JWT.
 */
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        // 1. Find user by email
        const user = await User.findOne({ email });

        // 2. Validate user existence and password
        if (user && (await user.matchPassword(password))) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id, user.role),
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password.' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error during login.', error: error.message });
    }
};

/**
 * @async
 * @function getMe
 * @description Handles GET /api/users/me. Retrieves the currently authenticated user's profile.
 */
const getMe = async (req, res) => {
    // req.user contains the decoded JWT payload ({ id, role })
    try {
        // Fetch user data excluding the password field
        const user = await User.findById(req.user.id).select('-password');
        
        if (user) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                profileData: user.profileData,
            });
        } else {
            res.status(404).json({ message: 'User not found.' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error fetching profile.', error: error.message });
    }
};

module.exports = { registerUser, loginUser, getMe };
