// models/Job.js - Defines the Job schema and model.

const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
    // Links to the User who posted the job (employer)
    employerId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    title: { type: String, required: true },
    description: { type: String, required: true },
    requirements: { type: [String], default: [] },
    location: { type: String, default: 'Remote' },
    salaryRange: { type: String, default: 'Competitive' },
    postedDate: { type: Date, default: Date.now },
    status: { type: String, enum: ['active', 'closed'], default: 'active' }
}, {
    timestamps: true // Adds createdAt and updatedAt timestamps automatically
});

const Job = mongoose.model('Job', JobSchema);
module.exports = Job;
