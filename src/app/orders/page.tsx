import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';
import Link from 'next/link';
import { redirect } from 'next/navigation';

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
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', padding: '60px 20px', position: 'relative', overflow: 'hidden' }}>
      <div className="blur-blob" style={{ width: '400px', height: '400px', top: '5%', left: '-5%' }}></div>
      <div className="blur-blob" style={{ width: '300px', height: '300px', bottom: '10%', right: '-5%', background: 'var(--accent-primary)' }}></div>

      <div style={{ maxWidth: '900px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <header style={{ marginBottom: '40px', borderBottom: '1px solid var(--border-light)', paddingBottom: '24px' }}>
          <Link href="/" style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '16px', display: 'inline-block' }}>← BACK TO STORE</Link>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <h1 className="title" style={{ fontSize: '3rem', margin: 0, lineHeight: 1 }}>MY<br/><span className="text-accent">ORDERS</span></h1>
          </div>
        </header>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {orders.length === 0 ? (
            <div className="glass-panel" style={{ padding: '60px', textAlign: 'center' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>No orders yet</h2>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>You haven't placed any orders. Start shopping to see your history here.</p>
              <Link href="/" className="btn btn-primary">BROWSE STORE</Link>
            </div>
          ) : (
            orders.map(order => (
              <div key={order.id} className="glass-panel" style={{ padding: '32px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-light)', paddingBottom: '16px', marginBottom: '24px' }}>
                  <div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 600 }}>Order ID</div>
                    <div style={{ fontWeight: 800, fontFamily: 'monospace', fontSize: '1.25rem' }}>#{order.id.slice(-6).toUpperCase()}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 600 }}>Date Placed</div>
                    <div style={{ fontWeight: 600 }}>{order.createdAt.toLocaleDateString()}</div>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '24px', marginBottom: '24px' }}>
                  <div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 600 }}>Status</div>
                    <div className={`badge ${order.status === 'DELIVERED' ? 'badge-success' : 'badge-warning'}`} style={{ marginTop: '8px' }}>
                      {order.status.replace(/_/g, ' ')}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 600 }}>Total Amount</div>
                    <div style={{ fontWeight: 800, fontSize: '1.25rem', marginTop: '4px' }}>AED {order.totalAmount.toFixed(2)}</div>
                  </div>
                  <div style={{ textAlign: 'right', alignSelf: 'center' }}>
                    <Link href={`/orders/${order.id}`} className="btn btn-primary" style={{ padding: '12px 24px', fontSize: '0.85rem' }}>
                      TRACK / VIEW OTP →
                    </Link>
                  </div>
                </div>

                <div style={{ background: 'rgba(0,0,0,0.02)', padding: '16px', borderRadius: '8px' }}>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 600, marginBottom: '12px' }}>Items ({order.items.length})</div>
                  <div style={{ display: 'flex', gap: '16px', overflowX: 'auto', paddingBottom: '8px' }}>
                    {order.items.map((item, idx) => (
                      <div key={idx} style={{ flexShrink: 0, width: '200px', display: 'flex', alignItems: 'center', gap: '12px', background: '#fff', padding: '8px', borderRadius: '8px', border: '1px solid var(--border-light)' }}>
                        <div style={{ width: '40px', height: '40px', background: 'var(--bg-secondary)', borderRadius: '4px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>
                          📦
                        </div>
                        <div style={{ overflow: 'hidden' }}>
                          <div style={{ fontWeight: 600, fontSize: '0.85rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.product.name}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Qty: {item.quantity}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
