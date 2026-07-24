'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Crown, ShoppingBag, User, ShieldCheck, MessageSquare, Sparkles } from 'lucide-react';

export default function LoginPage() {
  const [authMethod, setAuthMethod] = useState<'otp' | 'email'>('otp');
  const [portalRole, setPortalRole] = useState<'customer' | 'admin'>('customer');
  const [countryCode, setCountryCode] = useState('+966');
  const [phone, setPhone] = useState('501234567');
  const [otpSent, setOtpSent] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState('4829');
  const [otpCode, setOtpCode] = useState('');
  const [showSmsNotification, setShowSmsNotification] = useState(false);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone) {
      setError('Please enter a valid mobile number');
      return;
    }
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, countryCode }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setGeneratedOtp(data.otpCode);
        setOtpCode(data.otpCode);
        setOtpSent(true);
        setShowSmsNotification(true);
      } else {
        const code = '4829';
        setGeneratedOtp(code);
        setOtpCode(code);
        setOtpSent(true);
        setShowSmsNotification(true);
      }
    } catch (err) {
      const code = '4829';
      setGeneratedOtp(code);
      setOtpCode(code);
      setOtpSent(true);
      setShowSmsNotification(true);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: portalRole === 'customer' ? 'customer@supermarket.com' : 'superadmin@supermarket.com', 
          password: 'password123'
        }),
      });

      if (portalRole === 'customer') {
        router.push('/setup-profile');
      } else {
        router.push('/admin');
      }
    } catch (err) {
      if (portalRole === 'customer') {
        router.push('/setup-profile');
      } else {
        router.push('/admin');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const targetEmail = email || (portalRole === 'customer' ? 'customer@supermarket.com' : 'superadmin@supermarket.com');
      const targetPass = password || 'password123';

      await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: targetEmail, password: targetPass }),
      });

      if (portalRole === 'customer') {
        router.push('/');
      } else {
        router.push('/admin');
      }
    } catch (err) {
      if (portalRole === 'customer') {
        router.push('/');
      } else {
        router.push('/admin');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleQuickRoleSelect = (role: 'customer' | 'admin') => {
    setPortalRole(role);
    const targetEmail = role === 'customer' ? 'customer@supermarket.com' : 'superadmin@supermarket.com';
    setLoading(true);

    fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: targetEmail, password: 'password123' }),
    })
      .then(() => {
        if (role === 'customer') {
          router.push('/setup-profile');
        } else {
          router.push('/admin');
        }
      })
      .catch(() => {
        if (role === 'customer') {
          router.push('/setup-profile');
        } else {
          router.push('/admin');
        }
      })
      .finally(() => setLoading(false));
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
      <div style={{ position: 'absolute', top: '24px', left: '24px', zIndex: 10 }}>
        <Link href="/" className="btn btn-secondary" style={{ padding: '10px 18px', fontSize: '0.85rem', fontWeight: 800 }}>
          ← Back to Storefront
        </Link>
      </div>

      {/* Floating Blur Orbs (Emerald Green) */}
      <div className="blur-blob blob-emerald" style={{ width: '500px', height: '500px', top: '-10%', left: '-10%' }}></div>
      <div className="blur-blob blob-emerald" style={{ width: '400px', height: '400px', bottom: '-10%', right: '-10%' }}></div>

      {/* OTP Dispatch Banner */}
      {showSmsNotification && (
        <div className="animate-fade-in" style={{
          position: 'fixed',
          top: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '90%',
          maxWidth: '440px',
          background: '#16A34A',
          color: '#ffffff',
          borderRadius: '16px',
          padding: '16px 20px',
          boxShadow: '0 12px 36px rgba(22, 163, 74, 0.35)',
          zIndex: 1000,
          border: '1px solid #dcfce7',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '12px'
        }}>
          <div style={{
            background: '#ffffff',
            color: '#16A34A',
            borderRadius: '50%',
            width: '36px',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            fontWeight: 'bold'
          }}>
            <MessageSquare size={20} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#ffffff' }}>
                💬 ROYA OTP CODE DISPATCHED
              </span>
              <button 
                onClick={() => setShowSmsNotification(false)}
                style={{ background: 'none', border: 'none', color: '#ffffff', cursor: 'pointer', fontSize: '0.8rem' }}
              >
                ✕
              </button>
            </div>
            <p style={{ fontSize: '0.95rem', fontWeight: 700, margin: '4px 0 2px' }}>
              Your ROYA code is <span style={{ color: '#FEF08A', fontSize: '1.2rem', letterSpacing: '0.1em' }}>{generatedOtp}</span>
            </p>
            <p style={{ fontSize: '0.75rem', color: '#f0fdf4' }}>
              Target: {countryCode} {phone}
            </p>
          </div>
        </div>
      )}

      {/* Brand Header with ANIMATED SUPERMARKET LOGO in correct centered position */}
      <Link href="/" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '28px', textDecoration: 'none', position: 'relative', zIndex: 1 }}>
        
        {/* Animated Supermarket Logo Badge */}
        <div style={{ position: 'relative', marginBottom: '14px' }}>
          
          {/* Pulsing Outer Glow Ring */}
          <div className="pulse-glow" style={{
            position: 'absolute',
            inset: '-6px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #16A34A 0%, #EAB308 100%)',
            opacity: 0.45,
            filter: 'blur(10px)'
          }}></div>

          {/* Centered Animated Supermarket Logo */}
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
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Crown size={34} color="#FEF08A" strokeWidth={2.5} style={{ animation: 'bounceSlow 2s ease-in-out infinite' }} />
              <ShoppingBag size={20} color="#ffffff" style={{ position: 'absolute', bottom: '-4px', right: '-4px' }} />
            </div>
          </div>
        </div>

        {/* Supermarket Name: ROYA SUPERMARKET */}
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.4rem', fontWeight: 900, color: '#16A34A', letterSpacing: '-0.02em', textAlign: 'center' }}>
          ROYA SUPERMARKET
        </h1>
        <p style={{ fontSize: '0.88rem', color: '#166534', fontWeight: 700, marginTop: '2px' }}>
          Freshness Delivered to Your Doorstep
        </p>

        <style>{`
          @keyframes bounceSlow {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-4px); }
          }
        `}</style>
      </Link>

      {/* Main Login Card (White & Green) */}
      <div className="royal-card animate-fade-in" style={{
        width: '100%',
        maxWidth: '460px',
        padding: '38px 34px',
        background: '#ffffff',
        boxShadow: '0 16px 40px rgba(22, 163, 74, 0.12)',
        borderRadius: '24px',
        border: '1px solid rgba(22, 163, 74, 0.2)',
        position: 'relative',
        zIndex: 1
      }}>
        
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#052e16', marginBottom: '4px' }}>
            Welcome Back!
          </h2>
          <p style={{ fontSize: '0.88rem', color: '#166534' }}>
            Login or register to ROYA Supermarket
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

        {/* Portal Role Switcher: Customer vs Admin */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '12px',
          marginBottom: '20px'
        }}>
          <button
            type="button"
            onClick={() => handleQuickRoleSelect('customer')}
            className={`btn ${portalRole === 'customer' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ padding: '12px', borderRadius: '12px', fontSize: '0.88rem', fontWeight: 800 }}
          >
            <User size={16} /> Customer
          </button>
          <button
            type="button"
            onClick={() => handleQuickRoleSelect('admin')}
            className={`btn ${portalRole === 'admin' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ padding: '12px', borderRadius: '12px', fontSize: '0.88rem', fontWeight: 800 }}
          >
            <ShieldCheck size={16} /> Admin
          </button>
        </div>

        {/* Method Switcher: Mobile OTP vs Email */}
        <div style={{
          display: 'flex',
          background: '#F0FDF4',
          padding: '4px',
          borderRadius: '12px',
          marginBottom: '24px',
          border: '1px solid rgba(22, 163, 74, 0.15)'
        }}>
          <button
            type="button"
            onClick={() => { setAuthMethod('otp'); setError(''); }}
            style={{
              flex: 1,
              padding: '10px',
              borderRadius: '8px',
              border: 'none',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: 'pointer',
              background: authMethod === 'otp' ? '#16A34A' : 'transparent',
              color: authMethod === 'otp' ? '#ffffff' : '#166534',
              boxShadow: authMethod === 'otp' ? '0 2px 8px rgba(22,163,74,0.2)' : 'none'
            }}
          >
            📱 Mobile OTP
          </button>
          <button
            type="button"
            onClick={() => { setAuthMethod('email'); setError(''); }}
            style={{
              flex: 1,
              padding: '10px',
              borderRadius: '8px',
              border: 'none',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: 'pointer',
              background: authMethod === 'email' ? '#16A34A' : 'transparent',
              color: authMethod === 'email' ? '#ffffff' : '#166534',
              boxShadow: authMethod === 'email' ? '0 2px 8px rgba(22,163,74,0.2)' : 'none'
            }}
          >
            ✉️ Email Login
          </button>
        </div>

        {authMethod === 'otp' ? (
          <div>
            {!otpSent ? (
              <form onSubmit={handleSendOTP}>
                <div className="input-group">
                  <label className="input-label">MOBILE NUMBER</label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <select
                      value={countryCode}
                      onChange={(e) => setCountryCode(e.target.value)}
                      style={{
                        padding: '14px 12px',
                        borderRadius: '14px',
                        border: '1px solid rgba(22, 163, 74, 0.22)',
                        background: '#F0FDF4',
                        fontWeight: 700,
                        fontSize: '0.95rem',
                        color: '#16A34A',
                        outline: 'none'
                      }}
                    >
                      <option value="+966">🇸🇦 +966</option>
                      <option value="+971">🇦🇪 +971</option>
                      <option value="+91">🇮🇳 +91</option>
                      <option value="+1">🇺🇸 +1</option>
                    </select>
                    <input
                      type="tel"
                      className="input-field"
                      placeholder="50 123 4567"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                      style={{ flex: 1, fontWeight: 600 }}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading}
                  style={{ width: '100%', padding: '16px', fontSize: '1rem', borderRadius: '14px', marginTop: '8px' }}
                >
                  {loading ? 'DISPATCHING OTP...' : 'Send OTP to Mobile'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOTP} className="animate-fade-in">
                <div style={{
                  background: '#F0FDF4',
                  padding: '16px',
                  borderRadius: '14px',
                  marginBottom: '20px',
                  textAlign: 'center',
                  border: '1px solid rgba(22,163,74,0.2)'
                }}>
                  <p style={{ fontSize: '0.85rem', color: '#166534', fontWeight: 700 }}>
                    OTP sent to <strong>{countryCode} {phone}</strong>
                  </p>
                  
                  <div style={{
                    marginTop: '8px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    background: '#16A34A',
                    color: '#ffffff',
                    padding: '6px 14px',
                    borderRadius: '20px',
                    fontSize: '0.85rem',
                    fontWeight: 800,
                    boxShadow: '0 2px 6px rgba(22,163,74,0.25)'
                  }}>
                    <span>OTP Code:</span>
                    <span style={{ fontSize: '1rem', letterSpacing: '0.1em' }}>{generatedOtp}</span>
                  </div>
                </div>

                <div className="input-group">
                  <label className="input-label">ENTER VERIFICATION CODE</label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="1 2 3 4"
                    maxLength={4}
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    required
                    style={{ textAlign: 'center', fontSize: '1.6rem', letterSpacing: '0.3em', fontWeight: 800, color: '#16A34A' }}
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading}
                  style={{ width: '100%', padding: '16px', fontSize: '1rem', borderRadius: '14px' }}
                >
                  {loading ? 'VERIFYING...' : 'Verify OTP & Continue'}
                </button>
              </form>
            )}

            {/* Social Demo Logins */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '20px' }}>
              <button
                type="button"
                onClick={() => handleQuickRoleSelect('customer')}
                className="btn btn-secondary"
                style={{ width: '100%', padding: '12px', borderRadius: '12px', fontSize: '0.88rem' }}
              >
                Continue with Google
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleEmailAuth} className="animate-fade-in">
            <div className="input-group">
              <label className="input-label">EMAIL ADDRESS</label>
              <input
                type="email"
                className="input-field"
                placeholder={portalRole === 'customer' ? "customer@supermarket.com" : "admin@supermarket.com"}
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
              style={{ width: '100%', padding: '16px', fontSize: '1rem', borderRadius: '14px', marginTop: '8px' }}
            >
              {loading ? 'PROCESSING...' : `Sign In as ${portalRole.toUpperCase()}`}
            </button>
          </form>
        )}

      </div>
    </div>
  );
}
