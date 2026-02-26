import { Router } from 'express';

import { getAllOrders, getMyOrders, placeOrder, updateOrderStatus } from '../controllers/orderController';
import { requireAuth, requireRole } from '../middlewares/auth';
import { validate } from '../middlewares/validate';
import { orderListQuerySchema, updateOrderStatusSchema } from '../validators/orderValidator';

const router = Router();

router.post('/', requireAuth, requireRole('user'), placeOrder);
router.get('/me', requireAuth, requireRole('user'), validate(orderListQuerySchema, 'query'), getMyOrders);
router.get('/admin', requireAuth, requireRole('admin'), validate(orderListQuerySchema, 'query'), getAllOrders);
router.patch('/:orderId/status', requireAuth, requireRole('admin'), validate(updateOrderStatusSchema), updateOrderStatus);

export default router;
