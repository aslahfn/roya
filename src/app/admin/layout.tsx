import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session || session.role === 'CUSTOMER') {
    redirect('/login');
  }

  const isSuperOrPricing = session.role === 'SUPER_ADMIN' || session.role === 'PRICING_MANAGER';

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-primary)', position: 'relative', overflow: 'hidden' }}>
      
      {/* Animated Professional Background Watermark */}
      <div style={{
        position: 'fixed',
        bottom: '-20%',
        right: '-10%',
        width: '80vw',
        height: '80vw',
        maxWidth: '1200px',
        maxHeight: '1200px',
        opacity: 0.03,
        pointerEvents: 'none',
        zIndex: 0,
        backgroundImage: 'url(/logo.jpg)',
        backgroundSize: 'contain',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        mixBlendMode: 'multiply',
        animation: 'slowRotate 60s linear infinite',
      }}></div>

      <style>{`
        @keyframes slowRotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>

      {/* Sidebar */}
      <aside style={{
        width: '260px',
        background: 'rgba(248, 250, 252, 0.8)',
        backdropFilter: 'blur(20px)',
        borderRight: '1px solid var(--border-light)',
        padding: '24px 0',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        zIndex: 10
      }}>
        <div style={{ padding: '0 24px', marginBottom: '32px' }}>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', fontWeight: 800, margin: 0, letterSpacing: '-0.02em' }}>SYSTEM_ADMIN</h2>
          <span className="badge badge-neutral" style={{ marginTop: '12px' }}>{session.role.replace('_', ' ')}</span>
        </div>

        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px', padding: '0 16px' }}>
          <Link href="/admin" style={{ padding: '12px 16px', fontWeight: 600, fontSize: '0.9rem', textTransform: 'uppercase', transition: 'background 0.2s', ...({ ':hover': { background: 'var(--bg-tertiary)' } } as any) }}>
            DASHBOARD
          </Link>
          <Link href="/admin/products" style={{ padding: '12px 16px', fontWeight: 600, fontSize: '0.9rem', textTransform: 'uppercase' }}>
            PRODUCTS
          </Link>
          <Link href="/admin/inventory" style={{ padding: '12px 16px', fontWeight: 600, fontSize: '0.9rem', textTransform: 'uppercase' }}>
            INVENTORY
          </Link>
          <Link href="/admin/delivery" style={{ padding: '12px 16px', fontWeight: 600, fontSize: '0.9rem', textTransform: 'uppercase' }}>
            DELIVERY DISPATCH
          </Link>

          {/* RBAC Protected Links */}
          {isSuperOrPricing && (
            <>
              <div style={{ margin: '24px 0 8px 16px', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--accent-primary)', fontWeight: 600 }}>
                RESTRICTED
              </div>
              <Link href="/admin/pricing" style={{ padding: '12px 16px', fontWeight: 600, fontSize: '0.9rem', textTransform: 'uppercase', color: 'var(--accent-primary)' }}>
                PRICING
              </Link>
              <Link href="/admin/reports/financial" style={{ padding: '12px 16px', fontWeight: 600, fontSize: '0.9rem', textTransform: 'uppercase', color: 'var(--accent-primary)' }}>
                FINANCIALS
              </Link>
            </>
          )}
        </nav>

        <div style={{ padding: '24px' }}>
          <form action="/api/auth/logout" method="POST">
            <button type="submit" className="btn btn-secondary" style={{ width: '100%' }}>LOGOUT</button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, padding: '40px', overflowY: 'auto', position: 'relative', zIndex: 1 }}>
        <div className="animate-fade-in">
          {children}
        </div>
      </main>
    </div>
  );
}
