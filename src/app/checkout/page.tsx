'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Crown, ArrowLeft, MapPin, CreditCard, ShieldCheck, CheckCircle2, Truck, Lock } from 'lucide-react';
import { RoyalHeader } from '@/components/layout/RoyalHeader';

export default function CheckoutPage() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'cod' | 'apple'>('card');
  
  // Checkout form state
  const [formData, setFormData] = useState({
    fullName: 'Royal Customer',
    mobile: '0501234567',
    whatsapp: '0501234567',
    building: 'Al Noor Building',
    flat: '12A',
    street: 'King Fahd Road, Al Wurud'
  });

  const subtotal = 35.00;
  const deliveryFee = 5.00;
  const total = subtotal + deliveryFee;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div style={{ background: 'var(--bg-primary)', minHeight: '100vh', color: '#112218' }}>
      
      {/* Header */}
      <RoyalHeader />

      <div style={{ maxWidth: '1180px', margin: '0 auto', padding: '40px 24px' }}>
        
        <Link href="/cart" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: 700, color: '#0A4D2E', textDecoration: 'none', marginBottom: '24px' }}>
          <ArrowLeft size={16} /> Return to Cart
        </Link>

        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.2rem', fontWeight: 800, color: '#112218', marginBottom: '32px' }}>
          Secure Checkout
        </h1>

        <form action={async (fd) => {
          setLoading(true);
          const { placeOrder } = await import('@/app/actions/checkout');
          await placeOrder(fd);
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '36px', alignItems: 'start' }}>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              
              {/* Step 1: Delivery Details */}
              <div className="royal-card" style={{ padding: '32px', background: '#ffffff', opacity: step < 1 ? 0.6 : 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0A4D2E' }}>
                    1. DELIVERY ADDRESS & DETAILS
                  </h2>
                  {step > 1 && (
                    <button type="button" onClick={() => setStep(1)} style={{ background: 'none', border: 'none', color: '#0A4D2E', fontWeight: 700, cursor: 'pointer', fontSize: '0.85rem' }}>
                      Edit
                    </button>
                  )}
                </div>

                <div style={{ display: step === 1 ? 'flex' : 'none', flexDirection: 'column', gap: '16px' }}>
                  <div className="input-group">
                    <label className="input-label">FULL NAME *</label>
                    <input
                      type="text"
                      name="fullName"
                      className="input-field"
                      value={formData.fullName}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div className="input-group">
                      <label className="input-label">MOBILE NUMBER *</label>
                      <input
                        type="tel"
                        name="mobile"
                        className="input-field"
                        value={formData.mobile}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="input-group">
                      <label className="input-label">WHATSAPP (OPTIONAL)</label>
                      <input
                        type="tel"
                        name="whatsapp"
                        className="input-field"
                        value={formData.whatsapp}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div className="input-group">
                      <label className="input-label">BUILDING NAME / VILLA</label>
                      <input
                        type="text"
                        name="building"
                        className="input-field"
                        value={formData.building}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="input-group">
                      <label className="input-label">HOUSE / FLAT NO. *</label>
                      <input
                        type="text"
                        name="flat"
                        className="input-field"
                        value={formData.flat}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="input-group">
                    <label className="input-label">STREET & AREA *</label>
                    <input
                      type="text"
                      name="street"
                      className="input-field"
                      value={formData.street}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <button type="button" onClick={() => setStep(2)} className="btn btn-primary" style={{ padding: '14px', borderRadius: '12px', marginTop: '8px' }}>
                    Confirm Address & Continue
                  </button>
                </div>

                {step > 1 && (
                  <div style={{ fontSize: '0.9rem', color: '#4A6354', fontWeight: 600 }}>
                    📍 {formData.fullName} • {formData.flat}, {formData.building}, {formData.street} ({formData.mobile})
                  </div>
                )}
              </div>

              {/* Step 2: GPS Location Confirmation */}
              <div className="royal-card" style={{ padding: '32px', background: '#ffffff', opacity: step < 2 ? 0.6 : 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0A4D2E' }}>
                    2. GPS MAP LOCATION
                  </h2>
                  {step > 2 && (
                    <button type="button" onClick={() => setStep(2)} style={{ background: 'none', border: 'none', color: '#0A4D2E', fontWeight: 700, cursor: 'pointer', fontSize: '0.85rem' }}>
                      Edit
                    </button>
                  )}
                </div>

                {step === 2 && (
                  <div>
                    <div style={{
                      height: '200px',
                      borderRadius: '16px',
                      background: 'linear-gradient(135deg, #e0f2fe 0%, #dcfce7 100%)',
                      border: '1px solid rgba(10,77,46,0.15)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexDirection: 'column',
                      marginBottom: '20px',
                      position: 'relative'
                    }}>
                      <div style={{
                        background: '#EF4444',
                        color: '#fff',
                        width: '36px',
                        height: '36px',
                        borderRadius: '50% 50% 50% 0',
                        transform: 'rotate(-45deg)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 6px 14px rgba(239, 68, 68, 0.4)',
                        marginBottom: '8px'
                      }}>
                        <MapPin size={20} style={{ transform: 'rotate(45deg)' }} />
                      </div>
                      <span style={{ fontWeight: 800, color: '#0A4D2E', fontSize: '0.9rem' }}>Location Pin Set</span>
                      <span style={{ fontSize: '0.78rem', color: '#4A6354' }}>King Fahd Road, Al Wurud, Riyadh (24.7136° N, 46.6753° E)</span>
                    </div>

                    <button type="button" onClick={() => setStep(3)} className="btn btn-primary" style={{ width: '100%', padding: '14px', borderRadius: '12px' }}>
                      Confirm GPS Pin & Proceed to Payment
                    </button>
                  </div>
                )}

                {step > 2 && (
                  <div style={{ fontSize: '0.9rem', color: '#4A6354', fontWeight: 600 }}>
                    ✓ GPS Location Confirmed: King Fahd Road, Riyadh
                  </div>
                )}
              </div>

              {/* Step 3: Payment Options */}
              <div className="royal-card" style={{ padding: '32px', background: '#ffffff', opacity: step < 3 ? 0.6 : 1 }}>
                <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0A4D2E', marginBottom: '20px' }}>
                  3. PAYMENT OPTIONS
                </h2>

                {step === 3 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    
                    {/* Credit Card */}
                    <label style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '16px 20px',
                      borderRadius: '14px',
                      border: '2px solid',
                      borderColor: paymentMethod === 'card' ? '#0A4D2E' : 'rgba(10,77,46,0.15)',
                      background: paymentMethod === 'card' ? '#E6F4ED' : '#ffffff',
                      cursor: 'pointer'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <input
                          type="radio"
                          name="payment"
                          value="card"
                          checked={paymentMethod === 'card'}
                          onChange={() => setPaymentMethod('card')}
                          style={{ accentColor: '#0A4D2E', width: '18px', height: '18px' }}
                        />
                        <span style={{ fontWeight: 800, fontSize: '0.95rem', color: '#112218' }}>Credit / Debit Card</span>
                      </div>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <span style={{ background: '#1e3a8a', color: '#fff', padding: '2px 8px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 800 }}>VISA</span>
                        <span style={{ background: '#ea580c', color: '#fff', padding: '2px 8px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 800 }}>MC</span>
                      </div>
                    </label>

                    {/* Apple Pay */}
                    <label style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '16px 20px',
                      borderRadius: '14px',
                      border: '2px solid',
                      borderColor: paymentMethod === 'apple' ? '#0A4D2E' : 'rgba(10,77,46,0.15)',
                      background: paymentMethod === 'apple' ? '#000000' : '#ffffff',
                      color: paymentMethod === 'apple' ? '#ffffff' : '#112218',
                      cursor: 'pointer'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <input
                          type="radio"
                          name="payment"
                          value="apple"
                          checked={paymentMethod === 'apple'}
                          onChange={() => setPaymentMethod('apple')}
                          style={{ accentColor: '#0A4D2E', width: '18px', height: '18px' }}
                        />
                        <span style={{ fontWeight: 800, fontSize: '0.95rem' }}> Apple Pay</span>
                      </div>
                    </label>

                    {/* Cash on Delivery */}
                    <label style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '16px 20px',
                      borderRadius: '14px',
                      border: '2px solid',
                      borderColor: paymentMethod === 'cod' ? '#0A4D2E' : 'rgba(10,77,46,0.15)',
                      background: paymentMethod === 'cod' ? '#E6F4ED' : '#ffffff',
                      cursor: 'pointer'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <input
                          type="radio"
                          name="payment"
                          value="cod"
                          checked={paymentMethod === 'cod'}
                          onChange={() => setPaymentMethod('cod')}
                          style={{ accentColor: '#0A4D2E', width: '18px', height: '18px' }}
                        />
                        <span style={{ fontWeight: 800, fontSize: '0.95rem', color: '#112218' }}>Cash on Delivery</span>
                      </div>
                      <span style={{ fontSize: '1.2rem' }}>💵</span>
                    </label>

                  </div>
                )}
              </div>

            </div>

            {/* Order Summary Side Panel & PLACE ORDER Button */}
            <div className="royal-card" style={{ padding: '28px', background: '#ffffff', position: 'sticky', top: '90px' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#112218', marginBottom: '20px', borderBottom: '1px solid rgba(10,77,46,0.1)', paddingBottom: '12px' }}>
                Order Summary
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                  <div>
                    <div style={{ fontWeight: 700, color: '#112218' }}>Organic Fresh Basket</div>
                    <div style={{ fontSize: '0.78rem', color: '#4A6354' }}>Fruits & Vegetables</div>
                  </div>
                  <div style={{ fontWeight: 800, color: '#0A4D2E' }}>AED 35.00</div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '10px' }}>
                <span style={{ color: '#4A6354' }}>Subtotal</span>
                <span style={{ fontWeight: 700, color: '#112218' }}>AED {subtotal.toFixed(2)}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '20px' }}>
                <span style={{ color: '#4A6354' }}>Delivery Charge</span>
                <span style={{ fontWeight: 700, color: '#16A34A' }}>AED {deliveryFee.toFixed(2)}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', paddingTop: '16px', borderTop: '1px solid rgba(10,77,46,0.12)', marginBottom: '28px' }}>
                <div>
                  <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#112218' }}>TOTAL AMOUNT</span>
                  <div style={{ fontSize: '0.7rem', color: '#4A6354' }}>Inclusive of VAT</div>
                </div>
                <span style={{ fontFamily: 'var(--font-heading)', fontSize: '2.2rem', fontWeight: 800, color: '#0A4D2E', lineHeight: 1 }}>
                  AED {total.toFixed(2)}
                </span>
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '18px',
                  fontSize: '1.1rem',
                  borderRadius: '14px',
                  fontWeight: 800,
                  boxShadow: '0 8px 24px rgba(10,77,46,0.3)'
                }}
              >
                {loading ? 'PLACING ORDER...' : '🔒 PLACE ORDER NOW'}
              </button>

              <div style={{ marginTop: '16px', textAlign: 'center', fontSize: '0.78rem', color: '#4A6354', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                <Lock size={14} color="#16A34A" /> 256-bit Encrypted Royal Checkout
              </div>
            </div>

          </div>
        </form>

      </div>
    </div>
  );
}
