import type { Metadata } from "next";
import "./globals.css";
import { SplashScreen } from '@/components/layout/SplashScreen';
import { LanguageProvider } from '@/context/LanguageContext';
import { WhatsAppSupport } from '@/components/layout/WhatsAppSupport';

export const metadata: Metadata = {
  title: "Royal Supermarket | Freshness Delivered to Your Doorstep",
  description: "Royal Supermarket online grocery platform",
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
          {children}
          <WhatsAppSupport />
        </LanguageProvider>
      </body>
    </html>
  );
}
