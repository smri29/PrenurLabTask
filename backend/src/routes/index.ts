import { Router } from 'express';

import authRoutes from './authRoutes';
import cartRoutes from './cartRoutes';
import orderRoutes from './orderRoutes';
import productRoutes from './productRoutes';
import reportRoutes from './reportRoutes';

const router = Router();

router.get('/health', (_req, res) => {
  res.status(200).json({ success: true, message: 'Backend is healthy' });
});

router.use('/auth', authRoutes);
router.use('/products', productRoutes);
router.use('/cart', cartRoutes);
router.use('/orders', orderRoutes);
router.use('/reports', reportRoutes);

export default router;