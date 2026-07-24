import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { claimOrder, markDelivered } from './actions';

export default async function DeliveryDispatchPage() {
  const session = await getSession();
  
  const pendingOrders = await db.order.findMany({
    where: { status: 'READY_FOR_PICKUP' },
    orderBy: { createdAt: 'asc' },
    include: { user: true }
  });

  const activeDeliveries = await db.order.findMany({
    where: { 
      status: 'OUT_FOR_DELIVERY',
      driverId: session?.userId
    },
    orderBy: { createdAt: 'asc' },
    include: { user: true }
  });

  return (
    <div>
      <header style={{ marginBottom: '48px', borderBottom: '1px solid var(--border-light)', paddingBottom: '24px' }}>
        <h1 className="title" style={{ fontSize: '3.5rem', margin: 0, lineHeight: 1 }}>DISPATCH<br/><span className="text-accent">BOARD</span></h1>
        <p className="subtitle" style={{ textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: '16px' }}>LOGISTICS & DELIVERY MANAGEMENT</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
        
        {/* Available Orders */}
        <div>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '24px' }}>
            READY FOR PICKUP
          </h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {pendingOrders.length === 0 ? (
              <div className="glass-panel" style={{ padding: '32px', textAlign: 'center', color: 'var(--text-tertiary)' }}>
                No orders waiting for pickup.
              </div>
            ) : (
              pendingOrders.map(order => (
                <div key={order.id} className="brutalist-panel" style={{ padding: '24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                    <div style={{ fontWeight: 700 }}>Order #{order.id.slice(-6).toUpperCase()}</div>
                    <div className="badge badge-warning">READY</div>
                  </div>
                  <div style={{ marginBottom: '16px' }}>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 600 }}>Deliver To</div>
                    <div style={{ fontWeight: 600 }}>{order.deliveryAddress || 'Address Not Provided'}</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)' }}>Customer: {order.user.name}</div>
                  </div>
                  <form action={async () => {
                    'use server';
                    await claimOrder(order.id);
                  }}>
                    <button className="btn btn-primary" style={{ width: '100%' }}>CLAIM & DELIVER</button>
                  </form>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Active Deliveries */}
        <div>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '24px' }}>
            MY ACTIVE ROUTES
          </h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {activeDeliveries.length === 0 ? (
              <div className="glass-panel" style={{ padding: '32px', textAlign: 'center', color: 'var(--text-tertiary)' }}>
                You have no active deliveries.
              </div>
            ) : (
              activeDeliveries.map(order => (
                <div key={order.id} className="glass-panel" style={{ padding: '24px', borderLeft: '4px solid var(--accent-primary)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                    <div style={{ fontWeight: 700 }}>Order #{order.id.slice(-6).toUpperCase()}</div>
                    <div className="badge badge-neutral" style={{ background: 'var(--accent-primary)', color: '#fff' }}>IN TRANSIT</div>
                  </div>
                  <div style={{ marginBottom: '16px' }}>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 600 }}>Destination</div>
                    <div style={{ fontWeight: 600 }}>{order.deliveryAddress || 'Address Not Provided'}</div>
                  </div>
                  <form action={async () => {
                    'use server';
                    await markDelivered(order.id);
                  }}>
                    <button className="btn btn-secondary" style={{ width: '100%', background: '#10b981', color: '#fff', borderColor: '#10b981' }}>
                      MARK AS DELIVERED
                    </button>
                  </form>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
