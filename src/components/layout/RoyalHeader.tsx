'use client';

import Link from 'next/link';
import { useState } from 'react';
import { MapPin, ShoppingBag, User, Globe, Search, Crown, Sparkles } from 'lucide-react';

interface RoyalHeaderProps {
  session?: {
    name?: string;
    role?: string;
  } | null;
  locationName?: string;
}

export function RoyalHeader({ session, locationName = 'King Fahd Road, Riyadh' }: RoyalHeaderProps) {
  const [lang, setLang] = useState<'EN' | 'AR'>('EN');

  return (
    <header style={{
      background: 'linear-gradient(180deg, #0A4D2E 0%, #063821 100%)',
      color: '#ffffff',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
    }}>
      {/* Top Banner Bar */}
      <div style={{
        background: '#042817',
        padding: '6px 20px',
        fontSize: '0.75rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1px solid rgba(255,255,255,0.08)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          <Crown size={14} color="#FFB800" />
          <span style={{ fontWeight: 600, color: '#e2e8f0' }}>Freshness Delivered Fast • Free Shipping on First Order</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button 
            onClick={() => setLang(lang === 'EN' ? 'AR' : 'EN')}
            style={{
              background: 'rgba(255,255,255,0.12)',
              border: 'none',
              color: '#fff',
              padding: '2px 10px',
              borderRadius: '12px',
              cursor: 'pointer',
              fontSize: '0.72rem',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontWeight: 700
            }}
          >
            <Globe size={12} />
            {lang === 'EN' ? 'عربي' : 'English'}
          </button>
          <Link href="/user-journey" style={{ color: '#FFB800', fontWeight: 800, fontSize: '0.75rem', textDecoration: 'none' }}>
            📱 Interactive App Journey Flow
          </Link>
        </div>
      </div>

      {/* DESKTOP HEADER (Visible on screens >= 768px) */}
      <div className="desktop-only" style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '12px 24px',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '24px'
      }}>
        {/* Brand Logo */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #FFB800 0%, #D4AF37 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(255,184,0,0.4)',
            color: '#0A4D2E'
          }}>
            <Crown size={24} strokeWidth={2.5} />
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', fontWeight: 900, letterSpacing: '-0.02em', color: '#ffffff', lineHeight: 1 }}>
              ROYAL
            </div>
            <div style={{ fontSize: '0.65rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#FFB800', fontWeight: 800 }}>
              SUPERMARKET
            </div>
          </div>
        </Link>

        {/* Location Selector Pill */}
        <Link href="/setup-profile" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: 'rgba(255,255,255,0.12)',
          padding: '8px 16px',
          borderRadius: '20px',
          fontSize: '0.85rem',
          color: '#ffffff',
          border: '1px solid rgba(255,255,255,0.18)',
          textDecoration: 'none'
        }}>
          <MapPin size={16} color="#FFB800" />
          <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left', lineHeight: 1.2 }}>
            <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.7)' }}>Deliver to:</span>
            <span style={{ fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '160px', color: '#DCFCE7' }}>
              {locationName}
            </span>
          </div>
        </Link>

        {/* Search Bar */}
        <div style={{ flex: 1, maxWidth: '520px', position: 'relative' }}>
          <input 
            type="text" 
            placeholder="Search fresh fruits, organic vegetables, daily dairy..." 
            style={{
              width: '100%',
              padding: '10px 18px 10px 44px',
              borderRadius: '24px',
              border: 'none',
              background: '#ffffff',
              color: '#112218',
              fontSize: '0.9rem',
              outline: 'none',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}
          />
          <Search size={18} color="#16a34a" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
        </div>

        {/* Desktop Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {session ? (
            <>
              <Link href="/orders" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#fff', fontSize: '0.88rem', fontWeight: 700, textDecoration: 'none' }}>
                <User size={18} color="#FFB800" />
                <span>{session.name || 'Account'}</span>
              </Link>
              {session.role === 'SUPER_ADMIN' && (
                <Link href="/admin" style={{ padding: '8px 16px', fontSize: '0.82rem', background: '#FFB800', color: '#0A4D2E', fontWeight: 800, borderRadius: '20px', textDecoration: 'none' }}>
                  Admin Dashboard
                </Link>
              )}
            </>
          ) : (
            <Link href="/login" style={{ padding: '8px 22px', fontSize: '0.88rem', background: '#FFB800', color: '#0A4D2E', fontWeight: 800, borderRadius: '20px', textDecoration: 'none' }}>
              Sign In
            </Link>
          )}

          <Link href="/cart" style={{
            position: 'relative',
            background: 'rgba(255,255,255,0.15)',
            padding: '10px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            textDecoration: 'none'
          }}>
            <ShoppingBag size={20} />
          </Link>
        </div>
      </div>

      {/* MOBILE HEADER (Visible on screens < 768px) */}
      <div className="mobile-only" style={{
        maxWidth: '480px',
        margin: '0 auto',
        padding: '10px 14px',
        flexDirection: 'column',
        gap: '10px'
      }}>
        {/* Top Row: Brand & Profile/Admin CTA */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #FFB800 0%, #D4AF37 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 3px 10px rgba(255,184,0,0.4)',
              color: '#0A4D2E'
            }}>
              <Crown size={20} strokeWidth={2.5} />
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', fontWeight: 900, letterSpacing: '-0.02em', color: '#ffffff', lineHeight: 1 }}>
                ROYAL
              </div>
              <div style={{ fontSize: '0.58rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#FFB800', fontWeight: 800 }}>
                SUPERMARKET
              </div>
            </div>
          </Link>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {session ? (
              <>
                {session.role === 'SUPER_ADMIN' && (
                  <Link href="/admin" style={{ padding: '5px 10px', fontSize: '0.75rem', background: '#FFB800', color: '#0A4D2E', fontWeight: 800, borderRadius: '14px', textDecoration: 'none' }}>
                    Admin
                  </Link>
                )}
                <Link href="/orders" style={{ padding: '5px 10px', fontSize: '0.75rem', background: 'rgba(255,255,255,0.15)', color: '#ffffff', fontWeight: 700, borderRadius: '14px', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <User size={14} color="#FFB800" />
                  <span style={{ maxWidth: '80px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {session.name || 'Account'}
                  </span>
                </Link>
              </>
            ) : (
              <Link href="/login" style={{ padding: '6px 14px', fontSize: '0.78rem', background: '#FFB800', color: '#0A4D2E', fontWeight: 800, borderRadius: '16px', textDecoration: 'none' }}>
                Sign In
              </Link>
            )}

            <Link href="/cart" style={{ background: 'rgba(255,255,255,0.15)', padding: '8px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', position: 'relative' }}>
              <ShoppingBag size={18} />
            </Link>
          </div>
        </div>

        {/* Location Pill */}
        <Link href="/setup-profile" style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.1)', padding: '6px 12px', borderRadius: '14px', fontSize: '0.78rem', color: '#ffffff', border: '1px solid rgba(255,255,255,0.14)', textDecoration: 'none' }}>
          <MapPin size={14} color="#FFB800" />
          <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.74rem' }}>Deliver to:</span>
          <span style={{ fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: '#DCFCE7' }}>
            {locationName}
          </span>
        </Link>

        {/* Search Bar */}
        <div style={{ position: 'relative', width: '100%' }}>
          <input 
            type="text" 
            placeholder="Search fresh groceries, organic produce..." 
            style={{
              width: '100%',
              padding: '9px 14px 9px 38px',
              borderRadius: '16px',
              border: 'none',
              background: '#ffffff',
              color: '#112218',
              fontSize: '0.85rem',
              outline: 'none',
              boxShadow: '0 2px 8px rgba(0,0,0,0.12)'
            }}
          />
          <Search size={16} color="#16a34a" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
        </div>
      </div>
    </header>
  );
}
