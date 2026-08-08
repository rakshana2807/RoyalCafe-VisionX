"use client";

import { Wifi, Armchair, Coffee, Plug, VolumeX, ParkingCircle } from "lucide-react";

export default function Amenities() {
  const amenities = [
    {
      title: "Gigabit Wi-Fi",
      icon: Wifi,
    },
    {
      title: "Ergonomic Seating",
      icon: Armchair,
    },
    {
      title: "Premium Coffee",
      icon: Coffee,
    },
    {
      title: "Charging Stations",
      icon: Plug,
    },
    {
      title: "Quiet Zones",
      icon: VolumeX,
    },
    {
      title: "Free Parking",
      icon: ParkingCircle,
    },
  ];

  return (
    <section className="py-20 bg-[#E6D7C7] text-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold font-serif text-primary mb-4">
            World-Class Amenities
          </h2>
          <p className="text-base text-primary/80">
            Everything you need to stay productive, connected, and inspired.
          </p>
        </div>

        {/* 3x2 Grid for Desktop, responsive down to 1 col */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {amenities.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="bg-[#C18A52]/20 hover:bg-[#C18A52]/30 transition-all duration-300 py-8 px-6 rounded-xl flex flex-col items-center justify-center text-center border border-[#C18A52]/10 group"
              >
                {/* Icon with smooth bounce hover */}
                <Icon className="h-8 w-8 text-primary mb-4 group-hover:scale-110 transition-transform duration-300 stroke-[1.5]" />

                {/* Title */}
                <span className="text-base font-bold font-serif text-primary">
                  {item.title}
                </span>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
