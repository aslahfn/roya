'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Crown, User, ShieldCheck, ArrowRight, Sparkles, Lock, CheckCircle2 } from 'lucide-react';

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
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0A4D2E 0%, #063821 50%, #042417 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 20px',
      position: 'relative',
      overflow: 'hidden'
    }}>

      {/* Floating Glassmorphism Blur Blobs */}
      <div className="blur-blob blob-gold" style={{ width: '500px', height: '500px', top: '-10%', left: '-10%' }}></div>
      <div className="blur-blob blob-emerald" style={{ width: '600px', height: '600px', bottom: '-15%', right: '-10%' }}></div>
      <div className="blur-blob blob-mint" style={{ width: '400px', height: '400px', top: '40%', right: '15%' }}></div>

      {/* Brand Crown Header */}
      <Link href="/" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '32px', textDecoration: 'none', position: 'relative', zIndex: 10 }}>
        <div className="royal-pulse" style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #FFC837 0%, #FFB800 50%, #D4AF37 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 12px 32px rgba(255, 184, 0, 0.45)',
          marginBottom: '12px'
        }}>
          <Crown size={36} color="#0A4D2E" strokeWidth={2.5} />
        </div>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.2rem', fontWeight: 900, color: '#ffffff', letterSpacing: '-0.02em', textShadow: '0 4px 12px rgba(0,0,0,0.3)' }}>
          ROYAL SUPERMARKET
        </h1>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          background: 'rgba(255,184,0,0.2)',
          border: '1px solid rgba(255,184,0,0.35)',
          padding: '4px 14px',
          borderRadius: '20px',
          fontSize: '0.78rem',
          color: '#FFB800',
          fontWeight: 800,
          marginTop: '6px'
        }}>
          <Sparkles size={14} />
          <span>SYSTEM PORTAL AUTHENTICATION</span>
        </div>
      </Link>

      {/* Ultra-Premium Glass Panel */}
      <div className="glass-panel animate-fade-in" style={{
        width: '100%',
        maxWidth: '480px',
        padding: '40px 36px',
        background: 'rgba(255, 255, 255, 0.92)',
        backdropFilter: 'blur(30px)',
        WebkitBackdropFilter: 'blur(30px)',
        boxShadow: '0 24px 60px rgba(0, 0, 0, 0.3)',
        borderRadius: '28px',
        position: 'relative',
        zIndex: 10,
        border: '1px solid rgba(255, 255, 255, 0.6)'
      }}>

        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0A4D2E', marginBottom: '6px' }}>
            Choose Portal Access
          </h2>
          <p style={{ fontSize: '0.88rem', color: '#4A6354' }}>
            Select your role to access Customer Store or Admin Dashboard
          </p>
        </div>

        {error && (
          <div style={{
            background: '#FEE2E2',
            border: '1px solid #EF4444',
            color: '#B91C1C',
            padding: '12px 16px',
            borderRadius: '14px',
            marginBottom: '20px',
            fontSize: '0.85rem',
            fontWeight: 600,
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}

        {/* Portal Role Selector Buttons with Glassmorphism */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '14px',
          marginBottom: '28px'
        }}>
          <button
            type="button"
            onClick={() => handleQuickDemo('customer')}
            className={`btn ${loginMode === 'customer' ? 'btn-primary' : 'btn-secondary'}`}
            style={{
              padding: '16px',
              borderRadius: '16px',
              fontWeight: 800,
              fontSize: '0.95rem',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '6px',
              boxShadow: loginMode === 'customer' ? '0 10px 28px rgba(10,77,46,0.35)' : 'none'
            }}
          >
            <User size={22} />
            <span>Customer Portal</span>
          </button>

          <button
            type="button"
            onClick={() => handleQuickDemo('admin')}
            className={`btn ${loginMode === 'admin' ? 'btn-gold' : 'btn-secondary'}`}
            style={{
              padding: '16px',
              borderRadius: '16px',
              fontWeight: 800,
              fontSize: '0.95rem',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '6px',
              boxShadow: loginMode === 'admin' ? '0 10px 28px rgba(255,184,0,0.4)' : 'none'
            }}
          >
            <ShieldCheck size={22} />
            <span>Admin Portal</span>
          </button>
        </div>

        {/* Manual Login Form */}
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
              borderRadius: '16px',
              fontWeight: 800,
              marginTop: '6px'
            }}
          >
            {loading ? 'AUTHENTICATING...' : `LOG IN AS ${loginMode.toUpperCase()}`}
          </button>
        </form>

        {/* Footer info */}
        <div style={{ textAlign: 'center', marginTop: '24px', paddingTop: '16px', borderTop: '1px solid rgba(10, 77, 46, 0.1)' }}>
          <p style={{ fontSize: '0.8rem', color: '#4A6354', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
            <Lock size={14} color="#16A34A" /> Click <strong>Customer</strong> or <strong>Admin</strong> above for 1-click portal entry!
          </p>
        </div>

      </div>
    </div>
  );
}
