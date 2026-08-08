"use client";

import { useState, useEffect } from "react";
import { Coffee, ArrowRight, UtensilsCrossed } from "lucide-react";
import Navbar from "@/components/customer/navbar/Navbar";
import Footer from "@/components/customer/footer/Footer";
import MenuHero from "@/components/customer/menu/MenuHero";
import FeaturedItems from "@/components/customer/menu/FeaturedItems";
import MenuCard from "@/components/customer/menu/MenuCard";
import MenuCTA from "@/components/customer/menu/MenuCTA";
import { MENU_ITEMS, MenuItem } from "@/data/menuData";

const CATEGORIES = [
  "All",
  "Coffee",
  "Tea",
  "Breakfast",
  "Pizza",
  "Burgers",
  "Sandwiches",
  "Pasta",
  "Rice & Bowls",
  "Desserts",
  "Drinks",
  "Mocktails",
];

const SORT_OPTIONS = [
  "Recommended",
  "Popular",
  "Price: Low to High",
  "Price: High to Low",
  "Newest",
];

export default function MenuPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [sortOption, setSortOption] = useState("Recommended");
  const [menuItemsList, setMenuItemsList] = useState<MenuItem[]>(MENU_ITEMS);



  // Filtering Logic (Combines Category & Search Query)
  let filteredItems = menuItemsList.filter((item: MenuItem) => {
    // 1. Search Query Filter
    if (searchTerm.trim() !== "") {
      const query = searchTerm.toLowerCase();
      const matches =
        item.name.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query);
      if (!matches) return false;
    }

    // 2. Category Filter
    if (activeCategory !== "All") {
      const cat = activeCategory.toLowerCase();
      const itemCat = item.category.toLowerCase();
      const itemFilterType = item.filterType?.toLowerCase() || "";

      if (cat === "coffee") {
        if (
          itemFilterType !== "coffee" &&
          !itemCat.includes("coffee") &&
          !itemCat.includes("espresso") &&
          !itemCat.includes("cappuccino")
        ) {
          return false;
        }
      } else if (cat === "tea") {
        if (itemFilterType !== "tea" && !itemCat.includes("tea")) {
          return false;
        }
      } else if (cat === "breakfast") {
        if (itemFilterType !== "breakfast" && !itemCat.includes("breakfast")) {
          return false;
        }
      } else if (cat === "pizza") {
        if (!itemCat.includes("pizza")) return false;
      } else if (cat === "burgers") {
        if (!itemCat.includes("burger")) return false;
      } else if (cat === "sandwiches") {
        if (!itemCat.includes("sandwich")) return false;
      } else if (cat === "pasta") {
        if (!itemCat.includes("pasta")) return false;
      } else if (cat === "rice & bowls") {
        if (!itemCat.includes("rice") && !itemCat.includes("bowl")) return false;
      } else if (cat === "desserts") {
        if (
          itemFilterType !== "desserts" &&
          !["desserts", "cakes", "brownies", "cookies", "muffins", "cheesecakes"].includes(itemCat)
        ) {
          return false;
        }
      } else if (cat === "drinks") {
        if (
          itemFilterType !== "drinks" &&
          !["iced beverages", "fresh juices", "milkshakes", "smoothies", "hot chocolate"].includes(itemCat)
        ) {
          return false;
        }
      } else if (cat === "mocktails") {
        if (!itemCat.includes("mocktail")) return false;
      } else {
        if (itemCat !== cat) return false;
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
    if (sortOption === "Popular") {
      const reviewsA = parseInt(a.reviewsCount) || 0;
      const reviewsB = parseInt(b.reviewsCount) || 0;
      return reviewsB - reviewsA;
    }
    if (sortOption === "Newest") {
      return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
    }
    // Recommended default (Best Sellers & Chef Specials first, then rating)
    const scoreA = (a.isBestSeller ? 2 : 0) + (a.isChefsSpecial ? 1 : 0) + a.rating;
    const scoreB = (b.isBestSeller ? 2 : 0) + (b.isChefsSpecial ? 1 : 0) + b.rating;
    return scoreB - scoreA;
  });

  const handleResetFilters = () => {
    setSearchTerm("");
    setActiveCategory("All");
    setSortOption("Recommended");
  };

  return (
    <>
      {/* Floating Global Navbar */}
      <Navbar />

      <main className="w-full flex-grow bg-background">
        {/* Simplified Hero Section with Search, Sort, and ONE Category Bar */}
        <MenuHero
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          categories={CATEGORIES}
          activeCategory={activeCategory}
          onSelectCategory={setActiveCategory}
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
                  {activeCategory === "All" ? "Full Café Selection" : `${activeCategory} Menu`}
                </h2>
                <p className="text-xs text-foreground/60 font-sans mt-1">
                  Showing {filteredItems.length} handcrafted items
                </p>
              </div>

              {(activeCategory !== "All" || searchTerm !== "" || sortOption !== "Recommended") && (
                <button
                  onClick={handleResetFilters}
                  className="inline-flex items-center text-xs font-bold text-accent hover:text-primary transition-colors cursor-pointer group"
                >
                  Clear Filters
                  <ArrowRight className="ml-1 h-3.5 w-3.5 transform group-hover:translate-x-1 transition-transform" />
                </button>
              )}
            </div>

            {/* Menu Grid with Smooth Fade-in */}
            {filteredItems.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 transition-all duration-300">
                {filteredItems.map((item) => (
                  <div key={item.id} className="animate-fade-in">
                    <MenuCard item={item} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-20 text-center bg-white rounded-3xl border border-primary/5 max-w-xl mx-auto p-8 card-shadow animate-fade-in">
                <Coffee className="h-10 w-10 text-accent/60 mx-auto mb-4 animate-bounce" />
                <h3 className="text-lg font-bold font-serif text-primary mb-2">No Menu Items Found</h3>
                <p className="text-xs text-foreground/75 mb-6">
                  We couldn&apos;t find any items matching &ldquo;{searchTerm}&rdquo; in the {activeCategory} category.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="px-6 py-2.5 bg-[#2A1506] text-white text-xs font-bold rounded-full uppercase tracking-wider hover:bg-[#2A1506]/90 transition-all cursor-pointer"
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
