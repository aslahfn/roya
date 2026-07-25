import type { Metadata, Viewport } from "next";
import "./globals.css";
import { SplashScreen } from '@/components/layout/SplashScreen';
import { LanguageProvider } from '@/context/LanguageContext';
import { WhatsAppSupport } from '@/components/layout/WhatsAppSupport';
import { MobileNav } from '@/components/layout/MobileNav';

export const metadata: Metadata = {
  title: "Royal Supermarket | Mobile Grocery Delivery",
  description: "Royal Supermarket online mobile grocery platform",
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
          <SplashScreen />
          <div className="mobile-app-wrapper has-bottom-nav">
            {children}
            <WhatsAppSupport />
            <MobileNav />
          </div>
        </LanguageProvider>
      </body>
    </html>
  );
}
