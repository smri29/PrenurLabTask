'use client';

import { useEffect, useState } from 'react';

import { ProtectedRoute } from '@/components/ProtectedRoute';
import { useAuth } from '@/context/AuthContext';
import { apiRequest } from '@/lib/api';
import { CartItem } from '@/lib/types';

interface CartResponse {
  items: CartItem[];
}

export default function CartPage() {
  const { user } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [busyProductId, setBusyProductId] = useState<string | null>(null);
  const [isClearing, setIsClearing] = useState(false);

  const loadCart = async (): Promise<void> => {
    try {
      const response = await apiRequest<CartResponse>('/cart', { method: 'GET' });
      setItems(response.data?.items ?? []);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch cart');
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      void loadCart();
    }, 0);

    return () => clearTimeout(timeoutId);
  }, []);

  const removeItem = async (productId: string): Promise<void> => {
    try {
      setBusyProductId(productId);
      await apiRequest(`/cart/${productId}`, { method: 'DELETE' });
      await loadCart();
    } finally {
      setBusyProductId(null);
    }
  };

  const updateQuantity = async (productId: string, nextQuantity: number): Promise<void> => {
    try {
      setBusyProductId(productId);
      await apiRequest(`/cart/${productId}`, {
        method: 'PATCH',
        body: JSON.stringify({ quantity: nextQuantity }),
      });
      await loadCart();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update quantity');
    } finally {
      setBusyProductId(null);
    }
  };

  const clearCart = async (): Promise<void> => {
    try {
      setIsClearing(true);
      await apiRequest('/cart', { method: 'DELETE' });
      await loadCart();
      setNotice('Cart cleared successfully.');
      setTimeout(() => setNotice(''), 1800);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to clear cart');
    } finally {
      setIsClearing(false);
    }
  };

  const placeOrder = async (): Promise<void> => {
    try {
      await apiRequest('/orders', { method: 'POST' });
      await loadCart();
      setNotice('Order placed successfully.');
      setTimeout(() => setNotice(''), 1800);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Order failed');
    }
  };

  const total = items.reduce((sum, item) => sum + item.productId.price * item.quantity, 0);

  return (
    <ProtectedRoute>
      {user?.role === 'admin' ? (
        <div className="rounded-2xl p-6 glass-card">
          <h1 className="section-title text-3xl font-semibold text-slate-900">Cart Access Restricted</h1>
          <p className="subtle-text mt-2">Admin accounts cannot perform customer purchase activities.</p>
        </div>
      ) : (
      <div className="space-y-4 rounded-2xl p-6 glass-card">
        <h1 className="section-title text-3xl font-semibold text-slate-900">Cart</h1>
        {error && <p className="rounded-lg bg-rose-50 p-3 text-sm text-rose-700">{error}</p>}
        {notice && <p className="rounded-lg bg-emerald-50 p-3 text-sm text-emerald-700">{notice}</p>}

        {items.length === 0 ? (
          <p className="subtle-text">Your cart is empty.</p>
        ) : (
          <>
            <div className="space-y-2">
              {items.map((item) => (
                <div key={item.productId._id} className="glass-soft flex items-center justify-between rounded-xl p-3">
                  <div>
                    <p className="font-semibold text-slate-900">{item.productId.name}</p>
                    <p className="subtle-text text-sm">
                      ${item.productId.price.toFixed(2)} x {item.quantity} = ${(item.productId.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => void updateQuantity(item.productId._id, item.quantity - 1)}
                      disabled={item.quantity <= 1 || busyProductId === item.productId._id}
                      className="pill-btn bg-slate-200 text-slate-700"
                    >
                      -
                    </button>
                    <span className="min-w-8 text-center text-sm font-semibold text-slate-800">{item.quantity}</span>
                    <button
                      type="button"
                      onClick={() => void updateQuantity(item.productId._id, item.quantity + 1)}
                      disabled={item.quantity >= item.productId.stock || busyProductId === item.productId._id}
                      className="pill-btn bg-slate-200 text-slate-700"
                    >
                      +
                    </button>
                    <button
                      type="button"
                      onClick={() => void removeItem(item.productId._id)}
                      disabled={busyProductId === item.productId._id}
                      className="pill-btn bg-rose-500/85 text-white"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-col items-start justify-between gap-3 md:flex-row md:items-center">
              <p className="text-lg font-bold text-amber-700">Total: ${total.toFixed(2)}</p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => void clearCart()}
                  disabled={isClearing}
                  className="pill-btn bg-slate-700 text-white hover:bg-slate-800"
                >
                  Clear Cart
                </button>
                <button type="button" onClick={() => void placeOrder()} className="pill-btn bg-cyan-400/90 text-slate-950">
                  Place Order
                </button>
              </div>
            </div>
          </>
        )}
      </div>
      )}
    </ProtectedRoute>
  );
}
