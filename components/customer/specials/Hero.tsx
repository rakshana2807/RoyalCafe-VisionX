"use client";

import Link from "next/link";

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
    <section className="pt-28 pb-12 bg-background text-foreground flex flex-col items-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center animate-fade-in">
        
        {/* Badges row matching Figma screenshot */}
        <div className="flex flex-wrap gap-2 justify-center mb-6">
          {["SPECIAL OFFERS", "LIMITED TIME ONLY", "TODAY'S SPECIAL", "EXCLUSIVES"].map((badge, idx) => (
            <span
              key={idx}
              className="inline-flex items-center text-[10px] font-bold tracking-wider uppercase px-3.5 py-1.5 bg-[#FAF6F0] border border-primary/10 rounded-full text-primary/70"
            >
              {badge}
            </span>
          ))}
        </div>

        {/* Main Title matching Figma screenshot */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold font-serif text-[#5A2E0C] leading-tight max-w-3xl mx-auto mb-5">
          Today&apos;s Specials &amp; Exclusive Offers
        </h1>

        {/* Subtitle matching Figma screenshot */}
        <p className="text-xs sm:text-sm md:text-base text-foreground/70 leading-relaxed max-w-xl mx-auto mb-8 font-sans">
          Indulge in our chef&apos;s hand-crafted specials, seasonal refreshments, and curated combo pairings. Available for a limited time only at RoyalCafe Connect.
        </p>

        {/* Action Buttons matching Figma screenshot */}
        <div className="flex flex-col sm:flex-row gap-3.5 justify-center items-center">
          <button
            onClick={() => handleScrollTo("todays-special")}
            className="w-full sm:w-auto px-8 py-3.5 border border-transparent text-xs font-bold rounded-full text-white bg-[#2A1506] hover:bg-[#2A1506]/90 transition-all shadow-md cursor-pointer uppercase tracking-wider hover:scale-[1.02] active:scale-[0.98]"
          >
            Claim Today&apos;s Offer
          </button>
          
          <Link
            href="/menu"
            className="w-full sm:w-auto px-8 py-3.5 border border-primary/20 text-xs font-bold rounded-full text-primary bg-white hover:bg-foreground/5 transition-all shadow-sm cursor-pointer uppercase tracking-wider text-center"
          >
            Explore Menu
          </Link>
        </div>

      </div>
    </section>
  );
}
