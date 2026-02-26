import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { reportService } from '../services/reportService';
import { asyncHandler } from '../utils/asyncHandler';
import { sendResponse } from '../utils/sendResponse';

export const getSummary = asyncHandler(async (_req: Request, res: Response) => {
  const summary = await reportService.getSummary();
  sendResponse(res, StatusCodes.OK, 'Report summary fetched successfully', summary);
});

export const getInventoryInsights = asyncHandler(async (_req: Request, res: Response) => {
  const data = await reportService.getInventoryInsights();
  sendResponse(res, StatusCodes.OK, 'Inventory insights fetched successfully', data);
});
