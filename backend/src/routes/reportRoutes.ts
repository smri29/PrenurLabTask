import { Router } from 'express';

import { getInventoryInsights, getSummary } from '../controllers/reportController';
import { requireAuth, requireRole } from '../middlewares/auth';

const router = Router();

router.get('/summary', requireAuth, requireRole('admin'), getSummary);
router.get('/inventory', requireAuth, requireRole('admin'), getInventoryInsights);

export default router;
