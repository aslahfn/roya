'use client';

import { useState } from 'react';
import { MessageCircle, X, Send, Crown, CheckCircle2 } from 'lucide-react';

interface WhatsAppSupportProps {
  phoneNumber?: string;
  orderId?: string;
  orderTotal?: number;
}

export function WhatsAppSupport({ phoneNumber = '+966500000000', orderId, orderTotal }: WhatsAppSupportProps) {
  const [open, setOpen] = useState(false);
  const [messageText, setMessageText] = useState(
    orderId 
      ? `Hello Royal Supermarket Support! I have a question regarding my Order #${orderId.substring(0, 8)} (Total: AED ${orderTotal?.toFixed(2) || '0.00'}).`
      : 'Hello Royal Supermarket Support! I would like to inquire about fresh delivery slots.'
  );

  const handleSend = () => {
    const encodedMessage = encodeURIComponent(messageText);
    const whatsappUrl = `https://wa.me/${phoneNumber.replace(/\D/g, '')}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
    setOpen(false);
  };

  return (
    <div style={{ position: 'fixed', bottom: '84px', right: '16px', zIndex: 999 }}>
      
      {/* Expanded WhatsApp Quick Chat Card */}
      {open && (
        <div className="royal-card animate-fade-in" style={{
          position: 'absolute',
          bottom: '70px',
          right: 0,
          width: '340px',
          background: '#ffffff',
          boxShadow: '0 16px 40px rgba(10, 77, 46, 0.25)',
          borderRadius: '20px',
          overflow: 'hidden',
          border: '1px solid rgba(10,77,46,0.15)'
        }}>
          {/* Header */}
          <div style={{
            background: 'linear-gradient(135deg, #0A4D2E 0%, #063821 100%)',
            color: '#ffffff',
            padding: '16px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: '#25D366',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <MessageCircle size={20} />
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: '0.95rem' }}>Royal WhatsApp Support</div>
                <div style={{ fontSize: '0.72rem', color: '#DCFCE7', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#25D366' }}></span>
                  Online • Replies in minutes
                </div>
              </div>
            </div>
            <button onClick={() => setOpen(false)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}>
              <X size={18} />
            </button>
          </div>

          {/* Chat Body */}
          <div style={{ padding: '20px', background: '#F4F7F5' }}>
            <div style={{
              background: '#ffffff',
              padding: '14px',
              borderRadius: '14px',
              fontSize: '0.85rem',
              color: '#112218',
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
              marginBottom: '16px'
            }}>
              👋 Hi! Welcome to Royal Supermarket Support. How can we assist with your fresh grocery delivery today?
            </div>

            <textarea
              className="input-field"
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              rows={3}
              style={{
                width: '100%',
                fontSize: '0.85rem',
                resize: 'none',
                marginBottom: '14px',
                borderRadius: '12px'
              }}
            />

            <button
              onClick={handleSend}
              className="btn btn-primary"
              style={{
                width: '100%',
                background: '#25D366',
                borderColor: '#25D366',
                color: '#ffffff',
                padding: '12px',
                borderRadius: '12px',
                fontSize: '0.9rem',
                gap: '8px'
              }}
            >
              <Send size={16} /> Open WhatsApp Chat
            </button>
          </div>
        </div>
      )}

      {/* Floating Trigger Button */}
      <button
        onClick={() => setOpen(!open)}
        className="pulse-glow"
        style={{
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          background: '#25D366',
          color: '#ffffff',
          border: 'none',
          boxShadow: '0 8px 24px rgba(37, 211, 102, 0.4)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'transform 0.2s ease'
        }}
      >
        {open ? <X size={26} /> : <MessageCircle size={28} />}
      </button>

    </div>
  );
}
