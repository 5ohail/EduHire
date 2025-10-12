// routes/jobRoutes.js - Defines API endpoints for job postings.

const express = require('express');
const { getJobs, createJob } = require('../controllers/Job');
const { protect, restrictTo } = require('../middlewares/authentication');

const router = express.Router();

router.route('/')
    .get(getJobs) // Public read access
    .post(protect, restrictTo('recruiter'), createJob); // Protected write access for recruiters

// Example of a route to get, update, or delete a single job:
// router.route('/:id')
//     .get(getJobById)
//     .put(protect, restrictTo('recruiter'), updateJob)
//     .delete(protect, restrictTo('recruiter'), deleteJob);

module.exports = router;
