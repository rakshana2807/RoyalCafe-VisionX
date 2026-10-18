"use client";

export default function Hero() {
  return (
    <section className="relative w-full bg-background flex flex-col items-center justify-center pt-32 pb-16 animate-fade-in">
      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
        
        {/* Eyebrow */}
        <div className="mb-6">
          <span className="text-primary font-bold tracking-[0.12em] text-xs sm:text-sm uppercase">
            WI-FI & WORKSPACE PASSES
          </span>
        </div>

        {/* Main Heading */}
        <h1 className="text-4xl sm:text-[52px] md:text-[64px] font-extrabold font-serif text-primary leading-tight mb-8 max-w-3xl">
          Stay Connected.<br className="hidden sm:block" /> Work Without Limits.
        </h1>

        {/* Description */}
        <p className="text-base sm:text-lg text-primary/80 font-medium font-sans max-w-[650px] leading-relaxed">
          Choose the pass that fits your study or work session and enjoy reliable Wi-Fi, comfortable workspace access, and premium cafe benefits.
        </p>

      </div>
    </section>
  );
}
