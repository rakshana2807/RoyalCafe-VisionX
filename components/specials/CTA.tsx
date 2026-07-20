"use client";

import Link from "next/link";

export default function CTA() {
  return (
    <section className="py-12 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Banner card container matching Figma */}
        <div className="bg-[#FAF6F0] rounded-[24px] p-8 sm:p-12 text-center card-shadow border border-primary/5 relative overflow-hidden">
          <div className="relative z-10 max-w-2xl mx-auto">
            {/* Heading */}
            <h2 className="text-3xl sm:text-4xl font-bold font-serif text-[#5A2E0C] leading-tight mb-3">
              Don&apos;t Miss Today&apos;s Exclusive Deals
            </h2>
            
            {/* Description */}
            <p className="text-xs sm:text-sm text-foreground/75 leading-relaxed mb-8 max-w-lg mx-auto font-sans">
              Reserve your space, enjoy premium craft flavors, and save big on our exclusive daily offerings.
            </p>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-3.5 justify-center items-center">
              <Link
                href="/book"
                className="w-full sm:w-auto px-8 py-3.5 border border-transparent text-xs font-bold rounded-full text-white bg-[#2A1506] hover:bg-[#2A1506]/90 transition-all shadow-md cursor-pointer uppercase tracking-wider text-center"
              >
                Book Your Seat
              </Link>
              
              <Link
                href="/menu"
                className="w-full sm:w-auto px-8 py-3.5 border border-primary/20 text-xs font-bold rounded-full text-primary bg-white hover:bg-foreground/5 transition-all shadow-sm cursor-pointer uppercase tracking-wider text-center"
              >
                Explore Menu
              </Link>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
