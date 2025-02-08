"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { Star } from "lucide-react";
import { Algo } from "../types";

type MarketClientProps = {
  enrichedAlgos: Algo[];
};

const ITEMS_PER_PAGE = 6;

const RatingStars = ({ rating }: { rating: number }) => (
  <div className="d-flex justify-content-center">
    {[...Array(5)].map((_, index) => (
      <Star
        key={index}
        size={16}
        className={index < Math.round(rating) ? "text-warning fill-warning" : "text-gray-300"}
      />
    ))}
  </div>
);

export default function More({ enrichedAlgos }: MarketClientProps) {
  // Sorting and randomization logic
  const sortedAlgos = useMemo(() => {
    const sorted = [...enrichedAlgos].sort((a, b) => {
      // First, prioritize Internal identity
      if (a.identity === "Internal" && b.identity !== "Internal") return -1;
      if (b.identity === "Internal" && a.identity !== "Internal") return 1;
      
      // Then sort by rating count
      if (b.ratingCount !== a.ratingCount) return b.ratingCount - a.ratingCount;
      
      // Then by rating
      if (b.rating !== a.rating) return b.rating - a.rating;
      
      // Finally, randomize for equal items
      return Math.random() - 0.5;
    });
    return sorted;
  }, [enrichedAlgos]);

  // Apply pagination
  const paginatedAlgos = sortedAlgos.slice(0, ITEMS_PER_PAGE);

  return (
    <div className="row roows">
      <h5 className="mb-2 text-purple">Recommended Bots</h5>
      <hr />
      {paginatedAlgos.length > 0 ? (
        paginatedAlgos.map((algo) => (
          <div key={algo.id} className="col-6 col-md-2 mb-2 px-1">
            <Link href={`/market/${algo.id}`} className="card-link">
              <div className="card hover-card">
                {/* Default View */}
                <div className="card-body product-card text-center p-0">
                  <div className="product_badge">
                    <span className="badge-new">{algo.platform}</span>
                  </div>
                  <Image
                    src={algo.image}
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
                          src={algo.image}
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
                        <span className="text-muted">
                          {algo.type}
                        </span>
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
        ))
      ) : (
        <p>No results found</p>
      )}
    </div>
  );
} 