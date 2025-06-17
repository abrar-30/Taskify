const mongoose = require('mongoose');
const User = require('../models/User');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const createAdminUser = async () => {
    try {
        // Validate environment variables
        if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD || !process.env.ADMIN_USERNAME) {
            console.error('Missing admin credentials in environment variables');
            console.error('Please set ADMIN_EMAIL, ADMIN_PASSWORD, and ADMIN_USERNAME in .env file');
            process.exit(1);
        }

        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        // Check if admin user already exists
        const existingAdmin = await User.findOne({ email: process.env.ADMIN_EMAIL });
        if (existingAdmin) {
            console.log('Admin user already exists');
            console.log(`Email: ${process.env.ADMIN_EMAIL}`);
            process.exit(0);
        }

        // Create admin user
        const adminUser = new User({
            username: process.env.ADMIN_USERNAME,
            email: process.env.ADMIN_EMAIL,
            role: 'admin'
        });

        // Register user with passport-local-mongoose
        await User.register(adminUser, process.env.ADMIN_PASSWORD);

        console.log('Admin user created successfully!');
        console.log(`Email: ${process.env.ADMIN_EMAIL}`);
        console.log(`Username: ${process.env.ADMIN_USERNAME}`);
        console.log('Password: [HIDDEN]');
        console.log('Role: admin');

        process.exit(0);
    } catch (error) {
        console.error('Error creating admin user:', error);
        process.exit(1);
    }
};

createAdminUser();
