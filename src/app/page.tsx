import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';
import Link from 'next/link';
import { AddToCartButton } from '@/components/cart/AddToCartButton';

export default async function CustomerStorefront() {
  const session = await getSession();
  
  const modeSetting = await db.settings.findUnique({
    where: { key: 'CUSTOMER_APP_MODE' },
  });
  const isPrivateStore = modeSetting?.value === 'PRIVATE';

  const products = await db.product.findMany({
    include: {
      pricing: true
    }
  });

  const showPrices = session?.role === 'CUSTOMER' || (!session && !isPrivateStore) || session?.role === 'SUPER_ADMIN' || session?.role === 'PRICING_MANAGER';

  return (
    <div>
      {/* Header */}
      <header className="glass-panel" style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        padding: '24px 40px',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        borderBottom: '1px solid var(--border-light)',
      }}>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '-0.02em', margin: 0 }}>SUPERMARKET</h1>
        
        <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
          {session ? (
            <>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Hello, {session.name}</span>
              {session.role === 'CUSTOMER' && (
                <Link href="/cart" className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>View Cart</Link>
              )}
              {session.role !== 'CUSTOMER' && (
                <Link href="/admin" className="btn btn-secondary" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>Admin</Link>
              )}
              <form action="/api/auth/logout" method="POST">
                <button type="submit" className="btn btn-secondary" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>Logout</button>
              </form>
            </>
          ) : (
            <Link href="/login" className="btn btn-primary" style={{ padding: '8px 24px', fontSize: '0.85rem' }}>Sign In</Link>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section style={{ padding: '120px 40px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        
        {/* Background Logo Watermark */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '80vw',
          maxWidth: '800px',
          height: '80vh',
          maxHeight: '800px',
          opacity: 0.04,
          zIndex: 0,
          pointerEvents: 'none',
          backgroundImage: 'url(/logo.jpg)',
          backgroundSize: 'contain',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          mixBlendMode: 'multiply'
        }}></div>

        <div className="blur-blob" style={{ width: '400px', height: '400px', top: '-100px', left: '-100px', zIndex: 0 }}></div>
        <div className="blur-blob" style={{ width: '300px', height: '300px', bottom: '-50px', right: '10%', background: '#60a5fa', zIndex: 0 }}></div>
        
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h2 className="title text-accent animate-fade-in" style={{ marginBottom: '24px' }}>BRUTAL<br/>FRESHNESS.</h2>
          <p className="subtitle animate-fade-in" style={{ maxWidth: '600px', margin: '0 auto 40px', animationDelay: '0.1s' }}>
            Uncompromising quality. Direct to your door. Experience the ultimate organic produce.
          </p>
          {!showPrices && (
            <div className="badge badge-warning animate-fade-in" style={{ animationDelay: '0.2s', padding: '12px 24px', fontSize: '1rem', background: '#fffbeb', boxShadow: '0 4px 12px rgba(245,158,11,0.2)' }}>
              PRIVATE STORE: SIGN IN FOR PRICING
            </div>
          )}
        </div>
      </section>

      {/* Marquee */}
      <div className="marquee-wrapper">
        <div className="marquee">
          ORGANIC • FRESH • DELIVERED • ORGANIC • FRESH • DELIVERED • ORGANIC • FRESH • DELIVERED • ORGANIC • FRESH • DELIVERED • 
        </div>
      </div>

      {/* Categories & Features Section (from reference image) */}
      <section style={{ padding: '60px 40px', maxWidth: '1600px', margin: '0 auto', background: '#f8fafc' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 style={{ color: '#166534', fontSize: '1.5rem', fontWeight: 800, margin: 0, textTransform: 'uppercase' }}>CATEGORIES</h2>
          <Link href="/categories" style={{ color: '#166534', fontWeight: 600, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
            View All <span style={{ fontSize: '1.2rem', lineHeight: 1 }}>→</span>
          </Link>
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', 
          gap: '16px',
          marginBottom: '40px'
        }}>
          {[
            { name: 'Drinks', color: '#3b82f6', icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2v20M8 6h8M6 10h12M4 14h16M12 2C8 2 5 5 5 10v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V10C19 5 16 2 12 2z" /></svg> },
            { name: 'Dairy', color: '#eab308', icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M6 10V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v5M6 10c-1.1 0-2 .9-2 2v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8c0-1.1-.9-2-2-2H6z" /></svg> },
            { name: 'Meat', color: '#ef4444', icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M7.5 13a4.5 4.5 0 0 1-4.5-4.5V8a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v.5a4.5 4.5 0 0 1-4.5 4.5zM12 13v8M9 21h6" /></svg> },
            { name: 'Frozen', color: '#06b6d4', icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2v20M2 12h20M4.93 4.93l14.14 14.14M19.07 4.93L4.93 19.07M16 12l-4-4M12 8L8 12M16 12l-4 4M12 16l-4-4" /></svg> },
            { name: 'Grains', color: '#f97316', icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" /></svg> },
            { name: 'Bakery', color: '#d97706', icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2a5 5 0 0 0-5 5v2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-9a2 2 0 0 0-2-2h-2V7a5 5 0 0 0-5-5zM9 7a3 3 0 0 1 6 0v2H9V7z" /></svg> },
            { name: 'Snacks', color: '#8b5cf6', icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM12 6v6l4 2" /></svg> },
            { name: 'Canned', color: '#64748b', icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 6h16M4 18h16M5 6v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V6M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" /></svg> },
            { name: 'Spices', color: '#10b981', icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2v6M12 16v6M6 12H2M22 12h-4M6.34 6.34L3.51 3.51M20.49 20.49l-2.83-2.83M6.34 17.66l-2.83 2.83M20.49 3.51l-2.83 2.83" /></svg> },
            { name: 'Cleaning', color: '#0ea5e9', icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2L2 22h20L12 2zM12 10v4M12 18h.01" /></svg> },
            { name: 'Care', color: '#ec4899', icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM9 10h.01M15 10h.01M12 14c-1.5 0-3 1-3 2h6c0-1-1.5-2-3-2z" /></svg> },
            { name: 'Baby', color: '#f43f5e', icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82zM7 7h.01" /></svg> },
          ].map((cat) => (
            <div key={cat.name} className="category-card" style={{ '--cat-color': cat.color } as React.CSSProperties}>
              <div className="cat-icon">{cat.icon}</div>
              <div className="cat-name">{cat.name}</div>
            </div>
          ))}
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
          gap: '16px' 
        }}>
          {[
            { title: 'Fast Delivery', subtitle: '30-60 mins', icon: '🛵' },
            { title: 'Best Quality', subtitle: '100% Guaranteed', icon: '🏅' },
            { title: 'Loyalty Points', subtitle: 'Earn & Save More', icon: '🎁' },
            { title: 'Secure Payment', subtitle: 'Multiple Options', icon: '💳' },
          ].map((feature) => (
            <div key={feature.title} style={{ 
              background: '#ffffff', 
              borderRadius: '16px', 
              padding: '20px', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '16px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
            }}>
              <div style={{ fontSize: '2.5rem' }}>{feature.icon}</div>
              <div>
                <div style={{ color: '#111827', fontWeight: 700, fontSize: '1rem', marginBottom: '4px' }}>{feature.title}</div>
                <div style={{ color: '#6b7280', fontSize: '0.85rem', fontWeight: 500 }}>{feature.subtitle}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Product Grid */}
      <main style={{ padding: '80px 40px', maxWidth: '1600px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px' }}>
          <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '3rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '-0.02em', margin: 0 }}>CATALOG</h3>
        </div>
        
        <div className="grid-cards">
          {products.map((product) => (
            <div key={product.id} className="brutalist-panel" style={{ padding: '32px', display: 'flex', flexDirection: 'column' }}>
              <div style={{ 
                height: '240px', 
                background: 'var(--bg-tertiary)', 
                marginBottom: '32px',
                border: '1px solid var(--border-light)'
              }}></div>
              
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
                  {product.category}
                </div>
                <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '12px', letterSpacing: '-0.02em' }}>{product.name}</h4>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-tertiary)' }}>{product.brand} • {product.weight} {product.unit}</p>
              </div>

              <div style={{ marginTop: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                {showPrices ? (
                  <span style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                    AED {product.pricing[0]?.sellingPrice.toFixed(2) || 'N/A'}
                  </span>
                ) : (
                  <span style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
                    HIDDEN
                  </span>
                )}
                
                <AddToCartButton productId={product.id} disabled={!showPrices} />
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
