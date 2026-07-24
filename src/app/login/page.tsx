'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (emailToUse: string, passwordToUse: string) => {
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailToUse, password: passwordToUse }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        if (data.role === 'CUSTOMER') {
          router.push('/');
        } else {
          router.push('/admin');
        }
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const manualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleLogin(email, password);
  };

  const roles = [
    { title: 'Customer', desc: 'Public Storefront', email: 'customer@supermarket.com', pass: 'password123', color: '#10b981' },
    { title: 'Store Manager', desc: 'Inventory Access', email: 'storemanager@supermarket.com', pass: 'password123', color: '#3b82f6' },
    { title: 'Pricing Manager', desc: 'Pricing Access', email: 'pricing@supermarket.com', pass: 'password123', color: '#f59e0b' },
    { title: 'Super Admin', desc: 'Full System Access', email: 'superadmin@supermarket.com', pass: 'password123', color: '#ef4444' },
  ];

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
      {/* Background Blurs */}
      <div className="blur-blob" style={{ width: '500px', height: '500px', top: '-100px', left: '-200px' }}></div>
      <div className="blur-blob" style={{ width: '400px', height: '400px', bottom: '-150px', right: '-150px', background: '#60a5fa' }}></div>
      
      <div className="glass-panel animate-fade-in" style={{
        width: '100%',
        maxWidth: '800px',
        padding: '60px 40px',
        textAlign: 'center',
        position: 'relative',
        zIndex: 1
      }}>
        <h1 className="title" style={{ fontSize: '2.5rem', marginBottom: '12px' }}>SYSTEM<br/><span className="text-accent">PORTAL</span></h1>
        <p className="subtitle" style={{ marginBottom: '40px', fontSize: '0.95rem' }}>SELECT A DEMO ROLE TO CONTINUE.</p>
        
        {error && (
          <div style={{
            background: 'var(--bg-secondary)',
            border: '1px solid var(--error)',
            color: 'var(--error)',
            padding: '16px',
            marginBottom: '32px',
            fontSize: '0.85rem',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}>
            {error}
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '40px' }}>
          {roles.map((role, idx) => (
            <button
              key={idx}
              onClick={() => handleLogin(role.email, role.pass)}
              disabled={loading}
              style={{
                background: 'rgba(255, 255, 255, 0.5)',
                border: `1px solid ${role.color}`,
                padding: '24px',
                borderRadius: '0px',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.2s',
                position: 'relative',
                overflow: 'hidden'
              }}
              onMouseOver={(e) => { e.currentTarget.style.background = role.color; e.currentTarget.style.color = '#fff'; }}
              onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.5)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
            >
              <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: role.color }}></div>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', fontWeight: 700, marginBottom: '8px', textTransform: 'uppercase' }}>{role.title}</h3>
              <p style={{ fontSize: '0.8rem', opacity: 0.8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{role.desc}</p>
            </button>
          ))}
        </div>

        <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '32px', textAlign: 'left' }}>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '16px', fontWeight: 600 }}>OR MANUAL LOGIN:</p>
          <form onSubmit={manualSubmit} style={{ display: 'flex', gap: '16px' }}>
            <input 
              type="email" 
              className="input-field" 
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ flex: 1, marginBottom: 0 }}
              required
            />
            <input 
              type="password" 
              className="input-field" 
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ flex: 1, marginBottom: 0 }}
              required
            />
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? '...' : 'LOGIN'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
