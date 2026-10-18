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
className={`px-3 py-2 rounded-full text-xs font-semibold transition-all duration-300 cursor-pointer whitespace-nowrap uppercase tracking-widest ${                isActive
                   ? "bg-primary text-background shadow-sm"
                  : "bg-background text-primary/70 hover:bg-surface hover:text-primary border border-border"
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
