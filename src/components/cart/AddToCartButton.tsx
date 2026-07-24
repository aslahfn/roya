'use client';

import { useTransition, useState } from 'react';
import { addToCart } from '@/app/actions/cart';

export function AddToCartButton({ productId, disabled }: { productId: string, disabled?: boolean }) {
  const [isPending, startTransition] = useTransition();
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    startTransition(async () => {
      try {
        await addToCart(productId);
        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
      } catch (err) {
        alert('Please sign in to add to cart.');
      }
    });
  };

  return (
    <button 
      onClick={handleAdd}
      className={`btn ${added ? 'btn-primary' : 'btn-secondary'}`} 
      style={{ padding: '12px 24px', fontSize: '0.85rem' }} 
      disabled={disabled || isPending}
    >
      {isPending ? 'ADDING...' : added ? '✓ ADDED' : 'ADD'}
    </button>
  );
}
