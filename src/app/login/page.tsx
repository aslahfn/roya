'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Crown, User, ShieldCheck, ArrowRight, MessageSquare } from 'lucide-react';

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
        // Fallback demo redirect if user not seeded yet
        if (loginMode === 'customer') {
          router.push('/setup-profile');
        } else {
          router.push('/admin');
        }
      }
    } catch (err) {
      if (loginMode === 'customer') {
        router.push('/setup-profile');
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
      .then((res) => res.json())
      .then((data) => {
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
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #F4F7F5 0%, #E6F4ED 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 20px',
      position: 'relative'
    }}>

      {/* Brand Header */}
      <Link href="/" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '28px', textDecoration: 'none' }}>
        <div style={{
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #FFB800 0%, #D4AF37 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 8px 24px rgba(255,184,0,0.35)',
          marginBottom: '8px'
        }}>
          <Crown size={32} color="#0A4D2E" strokeWidth={2.5} />
        </div>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', fontWeight: 800, color: '#0A4D2E', letterSpacing: '-0.02em' }}>
          ROYAL SUPERMARKET
        </h1>
        <p style={{ fontSize: '0.85rem', color: '#4a6354', fontWeight: 600 }}>
          System Portal Access
        </p>
      </Link>

      {/* Portal Container */}
      <div className="royal-card animate-fade-in" style={{
        width: '100%',
        maxWidth: '460px',
        padding: '36px 32px',
        background: '#ffffff',
        boxShadow: '0 16px 40px rgba(10, 77, 46, 0.1)'
      }}>

        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#112218', marginBottom: '4px' }}>
            System Portal Login
          </h2>
          <p style={{ fontSize: '0.85rem', color: '#4a6354' }}>
            Select portal role to continue
          </p>
        </div>

        {error && (
          <div style={{
            background: '#FEE2E2',
            border: '1px solid #EF4444',
            color: '#B91C1C',
            padding: '12px 16px',
            borderRadius: '12px',
            marginBottom: '20px',
            fontSize: '0.85rem',
            fontWeight: 600,
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}

        {/* Portal Role Selector: Only Customer & Admin */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '12px',
          marginBottom: '24px'
        }}>
          <button
            type="button"
            onClick={() => handleQuickDemo('customer')}
            className={`btn ${loginMode === 'customer' ? 'btn-primary' : 'btn-secondary'}`}
            style={{
              padding: '14px',
              borderRadius: '14px',
              fontWeight: 800,
              fontSize: '0.95rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            <User size={18} />
            Customer
          </button>

          <button
            type="button"
            onClick={() => handleQuickDemo('admin')}
            className={`btn ${loginMode === 'admin' ? 'btn-primary' : 'btn-secondary'}`}
            style={{
              padding: '14px',
              borderRadius: '14px',
              fontWeight: 800,
              fontSize: '0.95rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            <ShieldCheck size={18} />
            Admin
          </button>
        </div>

        {/* Credentials Form */}
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

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{
              width: '100%',
              padding: '16px',
              fontSize: '1rem',
              borderRadius: '14px',
              fontWeight: 800,
              marginTop: '8px'
            }}
          >
            {loading ? 'AUTHENTICATING...' : `LOG IN AS ${loginMode.toUpperCase()}`}
          </button>
        </form>

        {/* Quick Demo Footer */}
        <div style={{ textAlign: 'center', marginTop: '24px', paddingTop: '16px', borderTop: '1px solid rgba(10, 77, 46, 0.08)' }}>
          <p style={{ fontSize: '0.8rem', color: '#4a6354' }}>
            Click either <strong style={{ color: '#0A4D2E' }}>Customer</strong> or <strong style={{ color: '#0A4D2E' }}>Admin</strong> above for instant 1-click access!
          </p>
        </div>

      </div>
    </div>
  );
}
