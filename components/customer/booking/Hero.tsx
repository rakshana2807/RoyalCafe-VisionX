"use client";

export default function Hero() {
  return (
    <section className="pt-28 pb-6 bg-background text-foreground text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Figma Heading Block */}
        <div className="max-w-3xl animate-fade-in">
          <h1 className="text-4xl sm:text-5xl md:text-[52px] font-bold font-serif text-primary leading-tight mb-2">
            RoyalCafe Booking
          </h1>
          <p className="text-sm sm:text-base text-foreground/75 font-sans leading-relaxed">
            Choose your ideal environment, from vibrant social gatherings to focused deep-work sessions.
          </p>
        </div>

      </div>
    </section>
  );
}
