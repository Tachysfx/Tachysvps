import { fetchEnrichedAlgo } from "../../../lib/Details";
import { Metadata } from "next";
import DownloadComponent from './DownloadComponent';

export async function generateMetadata({ params }: {params: Promise< {id: string}>}): Promise<Metadata> {
  try {
    const enrichedAlgo = await fetchEnrichedAlgo((await params).id);

    return {
      title: `Download ${enrichedAlgo.name}`,
      description: `Discover ${enrichedAlgo.name}, an innovative trading algorithm brought to you by ${enrichedAlgo.sellerName}.`,
      applicationName: enrichedAlgo.name,
      keywords: enrichedAlgo.name,
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
  } catch (error) {
    console.error("Error fetching metadata:", error);
    return {
      title: "Error",
      description: "Failed to load metadata for this page.",
    };
  }
}

export default async function Page({ params }: {params: Promise< {id: string}>}) {
  try {
    const enrichedAlgo = await fetchEnrichedAlgo((await params).id);
    
    // Prevent direct access to premium algo download without payment
    if (enrichedAlgo.cost === "Premium" && !enrichedAlgo.paid) {
      // Instead of redirect, return an error component
      return (
        <div className="container py-5">
          <div className="bg-white rounded-lg shadow-lg p-5 text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h2>
            <p className="mb-4">This is a premium algorithm. Please purchase it before downloading.</p>
            <a href={`/market/${(await params).id}`} className="btn btn-purple">
              Go to Purchase Page
            </a>
          </div>
        </div>
      );
    }

    return <DownloadComponent algo={enrichedAlgo} id={(await params).id} />;
  } catch (error) {
    console.error("Error rendering page:", error);
    return (
      <div className="container py-5 text-center text-red-600">
        Error loading details for ID: {(await params).id}
      </div>
    );
  }
}
