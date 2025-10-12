// models/Application.js

const mongoose = require('mongoose');

// Define the schema for a single job application
const applicationSchema = new mongoose.Schema({
    // Student identification and details
    studentName: {
        type: String,
        required: [true, 'Student name is required'],
        trim: true
    },
    studentBranch: {
        type: String,
        required: true,
        enum: ['CSE', 'ECE', 'EEE', 'IT', 'Mech', 'Civil'], // Restricts to allowed branches
    },
    
    // Job details
    jobTitle: {
        type: String,
        required: [true, 'Job title is required'],
        trim: true
    },
    company: {
        type: String,
        required: [true, 'Company name is required'],
        trim: true
    },
    jobType: {
        type: String,
        required: true,
        enum: ['Full-time', 'Internship'],
    },

    // Application tracking details
    applicationDate: {
        type: Date,
        default: Date.now,
        // The React frontend uses a string date format (YYYY-MM-DD),
        // so we save it as a Date object in MongoDB and format it on retrieval.
    },
    status: {
        type: String,
        required: true,
        enum: ['Applied', 'Under Review', 'Interview', 'Rejected', 'Hired'], // Matches frontend statuses
        default: 'Applied',
    },

    // Reference to the user who made the application (if applicable, or the admin who posted the job)
    applicant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Assuming you have a User model
        required: false // Optional, depending on user roles
    }
}, {
    timestamps: true // Adds createdAt and updatedAt fields automatically
});

const Application = mongoose.model('Application', applicationSchema);

module.exports = Application;
