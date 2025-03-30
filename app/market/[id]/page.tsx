import type { Metadata } from 'next';
import { fetchEnrichedAlgo, MarketFrontData, type EnrichedAlgo } from '../../lib/data';
import AlgoDetails from '../../components/AlgoDetails';

export async function generateMetadata({ params }: {params: Promise< {id: string}>}): Promise<Metadata> {
  const id = (await params).id;

  try {
    const enrichedAlgo = await fetchEnrichedAlgo(id);
    return {
      title: `${enrichedAlgo.name} - Tachys VPS Algo`,
      description: enrichedAlgo.description || `Discover ${enrichedAlgo.name}, an innovative trading algorithm brought to you by ${enrichedAlgo.sellerName}.`,
      openGraph: {
        title: enrichedAlgo.name,
        description: enrichedAlgo.description || 'Algorithm details',
        images: [enrichedAlgo.image],
      },
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Algorithm Details - Tachys VPS',
      description: 'View algorithm details',
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
