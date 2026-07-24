import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';

export default async function AdminDashboard() {
  const session = await getSession();
  
  if (!session) return null;

  const isPricingAuthorized = session.role === 'SUPER_ADMIN' || session.role === 'PRICING_MANAGER';

  // Fetch some real stats
  const totalProducts = await db.product.count();
  const totalCustomers = await db.user.count({ where: { role: 'CUSTOMER' } });

  // Mocked stats for demonstration as per requirements
  const stats = [
    { label: "Today's Orders", value: '142' },
    { label: "Pending Orders", value: '28' },
    { label: "Delivered Orders", value: '114' },
    { label: "Total Products", value: totalProducts },
    { label: "Total Customers", value: totalCustomers },
    { label: "Total Categories", value: '12' },
    { label: "Low Stock Products", value: '5', warning: true },
    { label: "Out of Stock Products", value: '2', error: true },
    { label: "Active Drivers", value: '18' },
    { label: "Monthly Orders", value: '3,842' },
  ];

  const financialStats = [
    { label: "Monthly Revenue", value: '$124,500' },
    { label: "Net Profit", value: '$28,400' },
    { label: "Average Sales Amount", value: '$32.40' },
  ];

  return (
    <div>
      <header style={{ marginBottom: '48px', borderBottom: '1px solid var(--border-light)', paddingBottom: '24px' }}>
        <h1 className="title" style={{ fontSize: '4rem', margin: 0 }}>OVERVIEW</h1>
        <p className="subtitle" style={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>SYSTEM METRICS // {session.name}</p>
      </header>

      <div className="grid-cards">
        {stats.map((stat, idx) => (
          <div key={idx} className="brutalist-panel" style={{ padding: '32px' }}>
            <h3 style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '16px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {stat.label}
            </h3>
            <p style={{ 
              fontFamily: 'var(--font-heading)',
              fontSize: '3rem', 
              fontWeight: 800, 
              color: stat.error ? 'var(--error)' : stat.warning ? 'var(--warning)' : 'var(--text-primary)',
              lineHeight: 1
            }}>
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {isPricingAuthorized && (
        <div style={{ marginTop: '64px' }}>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', marginBottom: '24px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '-0.02em' }}>
            FINANCIAL_DATA <span className="badge badge-success" style={{ marginLeft: '12px', verticalAlign: 'middle' }}>AUTHORIZED</span>
          </h2>
          <div className="grid-cards">
            {financialStats.map((stat, idx) => (
              <div key={idx} className="brutalist-panel" style={{ 
                padding: '40px', 
                background: 'var(--accent-primary)',
                borderColor: 'var(--accent-primary)',
                color: '#ffffff'
              }}>
                <h3 style={{ fontSize: '0.75rem', color: '#ffffff', opacity: 0.8, marginBottom: '16px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {stat.label}
                </h3>
                <p style={{ fontFamily: 'var(--font-heading)', fontSize: '3.5rem', fontWeight: 800, lineHeight: 1 }}>
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
