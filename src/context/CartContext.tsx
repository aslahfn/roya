'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  unit: string;
  image?: string;
  category?: string;
}

interface CartContextType {
  items: CartItem[];
  totalQuantity: number;
  subtotal: number;
  addToCart: (product: { id: string; name: string; price: number; unit?: string; image?: string; category?: string }, imgElementRef?: HTMLElement | null) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, delta: number) => void;
  clearCart: () => void;
  isBouncing: boolean;
  toastMessage: string | null;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isBouncing, setIsBouncing] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Load cart from localStorage
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('roya_cart_items');
      if (savedCart) {
        setItems(JSON.parse(savedCart));
      }
    } catch (e) {
      console.error('Failed to load cart', e);
    }
  }, []);

  // Save cart to localStorage
  const saveCart = (newItems: CartItem[]) => {
    setItems(newItems);
    try {
      localStorage.setItem('roya_cart_items', JSON.stringify(newItems));
    } catch (e) {
      console.error('Failed to save cart', e);
    }
  };

  const triggerBadgeBounce = () => {
    setIsBouncing(true);
    setTimeout(() => setIsBouncing(false), 600);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const animateFlyingImage = (sourceEl: HTMLElement | null, imgSrc: string) => {
    if (!sourceEl) return;
    const cartTarget = document.getElementById('header-cart-icon');
    if (!cartTarget) return;

    const sourceRect = sourceEl.getBoundingClientRect();
    const targetRect = cartTarget.getBoundingClientRect();

    const flyer = document.createElement('img');
    flyer.src = imgSrc || '/logo.jpg';
    flyer.style.position = 'fixed';
    flyer.style.left = `${sourceRect.left + sourceRect.width / 2 - 25}px`;
    flyer.style.top = `${sourceRect.top + sourceRect.height / 2 - 25}px`;
    flyer.style.width = '50px';
    flyer.style.height = '50px';
    flyer.style.borderRadius = '50%';
    flyer.style.objectFit = 'cover';
    flyer.style.zIndex = '9999';
    flyer.style.pointerEvents = 'none';
    flyer.style.boxShadow = '0 8px 20px rgba(22, 163, 74, 0.4)';
    flyer.style.transition = 'all 0.7s cubic-bezier(0.2, 0.9, 0.3, 1)';

    document.body.appendChild(flyer);

    requestAnimationFrame(() => {
      flyer.style.left = `${targetRect.left + targetRect.width / 2 - 15}px`;
      flyer.style.top = `${targetRect.top + targetRect.height / 2 - 15}px`;
      flyer.style.width = '30px';
      flyer.style.height = '30px';
      flyer.style.opacity = '0.3';
      flyer.style.transform = 'scale(0.5) rotate(360deg)';
    });

    setTimeout(() => {
      if (document.body.contains(flyer)) {
        document.body.removeChild(flyer);
      }
      triggerBadgeBounce();
    }, 700);
  };

  const addToCart = (
    product: { id: string; name: string; price: number; unit?: string; image?: string; category?: string },
    imgElementRef?: HTMLElement | null
  ) => {
    const existingIndex = items.findIndex((i) => i.id === product.id);
    let updated: CartItem[];

    if (existingIndex > -1) {
      updated = [...items];
      updated[existingIndex].quantity += 1;
    } else {
      updated = [
        ...items,
        {
          id: product.id,
          name: product.name,
          price: product.price,
          quantity: 1,
          unit: product.unit || 'Piece',
          image: product.image || '/logo.jpg',
          category: product.category,
        },
      ];
    }

    saveCart(updated);
    animateFlyingImage(imgElementRef || null, product.image || '/logo.jpg');
    showToast('Item Added to Cart');
  };

  const removeFromCart = (id: string) => {
    const updated = items.filter((item) => item.id !== id);
    saveCart(updated);
    triggerBadgeBounce();
  };

  const updateQuantity = (id: string, delta: number) => {
    const updated = items
      .map((item) => {
        if (item.id === id) {
          const newQty = item.quantity + delta;
          return newQty > 0 ? { ...item, quantity: newQty } : null;
        }
        return item;
      })
      .filter(Boolean) as CartItem[];

    saveCart(updated);
    triggerBadgeBounce();
  };

  const clearCart = () => {
    saveCart([]);
  };

  const totalQuantity = items.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        totalQuantity,
        subtotal,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isBouncing,
        toastMessage,
      }}
    >
      {children}

      {/* Floating Success Toast */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          bottom: '80px',
          right: '24px',
          background: 'linear-gradient(135deg, #16A34A 0%, #15803D 100%)',
          color: '#ffffff',
          padding: '14px 22px',
          borderRadius: '16px',
          fontWeight: 800,
          fontSize: '0.92rem',
          boxShadow: '0 10px 30px rgba(22, 163, 74, 0.4)',
          zIndex: 10000,
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          animation: 'slideUpToast 0.3s ease-out',
          border: '1.5px solid #dcfce7'
        }}>
          <span>🛒</span>
          <span>{toastMessage}</span>
          <style>{`
            @keyframes slideUpToast {
              from { transform: translateY(20px); opacity: 0; }
              to { transform: translateY(0); opacity: 1; }
            }
          `}</style>
        </div>
      )}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
