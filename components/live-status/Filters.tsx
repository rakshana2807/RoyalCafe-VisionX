"use client";

interface FiltersProps {
  activeZone: string;
  onSelectZone: (zone: string) => void;
}

export default function Filters({ activeZone, onSelectZone }: FiltersProps) {
  const zones = ["All Areas", "Quiet Zone", "Social Area", "Family Zone"];

  const legend = [
    { label: "Available", color: "bg-emerald-500" },
    { label: "Occupied", color: "bg-zinc-300" },
    { label: "Work & Study", color: "bg-sky-400"},
    { label: "Reserved", color: "bg-orange-500" },
  ];

  return (
    <div className="w-full flex flex-col gap-6 mb-8 text-left">
      {/* Top Row: Title + Legend */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-xl sm:text-2xl font-bold font-serif text-primary">
          Interactive Floor Plan
        </h2>
        
        {/* Legend Indicators */}
        <div className="flex flex-wrap gap-4 items-center">
          {legend.map((item, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <span className={`h-3 w-3 rounded-full ${item.color}`} />
              <span className="text-xs font-semibold text-foreground/70">
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Row: Zone Filter Pills */}
      <div className="w-full overflow-x-auto pb-1 flex gap-2.5 scrollbar-hide">
        {zones.map((zone) => {
          const isActive = activeZone === zone;
          return (
            <button
              key={zone}
              onClick={() => onSelectZone(zone)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all duration-300 transform active:scale-95 cursor-pointer whitespace-nowrap ${
                isActive
                  ? "bg-primary text-white shadow-sm hover:bg-primary/95"
                  : "bg-[#EAE0D5]/50 text-primary hover:bg-[#EAE0D5] border border-primary/5"
              }`}
            >
              {zone}
            </button>
          );
        })}
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
