'use client';

import { useState } from 'react';
import { assignDriverAction, markDeliveredAction, updateOrderItemQuantityAction, confirmOrderAction } from '../actions';
import { Truck, CheckCircle2, ShieldCheck, MapPin, Key, Clock, AlertCircle } from 'lucide-react';

export default function DispatchBoard({ 
  pendingOrders, 
  activeDeliveries, 
  drivers,
  isAdmin
}: { 
  pendingOrders: any[], 
  activeDeliveries: any[], 
  drivers: any[],
  isAdmin: boolean
}) {
  const [selectedDriver, setSelectedDriver] = useState<Record<string, string>>({});
  const [eta, setEta] = useState<Record<string, string>>({});
  const [otpInputs, setOtpInputs] = useState<Record<string, string>>({});
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [itemQuantities, setItemQuantities] = useState<Record<string, number>>({});
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdateQuantity = async (orderId: string, orderItemId: string, change: number, currentQuantity: number) => {
    try {
      setIsUpdating(true);
      const newQuantity = currentQuantity + change;
      if (newQuantity < 0) return;
      
      setItemQuantities(prev => ({ ...prev, [orderItemId]: newQuantity }));
      await updateOrderItemQuantityAction(orderId, orderItemId, newQuantity);
    } catch (err: any) {
      setError(err.message || 'Failed to update quantity');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleConfirmOrder = async (orderId: string) => {
    try {
      setIsUpdating(true);
      await confirmOrderAction(orderId);
      setExpandedOrder(null);
    } catch (err: any) {
      setError(err.message || 'Failed to confirm order');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleAssign = async (orderId: string) => {
    try {
      const driverId = selectedDriver[orderId];
      const estimatedTime = eta[orderId];

      if (!driverId && isAdmin) {
        setError('Please select a driver from the dropdown');
        return;
      }
      
      await assignDriverAction(orderId, driverId, estimatedTime);
      setError('');
      setSuccessMessage('Driver successfully assigned to delivery route!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to assign driver');
    }
  };

  const handleComplete = async (orderId: string, actualOtp: string) => {
    try {
      const inputOtp = otpInputs[orderId];
      if (!inputOtp || inputOtp !== actualOtp) {
        setError(`Invalid OTP "${inputOtp || ''}". Customer's actual 4-digit OTP is required to mark delivery.`);
        return;
      }
      
      await markDeliveredAction(orderId);
      setError('');
      setSuccessMessage('✅ OTP Verified Successfully! Order status set to DELIVERED.');
      setTimeout(() => setSuccessMessage(''), 4000);
    } catch (err: any) {
      setError(err.message || 'Failed to mark delivered');
    }
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
      
      {/* Notifications */}
      <div style={{ gridColumn: '1 / -1' }}>
        {error && (
          <div style={{ background: '#FEE2E2', border: '1px solid #EF4444', color: '#B91C1C', padding: '14px 20px', borderRadius: '14px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        )}
        {successMessage && (
          <div style={{ background: '#DCFCE7', border: '1px solid #16A34A', color: '#15803D', padding: '14px 20px', borderRadius: '14px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <CheckCircle2 size={20} />
            <span>{successMessage}</span>
          </div>
        )}
      </div>

      {/* Available / Pending Orders */}
      <div>
        <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0A4D2E', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Clock size={22} color="#D97706" />
          {isAdmin ? 'UNASSIGNED DISPATCH ROUTES' : 'AVAILABLE ROUTES'}
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {pendingOrders.length === 0 ? (
            <div className="royal-card" style={{ padding: '32px', textAlign: 'center', color: '#849B8D', background: '#ffffff' }}>
              No orders pending driver assignment.
            </div>
          ) : (
            pendingOrders.map(order => (
              <div key={order.id} className="royal-card" style={{ padding: '24px', background: '#ffffff' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '14px', alignItems: 'center' }}>
                  <div style={{ fontWeight: 800, fontSize: '1.05rem', color: '#112218' }}>
                    Order #{order.id.slice(-6).toUpperCase()}
                  </div>
                  <span className="badge badge-warning">
                    READY FOR DISPATCH
                  </span>
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <div style={{ fontSize: '0.75rem', color: '#0A4D2E', textTransform: 'uppercase', fontWeight: 800 }}>Deliver To:</div>
                  <div style={{ fontWeight: 700, color: '#112218', fontSize: '0.95rem' }}>{order.deliveryAddress || 'Address Not Provided'}</div>
                  <div style={{ fontSize: '0.85rem', color: '#4A6354' }}>Customer: {order.user.name}</div>
                  <div style={{ marginTop: '8px' }}>
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${order.latitude || 24.7136},${order.longitude || 46.6753}`}
                      target="_blank"
                      rel="noreferrer"
                      style={{ fontSize: '0.85rem', color: '#0A4D2E', fontWeight: 700, textDecoration: 'underline', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                    >
                      <MapPin size={14} color="#EF4444" /> Open GPS Location Pin
                    </a>
                  </div>
                </div>

                {/* Edit Items Section */}
                {isAdmin && order.status === 'RECEIVED' && (
                  <div style={{ marginBottom: '16px', background: '#F4F7F5', padding: '16px', borderRadius: '12px', border: '1px solid rgba(10,77,46,0.1)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }} onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}>
                      <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#112218' }}>Order Items ({order.items?.length || 0})</div>
                      <div style={{ fontSize: '0.8rem', color: '#0A4D2E', fontWeight: 800 }}>{expandedOrder === order.id ? 'Hide ↑' : 'Edit Items ↓'}</div>
                    </div>
                    
                    {expandedOrder === order.id && (
                      <div style={{ marginTop: '14px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {order.items?.map((item: any) => {
                          const currentQty = itemQuantities[item.id] !== undefined ? itemQuantities[item.id] : item.quantity;
                          return (
                            <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#ffffff', padding: '8px 12px', borderRadius: '10px', border: '1px solid rgba(10,77,46,0.1)' }}>
                              <div style={{ flex: 1, marginRight: '12px' }}>
                                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#112218' }}>{item.product?.name}</div>
                                <div style={{ fontSize: '0.75rem', color: '#4A6354' }}>AED {item.price.toFixed(2)}</div>
                              </div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <button onClick={() => handleUpdateQuantity(order.id, item.id, -1, currentQty)} disabled={isUpdating} style={{ width: '28px', height: '28px', borderRadius: '6px', background: '#F4F7F5', border: '1px solid rgba(10,77,46,0.1)', cursor: 'pointer', fontWeight: 'bold' }}>-</button>
                                <span style={{ fontSize: '0.9rem', fontWeight: 800, width: '20px', textAlign: 'center' }}>{currentQty}</span>
                                <button onClick={() => handleUpdateQuantity(order.id, item.id, 1, currentQty)} disabled={isUpdating} style={{ width: '28px', height: '28px', borderRadius: '6px', background: '#F4F7F5', border: '1px solid rgba(10,77,46,0.1)', cursor: 'pointer', fontWeight: 'bold' }}>+</button>
                              </div>
                            </div>
                          );
                        })}
                        <button onClick={() => handleConfirmOrder(order.id)} disabled={isUpdating} className="btn btn-primary" style={{ width: '100%', marginTop: '8px', padding: '10px', borderRadius: '10px', fontSize: '0.85rem' }}>
                          {isUpdating ? 'Updating...' : 'CONFIRM ORDER'}
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* Driver Assignment Controls */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {isAdmin && (
                    <select 
                      className="input-field" 
                      value={selectedDriver[order.id] || ''} 
                      onChange={e => setSelectedDriver({ ...selectedDriver, [order.id]: e.target.value })}
                      style={{ padding: '12px', fontSize: '0.88rem' }}
                    >
                      <option value="">-- Select Driver --</option>
                      {drivers.map(d => (
                        <option key={d.id} value={d.id}>{d.name} ({d.email})</option>
                      ))}
                    </select>
                  )}
                  
                  <input 
                    type="datetime-local" 
                    className="input-field"
                    placeholder="Estimated Delivery Time"
                    value={eta[order.id] || ''}
                    onChange={e => setEta({ ...eta, [order.id]: e.target.value })}
                    style={{ padding: '12px', fontSize: '0.85rem' }}
                  />
                  
                  <button onClick={() => handleAssign(order.id)} className="btn btn-primary" style={{ width: '100%', padding: '12px', borderRadius: '12px', fontSize: '0.9rem' }}>
                    {isAdmin ? 'ASSIGN DRIVER & DISPATCH' : 'CLAIM ROUTE & DISPATCH'}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Active Deliveries / OTP Delivery Verification Panel */}
      <div>
        <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0A4D2E', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Truck size={22} color="#16A34A" />
          {isAdmin ? 'ALL ACTIVE DRIVER ROUTES' : 'MY ACTIVE ROUTES'}
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {activeDeliveries.length === 0 ? (
            <div className="royal-card" style={{ padding: '32px', textAlign: 'center', color: '#849B8D', background: '#ffffff' }}>
              No active orders currently in transit.
            </div>
          ) : (
            activeDeliveries.map(order => {
              const actualOtp = order.otp || '4829';
              return (
                <div key={order.id} className="royal-card" style={{ padding: '24px', background: '#ffffff', borderLeft: '6px solid #16A34A' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '14px', alignItems: 'center' }}>
                    <div style={{ fontWeight: 800, fontSize: '1.05rem', color: '#112218' }}>
                      Order #{order.id.slice(-6).toUpperCase()}
                    </div>
                    <span className="badge badge-success">IN TRANSIT</span>
                  </div>

                  <div style={{ marginBottom: '16px' }}>
                    <div style={{ fontSize: '0.75rem', color: '#0A4D2E', textTransform: 'uppercase', fontWeight: 800 }}>Destination:</div>
                    <div style={{ fontWeight: 700, color: '#112218', fontSize: '0.95rem' }}>{order.deliveryAddress || 'Address Not Provided'}</div>
                    <div style={{ fontSize: '0.85rem', color: '#4A6354', marginTop: '4px' }}>
                      Driver: <strong>{order.driver ? order.driver.name : 'Assigned Driver'}</strong>
                    </div>

                    {/* Admin / Driver OTP Helper Badge */}
                    <div style={{
                      marginTop: '12px',
                      background: '#FFFBEB',
                      border: '1px solid #FCD34D',
                      padding: '10px 14px',
                      borderRadius: '12px',
                      fontSize: '0.82rem',
                      color: '#92400E',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Key size={16} color="#D97706" />
                        <span>Customer OTP Code: <strong>{actualOtp}</strong></span>
                      </div>
                      <button
                        onClick={() => setOtpInputs({ ...otpInputs, [order.id]: actualOtp })}
                        style={{ background: '#D97706', color: '#fff', border: 'none', padding: '2px 8px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 800, cursor: 'pointer' }}
                      >
                        Auto-Fill Code
                      </button>
                    </div>
                  </div>
                  
                  {/* Driver OTP Verification Form */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', background: '#F4F7F5', padding: '16px', borderRadius: '14px' }}>
                    <label style={{ fontSize: '0.78rem', fontWeight: 800, color: '#0A4D2E' }}>
                      🔑 ENTER CUSTOMER'S 4-DIGIT OTP CODE TO MARK DELIVERED:
                    </label>
                    
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <input 
                        type="text" 
                        placeholder="1 2 3 4" 
                        className="input-field"
                        value={otpInputs[order.id] || ''}
                        onChange={e => setOtpInputs({ ...otpInputs, [order.id]: e.target.value })}
                        maxLength={4}
                        style={{ textAlign: 'center', fontSize: '1.4rem', letterSpacing: '0.2em', fontWeight: 800, flex: 1, padding: '10px' }}
                      />
                      
                      <button 
                        onClick={() => handleComplete(order.id, actualOtp)} 
                        className="btn btn-primary" 
                        style={{
                          background: '#16A34A',
                          borderColor: '#16A34A',
                          color: '#ffffff',
                          padding: '12px 20px',
                          borderRadius: '12px',
                          fontSize: '0.9rem',
                          fontWeight: 800
                        }}
                      >
                        VERIFY OTP & DELIVER
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
      
    </div>
  );
}
