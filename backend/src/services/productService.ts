import { ProductModel } from '../models/Product';
import { AppError } from '../utils/AppError';

export const productService = {
  create: async (payload: { name: string; price: number; stock: number; description: string }) => {
    const product = await ProductModel.create(payload);
    return product;
  },

  list: async (query: { page: number; limit: number; search?: string }) => {
    const filter: Record<string, unknown> = {};
    if (query.search) {
      filter.$or = [
        { name: { $regex: query.search, $options: 'i' } },
        { description: { $regex: query.search, $options: 'i' } },
      ];
    }

    const skip = (query.page - 1) * query.limit;
    const [items, total] = await Promise.all([
      ProductModel.find(filter).sort({ createdAt: -1 }).skip(skip).limit(query.limit),
      ProductModel.countDocuments(filter),
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

  getById: async (id: string) => {
    const product = await ProductModel.findById(id);
    if (!product) {
      throw new AppError('Product not found', 404);
    }
    return product;
  },

  update: async (id: string, payload: Record<string, unknown>) => {
    const product = await ProductModel.findByIdAndUpdate(id, payload, { new: true, runValidators: true });
    if (!product) {
      throw new AppError('Product not found', 404);
    }
    return product;
  },

  remove: async (id: string) => {
    const product = await ProductModel.findByIdAndDelete(id);
    if (!product) {
      throw new AppError('Product not found', 404);
    }
    return product;
  },
};
