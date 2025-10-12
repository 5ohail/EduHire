// routes/applicationRoutes.js

const express = require('express');
const { getAnalyticsData,getAppliedData } = require('../controllers/Application');
const { protect } = require('../middlewares/authentication'); // Auth middleware from previous step

const router = express.Router();

// Route for fetching dashboard analytics data. It is protected.
router.route('/analytics').get(protect, getAnalyticsData);
router.route('/applied').post(getAppliedData);

module.exports = router;
