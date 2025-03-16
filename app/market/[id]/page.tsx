import type { Metadata } from 'next';
import { fetchEnrichedAlgo, MarketFrontData, type EnrichedAlgo } from '../../lib/data';
import AlgoDetails from '../../components/AlgoDetails';

export async function generateMetadata({ params }: {params: Promise< {id: string}>}): Promise<Metadata> {
  const id = (await params).id;

  try {
    const enrichedAlgo = await fetchEnrichedAlgo(id);
    
    // Create keyword string from algorithm properties
    const keywords = [
      enrichedAlgo.name,
      enrichedAlgo.sellerName,
      'trading algorithm',
      'forex algorithm',
      'automated trading',
      'trading bot',
      'MT4 algorithm',
      'MT5 algorithm',
      'Tachys VPS',
      'TachysFX',
      // Use optional properties safely
      ...(enrichedAlgo.platform ? [enrichedAlgo.platform] : [])
    ].filter(Boolean).join(', ');
    
    return {
      title: `${enrichedAlgo.name} - Trading Algorithm | Tachys VPS`,
      description: enrichedAlgo.description || `Discover ${enrichedAlgo.name}, an innovative trading algorithm by ${enrichedAlgo.sellerName}. Get detailed performance metrics, backtest results, and start using this algorithm on Tachys VPS.`,
      keywords: keywords,
      openGraph: {
        title: `${enrichedAlgo.name} - Trading Algorithm`,
        description: enrichedAlgo.description || `Discover ${enrichedAlgo.name}, an innovative trading algorithm by ${enrichedAlgo.sellerName}. View performance metrics and start trading.`,
        url: `https://tachysvps.com/market/${id}`,
        siteName: 'Tachys VPS Algo Market',
        images: [
          {
            url: enrichedAlgo.image || '/placeholder.png',
            width: 1200,
            height: 630,
            alt: `${enrichedAlgo.name} Algorithm`,
          }
        ],
        locale: 'en_US',
        type: 'article',
      },
      twitter: {
        card: 'summary_large_image',
        title: `${enrichedAlgo.name} - Trading Algorithm`,
        description: enrichedAlgo.description || `Discover ${enrichedAlgo.name} by ${enrichedAlgo.sellerName}`,
        images: [enrichedAlgo.image || '/placeholder.png'],
      },
      robots: {
        index: true,
        follow: true,
        'max-snippet': -1,
        'max-image-preview': 'large',
        'max-video-preview': -1,
      },
      alternates: {
        canonical: `https://tachysvps.com/market/${id}`,
      },
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Algorithm Details - Tachys VPS',
      description: 'View algorithm details',
      robots: {
        index: false,
        follow: true,
      },
    };
  }
}

export default async function Page({ params }: {params: Promise< {id: string}>}) {
  try {
    const enrichedAlgo = await fetchEnrichedAlgo((await params).id);
    const enrichedAlgos = await MarketFrontData();

    return (
      <AlgoDetails
        enrichedAlgo={enrichedAlgo}
        enrichedAlgos={enrichedAlgos}
        id={(await params).id}
      />
    );
  } catch (error) {
    console.error('Error:', error);
    return <div>Error loading algorithm details</div>
    ;
  }
}
