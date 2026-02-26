import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { productService } from '../services/productService';
import { asyncHandler } from '../utils/asyncHandler';
import { sendResponse } from '../utils/sendResponse';

export const createProduct = asyncHandler(async (req: Request, res: Response) => {
  const product = await productService.create(req.body);
  sendResponse(res, StatusCodes.CREATED, 'Product created successfully', product);
});

export const getProducts = asyncHandler(async (req: Request, res: Response) => {
  const query =
    (res.locals.validatedQuery as { page: number; limit: number; search?: string } | undefined) ??
    (req.query as unknown as { page: number; limit: number; search?: string });
  const data = await productService.list(query);
  sendResponse(res, StatusCodes.OK, 'Products fetched successfully', data);
});

export const getProductById = asyncHandler(async (req: Request, res: Response) => {
  const product = await productService.getById(String(req.params.id));
  sendResponse(res, StatusCodes.OK, 'Product fetched successfully', product);
});

export const updateProduct = asyncHandler(async (req: Request, res: Response) => {
  const product = await productService.update(String(req.params.id), req.body);
  sendResponse(res, StatusCodes.OK, 'Product updated successfully', product);
});

export const deleteProduct = asyncHandler(async (req: Request, res: Response) => {
  await productService.remove(String(req.params.id));
  sendResponse(res, StatusCodes.OK, 'Product deleted successfully');
});
