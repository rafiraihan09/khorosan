import './globals.css';
import type { Metadata } from 'next';
import { Inter, Orbitron } from 'next/font/google';
import Navigation from '@/components/layout/Navigation';
import Footer from '@/components/layout/Footer';
import { AuthProvider } from '@/contexts/AuthContext';
import { CartProvider } from '@/contexts/CartContext';
import { WishlistProvider } from '@/contexts/WishlistContext';
import { Suspense } from 'react';

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const orbitron = Orbitron({
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '700', '900'],
  variable: '--font-orbitron',
});

export const metadata: Metadata = {
  title: 'Khorosan - Premium Clothing Brand',
  description: 'Discover premium clothing from Khorosan. Mountain Range, Artillery Range, and Outer Wear collections.',
  keywords: 'clothing, fashion, premium, khorosan, mountain range, artillery range, outer wear',
};

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-white">Loading...</div>
    </div>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${orbitron.variable}`}>
      <head>
        {/* Overspray Font from CDN Fonts */}
        <link href="https://fonts.cdnfonts.com/css/overspray" rel="stylesheet" />
      </head>
      <body className={`${inter.className} antialiased`}>
        <Suspense fallback={<LoadingFallback />}>
          <AuthProvider>
            <CartProvider>
              <WishlistProvider>
                <Navigation />
                <main className="min-h-screen">
                  <Suspense fallback={<LoadingFallback />}>
                    {children}
                  </Suspense>
                </main>
                <Footer />
              </WishlistProvider>
            </CartProvider>
          </AuthProvider>
        </Suspense>
      </body>
    </html>
  );
}