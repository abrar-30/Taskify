const User = require('../models/User');
const passport = require('passport');

/**
 * Register a new user
 */
exports.register = async (req, res, next) => {
    try {
        const { username, email, password, role } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already registered.' });
        }

        // Create user (do not include password here)
        const user = new User({
            username,
            email,
            role: role || 'member'
        });

        // Register user with passport-local-mongoose
        User.register(user, password, (err, registeredUser) => {
            if (err) {
                return res.status(500).json({ message: 'Registration failed.', error: err.message });
            }
            req.login(registeredUser, (err) => {
                if (err) return next(err);
                // Remove password from user object before sending
                const { password, salt, hash, ...userData } = registeredUser.toObject();
                res.status(201).json({
                    message: 'User registered successfully.',
                    user: userData
                });
            });
        });
    } catch (err) {
        res.status(500).json({ message: 'Server error.', error: err.message });
    }
};

/**
 * Login user
 */
exports.login = (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) return next(err);
        if (!user) {
            return res.status(400).json({ message: info.message || 'Login failed.' });
        }
        req.logIn(user, (err) => {
            if (err) return next(err);
            // Remove password from user object before sending
            const { password, ...userData } = user.toObject();
            return res.status(200).json({ message: 'Login successful.', user: userData });
        });
    })(req, res, next);
};

/**
 * Logout user
 */
exports.logout = (req, res) => {
    req.logout(() => {
        res.status(200).json({ message: 'Logged out successfully.' });
    });
};

/**
 * Get current user
 */
exports.getCurrentUser = (req, res) => {
    if (!req.user) {
        return res.status(401).json({ message: 'Not authenticated.' });
    }

    // Remove password from user object before sending
    const { password, salt, hash, ...userData } = req.user.toObject();

    // Add admin status for frontend
    userData.isAdmin = userData.role === 'admin';

    res.status(200).json({ user: userData });
};

/**
 * Get all users (for member selection)
 */
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}, { password: 0, salt: 0, hash: 0 });
        res.status(200).json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Error fetching users', error: error.message });
    }
};