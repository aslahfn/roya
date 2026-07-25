'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, LayoutGrid, ShoppingBag, Receipt, User } from 'lucide-react';

export function MobileNav() {
  const pathname = usePathname();

  const navItems = [
    { label: 'Home', href: '/', icon: Home },
    { label: 'Categories', href: '/#categories', icon: LayoutGrid },
    { label: 'Cart', href: '/cart', icon: ShoppingBag },
    { label: 'Orders', href: '/orders', icon: Receipt },
    { label: 'Account', href: '/login', icon: User },
  ];

  return (
    <nav className="mobile-only" style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      zIndex: 1000,
      display: 'flex',
      justifyContent: 'center',
      pointerEvents: 'none',
      padding: '0 0 calc(env(safe-area-inset-bottom, 0px)) 0',
    }}>
      <div style={{
        width: '100%',
        maxWidth: '480px',
        background: 'rgba(255, 255, 255, 0.96)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderTop: '1px solid rgba(22, 163, 74, 0.16)',
        boxShadow: '0 -8px 24px rgba(6, 56, 33, 0.08)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        padding: '8px 12px 10px',
        pointerEvents: 'auto',
      }}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== '/' && pathname?.startsWith(item.href) && !item.href.includes('#'));
          
          return (
            <Link
              key={item.label}
              href={item.href}
              className="touch-active"
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '3px',
                textDecoration: 'none',
                color: isActive ? '#16a34a' : '#64748b',
                flex: 1,
                padding: '6px 0',
                position: 'relative',
                transition: 'all 0.2s ease',
              }}
            >
              {isActive && (
                <span style={{
                  position: 'absolute',
                  top: '-8px',
                  width: '24px',
                  height: '3px',
                  borderRadius: '3px',
                  background: 'linear-gradient(90deg, #16a34a 0%, #15803d 100%)',
                }} />
              )}

              <div style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transform: isActive ? 'translateY(-1px)' : 'none',
                transition: 'transform 0.2s ease',
              }}>
                <Icon size={22} strokeWidth={isActive ? 2.5 : 1.8} />
              </div>

              <span style={{
                fontSize: '0.72rem',
                fontWeight: isActive ? 700 : 500,
                letterSpacing: '-0.01em',
                lineHeight: 1.1,
              }}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
