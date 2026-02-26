import { z } from 'zod';

export const addToCartSchema = z.object({
  productId: z.string().min(1),
  quantity: z.number().int().positive(),
});

export const updateCartQuantitySchema = z.object({
  quantity: z.number().int().positive(),
});
