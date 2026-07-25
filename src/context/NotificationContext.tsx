'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface AppNotification {
  id: string;
  roleTarget: 'ADMIN' | 'CUSTOMER' | 'ALL';
  title: string;
  message: string;
  type: string;
  data?: any;
  read: boolean;
  createdAt: string;
}

interface NotificationContextType {
  notifications: AppNotification[];
  unreadCount: number;
  addNotification: (notif: Omit<AppNotification, 'id' | 'read' | 'createdAt'>) => void;
  markAsRead: (id: string) => void;
  activePopup: AppNotification | null;
  dismissPopup: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<AppNotification[]>([
    {
      id: 'notif-1',
      roleTarget: 'ADMIN',
      title: '📦 New Order Received #ORD-9901',
      message: 'Dave Customer placed an order worth AED 48.50',
      type: 'NEW_ORDER',
      data: {
        customerName: 'Dave Customer',
        orderNumber: 'ORD-9901',
        totalAmount: 48.50,
        paymentMethod: 'Cash on Delivery',
        deliveryAddress: 'King Fahd Road, Riyadh',
        orderTime: 'Just now'
      },
      read: false,
      createdAt: new Date().toISOString()
    }
  ]);

  const [activePopup, setActivePopup] = useState<AppNotification | null>(null);

  const addNotification = (notif: Omit<AppNotification, 'id' | 'read' | 'createdAt'>) => {
    const newNotif: AppNotification = {
      ...notif,
      id: `notif-${Date.now()}`,
      read: false,
      createdAt: new Date().toISOString()
    };

    setNotifications(prev => [newNotif, ...prev]);
    setActivePopup(newNotif);
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const dismissPopup = () => {
    setActivePopup(null);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        addNotification,
        markAsRead,
        activePopup,
        dismissPopup
      }}
    >
      {children}

      {/* Real-time Order Popup Modal for Admin & Customer */}
      {activePopup && (
        <div style={{
          position: 'fixed',
          top: '24px',
          right: '24px',
          maxWidth: '420px',
          width: '90%',
          background: 'linear-gradient(135deg, #0A4D2E 0%, #063821 100%)',
          color: '#ffffff',
          borderRadius: '20px',
          padding: '20px',
          boxShadow: '0 16px 40px rgba(0,0,0,0.3)',
          zIndex: 11000,
          border: '1.5px solid #FFB800',
          animation: 'popIn 0.35s cubic-bezier(0.18, 0.89, 0.32, 1.28)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.72rem', fontWeight: 900, background: '#FFB800', color: '#0A4D2E', padding: '2px 8px', borderRadius: '10px' }}>
              NOTIFICATION ALERT
            </span>
            <button
              onClick={dismissPopup}
              style={{ background: 'none', border: 'none', color: '#ffffff', cursor: 'pointer', fontSize: '1rem' }}
            >
              ✕
            </button>
          </div>

          <h4 style={{ fontSize: '1.05rem', fontWeight: 800, margin: '4px 0 6px', color: '#FFB800' }}>
            {activePopup.title}
          </h4>
          <p style={{ fontSize: '0.86rem', color: '#e2e8f0', margin: '0 0 12px', lineHeight: 1.4 }}>
            {activePopup.message}
          </p>

          {activePopup.data && (
            <div style={{ background: 'rgba(255,255,255,0.1)', padding: '12px', borderRadius: '12px', fontSize: '0.78rem', color: '#dcfce7' }}>
              <div><strong>Customer:</strong> {activePopup.data.customerName || 'N/A'}</div>
              <div><strong>Total Amount:</strong> AED {activePopup.data.totalAmount?.toFixed(2) || '0.00'}</div>
              <div><strong>Address:</strong> {activePopup.data.deliveryAddress || 'N/A'}</div>
            </div>
          )}

          <style>{`
            @keyframes popIn {
              from { transform: scale(0.8) translateY(-20px); opacity: 0; }
              to { transform: scale(1) translateY(0); opacity: 1; }
            }
          `}</style>
        </div>
      )}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider');
  }
  return context;
}
