const aggregateMock = jest.fn();
const countDocumentsMock = jest.fn();
const findMock = jest.fn();
const productAggregateMock = jest.fn();

jest.mock('../src/models/Order', () => ({
  OrderModel: {
    aggregate: aggregateMock,
  },
}));

jest.mock('../src/models/Product', () => ({
  ProductModel: {
    countDocuments: countDocumentsMock,
    find: findMock,
    aggregate: productAggregateMock,
  },
}));

import { reportService } from '../src/services/reportService';

describe('reportService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns summary values from aggregation', async () => {
    aggregateMock.mockResolvedValue([
      {
        totals: [{ totalOrders: 4, totalRevenue: 250 }],
        bestSellers: [{ _id: 'p1', productName: 'Keyboard', soldQuantity: 7 }],
      },
    ]);

    const result = await reportService.getSummary();

    expect(result.totalOrders).toBe(4);
    expect(result.totalRevenue).toBe(250);
    expect(result.topProducts.length).toBe(1);
  });

  it('returns inventory insights', async () => {
    const lowStockChain = { sort: jest.fn().mockReturnThis(), limit: jest.fn().mockResolvedValue([{ _id: 'p1' }]) };
    const outOfStockChain = { sort: jest.fn().mockReturnThis(), limit: jest.fn().mockResolvedValue([{ _id: 'p2' }]) };

    countDocumentsMock.mockResolvedValue(20);
    findMock.mockReturnValueOnce(lowStockChain).mockReturnValueOnce(outOfStockChain);
    productAggregateMock.mockResolvedValue([{ totalUnits: 120 }]);

    const result = await reportService.getInventoryInsights();

    expect(result.totalProducts).toBe(20);
    expect(result.totalUnitsInStock).toBe(120);
    expect(result.lowStockCount).toBe(1);
    expect(result.outOfStockCount).toBe(1);
  });
});
