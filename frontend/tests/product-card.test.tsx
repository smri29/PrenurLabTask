import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { ProductCard } from '@/components/ProductCard';

describe('ProductCard', () => {
  it('renders product details and handles add to cart', async () => {
    const user = userEvent.setup();
    const onAddToCart = vi.fn();

    render(
      <ProductCard
        product={{
          _id: '1',
          name: 'Test Item',
          description: 'Test description',
          price: 20,
          stock: 3,
        }}
        onAddToCart={onAddToCart}
        isAuthenticated
      />,
    );

    expect(screen.getByText('Test Item')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Add to Cart' }));
    expect(onAddToCart).toHaveBeenCalledWith('1');
  });
});