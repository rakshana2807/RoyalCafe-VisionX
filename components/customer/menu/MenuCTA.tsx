"use client";

import Link from "next/link";

export default function MenuCTA() {
  return (
    <section className="py-24 bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Banner container */}
        <div className="bg-background rounded-[32px] p-10 sm:p-16 lg:p-20 relative overflow-hidden text-center shadow-2xl border border-primary/20">
          <div className="relative z-10 max-w-3xl mx-auto">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-serif text-primary leading-tight mb-6">
              Ready to Order &amp; Reserve Your Spot?
            </h2>
            <p className="text-base text-primary/80 font-medium leading-relaxed mb-10 max-w-lg mx-auto">
              Book your desk, check today&apos;s specials, or view real-time seating availability.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/book"
                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 border border-transparent text-xs font-bold rounded-full text-background bg-primary hover:bg-primary/90 transition-all shadow-lg hover:-translate-y-1 active:scale-[0.99] uppercase tracking-widest cursor-pointer"
              >
                Book Now
              </Link>
              <Link
                href="/specials"
                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 border border-primary/30 text-xs font-bold rounded-full text-primary hover:bg-primary/5 transition-all hover:-translate-y-1 active:scale-[0.99] uppercase tracking-widest cursor-pointer"
              >
                View Specials
              </Link>
              <Link
                href="/live-status"
                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 border border-primary/30 text-xs font-bold rounded-full text-primary hover:bg-primary/5 transition-all hover:-translate-y-1 active:scale-[0.99] uppercase tracking-widest cursor-pointer"
              >
                Live Availability
              </Link>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
