import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';
import Link from 'next/link';
import { CartItemActions } from '@/components/cart/CartItemActions';

export default async function CartPage() {
  const session = await getSession();

  if (!session) {
    return (
      <div style={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-primary)' }}>
        <div className="glass-panel" style={{ padding: '60px', textAlign: 'center' }}>
          <h1 className="title">Access Denied</h1>
          <p className="subtitle">Please sign in to view your cart.</p>
          <Link href="/login" className="btn btn-primary" style={{ marginTop: '24px' }}>Sign In</Link>
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
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', padding: '60px 20px', position: 'relative', overflow: 'hidden' }}>
      <div className="blur-blob" style={{ width: '400px', height: '400px', top: '5%', left: '-5%' }}></div>
      <div className="blur-blob" style={{ width: '300px', height: '300px', bottom: '10%', right: '-5%', background: 'var(--accent-primary)' }}></div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <header style={{ marginBottom: '40px', borderBottom: '1px solid var(--border-light)', paddingBottom: '24px' }}>
          <Link href="/" style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '16px', display: 'inline-block' }}>← BACK TO STORE</Link>
          <h1 className="title" style={{ fontSize: '3rem', margin: 0, lineHeight: 1 }}>SHOPPING<br/><span className="text-accent">CART</span></h1>
        </header>

        {cartItems.length === 0 ? (
          <div className="glass-panel" style={{ padding: '60px', textAlign: 'center' }}>
            <div style={{ fontSize: '4rem', marginBottom: '16px' }}>🛒</div>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', fontWeight: 700, marginBottom: '16px' }}>YOUR CART IS EMPTY</h2>
            <Link href="/" className="btn btn-primary">Start Shopping</Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '40px' }}>
            
            {/* Cart Items List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {cartItems.map(item => (
                <div key={item.id} className="glass-panel" style={{ padding: '24px', display: 'flex', gap: '24px', alignItems: 'center' }}>
                  <div style={{ width: '100px', height: '100px', background: 'var(--bg-tertiary)', borderRadius: '8px' }}></div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase' }}>{item.product.category}</div>
                    <div style={{ fontWeight: 700, fontSize: '1.25rem' }}>{item.product.name}</div>
                    <div style={{ color: 'var(--text-tertiary)', fontSize: '0.85rem' }}>{item.product.brand} • {item.product.weight} {item.product.unit}</div>
                  </div>
                  <div style={{ fontWeight: 800, fontSize: '1.5rem', width: '120px', textAlign: 'right' }}>
                    AED {(item.product.pricing[0]?.sellingPrice || 0).toFixed(2)}
                  </div>
                  <CartItemActions itemId={item.id} initialQuantity={item.quantity} />
                </div>
              ))}
            </div>

            {/* Cart Summary */}
            <div className="glass-panel" style={{ padding: '32px', height: 'fit-content', position: 'sticky', top: '100px' }}>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 800, marginBottom: '24px' }}>SUMMARY</h3>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span style={{ color: 'var(--text-secondary)' }}>SUBTOTAL</span>
                <span style={{ fontWeight: 700 }}>AED {subtotal.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px', paddingBottom: '24px', borderBottom: '1px solid var(--border-light)' }}>
                <span style={{ color: 'var(--text-secondary)' }}>DELIVERY</span>
                <span style={{ fontWeight: 700 }}>Calculated at Checkout</span>
              </div>

              <div className="input-group">
                <label className="input-label">COUPON CODE</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input type="text" className="input-field" style={{ flex: 1, padding: '8px' }} placeholder="ENTER CODE" />
                  <button className="btn btn-secondary" style={{ padding: '8px 16px' }}>APPLY</button>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '24px', marginBottom: '32px' }}>
                <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', fontWeight: 800 }}>ESTIMATED TOTAL</span>
                <span style={{ fontFamily: 'var(--font-heading)', fontSize: '2.5rem', fontWeight: 800, color: 'var(--accent-primary)', lineHeight: 1 }}>AED {subtotal.toFixed(2)}</span>
              </div>

              <Link href="/checkout" className="btn btn-primary" style={{ width: '100%', padding: '20px', fontSize: '1.1rem' }}>PROCEED TO CHECKOUT</Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
