"use client";

import { Users, Armchair, UserCheck, Clock } from "lucide-react";

export default function CapacityCard() {
  const cards = [
    {
      title: "Total Capacity",
      value: "130 People",
      badge: "Optimal",
      badgeColor: "bg-emerald-500/10 text-emerald-700 border-emerald-500/10",
      icon: Users,
    },
    {
      title: "Available Seats",
      value: "78 Current",
      badge: null,
      icon: Armchair,
    },
    {
      title: "Occupied Seats",
      value: "35 Active",
      badge: null,
      icon: UserCheck,
    },
    {
      title: "Last Updated",
      value: "2 mins ago",
      badge: "LIVE UPDATES",
      badgeColor: "bg-emerald-500/5 text-emerald-600 border-transparent text-[9px]",
      icon: Clock,
    },
  ];

  return (
    <section className="py-6 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {/* Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <div
                key={idx}
                className="bg-[#561C24] p-6 rounded-2xl border border-[rgba(244,221,165,0.25)] shadow-md text-left flex flex-col justify-between h-[126px] transition-all hover:-translate-y-1 hover:border-[#F4DDA5] duration-300"
              >
                {/* Top Row: Icon + Badge */}
                <div className="flex items-center justify-between">
                  <div className="h-9 w-9 rounded-xl bg-[rgba(244,221,165,0.12)] flex items-center justify-center border border-[rgba(244,221,165,0.25)]">
                    <Icon className="h-5 w-5 text-[#F4DDA5] stroke-[1.75]" />
                  </div>
                  {card.badge && (
                    <span
                      className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border tracking-wider uppercase bg-[#F4DDA5]/15 text-[#F4DDA5] border-[#F4DDA5]/30"
                    >
                      {card.badge}
                    </span>
                  )}
                </div>

                {/* Bottom Row: Text content */}
                <div>
                  <span className="text-[11px] font-bold text-[#FFF8E6]/65 uppercase tracking-wider block mb-1">
                    {card.title}
                  </span>
                  <span className="text-xl font-bold font-serif text-[#FFF8E6]">
                    {card.value}
                  </span>
                </div>

              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
