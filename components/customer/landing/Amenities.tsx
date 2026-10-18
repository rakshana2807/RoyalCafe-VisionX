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
    <section className="py-12 bg-surface text-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold font-serif text-primary mb-4">
            World-Class Amenities
          </h2>
          <p className="text-base text-foreground/70 font-medium">
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
                className="bg-background transition-all duration-500 py-12 px-8 rounded-3xl flex flex-col items-center justify-center text-center border border-border card-shadow-hover group"
              >
                {/* Icon with smooth bounce hover */}
                <Icon className="h-8 w-8 text-accent mb-6 group-hover:scale-110 group-hover:-translate-y-1 transition-all duration-500 stroke-[1.5]" />

                {/* Title */}
                <span className="text-lg font-bold font-serif text-primary tracking-wide">
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
