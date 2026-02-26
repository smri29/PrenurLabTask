import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { cartService } from '../services/cartService';
import { asyncHandler } from '../utils/asyncHandler';
import { sendResponse } from '../utils/sendResponse';

export const addToCart = asyncHandler(async (req: Request, res: Response) => {
  const cart = await cartService.addToCart(req.user!.userId, req.body);
  sendResponse(res, StatusCodes.OK, 'Cart updated successfully', cart);
});

export const getCart = asyncHandler(async (req: Request, res: Response) => {
  const cart = await cartService.getCart(req.user!.userId);
  sendResponse(res, StatusCodes.OK, 'Cart fetched successfully', cart);
});

export const removeFromCart = asyncHandler(async (req: Request, res: Response) => {
  const cart = await cartService.removeItem(req.user!.userId, String(req.params.productId));
  sendResponse(res, StatusCodes.OK, 'Cart item removed successfully', cart);
});

export const updateCartQuantity = asyncHandler(async (req: Request, res: Response) => {
  const cart = await cartService.updateItemQuantity(req.user!.userId, String(req.params.productId), req.body.quantity);
  sendResponse(res, StatusCodes.OK, 'Cart item quantity updated successfully', cart);
});

export const clearCart = asyncHandler(async (req: Request, res: Response) => {
  const cart = await cartService.clearCart(req.user!.userId);
  sendResponse(res, StatusCodes.OK, 'Cart cleared successfully', cart);
});
