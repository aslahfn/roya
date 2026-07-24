'use client';

import { useState } from 'react';
import { assignDriverAction, markDeliveredAction, updateOrderItemQuantityAction, confirmOrderAction } from '../actions';
import { Truck, CheckCircle2, ShieldCheck, MapPin, Key, Clock, AlertCircle, Edit3, Minus, Plus, PackageX } from 'lucide-react';

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

  const handleUpdateQuantity = async (orderId: string, orderItemId: string, targetQuantity: number) => {
    try {
      setIsUpdating(true);
      if (targetQuantity < 0) return;
      
      setItemQuantities(prev => ({ ...prev, [orderItemId]: targetQuantity }));
      await updateOrderItemQuantityAction(orderId, orderItemId, targetQuantity);
      
      setSuccessMessage(`Order item quantity updated to ${targetQuantity}. Total recalculated!`);
      setTimeout(() => setSuccessMessage(''), 3500);
    } catch (err: any) {
      setError(err.message || 'Failed to update item quantity');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleConfirmOrder = async (orderId: string) => {
    try {
      setIsUpdating(true);
      await confirmOrderAction(orderId);
      setExpandedOrder(null);
      setSuccessMessage('Order confirmed and customer notified!');
      setTimeout(() => setSuccessMessage(''), 3500);
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
      setSuccessMessage('Driver assigned to route!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to assign driver');
    }
  };

  const handleComplete = async (orderId: string, actualOtp: string) => {
    try {
      const inputOtp = otpInputs[orderId];
      if (!inputOtp || inputOtp !== actualOtp) {
        setError(`Invalid OTP "${inputOtp || ''}". Customer's 4-digit OTP is required.`);
        return;
      }
      
      await markDeliveredAction(orderId);
      setError('');
      setSuccessMessage('✅ OTP Verified! Order set to DELIVERED.');
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
        <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#16A34A', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Clock size={22} color="#D97706" />
          {isAdmin ? 'UNASSIGNED DISPATCH ROUTES' : 'AVAILABLE ROUTES'}
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {pendingOrders.length === 0 ? (
            <div className="royal-card" style={{ padding: '32px', textAlign: 'center', color: '#4b7c59', background: '#ffffff' }}>
              No orders pending driver assignment.
            </div>
          ) : (
            pendingOrders.map(order => (
              <div key={order.id} className="royal-card" style={{ padding: '24px', background: '#ffffff' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '14px', alignItems: 'center' }}>
                  <div style={{ fontWeight: 800, fontSize: '1.05rem', color: '#052e16' }}>
                    Order #{order.id.slice(-6).toUpperCase()}
                  </div>
                  <span className="badge badge-warning">
                    READY FOR DISPATCH
                  </span>
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <div style={{ fontSize: '0.75rem', color: '#16A34A', textTransform: 'uppercase', fontWeight: 800 }}>Deliver To:</div>
                  <div style={{ fontWeight: 700, color: '#052e16', fontSize: '0.95rem' }}>{order.deliveryAddress || 'Address Not Provided'}</div>
                  <div style={{ fontSize: '0.85rem', color: '#166534' }}>Customer: {order.user.name}</div>
                  <div style={{ marginTop: '8px' }}>
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${order.latitude || 24.7136},${order.longitude || 46.6753}`}
                      target="_blank"
                      rel="noreferrer"
                      style={{ fontSize: '0.85rem', color: '#16A34A', fontWeight: 700, textDecoration: 'underline', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                    >
                      <MapPin size={14} color="#EF4444" /> Open GPS Location Pin
                    </a>
                  </div>
                </div>

                {/* EDIT CUSTOMER ORDER DETAILS (Stock Adjustment for 2 -> 1) */}
                {isAdmin && (
                  <div style={{ marginBottom: '16px', background: '#F0FDF4', padding: '16px', borderRadius: '14px', border: '1px solid rgba(22,163,74,0.2)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }} onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}>
                      <div style={{ fontWeight: 800, fontSize: '0.88rem', color: '#052e16', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Edit3 size={16} color="#16A34A" />
                        <span>Edit Customer Order ({order.items?.length || 0} items)</span>
                      </div>
                      <div style={{ fontSize: '0.8rem', color: '#16A34A', fontWeight: 800 }}>
                        {expandedOrder === order.id ? 'Close Panel ↑' : 'Adjust Quantities ↓'}
                      </div>
                    </div>
                    
                    {expandedOrder === order.id && (
                      <div style={{ marginTop: '14px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <div style={{ fontSize: '0.78rem', color: '#166534', fontWeight: 700, background: '#ffffff', padding: '8px 12px', borderRadius: '8px', border: '1px solid rgba(22,163,74,0.15)' }}>
                          ℹ️ If a customer ordered 2 items but stock has 1, click <strong>"Set Qty to 1"</strong> to adjust stock.
                        </div>

                        {order.items?.map((item: any) => {
                          const currentQty = itemQuantities[item.id] !== undefined ? itemQuantities[item.id] : item.quantity;
                          return (
                            <div key={item.id} style={{ display: 'flex', flexDirection: 'column', gap: '8px', background: '#ffffff', padding: '12px', borderRadius: '12px', border: '1px solid rgba(22,163,74,0.18)' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                  <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#052e16' }}>{item.product?.name}</div>
                                  <div style={{ fontSize: '0.78rem', color: '#166534' }}>AED {item.price.toFixed(2)} each</div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                  <button onClick={() => handleUpdateQuantity(order.id, item.id, currentQty - 1)} disabled={isUpdating} style={{ width: '30px', height: '30px', borderRadius: '8px', background: '#F0FDF4', border: '1px solid rgba(22,163,74,0.3)', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Minus size={14} color="#16A34A" />
                                  </button>
                                  <span style={{ fontSize: '1rem', fontWeight: 800, width: '24px', textAlign: 'center', color: '#052e16' }}>{currentQty}</span>
                                  <button onClick={() => handleUpdateQuantity(order.id, item.id, currentQty + 1)} disabled={isUpdating} style={{ width: '30px', height: '30px', borderRadius: '8px', background: '#F0FDF4', border: '1px solid rgba(22,163,74,0.3)', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Plus size={14} color="#16A34A" />
                                  </button>
                                </div>
                              </div>

                              {/* Quick 1-Click Stock Adjustment Button (2 -> 1) */}
                              {currentQty > 1 && (
                                <button
                                  onClick={() => handleUpdateQuantity(order.id, item.id, 1)}
                                  disabled={isUpdating}
                                  style={{
                                    background: '#FEF3C7',
                                    border: '1px solid #F59E0B',
                                    color: '#B45309',
                                    padding: '6px 10px',
                                    borderRadius: '8px',
                                    fontSize: '0.75rem',
                                    fontWeight: 800,
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '6px'
                                  }}
                                >
                                  <PackageX size={14} /> Only 1 in Stock? Click to Adjust Qty from {currentQty} to 1
                                </button>
                              )}
                            </div>
                          );
                        })}

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '10px', borderTop: '1px dashed rgba(22,163,74,0.2)' }}>
                          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#166534' }}>Recalculated Order Total:</span>
                          <span style={{ fontSize: '1.2rem', fontWeight: 900, color: '#16A34A' }}>AED {order.totalAmount.toFixed(2)}</span>
                        </div>

                        <button onClick={() => handleConfirmOrder(order.id)} disabled={isUpdating} className="btn btn-primary" style={{ width: '100%', marginTop: '6px', padding: '10px', borderRadius: '10px', fontSize: '0.85rem' }}>
                          {isUpdating ? 'Updating...' : 'CONFIRM ADJUSTED ORDER'}
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
        <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#16A34A', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Truck size={22} color="#16A34A" />
          {isAdmin ? 'ALL ACTIVE DRIVER ROUTES' : 'MY ACTIVE ROUTES'}
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {activeDeliveries.length === 0 ? (
            <div className="royal-card" style={{ padding: '32px', textAlign: 'center', color: '#4b7c59', background: '#ffffff' }}>
              No active orders currently in transit.
            </div>
          ) : (
            activeDeliveries.map(order => {
              const actualOtp = order.otp || '4829';
              return (
                <div key={order.id} className="royal-card" style={{ padding: '24px', background: '#ffffff', borderLeft: '6px solid #16A34A' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '14px', alignItems: 'center' }}>
                    <div style={{ fontWeight: 800, fontSize: '1.05rem', color: '#052e16' }}>
                      Order #{order.id.slice(-6).toUpperCase()}
                    </div>
                    <span className="badge badge-success">IN TRANSIT</span>
                  </div>

                  <div style={{ marginBottom: '16px' }}>
                    <div style={{ fontSize: '0.75rem', color: '#16A34A', textTransform: 'uppercase', fontWeight: 800 }}>Destination:</div>
                    <div style={{ fontWeight: 700, color: '#052e16', fontSize: '0.95rem' }}>{order.deliveryAddress || 'Address Not Provided'}</div>
                    <div style={{ fontSize: '0.85rem', color: '#166534', marginTop: '4px' }}>
                      Driver: <strong>{order.driver ? order.driver.name : 'Assigned Driver'}</strong>
                    </div>

                    {/* Admin / Driver OTP Helper Badge */}
                    <div style={{
                      marginTop: '12px',
                      background: '#FEF3C7',
                      border: '1px solid #F59E0B',
                      padding: '10px 14px',
                      borderRadius: '12px',
                      fontSize: '0.82rem',
                      color: '#B45309',
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
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', background: '#F0FDF4', padding: '16px', borderRadius: '14px', border: '1px solid rgba(22,163,74,0.2)' }}>
                    <label style={{ fontSize: '0.78rem', fontWeight: 800, color: '#16A34A' }}>
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
