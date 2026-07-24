'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Crown, CheckCircle2, MapPin, Search, Phone, ArrowRight, ShieldCheck, Home, Briefcase, Tag, Truck, Sparkles, Smartphone, ChevronRight } from 'lucide-react';

export default function UserJourneyFlowPage() {
  const [activeStep, setActiveStep] = useState<number>(1);
  const [selectedLabel, setSelectedLabel] = useState<'Home' | 'Work' | 'Other'>('Home');

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #F4F7F5 0%, #E6F4ED 100%)',
      padding: '40px 20px',
      color: '#112218'
    }}>
      
      {/* Top Banner */}
      <div style={{ maxWidth: '1280px', margin: '0 auto 32px', textAlign: 'center' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          background: '#0A4D2E',
          color: '#ffffff',
          padding: '6px 20px',
          borderRadius: '20px',
          fontSize: '0.85rem',
          fontWeight: 800,
          marginBottom: '16px'
        }}>
          <Crown size={16} color="#FFB800" />
          <span>ROYAL SUPERMARKET USER JOURNEY</span>
        </div>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.5rem', fontWeight: 800, color: '#0A4D2E', marginBottom: '8px' }}>
          Opening the App to Address Completion
        </h1>
        <p style={{ fontSize: '1.05rem', color: '#4A6354', maxWidth: '640px', margin: '0 auto' }}>
          A Simple & Easy Flow for Better Customer Experience
        </p>

        {/* Step Navigation Bar */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '12px',
          marginTop: '28px',
          flexWrap: 'wrap'
        }}>
          {[
            { id: 1, title: '1. Open App' },
            { id: 2, title: '2. Login / OTP' },
            { id: 3, title: '3. Select Location' },
            { id: 4, title: '4. Confirm Location' },
            { id: 5, title: '5. Enter Details' },
            { id: 6, title: '6. Address Saved' },
          ].map((step) => (
            <button
              key={step.id}
              onClick={() => setActiveStep(step.id)}
              style={{
                padding: '10px 18px',
                borderRadius: '14px',
                border: '1px solid',
                borderColor: activeStep === step.id ? '#0A4D2E' : 'rgba(10,77,46,0.15)',
                background: activeStep === step.id ? '#0A4D2E' : '#ffffff',
                color: activeStep === step.id ? '#ffffff' : '#112218',
                fontWeight: 700,
                fontSize: '0.85rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: activeStep === step.id ? '0 4px 14px rgba(10,77,46,0.25)' : 'none'
              }}
            >
              {step.title}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Interactive Mobile Mockups (Side-by-Side View) */}
      <div style={{
        maxWidth: '1360px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '28px',
        alignItems: 'start'
      }}>

        {/* SCREEN 1: OPEN THE APP */}
        <div style={{
          opacity: activeStep === 1 ? 1 : 0.85,
          transform: activeStep === 1 ? 'scale(1.02)' : 'scale(1)',
          transition: 'all 0.3s ease'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
            <span style={{ background: '#0A4D2E', color: '#fff', borderRadius: '50%', width: '24px', height: '24px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 800 }}>1</span>
            <span style={{ fontWeight: 800, fontSize: '1rem', color: '#0A4D2E' }}>Open the App</span>
          </div>

          <div className="phone-frame">
            <div className="phone-notch"></div>
            <div style={{
              background: 'linear-gradient(180deg, #0A4D2E 0%, #063821 100%)',
              color: '#ffffff',
              height: '100%',
              padding: '60px 24px 32px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'space-between',
              textAlign: 'center'
            }}>
              <div>
                <div style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #FFB800 0%, #D4AF37 100%)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 8px 24px rgba(255,184,0,0.4)',
                  marginBottom: '12px'
                }}>
                  <Crown size={36} color="#0A4D2E" strokeWidth={2.5} />
                </div>
                <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', fontWeight: 800, color: '#ffffff', lineHeight: 1.1 }}>
                  Royal
                </h2>
                <span style={{ fontSize: '0.7rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: '#FFB800', fontWeight: 700 }}>
                  SUPERMARKET
                </span>
                <p style={{ fontSize: '0.85rem', color: '#E8F0EB', marginTop: '12px', fontWeight: 500 }}>
                  Freshness Delivered to Your Doorstep
                </p>
              </div>

              {/* Basket Illustration Graphics */}
              <div style={{
                background: 'rgba(255,255,255,0.08)',
                padding: '24px',
                borderRadius: '24px',
                width: '100%',
                border: '1px solid rgba(255,255,255,0.12)'
              }}>
                <div style={{ fontSize: '3.5rem', lineHeight: 1 }}>🧺🥦🍎🥛</div>
              </div>

              <div style={{ width: '100%' }}>
                <button
                  onClick={() => setActiveStep(2)}
                  className="btn"
                  style={{
                    width: '100%',
                    background: '#16A34A',
                    color: '#ffffff',
                    padding: '16px',
                    borderRadius: '14px',
                    fontWeight: 800,
                    fontSize: '1rem',
                    boxShadow: '0 6px 20px rgba(22,163,74,0.4)'
                  }}
                >
                  Get Started
                </button>
                <div style={{ marginTop: '12px', fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)', cursor: 'pointer' }}>
                  عربي
                </div>
              </div>
            </div>
          </div>
          <p style={{ fontSize: '0.85rem', color: '#4A6354', marginTop: '10px', textAlign: 'center' }}>
            User opens the app and clicks on 'Get Started'
          </p>
        </div>

        {/* SCREEN 2: WELCOME / LOGIN */}
        <div style={{
          opacity: activeStep === 2 ? 1 : 0.85,
          transform: activeStep === 2 ? 'scale(1.02)' : 'scale(1)',
          transition: 'all 0.3s ease'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
            <span style={{ background: '#0A4D2E', color: '#fff', borderRadius: '50%', width: '24px', height: '24px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 800 }}>2</span>
            <span style={{ fontWeight: 800, fontSize: '1rem', color: '#0A4D2E' }}>Welcome / Login</span>
          </div>

          <div className="phone-frame">
            <div className="phone-notch"></div>
            <div style={{
              background: '#ffffff',
              height: '100%',
              padding: '50px 20px 24px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}>
              <div>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#112218', marginBottom: '4px' }}>Welcome Back!</h3>
                <p style={{ fontSize: '0.8rem', color: '#4A6354', marginBottom: '20px' }}>Login or register to continue</p>

                <div className="input-group">
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <div style={{ background: '#F4F7F5', border: '1px solid rgba(10,77,46,0.15)', padding: '10px 10px', borderRadius: '10px', fontWeight: 700, fontSize: '0.85rem', color: '#0A4D2E' }}>
                      🇸🇦 +966
                    </div>
                    <input
                      type="text"
                      className="input-field"
                      defaultValue="50 123 4567"
                      style={{ flex: 1, padding: '10px 12px', fontSize: '0.9rem' }}
                    />
                  </div>
                </div>

                <button
                  onClick={() => setActiveStep(3)}
                  className="btn"
                  style={{ width: '100%', background: '#0A4D2E', color: '#fff', padding: '14px', borderRadius: '10px', fontWeight: 700, fontSize: '0.9rem' }}
                >
                  Send OTP
                </button>

                <div style={{ textAlign: 'center', margin: '16px 0', fontSize: '0.75rem', color: '#849B8D', fontWeight: 700 }}>OR</div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <button onClick={() => setActiveStep(3)} style={{ padding: '10px', borderRadius: '10px', border: '1px solid rgba(10,77,46,0.15)', background: '#fff', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}>
                    G &nbsp; Continue with Google
                  </button>
                  <button onClick={() => setActiveStep(3)} style={{ padding: '10px', borderRadius: '10px', border: 'none', background: '#000', color: '#fff', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}>
                     &nbsp; Continue with Apple
                  </button>
                </div>
              </div>

              <div style={{ textAlign: 'center', fontSize: '0.75rem', color: '#4A6354' }}>
                New here? <span style={{ color: '#0A4D2E', fontWeight: 700, textDecoration: 'underline', cursor: 'pointer' }}>Create Account</span>
              </div>
            </div>
          </div>
          <p style={{ fontSize: '0.85rem', color: '#4A6354', marginTop: '10px', textAlign: 'center' }}>
            User enters mobile number & receives OTP verification
          </p>
        </div>

        {/* SCREEN 3: SELECT LOCATION */}
        <div style={{
          opacity: activeStep === 3 ? 1 : 0.85,
          transform: activeStep === 3 ? 'scale(1.02)' : 'scale(1)',
          transition: 'all 0.3s ease'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
            <span style={{ background: '#0A4D2E', color: '#fff', borderRadius: '50%', width: '24px', height: '24px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 800 }}>3</span>
            <span style={{ fontWeight: 800, fontSize: '1rem', color: '#0A4D2E' }}>Select Location</span>
          </div>

          <div className="phone-frame">
            <div className="phone-notch"></div>
            <div style={{
              background: '#ffffff',
              height: '100%',
              padding: '50px 20px 24px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}>
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#112218', marginBottom: '16px' }}>Select Location</h3>

                <div style={{ position: 'relative', marginBottom: '16px' }}>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="Search area or street"
                    style={{ paddingLeft: '36px', fontSize: '0.85rem', padding: '10px 10px 10px 36px' }}
                  />
                  <Search size={16} color="#849B8D" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                </div>

                <button
                  onClick={() => setActiveStep(4)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '10px',
                    border: '1px solid #0A4D2E',
                    background: '#ffffff',
                    color: '#0A4D2E',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    marginBottom: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    cursor: 'pointer'
                  }}
                >
                  🎯 Use Current Location
                </button>

                <div style={{ textAlign: 'center', fontSize: '0.7rem', color: '#849B8D', margin: '8px 0', fontWeight: 700 }}>OR</div>

                <button
                  onClick={() => setActiveStep(4)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '10px',
                    border: '1px solid rgba(10,77,46,0.15)',
                    background: '#F4F7F5',
                    color: '#0A4D2E',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    cursor: 'pointer'
                  }}
                >
                  📍 Choose on Map
                </button>
              </div>

              <div style={{ background: '#E6F4ED', padding: '12px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Truck size={20} color="#0A4D2E" />
                <div style={{ fontSize: '0.75rem', color: '#0A4D2E', fontWeight: 700 }}>
                  We deliver to your area <br/><span style={{ fontWeight: 400, color: '#4A6354' }}>Check delivery availability</span>
                </div>
              </div>
            </div>
          </div>
          <p style={{ fontSize: '0.85rem', color: '#4A6354', marginTop: '10px', textAlign: 'center' }}>
            User allows location or selects on map
          </p>
        </div>

        {/* SCREEN 4: CONFIRM LOCATION */}
        <div style={{
          opacity: activeStep === 4 ? 1 : 0.85,
          transform: activeStep === 4 ? 'scale(1.02)' : 'scale(1)',
          transition: 'all 0.3s ease'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
            <span style={{ background: '#0A4D2E', color: '#fff', borderRadius: '50%', width: '24px', height: '24px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 800 }}>4</span>
            <span style={{ fontWeight: 800, fontSize: '1rem', color: '#0A4D2E' }}>Confirm Location</span>
          </div>

          <div className="phone-frame">
            <div className="phone-notch"></div>
            <div style={{
              background: '#ffffff',
              height: '100%',
              padding: '50px 20px 24px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}>
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#112218', marginBottom: '12px' }}>Confirm Location</h3>

                <div style={{
                  height: '180px',
                  borderRadius: '14px',
                  background: 'linear-gradient(135deg, #e0f2fe 0%, #dcfce7 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  border: '1px solid rgba(10,77,46,0.15)',
                  marginBottom: '14px'
                }}>
                  <div style={{ textAlign: 'center' }}>
                    <MapPin size={32} color="#EF4444" />
                  </div>
                </div>

                <div style={{ background: '#F4F7F5', padding: '12px', borderRadius: '12px' }}>
                  <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#0A4D2E' }}>📍 Your Location</div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#112218' }}>King Fahd Road</div>
                  <div style={{ fontSize: '0.75rem', color: '#4A6354' }}>Al Wurud, Riyadh, Saudi Arabia</div>
                  <button onClick={() => setActiveStep(3)} style={{ background: 'none', border: 'none', color: '#0A4D2E', textDecoration: 'underline', fontSize: '0.7rem', fontWeight: 700, cursor: 'pointer', marginTop: '4px' }}>
                    Change Location
                  </button>
                </div>
              </div>

              <button
                onClick={() => setActiveStep(5)}
                className="btn btn-primary"
                style={{ width: '100%', padding: '14px', borderRadius: '12px', fontSize: '0.9rem' }}
              >
                Confirm Location
              </button>
            </div>
          </div>
          <p style={{ fontSize: '0.85rem', color: '#4A6354', marginTop: '10px', textAlign: 'center' }}>
            User confirms the selected location on map
          </p>
        </div>

        {/* SCREEN 5: ENTER DETAILS */}
        <div style={{
          opacity: activeStep === 5 ? 1 : 0.85,
          transform: activeStep === 5 ? 'scale(1.02)' : 'scale(1)',
          transition: 'all 0.3s ease'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
            <span style={{ background: '#0A4D2E', color: '#fff', borderRadius: '50%', width: '24px', height: '24px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 800 }}>5</span>
            <span style={{ fontWeight: 800, fontSize: '1rem', color: '#0A4D2E' }}>Enter Details</span>
          </div>

          <div className="phone-frame">
            <div className="phone-notch"></div>
            <div style={{
              background: '#ffffff',
              height: '100%',
              padding: '50px 20px 24px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}>
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#112218', marginBottom: '14px' }}>Delivery Address</h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div>
                    <label style={{ fontSize: '0.7rem', fontWeight: 700, color: '#112218' }}>House / Flat Number *</label>
                    <input type="text" className="input-field" defaultValue="12A" style={{ padding: '8px 10px', fontSize: '0.8rem' }} />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.7rem', fontWeight: 700, color: '#112218' }}>Building Name (Optional)</label>
                    <input type="text" className="input-field" defaultValue="Al Noor Building" style={{ padding: '8px 10px', fontSize: '0.8rem' }} />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.7rem', fontWeight: 700, color: '#112218' }}>Address Label</label>
                    <div style={{ display: 'flex', gap: '6px', marginTop: '4px' }}>
                      {(['Home', 'Work', 'Other'] as const).map((lbl) => (
                        <button
                          key={lbl}
                          type="button"
                          onClick={() => setSelectedLabel(lbl)}
                          style={{
                            padding: '6px 12px',
                            borderRadius: '20px',
                            border: '1px solid',
                            borderColor: selectedLabel === lbl ? '#0A4D2E' : 'rgba(10,77,46,0.15)',
                            background: selectedLabel === lbl ? '#E6F4ED' : '#fff',
                            color: selectedLabel === lbl ? '#0A4D2E' : '#4A6354',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            cursor: 'pointer'
                          }}
                        >
                          {lbl}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label style={{ fontSize: '0.7rem', fontWeight: 700, color: '#112218' }}>Phone Number *</label>
                    <input type="tel" className="input-field" defaultValue="05XXXXXXXX" style={{ padding: '8px 10px', fontSize: '0.8rem' }} />
                  </div>
                </div>
              </div>

              <button
                onClick={() => setActiveStep(6)}
                className="btn btn-primary"
                style={{ width: '100%', padding: '14px', borderRadius: '12px', fontSize: '0.9rem' }}
              >
                Save Address
              </button>
            </div>
          </div>
          <p style={{ fontSize: '0.85rem', color: '#4A6354', marginTop: '10px', textAlign: 'center' }}>
            User enters few important details & saves address
          </p>
        </div>

        {/* SCREEN 6: ADDRESS SAVED SUCCESS */}
        <div style={{
          opacity: activeStep === 6 ? 1 : 0.85,
          transform: activeStep === 6 ? 'scale(1.02)' : 'scale(1)',
          transition: 'all 0.3s ease'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
            <span style={{ background: '#0A4D2E', color: '#fff', borderRadius: '50%', width: '24px', height: '24px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 800 }}>6</span>
            <span style={{ fontWeight: 800, fontSize: '1rem', color: '#0A4D2E' }}>Address Saved</span>
          </div>

          <div className="phone-frame">
            <div className="phone-notch"></div>
            <div style={{
              background: '#ffffff',
              height: '100%',
              padding: '60px 20px 24px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'space-between',
              textAlign: 'center'
            }}>
              <div>
                <div style={{
                  width: '72px',
                  height: '72px',
                  borderRadius: '50%',
                  background: '#DCFCE7',
                  color: '#16A34A',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '20px'
                }}>
                  <CheckCircle2 size={44} strokeWidth={2.5} />
                </div>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#112218', marginBottom: '8px' }}>
                  Address Saved Successfully!
                </h3>
                <p style={{ fontSize: '0.8rem', color: '#4A6354', padding: '0 12px' }}>
                  You can now start shopping and place your order.
                </p>
              </div>

              <div style={{ width: '100%' }}>
                <Link
                  href="/"
                  className="btn btn-primary"
                  style={{ width: '100%', padding: '14px', borderRadius: '12px', fontSize: '0.9rem', marginBottom: '10px', textDecoration: 'none' }}
                >
                  Start Shopping
                </Link>
                <div style={{ fontSize: '0.75rem', color: '#0A4D2E', fontWeight: 700, cursor: 'pointer' }}>
                  View My Addresses
                </div>
              </div>
            </div>
          </div>
          <p style={{ fontSize: '0.85rem', color: '#4A6354', marginTop: '10px', textAlign: 'center' }}>
            Address is saved successfully and user can start shopping
          </p>
        </div>

      </div>

      {/* Bottom KEY BENEFITS Component matching visual diagram */}
      <div style={{ maxWidth: '1280px', margin: '48px auto 0' }}>
        <div className="benefits-banner">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', borderRight: '2px solid rgba(10,77,46,0.12)', paddingRight: '24px' }}>
            <div style={{ background: '#0A4D2E', color: '#FFB800', width: '36px', height: '36px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>★</div>
            <span style={{ fontWeight: 800, fontSize: '1rem', color: '#0A4D2E', letterSpacing: '0.03em' }}>KEY BENEFITS</span>
          </div>

          <div className="benefit-item">
            <div className="benefit-icon">⭐</div>
            <div>
              <div style={{ fontWeight: 700 }}>Very Easy</div>
              <div style={{ fontSize: '0.75rem', color: '#4A6354' }}>for Everyone</div>
            </div>
          </div>

          <div className="benefit-item">
            <div className="benefit-icon">📱</div>
            <div>
              <div style={{ fontWeight: 700 }}>Less Typing</div>
              <div style={{ fontSize: '0.75rem', color: '#4A6354' }}>More Automation</div>
            </div>
          </div>

          <div className="benefit-item">
            <div className="benefit-icon">📍</div>
            <div>
              <div style={{ fontWeight: 700 }}>Accurate Location</div>
              <div style={{ fontSize: '0.75rem', color: '#4A6354' }}>with Map</div>
            </div>
          </div>

          <div className="benefit-item">
            <div className="benefit-icon">⚡</div>
            <div>
              <div style={{ fontWeight: 700 }}>Faster Checkout</div>
              <div style={{ fontSize: '0.75rem', color: '#4A6354' }}>Experience</div>
            </div>
          </div>

          <div className="benefit-item">
            <div className="benefit-icon">👵</div>
            <div>
              <div style={{ fontWeight: 700 }}>Better Experience</div>
              <div style={{ fontSize: '0.75rem', color: '#4A6354' }}>for Elders & All Users</div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
