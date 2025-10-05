// routes/jobRoutes.js - Defines API endpoints for job postings.

const express = require('express');
const { getJobs, createJob } = require('../controllers/Job');
const { protect, restrictTo } = require('../middlewares/authentication');

const router = express.Router();

router.route('/')
    .get(getJobs) // Public read access
    .post(protect, restrictTo('employer'), createJob); // Protected write access for employers

// Example of a route to get, update, or delete a single job:
// router.route('/:id')
//     .get(getJobById)
//     .put(protect, restrictTo('employer'), updateJob)
//     .delete(protect, restrictTo('employer'), deleteJob);

module.exports = router;
