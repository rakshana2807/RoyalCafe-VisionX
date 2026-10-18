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
        <h1 className="text-[34px] sm:text-[42px] md:text-[52px] lg:text-[64px] leading-tight font-bold font-serif text-primary mb-4 animate-fade-in">
          Royal Cafe Menu
        </h1>

        {/* Subtitle */}
        <p className="text-sm sm:text-base text-primary/80 leading-relaxed max-w-2xl mx-auto mb-12 animate-fade-in delay-100 font-medium">
          Explore our complete artisanal selection of handcrafted coffees, loose-leaf teas, fresh juices, hot savories, stone-baked pizzas, and delicate baked pastries.
        </p>

        {/* Controls Row: Search Input + Single Sort Dropdown */}
        <div className="w-full max-w-4xl mx-auto flex flex-col sm:flex-row gap-4 items-center mb-10 animate-fade-in delay-200">
          
          {/* Search Input */}
          <div className="relative flex-1 w-full">
            <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-primary" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search by menu item name or category..."
              className="w-full pl-13 pr-6 py-4 bg-background text-sm sm:text-base rounded-full border border-primary/30 outline-none shadow-sm transition-all duration-300 text-primary placeholder:text-primary/65 font-medium focus:border-primary focus:ring-1 focus:ring-primary/20"
            />
          </div>

          {/* Sort By Dropdown */}
          <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
            <div className="relative w-full sm:w-auto">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <ArrowUpDown className="h-4 w-4 text-primary" />
              </div>
              <select
                value={sortOption}
                onChange={(e) => onSelectSort(e.target.value)}
                className="w-full sm:w-auto appearance-none pl-11 pr-10 py-4 bg-background text-sm font-semibold text-primary rounded-full border border-primary/30 outline-none shadow-sm transition-all duration-300 focus:border-primary cursor-pointer hover:bg-primary/5"
              >
                {sortOptions.map((opt) => (
                  <option key={opt} value={opt} className="bg-background text-primary">
                    Sort by: {opt}
                  </option>
                ))}
              </select>
            </div>
          </div>

        </div>

        {/* Single Horizontal Category Bar */}
        <div className="w-full animate-fade-in delay-300 pt-4 border-t border-border mt-4">
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
