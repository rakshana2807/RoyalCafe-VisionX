"use client";

import Link from "next/link";

export default function MenuCTA() {
  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Banner container */}
        <div className="royal-glass-card rounded-[32px] p-10 sm:p-16 lg:p-20 relative overflow-hidden text-center">
          <div className="relative z-10 max-w-3xl mx-auto">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-serif text-[#FFF8E9] leading-tight mb-6">
              Ready to Order &amp; Reserve Your Spot?
            </h2>
            <p className="text-base text-[#FFF8E9]/80 font-medium leading-relaxed mb-10 max-w-lg mx-auto">
              Book your desk, check today&apos;s specials, or view real-time seating availability.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/book"
                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 border border-[#E5CB90] text-xs font-bold rounded-full text-[#561C24] bg-[#E5CB90] hover:bg-[#edd8a4] transition-all shadow-[0_4px_20px_rgba(229,203,144,0.35)] hover:-translate-y-0.5 active:scale-[0.99] uppercase tracking-widest cursor-pointer"
              >
                Book Now
              </Link>
              <Link
                href="/specials"
                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 border border-[rgba(229,203,144,0.3)] text-xs font-bold rounded-full text-[#E5CB90] hover:bg-[rgba(229,203,144,0.1)] transition-all hover:-translate-y-0.5 active:scale-[0.99] uppercase tracking-widest cursor-pointer backdrop-blur-sm"
              >
                View Specials
              </Link>
              <Link
                href="/live-status"
                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 border border-[rgba(229,203,144,0.3)] text-xs font-bold rounded-full text-[#E5CB90] hover:bg-[rgba(229,203,144,0.1)] transition-all hover:-translate-y-0.5 active:scale-[0.99] uppercase tracking-widest cursor-pointer backdrop-blur-sm"
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
