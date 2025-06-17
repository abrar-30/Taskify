const mongoose = require('mongoose');
const User = require('../models/User');
const Project = require('../models/Project');
const Task = require('../models/Task');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const createSampleData = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        // Find the admin user
        const adminUser = await User.findOne({ email: 'admin@gmail.com' });
        if (!adminUser) {
            console.log('Admin user not found. Please run the createAdmin script first.');
            process.exit(1);
        }

        // Check if projects already exist
        const existingProjects = await Project.find();
        if (existingProjects.length > 0) {
            console.log('Sample projects already exist');
            process.exit(0);
        }

        // Create sample projects
        const project1 = new Project({
            name: 'Website Redesign',
            description: 'Complete redesign of the company website with modern UI/UX',
            creator: adminUser._id,
            members: [adminUser._id]
        });

        const project2 = new Project({
            name: 'Mobile App Development',
            description: 'Develop a cross-platform mobile application for iOS and Android',
            creator: adminUser._id,
            members: [adminUser._id]
        });

        const project3 = new Project({
            name: 'Database Migration',
            description: 'Migrate legacy database to modern cloud infrastructure',
            creator: adminUser._id,
            members: [adminUser._id]
        });

        await project1.save();
        await project2.save();
        await project3.save();

        console.log('Sample projects created');

        // Create sample tasks
        const tasks = [
            {
                title: 'Design Homepage Layout',
                description: 'Create wireframes and mockups for the new homepage design',
                status: 'pending',
                priority: 'high',
                project: project1._id,
                assignedTo: adminUser._id,
                createdBy: adminUser._id,
                dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
            },
            {
                title: 'Implement User Authentication',
                description: 'Set up secure user login and registration system',
                status: 'in-progress',
                priority: 'high',
                project: project2._id,
                assignedTo: adminUser._id,
                createdBy: adminUser._id,
                dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) // 14 days from now
            },
            {
                title: 'Database Schema Design',
                description: 'Design the new database schema for improved performance',
                status: 'completed',
                priority: 'medium',
                project: project3._id,
                assignedTo: adminUser._id,
                createdBy: adminUser._id,
                dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
            },
            {
                title: 'Content Migration',
                description: 'Migrate existing content to the new website structure',
                status: 'pending',
                priority: 'medium',
                project: project1._id,
                assignedTo: adminUser._id,
                createdBy: adminUser._id,
                dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000) // 10 days from now
            },
            {
                title: 'API Development',
                description: 'Develop REST APIs for mobile app backend',
                status: 'in-progress',
                priority: 'high',
                project: project2._id,
                assignedTo: adminUser._id,
                createdBy: adminUser._id,
                dueDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000) // 21 days from now
            }
        ];

        for (const taskData of tasks) {
            const task = new Task(taskData);
            await task.save();
        }

        console.log('Sample tasks created');
        console.log('Sample data creation completed successfully!');
        
        process.exit(0);
    } catch (error) {
        console.error('Error creating sample data:', error);
        process.exit(1);
    }
};

createSampleData();
