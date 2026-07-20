"use client";

import { Search, ArrowUpDown } from "lucide-react";
import CategoryTabs from "./CategoryTabs";

interface MenuHeroProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  categories: string[];
  activeCategory: string;
  onSelectCategory: (category: string) => void;
  sortOption: string;
  onSelectSort: (sort: string) => void;
  sortOptions: string[];
}

export default function MenuHero({
  searchTerm,
  onSearchChange,
  categories,
  activeCategory,
  onSelectCategory,
  sortOption,
  onSelectSort,
  sortOptions,
}: MenuHeroProps) {
  return (
    <section className="pt-32 pb-6 bg-background flex flex-col items-center text-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex flex-col items-center">

        {/* Header Title */}
        <h1 className="text-4xl sm:text-5xl md:text-[52px] leading-tight font-bold font-serif text-[#5A2E0C] mb-3 animate-fade-in">
          RoyalCafe Gourmet Menu
        </h1>

        {/* Subtitle */}
        <p className="text-xs sm:text-sm text-foreground/75 leading-relaxed max-w-2xl mb-8 animate-fade-in delay-100 font-sans">
          Explore our complete artisanal selection of handcrafted coffees, loose-leaf teas, fresh juices, hot savories, stone-baked pizzas, and delicate baked pastries.
        </p>

        {/* Controls Row: Search Input + Single Sort Dropdown */}
        <div className="w-full max-w-4xl flex flex-col sm:flex-row gap-3 items-center mb-6 animate-fade-in delay-200">
          
          {/* Search Input */}
          <div className="relative flex-1 w-full">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-foreground/40" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search by menu item name or category..."
              className="w-full pl-11 pr-4 py-3 bg-[#FAF6F0] focus:bg-white text-xs sm:text-sm rounded-full border border-primary/10 focus:border-[#EA5A0C]/40 outline-none shadow-sm transition-all text-primary placeholder-foreground/40 font-medium"
            />
          </div>

          {/* Sort By Dropdown */}
          <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
            <div className="relative w-full sm:w-auto">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <ArrowUpDown className="h-3.5 w-3.5 text-accent" />
              </div>
              <select
                value={sortOption}
                onChange={(e) => onSelectSort(e.target.value)}
                className="w-full sm:w-auto appearance-none pl-9 pr-8 py-3 bg-[#FAF6F0] text-xs font-bold text-primary rounded-full border border-primary/10 focus:outline-none cursor-pointer"
              >
                {sortOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    Sort by: {opt}
                  </option>
                ))}
              </select>
            </div>
          </div>

        </div>

        {/* Single Horizontal Category Bar */}
        <div className="w-full max-w-5xl animate-fade-in delay-300 pt-2 border-t border-primary/5">
          <CategoryTabs
            categories={categories}
            activeCategory={activeCategory}
            onSelectCategory={onSelectCategory}
          />
        </div>

      </div>
    </section>
  );
}
