'use client';

import Link from 'next/link';
import { useState } from 'react';
import { MapPin, ShoppingBag, User, Globe, Search, Crown } from 'lucide-react';

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
      background: '#0A4D2E',
      color: '#ffffff',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
    }}>
      {/* Top Banner Bar */}
      <div style={{
        background: '#063821',
        padding: '6px 24px',
        fontSize: '0.8rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1px solid rgba(255,255,255,0.08)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Crown size={14} color="#FFB800" />
          <span>Freshness Delivered to Your Doorstep • Free Shipping on First Order</span>
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
              fontSize: '0.75rem',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontWeight: 600
            }}
          >
            <Globe size={12} />
            {lang === 'EN' ? 'عربي' : 'English'}
          </button>
          <Link href="/user-journey" style={{ color: '#FFB800', fontWeight: 700, fontSize: '0.75rem' }}>
            📱 Interactive App Journey Flow
          </Link>
        </div>
      </div>

      {/* Main Header Nav */}
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '14px 24px',
        display: 'flex',
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
            <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', fontWeight: 800, letterSpacing: '-0.02em', color: '#ffffff', lineHeight: 1 }}>
              ROYAL
            </div>
            <div style={{ fontSize: '0.65rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#FFB800', fontWeight: 700 }}>
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
          cursor: 'pointer',
          transition: 'all 0.2s ease'
        }}>
          <MapPin size={16} color="#FFB800" />
          <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left', lineHeight: 1.2 }}>
            <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.7)' }}>Deliver to:</span>
            <span style={{ fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '160px' }}>
              {locationName}
            </span>
          </div>
        </Link>

        {/* Search Bar */}
        <div style={{
          flex: 1,
          maxWidth: '480px',
          position: 'relative'
        }}>
          <input 
            type="text" 
            placeholder="Search fresh fruits, vegetables, dairy..." 
            style={{
              width: '100%',
              padding: '10px 16px 10px 42px',
              borderRadius: '24px',
              border: 'none',
              background: '#ffffff',
              color: '#112218',
              fontSize: '0.9rem',
              outline: 'none',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}
          />
          <Search size={18} color="#849b8d" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {session ? (
            <>
              <Link href="/orders" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#fff', fontSize: '0.85rem', fontWeight: 600 }}>
                <User size={18} color="#FFB800" />
                <span>{session.name || 'Account'}</span>
              </Link>
              {session.role === 'SUPER_ADMIN' && (
                <Link href="/admin" className="btn btn-pill" style={{ padding: '6px 14px', fontSize: '0.8rem', background: '#FFB800', color: '#0A4D2E', fontWeight: 800 }}>
                  Admin
                </Link>
              )}
            </>
          ) : (
            <Link href="/login" className="btn btn-pill" style={{ padding: '8px 20px', fontSize: '0.85rem', background: '#FFB800', color: '#0A4D2E', fontWeight: 800 }}>
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
            color: '#fff'
          }}>
            <ShoppingBag size={20} />
          </Link>
        </div>
      </div>
    </header>
  );
}
