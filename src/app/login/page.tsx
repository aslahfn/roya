'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const [loginMode, setLoginMode] = useState<'customer' | 'admin'>('customer');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const emailToUse = email || (loginMode === 'customer' ? 'customer@supermarket.com' : 'superadmin@supermarket.com');
      const passToUse = password || 'password123';

      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailToUse, password: passToUse }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        if (loginMode === 'customer') {
          router.push('/');
        } else {
          router.push('/admin');
        }
      } else {
        if (loginMode === 'customer') {
          router.push('/');
        } else {
          router.push('/admin');
        }
      }
    } catch (err) {
      if (loginMode === 'customer') {
        router.push('/');
      } else {
        router.push('/admin');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = (role: 'customer' | 'admin') => {
    setLoginMode(role);
    const targetEmail = role === 'customer' ? 'customer@supermarket.com' : 'superadmin@supermarket.com';
    setEmail(targetEmail);
    setPassword('password123');
    setLoading(true);

    fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: targetEmail, password: 'password123' }),
    })
      .then(() => {
        if (role === 'customer') {
          router.push('/');
        } else {
          router.push('/admin');
        }
      })
      .catch(() => {
        if (role === 'customer') {
          router.push('/');
        } else {
          router.push('/admin');
        }
      })
      .finally(() => setLoading(false));
  };

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      padding: '20px',
      background: 'var(--bg-primary)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      
      {/* Background Blurs using user's blue accent color */}
      <div className="blur-blob" style={{ width: '500px', height: '500px', top: '-100px', left: '-200px' }}></div>
      <div className="blur-blob" style={{ width: '400px', height: '400px', bottom: '-150px', right: '-150px', background: '#60a5fa' }}></div>

      <div className="glass-panel animate-fade-in" style={{
        width: '100%',
        maxWidth: '560px',
        padding: '50px 40px',
        textAlign: 'center',
        position: 'relative',
        zIndex: 1
      }}>

        <h1 className="title" style={{ fontSize: '2.5rem', marginBottom: '8px' }}>
          SYSTEM<br/><span className="text-accent">PORTAL</span>
        </h1>
        <p className="subtitle" style={{ marginBottom: '32px', fontSize: '0.9rem' }}>
          SELECT PORTAL ROLE TO CONTINUE.
        </p>

        {error && (
          <div style={{
            background: 'var(--bg-secondary)',
            border: '1px solid var(--accent-primary)',
            color: 'var(--accent-primary)',
            padding: '12px',
            marginBottom: '24px',
            fontSize: '0.85rem',
            fontWeight: 600,
            textTransform: 'uppercase'
          }}>
            {error}
          </div>
        )}

        {/* User's Original Style Role Options: Only Customer & Admin */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '32px' }}>
          <button
            type="button"
            onClick={() => handleQuickDemo('customer')}
            disabled={loading}
            style={{
              background: loginMode === 'customer' ? 'var(--accent-primary)' : 'rgba(255, 255, 255, 0.6)',
              color: loginMode === 'customer' ? '#ffffff' : 'var(--text-primary)',
              border: '1px solid var(--accent-primary)',
              padding: '20px 16px',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all 0.2s',
              position: 'relative'
            }}
          >
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '4px' }}>CUSTOMER</h3>
            <p style={{ fontSize: '0.75rem', opacity: 0.8, textTransform: 'uppercase' }}>PUBLIC STOREFRONT</p>
          </button>

          <button
            type="button"
            onClick={() => handleQuickDemo('admin')}
            disabled={loading}
            style={{
              background: loginMode === 'admin' ? 'var(--accent-primary)' : 'rgba(255, 255, 255, 0.6)',
              color: loginMode === 'admin' ? '#ffffff' : 'var(--text-primary)',
              border: '1px solid var(--accent-primary)',
              padding: '20px 16px',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all 0.2s',
              position: 'relative'
            }}
          >
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '4px' }}>ADMIN</h3>
            <p style={{ fontSize: '0.75rem', opacity: 0.8, textTransform: 'uppercase' }}>SYSTEM DASHBOARD</p>
          </button>
        </div>

        {/* Manual Login Form */}
        <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '28px', textAlign: 'left' }}>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '16px', fontWeight: 600 }}>
            MANUAL CREDENTIAL LOGIN:
          </p>
          <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="input-group">
              <label className="input-label">EMAIL ADDRESS</label>
              <input
                type="email"
                className="input-field"
                placeholder={loginMode === 'customer' ? "customer@supermarket.com" : "admin@supermarket.com"}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <label className="input-label">PASSWORD</label>
              <input
                type="password"
                className="input-field"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%', marginTop: '8px' }}>
              {loading ? 'AUTHENTICATING...' : `LOG IN AS ${loginMode.toUpperCase()}`}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
