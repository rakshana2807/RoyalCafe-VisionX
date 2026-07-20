"use client";

import Image from "next/image";
import Link from "next/link";
import { Check, Zap } from "lucide-react";

export default function Hero() {
  return (
    <section id="home" className="relative w-full min-h-[95vh] flex items-center pt-24 pb-16 overflow-hidden">
      {/* Background Image Container */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/hero-bg.png"
          alt="RoyalCafe Connect background"
          fill
          priority
          className="object-cover object-center transform scale-105"
        />
        {/* Premium Blur and Warm Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-transparent backdrop-blur-[3px] md:backdrop-blur-[2px]" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="max-w-2xl text-left animate-fade-in">
          {/* Main Title */}
          <h1 className="text-4xl sm:text-5xl md:text-[56px] leading-[1.1] font-bold font-serif text-foreground tracking-tight mb-6">
            Your Perfect Coffee &amp;<br />
            <span className="text-primary">Workspace</span>
          </h1>

          {/* Description */}
          <p className="text-base sm:text-lg md:text-xl text-foreground/80 leading-relaxed max-w-xl mb-8 font-sans">
            The absolute environment for focus, collaboration, and relaxation.
            Experience premium quality coffee and discover the great working slot for productivity.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mb-10">
            <Link
              href="/book"
              className="inline-flex items-center justify-center px-8 py-3.5 border border-transparent text-base font-semibold rounded-lg text-white bg-primary hover:bg-primary/95 shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all duration-250 cursor-pointer"
            >
              Book Your Seat
            </Link>
            <Link
              href="/menu"
              className="inline-flex items-center justify-center px-8 py-3.5 border border-primary/20 text-base font-semibold rounded-lg text-primary bg-white/70 backdrop-blur-sm hover:bg-white hover:border-primary/40 shadow-sm hover:scale-[1.02] active:scale-[0.98] transition-all duration-250 cursor-pointer"
            >
              Explore Menu
            </Link>
          </div>

          {/* Status Badges */}
          <div className="flex flex-wrap gap-3 sm:gap-4 items-center">
            {/* Live Capacity */}
            <Link href="/live-status" className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 border border-primary/5 shadow-sm hover:border-primary/20 transition-colors">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs sm:text-sm font-medium text-foreground/80">
                Live Capacity: <span className="font-semibold text-emerald-600">32% (Low)</span>
              </span>
            </Link>

            {/* Fast Wi-Fi */}
            <Link href="/work-study" className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 border border-primary/5 shadow-sm hover:border-primary/20 transition-colors">
              <Check className="h-4 w-4 text-emerald-500" />
              <span className="text-xs sm:text-sm font-medium text-foreground/80">
                Fast Wi-Fi: <span className="font-semibold text-primary">Active</span>
              </span>
            </Link>

            {/* Ports Available */}
            <Link href="/work-study" className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 border border-primary/5 shadow-sm hover:border-primary/20 transition-colors">
              <Zap className="h-3.5 w-3.5 text-accent" />
              <span className="text-xs sm:text-sm font-semibold text-primary">
                Ports Available
              </span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
