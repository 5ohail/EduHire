// controllers/jobController.js - Handles CRUD operations for job postings.

const Job = require('../models/Job'); // Import the Mongoose Job Model

/**
 * @async
 * @function getJobs
 * @description Handles GET /api/jobs. Retrieves a list of active job postings.
 */
const getJobs = async (req, res) => {
    try {
        // Implement filtering and pagination later. For now, get all active jobs.
        const jobs = await Job.find({ status: 'active' })
            .sort({ postedDate: -1 }) // Sort by newest first
            .limit(100); // Limit results for efficiency

        res.json({
            count: jobs.length,
            jobs,
            message: 'Successfully retrieved active job listings.'
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error retrieving jobs.', error: error.message });
    }
};

/**
 * @async
 * @function createJob
 * @description Handles POST /api/jobs. Creates a new job posting (Employer only).
 */
const createJob = async (req, res) => {
    const { title, description, requirements, location, salaryRange } = req.body;

    if (!title || !description) {
        return res.status(400).json({ message: 'Please provide job title and description.' });
    }

    try {
        // req.user.id is the employerId provided by the 'protect' middleware
        const job = await Job.create({
            employerId: req.user.id,
            title,
            description,
            requirements,
            location,
            salaryRange,
            status: 'active'
        });

        res.status(201).json({
            message: 'Job posted successfully.',
            job
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error posting job.', error: error.message });
    }
};

module.exports = { getJobs, createJob };
