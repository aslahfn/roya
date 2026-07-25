'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Crown, ShoppingBag, User, ShieldCheck, KeyRound, UserPlus, LogIn, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const [portalRole, setPortalRole] = useState<'customer' | 'admin'>('customer');
  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>('login');
  
  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMsg('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email || 'royasupermarket.com',
          password: password || 'roya@123',
          portalRole: 'admin',
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        window.location.href = '/admin';
      } else {
        setError(data.error || 'Invalid Administrator Credentials');
      }
    } catch (err) {
      setError('Invalid Administrator Credentials');
    } finally {
      setLoading(false);
    }
  };

  const handleCustomerAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMsg('');

    if (mode === 'register') {
      if (!name || !email || !password) {
        setError('Please fill in all required fields.');
        setLoading(false);
        return;
      }
      try {
        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, phone, password }),
        });

        const data = await res.json();
        if (res.ok && data.success) {
          window.location.href = '/';
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

    if (mode === 'forgot') {
      if (!email) {
        setError('Please enter your registered email address.');
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
          setSuccessMsg(data.message || 'Password reset link sent to your email address.');
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

    // Customer Login
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email || 'customer@supermarket.com',
          password: password || 'password123',
          portalRole: 'customer',
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        window.location.href = '/';
      } else {
        setError(data.error || 'Invalid credentials');
      }
    } catch (err) {
      setError('Connection error during login');
    } finally {
      setLoading(false);
    }
  };

  const switchRole = (role: 'customer' | 'admin') => {
    setPortalRole(role);
    setError('');
    setSuccessMsg('');
    if (role === 'admin') {
      setMode('login'); // Admin ONLY has Login page
      setEmail('royasupermarket.com');
      setPassword('roya@123');
    } else {
      setEmail('');
      setPassword('');
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

      {/* Top Left Navigation */}
      <div style={{ width: '100%', maxWidth: '460px', marginBottom: '12px', zIndex: 10 }}>
        <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#16a34a', fontSize: '0.82rem', fontWeight: 800, textDecoration: 'none', background: '#f0fdf4', padding: '8px 14px', borderRadius: '12px', border: '1px solid rgba(22,163,74,0.2)' }}>
          ← Back to Storefront
        </Link>
      </div>

      {/* Brand Header */}
      <Link href="/" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '24px', textDecoration: 'none', position: 'relative', zIndex: 1 }}>
        <div style={{ position: 'relative', marginBottom: '12px' }}>
          <div style={{
            position: 'relative',
            width: '72px',
            height: '72px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #16A34A 0%, #15803D 100%)',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 12px 32px rgba(22, 163, 74, 0.4)',
            border: '2.5px solid #ffffff'
          }}>
            <Crown size={34} color="#FEF08A" strokeWidth={2.5} />
            <ShoppingBag size={20} color="#ffffff" style={{ position: 'absolute', bottom: '-4px', right: '-4px' }} />
          </div>
        </div>

        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.2rem', fontWeight: 900, color: '#16A34A', letterSpacing: '-0.02em', textAlign: 'center', margin: 0 }}>
          ROYA SUPERMARKET
        </h1>
        <p style={{ fontSize: '0.85rem', color: '#166534', fontWeight: 700, marginTop: '2px' }}>
          Production-Ready Grocery Platform
        </p>
      </Link>

      {/* Main Auth Card */}
      <div style={{
        width: '100%',
        maxWidth: '460px',
        padding: '36px 32px',
        background: '#ffffff',
        boxShadow: '0 16px 40px rgba(22, 163, 74, 0.12)',
        borderRadius: '24px',
        border: '1px solid rgba(22, 163, 74, 0.2)',
        position: 'relative',
        zIndex: 1
      }}>
        
        {/* Role Selection Tabs */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '8px',
          background: '#F0FDF4',
          padding: '4px',
          borderRadius: '16px',
          marginBottom: '24px',
          border: '1px solid rgba(22, 163, 74, 0.15)'
        }}>
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
            <ShieldCheck size={16} /> Admin Login ONLY
          </button>
        </div>

        {/* Feedback Alert */}
        {error && (
          <div style={{
            background: '#FEE2E2',
            border: '1px solid #EF4444',
            color: '#B91C1C',
            padding: '12px 16px',
            borderRadius: '12px',
            marginBottom: '20px',
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
            marginBottom: '20px',
            fontSize: '0.85rem',
            fontWeight: 700,
            textAlign: 'center'
          }}>
            {successMsg}
          </div>
        )}

        {/* ADMIN LOGIN ONLY VIEW */}
        {portalRole === 'admin' ? (
          <div>
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#052e16', marginBottom: '4px' }}>
                Administrator Portal
              </h2>
              <p style={{ fontSize: '0.8rem', color: '#166534' }}>
                Admin access is restricted to fixed credentials only.
              </p>
            </div>

            <form onSubmit={handleAdminLogin}>
              <div className="input-group" style={{ marginBottom: '16px' }}>
                <label className="input-label" style={{ fontSize: '0.75rem', fontWeight: 800, color: '#15803D' }}>ADMIN EMAIL</label>
                <input
                  type="text"
                  className="input-field"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="royasupermarket.com"
                  required
                  style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid #bbf7d0', fontSize: '0.95rem', fontWeight: 700 }}
                />
              </div>

              <div className="input-group" style={{ marginBottom: '20px' }}>
                <label className="input-label" style={{ fontSize: '0.75rem', fontWeight: 800, color: '#15803D' }}>ADMIN PASSWORD</label>
                <input
                  type="password"
                  className="input-field"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid #bbf7d0', fontSize: '0.95rem', fontWeight: 700 }}
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
                style={{ width: '100%', padding: '16px', fontSize: '1rem', borderRadius: '14px', fontWeight: 800, background: '#16A34A', color: '#fff', border: 'none', cursor: 'pointer' }}
              >
                {loading ? 'AUTHENTICATING...' : 'ACCESS ADMIN DASHBOARD'}
              </button>
            </form>
          </div>
        ) : (
          /* CUSTOMER AUTHENTICATION VIEW */
          <div>
            {/* Customer Sub-Mode Switcher */}
            <div style={{ display: 'flex', justifyContent: 'space-around', borderBottom: '2px solid #f0fdf4', paddingBottom: '12px', marginBottom: '20px' }}>
              <button
                type="button"
                onClick={() => { setMode('login'); setError(''); setSuccessMsg(''); }}
                style={{ background: 'none', border: 'none', fontWeight: mode === 'login' ? 800 : 600, color: mode === 'login' ? '#16A34A' : '#64748b', cursor: 'pointer', fontSize: '0.9rem' }}
              >
                <LogIn size={15} style={{ verticalAlign: 'middle', marginRight: '4px' }} /> Login
              </button>
              <button
                type="button"
                onClick={() => { setMode('register'); setError(''); setSuccessMsg(''); }}
                style={{ background: 'none', border: 'none', fontWeight: mode === 'register' ? 800 : 600, color: mode === 'register' ? '#16A34A' : '#64748b', cursor: 'pointer', fontSize: '0.9rem' }}
              >
                <UserPlus size={15} style={{ verticalAlign: 'middle', marginRight: '4px' }} /> Register
              </button>
              <button
                type="button"
                onClick={() => { setMode('forgot'); setError(''); setSuccessMsg(''); }}
                style={{ background: 'none', border: 'none', fontWeight: mode === 'forgot' ? 800 : 600, color: mode === 'forgot' ? '#16A34A' : '#64748b', cursor: 'pointer', fontSize: '0.9rem' }}
              >
                <KeyRound size={15} style={{ verticalAlign: 'middle', marginRight: '4px' }} /> Reset Password
              </button>
            </div>

            <form onSubmit={handleCustomerAuth}>
              {mode === 'register' && (
                <div className="input-group" style={{ marginBottom: '16px' }}>
                  <label className="input-label" style={{ fontSize: '0.75rem', fontWeight: 800, color: '#15803D' }}>FULL NAME</label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid #bbf7d0' }}
                  />
                </div>
              )}

              <div className="input-group" style={{ marginBottom: '16px' }}>
                <label className="input-label" style={{ fontSize: '0.75rem', fontWeight: 800, color: '#15803D' }}>EMAIL ADDRESS</label>
                <input
                  type="email"
                  className="input-field"
                  placeholder="customer@supermarket.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid #bbf7d0' }}
                />
              </div>

              {mode === 'register' && (
                <div className="input-group" style={{ marginBottom: '16px' }}>
                  <label className="input-label" style={{ fontSize: '0.75rem', fontWeight: 800, color: '#15803D' }}>MOBILE NUMBER</label>
                  <input
                    type="tel"
                    className="input-field"
                    placeholder="+966 50 123 4567"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid #bbf7d0' }}
                  />
                </div>
              )}

              {mode !== 'forgot' && (
                <div className="input-group" style={{ marginBottom: '20px' }}>
                  <label className="input-label" style={{ fontSize: '0.75rem', fontWeight: 800, color: '#15803D' }}>PASSWORD</label>
                  <input
                    type="password"
                    className="input-field"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid #bbf7d0' }}
                  />
                </div>
              )}

              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
                style={{ width: '100%', padding: '16px', fontSize: '1rem', borderRadius: '14px', fontWeight: 800, background: '#16A34A', color: '#fff', border: 'none', cursor: 'pointer' }}
              >
                {loading 
                  ? 'PROCESSING...' 
                  : mode === 'register' 
                    ? 'CREATE CUSTOMER ACCOUNT' 
                    : mode === 'forgot' 
                      ? 'SEND PASSWORD RESET LINK' 
                      : 'SIGN IN TO SUPERMARKET'}
              </button>
            </form>
          </div>
        )}

      </div>
    </div>
  );
}
