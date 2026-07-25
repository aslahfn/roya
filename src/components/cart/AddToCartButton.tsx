'use client';

import { useRef, useState } from 'react';
import { useCart } from '@/context/CartContext';
import { ShoppingBag } from 'lucide-react';

interface AddToCartButtonProps {
  product: {
    id: string;
    name: string;
    price: number;
    unit?: string;
    image?: string;
    category?: string;
  };
  disabled?: boolean;
}

export function AddToCartButton({ product, disabled }: AddToCartButtonProps) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, btnRef.current);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <button
      ref={btnRef}
      onClick={handleAdd}
      disabled={disabled}
      className="touch-active"
      style={{
        padding: '8px 16px',
        fontSize: '0.82rem',
        fontWeight: 800,
        borderRadius: '16px',
        border: 'none',
        cursor: disabled ? 'not-allowed' : 'pointer',
        background: added
          ? 'linear-gradient(135deg, #15803d 0%, #166534 100%)'
          : 'linear-gradient(135deg, #16A34A 0%, #15803D 100%)',
        color: '#ffffff',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        boxShadow: '0 4px 12px rgba(22, 163, 74, 0.3)',
        transition: 'all 0.2s ease',
        opacity: disabled ? 0.6 : 1,
      }}
    >
      <ShoppingBag size={14} />
      <span>{added ? '✓ ADDED' : 'ADD'}</span>
    </button>
  );
}
