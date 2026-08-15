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
          <h2 className="text-xl sm:text-2xl font-bold font-serif text-[#2A1506] mb-2.5">
            ☕ RoyalCafe Floor Management Blueprint
          </h2>
          
        </div>        
      </div>

      {/* Bottom Row: Multi-level Dropdown & Filter Pills */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white/70 p-3 rounded-2xl border border-primary/10 shadow-2xs">
        {/* Search Bar */}
        <div className="relative w-full sm:w-64 shrink-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground/40" />
          <input
            type="text"
            placeholder="Search tables, seats or seating areas..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-primary/15 bg-white text-[#2A1506] placeholder:text-foreground/40 outline-none focus:border-[#EA5A0C] transition-all"
          />
        </div>


      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white/70 p-3 rounded-2xl border border-primary/10 shadow-2xs">
        {/* Quick Access Filter Pills */}
        <div className="w-full overflow-x-auto pb-1 sm:pb-0 flex gap-2 scrollbar-hide">
          {categories.map((cat) => {
            const isActive = activeZone === cat.value;
            return (
              <button
                key={cat.value}
                onClick={() => onSelectZone(cat.value)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-extrabold transition-all duration-200 cursor-pointer whitespace-nowrap ${
                  isActive
                    ? "bg-[#2A1506] text-white shadow-sm scale-105"
                    : "bg-[#EAE0D5]/70 text-[#2A1506] hover:bg-[#EAE0D5] border border-primary/10"
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
