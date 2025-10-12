import { Router } from 'express';
import { listLogs, createLog, deleteLog } from '../controllers/logController';

const router = Router();

router.get('/', listLogs);
router.post('/', createLog);
router.delete('/:id', deleteLog);

export default router;


