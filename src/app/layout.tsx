import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/context/Providers";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Neuronova - Advancing Scientific Discovery",
  description: "Cutting-edge platform for scientific discovery in neurotech and healthcare",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark w-full" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased bg-slate-900 text-slate-100 min-h-screen w-full overflow-x-hidden`} suppressHydrationWarning>
        <Providers>
          <div className="min-h-screen flex flex-col bg-slate-900 w-full">
            <Header />
            <main className="flex-1 bg-slate-900 w-full">
              {children}
            </main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
