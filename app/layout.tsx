import type { Metadata } from "next";
import "./globals.css";
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/css/bootstrap.css";
import "./functions/bootstrap.css";
import NavBar from "./components/NavBar";
import BootstrapJS from "./lib/BootstrapJS";
import Footer from "./components/Footer";
import AuthHandler from "./components/AuthHandler";
import FontAwesomeLoader from "./lib/FontAwesomeLoader";
import PremiumExpiryChecker from "./components/PremiumExpiryChecker";
import Script from 'next/script'

export const metadata: Metadata = {
  metadataBase: new URL('https://tachysvps.com'),
  title: "Tachys VPS | Enterprise-Grade Virtual Private Servers",
  description: "Premium VPS hosting with 99.99% uptime, ultra-low latency, and 24/7 support. Specialized in Forex trading, gaming, web hosting, and development. Starting from $34/month with instant deployment across 200+ global locations.",
  applicationName: "Tachys VPS - Enterprise Virtual Private Server Solutions",
  // Enhanced keywords with more specific terms
  keywords: "VPS hosting, Forex VPS $34, trading servers, game hosting, web hosting, Windows VPS, Linux VPS, remote desktop VPS, low latency VPS, MT4 VPS, MT5 VPS, algorithmic trading VPS, DDoS protected VPS, NVMe VPS hosting, instant VPS deployment, managed VPS hosting, VPS control panel, high availability VPS, custom VPS solutions, enterprise VPS, global data centers, automated backups, 24/7 support, server monitoring, root access VPS, scalable VPS hosting",
  
  // Enhanced OpenGraph for better social sharing
  openGraph: {
    title: 'Tachys VPS | Premium Virtual Private Servers from $34/month',
    description: 'Enterprise-grade VPS hosting optimized for trading, gaming, and business. Ultra-low latency, 24/7 support, and global coverage with 99.99% uptime guarantee.',
    url: 'https://tachysvps.com',
    siteName: 'Tachys VPS',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/og-image.png', // Main sharing image
        width: 1200,
        height: 630,
        alt: 'Tachys VPS Dashboard Preview',
      },
      {
        url: '/og-logo.png', // Square logo for platforms that prefer it
        width: 500,
        height: 500,
        alt: 'Tachys VPS Logo',
      },
    ],
  },

  // Enhanced Twitter card
  twitter: {
    card: 'summary_large_image',
    title: 'Tachys VPS | Premium VPS from $34/month',
    description: 'Ultra-fast VPS hosting with global coverage. Ideal for trading, gaming, and business applications. Deploy instantly with 24/7 support.',
    creator: '@TachysVPS',
    images: ['/og-image.png'],
  },

  // Enhanced alternates for better SEO
  alternates: {
    canonical: '/',
    languages: {
      'en-US': '/en-us',
      'es-ES': '/es',
    },
  },

  // Enhanced robots directives
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'notranslate': false,
    },
  },

  // Additional metadata
  category: 'Technology',
  classification: 'Business & Technology > Web Services > VPS Hosting > Trading',
  referrer: 'origin-when-cross-origin',
  
  // Enhanced icons
  icons: {
    icon: [
      { url: '/favicon.png' },
      { url: '/favicon.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon.png', sizes: '192x192', type: 'image/png' },
    ],
    apple: [
      { url: '/favicon.png' },
      { url: '/favicon.png', sizes: '72x72' },
      { url: '/favicon.png', sizes: '144x144' },
    ],
  },

  other: {
    'google': 'notranslate',
    'theme-color': '#6B46C1',
    'format-detection': 'telephone=no',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'black-translucent',
    'apple-mobile-web-app-title': 'Tachys VPS',
  },
};

// npm install @fortawesome/fontawesome-svg-core @fortawesome/free-brands-svg-icons @fortawesome/free-regular-svg-icons @fortawesome/free-solid-svg-icons @fortawesome/react-fontawesome
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
        <Script
          id="hs-script-loader"
          src="//js-na2.hs-scripts.com/242112440.js"
          strategy="afterInteractive"
        />
        <FontAwesomeLoader />
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
        <PremiumExpiryChecker />
        {children}
        <Footer />
        <AuthHandler />
      </body>
    </html>
  );
}