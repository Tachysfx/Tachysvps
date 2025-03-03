"use client"

import React, { useState, useEffect } from "react";
import Image from 'next/image';
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../functions/firebase";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload, faTags, faStar } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';

interface Algo {
  id: string;
  name: string;
  type: string;
  description: string;
  platform: string;
  rating: number;
  ratingCount: number;
  buy_price: string;
  cost: string;
  app: {
    url: string;
    path: string;
  };
  image: {
    url: string;
    path: string;
  };
  lastUpdated: string;
  isLicensed?: boolean;
}

interface DownloadsData {
  downloads: Algo[];
  categories: string[];
  featuredDownloads: Algo[];
}

const ALGO_CATEGORIES = ["All", "Indicators", "Experts", "Utilities", "Libraries"];

const RatingStars = ({ rating }: { rating: number }) => (
  <div className="d-flex justify-content-center">
    {[...Array(5)].map((_, index) => (
      <FontAwesomeIcon
        key={index}
        icon={faStar}
        className={index < Math.round(rating) ? "text-warning" : ""}
      />
    ))}
  </div>
);

const AlgoCard = ({ algo }: { algo: Algo }) => (
  <div className="col-6 col-md-2 mb-2 px-1">
    <Link href={`/market/${algo.id}`} className="card-link">
      <div className="card hover-card">
        {/* Default View */}
        <div className="card-body product-card text-center p-0">
          <div className="product_badge">
            <span className="badge-new">{algo.platform}</span>
          </div>
          <Image
            src={algo.image.url}
            width={100}
            height={160}
            alt={algo.name}
            className="card-img-top"
          />
          <h5 className="card-title text-truncate">{algo.name}</h5>
          <RatingStars rating={algo.rating} />
          <div className="border mt-2">
            <p className="py-2 my-0 text-center">
              {algo.cost === "Free" ? "Free" : `$${algo.buy_price}`}
            </p>
          </div>
        </div>

        {/* Hover View */}
        <div className="card-body p-2 details-card">
          <div className="d-flex border-bottom border-2">
            <div className="d-flex flex-column align-items-center">
              <div className="d-flex align-items-center">
                <Image
                  src={algo.image.url}
                  width={30}
                  height={50}
                  alt={algo.name}
                  className="me-2"
                />
                <p className="mb-0">{algo.name}</p>
              </div>
              <div className="d-flex justify-content-evenly w-100">
                <span className="text-success">
                  {algo.rating} ({algo.ratingCount})
                </span>
                <span className="text-muted">{algo.type}</span>
              </div>
            </div>
          </div>
          <p className="mb-0 pb-0">
            {algo.description.length > 250
              ? `${algo.description.slice(0, 220)}...`
              : algo.description}
          </p>
        </div>
      </div>
    </Link>
  </div>
);

const EmptyState = () => (
  <div className="text-center py-12">
    <div className="bg-white rounded-2xl p-8 shadow-lg border border-purple-100 max-w-2xl mx-auto">
      <FontAwesomeIcon icon={faDownload} className="text-purple-300 text-6xl mb-4" />
      <h3 className="text-xl font-semibold text-purple-600 mb-2">No Downloads Available</h3>
      <p className="text-gray-600 mb-4 text-center">
        You haven&apos;t downloaded any algorithms yet. Check out our featured algorithms below or visit the marketplace.
      </p>
      <Link 
        href="/market" 
        className="inline-block px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200"
      >
        Browse Marketplace
      </Link>
    </div>
  </div>
);

const NoFeaturedState = () => (
  <div className="text-center py-8">
    <FontAwesomeIcon icon={faStar} className="text-purple-300 text-6xl mb-3" />
    <h3 className="text-lg font-semibold text-purple-600 mb-2">No Featured Algorithms</h3>
    <p className="text-gray-600 text-center">
      Check back later for featured trading algorithms.
    </p>
  </div>
);

export default function DownloadsPage() {
  const [loading, setLoading] = useState(true);
  const [downloadData, setDownloadData] = useState<DownloadsData>({
    downloads: [],
    categories: ALGO_CATEGORIES,
    featuredDownloads: []
  });
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    fetchDownloadsData();
  }, []);

  const fetchDownloadsData = async () => {
    try {
      const sessionUserString = sessionStorage.getItem("user");
      if (!sessionUserString) {
        toast.error("No user session found.");
        return;
      }

      const sessionUser = JSON.parse(sessionUserString);
      const userDoc = await getDoc(doc(db, "users", sessionUser.uid));
      
      if (!userDoc.exists()) {
        toast.error("User data not found");
        return;
      }

      // Get user's downloaded algo IDs
      const userData = userDoc.data();
      const downloadedAlgoIds = userData.downloads || [];

      let downloadedAlgos: Algo[] = [];
      
      if (downloadedAlgoIds.length > 0) {
        const downloadedAlgosPromises = downloadedAlgoIds.map(async (id: string) => {
          const algoDoc = await getDoc(doc(db, "algos", id));
          if (algoDoc.exists()) {
            const algoData = algoDoc.data();
            return {
              id: algoDoc.id,
              ...algoData,
              image: {
                url: algoData.image.url,
                path: algoData.image.path
              },
              app: {
                url: algoData.app.url,
                path: algoData.app.path
              },
              isLicensed: true
            } as Algo;
          }
          return null;
        });

        const resolvedAlgos = await Promise.all(downloadedAlgosPromises);
        downloadedAlgos = resolvedAlgos.filter((algo): algo is Algo => algo !== null);
      }

      // Fetch featured algos with the new structure
      const featuredDoc = await getDoc(doc(db, "featurealgos", "featured"));
      let featuredAlgos: Algo[] = [];
      
      if (featuredDoc.exists()) {
        const featuredData = featuredDoc.data();
        const featuredIds = featuredData.featured || [];

        if (featuredIds.length > 0) {
          const featuredAlgosPromises = featuredIds.map(async (id: string) => {
            const algoDoc = await getDoc(doc(db, "algos", id));
            if (algoDoc.exists()) {
              const algoData = algoDoc.data();
              return {
                id: algoDoc.id,
                ...algoData,
                image: {
                  url: algoData.image.url,
                  path: algoData.image.path
                },
                app: {
                  url: algoData.app.url,
                  path: algoData.app.path
                }
              } as Algo;
            }
            return null;
          });

          const resolvedFeaturedAlgos = await Promise.all(featuredAlgosPromises);
          featuredAlgos = resolvedFeaturedAlgos.filter((algo): algo is Algo => algo !== null);
        }
      }

      setDownloadData({
        downloads: downloadedAlgos,
        categories: ALGO_CATEGORIES,
        featuredDownloads: featuredAlgos
      });

    } catch (error) {
      console.error("Error fetching downloads data:", error);
      toast.error("Failed to fetch downloads data");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-white">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mb-4"></div>
          <p className="text-purple-600 font-medium">Loading Downloads...</p>
        </div>
      </div>
    );
  }

  const filteredDownloads = selectedCategory === "All" 
    ? downloadData.downloads 
    : downloadData.downloads.filter(item => item.type === selectedCategory);

  return (
    <div className="container mx-auto px-4 py-8 mb-5">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl p-6 mb-6 shadow-lg text-white">
        <h1 className="text-2xl font-bold mb-2">Downloads Center</h1>
        <p>Access your trading applications, tools, and resources in one place.</p>
      </div>

      {/* Categories Section */}
      <div className="bg-white rounded-2xl p-6 mb-6 shadow-sm border border-purple-100">
        <div className="flex items-center mb-4">
          <FontAwesomeIcon icon={faTags} className="text-purple-600 mr-2" />
          <h2 className="text-xl font-semibold text-purple-600">Categories</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          {ALGO_CATEGORIES.map((category) => (
            <button
              key={category}
              className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                selectedCategory === category
                  ? 'bg-purple-600 text-white'
                  : 'bg-purple-50 text-purple-600 hover:bg-purple-100'
              }`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Downloads Section */}
      {downloadData.downloads.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="row roows my-3 ms-2">
          {filteredDownloads.map((algo) => (
            <AlgoCard key={algo.id} algo={algo} />
          ))}
        </div>
      )}

      {/* Featured Downloads Section */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-purple-100">
        <h2 className="text-xl font-semibold text-purple-600 mb-4">Featured Downloads</h2>
      </div>
      {downloadData.featuredDownloads.length === 0 ? (
        <NoFeaturedState />
      ) : (
        <div className="row roows mt-3 ms-2">
          {downloadData.featuredDownloads.map((algo) => (
            <AlgoCard key={algo.id} algo={algo} />
          ))}
        </div>
      )}
    </div>
  );
}