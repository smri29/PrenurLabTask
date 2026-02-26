import mongoose from 'mongoose';

import { CartModel } from '../models/Cart';
import { ProductModel } from '../models/Product';
import { AppError } from '../utils/AppError';

export const cartService = {
  getOrCreateCart: async (userId: string) => {
    const existing = await CartModel.findOne({ userId });
    if (existing) {
      return existing;
    }
    return CartModel.create({ userId, items: [] });
  },

  addToCart: async (userId: string, payload: { productId: string; quantity: number }) => {
    if (!mongoose.isValidObjectId(payload.productId)) {
      throw new AppError('Invalid product id', 400);
    }

    const product = await ProductModel.findById(payload.productId);
    if (!product) {
      throw new AppError('Product not found', 404);
    }

    const cart = await cartService.getOrCreateCart(userId);

    const existingItem = cart.items.find((item) => item.productId.toString() === payload.productId);

    if (existingItem) {
      const updatedQuantity = existingItem.quantity + payload.quantity;
      if (updatedQuantity > product.stock) {
        throw new AppError('Quantity exceeds available stock', 400);
      }
      existingItem.quantity = updatedQuantity;
    } else {
      if (payload.quantity > product.stock) {
        throw new AppError('Quantity exceeds available stock', 400);
      }
      cart.items.push({ productId: product._id, quantity: payload.quantity });
    }

    await cart.save();

    return CartModel.findOne({ userId }).populate('items.productId');
  },

  updateItemQuantity: async (userId: string, productId: string, quantity: number) => {
    if (!mongoose.isValidObjectId(productId)) {
      throw new AppError('Invalid product id', 400);
    }

    const product = await ProductModel.findById(productId);
    if (!product) {
      throw new AppError('Product not found', 404);
    }

    if (quantity > product.stock) {
      throw new AppError('Quantity exceeds available stock', 400);
    }

    const cart = await cartService.getOrCreateCart(userId);
    const item = cart.items.find((entry) => entry.productId.toString() === productId);
    if (!item) {
      throw new AppError('Product not found in cart', 404);
    }

    item.quantity = quantity;
    await cart.save();

    return CartModel.findOne({ userId }).populate('items.productId');
  },

  getCart: async (userId: string) => {
    const cart = await CartModel.findOne({ userId }).populate('items.productId');
    if (!cart) {
      return { userId, items: [] };
    }
    return cart;
  },

  removeItem: async (userId: string, productId: string) => {
    if (!mongoose.isValidObjectId(productId)) {
      throw new AppError('Invalid product id', 400);
    }

    const cart = await CartModel.findOne({ userId });
    if (!cart) {
      throw new AppError('Cart not found', 404);
    }

    cart.items = cart.items.filter((item) => item.productId.toString() !== productId);
    await cart.save();

    return CartModel.findOne({ userId }).populate('items.productId');
  },

  clearCart: async (userId: string) => {
    const cart = await cartService.getOrCreateCart(userId);
    cart.items = [];
    await cart.save();

    return CartModel.findOne({ userId }).populate('items.productId');
  },
};
