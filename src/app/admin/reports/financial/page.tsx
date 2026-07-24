import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { redirect } from 'next/navigation';

export default async function FinancialReportsPage() {
  const session = await getSession();
  
  if (!session || (session.role !== 'SUPER_ADMIN' && session.role !== 'PRICING_MANAGER')) {
    redirect('/admin');
  }

  // Calculate actual revenue
  const allDeliveredOrders = await db.order.findMany({
    where: { status: 'DELIVERED' },
    select: { totalAmount: true }
  });

  const totalRevenue = allDeliveredOrders.reduce((sum, order) => sum + order.totalAmount, 0);
  const avgOrderValue = allDeliveredOrders.length > 0 ? totalRevenue / allDeliveredOrders.length : 0;

  const financialStats = [
    { label: "Total Revenue", value: `AED ${totalRevenue.toFixed(2)}` },
    { label: "Average Order Value", value: `AED ${avgOrderValue.toFixed(2)}` },
  ];

  return (
    <div>
      <header style={{ marginBottom: '48px', borderBottom: '1px solid var(--border-light)', paddingBottom: '24px' }}>
        <h1 className="title" style={{ fontSize: '4rem', margin: 0 }}>FINANCIALS</h1>
        <p className="subtitle" style={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>CONFIDENTIAL REPORTING</p>
      </header>

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
  );
}
