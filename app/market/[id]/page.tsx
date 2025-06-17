import type { Metadata } from 'next';
import { fetchEnrichedAlgo, MarketFrontData, type EnrichedAlgo } from '../../lib/data';
import AlgoDetails from '../../components/AlgoDetails';
import { cookies } from 'next/headers';

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

export default async function Page({ params, searchParams }: {params: Promise< {id: string}>, searchParams: Promise<{ [key: string]: string | string[] | undefined }>}) {
  try {
    const id = (await params).id;
    const enrichedAlgo = await fetchEnrichedAlgo(id);
    const enrichedAlgos = await MarketFrontData();

    // Check for payment status in URL parameters
    const resolvedSearchParams = await searchParams;
    const paymentStatus = resolvedSearchParams.status;
    const paymentId = resolvedSearchParams.payment_id;

    // If we have payment parameters, verify the payment status
    if (paymentStatus && paymentId) {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/payment/verify`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            paymentId,
            status: paymentStatus,
            algoId: id
          }),
        });

        if (!response.ok) {
          console.error('Payment verification failed');
        }
      } catch (error) {
        console.error('Error verifying payment:', error);
      }
    }

    return (
      <AlgoDetails
        enrichedAlgo={enrichedAlgo}
        enrichedAlgos={enrichedAlgos}
        id={id}
      />
    );
  } catch (error) {
    console.error('Error:', error);
    return <div>Error loading algorithm details</div>;
  }
}
