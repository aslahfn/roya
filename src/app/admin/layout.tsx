import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Package, 
  Grid, 
  Truck, 
  Users, 
  Boxes, 
  Bell, 
  BarChart3, 
  Settings,
  LogOut,
  Crown
} from 'lucide-react';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session || session.role === 'CUSTOMER') {
    redirect('/login');
  }

  const menuItems = [
    { label: 'Dashboard Overview', href: '/admin', icon: LayoutDashboard },
    { label: 'Orders', href: '/admin/orders', icon: ShoppingBag },
    { label: 'Products', href: '/admin/products', icon: Package },
    { label: 'Categories', href: '/admin/categories', icon: Grid },
    { label: 'Drivers', href: '/admin/drivers', icon: Truck },
    { label: 'Customers', href: '/admin/customers', icon: Users },
    { label: 'Inventory', href: '/admin/inventory', icon: Boxes },
    { label: 'Notifications', href: '/admin/notifications', icon: Bell },
    { label: 'Reports', href: '/admin/reports/financial', icon: BarChart3 },
    { label: 'Settings', href: '/admin/settings', icon: Settings },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc', position: 'relative', overflow: 'hidden' }}>
      
      {/* Sidebar */}
      <aside style={{
        width: '270px',
        background: '#ffffff',
        borderRight: '1px solid #e2e8f0',
        padding: '24px 0',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        zIndex: 10,
        boxShadow: '4px 0 20px rgba(0,0,0,0.02)'
      }}>
        {/* Brand Header */}
        <div style={{ padding: '0 24px', marginBottom: '28px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #16A34A 0%, #15803D 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFB800',
            boxShadow: '0 4px 12px rgba(22,163,74,0.3)'
          }}>
            <Crown size={22} />
          </div>
          <div>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', fontWeight: 900, margin: 0, color: '#0F172A', lineHeight: 1.1 }}>
              ROYA ADMIN
            </h2>
            <span style={{ fontSize: '0.68rem', fontWeight: 800, color: '#16A34A', letterSpacing: '0.05em' }}>
              PROD PLATFORM
            </span>
          </div>
        </div>

        {/* Admin User Info Badge */}
        <div style={{ padding: '0 24px', marginBottom: '20px' }}>
          <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', padding: '10px 14px', borderRadius: '14px' }}>
            <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#166534' }}>{session.name}</div>
            <div style={{ fontSize: '0.72rem', color: '#15803d', fontWeight: 700 }}>{session.role}</div>
          </div>
        </div>

        {/* Simplified Navigation Menu */}
        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px', padding: '0 16px' }}>
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.label}
                href={item.href}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 16px',
                  fontWeight: 700,
                  fontSize: '0.88rem',
                  color: '#334155',
                  borderRadius: '14px',
                  textDecoration: 'none',
                  transition: 'all 0.2s ease',
                }}
              >
                <Icon size={18} color="#16a34a" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div style={{ padding: '0 24px' }}>
          <form action="/api/auth/logout" method="POST">
            <button
              type="submit"
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '14px',
                border: '1px solid #fecdd3',
                background: '#fff1f2',
                color: '#e11d48',
                fontWeight: 800,
                fontSize: '0.88rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              <LogOut size={16} /> LOGOUT ADMIN
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, padding: '36px 40px', overflowY: 'auto', position: 'relative', zIndex: 1 }}>
        <div className="animate-fade-in">
          {children}
        </div>
      </main>
    </div>
  );
}
