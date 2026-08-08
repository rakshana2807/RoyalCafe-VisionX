"use client";

import { Star, CheckCircle2 } from "lucide-react";

export default function FeaturedTestimonials() {
  const testimonials = [
    {
      name: "Sarah J.",
      profession: "Freelance Designer",
      date: "Oct 12, 2023",
      rating: 5,
      review: "The silent zone is a game changer for my productivity. Combined with the reliable high-speed Wi-Fi and their incredible pour-over, it's my go-to spot every Tuesday.",
      tags: ["Silent Zone", "Pour-over"],
      initials: "SJ",
      avatarBg: "bg-amber-100 text-amber-900",
    },
    {
      name: "Marcus T.",
      profession: "Grad Student",
      date: "Oct 05, 2023",
      rating: 5,
      review: "Love the app integration. Booking a desk before I arrive takes away all the stress of finding a spot during busy hours. The cold brew is excellent too.",
      tags: ["Desk Booking", "Cold Brew"],
      initials: "MT",
      avatarBg: "bg-blue-100 text-blue-900",
    },
    {
      name: "Elena R.",
      profession: "Startup Founder",
      date: "Sep 28, 2023",
      rating: 5,
      review: "Perfect balance of ambient noise and focus. The ergonomic chairs in the study area are a thoughtful touch for long sessions. Highly recommend the matcha latte.",
      tags: ["Ergonomics", "Matcha"],
      initials: "ER",
      avatarBg: "bg-rose-100 text-rose-900",
    },
  ];

  return (
    <section className="py-16 bg-background text-foreground text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="max-w-3xl mx-auto text-center mb-16 animate-fade-in">
          <h2 className="text-3xl sm:text-4xl font-bold font-serif text-primary mb-4">
            Featured Customer Stories
          </h2>
          <p className="text-base text-foreground/75 font-sans">
            Read detailed experiences from regulars who rely on RoyalCafe Connect every week.
          </p>
        </div>

        {/* 3 Testimonial Cards Row Grid (Figma Screenshot) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {testimonials.map((story, idx) => (
            <div
              key={idx}
              className="bg-white p-8 rounded-3xl border border-primary/5 flex flex-col justify-between card-shadow card-shadow-hover text-left h-full"
            >
              <div>
                {/* Header: Avatar + Name + Date */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`h-11 w-11 rounded-full flex items-center justify-center font-bold text-sm shadow-sm ${story.avatarBg}`}>
                      {story.initials}
                    </div>
                    <div>
                      <h3 className="text-base font-bold font-serif text-primary flex items-center gap-1.5">
                        {story.name}
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 fill-emerald-100" />
                      </h3>
                      <span className="text-xs text-foreground/50 font-medium">
                        {story.profession}
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] font-semibold text-foreground/40">
                    {story.date}
                  </span>
                </div>

                {/* 5 Stars */}
                <div className="flex gap-0.5 mb-4">
                  {[...Array(story.rating)].map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-accent text-accent" />
                  ))}
                </div>

                {/* Review Text */}
                <p className="text-xs sm:text-sm text-foreground/80 leading-relaxed font-sans mb-6">
                  &ldquo;{story.review}&rdquo;
                </p>
              </div>

              {/* Tags Pills Row at bottom */}
              <div className="pt-4 border-t border-primary/5 flex flex-wrap gap-2">
                {story.tags.map((tag, tIdx) => (
                  <span
                    key={tIdx}
                    className="px-3 py-1 bg-[#FAF6F0] rounded-full text-[10px] font-bold text-primary/70 border border-primary/5"
                  >
                    {tag}
                  </span>
                ))}
              </div>

            </div>
          ))}
        </div>

        {/* Load More Reviews Button (Figma Screenshot) */}
        <div className="text-center">
          <button
            onClick={() => {
              const grid = document.getElementById("reviews-grid");
              if (grid) grid.scrollIntoView({ behavior: "smooth" });
            }}
            className="px-8 py-3 border border-primary/20 text-xs font-bold rounded-full text-primary bg-white hover:bg-foreground/5 transition-all shadow-sm cursor-pointer hover:scale-[1.02] active:scale-[0.98] uppercase tracking-wider"
          >
            Load More Reviews
          </button>
        </div>

      </div>
    </section>
  );
}
