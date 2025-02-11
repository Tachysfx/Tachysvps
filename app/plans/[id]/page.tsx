import type { Metadata } from 'next';
import Link from 'next/link';
import Pay from '../../components/Pay';
import type { PlanKey } from '../../types';

export const metadata: Metadata = {
    title: "High-Performance VPS Hosting",
    description: "Experience lightning-fast VPS hosting with unmatched security and 24/7 support. Perfect for developers, businesses, and anyone needing scalable, reliable infrastructure.",
    applicationName: "Tachys VPS",
    keywords: "Tachys VPS, Forex VPS hosting, Forex trading servers, low-latency Forex VPS, secure Forex VPS, fast VPS for Forex, trading server hosting, Forex VPS solutions, high-speed trading VPS, optimized VPS for Forex, dedicated Forex VPS, low ping Forex VPS, Forex VPS with SSD, MT4 VPS hosting, MetaTrader VPS, reliable Forex VPS, VPS for Forex brokers, Forex server uptime, premium Forex VPS, latency-optimized VPS, trading VPS infrastructure, VPS for financial markets, VPS with instant setup, customizable Forex VPS, 24/7 Forex VPS support, high-performance trading VPS, Forex VPS for EAs, stable VPS for Forex",
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

// Add type validation function
const isValidPlanKey = (id: string): id is PlanKey => {
  const validPlans: PlanKey[] = ["lite", "basic", "standard", "ultra", "dedicated"];
  return validPlans.includes(id as PlanKey);
};

export default async function Page({ params }: {params: Promise< {id: string}>}) {
  const { id } = (await params);
  
  if (!isValidPlanKey(id)) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold text-red-600">Invalid Plan Selected</h1>
        <p className="mt-4 text-gray-600">Please select a valid plan from our offerings.</p>
        <Link 
          href="/plans" 
          className="mt-6 inline-block px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
        >
          View Available Plans
        </Link>
      </div>
    );
  }

  // Now TypeScript knows id is PlanKey type due to type guard
  return (
    <>
      <div className="container">
        <div className="text-center my-3 bg-purple py-12 px-4 rounded-2xl shadow-lg">
          <h1 className="text-4xl font-bold text-white tracking-tight">
            VPS Plans
          </h1>
        </div>
        <Pay plan={id} />
      </div>
    </>
  );
}
