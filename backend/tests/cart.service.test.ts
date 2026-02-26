jest.mock('../src/models/Product', () => ({
  ProductModel: {
    findById: jest.fn(),
  },
}));

jest.mock('../src/models/Cart', () => ({
  CartModel: {
    findOne: jest.fn(),
    create: jest.fn(),
  },
}));

import { CartModel } from '../src/models/Cart';
import { ProductModel } from '../src/models/Product';
import { cartService } from '../src/services/cartService';

describe('cartService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('adds item to cart when stock is sufficient', async () => {
    (ProductModel.findById as jest.Mock).mockResolvedValue({ _id: 'p1', stock: 10 });

    const cart = {
      items: [] as Array<{ productId: string; quantity: number }> ,
      save: jest.fn(),
    };

    (CartModel.findOne as jest.Mock)
      .mockResolvedValueOnce(cart)
      .mockReturnValueOnce({
        populate: jest.fn().mockResolvedValue({ userId: 'u1', items: cart.items }),
      });

    await cartService.addToCart('u1', { productId: '507f1f77bcf86cd799439011', quantity: 2 });

    expect(cart.items[0].quantity).toBe(2);
    expect(cart.save).toHaveBeenCalled();
  });
});
