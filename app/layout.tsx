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

export const metadata: Metadata = {
  title: "Tachys VPS | High-Performance Virtual Private Servers",
  description: "Experience enterprise-grade VPS hosting with 99.99% uptime, ultra-low latency, and 24/7 support. Perfect for web hosting, trading, gaming servers, development, databases, and business applications. Deploy instantly with global data center coverage.",
  applicationName: "Tachys VPS - Enterprise Virtual Private Server Solutions",
  keywords: "VPS hosting, virtual private server, cloud hosting, web hosting, game server hosting, trading VPS, development server, database hosting, remote desktop VPS, managed VPS, high-performance VPS, secure VPS hosting, low latency VPS, SSD VPS hosting, scalable VPS, reliable VPS hosting, business VPS solutions, instant VPS deployment, automated backups, DDoS protection, global data centers, Windows VPS, Linux VPS, VPS control panel, dedicated resources, enterprise VPS, 24/7 VPS support, server monitoring, high availability VPS, custom VPS solutions, VPS with root access",
  authors: [{ name: "Tachys VPS" }],
  creator: "Tachys VPS",
  publisher: "Tachys VPS",
  formatDetection: {
    telephone: false,
    email: false,
    address: false,
  },
  metadataBase: new URL('https://tachysvps.com'),
  alternates: {
    canonical: '/',
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
  openGraph: {
    title: 'Tachys VPS | Enterprise-Grade Virtual Private Servers',
    description: 'High-performance VPS hosting with global coverage. Ideal for web hosting, trading, gaming, development, and business applications. Deploy instantly with 24/7 support.',
    url: 'https://tachysvps.com',
    siteName: 'Tachys VPS',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tachys VPS | Enterprise Virtual Private Servers',
    description: 'Professional VPS hosting with global coverage. Perfect for web hosting, trading, gaming, development, and business applications.',
    creator: '@TachysVPS',
  },
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
  verification: {
    google: 'google-site-verification-code',
    yandex: 'yandex-verification-code',
    other: {
      'facebook-domain-verification': 'facebook-verification-code',
    },
  },
  other: {
    'google': 'notranslate',
    'theme-color': '#6B46C1', // Purple theme color
    'msapplication-TileColor': '#6B46C1',
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