import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';

export default async function AdminDashboard() {
  const session = await getSession();
  
  if (!session) return null;

  const isPricingAuthorized = session.role === 'SUPER_ADMIN' || session.role === 'PRICING_MANAGER';

  // Real Database Metrics
  const totalProducts = await db.product.count();
  const totalCustomers = await db.user.count({ where: { role: 'CUSTOMER' } });
  const totalOrders = await db.order.count();
  const pendingOrders = await db.order.count({
    where: { status: { in: ['RECEIVED', 'CONFIRMED', 'PREPARING', 'PACKED', 'OUT_FOR_DELIVERY'] } }
  });
  const deliveredOrders = await db.order.count({
    where: { status: 'DELIVERED' }
  });
  const totalDrivers = await db.user.count({
    where: { role: { in: ['DELIVERY_MANAGER', 'SUPER_ADMIN', 'STORE_MANAGER'] } }
  });

  const revenueAggregate = await db.order.aggregate({
    _sum: { totalAmount: true },
    _avg: { totalAmount: true },
    where: { paymentStatus: 'PAID' }
  });

  const totalRevenue = revenueAggregate._sum.totalAmount || 0;
  const avgSales = revenueAggregate._avg.totalAmount || 0;
  const netProfit = totalRevenue * 0.25; // 25% margin estimate

  const stats = [
    { label: "Total Orders", value: totalOrders.toString() },
    { label: "Pending Orders", value: pendingOrders.toString(), warning: pendingOrders > 0 },
    { label: "Delivered Orders", value: deliveredOrders.toString() },
    { label: "Total Products", value: totalProducts.toString() },
    { label: "Total Customers", value: totalCustomers.toString() },
    { label: "Active Drivers", value: totalDrivers.toString() },
  ];

  const financialStats = [
    { label: "Total Revenue", value: `AED ${totalRevenue.toFixed(2)}` },
    { label: "Estimated Net Profit", value: `AED ${netProfit.toFixed(2)}` },
    { label: "Average Sales Amount", value: `AED ${avgSales.toFixed(2)}` },
  ];

  return (
    <div>
      <header style={{ marginBottom: '40px', borderBottom: '1px solid var(--border-light)', paddingBottom: '20px' }}>
        <h1 className="title" style={{ fontSize: '3rem', margin: 0, lineHeight: 1 }}>SYSTEM OVERVIEW</h1>
        <p className="subtitle" style={{ textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: '12px' }}>
          REAL-TIME METRICS // WELCOME {session.name}
        </p>
      </header>

      <div className="grid-cards">
        {stats.map((stat, idx) => (
          <div key={idx} className="brutalist-panel" style={{ padding: '28px' }}>
            <h3 style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '14px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {stat.label}
            </h3>
            <p style={{ 
              fontFamily: 'var(--font-heading)',
              fontSize: '2.8rem', 
              fontWeight: 900, 
              color: stat.warning ? 'var(--warning)' : 'var(--text-primary)',
              lineHeight: 1
            }}>
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {isPricingAuthorized && (
        <div style={{ marginTop: '48px' }}>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', marginBottom: '20px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '-0.02em' }}>
            FINANCIAL METRICS <span className="badge badge-success" style={{ marginLeft: '12px', verticalAlign: 'middle' }}>LIVE DATA</span>
          </h2>
          <div className="grid-cards">
            {financialStats.map((stat, idx) => (
              <div key={idx} className="brutalist-panel" style={{ 
                padding: '32px', 
                background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
                borderColor: '#16a34a',
                color: '#ffffff'
              }}>
                <h3 style={{ fontSize: '0.75rem', color: '#ffffff', opacity: 0.9, marginBottom: '14px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {stat.label}
                </h3>
                <p style={{ fontFamily: 'var(--font-heading)', fontSize: '2.5rem', fontWeight: 900, lineHeight: 1 }}>
                  {stat.value}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
