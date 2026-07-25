import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';
import Link from 'next/link';
import { RoyalHeader } from '@/components/layout/RoyalHeader';
import { ArrowLeft, ShieldCheck, Truck, KeyRound, MapPin, Clock, CheckCircle2 } from 'lucide-react';

export default async function OrderTrackingPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  const { id } = await params;
  
  const order = await db.order.findUnique({
    where: { id },
    include: {
      driver: true,
      paymentMethod: true,
    }
  });

  if (!order || (session?.role === 'CUSTOMER' && order.userId !== session.userId)) {
    return (
      <div style={{ background: '#f8fafc', minHeight: '100vh' }}>
        <RoyalHeader session={session} />
        <div style={{ padding: '60px 16px', textAlign: 'center' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0F172A', marginBottom: '8px' }}>Order Not Found</h2>
          <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '24px' }}>This order does not exist or you do not have permission to view it.</p>
          <Link href="/" style={{
            display: 'inline-block',
            background: '#16a34a',
            color: '#ffffff',
            padding: '12px 28px',
            borderRadius: '16px',
            fontWeight: 800,
            fontSize: '0.9rem',
            textDecoration: 'none'
          }}>
            Back to Store
          </Link>
        </div>
      </div>
    );
  }

  // Delivery Stages
  const stages = [
    { key: 'RECEIVED', label: 'Received', active: true },
    { key: 'CONFIRMED', label: 'Confirmed', active: ['CONFIRMED', 'PREPARING', 'PACKED', 'OUT_FOR_DELIVERY', 'DELIVERED'].includes(order.status) },
    { key: 'PREPARING', label: 'Preparing', active: ['PREPARING', 'PACKED', 'OUT_FOR_DELIVERY', 'DELIVERED'].includes(order.status) },
    { key: 'PACKED', label: 'Packed', active: ['PACKED', 'OUT_FOR_DELIVERY', 'DELIVERED'].includes(order.status) },
    { key: 'OUT_FOR_DELIVERY', label: 'Out for Delivery', active: ['OUT_FOR_DELIVERY', 'DELIVERED'].includes(order.status) },
    { key: 'DELIVERED', label: 'Delivered', active: order.status === 'DELIVERED' }
  ];

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh', paddingBottom: '90px' }}>
      <RoyalHeader session={session} />

      <div style={{ padding: '14px 14px 0' }}>
        {/* Navigation Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
          <Link href="/orders" style={{ color: '#16a34a', display: 'flex', alignItems: 'center', gap: '4px', textDecoration: 'none', fontSize: '0.82rem', fontWeight: 700 }}>
            <ArrowLeft size={16} /> My Orders
          </Link>
        </div>

        {/* Order Header Info */}
        <div style={{
          background: '#ffffff',
          borderRadius: '16px',
          padding: '14px',
          border: '1px solid rgba(22, 163, 74, 0.15)',
          boxShadow: '0 4px 12px rgba(6, 56, 33, 0.04)',
          marginBottom: '12px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <div>
              <div style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: 700 }}>ORDER ID</div>
              <div style={{ fontWeight: 900, fontFamily: 'monospace', fontSize: '1.1rem', color: '#0A4D2E' }}>
                #{order.id.slice(-8).toUpperCase()}
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: 700 }}>TOTAL PAID</div>
              <div style={{ fontWeight: 900, fontSize: '1.1rem', color: '#16a34a' }}>
                AED {order.totalAmount.toFixed(2)}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: '#64748b' }}>
            <Clock size={14} color="#16a34a" />
            <span>Placed on {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
        </div>

        {/* PROMINENT DELIVERY OTP VERIFICATION CARD */}
        {order.otp && (
          <div style={{
            background: 'linear-gradient(135deg, #0A4D2E 0%, #063821 100%)',
            borderRadius: '20px',
            padding: '18px 16px',
            color: '#ffffff',
            marginBottom: '14px',
            boxShadow: '0 8px 24px rgba(10, 77, 46, 0.25)',
            border: '2px solid #FFB800',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '10px',
              borderBottom: '1px solid rgba(255,255,255,0.12)',
              paddingBottom: '10px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <KeyRound size={20} color="#FFB800" />
                <span style={{ fontSize: '0.88rem', fontWeight: 800, color: '#ffffff', letterSpacing: '0.04em' }}>
                  DELIVERY OTP CODE
                </span>
              </div>
              <span style={{ background: 'rgba(255,184,0,0.2)', color: '#FFB800', fontSize: '0.68rem', fontWeight: 800, padding: '2px 8px', borderRadius: '10px' }}>
                CONFIRMATION KEY
              </span>
            </div>

            <div style={{ textAlign: 'center', padding: '8px 0' }}>
              <div style={{ fontSize: '0.75rem', color: '#DCFCE7', fontWeight: 600, marginBottom: '4px' }}>
                Share this 4-digit code with your driver upon arrival:
              </div>
              <div style={{
                fontSize: '2.8rem',
                fontWeight: 900,
                fontFamily: 'monospace',
                letterSpacing: '0.2em',
                color: '#FFB800',
                background: 'rgba(0,0,0,0.3)',
                display: 'inline-block',
                padding: '6px 24px',
                borderRadius: '16px',
                border: '1px stroke rgba(255,184,0,0.4)',
                boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
              }}>
                {order.otp}
              </div>
            </div>

            <div style={{ fontSize: '0.72rem', color: '#e2e8f0', textAlign: 'center', marginTop: '8px', opacity: 0.9 }}>
              🛡️ The driver requires this OTP to complete & verify your delivery.
            </div>
          </div>
        )}

        {/* Live Tracking Map Placeholder */}
        <div style={{
          background: order.status === 'OUT_FOR_DELIVERY' ? 'linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%)' : '#ffffff',
          borderRadius: '16px',
          padding: '24px 16px',
          marginBottom: '14px',
          textAlign: 'center',
          border: '1px solid rgba(22, 163, 74, 0.15)',
          boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
        }}>
          {order.status === 'OUT_FOR_DELIVERY' ? (
            <>
              <div style={{ fontSize: '2.5rem', marginBottom: '6px' }}>🚚</div>
              <div style={{ fontWeight: 800, color: '#0284c7', fontSize: '1rem' }}>Driver is On The Way!</div>
              <div style={{ fontSize: '0.78rem', color: '#0369a1', marginTop: '2px' }}>Live GPS Tracking Active • Arriving in ~15 Mins</div>
            </>
          ) : (
            <>
              <div style={{ fontSize: '2.5rem', marginBottom: '6px' }}>📍</div>
              <div style={{ fontWeight: 800, color: '#0F172A', fontSize: '0.95rem' }}>Store Dispatch Center</div>
              <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '2px' }}>Order is being processed & packed for delivery</div>
            </>
          )}
        </div>

        {/* Order Status Timeline */}
        <div style={{
          background: '#ffffff',
          borderRadius: '16px',
          padding: '16px 12px',
          border: '1px solid rgba(22, 163, 74, 0.15)',
          boxShadow: '0 4px 12px rgba(6, 56, 33, 0.04)',
          marginBottom: '14px'
        }}>
          <h3 style={{ fontSize: '0.88rem', fontWeight: 800, color: '#0F172A', marginBottom: '14px' }}>Delivery Progress</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
            {stages.map((stage) => (
              <div key={stage.key} style={{
                background: stage.active ? '#f0fdf4' : '#f8fafc',
                border: `1px solid ${stage.active ? '#16a34a' : '#e2e8f0'}`,
                borderRadius: '12px',
                padding: '8px',
                textAlign: 'center'
              }}>
                <div style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  background: stage.active ? '#16a34a' : '#cbd5e1',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 4px',
                  fontSize: '0.7rem',
                  fontWeight: 800
                }}>
                  {stage.active ? '✓' : ''}
                </div>
                <div style={{ fontSize: '0.68rem', fontWeight: stage.active ? 800 : 500, color: stage.active ? '#15803d' : '#64748b' }}>
                  {stage.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Courier & Address Info Grid */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {/* Driver Card */}
          <div style={{
            background: '#ffffff',
            borderRadius: '16px',
            padding: '14px',
            border: '1px solid rgba(22, 163, 74, 0.15)',
            boxShadow: '0 4px 12px rgba(6, 56, 33, 0.04)'
          }}>
            <h4 style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 800, textTransform: 'uppercase', marginBottom: '8px' }}>
              Delivery Partner
            </h4>
            {order.driver ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '50%',
                  background: '#dcfce7',
                  color: '#15803d',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.4rem'
                }}>
                  🧑‍✈️
                </div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '0.92rem', color: '#0F172A' }}>{order.driver.name}</div>
                  <div style={{ fontSize: '0.75rem', color: '#16a34a', fontWeight: 700 }}>Verified Royal Driver • 4.9 ★</div>
                </div>
              </div>
            ) : (
              <div style={{ fontSize: '0.8rem', color: '#64748b', fontStyle: 'italic' }}>
                Assigning closest available driver...
              </div>
            )}
          </div>

          {/* Delivery Address Card */}
          <div style={{
            background: '#ffffff',
            borderRadius: '16px',
            padding: '14px',
            border: '1px solid rgba(22, 163, 74, 0.15)',
            boxShadow: '0 4px 12px rgba(6, 56, 33, 0.04)'
          }}>
            <h4 style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 800, textTransform: 'uppercase', marginBottom: '8px' }}>
              Delivery Destination
            </h4>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0F172A', display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
              <MapPin size={16} color="#16a34a" style={{ flexShrink: 0, marginTop: '2px' }} />
              <span>{order.deliveryAddress || 'King Fahd Road, Riyadh'}</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
