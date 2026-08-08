"use client";

import Image from "next/image";
import { Star, Edit3, Heart, Coffee, Laptop } from "lucide-react";

export default function Hero() {
  const handleScrollTo = (id: string) => {
    const elem = document.getElementById(id);
    if (elem) {
      window.scrollTo({
        top: elem.offsetTop - 80,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="pt-28 pb-12 bg-background text-foreground text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Grid: Info on Left, Photo on Right (Figma Screenshot) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-12">
          
          {/* Left Column (6 cols) */}
          <div className="lg:col-span-6 animate-fade-in">
            {/* Title */}
            <h1 className="text-4xl sm:text-5xl md:text-[54px] leading-[1.1] font-bold font-serif text-primary tracking-tight mb-4">
              Community Voices
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-base text-foreground/80 leading-relaxed font-sans max-w-lg mb-8">
              Discover why remote workers and coffee lovers choose RoyalCafe Connect as their perfect third space. Real stories from our vibrant community.
            </p>

            {/* Rating Summary Block & Leave Review Button */}
            <div className="flex flex-wrap items-center gap-6">
              
              {/* Rating 4.8 */}
              <div className="flex items-center gap-3 pr-6 border-r border-primary/15">
                <span className="text-3xl sm:text-4xl font-bold font-serif text-primary">
                  4.8
                </span>
                <div>
                  <div className="flex gap-0.5 mb-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-3.5 w-3.5 fill-accent text-accent" />
                    ))}
                  </div>
                  <span className="text-[10px] font-bold text-foreground/50 uppercase tracking-wider block">
                    Based on 200+ reviews
                  </span>
                </div>
              </div>

              {/* Leave a Review Button */}
              <button
                onClick={() => handleScrollTo("write-review")}
                className="px-6 py-3 border border-transparent text-xs font-bold rounded-full text-white bg-[#EA5A0C] hover:bg-[#EA5A0C]/95 transition-all shadow-md hover:scale-[1.02] active:scale-[0.98] inline-flex items-center gap-2 cursor-pointer uppercase tracking-wider"
              >
                <Edit3 className="h-4 w-4" />
                <span>Leave a Review</span>
              </button>

            </div>
          </div>

          {/* Right Column: Photo with #RoyalCafeConnect Badge (6 cols) */}
          <div className="lg:col-span-6 w-full animate-fade-in delay-150">
            <div className="relative aspect-[16/10] w-full rounded-3xl overflow-hidden card-shadow border border-primary/5">
              <Image
                src="/community-voices.png"
                alt="RoyalCafe Connect Community"
                fill
                priority
                className="object-cover object-center"
                sizes="(max-w-1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-black/15" />
              
              {/* Overlay Badge */}
              <div className="absolute bottom-6 left-6 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full text-xs font-bold font-serif text-primary shadow-lg">
                #RoyalCafeConnect
              </div>
            </div>
          </div>

        </div>

        {/* Quick Badges Bar */}
        <div className="flex flex-wrap justify-center sm:justify-between gap-4 p-6 bg-white rounded-2xl border border-primary/5 card-shadow">
          <div className="flex items-center gap-2">
            <Star className="h-4 w-4 fill-accent text-accent" />
            <span className="text-xs font-bold text-primary">4.9 Average Rating</span>
          </div>
          <div className="flex items-center gap-2">
            <Heart className="h-4 w-4 text-rose-500 fill-rose-500" />
            <span className="text-xs font-bold text-primary">2,500+ Happy Customers</span>
          </div>
          <div className="flex items-center gap-2">
            <Coffee className="h-4 w-4 text-primary" />
            <span className="text-xs font-bold text-primary">Premium Coffee</span>
          </div>
          <div className="flex items-center gap-2">
            <Laptop className="h-4 w-4 text-accent" />
            <span className="text-xs font-bold text-primary">Productive Workspace</span>
          </div>
        </div>

      </div>
    </section>
  );
}
