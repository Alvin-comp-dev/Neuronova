import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/context/Providers";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { PerformanceMonitor } from "@/components/common/PerformanceMonitor";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  title: {
    default: "Neuronova - Advancing Scientific Discovery",
    template: "%s | Neuronova"
  },
  description: "Cutting-edge platform for scientific discovery in neurotech and healthcare. Discover breakthrough research, connect with experts, and advance human knowledge.",
  keywords: ["neuroscience", "research", "healthcare", "AI", "biotechnology", "scientific discovery"],
  authors: [{ name: "Neuronova Team" }],
  creator: "Neuronova",
  publisher: "Neuronova",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://neuronova.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://neuronova.com',
    title: 'Neuronova - Advancing Scientific Discovery',
    description: 'Cutting-edge platform for scientific discovery in neurotech and healthcare',
    siteName: 'Neuronova',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Neuronova - Advancing Scientific Discovery',
    description: 'Cutting-edge platform for scientific discovery in neurotech and healthcare',
  },
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
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        {/* Preload critical resources */}
        <link rel="preload" href="/brain-logo.svg" as="image" type="image/svg+xml" />
        <link rel="preconnect" href="https://images.unsplash.com" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
        
        {/* Favicon and app icons */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        
        {/* Theme color */}
        <meta name="theme-color" content="#1e293b" />
      </head>
      <body className={`${inter.className} antialiased`}>
        <Providers>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
          {/* Performance monitoring - only in development or when enabled */}
          {(process.env.NODE_ENV === 'development' || process.env.NEXT_PUBLIC_ENABLE_PERF_MONITORING === 'true') && (
            <PerformanceMonitor />
          )}
        </Providers>
      </body>
    </html>
  );
}
