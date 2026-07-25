'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { BellRing, ShoppingBag, X, ChevronRight, Truck } from 'lucide-react';

export function AdminNotificationBar() {
  const [latestOrder, setLatestOrder] = useState<any>(null);
  const [showToast, setShowToast] = useState(false);
  const seenOrderIds = useRef<Set<string>>(new Set());
  const initialFetch = useRef(true);

  useEffect(() => {
    const fetchLatestOrders = async () => {
      try {
        const res = await fetch('/api/admin/orders/latest');
        if (!res.ok) return;
        const data = await res.json();

        if (data.success && data.orders && data.orders.length > 0) {
          const newest = data.orders[0];

          if (initialFetch.current) {
            data.orders.forEach((o: any) => seenOrderIds.current.add(o.id));
            initialFetch.current = false;
          } else if (!seenOrderIds.current.has(newest.id)) {
            seenOrderIds.current.add(newest.id);
            setLatestOrder(newest);
            setShowToast(true);

            // Play audio notification chime if supported
            try {
              const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
              const osc = ctx.createOscillator();
              const gain = ctx.createGain();
              osc.connect(gain);
              gain.connect(ctx.destination);
              osc.type = 'sine';
              osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
              gain.gain.setValueAtTime(0.1, ctx.currentTime);
              osc.start();
              osc.stop(ctx.currentTime + 0.3);
            } catch (e) {
              // Audio context user interaction fallback
            }
          }
        }
      } catch (err) {
        // Silent error
      }
    };

    fetchLatestOrders();
    const interval = setInterval(fetchLatestOrders, 6000);
    return () => clearInterval(interval);
  }, []);

  if (!showToast || !latestOrder) return null;

  return (
    <div className="animate-fade-in" style={{
      position: 'fixed',
      top: '16px',
      right: '20px',
      zIndex: 9999,
      maxWidth: '420px',
      width: '90%',
      background: 'linear-gradient(135deg, #0A4D2E 0%, #063821 100%)',
      color: '#ffffff',
      borderRadius: '20px',
      padding: '16px',
      boxShadow: '0 16px 40px rgba(10, 77, 46, 0.35)',
      border: '2px solid #FFB800'
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            background: '#FFB800',
            color: '#0A4D2E',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 800
          }}>
            <BellRing size={18} />
          </div>
          <div>
            <div style={{ fontSize: '0.85rem', fontWeight: 900, color: '#ffffff' }}>
              🚨 NEW CUSTOMER ORDER RECEIVED!
            </div>
            <div style={{ fontSize: '0.68rem', color: '#DCFCE7' }}>
              Just placed by {latestOrder.user?.name || 'Customer'}
            </div>
          </div>
        </div>
        <button
          onClick={() => setShowToast(false)}
          style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', opacity: 0.8 }}
        >
          <X size={16} />
        </button>
      </div>

      <div style={{
        background: 'rgba(255,255,255,0.1)',
        borderRadius: '12px',
        padding: '10px 12px',
        margin: '8px 0 12px',
        fontSize: '0.82rem'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, color: '#FFB800' }}>
          <span>Order #{latestOrder.id.slice(-6).toUpperCase()}</span>
          <span>AED {latestOrder.totalAmount?.toFixed(2)}</span>
        </div>
        <div style={{ fontSize: '0.74rem', color: '#e2e8f0', marginTop: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          📍 {latestOrder.deliveryAddress || 'Riyadh Address'}
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
        <Link
          href="/admin/delivery"
          onClick={() => setShowToast(false)}
          style={{
            background: '#FFB800',
            color: '#0A4D2E',
            padding: '8px 16px',
            borderRadius: '12px',
            fontWeight: 800,
            fontSize: '0.78rem',
            textDecoration: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px'
          }}
        >
          <span>Dispatch & Assign Driver</span>
          <ChevronRight size={14} />
        </Link>
      </div>
    </div>
  );
}
