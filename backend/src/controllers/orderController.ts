import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { orderService } from '../services/orderService';
import { asyncHandler } from '../utils/asyncHandler';
import { sendResponse } from '../utils/sendResponse';

export const placeOrder = asyncHandler(async (req: Request, res: Response) => {
  const order = await orderService.placeOrder(req.user!.userId);
  sendResponse(res, StatusCodes.CREATED, 'Order placed successfully', order);
});

export const getMyOrders = asyncHandler(async (req: Request, res: Response) => {
  const query =
    (res.locals.validatedQuery as { page: number; limit: number; status?: 'placed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' }) ??
    ({ page: 1, limit: 10 } as const);

  const orders = await orderService.listUserOrders(req.user!.userId, query);
  sendResponse(res, StatusCodes.OK, 'User orders fetched successfully', orders);
});

export const getAllOrders = asyncHandler(async (_req: Request, res: Response) => {
  const query =
    (res.locals.validatedQuery as { page: number; limit: number; status?: 'placed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' }) ??
    ({ page: 1, limit: 10 } as const);

  const orders = await orderService.listAllOrders(query);
  sendResponse(res, StatusCodes.OK, 'Orders fetched successfully', orders);
});

export const updateOrderStatus = asyncHandler(async (req: Request, res: Response) => {
  const updated = await orderService.updateOrderStatus(String(req.params.orderId), req.body.status);
  sendResponse(res, StatusCodes.OK, 'Order status updated successfully', updated);
});
