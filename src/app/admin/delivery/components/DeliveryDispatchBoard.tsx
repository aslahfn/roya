'use client';

import { useState, useTransition } from 'react';
import { assignDriverAction, verifyDeliveryOtpAction, updateOrderStatusAction } from '../actions';
import { Truck, ShieldCheck, KeyRound, UserCheck, AlertCircle, CheckCircle2, Clock } from 'lucide-react';

interface DeliveryDispatchBoardProps {
  initialOrders: any[];
  availableDrivers: any[];
  currentUserId: string;
}

export function DeliveryDispatchBoard({ initialOrders, availableDrivers, currentUserId }: DeliveryDispatchBoardProps) {
  const [isPending, startTransition] = useTransition();
  const [selectedDriver, setSelectedDriver] = useState<Record<string, string>>({});
  const [otpInput, setOtpInput] = useState<Record<string, string>>({});
  const [otpError, setOtpError] = useState<Record<string, string>>({});
  const [otpSuccess, setOtpSuccess] = useState<Record<string, string>>({});
  const [activeModalOrderId, setActiveModalOrderId] = useState<string | null>(null);

  const handleAssignDriver = (orderId: string) => {
    const driverId = selectedDriver[orderId] || currentUserId;
    startTransition(async () => {
      await assignDriverAction(orderId, driverId);
    });
  };

  const handleVerifyOtp = (orderId: string) => {
    const code = otpInput[orderId] || '';
    if (!code || code.length < 4) {
      setOtpError({ ...otpError, [orderId]: 'Please enter a 4-digit OTP code' });
      return;
    }

    setOtpError({ ...otpError, [orderId]: '' });
    startTransition(async () => {
      const res = await verifyDeliveryOtpAction(orderId, code);
      if (res.success) {
        setOtpSuccess({ ...otpSuccess, [orderId]: '✓ Delivery Verified & Marked Complete!' });
        setActiveModalOrderId(null);
      } else {
        setOtpError({ ...otpError, [orderId]: res.error || 'Invalid OTP' });
      }
    });
  };

  const handleStatusChange = (orderId: string, newStatus: string) => {
    startTransition(async () => {
      await updateOrderStatusAction(orderId, newStatus);
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Overview Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
        <div style={{ background: '#ffffff', border: '1px solid rgba(22, 163, 74, 0.2)', borderRadius: '16px', padding: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>Incoming Orders</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#0A4D2E' }}>
            {initialOrders.filter(o => o.status === 'RECEIVED' || o.status === 'CONFIRMED' || o.status === 'PREPARING').length}
          </div>
        </div>

        <div style={{ background: '#ffffff', border: '1px solid rgba(22, 163, 74, 0.2)', borderRadius: '16px', padding: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>Out For Delivery</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#0284c7' }}>
            {initialOrders.filter(o => o.status === 'OUT_FOR_DELIVERY').length}
          </div>
        </div>

        <div style={{ background: '#ffffff', border: '1px solid rgba(22, 163, 74, 0.2)', borderRadius: '16px', padding: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>Delivered</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#16a34a' }}>
            {initialOrders.filter(o => o.status === 'DELIVERED').length}
          </div>
        </div>
      </div>

      {/* Dispatch Order List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {initialOrders.map((order) => (
          <div
            key={order.id}
            style={{
              background: '#ffffff',
              borderRadius: '20px',
              border: '1px solid rgba(22, 163, 74, 0.18)',
              padding: '20px',
              boxShadow: '0 6px 18px rgba(6, 56, 33, 0.05)',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px'
            }}
          >
            {/* Order Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontWeight: 900, fontSize: '1.15rem', color: '#0A4D2E' }}>
                    Order #{order.id.slice(-8).toUpperCase()}
                  </span>
                  <span className={`badge ${order.status === 'DELIVERED' ? 'badge-success' : order.status === 'OUT_FOR_DELIVERY' ? 'badge-neutral' : 'badge-warning'}`}>
                    {order.status.replace(/_/g, ' ')}
                  </span>
                </div>
                <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '2px' }}>
                  Customer: <strong>{order.user?.name}</strong> • Phone: {order.user?.phone || 'N/A'}
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#16a34a' }}>
                  AED {order.totalAmount.toFixed(2)}
                </div>
                <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                  {order.paymentStatus === 'PAID' ? '✅ PAID ONLINE' : '⏳ PENDING COD'}
                </div>
              </div>
            </div>

            {/* Address */}
            <div style={{
              background: '#f8fafc',
              borderRadius: '12px',
              padding: '10px 14px',
              fontSize: '0.82rem',
              color: '#334155',
              border: '1px solid #f1f5f9'
            }}>
              📍 <strong>Delivery Address:</strong> {order.deliveryAddress || 'Riyadh Address'}
            </div>

            {/* OTP Status Badge for Admin */}
            <div style={{
              background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
              border: '1px solid rgba(22, 163, 74, 0.25)',
              borderRadius: '12px',
              padding: '8px 12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '0.82rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#15803d', fontWeight: 700 }}>
                <KeyRound size={16} />
                <span>Customer Delivery Verification OTP:</span>
              </div>
              <span style={{ fontFamily: 'monospace', fontWeight: 900, fontSize: '1.1rem', color: '#0A4D2E', letterSpacing: '0.1em' }}>
                {order.otp || '4829'}
              </span>
            </div>

            {/* Actions Grid */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '12px',
              paddingTop: '12px',
              borderTop: '1px solid #f1f5f9'
            }}>
              {/* Driver Selection */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, minWidth: '240px' }}>
                <select
                  value={selectedDriver[order.id] || order.driverId || ''}
                  onChange={(e) => setSelectedDriver({ ...selectedDriver, [order.id]: e.target.value })}
                  style={{
                    padding: '8px 12px',
                    borderRadius: '12px',
                    border: '1px solid rgba(22, 163, 74, 0.3)',
                    fontSize: '0.82rem',
                    background: '#ffffff',
                    color: '#0F172A',
                    fontWeight: 600,
                    outline: 'none',
                    flex: 1
                  }}
                >
                  <option value="">Select Driver / Courier</option>
                  {availableDrivers.map((d) => (
                    <option key={d.id} value={d.id}>
                      🧑‍✈️ {d.name} ({d.role})
                    </option>
                  ))}
                </select>

                <button
                  onClick={() => handleAssignDriver(order.id)}
                  disabled={isPending}
                  style={{
                    background: '#0A4D2E',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '12px',
                    padding: '8px 14px',
                    fontSize: '0.8rem',
                    fontWeight: 800,
                    cursor: 'pointer'
                  }}
                >
                  {order.driverId ? 'Re-assign' : 'Assign & Dispatch'}
                </button>
              </div>

              {/* Status Update Options */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {order.status !== 'DELIVERED' && (
                  <button
                    onClick={() => setActiveModalOrderId(activeModalOrderId === order.id ? null : order.id)}
                    style={{
                      background: '#16a34a',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '12px',
                      padding: '8px 16px',
                      fontSize: '0.8rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <ShieldCheck size={16} />
                    <span>Verify OTP & Complete</span>
                  </button>
                )}

                {order.status === 'DELIVERED' && (
                  <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#16a34a', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <CheckCircle2 size={16} /> Delivered
                  </span>
                )}
              </div>
            </div>

            {/* OTP VERIFICATION MODAL / FORM */}
            {activeModalOrderId === order.id && (
              <div style={{
                background: '#FFFBEB',
                border: '1.5px solid #F59E0B',
                borderRadius: '14px',
                padding: '14px',
                marginTop: '8px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}>
                <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#92400E', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <KeyRound size={16} />
                  <span>Enter Customer 4-Digit Delivery OTP to Verify Handover:</span>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="text"
                    maxLength={4}
                    placeholder="Enter 4-digit code (e.g. 4829)"
                    value={otpInput[order.id] || ''}
                    onChange={(e) => setOtpInput({ ...otpInput, [order.id]: e.target.value })}
                    style={{
                      padding: '8px 12px',
                      borderRadius: '10px',
                      border: '1px solid #D97706',
                      fontSize: '0.95rem',
                      fontFamily: 'monospace',
                      fontWeight: 800,
                      letterSpacing: '0.1em',
                      width: '180px',
                      outline: 'none'
                    }}
                  />
                  <button
                    onClick={() => handleVerifyOtp(order.id)}
                    disabled={isPending}
                    style={{
                      background: '#D97706',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '10px',
                      padding: '8px 16px',
                      fontWeight: 800,
                      fontSize: '0.82rem',
                      cursor: 'pointer'
                    }}
                  >
                    {isPending ? 'Verifying...' : 'Submit OTP Verification'}
                  </button>
                </div>

                {otpError[order.id] && (
                  <div style={{ fontSize: '0.78rem', color: '#B91C1C', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <AlertCircle size={14} /> {otpError[order.id]}
                  </div>
                )}
              </div>
            )}

            {otpSuccess[order.id] && (
              <div style={{ fontSize: '0.82rem', color: '#15803d', fontWeight: 800, background: '#DCFCE7', padding: '8px 12px', borderRadius: '10px' }}>
                {otpSuccess[order.id]}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
