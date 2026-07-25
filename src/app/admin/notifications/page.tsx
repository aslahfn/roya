import { db } from '@/lib/db';
import { Bell, CheckCircle2, AlertTriangle, ShoppingBag, Package } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminNotificationsPage() {
  const notifications = await db.notification.findMany({
    orderBy: { createdAt: 'desc' },
    take: 20
  });

  return (
    <div>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 900, color: '#0F172A', margin: 0 }}>
          SYSTEM NOTIFICATIONS
        </h1>
        <p style={{ fontSize: '0.88rem', color: '#64748b', marginTop: '4px' }}>
          Real-time alerts for new customer orders, low stock warnings, and status changes
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {notifications.length === 0 ? (
          <div style={{ background: '#ffffff', padding: '40px', borderRadius: '20px', textAlign: 'center', color: '#64748b' }}>
            🔔 No active notifications. All system events are up to date.
          </div>
        ) : (
          notifications.map(n => (
            <div
              key={n.id}
              style={{
                background: '#ffffff',
                borderRadius: '16px',
                padding: '16px 20px',
                border: '1px solid #e2e8f0',
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
              }}
            >
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: n.type === 'NEW_ORDER' ? '#dcfce7' : '#fef3c7',
                color: n.type === 'NEW_ORDER' ? '#15803d' : '#92400e',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <Bell size={20} />
              </div>
              <div style={{ flex: 1 }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                  {n.title}
                </h4>
                <p style={{ fontSize: '0.82rem', color: '#64748b', margin: '2px 0 0' }}>
                  {n.message}
                </p>
              </div>
              <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600 }}>
                {new Date(n.createdAt).toLocaleTimeString()}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
