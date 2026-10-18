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
          <h1 className="text-4xl sm:text-5xl md:text-[64px] lg:text-[72px] leading-[1.1] font-bold font-serif text-[#F5DAA7] tracking-tight mb-6">
            A Better Space to Work,<br />
            <span className="text-[#F5DAA7] italic font-medium">Study &amp; Unwind.</span>
          </h1>

          {/* Description */}
          <p className="text-base sm:text-lg md:text-xl text-[#D6BC91] leading-relaxed max-w-xl mb-8 font-sans font-medium">
            Discover a café experience where exceptional coffee meets your perfect workspace. Handcrafted brews, reserved quiet zones, and gigabit connectivity.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-5 mb-12">
            <Link
              href="/book"
              className="inline-flex items-center justify-center px-8 py-4 border border-[#F5DAA7] text-xs uppercase tracking-[0.2em] font-bold rounded-full text-[#320000] bg-[#F5DAA7] hover:bg-white shadow-[0_8px_30px_rgba(245,218,167,0.35)] hover:-translate-y-0.5 transition-all duration-300 cursor-pointer"
            >
              Reserve Your Seat
            </Link>
            <Link
              href="/menu"
              className="inline-flex items-center justify-center px-8 py-4 border border-[rgba(245,218,167,0.35)] text-xs uppercase tracking-[0.2em] font-bold rounded-full text-[#F5DAA7] bg-[rgba(245,218,167,0.08)] backdrop-blur-md hover:bg-[#F5DAA7] hover:text-[#320000] shadow-sm hover:-translate-y-0.5 transition-all duration-300 cursor-pointer"
            >
              Explore RoyalCafe
            </Link>
          </div>

          {/* Status Badges with Glass Style */}
          <div className="flex flex-wrap gap-3 sm:gap-4 items-center">
            {/* Live Capacity */}
            <Link href="/live-status" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[rgba(245,218,167,0.08)] backdrop-blur-md border border-[rgba(245,218,167,0.22)] shadow-sm hover:border-[#F5DAA7]/60 transition-colors">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-semibold text-[#F5DAA7] tracking-wide">
                Live Capacity: <span className="font-bold text-emerald-300">62% (Available)</span>
              </span>
            </Link>

            {/* Fast Wi-Fi */}
            <Link href="/work-study" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[rgba(245,218,167,0.08)] backdrop-blur-md border border-[rgba(245,218,167,0.22)] shadow-sm hover:border-[#F5DAA7]/60 transition-colors">
              <Check className="h-4 w-4 text-emerald-400" />
              <span className="text-xs font-semibold text-[#F5DAA7] tracking-wide">
                Gigabit Wi-Fi Available
              </span>
            </Link>

            {/* Ports Available */}
            <Link href="/work-study" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[rgba(245,218,167,0.08)] backdrop-blur-md border border-[rgba(245,218,167,0.22)] shadow-sm hover:border-[#F5DAA7]/60 transition-colors">
              <Zap className="h-3.5 w-3.5 text-[#F5DAA7]" />
              <span className="text-xs font-bold text-[#F5DAA7] tracking-wide">
                Power Outlets at Every Seat
              </span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
