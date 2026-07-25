import type { Metadata, Viewport } from "next";
import "./globals.css";
import { SplashScreen } from '@/components/layout/SplashScreen';
import { LanguageProvider } from '@/context/LanguageContext';
import { CartProvider } from '@/context/CartContext';
import { NotificationProvider } from '@/context/NotificationContext';
import { WhatsAppSupport } from '@/components/layout/WhatsAppSupport';
import { MobileNav } from '@/components/layout/MobileNav';

export const metadata: Metadata = {
  title: "ROYA Supermarket | Online Grocery Ordering",
  description: "Roya Supermarket production-ready online grocery platform",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <LanguageProvider>
          <CartProvider>
            <NotificationProvider>
              <SplashScreen />
              <div className="mobile-app-wrapper has-bottom-nav">
                {children}
                <WhatsAppSupport />
                <MobileNav />
              </div>
            </NotificationProvider>
          </CartProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
