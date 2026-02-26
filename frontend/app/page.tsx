'use client';

import { FormEvent, useEffect, useState } from 'react';

import { ProductCard } from '@/components/ProductCard';
import { useAuth } from '@/context/AuthContext';
import { apiRequest } from '@/lib/api';
import { Product } from '@/lib/types';

interface ProductListPayload {
  items: Product[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export default function Home() {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const loadProducts = async (targetPage: number, targetSearch: string): Promise<void> => {
    try {
      setError('');
      const response = await apiRequest<ProductListPayload>(
        `/products?page=${targetPage}&limit=6&search=${encodeURIComponent(targetSearch)}`,
        { method: 'GET' },
      );

      setProducts(response.data?.items ?? []);
      setTotalPages(response.data?.pagination.totalPages ?? 1);
      setPage(response.data?.pagination.page ?? 1);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch products');
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      void loadProducts(1, '');
    }, 0);

    return () => clearTimeout(timeoutId);
  }, []);

  const handleSearch = (event: FormEvent): void => {
    event.preventDefault();
    void loadProducts(1, search);
  };

  const handleAddToCart = async (productId: string): Promise<void> => {
    try {
      await apiRequest('/cart', {
        method: 'POST',
        body: JSON.stringify({ productId, quantity: 1 }),
      });
      setNotice('Product added to cart.');
      setTimeout(() => setNotice(''), 1800);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add product');
    }
  };

  return (
    <div className="space-y-6">
      <section className="glass-card rounded-2xl p-6">
        <h1 className="section-title text-3xl font-bold text-slate-900">Crafted Product Catalog</h1>
        <p className="subtle-text mt-2 text-sm">Search by name or description, then add products directly to your cart.</p>

        <form className="mt-5 flex flex-col gap-2 md:flex-row" onSubmit={handleSearch}>
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="w-full rounded-xl border border-slate-300 bg-white/80 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-cyan-500"
            placeholder="Search products..."
          />
          <button type="submit" className="pill-btn bg-cyan-400/90 px-6 text-slate-950 hover:bg-cyan-300">
            Search
          </button>
        </form>
      </section>

      {error && <p className="rounded-xl border border-rose-300 bg-rose-50 p-3 text-sm text-rose-700">{error}</p>}
      {notice && <p className="rounded-xl border border-emerald-300 bg-emerald-50 p-3 text-sm text-emerald-700">{notice}</p>}

      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <ProductCard
            key={product._id}
            product={product}
            onAddToCart={handleAddToCart}
            isAuthenticated={user?.role === 'user'}
          />
        ))}
      </section>

      <div className="flex items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => void loadProducts(page - 1, search)}
          disabled={page <= 1}
          className="pill-btn bg-slate-200 text-slate-700"
        >
          Prev
        </button>
        <span className="rounded-full bg-white/80 px-3 py-1 text-sm text-slate-700">
          Page {page} of {totalPages}
        </span>
        <button
          type="button"
          onClick={() => void loadProducts(page + 1, search)}
          disabled={page >= totalPages}
          className="pill-btn bg-slate-200 text-slate-700"
        >
          Next
        </button>
      </div>
    </div>
  );
}
