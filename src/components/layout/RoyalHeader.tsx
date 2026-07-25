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
      {/* Mini Announcement Strip */}
      <div style={{
        background: '#042817',
        padding: '5px 12px',
        fontSize: '0.72rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1px solid rgba(255,255,255,0.08)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          <Crown size={12} color="#FFB800" />
          <span style={{ fontWeight: 600, color: '#e2e8f0' }}>Freshness Delivered Fast • Free Delivery</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button 
            onClick={() => setLang(lang === 'EN' ? 'AR' : 'EN')}
            style={{
              background: 'rgba(255,255,255,0.12)',
              border: 'none',
              color: '#fff',
              padding: '2px 8px',
              borderRadius: '10px',
              cursor: 'pointer',
              fontSize: '0.7rem',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontWeight: 700
            }}
          >
            <Globe size={11} />
            {lang === 'EN' ? 'عربي' : 'EN'}
          </button>
          <Link href="/user-journey" style={{ color: '#FFB800', fontWeight: 800, fontSize: '0.7rem', textDecoration: 'none' }}>
            📱 Flow
          </Link>
        </div>
      </div>

      {/* Main Compact Mobile Header Container */}
      <div style={{
        maxWidth: '480px',
        margin: '0 auto',
        padding: '10px 14px',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px'
      }}>
        {/* Top Row: Brand & Profile/Admin CTA */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          {/* Logo */}
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

          {/* Quick Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {session ? (
              <>
                {session.role === 'SUPER_ADMIN' && (
                  <Link href="/admin" style={{
                    padding: '5px 10px',
                    fontSize: '0.75rem',
                    background: '#FFB800',
                    color: '#0A4D2E',
                    fontWeight: 800,
                    borderRadius: '14px',
                    textDecoration: 'none'
                  }}>
                    Admin
                  </Link>
                )}
                <Link href="/orders" style={{
                  padding: '5px 10px',
                  fontSize: '0.75rem',
                  background: 'rgba(255,255,255,0.15)',
                  color: '#ffffff',
                  fontWeight: 700,
                  borderRadius: '14px',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  <User size={14} color="#FFB800" />
                  <span style={{ maxWidth: '80px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {session.name || 'Account'}
                  </span>
                </Link>
              </>
            ) : (
              <Link href="/login" style={{
                padding: '6px 14px',
                fontSize: '0.78rem',
                background: '#FFB800',
                color: '#0A4D2E',
                fontWeight: 800,
                borderRadius: '16px',
                textDecoration: 'none'
              }}>
                Sign In
              </Link>
            )}

            <Link href="/cart" style={{
              background: 'rgba(255,255,255,0.15)',
              padding: '8px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              position: 'relative'
            }}>
              <ShoppingBag size={18} />
            </Link>
          </div>
        </div>

        {/* Location Selector Bar */}
        <Link href="/setup-profile" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          background: 'rgba(255,255,255,0.1)',
          padding: '6px 12px',
          borderRadius: '14px',
          fontSize: '0.78rem',
          color: '#ffffff',
          border: '1px solid rgba(255,255,255,0.14)',
          textDecoration: 'none'
        }}>
          <MapPin size={14} color="#FFB800" />
          <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.74rem' }}>Deliver to:</span>
          <span style={{ fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: '#DCFCE7' }}>
            {locationName}
          </span>
        </Link>

        {/* Mobile Search Bar */}
        <div style={{ position: 'relative' }}>
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
