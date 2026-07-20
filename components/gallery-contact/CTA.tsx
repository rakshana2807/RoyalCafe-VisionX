"use client";

import Link from "next/link";

export default function CTA() {
  return (
    <section className="py-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Banner card container */}
        <div className="bg-[#FAF6F0] rounded-[2.5rem] p-10 sm:p-16 lg:p-20 relative overflow-hidden text-center card-shadow border border-primary/5">
          <div className="relative z-10 max-w-2xl mx-auto">
            {/* Heading */}
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-serif text-primary leading-tight mb-4">
              Ready To Visit RoyalCafe Connect?
            </h2>
            
            {/* Description */}
            <p className="text-sm sm:text-base text-foreground/80 leading-relaxed mb-10 max-w-lg mx-auto">
              Reserve your workspace today or visit us to enjoy the perfect blend of coffee, comfort, and productivity.
            </p>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/book"
                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 border border-transparent text-sm font-semibold rounded-full text-white bg-primary hover:bg-primary/95 transition-all shadow-sm hover:scale-[1.02] active:scale-[0.98]"
              >
                Book Your Visit
              </Link>
              
              <Link
                href="/live-status"
                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 border border-primary/20 text-sm font-semibold rounded-full text-primary bg-white hover:bg-foreground/5 transition-all shadow-sm hover:scale-[1.02] active:scale-[0.98]"
              >
                Check Live Status
              </Link>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
