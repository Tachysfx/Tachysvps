"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Star } from "lucide-react";
import AdvancedSearch from "./Filter";
import { Algo } from "../types/index";

type MarketClientProps = {
  enrichedAlgos: Algo[];
};

const ITEMS_PER_PAGE = 18; // Reduced to show 12 items per section

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
              src={algo.image || '/placeholder.png'}
              width={100}
              height={160}
              alt={algo.name}
              className="card-img-top"
            />
            <h5 className="card-title text-truncate mx-1 text-center">{algo.name}</h5>
            <div className="d-flex justify-content-center">
              {[...Array(5)].map((_, index) => (
                <Star
                  key={index}
                  size={16}
                  className={index < Math.round(Number(algo.rating)) ? "text-warning" : "text-gray-300"}
                  fill={index < Math.round(Number(algo.rating)) ? "currentColor" : "none"}
                />
              ))}
            </div>
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
                    src={algo.image || '/placeholder.png'}
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

export default function MarketClient({ enrichedAlgos }: MarketClientProps) {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeFilter, setActiveFilter] = useState<string>("All Algos");
  const [topPerformersPage, setTopPerformersPage] = useState<number>(1);
  const [newAppsPage, setNewAppsPage] = useState<number>(1);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // New Trading Applications Section - Sorting and Filtering
  const newTradingApps = useMemo(() => {
    const externalApps = enrichedAlgos.filter(algo => algo.identity === "Internal");
    
    if (!externalApps.length) return [];

    return externalApps.sort((a, b) => {
      // Sort by date first (newest first)
      const dateA = new Date(a.uploaded).getTime();
      const dateB = new Date(b.uploaded).getTime();
      if (dateB !== dateA) return dateB - dateA;

      // Then by downloads
      if (b.downloads !== a.downloads) return b.downloads - a.downloads;
      
      // Then by rating count
      if (b.ratingCount !== a.ratingCount) return b.ratingCount - a.ratingCount;
      
      // Finally by rating
      if (b.rating !== a.rating) return b.rating - a.rating;
      
      return 0;
    });
  }, [enrichedAlgos]);

  // Paginated new trading apps
  const paginatedNewApps = useMemo(() => {
    return newTradingApps.slice(
      (newAppsPage - 1) * ITEMS_PER_PAGE, 
      newAppsPage * ITEMS_PER_PAGE
    );
  }, [newTradingApps, newAppsPage]);

  // Calculate total pages for new apps
  const totalNewAppsPages = Math.ceil(newTradingApps.length / ITEMS_PER_PAGE);

  // Top Performers Section - Sorting Logic
  const topPerformers = useMemo(() => {
    if (!isMounted) return [...enrichedAlgos];

    // First, sort by rating count and rating
    const sorted = [...enrichedAlgos].sort((a, b) => {
      if (b.ratingCount !== a.ratingCount) return b.ratingCount - a.ratingCount;
      if (b.rating !== a.rating) return b.rating - a.rating;
      return 0;
    });

    // Take top 30 and randomize them while preserving rating count groups
    const top30 = sorted.slice(0, 30);
    const groupedByRatingCount = top30.reduce<Record<number, Algo[]>>((groups, algo) => {
      if (!groups[algo.ratingCount]) groups[algo.ratingCount] = [];
      groups[algo.ratingCount].push(algo);
      return groups;
    }, {});

    // Randomize within each rating count group
    const randomizedTop30 = Object.values(groupedByRatingCount)
      .map(group => 
        group
          .map(item => ({ item, sort: Math.random() }))
          .sort((a, b) => a.sort - b.sort)
          .map(({ item }) => item)
      )
      .flat();

    // Combine randomized top 30 with the rest of the sorted list
    return [...randomizedTop30, ...sorted.slice(30)];
  }, [enrichedAlgos, isMounted]);

  // Filter and search functionality
  const filteredTopPerformers = useMemo(() => {
    return topPerformers.filter((algo) => {
      const matchesSearch =
        algo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        algo.platform.toLowerCase().includes(searchQuery.toLowerCase()) ||
        algo.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
        algo.sellerName.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesFilter =
        activeFilter === "All Algos" ||
        (activeFilter === "Free Algos" && algo.cost === "Free") ||
        (activeFilter === "Premium Algos" && algo.cost === "Premium");

      return matchesSearch && matchesFilter;
    });
  }, [topPerformers, searchQuery, activeFilter]);

  // Paginated top performers
  const paginatedTopPerformers = useMemo(() => {
    return filteredTopPerformers.slice(
      (topPerformersPage - 1) * ITEMS_PER_PAGE, 
      topPerformersPage * ITEMS_PER_PAGE
    );
  }, [filteredTopPerformers, topPerformersPage]);

  // Calculate total pages for top performers
  const totalTopPerformersPages = Math.ceil(filteredTopPerformers.length / ITEMS_PER_PAGE);

  return (
    <>
      {/* Advanced Search */}
      <div className="text-center my-3">
        <AdvancedSearch
          activeFilter={activeFilter}
          searchQuery={searchQuery}
          onFilterChange={setActiveFilter}
          onSearchChange={setSearchQuery}
          onSearchSubmit={() => console.log("Search submitted:", searchQuery)}
        />
      </div>

      {/* Top Performers Section */}
      <div className="row roows">
        <h3 className="mb-2 text-purple">Top Performers</h3>
        <hr />
        {paginatedTopPerformers.length > 0 ? (
          paginatedTopPerformers.map((algo) => (
            <AlgoCard key={algo.id} algo={algo} />
          ))
        ) : (
          <div className="text-center w-100 my-3">
            <h5 className="text-purple text-center">No results found.</h5>
          </div>
        )}
      </div>

      {/* Top Performers Pagination */}
      <nav aria-label="Top Performers pagination">
        <div className="d-flex justify-content-center mb-5 mt-2">
          <div className="btn-group" role="group" aria-label="Top Performers Pagination">
            <button
              className="btn btn-outline-purple"
              disabled={topPerformersPage === 1}
              onClick={() => setTopPerformersPage(prev => prev - 1)}
            >
              Previous
            </button>
            <button
              className="btn btn-outline-purple"
              disabled={topPerformersPage === 1}
              onClick={() => setTopPerformersPage(1)}
            >
              First
            </button>
            <button
              className="btn btn-outline-purple"
              disabled={topPerformersPage === totalTopPerformersPages}
              onClick={() => setTopPerformersPage(totalTopPerformersPages)}
            >
              Last
            </button>
            <button
              className="btn btn-outline-purple"
              disabled={topPerformersPage === totalTopPerformersPages}
              onClick={() => setTopPerformersPage(prev => prev + 1)}
            >
              Next
            </button>
          </div>
        </div>
      </nav>

      {/* New Trading Applications Section */}
      <div className="row roows mb-4">
        <h3 className="mb-2 text-purple">New Trading Applications</h3>
        <hr />
        {paginatedNewApps.length > 0 ? (
          paginatedNewApps.map((algo) => (
            <AlgoCard key={algo.id} algo={algo} />
          ))
        ) : (
          <div className="text-center w-100 my-3">
            <h6 className="text-purple">No New Trading Applications available at the moment.</h6>
            <p className="text-muted small text-center">Check back later for updates!</p>
          </div>
        )}
      </div>

      {/* New Apps Pagination */}
      {newTradingApps.length > 0 && (
        <nav aria-label="New Applications pagination">
          <div className="d-flex justify-content-center mb-5 mt-2">
            <div className="btn-group" role="group" aria-label="New Applications Pagination">
              <button
                className="btn btn-outline-purple"
                disabled={newAppsPage === 1}
                onClick={() => setNewAppsPage(prev => prev - 1)}
              >
                Previous
              </button>
              <button
                className="btn btn-outline-purple"
                disabled={newAppsPage === 1}
                onClick={() => setNewAppsPage(1)}
              >
                First
              </button>
              <button
                className="btn btn-outline-purple"
                disabled={newAppsPage === totalNewAppsPages}
                onClick={() => setNewAppsPage(totalNewAppsPages)}
              >
                Last
              </button>
              <button
                className="btn btn-outline-purple"
                disabled={newAppsPage === totalNewAppsPages}
                onClick={() => setNewAppsPage(prev => prev + 1)}
              >
                Next
              </button>
            </div>
          </div>
        </nav>
      )}


      {/* Copy Trading and Signal Trading Section */}
      <div className="row mb-5">
        <h3 className="mb-2 text-purple">Copy Trading & Signal Trading</h3>
        <hr />
        
      </div>
    </>
  );
}