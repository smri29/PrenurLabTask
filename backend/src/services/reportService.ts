import { ProductModel } from '../models/Product';
import { OrderModel } from '../models/Order';

export const reportService = {
  getSummary: async () => {
    const [result] = await OrderModel.aggregate([
      {
        $facet: {
          totals: [
            {
              $group: {
                _id: null,
                totalOrders: { $sum: 1 },
                totalRevenue: { $sum: '$totalAmount' },
              },
            },
          ],
          bestSellers: [
            { $unwind: '$items' },
            {
              $group: {
                _id: '$items.productId',
                productName: { $first: '$items.productName' },
                soldQuantity: { $sum: '$items.quantity' },
              },
            },
            { $sort: { soldQuantity: -1 } },
            { $limit: 3 },
          ],
        },
      },
    ]);

    const totals = result?.totals?.[0] ?? { totalOrders: 0, totalRevenue: 0 };

    return {
      totalOrders: totals.totalOrders,
      totalRevenue: totals.totalRevenue,
      topProducts: result?.bestSellers ?? [],
    };
  },

  getInventoryInsights: async () => {
    const [totalProducts, lowStockProducts, outOfStockProducts, stockUnits] = await Promise.all([
      ProductModel.countDocuments(),
      ProductModel.find({ stock: { $gt: 0, $lte: 5 } }).sort({ stock: 1, name: 1 }).limit(10),
      ProductModel.find({ stock: 0 }).sort({ updatedAt: -1 }).limit(10),
      ProductModel.aggregate([{ $group: { _id: null, totalUnits: { $sum: '$stock' } } }]),
    ]);

    return {
      totalProducts,
      totalUnitsInStock: stockUnits[0]?.totalUnits ?? 0,
      lowStockCount: lowStockProducts.length,
      outOfStockCount: outOfStockProducts.length,
      lowStockProducts,
      outOfStockProducts,
    };
  },
};
