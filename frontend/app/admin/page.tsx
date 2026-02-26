'use client';

import { FormEvent, useCallback, useEffect, useMemo, useState } from 'react';

import { ProtectedRoute } from '@/components/ProtectedRoute';
import { apiRequest } from '@/lib/api';
import { Order, OrderStatus, Product } from '@/lib/types';

interface ProductForm {
  name: string;
  price: string;
  stock: string;
  description: string;
}

interface ProductListResponse {
  items: Product[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

interface SummaryResponse {
  totalOrders: number;
  totalRevenue: number;
  topProducts: Array<{ _id: string; productName: string; soldQuantity: number }>;
}

interface InventoryResponse {
  totalProducts: number;
  totalUnitsInStock: number;
  lowStockCount: number;
  outOfStockCount: number;
  lowStockProducts: Product[];
  outOfStockProducts: Product[];
}

interface AdminOrdersResponse {
  items: Order[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

const initialForm: ProductForm = {
  name: '',
  price: '',
  stock: '',
  description: '',
};

const orderStatuses: OrderStatus[] = ['placed', 'processing', 'shipped', 'delivered', 'cancelled'];
const editableOrderStatuses: Exclude<OrderStatus, 'placed'>[] = ['processing', 'shipped', 'delivered', 'cancelled'];

const isPopulatedUser = (value: Order['userId']): value is Exclude<Order['userId'], string> => {
  return typeof value !== 'string';
};

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders'>('overview');
  const [products, setProducts] = useState<Product[]>([]);
  const [form, setForm] = useState<ProductForm>(initialForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [summary, setSummary] = useState<SummaryResponse | null>(null);
  const [inventory, setInventory] = useState<InventoryResponse | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [orderStatusFilter, setOrderStatusFilter] = useState<'all' | OrderStatus>('all');
  const [productQuery, setProductQuery] = useState('');
  const [showLowStockOnly, setShowLowStockOnly] = useState(false);

  const loadProducts = useCallback(async (): Promise<void> => {
    const response = await apiRequest<ProductListResponse>('/products?page=1&limit=50', {
      method: 'GET',
    });

    setProducts(response.data?.items ?? []);
  }, []);

  const loadSummary = useCallback(async (): Promise<void> => {
    const response = await apiRequest<SummaryResponse>('/reports/summary', { method: 'GET' });
    setSummary(response.data ?? null);
  }, []);

  const loadInventory = useCallback(async (): Promise<void> => {
    const response = await apiRequest<InventoryResponse>('/reports/inventory', { method: 'GET' });
    setInventory(response.data ?? null);
  }, []);

  const loadOrders = useCallback(async (): Promise<void> => {
    const query = orderStatusFilter === 'all' ? '' : `&status=${orderStatusFilter}`;
    const response = await apiRequest<AdminOrdersResponse>(`/orders/admin?page=1&limit=50${query}`, { method: 'GET' });
    setOrders(response.data?.items ?? []);
  }, [orderStatusFilter]);

  const loadDashboardData = useCallback(async (): Promise<void> => {
    setError('');

    try {
      await Promise.all([loadProducts(), loadSummary(), loadInventory(), loadOrders()]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load admin dashboard');
    }
  }, [loadInventory, loadOrders, loadProducts, loadSummary]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      void loadDashboardData();
    }, 0);

    return () => clearTimeout(timeoutId);
  }, [loadDashboardData]);

  useEffect(() => {
    if (activeTab === 'orders') {
      const timeoutId = setTimeout(() => {
        void loadOrders();
      }, 0);

      return () => clearTimeout(timeoutId);
    }
  }, [activeTab, loadOrders]);

  const visibleProducts = useMemo(() => {
    const normalizedQuery = productQuery.trim().toLowerCase();

    return products.filter((product) => {
      const matchesQuery =
        normalizedQuery.length === 0 ||
        product.name.toLowerCase().includes(normalizedQuery) ||
        product.description.toLowerCase().includes(normalizedQuery);

      const matchesStock = !showLowStockOnly || product.stock <= 5;

      return matchesQuery && matchesStock;
    });
  }, [products, productQuery, showLowStockOnly]);

  const submitProduct = async (event: FormEvent): Promise<void> => {
    event.preventDefault();

    try {
      setError('');
      const payload = {
        name: form.name,
        price: Number(form.price),
        stock: Number(form.stock),
        description: form.description,
      };

      if (editingId) {
        await apiRequest(`/products/${editingId}`, {
          method: 'PUT',
          body: JSON.stringify(payload),
        });
      } else {
        await apiRequest('/products', {
          method: 'POST',
          body: JSON.stringify(payload),
        });
      }

      setForm(initialForm);
      setEditingId(null);
      await Promise.all([loadProducts(), loadInventory()]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save product');
    }
  };

  const editProduct = (product: Product): void => {
    setEditingId(product._id);
    setForm({
      name: product.name,
      price: String(product.price),
      stock: String(product.stock),
      description: product.description,
    });
  };

  const deleteProduct = async (productId: string): Promise<void> => {
    await apiRequest(`/products/${productId}`, { method: 'DELETE' });
    await Promise.all([loadProducts(), loadInventory()]);
  };

  const updateOrderStatus = async (orderId: string, status: OrderStatus): Promise<void> => {
    try {
      await apiRequest(`/orders/${orderId}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      });
      await Promise.all([loadOrders(), loadSummary()]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update order status');
    }
  };

  return (
    <ProtectedRoute requireAdmin>
      <div className="space-y-4">
        <section className="rounded-2xl p-6 glass-card">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="section-title text-3xl font-semibold text-slate-900">Admin Operations Console</h1>
              <p className="subtle-text mt-1 text-sm">Monitor business health, manage inventory, and process orders.</p>
            </div>

            <button type="button" onClick={() => void loadDashboardData()} className="pill-btn bg-slate-700 text-white hover:bg-slate-800">
              Refresh Data
            </button>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              className={`pill-btn ${activeTab === 'overview' ? 'bg-cyan-500 text-slate-900' : 'bg-slate-200 text-slate-700'}`}
              onClick={() => setActiveTab('overview')}
            >
              Overview
            </button>
            <button
              type="button"
              className={`pill-btn ${activeTab === 'products' ? 'bg-cyan-500 text-slate-900' : 'bg-slate-200 text-slate-700'}`}
              onClick={() => setActiveTab('products')}
            >
              Products
            </button>
            <button
              type="button"
              className={`pill-btn ${activeTab === 'orders' ? 'bg-cyan-500 text-slate-900' : 'bg-slate-200 text-slate-700'}`}
              onClick={() => setActiveTab('orders')}
            >
              Orders
            </button>
          </div>
        </section>

        {error && <p className="rounded-xl border border-rose-300 bg-rose-50 p-3 text-sm text-rose-700">{error}</p>}

        {activeTab === 'overview' && (
          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <article className="glass-card rounded-2xl p-4">
              <p className="subtle-text text-sm">Total Orders</p>
              <p className="mt-2 text-2xl font-bold text-slate-900">{summary?.totalOrders ?? 0}</p>
            </article>
            <article className="glass-card rounded-2xl p-4">
              <p className="subtle-text text-sm">Total Revenue</p>
              <p className="mt-2 text-2xl font-bold text-emerald-700">${(summary?.totalRevenue ?? 0).toFixed(2)}</p>
            </article>
            <article className="glass-card rounded-2xl p-4">
              <p className="subtle-text text-sm">Products</p>
              <p className="mt-2 text-2xl font-bold text-slate-900">{inventory?.totalProducts ?? 0}</p>
              <p className="text-xs text-slate-600">Units in stock: {inventory?.totalUnitsInStock ?? 0}</p>
            </article>
            <article className="glass-card rounded-2xl p-4">
              <p className="subtle-text text-sm">Stock Alerts</p>
              <p className="mt-2 text-2xl font-bold text-amber-700">{inventory?.lowStockCount ?? 0}</p>
              <p className="text-xs text-rose-700">Out of stock: {inventory?.outOfStockCount ?? 0}</p>
            </article>

            <article className="glass-card rounded-2xl p-4 md:col-span-2">
              <h2 className="section-title text-xl font-semibold text-slate-900">Top Products</h2>
              <div className="mt-3 space-y-2">
                {(summary?.topProducts ?? []).map((item) => (
                  <div key={item._id} className="glass-soft rounded-xl p-3">
                    <p className="font-semibold text-slate-900">{item.productName}</p>
                    <p className="subtle-text text-sm">Sold Quantity: {item.soldQuantity}</p>
                  </div>
                ))}
                {(summary?.topProducts ?? []).length === 0 && <p className="subtle-text text-sm">No sales data yet.</p>}
              </div>
            </article>

            <article className="glass-card rounded-2xl p-4 md:col-span-2">
              <h2 className="section-title text-xl font-semibold text-slate-900">Inventory Risks</h2>
              <div className="mt-3 space-y-2">
                {inventory?.lowStockProducts?.map((item) => (
                  <div key={item._id} className="glass-soft rounded-xl p-3">
                    <p className="font-semibold text-slate-900">{item.name}</p>
                    <p className="text-sm text-amber-700">Low stock: {item.stock} units</p>
                  </div>
                ))}
                {inventory && inventory.lowStockProducts.length === 0 && (
                  <p className="subtle-text text-sm">No low-stock products detected.</p>
                )}
              </div>
            </article>
          </section>
        )}

        {activeTab === 'products' && (
          <section className="space-y-4">
            <article className="rounded-2xl p-6 glass-card">
              <h2 className="section-title text-2xl font-semibold text-slate-900">Product Management</h2>

              <form className="mt-4 grid gap-2" onSubmit={submitProduct}>
                <input
                  value={form.name}
                  onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
                  className="rounded-xl border border-slate-300 bg-white/80 px-3 py-2 text-slate-800 outline-none focus:border-cyan-500"
                  placeholder="Product name"
                  required
                />
                <div className="grid gap-2 md:grid-cols-2">
                  <input
                    type="number"
                    value={form.price}
                    onChange={(event) => setForm((prev) => ({ ...prev, price: event.target.value }))}
                    className="rounded-xl border border-slate-300 bg-white/80 px-3 py-2 text-slate-800 outline-none focus:border-cyan-500"
                    placeholder="Price"
                    required
                  />
                  <input
                    type="number"
                    value={form.stock}
                    onChange={(event) => setForm((prev) => ({ ...prev, stock: event.target.value }))}
                    className="rounded-xl border border-slate-300 bg-white/80 px-3 py-2 text-slate-800 outline-none focus:border-cyan-500"
                    placeholder="Stock"
                    required
                  />
                </div>
                <textarea
                  value={form.description}
                  onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
                  className="rounded-xl border border-slate-300 bg-white/80 px-3 py-2 text-slate-800 outline-none focus:border-cyan-500"
                  placeholder="Description"
                  rows={3}
                  required
                />
                <button type="submit" className="pill-btn mt-1 bg-cyan-400/90 text-slate-950">
                  {editingId ? 'Update Product' : 'Create Product'}
                </button>
              </form>
            </article>

            <article className="rounded-2xl p-6 glass-card">
              <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <h2 className="section-title text-xl font-semibold text-slate-900">Inventory List</h2>
                <div className="flex flex-col gap-2 md:flex-row md:items-center">
                  <input
                    value={productQuery}
                    onChange={(event) => setProductQuery(event.target.value)}
                    className="rounded-xl border border-slate-300 bg-white/80 px-3 py-2 text-sm text-slate-800 outline-none focus:border-cyan-500"
                    placeholder="Search product..."
                  />
                  <label className="flex items-center gap-2 text-sm text-slate-700">
                    <input
                      type="checkbox"
                      checked={showLowStockOnly}
                      onChange={(event) => setShowLowStockOnly(event.target.checked)}
                    />
                    Low stock only
                  </label>
                </div>
              </div>

              <div className="mt-3 space-y-2">
                {visibleProducts.map((product) => (
                  <div key={product._id} className="glass-soft flex items-center justify-between rounded-xl p-3">
                    <div>
                      <p className="font-semibold text-slate-900">{product.name}</p>
                      <p className="subtle-text text-sm">
                        ${product.price} | Stock: {product.stock}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button type="button" onClick={() => editProduct(product)} className="pill-btn bg-amber-400/90 text-slate-950">
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => void deleteProduct(product._id)}
                        className="pill-btn bg-rose-500/85 text-white"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
                {visibleProducts.length === 0 && <p className="subtle-text text-sm">No products match current filters.</p>}
              </div>
            </article>
          </section>
        )}

        {activeTab === 'orders' && (
          <section className="rounded-2xl p-6 glass-card">
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <h2 className="section-title text-2xl font-semibold text-slate-900">Order Management</h2>
              <select
                value={orderStatusFilter}
                onChange={(event) => setOrderStatusFilter(event.target.value as 'all' | OrderStatus)}
                className="rounded-xl border border-slate-300 bg-white/80 px-3 py-2 text-sm text-slate-800 outline-none focus:border-cyan-500"
              >
                <option value="all">All Statuses</option>
                {orderStatuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>

            <div className="mt-4 space-y-3">
              {orders.map((order) => {
                const user = isPopulatedUser(order.userId) ? order.userId : null;

                return (
                  <div key={order._id} className="glass-soft rounded-xl p-4">
                    <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                      <div>
                        <p className="font-semibold text-slate-900">Order #{order._id.slice(-8)}</p>
                        <p className="subtle-text text-sm">
                          {user ? `${user.name} (${user.email})` : 'User unavailable'} | {new Date(order.createdAt).toLocaleString()}
                        </p>
                        <p className="mt-1 text-sm text-slate-700">Items: {order.items.length}</p>
                        <p className="font-semibold text-emerald-700">Total: ${order.totalAmount.toFixed(2)}</p>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">{order.status}</span>
                        <select
                          defaultValue=""
                          onChange={(event) => {
                            const nextStatus = event.target.value as Exclude<OrderStatus, 'placed'> | '';
                            if (!nextStatus) {
                              return;
                            }
                            void updateOrderStatus(order._id, nextStatus);
                            event.currentTarget.value = '';
                          }}
                          className="rounded-lg border border-slate-300 bg-white px-2 py-1 text-sm text-slate-800"
                          disabled={order.status === 'delivered' || order.status === 'cancelled'}
                        >
                          <option value="" disabled>
                            Update status
                          </option>
                          {editableOrderStatuses.map((status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                );
              })}

              {orders.length === 0 && <p className="subtle-text text-sm">No orders found for selected filters.</p>}
            </div>
          </section>
        )}
      </div>
    </ProtectedRoute>
  );
}
