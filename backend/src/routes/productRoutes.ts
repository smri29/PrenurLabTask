import { Router } from 'express';

import {
  createProduct,
  deleteProduct,
  getProductById,
  getProducts,
  updateProduct,
} from '../controllers/productController';
import { requireAuth, requireRole } from '../middlewares/auth';
import { validate } from '../middlewares/validate';
import { createProductSchema, productListQuerySchema, updateProductSchema } from '../validators/productValidator';

const router = Router();

router.get('/', validate(productListQuerySchema, 'query'), getProducts);
router.get('/:id', getProductById);
router.post('/', requireAuth, requireRole('admin'), validate(createProductSchema), createProduct);
router.put('/:id', requireAuth, requireRole('admin'), validate(updateProductSchema), updateProduct);
router.delete('/:id', requireAuth, requireRole('admin'), deleteProduct);

export default router;