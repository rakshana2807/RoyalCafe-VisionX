"use client";

interface FiltersProps {
  activeZone: string;
  onSelectZone: (zone: string) => void;
}

export default function Filters({ activeZone, onSelectZone }: FiltersProps) {
  const categories = [
    { label: "All Seats", value: "All Areas" },
    { label: "Work & Study", value: "Work & Study" },
    { label: "Lounge", value: "Lounge" },
    { label: "Social", value: "Social" },
    { label: "Family", value: "Family" },
    { label: "Outdoor", value: "Outdoor" },
    { label: "Private Booths", value: "Private Booths" },
    { label: "Kids Zone", value: "Kids Zone" },
    { label: "Elder Friendly", value: "Elder Friendly" },
  ];

  const legend = [
    { label: "Available", color: "bg-emerald-500" },
    { label: "Reserved", color: "bg-orange-500" },
    { label: "Occupied", color: "bg-blue-600 ring-blue-400" },
  ];

  return (
    <div className="w-full flex flex-col gap-5 mb-7 text-left font-sans">
      {/* Top Row: Title + Legend */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold font-serif text-[#2A1506] mb-2.5">
            ☕ RoyalCafe Floor Management Blueprint
          </h2>
          <p className="text-xs text-foreground/60 font-medium">
            Professional Café Dashboard &bull; Click any available seat to reserve
          </p>
        </div>

        {/* Legend Indicators */}
        <div className="flex flex-wrap gap-3 items-center bg-white/90 px-4 py-2 rounded-2xl border border-primary/10 shadow-2xs">
          {legend.map((item, idx) => (
            <div key={idx} className="flex items-center gap-1.5">
              <span className={`h-3 w-3 rounded-full ${item.color}`} />
              <span className="text-[11px] font-extrabold text-[#2A1506]">
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Row: Multi-level Dropdown & Filter Pills */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white/70 p-3 rounded-2xl border border-primary/10 shadow-2xs">
        

        {/* Quick Access Filter Pills */}
        <div className="w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0 flex gap-2 scrollbar-hide">
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
