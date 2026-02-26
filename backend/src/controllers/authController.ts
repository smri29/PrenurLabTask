import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { env } from '../config/env';
import { authService } from '../services/authService';
import { asyncHandler } from '../utils/asyncHandler';
import { sendResponse } from '../utils/sendResponse';

const cookieOptions = {
  httpOnly: true,
  secure: env.COOKIE_SECURE === 'true' || env.isProd,
  sameSite: env.COOKIE_SAMESITE,
  maxAge: 24 * 60 * 60 * 1000,
} as const;

export const register = asyncHandler(async (req: Request, res: Response) => {
  const result = await authService.register(req.body);
  sendResponse(res, StatusCodes.CREATED, 'User registered successfully', result);
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const result = await authService.login(req.body);

  res.cookie(env.COOKIE_NAME, result.token, cookieOptions);

  sendResponse(res, StatusCodes.OK, 'Login successful', { user: result.user });
});

export const logout = asyncHandler(async (_req: Request, res: Response) => {
  res.clearCookie(env.COOKIE_NAME, {
    httpOnly: true,
    sameSite: env.COOKIE_SAMESITE,
    secure: env.COOKIE_SECURE === 'true' || env.isProd,
  });

  sendResponse(res, StatusCodes.OK, 'Logout successful');
});

export const me = asyncHandler(async (req: Request, res: Response) => {
  const user = await authService.me(req.user!.userId);
  sendResponse(res, StatusCodes.OK, 'User profile fetched', user);
});