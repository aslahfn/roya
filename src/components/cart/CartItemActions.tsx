'use client';

import { useTransition } from 'react';
import { updateCartItem, removeCartItem } from '@/app/actions/cart';

export function CartItemActions({ itemId, initialQuantity }: { itemId: string, initialQuantity: number }) {
  const [isPending, startTransition] = useTransition();

  const handleUpdate = (newQuantity: number) => {
    startTransition(async () => {
      await updateCartItem(itemId, newQuantity);
    });
  };

  const handleRemove = () => {
    startTransition(async () => {
      await removeCartItem(itemId);
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-end', opacity: isPending ? 0.5 : 1 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', border: '1px solid var(--border-light)', padding: '4px', borderRadius: '4px' }}>
        <button 
          onClick={() => handleUpdate(initialQuantity - 1)} 
          disabled={isPending}
          style={{ width: '32px', height: '32px', background: 'var(--bg-tertiary)', border: 'none', cursor: 'pointer', fontWeight: 700 }}
        >
          -
        </button>
        <div style={{ width: '24px', textAlign: 'center', fontWeight: 600 }}>{initialQuantity}</div>
        <button 
          onClick={() => handleUpdate(initialQuantity + 1)} 
          disabled={isPending}
          style={{ width: '32px', height: '32px', background: 'var(--bg-tertiary)', border: 'none', cursor: 'pointer', fontWeight: 700 }}
        >
          +
        </button>
      </div>
      <button 
        onClick={handleRemove}
        disabled={isPending}
        style={{ background: 'none', border: 'none', color: '#ef4444', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', textTransform: 'uppercase' }}
      >
        Remove
      </button>
    </div>
  );
}
