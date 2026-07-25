import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { RoyalHeader } from '@/components/layout/RoyalHeader';
import { ArrowLeft, Package, Clock, CheckCircle2, ChevronRight } from 'lucide-react';

export default async function CustomerOrdersPage() {
  const session = await getSession();
  
  if (!session || session.role !== 'CUSTOMER') {
    redirect('/login');
  }

  const orders = await db.order.findMany({
    where: { userId: session.userId },
    orderBy: { createdAt: 'desc' },
    include: {
      items: {
        include: { product: true }
      }
    }
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
          <span>My Orders</span>
          <span style={{ fontSize: '0.8rem', background: '#dcfce7', color: '#15803d', padding: '2px 8px', borderRadius: '12px', fontWeight: 800 }}>
            {orders.length} orders
          </span>
        </h1>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {orders.length === 0 ? (
            <div style={{
              background: '#ffffff',
              borderRadius: '20px',
              padding: '40px 20px',
              textAlign: 'center',
              border: '1px solid rgba(22, 163, 74, 0.15)',
              boxShadow: '0 4px 14px rgba(0,0,0,0.04)'
            }}>
              <Package size={48} color="#16a34a" style={{ marginBottom: '12px' }} />
              <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0F172A', marginBottom: '8px' }}>No Orders Placed Yet</h2>
              <p style={{ fontSize: '0.82rem', color: '#64748b', marginBottom: '20px' }}>Your completed orders & live delivery tracking will appear here.</p>
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
                Browse Products
              </Link>
            </div>
          ) : (
            orders.map(order => (
              <div
                key={order.id}
                style={{
                  background: '#ffffff',
                  borderRadius: '16px',
                  padding: '14px',
                  border: '1px solid rgba(22, 163, 74, 0.15)',
                  boxShadow: '0 4px 12px rgba(6, 56, 33, 0.04)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px'
                }}
              >
                {/* Top Row: Order ID & Date */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: 700 }}>ORDER NUMBER</div>
                    <div style={{ fontWeight: 900, fontFamily: 'monospace', fontSize: '0.95rem', color: '#0A4D2E' }}>
                      #{order.id.slice(-6).toUpperCase()}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: 700 }}>DATE</div>
                    <div style={{ fontWeight: 700, fontSize: '0.82rem', color: '#334155' }}>
                      {order.createdAt.toLocaleDateString()}
                    </div>
                  </div>
                </div>

                {/* Status & Price Row */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  background: '#f8fafc',
                  padding: '10px 12px',
                  borderRadius: '12px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span className={`badge ${order.status === 'DELIVERED' ? 'badge-success' : 'badge-warning'}`} style={{ fontSize: '0.7rem' }}>
                      {order.status.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <div style={{ fontWeight: 900, fontSize: '1rem', color: '#0A4D2E' }}>
                    AED {order.totalAmount.toFixed(2)}
                  </div>
                </div>

                {/* Horizontal Scroll of Item Thumbnails */}
                <div className="no-scrollbar" style={{ display: 'flex', gap: '8px', overflowX: 'auto', padding: '2px 0' }}>
                  {order.items.map((item, idx) => (
                    <div key={idx} style={{
                      flexShrink: 0,
                      background: '#ffffff',
                      border: '1px solid #e2e8f0',
                      borderRadius: '10px',
                      padding: '6px 10px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}>
                      <span style={{ fontSize: '1.2rem' }}>📦</span>
                      <div>
                        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#0F172A', maxWidth: '120px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {item.product.name}
                        </div>
                        <div style={{ fontSize: '0.68rem', color: '#64748b' }}>Qty: {item.quantity}</div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* View Details / OTP Link */}
                <Link
                  href={`/orders/${order.id}`}
                  style={{
                    background: '#16a34a',
                    color: '#ffffff',
                    padding: '10px',
                    borderRadius: '12px',
                    fontWeight: 800,
                    fontSize: '0.82rem',
                    textDecoration: 'none',
                    textAlign: 'center',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '4px'
                  }}
                >
                  <span>Track Delivery & View OTP</span>
                  <ChevronRight size={16} />
                </Link>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
