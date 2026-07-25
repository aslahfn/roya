import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';
import Link from 'next/link';
import { AddToCartButton } from '@/components/cart/AddToCartButton';
import { RoyalHeader } from '@/components/layout/RoyalHeader';
import { Sparkles, Truck, Award, ShieldCheck, Gift, ArrowRight } from 'lucide-react';

export default async function CustomerStorefront() {
  const session = await getSession();
  
  let modeSetting = null;
  let products: any[] = [];

  try {
    modeSetting = await db.settings.findUnique({
      where: { key: 'CUSTOMER_APP_MODE' },
    });
    products = await db.product.findMany({
      include: { pricing: true }
    });
  } catch (err) {
    console.error('Storefront DB Fetch Error:', err);
  }

  const isPrivateStore = modeSetting?.value === 'PRIVATE';
  const showPrices = session?.role === 'CUSTOMER' || (!session && !isPrivateStore) || session?.role === 'SUPER_ADMIN' || session?.role === 'PRICING_MANAGER';

  const categories = [
    { name: 'Drinks', emoji: '🧃', color: '#eff6ff', textColor: '#1d4ed8' },
    { name: 'Dairy', emoji: '🧀', color: '#fefce8', textColor: '#a16207' },
    { name: 'Meat', emoji: '🥩', color: '#fef2f2', textColor: '#b91c1c' },
    { name: 'Frozen', emoji: '🧊', color: '#ecfeff', textColor: '#0e7490' },
    { name: 'Grains', emoji: '🌾', color: '#fff7ed', textColor: '#c2410c' },
    { name: 'Bakery', emoji: '🥐', color: '#fffbe6', textColor: '#b45309' },
    { name: 'Snacks', emoji: '🍿', color: '#f3e8ff', textColor: '#7e22ce' },
    { name: 'Spices', emoji: '🌶️', color: '#ecfdf5', textColor: '#047857' },
  ];

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh' }}>
      <RoyalHeader session={session} />

      {/* Hero Banner Section */}
      <section style={{ padding: '16px 20px 4px', maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{
          background: 'linear-gradient(135deg, #0A4D2E 0%, #15803d 100%)',
          borderRadius: '24px',
          padding: '28px 24px',
          color: '#ffffff',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 10px 30px rgba(10, 77, 46, 0.25)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ maxWidth: '640px', zIndex: 1 }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: 'rgba(255,184,0,0.2)',
              color: '#FFB800',
              padding: '4px 12px',
              borderRadius: '12px',
              fontSize: '0.78rem',
              fontWeight: 800,
              marginBottom: '10px'
            }}>
              <Sparkles size={14} />
              <span>SUPERMARKET DIRECT EXPRESS</span>
            </div>

            <h2 style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(1.4rem, 3.5vw, 2.5rem)',
              fontWeight: 900,
              lineHeight: 1.15,
              marginBottom: '10px'
            }}>
              Farm Fresh Organic Produce Delivered in 30 Mins 🚀
            </h2>

            <p style={{ fontSize: 'clamp(0.82rem, 1.2vw, 1rem)', color: '#DCFCE7', marginBottom: '18px', opacity: 0.95 }}>
              Handpicked fruits, daily dairy essentials & premium meats direct to your doorstep.
            </p>

            {!showPrices && (
              <div style={{
                background: '#FEF3C7',
                color: '#92400E',
                padding: '8px 16px',
                borderRadius: '12px',
                fontSize: '0.82rem',
                fontWeight: 800,
                display: 'inline-block'
              }}>
                🔒 Private Store: Sign in to view pricing
              </div>
            )}
          </div>

          <div className="desktop-only-block" style={{ zIndex: 1 }}>
            <div style={{
              background: 'rgba(255,255,255,0.12)',
              backdropFilter: 'blur(10px)',
              padding: '24px 32px',
              borderRadius: '20px',
              textAlign: 'center',
              border: '1px solid rgba(255,255,255,0.2)'
            }}>
              <div style={{ fontSize: '3.5rem', marginBottom: '8px' }}>🥦🍎🥩</div>
              <div style={{ fontWeight: 800, fontSize: '1.1rem', color: '#FFB800' }}>100% Quality Guaranteed</div>
              <div style={{ fontSize: '0.8rem', color: '#e2e8f0' }}>Zero hassle returns</div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section id="categories" style={{ padding: '16px 20px 8px', maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
            Shop by Category
          </h3>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#16a34a' }}>
            Explore All →
          </span>
        </div>

        {/* Scrollable pill container on Mobile, Grid on Desktop */}
        <div className="no-scrollbar" style={{
          display: 'flex',
          gap: '12px',
          overflowX: 'auto',
          paddingBottom: '4px'
        }}>
          {categories.map((cat) => (
            <div
              key={cat.name}
              className="touch-active"
              style={{
                flexShrink: 0,
                background: cat.color,
                border: '1px solid rgba(22, 163, 74, 0.14)',
                borderRadius: '16px',
                padding: '12px 18px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
              }}
            >
              <span style={{ fontSize: '1.5rem' }}>{cat.emoji}</span>
              <span style={{ fontSize: '0.88rem', fontWeight: 800, color: cat.textColor, whiteSpace: 'nowrap' }}>
                {cat.name}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Highlights Grid */}
      <section style={{ padding: '8px 20px 16px', maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '12px'
        }}>
          {[
            { label: '30-60 Min Express Delivery', icon: Truck, color: '#16a34a' },
            { label: '100% Organic Fresh', icon: Award, color: '#eab308' },
            { label: 'Secure Checkout', icon: ShieldCheck, color: '#2563eb' },
            { label: 'Loyalty Rewards Points', icon: Gift, color: '#9333ea' },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.label} style={{
                background: '#ffffff',
                border: '1px solid rgba(22, 163, 74, 0.14)',
                borderRadius: '16px',
                padding: '12px 16px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                boxShadow: '0 2px 6px rgba(0,0,0,0.02)'
              }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: `${item.color}15`,
                  color: item.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <Icon size={18} />
                </div>
                <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#334155', lineHeight: 1.2 }}>
                  {item.label}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* Responsive Product Catalog Section */}
      <main style={{ padding: '0 20px 40px', maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0F172A', margin: 0 }}>
            Fresh Catalog
          </h3>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b' }}>
            {products.length} products available
          </span>
        </div>

        {/* Responsive Dual Product Grid */}
        <div className="responsive-product-grid">
          {products.map((product) => (
            <div
              key={product.id}
              className="touch-active"
              style={{
                background: '#ffffff',
                borderRadius: '20px',
                border: '1px solid rgba(22, 163, 74, 0.15)',
                padding: '14px',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: '0 4px 14px rgba(6, 56, 33, 0.05)',
                position: 'relative'
              }}
            >
              {/* Product Thumbnail */}
              <div style={{
                height: '140px',
                borderRadius: '14px',
                background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '12px',
                position: 'relative'
              }}>
                <span style={{ fontSize: '3rem' }}>
                  {product.category === 'Drinks' ? '🧃' : product.category === 'Dairy' ? '🧀' : product.category === 'Meat' ? '🥩' : '🥦'}
                </span>
                <span style={{
                  position: 'absolute',
                  top: '8px',
                  left: '8px',
                  background: '#16a34a',
                  color: '#ffffff',
                  fontSize: '0.65rem',
                  fontWeight: 800,
                  padding: '2px 8px',
                  borderRadius: '8px'
                }}>
                  FRESH
                </span>
              </div>

              {/* Product Details */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{ fontSize: '0.68rem', color: '#16a34a', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  {product.category}
                </div>
                <h4 style={{
                  fontSize: '0.95rem',
                  fontWeight: 800,
                  color: '#0F172A',
                  margin: '4px 0 6px',
                  lineHeight: 1.25,
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden'
                }}>
                  {product.name}
                </h4>
                <div style={{ fontSize: '0.78rem', color: '#64748b', marginBottom: '12px' }}>
                  {product.brand} • {product.weight} {product.unit}
                </div>

                {/* Price & Action */}
                <div style={{
                  marginTop: 'auto',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '8px',
                  paddingTop: '10px',
                  borderTop: '1px solid #f1f5f9'
                }}>
                  <div>
                    {showPrices ? (
                      <span style={{ fontSize: '1.05rem', fontWeight: 900, color: '#0A4D2E' }}>
                        AED {product.pricing[0]?.sellingPrice.toFixed(2) || 'N/A'}
                      </span>
                    ) : (
                      <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#94a3b8' }}>
                        Sign in
                      </span>
                    )}
                  </div>

                  <AddToCartButton productId={product.id} disabled={!showPrices} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
