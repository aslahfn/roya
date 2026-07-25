import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { RoyalHeader } from '@/components/layout/RoyalHeader';
import { ArrowLeft, Package, Clock, CheckCircle2, ChevronRight, FileText, CreditCard } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function CustomerOrdersPage() {
  const session = await getSession();
  
  if (!session) {
    redirect('/login');
  }

  const orders = await db.order.findMany({
    where: session.role === 'SUPER_ADMIN' ? {} : { userId: session.userId },
    orderBy: { createdAt: 'desc' },
    include: {
      user: true,
      assignedDriver: true,
      items: {
        include: { product: true }
      }
    }
  });

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh', paddingBottom: '100px' }}>
      <RoyalHeader session={session} />

      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '24px 16px' }}>
        {/* Navigation Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <Link href="/" style={{ color: '#16a34a', display: 'inline-flex', alignItems: 'center', gap: '4px', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 700 }}>
            <ArrowLeft size={16} /> Back to Storefront
          </Link>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#0F172A', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span>{session.role === 'SUPER_ADMIN' ? 'All Customer Orders' : 'My Grocery Orders'}</span>
            <span style={{ fontSize: '0.8rem', background: '#dcfce7', color: '#15803d', padding: '4px 12px', borderRadius: '12px', fontWeight: 800 }}>
              {orders.length} orders
            </span>
          </h1>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {orders.length === 0 ? (
            <div style={{
              background: '#ffffff',
              borderRadius: '24px',
              padding: '48px 24px',
              textAlign: 'center',
              border: '1px solid #e2e8f0',
              boxShadow: '0 6px 20px rgba(0,0,0,0.03)'
            }}>
              <Package size={52} color="#16a34a" style={{ marginBottom: '16px' }} />
              <h2 style={{ fontSize: '1.3rem', fontWeight: 900, color: '#0F172A', marginBottom: '8px' }}>No Orders Found</h2>
              <p style={{ fontSize: '0.88rem', color: '#64748b', marginBottom: '24px' }}>Place an order from the supermarket storefront to view live tracking.</p>
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
                Start Shopping Now
              </Link>
            </div>
          ) : (
            orders.map(order => (
              <div
                key={order.id}
                style={{
                  background: '#ffffff',
                  borderRadius: '20px',
                  padding: '24px',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.03)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px'
                }}
              >
                {/* Header Row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px' }}>
                  <div>
                    <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 800, letterSpacing: '0.04em' }}>ORDER #</div>
                    <div style={{ fontWeight: 900, fontFamily: 'monospace', fontSize: '1.1rem', color: '#0A4D2E' }}>
                      #{order.id.slice(-6).toUpperCase()}
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 800, letterSpacing: '0.04em' }}>DATE & TIME</div>
                    <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#334155' }}>
                      {new Date(order.createdAt).toLocaleString()}
                    </div>
                  </div>
                </div>

                {/* Status & Payment Row */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  background: '#f8fafc',
                  padding: '12px 16px',
                  borderRadius: '14px',
                  border: '1px solid #f1f5f9'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{
                      background: order.status === 'DELIVERED' ? '#dcfce7' : order.status === 'CANCELLED' ? '#fee2e2' : '#fef3c7',
                      color: order.status === 'DELIVERED' ? '#15803d' : order.status === 'CANCELLED' ? '#b91c1c' : '#92400e',
                      fontSize: '0.78rem',
                      fontWeight: 900,
                      padding: '6px 14px',
                      borderRadius: '12px'
                    }}>
                      {order.status.replace(/_/g, ' ')}
                    </span>

                    <span style={{ fontSize: '0.78rem', background: '#eff6ff', color: '#1d4ed8', padding: '6px 12px', borderRadius: '12px', fontWeight: 800 }}>
                      💳 {order.paymentStatus === 'PAID' ? 'PAID (Card/Apple Pay)' : 'CASH ON DELIVERY'}
                    </span>
                  </div>

                  <div style={{ fontWeight: 900, fontSize: '1.15rem', color: '#0A4D2E' }}>
                    AED {order.totalAmount.toFixed(2)}
                  </div>
                </div>

                {/* Items Summary */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {order.items.map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem', padding: '6px 0', borderBottom: idx < order.items.length - 1 ? '1px solid #f1f5f9' : 'none' }}>
                      <span style={{ fontWeight: 700, color: '#0F172A' }}>
                        📦 {item.product.name}
                      </span>
                      <span style={{ color: '#64748b', fontWeight: 600 }}>
                        {item.quantity} {item.unit || item.product.unit || 'Piece'} • AED {(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Assigned Driver Card if present */}
                {order.assignedDriver && (
                  <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', padding: '10px 14px', borderRadius: '12px', fontSize: '0.82rem', color: '#15803d', fontWeight: 700 }}>
                    🚚 Assigned Driver: {order.assignedDriver.name} ({order.assignedDriver.phone}) • Vehicle: {order.assignedDriver.vehicleNumber}
                  </div>
                )}

                {/* Action Buttons */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '4px' }}>
                  <Link
                    href={`/orders/${order.id}`}
                    style={{
                      background: '#16a34a',
                      color: '#ffffff',
                      padding: '12px',
                      borderRadius: '12px',
                      fontWeight: 800,
                      fontSize: '0.85rem',
                      textDecoration: 'none',
                      textAlign: 'center',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px'
                    }}
                  >
                    <span>Live Tracking & Delivery OTP</span>
                    <ChevronRight size={16} />
                  </Link>

                  <Link
                    href={`/api/invoice/${order.id}`}
                    target="_blank"
                    style={{
                      background: '#f1f5f9',
                      color: '#0F172A',
                      border: '1px solid #cbd5e1',
                      padding: '12px',
                      borderRadius: '12px',
                      fontWeight: 800,
                      fontSize: '0.85rem',
                      textDecoration: 'none',
                      textAlign: 'center',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px'
                    }}
                  >
                    <FileText size={16} color="#16a34a" />
                    <span>Download PDF Invoice</span>
                  </Link>
                </div>

              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
