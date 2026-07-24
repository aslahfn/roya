import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';
import Link from 'next/link';

export default async function OrderTrackingPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  const { id } = await params;
  
  const order = await db.order.findUnique({
    where: { id },
    include: {
      driver: true,
      paymentMethod: true,
    }
  });

  if (!order || (session?.role === 'CUSTOMER' && order.userId !== session.userId)) {
    return (
      <div style={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-primary)' }}>
        <div className="glass-panel" style={{ padding: '60px', textAlign: 'center' }}>
          <h1 className="title">Order Not Found</h1>
          <p className="subtitle">This order does not exist or you do not have permission to view it.</p>
          <Link href="/" className="btn btn-primary" style={{ marginTop: '24px' }}>Back to Store</Link>
        </div>
      </div>
    );
  }

  // Delivery Stages from PRD
  const stages = [
    { key: 'RECEIVED', label: 'Order Received', active: true },
    { key: 'CONFIRMED', label: 'Order Confirmed', active: ['CONFIRMED', 'PREPARING', 'PACKED', 'OUT_FOR_DELIVERY', 'DELIVERED'].includes(order.status) },
    { key: 'PREPARING', label: 'Preparing', active: ['PREPARING', 'PACKED', 'OUT_FOR_DELIVERY', 'DELIVERED'].includes(order.status) },
    { key: 'PACKED', label: 'Packed', active: ['PACKED', 'OUT_FOR_DELIVERY', 'DELIVERED'].includes(order.status) },
    { key: 'OUT_FOR_DELIVERY', label: 'Out for Delivery', active: ['OUT_FOR_DELIVERY', 'DELIVERED'].includes(order.status) },
    { key: 'DELIVERED', label: 'Delivered', active: order.status === 'DELIVERED' }
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', padding: '60px 20px', position: 'relative', overflow: 'hidden' }}>
      <div className="blur-blob" style={{ width: '400px', height: '400px', top: '5%', left: '-5%' }}></div>
      <div className="blur-blob" style={{ width: '300px', height: '300px', bottom: '10%', right: '-5%', background: 'var(--accent-primary)' }}></div>

      <div style={{ maxWidth: '900px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <header style={{ marginBottom: '40px', borderBottom: '1px solid var(--border-light)', paddingBottom: '24px' }}>
          <Link href="/" style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '16px', display: 'inline-block' }}>← BACK TO STORE</Link>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <h1 className="title" style={{ fontSize: '3rem', margin: 0, lineHeight: 1 }}>ORDER<br/><span className="text-accent">TRACKING</span></h1>
            <div style={{ textAlign: 'right', display: 'flex', gap: '40px' }}>
              {order.otp && (
                <div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--accent-primary)', textTransform: 'uppercase', fontWeight: 800 }}>Delivery OTP</div>
                  <div style={{ fontWeight: 800, fontFamily: 'monospace', fontSize: '1.5rem', color: 'var(--accent-primary)' }}>{order.otp}</div>
                </div>
              )}
              <div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 600 }}>Order ID</div>
                <div style={{ fontWeight: 700, fontFamily: 'monospace', fontSize: '1.25rem' }}>#{order.id.slice(-6).toUpperCase()}</div>
              </div>
            </div>
          </div>
        </header>

        {/* Live Map Placeholder (Only active if Out For Delivery) */}
        <div className="glass-panel" style={{ 
          height: '350px', 
          marginBottom: '40px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          background: order.status === 'OUT_FOR_DELIVERY' ? 'linear-gradient(135deg, rgba(224, 242, 254, 0.8), rgba(186, 230, 253, 0.8))' : 'linear-gradient(135deg, rgba(248, 250, 252, 0.8), rgba(226, 232, 240, 0.8))',
          backgroundImage: 'radial-gradient(var(--border-light) 2px, transparent 2px)',
          backgroundSize: '30px 30px'
        }}>
          <div style={{ textAlign: 'center', background: '#ffffff', padding: '24px', borderRadius: '16px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}>
            {order.status === 'OUT_FOR_DELIVERY' ? (
              <>
                <div style={{ fontSize: '3rem', marginBottom: '8px' }}>🚚</div>
                <div style={{ fontWeight: 700, color: 'var(--accent-primary)' }}>Driver is approaching!</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Live GPS Tracking Active</div>
              </>
            ) : (
              <>
                <div style={{ fontSize: '3rem', marginBottom: '8px' }}>📍</div>
                <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>Live GPS Tracking</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Available when out for delivery</div>
              </>
            )}
          </div>
        </div>

        {/* Order Status Timeline */}
        <div className="glass-panel" style={{ padding: '40px', marginBottom: '40px' }}>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '32px' }}>STATUS UPDATE</h2>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative' }}>
            <div style={{ position: 'absolute', top: '16px', left: '20px', right: '20px', height: '2px', background: 'var(--border-light)', zIndex: 0 }}></div>
            
            {stages.map((stage, idx) => (
              <div key={stage.key} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', zIndex: 1, flex: 1 }}>
                <div style={{ 
                  width: '32px', height: '32px', borderRadius: '50%', 
                  background: stage.active ? 'var(--text-primary)' : 'var(--bg-primary)',
                  border: `2px solid ${stage.active ? 'var(--text-primary)' : 'var(--border-light)'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginBottom: '12px',
                  color: '#fff'
                }}>
                  {stage.active && <span style={{ fontSize: '0.85rem' }}>✓</span>}
                </div>
                <div style={{ fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', color: stage.active ? 'var(--text-primary)' : 'var(--text-tertiary)', textAlign: 'center' }}>
                  {stage.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
          {/* Driver Details */}
          <div className="glass-panel" style={{ padding: '32px' }}>
            <h3 style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '24px' }}>Delivery Courier</h3>
            {order.driver ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'var(--border-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem' }}>
                  🧑‍✈️
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '1.25rem' }}>{order.driver.name}</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>4.9 ★ • White Van</div>
                </div>
              </div>
            ) : (
              <div style={{ color: 'var(--text-tertiary)', fontStyle: 'italic', fontSize: '0.9rem' }}>
                Courier will be assigned shortly...
              </div>
            )}
          </div>

          {/* Delivery Details */}
          <div className="glass-panel" style={{ padding: '32px' }}>
            <h3 style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '24px' }}>Delivery Address</h3>
            <div style={{ fontWeight: 600, fontSize: '1rem', lineHeight: 1.5 }}>
              {order.deliveryAddress || 'Sheikh Mohammed bin Rashid Blvd, Downtown Dubai, UAE'}
            </div>
            
            <div style={{ marginTop: '24px', paddingTop: '24px', borderTop: '1px solid var(--border-light)' }}>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '8px' }}>Estimated Arrival</div>
              <div style={{ fontWeight: 800, fontSize: '1.5rem', color: 'var(--accent-primary)' }}>
                {order.estimatedDeliveryTime ? new Date(order.estimatedDeliveryTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '30-45 mins'}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
