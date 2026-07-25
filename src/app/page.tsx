import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';
import Link from 'next/link';
import { AddToCartButton } from '@/components/cart/AddToCartButton';
import { RoyalHeader } from '@/components/layout/RoyalHeader';
import { Sparkles, Truck, Award, ShieldCheck, Gift, ChevronRight } from 'lucide-react';

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
      {/* Mobile Top App Header */}
      <RoyalHeader session={session} />

      {/* Hero Mobile Banner Card */}
      <section style={{ padding: '12px 14px 4px' }}>
        <div style={{
          background: 'linear-gradient(135deg, #0A4D2E 0%, #15803d 100%)',
          borderRadius: '20px',
          padding: '18px 16px',
          color: '#ffffff',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 8px 20px rgba(10, 77, 46, 0.2)'
        }}>
          {/* Subtle accent badge */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            background: 'rgba(255,184,0,0.2)',
            color: '#FFB800',
            padding: '4px 10px',
            borderRadius: '12px',
            fontSize: '0.72rem',
            fontWeight: 800,
            marginBottom: '8px'
          }}>
            <Sparkles size={12} />
            <span>DAILY FRESH OFFERS</span>
          </div>

          <h2 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '1.4rem',
            fontWeight: 800,
            lineHeight: 1.15,
            marginBottom: '6px'
          }}>
            Fresh Organic Produce Delivered in 30 Mins 🚀
          </h2>

          <p style={{ fontSize: '0.8rem', color: '#DCFCE7', marginBottom: '14px', opacity: 0.9 }}>
            Handpicked fruits, farm-fresh vegetables & daily essentials.
          </p>

          {!showPrices && (
            <div style={{
              background: '#FEF3C7',
              color: '#92400E',
              padding: '6px 12px',
              borderRadius: '10px',
              fontSize: '0.75rem',
              fontWeight: 800,
              display: 'inline-block'
            }}>
              🔒 Private Store: Sign in to view pricing
            </div>
          )}
        </div>
      </section>

      {/* Horizontal Swipeable Categories */}
      <section id="categories" style={{ padding: '14px 0 6px' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0 14px 10px'
        }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
            Categories
          </h3>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#16a34a' }}>
            Swipe →
          </span>
        </div>

        {/* Scrollable pill container */}
        <div className="no-scrollbar" style={{
          display: 'flex',
          gap: '10px',
          overflowX: 'auto',
          padding: '0 14px 4px',
          scrollSnapType: 'x mandatory'
        }}>
          {categories.map((cat) => (
            <div
              key={cat.name}
              className="touch-active"
              style={{
                flexShrink: 0,
                background: cat.color,
                border: '1px solid rgba(22, 163, 74, 0.12)',
                borderRadius: '16px',
                padding: '10px 14px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer',
                boxShadow: '0 2px 6px rgba(0,0,0,0.03)'
              }}
            >
              <span style={{ fontSize: '1.3rem' }}>{cat.emoji}</span>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: cat.textColor, whiteSpace: 'nowrap' }}>
                {cat.name}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Value Proposition Highlights (Mobile 2x2 grid) */}
      <section style={{ padding: '8px 14px 14px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '8px'
        }}>
          {[
            { label: '30-60 Min Delivery', icon: Truck, color: '#16a34a' },
            { label: '100% Organic Fresh', icon: Award, color: '#eab308' },
            { label: 'Secure Checkout', icon: ShieldCheck, color: '#2563eb' },
            { label: 'Loyalty Rewards', icon: Gift, color: '#9333ea' },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.label} style={{
                background: '#ffffff',
                border: '1px solid rgba(22, 163, 74, 0.12)',
                borderRadius: '12px',
                padding: '8px 10px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
              }}>
                <div style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  background: `${item.color}15`,
                  color: item.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <Icon size={14} />
                </div>
                <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#334155', lineHeight: 1.2 }}>
                  {item.label}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* Product Catalog Section (Mobile 2-Column Grid) */}
      <main style={{ padding: '0 14px 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
            Fresh Products
          </h3>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b' }}>
            {products.length} items
          </span>
        </div>

        {/* 2-Column Mobile Product Cards */}
        <div className="mobile-grid-2">
          {products.map((product) => (
            <div
              key={product.id}
              className="touch-active"
              style={{
                background: '#ffffff',
                borderRadius: '16px',
                border: '1px solid rgba(22, 163, 74, 0.15)',
                padding: '12px',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: '0 4px 12px rgba(6, 56, 33, 0.05)',
                position: 'relative'
              }}
            >
              {/* Product Thumbnail Placeholder */}
              <div style={{
                height: '110px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '10px',
                position: 'relative'
              }}>
                <span style={{ fontSize: '2.5rem' }}>
                  {product.category === 'Drinks' ? '🧃' : product.category === 'Dairy' ? '🧀' : product.category === 'Meat' ? '🥩' : '🥦'}
                </span>
                <span style={{
                  position: 'absolute',
                  top: '6px',
                  left: '6px',
                  background: '#16a34a',
                  color: '#ffffff',
                  fontSize: '0.62rem',
                  fontWeight: 800,
                  padding: '2px 6px',
                  borderRadius: '6px'
                }}>
                  ORGANIC
                </span>
              </div>

              {/* Product Info */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{ fontSize: '0.65rem', color: '#16a34a', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  {product.category}
                </div>
                <h4 style={{
                  fontSize: '0.88rem',
                  fontWeight: 800,
                  color: '#0F172A',
                  margin: '2px 0 4px',
                  lineHeight: 1.2,
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden'
                }}>
                  {product.name}
                </h4>
                <div style={{ fontSize: '0.72rem', color: '#64748b', marginBottom: '8px' }}>
                  {product.brand} • {product.weight} {product.unit}
                </div>

                {/* Price & Action */}
                <div style={{
                  marginTop: 'auto',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '4px',
                  paddingTop: '6px',
                  borderTop: '1px solid #f1f5f9'
                }}>
                  <div>
                    {showPrices ? (
                      <span style={{ fontSize: '0.95rem', fontWeight: 900, color: '#0A4D2E' }}>
                        AED {product.pricing[0]?.sellingPrice.toFixed(2) || 'N/A'}
                      </span>
                    ) : (
                      <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#94a3b8' }}>
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
