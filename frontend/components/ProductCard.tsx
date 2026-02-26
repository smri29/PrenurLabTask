'use client';

import { useState } from 'react';

import { Product } from '@/lib/types';

export const ProductCard = ({
  product,
  onAddToCart,
  isAuthenticated,
}: {
  product: Product;
  onAddToCart: (productId: string) => void;
  isAuthenticated: boolean;
}) => {
  const [expanded, setExpanded] = useState(false);
  const hasLongDescription = product.description.length > 120;

  return (
    <article className="glass-soft rounded-2xl p-4 transition hover:-translate-y-1 hover:border-cyan-300/40">
      <div className="mb-3 flex items-start justify-between gap-3">
        <h3 className="section-title text-lg font-semibold text-slate-900">{product.name}</h3>
        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">Stock {product.stock}</span>
      </div>
      <div className="min-h-22">
        <p className={`subtle-text text-sm leading-relaxed ${expanded ? 'h-20 overflow-y-auto pr-1' : 'h-20 overflow-hidden'}`}>
          {product.description}
        </p>
        {hasLongDescription && (
          <button
            type="button"
            onClick={() => setExpanded((prev) => !prev)}
            className="mt-1 text-xs font-semibold text-sky-700 hover:text-sky-800"
          >
            {expanded ? 'Show less' : 'Read more'}
          </button>
        )}
      </div>
      <p className="mt-3 text-base font-bold text-amber-700">${product.price.toFixed(2)}</p>
      <button
        type="button"
        disabled={!isAuthenticated || product.stock === 0}
        onClick={() => onAddToCart(product._id)}
        className="pill-btn mt-4 w-full bg-cyan-400/85 text-slate-950 hover:bg-cyan-300"
      >
        {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
      </button>
    </article>
  );
};
