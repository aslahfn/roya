'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Crown, ShoppingBag, User, ShieldCheck, KeyRound, UserPlus, LogIn, Sparkles, Zap } from 'lucide-react';

export default function LoginPage() {
  const [portalRole, setPortalRole] = useState<'customer' | 'admin'>('admin');
  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>('login');
  
  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('royasupermarket.com');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('roya@123');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  // 1-Click Instant Admin Bypass Login
  const handleInstantAdminLogin = async () => {
    setLoading(true);
    setError('');
    setSuccessMsg('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'royasupermarket.com',
          password: 'roya@123',
          portalRole: 'admin',
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        window.location.href = '/admin';
      } else {
        setError(data.error || 'Failed to authenticate Admin');
      }
    } catch (err) {
      setError('Connection error during instant admin login');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMsg('');

    // Registration (Admin or Customer)
    if (mode === 'register') {
      if (!name || !email || !password) {
        setError('Please fill in Name, Email, and Password.');
        setLoading(false);
        return;
      }
      try {
        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name,
            email,
            phone,
            password,
            portalRole,
            role: portalRole === 'admin' ? 'SUPER_ADMIN' : 'CUSTOMER'
          }),
        });

        const data = await res.json();
        if (res.ok && data.success) {
          if (portalRole === 'admin') {
            window.location.href = '/admin';
          } else {
            window.location.href = '/';
          }
        } else {
          setError(data.error || 'Registration failed');
        }
      } catch (err) {
        setError('Connection error during registration');
      } finally {
        setLoading(false);
      }
      return;
    }

    // Forgot Password
    if (mode === 'forgot') {
      if (!email) {
        setError('Please enter your email address.');
        setLoading(false);
        return;
      }
      try {
        const res = await fetch('/api/auth/reset-password', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
        });
        const data = await res.json();
        if (res.ok && data.success) {
          setSuccessMsg(data.message || 'Password reset instructions sent to your email.');
        } else {
          setError(data.error || 'Reset failed');
        }
      } catch (err) {
        setError('Network error resetting password');
      } finally {
        setLoading(false);
      }
      return;
    }

    // Login (Admin or Customer)
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email || (portalRole === 'admin' ? 'royasupermarket.com' : 'customer@supermarket.com'),
          password: password || (portalRole === 'admin' ? 'roya@123' : 'password123'),
          portalRole,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        if (data.role === 'SUPER_ADMIN' || portalRole === 'admin') {
          window.location.href = '/admin';
        } else {
          window.location.href = '/';
        }
      } else {
        setError(data.error || 'Invalid Credentials');
      }
    } catch (err) {
      setError('Connection error during login');
    } finally {
      setLoading(false);
    }
  };

  const switchRole = (role: 'customer' | 'admin') => {
    setPortalRole(role);
    setMode('login');
    setError('');
    setSuccessMsg('');
    if (role === 'admin') {
      setEmail('royasupermarket.com');
      setPassword('roya@123');
    } else {
      setEmail('customer@supermarket.com');
      setPassword('password123');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #FFFFFF 0%, #F0FDF4 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 20px',
      position: 'relative',
      overflow: 'hidden'
    }}>

      {/* Top Navigation */}
      <div style={{ width: '100%', maxWidth: '480px', marginBottom: '12px', zIndex: 10 }}>
        <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#16a34a', fontSize: '0.82rem', fontWeight: 800, textDecoration: 'none', background: '#f0fdf4', padding: '8px 14px', borderRadius: '12px', border: '1px solid rgba(22,163,74,0.2)' }}>
          ← Back to Storefront
        </Link>
      </div>

      {/* Brand Header */}
      <Link href="/" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '20px', textDecoration: 'none', position: 'relative', zIndex: 1 }}>
        <div style={{ position: 'relative', marginBottom: '10px' }}>
          <div style={{
            position: 'relative',
            width: '68px',
            height: '68px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #16A34A 0%, #15803D 100%)',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 12px 32px rgba(22, 163, 74, 0.4)',
            border: '2.5px solid #ffffff'
          }}>
            <Crown size={32} color="#FEF08A" strokeWidth={2.5} />
            <ShoppingBag size={18} color="#ffffff" style={{ position: 'absolute', bottom: '-4px', right: '-4px' }} />
          </div>
        </div>

        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.2rem', fontWeight: 900, color: '#16A34A', letterSpacing: '-0.02em', textAlign: 'center', margin: 0 }}>
          ROYA SUPERMARKET
        </h1>
        <p style={{ fontSize: '0.82rem', color: '#166534', fontWeight: 700, marginTop: '2px' }}>
          Authentication & Access Portal
        </p>
      </Link>

      {/* Main Auth Card */}
      <div style={{
        width: '100%',
        maxWidth: '480px',
        padding: '32px 28px',
        background: '#ffffff',
        boxShadow: '0 16px 40px rgba(22, 163, 74, 0.12)',
        borderRadius: '24px',
        border: '1px solid rgba(22, 163, 74, 0.2)',
        position: 'relative',
        zIndex: 1
      }}>
        
        {/* Role Switcher Tabs */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '8px',
          background: '#F0FDF4',
          padding: '4px',
          borderRadius: '16px',
          marginBottom: '20px',
          border: '1px solid rgba(22, 163, 74, 0.15)'
        }}>
          <button
            type="button"
            onClick={() => switchRole('admin')}
            style={{
              padding: '10px',
              borderRadius: '12px',
              border: 'none',
              fontWeight: 800,
              fontSize: '0.88rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              background: portalRole === 'admin' ? '#16A34A' : 'transparent',
              color: portalRole === 'admin' ? '#ffffff' : '#166534',
              boxShadow: portalRole === 'admin' ? '0 2px 8px rgba(22,163,74,0.25)' : 'none'
            }}
          >
            <ShieldCheck size={16} /> Admin Portal
          </button>

          <button
            type="button"
            onClick={() => switchRole('customer')}
            style={{
              padding: '10px',
              borderRadius: '12px',
              border: 'none',
              fontWeight: 800,
              fontSize: '0.88rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              background: portalRole === 'customer' ? '#16A34A' : 'transparent',
              color: portalRole === 'customer' ? '#ffffff' : '#166534',
              boxShadow: portalRole === 'customer' ? '0 2px 8px rgba(22,163,74,0.25)' : 'none'
            }}
          >
            <User size={16} /> Customer Portal
          </button>
        </div>

        {/* 1-CLICK INSTANT ADMIN BYPASS BUTTON */}
        {portalRole === 'admin' && (
          <div style={{ marginBottom: '20px' }}>
            <button
              type="button"
              onClick={handleInstantAdminLogin}
              disabled={loading}
              style={{
                width: '100%',
                padding: '16px',
                borderRadius: '16px',
                background: 'linear-gradient(135deg, #16A34A 0%, #15803D 100%)',
                color: '#ffffff',
                border: '2px solid #FFB800',
                fontWeight: 900,
                fontSize: '1rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 6px 20px rgba(22, 163, 74, 0.35)'
              }}
            >
              <Zap size={20} color="#FFB800" />
              <span>⚡ ONE-CLICK INSTANT ADMIN LOGIN</span>
            </button>
          </div>
        )}

        {/* Mode Switcher: Login vs Register vs Reset */}
        <div style={{ display: 'flex', justifyContent: 'space-around', borderBottom: '2px solid #f0fdf4', paddingBottom: '10px', marginBottom: '20px' }}>
          <button
            type="button"
            onClick={() => { setMode('login'); setError(''); setSuccessMsg(''); }}
            style={{ background: 'none', border: 'none', fontWeight: mode === 'login' ? 800 : 600, color: mode === 'login' ? '#16A34A' : '#64748b', cursor: 'pointer', fontSize: '0.88rem' }}
          >
            <LogIn size={15} style={{ verticalAlign: 'middle', marginRight: '4px' }} /> Login
          </button>
          <button
            type="button"
            onClick={() => { setMode('register'); setError(''); setSuccessMsg(''); }}
            style={{ background: 'none', border: 'none', fontWeight: mode === 'register' ? 800 : 600, color: mode === 'register' ? '#16A34A' : '#64748b', cursor: 'pointer', fontSize: '0.88rem' }}
          >
            <UserPlus size={15} style={{ verticalAlign: 'middle', marginRight: '4px' }} /> Register {portalRole === 'admin' ? 'Admin' : ''}
          </button>
          <button
            type="button"
            onClick={() => { setMode('forgot'); setError(''); setSuccessMsg(''); }}
            style={{ background: 'none', border: 'none', fontWeight: mode === 'forgot' ? 800 : 600, color: mode === 'forgot' ? '#16A34A' : '#64748b', cursor: 'pointer', fontSize: '0.88rem' }}
          >
            <KeyRound size={15} style={{ verticalAlign: 'middle', marginRight: '4px' }} /> Reset Password
          </button>
        </div>

        {/* Alerts */}
        {error && (
          <div style={{
            background: '#FEE2E2',
            border: '1px solid #EF4444',
            color: '#B91C1C',
            padding: '12px 16px',
            borderRadius: '12px',
            marginBottom: '16px',
            fontSize: '0.85rem',
            fontWeight: 700,
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}

        {successMsg && (
          <div style={{
            background: '#DCFCE7',
            border: '1px solid #16A34A',
            color: '#15803D',
            padding: '12px 16px',
            borderRadius: '12px',
            marginBottom: '16px',
            fontSize: '0.85rem',
            fontWeight: 700,
            textAlign: 'center'
          }}>
            {successMsg}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {mode === 'register' && (
            <div style={{ marginBottom: '14px' }}>
              <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#15803D', display: 'block', marginBottom: '4px' }}>FULL NAME</label>
              <input
                type="text"
                placeholder={portalRole === 'admin' ? "Admin Name" : "Customer Name"}
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #bbf7d0', fontSize: '0.9rem' }}
              />
            </div>
          )}

          <div style={{ marginBottom: '14px' }}>
            <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#15803D', display: 'block', marginBottom: '4px' }}>EMAIL ADDRESS</label>
            <input
              type="text"
              placeholder={portalRole === 'admin' ? "royasupermarket.com" : "customer@supermarket.com"}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #bbf7d0', fontSize: '0.9rem', fontWeight: 700 }}
            />
          </div>

          {mode === 'register' && (
            <div style={{ marginBottom: '14px' }}>
              <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#15803D', display: 'block', marginBottom: '4px' }}>MOBILE NUMBER (OPTIONAL)</label>
              <input
                type="tel"
                placeholder="+966 50 123 4567"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #bbf7d0', fontSize: '0.9rem' }}
              />
            </div>
          )}

          {mode !== 'forgot' && (
            <div style={{ marginBottom: '20px' }}>
              <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#15803D', display: 'block', marginBottom: '4px' }}>PASSWORD</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #bbf7d0', fontSize: '0.9rem' }}
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '14px',
              fontSize: '0.95rem',
              borderRadius: '14px',
              fontWeight: 800,
              background: '#16A34A',
              color: '#ffffff',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(22, 163, 74, 0.25)'
            }}
          >
            {loading 
              ? 'PROCESSING...' 
              : mode === 'register' 
                ? `CREATE ${portalRole.toUpperCase()} ACCOUNT` 
                : mode === 'forgot' 
                  ? 'SEND RESET LINK' 
                  : `SIGN IN AS ${portalRole.toUpperCase()}`}
          </button>
        </form>

      </div>
    </div>
  );
}
