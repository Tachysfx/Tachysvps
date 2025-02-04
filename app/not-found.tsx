import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next'


export const metadata: Metadata = {
  title: "Tachys VPS",
  description: "Experience lightning-fast VPS hosting with unmatched security and 24/7 support. Perfect for developers, businesses, and anyone needing scalable, reliable infrastructure.",
  applicationName: "High-Performance VPS Hosting",
  keywords: "Algo Market, Tachys VPS, Forex VPS hosting, Forex trading servers, low-latency Forex VPS, secure Forex VPS, fast VPS for Forex, trading server hosting, Forex VPS solutions, high-speed trading VPS, optimized VPS for Forex, dedicated Forex VPS, low ping Forex VPS, Forex VPS with SSD, MT4 VPS hosting, MetaTrader VPS, reliable Forex VPS, VPS for Forex brokers, Forex server uptime, premium Forex VPS, latency-optimized VPS, trading VPS infrastructure, VPS for financial markets, VPS with instant setup, customizable Forex VPS, 24/7 Forex VPS support, high-performance trading VPS, Forex VPS for EAs, stable VPS for Forex",
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
};



export default function NotFound() {
  return (
    <>
        <section className="text-center flex flex-col justify-center items-center h-96 my-5">
          <Image
            src='/warnings.png'
            width={250}
            height={250}
            alt="blur"
            className='img-fluid'
          />
          <h1 className="text-6xl font-bold mb-4">Page Not Found</h1>
          <p className="text-xl mb-3">This page does not exist</p>
          <Link href="/" className="my-4 btn btn-purple">Go Back</Link>
        </section>
    </>
  )
}
