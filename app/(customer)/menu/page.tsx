"use client";

import { useState, useEffect } from "react";
import { Coffee, ArrowRight, UtensilsCrossed } from "lucide-react";
import Navbar from "@/components/customer/navbar/Navbar";
import Footer from "@/components/customer/footer/Footer";
import MenuHero from "@/components/customer/menu/MenuHero";
import FeaturedItems from "@/components/customer/menu/FeaturedItems";
import MenuCard from "@/components/customer/menu/MenuCard";
import MenuCTA from "@/components/customer/menu/MenuCTA";
import { MenuItem } from "@/data/menuData";
import { getMenuItems } from "@/lib/menu";
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
  const [menuItemsList, setMenuItemsList] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMenuItems() {
      try {
        setLoading(true);

        const items = await getMenuItems();

        setMenuItemsList(items);
      } catch (error) {
        console.error("Failed to load menu items:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchMenuItems();
  }, []);

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
  if (loading) {
    return (
      <>
        <main className="w-full grow bg-background">
          <div className="min-h-[60vh] flex items-center justify-center">
            <div className="text-center">
              <Coffee className="h-10 w-10 text-accent mx-auto mb-4 animate-bounce" />
              <p className="text-sm text-foreground/70">
                Loading RoyalCafe menu...
              </p>
            </div>
          </div>
        </main>    </>
    );
  }
  return (
    <>
      {/* Floating Global Navbar */}
      <Navbar />

      <main className="w-full grow bg-background">
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
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 border-b border-[rgba(229,203,144,0.2)] pb-4 gap-4">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold font-serif text-[#290004] flex items-center gap-2">
                  <UtensilsCrossed className="h-6 w-6 text-[#290004]" />
                  {activeCategory === "All" ? "Full Café Selection" : `${activeCategory} Menu`}
                </h2>
                <p className="text-sm text-[#290004]/75 font-medium mt-1">
                  Showing {filteredItems.length} handcrafted items
                </p>
              </div>

              {(activeCategory !== "All" || searchTerm !== "" || sortOption !== "Recommended") && (
                <button
                  onClick={handleResetFilters}
                  className="inline-flex items-center text-sm font-bold text-[#290004] hover:text-[#290004] transition-colors cursor-pointer group"
                >
                  Clear Filters
                  <ArrowRight className="ml-1.5 h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
                </button>
              )}
            </div>

            {/* Menu Grid with Smooth Fade-in */}
            {filteredItems.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 transition-all duration-500">
                {filteredItems.map((item) => (
                  <div key={item.id} className="animate-fade-in">
                    <MenuCard item={item} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-20 text-center royal-glass-card rounded-[32px] max-w-xl mx-auto p-10 animate-fade-in">
                <Coffee className="h-12 w-12 text-[#290004]/80 mx-auto mb-6 animate-bounce" />
                <h3 className="text-2xl font-bold font-serif text-[#290004] mb-3">No Menu Items Found</h3>
                <p className="text-base text-[#290004]/75 font-medium mb-8">
                  We couldn&apos;t find any items matching &ldquo;{searchTerm}&rdquo; in the {activeCategory} category.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="px-8 py-3.5 bg-[#290004] text-[#320000] text-xs font-bold rounded-full uppercase tracking-widest hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(229,203,144,0.4)] transition-all duration-300 cursor-pointer"
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
    </>
  );
}
