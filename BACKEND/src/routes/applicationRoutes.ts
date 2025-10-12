import { Router } from 'express';
import { getAppliedApplications, getApplicationsAnalytics } from '../controllers/applicationController';

const router = Router();

// From StudentDashboard: POST body { email }
router.post('/applied', getAppliedApplications);

// From PlacementAnalyticBoard: GET analytics
router.get('/analytics', getApplicationsAnalytics);

export default router;


