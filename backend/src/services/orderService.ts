import mongoose from 'mongoose';

import { CartModel } from '../models/Cart';
import { OrderModel, OrderStatus } from '../models/Order';
import { ProductModel } from '../models/Product';
import { AppError } from '../utils/AppError';

const FINAL_STATUSES: OrderStatus[] = ['delivered', 'cancelled'];

export const orderService = {
  placeOrder: async (userId: string) => {
    const session = await mongoose.startSession();

    try {
      session.startTransaction();

      const cart = await CartModel.findOne({ userId }).session(session);
      if (!cart || cart.items.length === 0) {
        throw new AppError('Cart is empty', 400);
      }

      const productIds = cart.items.map((item) => item.productId);
      const products = await ProductModel.find({ _id: { $in: productIds } }).session(session);

      const productMap = new Map(products.map((product) => [product._id.toString(), product]));

      const orderItems = cart.items.map((item) => {
        const product = productMap.get(item.productId.toString());
        if (!product) {
          throw new AppError('One or more products no longer exist', 400);
        }

        if (item.quantity > product.stock) {
          throw new AppError(`Insufficient stock for ${product.name}`, 400);
        }

        product.stock -= item.quantity;

        return {
          productId: product._id,
          productName: product.name,
          unitPrice: product.price,
          quantity: item.quantity,
          subtotal: product.price * item.quantity,
        };
      });

      await Promise.all(products.map((product) => product.save({ session })));

      const totalAmount = orderItems.reduce((sum, item) => sum + item.subtotal, 0);

      const [order] = await OrderModel.create(
        [
          {
            userId,
            items: orderItems,
            totalAmount,
            status: 'placed',
          },
        ],
        { session },
      );

      cart.items = [];
      await cart.save({ session });

      await session.commitTransaction();
      return order;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  },

  listUserOrders: async (userId: string, query: { page: number; limit: number; status?: OrderStatus }) => {
    const filter: Record<string, unknown> = { userId };
    if (query.status) {
      filter.status = query.status;
    }

    const skip = (query.page - 1) * query.limit;

    const [items, total] = await Promise.all([
      OrderModel.find(filter).sort({ createdAt: -1 }).skip(skip).limit(query.limit),
      OrderModel.countDocuments(filter),
    ]);

    return {
      items,
      pagination: {
        page: query.page,
        limit: query.limit,
        total,
        totalPages: Math.ceil(total / query.limit) || 1,
      },
    };
  },

  listAllOrders: async (query: { page: number; limit: number; status?: OrderStatus }) => {
    const filter: Record<string, unknown> = {};
    if (query.status) {
      filter.status = query.status;
    }

    const skip = (query.page - 1) * query.limit;

    const [items, total] = await Promise.all([
      OrderModel.find(filter)
        .populate('userId', 'name email role')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(query.limit),
      OrderModel.countDocuments(filter),
    ]);

    return {
      items,
      pagination: {
        page: query.page,
        limit: query.limit,
        total,
        totalPages: Math.ceil(total / query.limit) || 1,
      },
    };
  },

  updateOrderStatus: async (orderId: string, status: OrderStatus) => {
    if (!mongoose.isValidObjectId(orderId)) {
      throw new AppError('Invalid order id', 400);
    }

    const order = await OrderModel.findById(orderId);
    if (!order) {
      throw new AppError('Order not found', 404);
    }

    if (FINAL_STATUSES.includes(order.status)) {
      throw new AppError(`Order already ${order.status}; status cannot be changed`, 400);
    }

    order.status = status;
    await order.save();

    return order;
  },
};
