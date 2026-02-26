import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import { env } from '../config/env';
import { Role } from '../types/common';
import { AppError } from '../utils/AppError';

interface TokenPayload {
  userId: string;
  role: Role;
}

export const requireAuth = (req: Request, _res: Response, next: NextFunction): void => {
  const token = req.cookies?.[env.COOKIE_NAME];
  if (!token) {
    next(new AppError('Authentication required', 401));
    return;
  }

  try {
    const payload = jwt.verify(token, env.JWT_SECRET) as TokenPayload;
    req.user = { userId: payload.userId, role: payload.role };
    next();
  } catch {
    next(new AppError('Invalid or expired token', 401));
  }
};

export const requireRole = (role: Role) => (req: Request, _res: Response, next: NextFunction): void => {
  if (!req.user) {
    next(new AppError('Authentication required', 401));
    return;
  }

  if (req.user.role !== role) {
    next(new AppError('Forbidden: insufficient permissions', 403));
    return;
  }

  next();
};