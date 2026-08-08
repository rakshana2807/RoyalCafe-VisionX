"use client";

import Link from "next/link";

export default function CTASection() {
  return (
    <section id="book" className="py-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Large Rounded Container */}
        <div className="relative bg-[#FAF6F0] rounded-[2.5rem] p-10 sm:p-16 lg:p-20 overflow-hidden text-center card-shadow border border-primary/5">
          
          {/* Subtle Decorative Elements (Beige/Caramel Circles) */}
          <div className="absolute -top-12 -left-12 h-44 w-44 rounded-full bg-accent/5 pointer-events-none" />
          <div className="absolute -bottom-16 -right-16 h-60 w-60 rounded-full bg-primary/5 pointer-events-none" />
          <div className="absolute top-1/2 left-1/4 h-24 w-24 rounded-full bg-[#E6D7C7]/30 blur-2xl pointer-events-none" />

          {/* Content */}
          <div className="relative z-10 max-w-2xl mx-auto">
            {/* Heading */}
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-serif text-primary leading-tight mb-4">
              Ready to Find Your Perfect Spot?
            </h2>
            
            {/* Description */}
            <p className="text-sm sm:text-base md:text-lg text-foreground/80 leading-relaxed mb-10 max-w-xl mx-auto">
              Reserve your seat, grab your favorite coffee, and get in your flow state today.
            </p>
            
            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/book"
                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 border border-transparent text-sm font-semibold rounded-lg text-white bg-primary hover:bg-primary/95 transition-all duration-250 cursor-pointer shadow-sm hover:scale-[1.02] active:scale-[0.98]"
              >
                Book Your Seat Now
              </Link>
              
              <Link
                href="/live-status"
                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 border border-primary/20 text-sm font-semibold rounded-lg text-primary bg-white hover:bg-foreground/5 transition-all duration-250 cursor-pointer shadow-sm hover:scale-[1.02] active:scale-[0.98]"
              >
                View Live Availability
              </Link>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
