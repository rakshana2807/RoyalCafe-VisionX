"use client";

import { Wifi, Armchair, Coffee, VolumeX, Users, Heart } from "lucide-react";

export default function Features() {
  const features = [
    {
      title: "High-Speed Wi-Fi",
      description: "Dedicated Gigabit fiber internet connection optimized for video calls, large downloads, and cloud dev.",
      icon: Wifi,
    },
    {
      title: "Ergonomic Seating",
      description: "Herman Miller post-corrective chairs and adjustable desks engineered for comfortable multi-hour sessions.",
      icon: Armchair,
    },
    {
      title: "Fresh Coffee",
      description: "Handcrafted espresso drinks, pour-overs, and cold brews prepared using single-origin roasted beans.",
      icon: Coffee,
    },
    {
      title: "Quiet Study Zones",
      description: "Distraction-free quiet pods and silent study areas ideal for exam prep, writing, and deep focus.",
      icon: VolumeX,
    },
    {
      title: "Meeting Spaces",
      description: "Private booths and group collaboration rooms equipped with presentation displays and whiteboards.",
      icon: Users,
    },
    {
      title: "Friendly Environment",
      description: "A welcoming, inclusive community of remote workers, students, and friendly barista staff.",
      icon: Heart,
    },
  ];

  return (
    <section className="py-20 bg-background text-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16 animate-fade-in">
          <h2 className="text-3xl sm:text-4xl font-bold font-serif text-primary mb-4">
            Why People Love RoyalCafe Connect
          </h2>
          <p className="text-base text-foreground/75 font-sans">
            Designed from the ground up to synthesize high productivity with premium cafe hospitality.
          </p>
        </div>

        {/* 6 Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-white p-8 rounded-3xl border border-primary/5 flex flex-col text-left card-shadow card-shadow-hover h-full"
              >
                {/* Large Icon circle */}
                <div className="h-14 w-14 rounded-full bg-primary/5 flex items-center justify-center mb-6 border border-primary/10">
                  <Icon className="h-6 w-6 text-primary stroke-[1.5]" />
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold font-serif text-primary mb-3">
                  {item.title}
                </h3>

                {/* Description */}
                <p className="text-xs sm:text-sm text-foreground/70 leading-relaxed font-sans">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
