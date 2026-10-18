"use client";

interface CategoryTabsProps {
  categories: string[];
  activeCategory: string;
  onSelectCategory: (category: string) => void;
}

export default function CategoryTabs({
  categories,
  activeCategory,
  onSelectCategory,
}: CategoryTabsProps) {
  return (
    <div className="w-full py-2">
      <div className="flex flex-wrap gap-3 justify-center w-full">
        {categories.map((category) => {
          const isActive = activeCategory === category;
          return (
            <button
              key={category}
              onClick={() => onSelectCategory(category)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all duration-300 cursor-pointer whitespace-nowrap uppercase tracking-widest ${
                isActive
                  ? "bg-[#F5DAA7] text-[#320000] shadow-[0_4px_16px_rgba(245,218,167,0.35)] border border-[#F5DAA7] scale-105"
                  : "bg-[rgba(245,218,167,0.08)] backdrop-blur-md text-[#F5DAA7]/80 hover:text-[#F5DAA7] border border-[rgba(245,218,167,0.24)] hover:border-[#F5DAA7]/60 hover:bg-[rgba(245,218,167,0.15)] shadow-sm"
              }`}
            >
              {category}
            </button>
          );
        })}
      </div>
    </div>
  );
}
