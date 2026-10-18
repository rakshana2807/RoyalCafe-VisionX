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
                className="bg-[#F5DAA7] text-[#320000] p-6 rounded-2xl border border-[rgba(245,218,167,0.4)] shadow-xl text-left flex flex-col justify-between h-[130px] transition-all hover:-translate-y-1 hover:shadow-2xl duration-300"
              >
                {/* Top Row: Icon + Badge */}
                <div className="flex items-center justify-between">
                  <div className="h-9 w-9 rounded-xl bg-[#320000]/10 flex items-center justify-center border border-[#320000]/15">
                    <Icon className="h-5 w-5 text-[#320000] stroke-[2]" />
                  </div>
                  {card.badge && (
                    <span
                      className="px-2.5 py-0.5 rounded-full text-[10px] font-black tracking-wider uppercase bg-[#320000]/10 text-[#320000] border border-[#320000]/20"
                    >
                      {card.badge}
                    </span>
                  )}
                </div>

                {/* Bottom Row: Text content */}
                <div>
                  <span className="text-[11px] font-extrabold text-[#320000]/70 uppercase tracking-wider block mb-0.5">
                    {card.title}
                  </span>
                  <span className="text-2xl font-black font-serif text-[#320000]">
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
