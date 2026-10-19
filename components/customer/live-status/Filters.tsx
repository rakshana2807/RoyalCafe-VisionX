"use client";

import { Search, ChevronDown, Filter } from "lucide-react";

interface FiltersProps {
  activeZone: string;
  onSelectZone: (zone: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  priceFilter: string;
  onPriceFilterChange: (price: string) => void;
  statusFilter: string;
  onStatusFilterChange: (status: string) => void;
  sortOrder: string;
  onSortOrderChange: (sort: string) => void;
}

export default function Filters({ 
  activeZone, 
  onSelectZone,
  searchQuery,
  onSearchChange,
  priceFilter,
  onPriceFilterChange,
  statusFilter,
  onStatusFilterChange,
  sortOrder,
  onSortOrderChange
}: FiltersProps) {
  const categories = [
    { label: "All Seats", value: "All Seats" },
    { label: "Work & Study", value: "Work & Study" },
    { label: "Lounges", value: "Lounges" },
    { label: "Social Area", value: "Social Area" },
    { label: "Family Zone", value: "Family Zone" },
    { label: "Outdoor", value: "Outdoor" },
    { label: "Private Booths", value: "Private Booths" },
    { label: "Kids Zone", value: "Kids Zone" },
    { label: "Elder Friendly", value: "Elder Friendly" },
  ];
  
  return (
    <div className="w-full flex flex-col gap-5 mb-7 text-left font-sans">
      {/* Top Row: Title + Legend */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold font-serif text-primary mb-2.5">
            ☕ Cafe Seating Blueprint
          </h2>
          
        </div>        
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-background p-4 rounded-[24px] border border-primary/20 shadow-md">
        {/* Quick Access Filter Pills */}
        <div className="w-full overflow-x-auto pb-1 sm:pb-0 flex gap-3 scrollbar-hide">
          {categories.map((cat) => {
            const isActive = activeZone === cat.value;
            return (
              <button
                key={cat.value}
                onClick={() => onSelectZone(cat.value)}
                className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all duration-300 cursor-pointer whitespace-nowrap uppercase tracking-widest border ${
                  isActive
                    ? "bg-primary text-background border-primary shadow-md scale-105"
                    : "bg-background text-primary border-transparent hover:border-primary/30 hover:bg-primary/10"
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

      </div>

      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
