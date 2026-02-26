import { Router } from 'express';

import { addToCart, clearCart, getCart, removeFromCart, updateCartQuantity } from '../controllers/cartController';
import { requireAuth, requireRole } from '../middlewares/auth';
import { validate } from '../middlewares/validate';
import { addToCartSchema, updateCartQuantitySchema } from '../validators/cartValidator';

const router = Router();

router.use(requireAuth);
router.use(requireRole('user'));
router.post('/', validate(addToCartSchema), addToCart);
router.get('/', getCart);
router.delete('/', clearCart);
router.delete('/:productId', removeFromCart);
router.patch('/:productId', validate(updateCartQuantitySchema), updateCartQuantity);

export default router;
