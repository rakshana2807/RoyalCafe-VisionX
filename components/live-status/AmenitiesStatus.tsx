"use client";

import { Wifi, Zap, Armchair, Printer, Coffee } from "lucide-react";

export default function AmenitiesStatus() {
  const premiumAmenities = [
    {
      title: "Gigabit WiFi",
      icon: Wifi,
    },
    {
      title: "Fast Charging",
      icon: Zap,
    },
    {
      title: "Ergonomic Seating",
      icon: Armchair,
    },
    {
      title: "Smart Printing",
      icon: Printer,
    },
    {
      title: "Barista Service",
      icon: Coffee,
    },
  ];

  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-12 animate-fade-in">
          <h2 className="text-3xl sm:text-4xl font-bold font-serif text-primary">
            Premium Amenities
          </h2>
        </div>

        {/* 5-Columns Responsive Row Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
          {premiumAmenities.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-white p-6 rounded-2xl border border-primary/5 flex flex-col items-center justify-center text-center card-shadow card-shadow-hover"
              >
                {/* Rounded Icon circle */}
                <div className="h-14 w-14 rounded-full bg-primary/5 flex items-center justify-center mb-4 border border-primary/10">
                  <Icon className="h-6 w-6 text-primary stroke-[1.5]" />
                </div>
                
                {/* Title label */}
                <span className="text-xs sm:text-sm font-bold font-serif text-primary leading-tight">
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
