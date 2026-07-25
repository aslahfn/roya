'use client';

import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useNotifications } from '@/context/NotificationContext';
import { RoyalHeader } from '@/components/layout/RoyalHeader';
import { ArrowLeft, ShoppingBag, ArrowRight, Trash2, Plus, Minus } from 'lucide-react';
import { useState } from 'react';

export default function CartPage() {
  const { items, subtotal, totalQuantity, updateQuantity, removeFromCart, clearCart } = useCart();
  const { addNotification } = useNotifications();
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  const handleCheckout = async () => {
    if (items.length === 0) return;
    setIsPlacingOrder(true);

    const orderNumber = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
    const itemsSummary = items.map(i => `${i.name} (${i.quantity} ${i.unit || 'Piece'})`).join(', ');

    // Send instant Notification to Admin (Requirement 5)
    addNotification({
      roleTarget: 'ADMIN',
      title: `📦 New Order Received #${orderNumber}`,
      message: `Customer placed an order for ${items.length} items (${itemsSummary}).`,
      type: 'NEW_ORDER',
      data: {
        customerName: 'Dave Customer',
        orderNumber,
        itemsOrdered: itemsSummary,
        totalAmount: subtotal + 5.00,
        paymentMethod: 'Cash on Delivery',
        deliveryAddress: 'King Fahd Road, Riyadh, KSA',
        orderTime: new Date().toLocaleTimeString()
      }
    });

    setTimeout(() => {
      clearCart();
      setIsPlacingOrder(false);
      window.location.href = `/orders?created=${orderNumber}`;
    }, 1200);
  };

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh', paddingBottom: '100px' }}>
      <RoyalHeader />

      <div style={{ padding: '20px', maxWidth: '1400px', margin: '0 auto' }}>
        {/* Navigation Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <Link href="/" style={{ color: '#16a34a', display: 'flex', alignItems: 'center', gap: '4px', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 700 }}>
            <ArrowLeft size={16} /> Back to Storefront
          </Link>
        </div>

        <h1 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#0F172A', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span>Shopping Cart</span>
          <span style={{ fontSize: '0.85rem', background: '#dcfce7', color: '#15803d', padding: '4px 10px', borderRadius: '14px', fontWeight: 800 }}>
            {totalQuantity} items
          </span>
        </h1>

        {items.length === 0 ? (
          <div style={{
            background: '#ffffff',
            borderRadius: '24px',
            padding: '60px 20px',
            textAlign: 'center',
            border: '1px solid rgba(22, 163, 74, 0.15)',
            boxShadow: '0 4px 14px rgba(0,0,0,0.04)',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            <div style={{ fontSize: '3.5rem', marginBottom: '16px' }}>🛒</div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0F172A', marginBottom: '8px' }}>Your Cart is Empty</h2>
            <p style={{ fontSize: '0.88rem', color: '#64748b', marginBottom: '24px' }}>Explore fresh fruits, daily dairy & organic groceries!</p>
            <Link href="/" style={{
              display: 'inline-block',
              background: '#16a34a',
              color: '#ffffff',
              padding: '14px 28px',
              borderRadius: '16px',
              fontWeight: 800,
              fontSize: '0.9rem',
              textDecoration: 'none'
            }}>
              Start Shopping
            </Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', alignItems: 'start' }}>
            
            {/* Cart Items List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {items.map(item => {
                const itemTotal = item.price * item.quantity;
                
                return (
                  <div
                    key={item.id}
                    style={{
                      background: '#ffffff',
                      borderRadius: '20px',
                      padding: '16px',
                      border: '1px solid rgba(22, 163, 74, 0.14)',
                      boxShadow: '0 4px 12px rgba(6, 56, 33, 0.04)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '12px'
                    }}
                  >
                    <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                      <div style={{
                        width: '72px',
                        height: '72px',
                        borderRadius: '14px',
                        background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.8rem',
                        flexShrink: 0
                      }}>
                        {item.category === 'Drinks' ? '🧃' : item.category === 'Dairy' ? '🥛' : '🥦'}
                      </div>

                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '0.68rem', color: '#16a34a', fontWeight: 800, textTransform: 'uppercase' }}>
                          {item.category || 'GROCERY'}
                        </div>
                        <div style={{ fontWeight: 800, fontSize: '1rem', color: '#0F172A', lineHeight: 1.2 }}>
                          {item.name}
                        </div>
                        <div style={{ color: '#16a34a', fontSize: '0.78rem', marginTop: '2px', fontWeight: 700 }}>
                          Unit: 1 {item.unit || 'Piece'}
                        </div>
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '1.05rem', fontWeight: 900, color: '#0A4D2E' }}>
                          AED {itemTotal.toFixed(2)}
                        </div>
                        <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                          AED {item.price.toFixed(2)} / {item.unit || 'ea'}
                        </div>
                      </div>
                    </div>

                    {/* Quantity Control Actions */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      paddingTop: '10px',
                      borderTop: '1px solid #f1f5f9'
                    }}>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#ef4444',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          fontSize: '0.78rem',
                          fontWeight: 700
                        }}
                      >
                        <Trash2 size={14} /> Remove
                      </button>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#f8fafc', padding: '4px 8px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '8px', width: '28px', height: '28px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        >
                          <Minus size={14} />
                        </button>
                        <span style={{ fontWeight: 800, fontSize: '0.9rem', minWidth: '24px', textAlign: 'center' }}>
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '8px', width: '28px', height: '28px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Cart Summary Panel */}
            <div style={{
              background: '#ffffff',
              borderRadius: '24px',
              padding: '24px',
              border: '1px solid rgba(22, 163, 74, 0.18)',
              boxShadow: '0 6px 20px rgba(6, 56, 33, 0.06)',
              position: 'sticky',
              top: '100px'
            }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 900, color: '#0F172A', marginBottom: '16px' }}>Order Summary</h3>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', color: '#64748b', marginBottom: '10px' }}>
                <span>Item Subtotal</span>
                <span style={{ fontWeight: 800, color: '#0F172A' }}>AED {subtotal.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', color: '#64748b', marginBottom: '10px' }}>
                <span>Delivery Charge</span>
                <span style={{ fontWeight: 800, color: '#16a34a' }}>AED 5.00</span>
              </div>

              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                paddingTop: '14px',
                borderTop: '1px solid #f1f5f9',
                fontSize: '1.1rem',
                fontWeight: 900,
                color: '#0A4D2E',
                marginBottom: '24px'
              }}>
                <span>Grand Total</span>
                <span>AED {(subtotal + 5.00).toFixed(2)}</span>
              </div>

              <button
                onClick={handleCheckout}
                disabled={isPlacingOrder}
                className="touch-active"
                style={{
                  background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
                  color: '#ffffff',
                  padding: '16px',
                  borderRadius: '16px',
                  fontWeight: 800,
                  fontSize: '0.95rem',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: '0 6px 20px rgba(22, 163, 74, 0.35)',
                  width: '100%'
                }}
              >
                <span>{isPlacingOrder ? 'PLACING ORDER...' : 'Place Order & Notify Admin'}</span>
                <ArrowRight size={18} />
              </button>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
