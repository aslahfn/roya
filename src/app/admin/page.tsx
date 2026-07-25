import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';
import Link from 'next/link';
import { ShoppingBag, Package, Users, Truck, DollarSign, ArrowUpRight, TrendingUp } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  const session = await getSession();
  
  if (!session) return null;

  const isPricingAuthorized = session.role === 'SUPER_ADMIN' || session.role === 'PRICING_MANAGER';

  // Real Database Metrics with safe fallbacks
  let totalProducts = 0;
  let totalCustomers = 0;
  let totalOrders = 0;
  let pendingOrders = 0;
  let deliveredOrders = 0;
  let totalDrivers = 0;
  let totalRevenue = 0;
  let avgSales = 0;

  try {
    totalProducts = await db.product.count();
    totalCustomers = await db.user.count({ where: { role: 'CUSTOMER' } });
    totalOrders = await db.order.count();
    pendingOrders = await db.order.count({
      where: { status: { in: ['RECEIVED', 'ACCEPTED', 'PREPARING', 'PACKED', 'OUT_FOR_DELIVERY'] } }
    });
    deliveredOrders = await db.order.count({
      where: { status: 'DELIVERED' }
    });
    totalDrivers = await db.driver.count();

    const revenueAggregate = await db.order.aggregate({
      _sum: { totalAmount: true },
      _avg: { totalAmount: true },
      where: { paymentStatus: 'PAID' }
    });

    totalRevenue = revenueAggregate._sum?.totalAmount || 0;
    avgSales = revenueAggregate._avg?.totalAmount || 0;
  } catch (err) {
    console.error('Error fetching admin dashboard metrics:', err);
  }

  const netProfit = totalRevenue * 0.25;

  const stats = [
    { label: "Total Orders", value: totalOrders.toString(), icon: ShoppingBag, color: '#16a34a' },
    { label: "Pending Orders", value: pendingOrders.toString(), warning: pendingOrders > 0, icon: TrendingUp, color: '#eab308' },
    { label: "Delivered Orders", value: deliveredOrders.toString(), icon: ArrowUpRight, color: '#2563eb' },
    { label: "Total Products", value: totalProducts.toString(), icon: Package, color: '#9333ea' },
    { label: "Registered Customers", value: totalCustomers.toString(), icon: Users, color: '#06b6d4' },
    { label: "Active Fleet Drivers", value: totalDrivers.toString(), icon: Truck, color: '#f59e0b' },
  ];

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 900, color: '#0F172A', margin: 0, letterSpacing: '-0.02em' }}>
          SYSTEM OVERVIEW & DASHBOARD
        </h1>
        <p style={{ fontSize: '0.88rem', color: '#64748b', marginTop: '4px', fontWeight: 600 }}>
          REAL-TIME SUPERMARKET METRICS • WELCOME, {session.name.toUpperCase()}
        </p>
      </div>

      {/* Metrics Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: '20px',
        marginBottom: '36px'
      }}>
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div
              key={idx}
              style={{
                background: '#ffffff',
                borderRadius: '20px',
                padding: '24px',
                border: '1px solid #e2e8f0',
                boxShadow: '0 4px 14px rgba(0,0,0,0.03)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  {stat.label}
                </span>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '12px',
                  background: `${stat.color}15`,
                  color: stat.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Icon size={20} />
                </div>
              </div>

              <div style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '2.4rem',
                fontWeight: 900,
                color: stat.warning ? '#d97706' : '#0F172A',
                lineHeight: 1
              }}>
                {stat.value}
              </div>
            </div>
          );
        })}
      </div>

      {/* Financial Section for Authorized Admins */}
      {isPricingAuthorized && (
        <div style={{ background: 'linear-gradient(135deg, #0A4D2E 0%, #15803D 100%)', borderRadius: '24px', padding: '32px', color: '#ffffff', boxShadow: '0 10px 30px rgba(10, 77, 46, 0.2)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 900, margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
              <DollarSign size={24} color="#FFB800" /> FINANCIAL REVENUE & MARGIN METRICS
            </h2>
            <span style={{ background: '#FFB800', color: '#0A4D2E', padding: '4px 12px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 900 }}>
              CONFIDENTIAL DATA
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
            <div style={{ background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(10px)', padding: '20px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.2)' }}>
              <div style={{ fontSize: '0.78rem', opacity: 0.85, fontWeight: 700, marginBottom: '6px' }}>TOTAL REVENUE</div>
              <div style={{ fontSize: '2rem', fontWeight: 900 }}>AED {totalRevenue.toFixed(2)}</div>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(10px)', padding: '20px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.2)' }}>
              <div style={{ fontSize: '0.78rem', opacity: 0.85, fontWeight: 700, marginBottom: '6px' }}>ESTIMATED NET PROFIT</div>
              <div style={{ fontSize: '2rem', fontWeight: 900, color: '#FEF08A' }}>AED {netProfit.toFixed(2)}</div>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(10px)', padding: '20px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.2)' }}>
              <div style={{ fontSize: '0.78rem', opacity: 0.85, fontWeight: 700, marginBottom: '6px' }}>AVERAGE SALES AMOUNT</div>
              <div style={{ fontSize: '2rem', fontWeight: 900 }}>AED {avgSales.toFixed(2)}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
