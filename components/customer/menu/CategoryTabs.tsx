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
                  ? "bg-[#E5CB90] text-[#561C24] shadow-[0_4px_16px_rgba(229,203,144,0.35)] border border-[#E5CB90] scale-105"
                  : "bg-[rgba(61,17,24,0.6)] backdrop-blur-md text-[#FFF8E9]/85 hover:text-[#E5CB90] border border-[rgba(229,203,144,0.25)] hover:border-[rgba(229,203,144,0.55)] hover:bg-[rgba(61,17,24,0.85)] shadow-sm"
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
