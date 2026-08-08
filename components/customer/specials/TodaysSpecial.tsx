"use client";

import Image from "next/image";
import { Coffee, Tag } from "lucide-react";

export default function TodaysSpecial() {
  return (
    <section id="todays-special" className="py-10 bg-background text-foreground text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading matching Figma */}
        <div className="mb-8">
          <h2 className="text-3xl sm:text-4xl font-bold font-serif text-[#5A2E0C] leading-tight">
            Today&apos;s Specials
          </h2>
        </div>

        {/* Daily Special & Spiced Pumpkin Latte Grid (Two Cards) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-10 items-stretch">
          
          {/* Left Card: Daily Special (Artisan Flat White & Pastry) - 7 cols */}
          <div className="lg:col-span-7 bg-white rounded-[24px] overflow-hidden card-shadow border border-primary/5 flex flex-col md:flex-row items-stretch">
            
            {/* Cover Image (Left half) */}
            <div className="relative w-full md:w-1/2 min-h-[240px] md:min-h-full">
              <Image
                src="/flat-white-pastry.png"
                alt="Artisan Flat White & Pastry"
                fill
                className="object-cover object-center"
                sizes="(max-w-768px) 100vw, 40vw"
              />
            </div>

            {/* Details panel (Right half) */}
            <div className="p-6 sm:p-8 w-full md:w-1/2 flex flex-col justify-between text-left relative">
              <div>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-[10px] font-bold text-accent uppercase tracking-widest block">
                    Daily Special
                  </span>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-[#EA5A0C] text-white text-[9px] font-extrabold uppercase tracking-wider">
                    20% OFF
                  </span>
                </div>

                <h3 className="text-xl font-bold font-serif text-primary mb-3 leading-snug">
                  Artisan Flat White &amp; Pastry
                </h3>
                <p className="text-xs text-foreground/75 leading-relaxed font-sans mb-6">
                  Pair our rich signature espresso with a warm, flaky, buttery croissant. The perfect start to your morning or afternoon work session.
                </p>
              </div>

              {/* Price and Trigger */}
              <div>
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-2xl font-bold font-serif text-[#EA5A0C]">₹220</span>
                  <span className="text-xs font-semibold text-foreground/40 line-through">₹280</span>
                </div>
                <button
                  onClick={() => alert("Daily Special claimed!")}
                  className="w-full py-3 px-5 border border-transparent text-xs font-bold rounded-full text-white bg-[#2A1506] hover:bg-[#2A1506]/90 transition-all shadow-md cursor-pointer uppercase tracking-wider text-center"
                >
                  Claim Special
                </button>
              </div>

            </div>
          </div>

          {/* Right Card: Spiced Pumpkin Latte - 5 cols */}
          <div className="lg:col-span-5 bg-white rounded-[24px] overflow-hidden card-shadow border border-primary/5 flex flex-col justify-between">
            {/* Top Cover Image with badge overlay */}
            <div className="relative h-[200px] w-full">
              <Image
                src="/flat-white.png"
                alt="Spiced Pumpkin Latte"
                fill
                className="object-cover object-center"
                sizes="(max-w-768px) 100vw, 30vw"
              />
              <div className="absolute top-4 left-4 inline-flex items-center gap-1 px-2.5 py-1 bg-white/90 backdrop-blur-sm border border-primary/10 rounded-full text-primary text-[9px] font-bold uppercase tracking-wider shadow-sm">
                <Coffee className="h-3 w-3 fill-primary/10 text-primary" />
                <span>Seasonal</span>
              </div>
            </div>

            {/* Bottom details */}
            <div className="p-6 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-bold font-serif text-primary mb-2">
                  Spiced Pumpkin Latte
                </h3>
                <p className="text-xs text-foreground/75 leading-relaxed font-sans mb-4">
                  Rich espresso combined with real pumpkin puree, warm cinnamon spices, and velvety steamed milk.
                </p>
              </div>

              {/* Price row */}
              <div className="flex items-center justify-between pt-4 border-t border-primary/5">
                <span className="text-xl font-bold font-serif text-primary">₹180</span>
                <button
                  onClick={() => alert("Spiced Pumpkin Latte claimed!")}
                  className="px-5 py-2 rounded-full bg-[#2A1506] hover:bg-[#2A1506]/90 text-white text-xs font-bold transition-all cursor-pointer uppercase tracking-wider"
                >
                  Claim Offer
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* Off-Peak Happy Hour Banner matching Figma */}
        <div className="w-full bg-[#FAF6F0] border border-primary/5 rounded-[24px] p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 card-shadow mb-12">
          <div className="flex-1 text-left">
            <div className="flex flex-wrap gap-2 mb-3">
              {["HAPPY HOUR", "LIMITED OFFER", "20% OFF"].map((badge, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-0.5 bg-white border border-primary/10 rounded text-[9px] font-bold tracking-wider text-primary/70 uppercase"
                >
                  {badge}
                </span>
              ))}
            </div>

            <h3 className="text-2xl font-bold font-serif text-primary mb-2">
              Off-Peak Happy Hour
            </h3>
            <p className="text-xs sm:text-sm text-foreground/75 leading-relaxed font-sans max-w-2xl">
              Receive a 20% discount on all handcrafted beverages every weekday from 2 PM to 5 PM. Perfect for quiet work sessions or afternoon catch-ups.
            </p>
          </div>

          {/* Action button */}
          <button
            onClick={() => alert("Happy Hour Pass activated!")}
            className="w-full md:w-auto px-8 py-3.5 border border-transparent text-xs font-bold rounded-full text-white bg-[#2A1506] hover:bg-[#2A1506]/90 transition-all shadow-md cursor-pointer uppercase tracking-wider whitespace-nowrap"
          >
            Get Happy Hour Pass
          </button>
        </div>

      </div>
    </section>
  );
}
