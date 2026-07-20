"use client";

import Link from "next/link";

export default function CTA() {
  return (
    <section className="py-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Banner Card Container */}
        <div className="bg-[#FAF6F0] rounded-[2.5rem] p-10 sm:p-16 lg:p-20 relative overflow-hidden text-center card-shadow border border-primary/5">
          {/* Decorative shapes */}
          <div className="absolute -top-12 -right-12 h-44 w-44 rounded-full bg-accent/5 pointer-events-none" />
          <div className="absolute -bottom-16 -left-16 h-60 w-60 rounded-full bg-primary/5 pointer-events-none" />

          <div className="relative z-10 max-w-2xl mx-auto">
            {/* Heading */}
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-serif text-primary leading-tight mb-4">
              Ready To Boost Your Productivity?
            </h2>
            
            {/* Description */}
            <p className="text-sm sm:text-base text-foreground/80 leading-relaxed mb-10 max-w-lg mx-auto">
              Reserve your workspace today and experience the perfect blend of comfort, coffee, and productivity.
            </p>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={() => alert("Launching workspace registration window...")}
                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 border border-transparent text-sm font-semibold rounded-full text-white bg-primary hover:bg-primary/95 transition-all shadow-sm hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              >
                Book Workspace
              </button>
              
              <Link
                href="/live-status"
                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 border border-primary/20 text-sm font-semibold rounded-full text-primary bg-white hover:bg-foreground/5 transition-all shadow-sm hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              >
                View Live Status
              </Link>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
