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
                className="bg-white p-6 rounded-2xl border border-primary/5 card-shadow text-left flex flex-col justify-between h-[120px] transition-all hover:translate-y-[-2px] duration-300"
              >
                {/* Top Row: Icon + Badge */}
                <div className="flex items-center justify-between">
                  <div className="h-9 w-9 rounded-lg bg-primary/5 flex items-center justify-center border border-primary/10">
                    <Icon className="h-5 w-5 text-primary stroke-[1.75]" />
                  </div>
                  {card.badge && (
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold border tracking-wide uppercase ${card.badgeColor}`}
                    >
                      {card.badge}
                    </span>
                  )}
                </div>

                {/* Bottom Row: Text content */}
                <div>
                  <span className="text-[11px] font-bold text-foreground/45 uppercase tracking-wider block mb-1">
                    {card.title}
                  </span>
                  <span className="text-xl font-bold font-serif text-primary">
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
