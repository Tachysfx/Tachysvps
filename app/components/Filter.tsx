"use client";
import React from "react";

type AdvancedSearchProps = {
  activeFilter: string;
  searchQuery: string;
  onFilterChange: (filter: string) => void;
  onSearchChange: (query: string) => void;
  onSearchSubmit: () => void; // Added new prop for search button action
};



const AdvancedSearch: React.FC<AdvancedSearchProps> = ({
  activeFilter,
  searchQuery,
  onFilterChange,
  onSearchChange,
  onSearchSubmit, // Destructure new prop
}) => {
  return (
    <div className="container my-4">
      {/* Search Input */}
      <div className="input-group row">
        <div className="col-lg-7 mx-auto">
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              id="inputModalSearch"
              placeholder={`Search in ${
                activeFilter ? activeFilter.toLowerCase() : "all algos"
              }...`}
              aria-label="Search"
              name="q"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
            />
            <button
              type="button"
              className="btn btn-outline-purple"
              onClick={onSearchSubmit}
            >
              Search
            </button>
          </div>
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="btn-group mt-3" role="group" aria-label="Filter Modes">
        {["All Algos", "Free Algos", "Premium Algos"].map(
          (filter) => {
            return (
              <button
                key={filter}
                type="button"
                className={`btn btn-sm ${
                  activeFilter === filter ? "btn-purple" : "btn-outline-purple"
                }`}
                onClick={() => onFilterChange(filter)}
              >
                {filter.replace(" Algos", "")}
              </button>
            );
          }
        )}
      </div>
    </div>
  );
};

export default AdvancedSearch;