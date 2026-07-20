"use client";

import { useState } from "react";
import { Coffee, ArrowRight, UtensilsCrossed } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MenuHero from "@/components/menu/MenuHero";
import FeaturedItems from "@/components/menu/FeaturedItems";
import MenuCard from "@/components/menu/MenuCard";
import MenuCTA from "@/components/menu/MenuCTA";
import {
  MENU_ITEMS,
  MENU_CATEGORIES,
  MAIN_FILTERS,
  SORT_OPTIONS,
  MenuItem,
} from "@/data/menuData";

export default function MenuPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("All Categories");
  const [activeFilter, setActiveFilter] = useState("All");
  const [sortOption, setSortOption] = useState("Most Popular");

  // Filtering Logic
  let filteredItems = MENU_ITEMS.filter((item: MenuItem) => {
    // 1. Search term match
    if (searchTerm.trim() !== "") {
      const query = searchTerm.toLowerCase();
      const matches =
        item.name.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query);
      if (!matches) return false;
    }

    // 2. High-level main filter match
    if (activeFilter !== "All") {
      if (activeFilter === "Coffee" && item.filterType !== "Coffee") return false;
      if (activeFilter === "Tea" && item.filterType !== "Tea") return false;
      if (activeFilter === "Food" && item.filterType !== "Food") return false;
      if (activeFilter === "Desserts" && item.filterType !== "Desserts") return false;
      if (activeFilter === "Breakfast" && item.filterType !== "Breakfast") return false;
      if (activeFilter === "Drinks" && item.filterType !== "Drinks") return false;
      if (activeFilter === "Veg" && !item.isVeg) return false;
      if (activeFilter === "Non-Veg" && item.isVeg) return false;
      if (activeFilter === "Best Sellers" && !item.isBestSeller) return false;
      if (activeFilter === "New Arrivals" && !item.isNew) return false;
    }

    // 3. Category match
    if (activeCategory !== "All Categories") {
      if (item.category.toLowerCase() !== activeCategory.toLowerCase()) {
        return false;
      }
    }

    return true;
  });

  // Sorting Logic
  filteredItems = [...filteredItems].sort((a, b) => {
    if (sortOption === "Price: Low to High") {
      return a.price - b.price;
    }
    if (sortOption === "Price: High to Low") {
      return b.price - a.price;
    }
    if (sortOption === "Highest Rated") {
      return b.rating - a.rating;
    }
    if (sortOption === "Newest") {
      return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
    }
    // Most Popular default (by reviews numeric count)
    const reviewsA = parseInt(a.reviewsCount) || 0;
    const reviewsB = parseInt(b.reviewsCount) || 0;
    return reviewsB - reviewsA;
  });

  const handleResetFilters = () => {
    setSearchTerm("");
    setActiveCategory("All Categories");
    setActiveFilter("All");
    setSortOption("Most Popular");
  };

  return (
    <>
      {/* Floating Global Navbar */}
      <Navbar />

      <main className="w-full flex-grow bg-background">
        {/* Hero Section with Search, Sort, Main Filters, and 26 Category Tabs */}
        <MenuHero
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          categories={MENU_CATEGORIES}
          activeCategory={activeCategory}
          onSelectCategory={setActiveCategory}
          mainFilters={MAIN_FILTERS}
          activeFilter={activeFilter}
          onSelectFilter={setActiveFilter}
          sortOption={sortOption}
          onSelectSort={setSortOption}
          sortOptions={SORT_OPTIONS}
        />

        {/* Today's Featured Recommendations Banner */}
        <FeaturedItems />

        {/* Complete Menu Grid Section */}
        <section className="py-12 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            {/* Header Row */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 border-b border-primary/5 pb-4 gap-4">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold font-serif text-[#5A2E0C] flex items-center gap-2">
                  <UtensilsCrossed className="h-6 w-6 text-accent" />
                  {activeCategory === "All Categories" ? "Explore Full Menu" : activeCategory}
                </h2>
                <p className="text-xs text-foreground/60 font-sans mt-1">
                  Showing {filteredItems.length} items for your productive café experience
                </p>
              </div>

              {(activeCategory !== "All Categories" || activeFilter !== "All" || searchTerm !== "") && (
                <button
                  onClick={handleResetFilters}
                  className="inline-flex items-center text-xs font-bold text-accent hover:text-primary transition-colors cursor-pointer group"
                >
                  Clear All Filters
                  <ArrowRight className="ml-1 h-3.5 w-3.5 transform group-hover:translate-x-1 transition-transform" />
                </button>
              )}
            </div>

            {/* Menu Grid */}
            {filteredItems.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredItems.map((item) => (
                  <div key={item.id} className="animate-fade-in">
                    <MenuCard item={item} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-20 text-center bg-white rounded-3xl border border-primary/5 max-w-xl mx-auto p-8 card-shadow">
                <Coffee className="h-10 w-10 text-accent/60 mx-auto mb-4 animate-bounce" />
                <h3 className="text-lg font-bold font-serif text-primary mb-2">No Menu Items Found</h3>
                <p className="text-xs text-foreground/75 mb-6">
                  We couldn&apos;t find anything matching your search criteria. Try clearing filters or searching for another term!
                </p>
                <button
                  onClick={handleResetFilters}
                  className="px-6 py-2.5 bg-[#2A1506] text-white text-xs font-bold rounded-full uppercase tracking-wider hover:bg-[#2A1506]/90 transition-all"
                >
                  View All Menu Items
                </button>
              </div>
            )}

          </div>
        </section>

        {/* CTA Section */}
        <MenuCTA />

      </main>

      {/* Footer */}
      <Footer />
    </>
  );
}
