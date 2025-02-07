import type { Metadata } from "next";
import "./globals.css";
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import "bootstrap/dist/css/bootstrap.min.css";
import "./functions/bootstrap.css";
import "bootstrap/dist/css/bootstrap.css";
import NavBar from "./components/NavBar";
import BootstrapJS from "./lib/BootstrapJS";
import Footer from "./components/Footer";
import AuthHandler from "./components/AuthHandler";


export const metadata: Metadata = {
  title: "Tachys FX",
  description: "Experience lightning-fast VPS hosting with unmatched security and 24/7 support. Perfect for developers, businesses, and anyone needing scalable, reliable infrastructure.",
  applicationName: "High-Performance VPS Hosting",
  keywords: "FOREX, Tachys VPS, Forex VPS hosting, Forex trading servers, low-latency Forex VPS, secure Forex VPS, fast VPS for Forex, trading server hosting, Forex VPS solutions, high-speed trading VPS, optimized VPS for Forex, dedicated Forex VPS, low ping Forex VPS, Forex VPS with SSD, MT4 VPS hosting, MetaTrader VPS, reliable Forex VPS, VPS for Forex brokers, Forex server uptime, premium Forex VPS, latency-optimized VPS, trading VPS infrastructure, VPS for financial markets, VPS with instant setup, customizable Forex VPS, 24/7 Forex VPS support, high-performance trading VPS, Forex VPS for EAs, stable VPS for Forex",
  icons: {
    icon: '/favicon.png',
    shortcut: '/favicon.png',
    apple: '/favicon.png',
    other: [
      {
        rel: 'icon',
        url: '/favicon.png',
        sizes: '192x192',
      },
      {
        rel: 'icon',
        url: '/favicon.png',
        sizes: '512x512',
      },
    ],
  },
  other: {
    'google': 'notranslate',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="google" content="notranslate" />
        <meta httpEquiv="Content-Language" content="en" />
      </head>
      <body className="antialiased bg-gray-100">
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
        <BootstrapJS />
        <NavBar />
        {children}
        <Footer />
        <AuthHandler />
      </body>
    </html>
  );
}