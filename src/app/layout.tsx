import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import { AuthProvider } from "@/context/AuthContext";
import "./globals.css";
import { LenisProvider } from "@/context/LenisProvider";
import { SidebarProvider } from '@/context/SidebarContext'
import Script from 'next/script';

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-nunito",
});

export const metadata: Metadata = {
  title: {
    default: process.env.NEXT_PUBLIC_APP_NAME || 'Ai-Trader',
    template: `%s | ${process.env.NEXT_PUBLIC_APP_NAME || 'Ai-Trader'}`
  },
  description: `${process.env.NEXT_PUBLIC_APP_NAME || 'Ai-Trader'} is a crypto based AI Trading and MultiChain Wallet Platform that allows you to make crypto transactions easily and invest in crypto`,
  keywords: ['crypto trading', 'AI trading', 'cryptocurrency', 'bitcoin', 'ethereum', 'blockchain', 'digital assets', 'crypto wallet', 'investment platform', 'crypto investment'],
  authors: [{ name: process.env.NEXT_PUBLIC_APP_NAME || 'Ai-Trader' }],
  creator: process.env.NEXT_PUBLIC_APP_NAME || 'Ai-Trader',
  publisher: process.env.NEXT_PUBLIC_APP_NAME || 'Ai-Trader',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://Ai-Trader.com',
    title: process.env.NEXT_PUBLIC_APP_NAME || 'Ai-Trader',
    description: `${process.env.NEXT_PUBLIC_APP_NAME || 'Ai-Trader'} - Advanced Crypto Trading Platform with AI`,
    siteName: process.env.NEXT_PUBLIC_APP_NAME || 'Ai-Trader',
    images: [{
      url: '/og.png',
      width: 1200,
      height: 630,
      alt: 'Ai Crypto Trading and Wallet Platform Preview',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: process.env.NEXT_PUBLIC_APP_NAME || 'Ai-Trader',
    description: `${process.env.NEXT_PUBLIC_APP_NAME || 'Ai-Trader'} - Advanced Crypto Trading Platform with AI`,
    images: ['/og.png'],
    creator: '@Ai-Trader',
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
  verification: {
    google: 'your-google-site-verification',
  },
  alternates: {
    canonical: process.env.NEXT_PUBLIC_SITE_URL,
  },
};



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const widget_id = process.env.NEXT_PUBLIC_SUPPORT_WIDGET_ID?.trim();
  return (
    <html lang="en">
      <body className={`${nunito.variable} font-sans antialiased`}>
        <AuthProvider>
          <SidebarProvider>
            <LenisProvider>{children}</LenisProvider>
          </SidebarProvider>
        </AuthProvider>
        {widget_id && widget_id.length > 0 && (
          <Script
            src={`//code.jivosite.com/widget/${widget_id}`}
            strategy="afterInteractive"
          />
        )}
      </body>
    </html>
  );
}
