import { db } from '@/lib/db';
import { Grid, Plus, Layers } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminCategoriesPage() {
  const categories = [
    { name: 'Produce', count: 18, emoji: '🍌', color: '#ecfeff' },
    { name: 'Dairy', count: 12, emoji: '🥛', color: '#fefce8' },
    { name: 'Bakery', count: 9, emoji: '🍞', color: '#fffbe6' },
    { name: 'Grains & Rice', count: 15, emoji: '🌾', color: '#fff7ed' },
    { name: 'Beverages', count: 14, emoji: '🧃', color: '#eff6ff' },
    { name: 'Meat & Poultry', count: 8, emoji: '🥩', color: '#fef2f2' },
  ];

  return (
    <div>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 900, color: '#0F172A', margin: 0 }}>
          CATEGORY MANAGEMENT
        </h1>
        <p style={{ fontSize: '0.88rem', color: '#64748b', marginTop: '4px' }}>
          Organize grocery catalog categories, emojis, and navigation filters
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
        {categories.map(cat => (
          <div
            key={cat.name}
            style={{
              background: '#ffffff',
              borderRadius: '20px',
              padding: '24px',
              border: '1px solid #e2e8f0',
              boxShadow: '0 4px 12px rgba(0,0,0,0.02)',
              display: 'flex',
              alignItems: 'center',
              gap: '16px'
            }}
          >
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '16px',
              background: cat.color,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2rem'
            }}>
              {cat.emoji}
            </div>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                {cat.name}
              </h3>
              <span style={{ fontSize: '0.8rem', color: '#16a34a', fontWeight: 700 }}>
                {cat.count} Active Products
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
