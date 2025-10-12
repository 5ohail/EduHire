import { Router } from 'express';
import { createFeedback, listFeedback } from '../controllers/feedbackController';
import { requireAuth, requireRoles } from '../middleware/authMiddleware';

const router = Router();

router.get('/', requireAuth, requireRoles('Faculty', 'Admin'), listFeedback);
router.post('/', requireAuth, requireRoles('Faculty', 'Admin'), createFeedback);

export default router;


