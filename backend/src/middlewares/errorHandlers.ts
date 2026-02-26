import { NextFunction, Request, Response } from 'express';

import { AppError } from '../utils/AppError';
import { sendResponse } from '../utils/sendResponse';

export const notFoundHandler = (_req: Request, _res: Response, next: NextFunction): void => {
  next(new AppError('Route not found', 404));
};

export const errorHandler = (
  err: Error | AppError,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  const statusCode = err instanceof AppError ? err.statusCode : 500;
  sendResponse(res, statusCode, err.message || 'Internal server error');
};