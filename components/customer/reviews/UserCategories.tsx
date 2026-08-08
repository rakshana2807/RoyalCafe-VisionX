"use client";

import { GraduationCap, Briefcase, UserCheck, Coffee, Star, Check } from "lucide-react";

export default function UserCategories() {
  const categories = [
    {
      title: "Students",
      rating: "4.9★",
      reviewsCount: "840 Reviews",
      description: "Quiet study zones, affordable passes, and fast Wi-Fi for uninterrupted exam prep.",
      benefits: ["Quiet Pods", "Affordable Pass", "At-desk Plugs"],
      icon: GraduationCap,
    },
    {
      title: "Remote Workers",
      rating: "4.8★",
      reviewsCount: "920 Reviews",
      description: "Dedicated desks, reliable high-speed fiber, and Herman Miller ergonomic chairs.",
      benefits: ["Gigabit Wi-Fi", "Desk Booking", "Ergonomic Chairs"],
      icon: Briefcase,
    },
    {
      title: "Freelancers",
      rating: "4.9★",
      reviewsCount: "510 Reviews",
      description: "Vibrant creative atmosphere, flexible seating, and great networking opportunities.",
      benefits: ["Creative Vibe", "Meeting Booths", "Coffee Refills"],
      icon: UserCheck,
    },
    {
      title: "Coffee Lovers",
      rating: "4.9★",
      reviewsCount: "680 Reviews",
      description: "Handcrafted espresso drinks, specialty pour-overs, and fresh artisan pastry pairings.",
      benefits: ["Single-Origin Beans", "Latte Art", "Fresh Pastries"],
      icon: Coffee,
    },
  ];

  return (
    <section className="py-20 bg-background/50 text-foreground text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16 animate-fade-in">
          <h2 className="text-3xl sm:text-4xl font-bold font-serif text-primary mb-4">
            Reviews By User Type
          </h2>
          <p className="text-base text-foreground/75 font-sans">
            See how RoyalCafe Connect caters to different community needs and workflows.
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {categories.map((cat, idx) => {
            const Icon = cat.icon;
            return (
              <div
                key={idx}
                className="bg-white p-8 rounded-3xl border border-primary/5 flex flex-col justify-between card-shadow card-shadow-hover h-full"
              >
                <div>
                  {/* Icon + Rating Badge */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="h-12 w-12 rounded-full bg-primary/5 flex items-center justify-center border border-primary/10">
                      <Icon className="h-6 w-6 text-primary stroke-[1.5]" />
                    </div>
                    <div className="flex items-center gap-1 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full text-xs font-bold text-amber-900">
                      <Star className="h-3.5 w-3.5 fill-accent text-accent" />
                      <span>{cat.rating}</span>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold font-serif text-primary mb-1">
                    {cat.title}
                  </h3>
                  <span className="text-[10px] font-bold text-foreground/45 uppercase tracking-wider block mb-4">
                    {cat.reviewsCount}
                  </span>

                  {/* Description */}
                  <p className="text-xs sm:text-sm text-foreground/75 leading-relaxed font-sans mb-6">
                    {cat.description}
                  </p>

                  {/* Benefits */}
                  <ul className="space-y-2 mb-6">
                    {cat.benefits.map((b, bIdx) => (
                      <li key={bIdx} className="flex items-center gap-2 text-xs font-semibold text-primary">
                        <Check className="h-3.5 w-3.5 text-accent stroke-[2.5]" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={() => alert(`Showing ${cat.title} category reviews...`)}
                  className="w-full py-2.5 px-4 border border-primary/20 text-xs font-bold rounded-full text-primary hover:bg-foreground/5 transition-all shadow-sm cursor-pointer text-center uppercase tracking-wider"
                >
                  View Category
                </button>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
