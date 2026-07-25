import { db } from '@/lib/db';
import { Settings, ShieldCheck, Store, Bell, Lock } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminSettingsPage() {
  return (
    <div>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 900, color: '#0F172A', margin: 0 }}>
          PLATFORM SETTINGS
        </h1>
        <p style={{ fontSize: '0.88rem', color: '#64748b', marginTop: '4px' }}>
          Configure supermarket operating mode, admin security parameters, and notification alerts
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        {/* Fixed Admin Credentials Card */}
        <div style={{ background: '#ffffff', borderRadius: '20px', padding: '24px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0F172A', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Lock size={18} color="#16a34a" /> Restricted Fixed Admin Credentials
          </h3>

          <div style={{ background: '#f0fdf4', padding: '16px', borderRadius: '14px', border: '1px solid #bbf7d0', marginBottom: '16px' }}>
            <div style={{ fontSize: '0.82rem', color: '#166534', fontWeight: 700 }}>FIXED ADMIN EMAIL</div>
            <div style={{ fontSize: '1rem', fontWeight: 900, color: '#0F172A', marginTop: '2px' }}>royasupermarket.com</div>
            <div style={{ fontSize: '0.82rem', color: '#166534', fontWeight: 700, marginTop: '12px' }}>FIXED ADMIN PASSWORD</div>
            <div style={{ fontSize: '1rem', fontWeight: 900, color: '#0F172A', marginTop: '2px' }}>roya@123</div>
          </div>

          <p style={{ fontSize: '0.78rem', color: '#64748b', lineHeight: 1.4 }}>
            Admin registration is completely disabled system-wide. Only users with these credentials can access the Admin Dashboard.
          </p>
        </div>

        {/* Supermarket Operational Mode */}
        <div style={{ background: '#ffffff', borderRadius: '20px', padding: '24px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0F172A', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Store size={18} color="#16a34a" /> Storefront Operating Mode
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ background: '#dcfce7', color: '#15803d', padding: '12px 16px', borderRadius: '12px', fontWeight: 800, fontSize: '0.88rem' }}>
              ✓ PUBLIC STOREFRONT (Pricing & Checkout open to all visitors)
            </div>
            <p style={{ fontSize: '0.78rem', color: '#64748b', margin: 0 }}>
              Customers can browse products, add items to cart with 60fps animations, view units, and place orders smoothly.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
