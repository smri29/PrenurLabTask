import { NextFunction, Request, Response } from 'express';
import { ZodTypeAny } from 'zod';

import { AppError } from '../utils/AppError';

export const validate = (schema: ZodTypeAny, from: 'body' | 'query' = 'body') => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const parsed = schema.safeParse(req[from]);
    if (!parsed.success) {
      const message = String(parsed.error) || 'Validation error';
      next(new AppError(message, 400));
      return;
    }

    if (from === 'body') {
      req.body = parsed.data;
    } else {
      res.locals.validatedQuery = parsed.data;
    }

    next();
  };
};
