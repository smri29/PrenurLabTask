import { Router } from 'express';

import { login, logout, me, register } from '../controllers/authController';
import { requireAuth } from '../middlewares/auth';
import { validate } from '../middlewares/validate';
import { loginSchema, registerSchema } from '../validators/authValidator';

const router = Router();

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.post('/logout', requireAuth, logout);
router.get('/me', requireAuth, me);

export default router;