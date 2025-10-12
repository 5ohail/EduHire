import { Router } from 'express';
import { createJob, getJobById, getOpenJobs, updateJobStatus } from '../controllers/jobController';
import { requireAuth, requireRoles } from '../middleware/authMiddleware';

const router = Router();

router.get('/', getOpenJobs);
router.get('/:id', getJobById);
router.post('/', requireAuth, requireRoles('Faculty', 'Admin'), createJob);
router.patch('/:id/status', requireAuth, requireRoles('Faculty', 'Admin'), updateJobStatus);

export default router;


