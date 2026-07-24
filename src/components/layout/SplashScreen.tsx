'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

export function SplashScreen() {
  const [visible, setVisible] = useState(true);
  const [fade, setFade] = useState(false);

  useEffect(() => {
    // Fast opening: start fade out after 1.2 seconds
    const timer1 = setTimeout(() => {
      setFade(true);
    }, 1200);

    // Remove from DOM after 1.8 seconds
    const timer2 = setTimeout(() => {
      setVisible(false);
    }, 1800);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  if (!visible) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      background: '#ffffff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      opacity: fade ? 0 : 1,
      transition: 'opacity 0.6s ease-in-out',
      pointerEvents: fade ? 'none' : 'auto'
    }}>
      <div style={{
        animation: 'pulseScale 1.2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        transform: fade ? 'scale(1.2)' : 'scale(1)',
        transition: 'transform 0.6s ease-in-out',
        width: '200px',
        height: '200px',
        position: 'relative',
        borderRadius: '50%',
        overflow: 'hidden',
        boxShadow: '0 12px 32px rgba(0,0,0,0.1)',
        border: '4px solid #ffffff'
      }}>
        <Image 
          src="/logo.jpg" 
          alt="Roya Logo" 
          fill
          style={{ objectFit: 'cover' }}
          priority
        />
      </div>
      
      <style jsx global>{`
        @keyframes pulseScale {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }
      `}</style>
    </div>
  );
}
