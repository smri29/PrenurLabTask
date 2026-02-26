import { model, Schema, Types } from 'mongoose';

export interface IProduct {
  _id: Types.ObjectId;
  name: string;
  price: number;
  stock: number;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    stock: { type: Number, required: true, min: 0 },
    description: { type: String, required: true, trim: true },
  },
  { timestamps: true },
);

productSchema.index({ name: 'text', description: 'text' });

export const ProductModel = model<IProduct>('Product', productSchema);