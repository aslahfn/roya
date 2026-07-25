import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';
import Link from 'next/link';
import { CartItemActions } from '@/components/cart/CartItemActions';
import { RoyalHeader } from '@/components/layout/RoyalHeader';
import { ArrowLeft, ShoppingBag, ArrowRight, Tag } from 'lucide-react';

export default async function CartPage() {
  const session = await getSession();

  if (!session) {
    return (
      <div style={{ background: '#f8fafc', minHeight: '100vh' }}>
        <RoyalHeader session={null} />
        <div style={{ padding: '60px 16px', textAlign: 'center' }}>
          <div style={{ fontSize: '3.5rem', marginBottom: '12px' }}>🔒</div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0F172A', marginBottom: '8px' }}>Sign in to View Cart</h2>
          <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '24px' }}>Access your fresh items across all your mobile devices.</p>
          <Link href="/login" style={{
            display: 'inline-block',
            background: '#16a34a',
            color: '#ffffff',
            padding: '12px 28px',
            borderRadius: '16px',
            fontWeight: 800,
            fontSize: '0.9rem',
            textDecoration: 'none'
          }}>
            Sign In Now
          </Link>
        </div>
      </div>
    );
  }

  const cart = await db.cart.findUnique({
    where: { userId: session.userId },
    include: {
      items: {
        include: {
          product: {
            include: { pricing: true }
          }
        },
        orderBy: { id: 'asc' }
      }
    }
  });

  const cartItems = cart?.items || [];
  let subtotal = 0;
  cartItems.forEach(item => {
    const price = item.product.pricing[0]?.sellingPrice || 0;
    subtotal += price * item.quantity;
  });

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh', paddingBottom: '100px' }}>
      <RoyalHeader session={session} />

      <div style={{ padding: '14px 14px 0' }}>
        {/* Navigation Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
          <Link href="/" style={{ color: '#16a34a', display: 'flex', alignItems: 'center', gap: '4px', textDecoration: 'none', fontSize: '0.82rem', fontWeight: 700 }}>
            <ArrowLeft size={16} /> Back to Store
          </Link>
        </div>

        <h1 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#0F172A', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span>Shopping Cart</span>
          <span style={{ fontSize: '0.8rem', background: '#dcfce7', color: '#15803d', padding: '2px 8px', borderRadius: '12px', fontWeight: 800 }}>
            {cartItems.reduce((acc, curr) => acc + curr.quantity, 0)} items
          </span>
        </h1>

        {cartItems.length === 0 ? (
          <div style={{
            background: '#ffffff',
            borderRadius: '20px',
            padding: '40px 20px',
            textAlign: 'center',
            border: '1px solid rgba(22, 163, 74, 0.15)',
            boxShadow: '0 4px 14px rgba(0,0,0,0.04)'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '12px' }}>🛒</div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0F172A', marginBottom: '8px' }}>Your Cart is Empty</h2>
            <p style={{ fontSize: '0.82rem', color: '#64748b', marginBottom: '20px' }}>Explore fresh fruits, daily dairy & organic groceries!</p>
            <Link href="/" style={{
              display: 'inline-block',
              background: '#16a34a',
              color: '#ffffff',
              padding: '12px 24px',
              borderRadius: '16px',
              fontWeight: 800,
              fontSize: '0.88rem',
              textDecoration: 'none'
            }}>
              Start Shopping
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            
            {/* Cart Items List */}
            {cartItems.map(item => {
              const unitPrice = item.product.pricing[0]?.sellingPrice || 0;
              const itemTotal = unitPrice * item.quantity;
              
              return (
                <div
                  key={item.id}
                  style={{
                    background: '#ffffff',
                    borderRadius: '16px',
                    padding: '12px',
                    border: '1px solid rgba(22, 163, 74, 0.14)',
                    boxShadow: '0 4px 12px rgba(6, 56, 33, 0.04)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px'
                  }}
                >
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <div style={{
                      width: '64px',
                      height: '64px',
                      borderRadius: '12px',
                      background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.6rem',
                      flexShrink: 0
                    }}>
                      🥦
                    </div>

                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '0.65rem', color: '#16a34a', fontWeight: 800, textTransform: 'uppercase' }}>
                        {item.product.category}
                      </div>
                      <div style={{ fontWeight: 800, fontSize: '0.92rem', color: '#0F172A', lineHeight: 1.2 }}>
                        {item.product.name}
                      </div>
                      <div style={{ color: '#64748b', fontSize: '0.72rem', marginTop: '2px' }}>
                        {item.product.brand} • {item.product.weight} {item.product.unit}
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '0.92rem', fontWeight: 900, color: '#0A4D2E' }}>
                        AED {itemTotal.toFixed(2)}
                      </div>
                      <div style={{ fontSize: '0.68rem', color: '#94a3b8' }}>
                        AED {unitPrice.toFixed(2)} / ea
                      </div>
                    </div>
                  </div>

                  {/* Quantity Actions */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    paddingTop: '8px',
                    borderTop: '1px solid #f1f5f9'
                  }}>
                    <CartItemActions itemId={item.id} initialQuantity={item.quantity} />
                  </div>
                </div>
              );
            })}

            {/* Promo Code Input */}
            <div style={{
              background: '#ffffff',
              borderRadius: '16px',
              padding: '12px 14px',
              border: '1px solid rgba(22, 163, 74, 0.14)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginTop: '4px'
            }}>
              <Tag size={16} color="#16a34a" />
              <input
                type="text"
                placeholder="Enter promo code (e.g. ROYAL10)"
                style={{
                  flex: 1,
                  border: 'none',
                  outline: 'none',
                  fontSize: '0.82rem',
                  color: '#0F172A'
                }}
              />
              <button style={{
                background: '#f0fdf4',
                color: '#16a34a',
                border: '1px solid #16a34a',
                borderRadius: '10px',
                padding: '6px 12px',
                fontWeight: 800,
                fontSize: '0.75rem',
                cursor: 'pointer'
              }}>
                APPLY
              </button>
            </div>

            {/* Price Breakdown Card */}
            <div style={{
              background: '#ffffff',
              borderRadius: '16px',
              padding: '14px',
              border: '1px solid rgba(22, 163, 74, 0.14)',
              boxShadow: '0 4px 12px rgba(6, 56, 33, 0.04)',
              marginTop: '4px'
            }}>
              <h3 style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0F172A', marginBottom: '10px' }}>Bill Details</h3>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', color: '#64748b', marginBottom: '6px' }}>
                <span>Item Subtotal</span>
                <span style={{ fontWeight: 700, color: '#0F172A' }}>AED {subtotal.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', color: '#64748b', marginBottom: '8px' }}>
                <span>Delivery Fee</span>
                <span style={{ fontWeight: 700, color: '#16a34a' }}>FREE</span>
              </div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                paddingTop: '8px',
                borderTop: '1px solid #f1f5f9',
                fontSize: '0.95rem',
                fontWeight: 900,
                color: '#0A4D2E'
              }}>
                <span>Total Amount</span>
                <span>AED {subtotal.toFixed(2)}</span>
              </div>
            </div>

            {/* Mobile Fixed Sticky Checkout CTA Bar */}
            <div style={{
              position: 'fixed',
              bottom: '56px',
              left: 0,
              right: 0,
              zIndex: 990,
              display: 'flex',
              justifyContent: 'center',
              padding: '0 12px'
            }}>
              <div style={{
                width: '100%',
                maxWidth: '480px',
                background: '#ffffff',
                borderTop: '1px solid rgba(22, 163, 74, 0.18)',
                padding: '10px 14px',
                boxShadow: '0 -6px 20px rgba(0,0,0,0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderRadius: '16px 16px 0 0'
              }}>
                <div>
                  <div style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: 600 }}>Total Payable</div>
                  <div style={{ fontSize: '1.15rem', fontWeight: 900, color: '#0A4D2E', lineHeight: 1 }}>
                    AED {subtotal.toFixed(2)}
                  </div>
                </div>

                <Link
                  href="/checkout"
                  className="touch-active"
                  style={{
                    background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
                    color: '#ffffff',
                    padding: '12px 22px',
                    borderRadius: '14px',
                    fontWeight: 800,
                    fontSize: '0.88rem',
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    boxShadow: '0 4px 14px rgba(22, 163, 74, 0.3)'
                  }}
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
