"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Check, Zap, ArrowRight, Sparkles } from "lucide-react";

export default function Hero() {
  const shouldReduceMotion = useReducedMotion();

  // Animation variants with staggered entry
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.12,
        delayChildren: shouldReduceMotion ? 0 : 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: shouldReduceMotion ? 0.2 : 0.6,
        ease: "easeOut" as const,
      },
    },
  };

  return (
    <section
      id="home"
      aria-label="Welcome to RoyalCafe Connect"
      className="relative w-full min-h-[92vh] lg:min-h-[96vh] flex items-center pt-28 sm:pt-32 pb-20 overflow-hidden bg-[#320000]"
    >
      {/* ─── HERO BACKGROUND IMAGE & CINEMATIC OVERLAYS ─────────────────── */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {/* Subtle initial scale-in on background image */}
        <motion.div
          initial={{ scale: shouldReduceMotion ? 1 : 1.08 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full h-full"
        >
          <Image
            src="/hero-bg.png"
            alt="Warm, sophisticated café workspace with patrons working and collaborating"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center lg:object-[65%_center]"
          />
        </motion.div>

        {/* 1. Left-to-right cinematic gradient: deep burgundy on left for optimal text contrast, revealing café details on the right */}
        <div
          className="absolute inset-0 bg-gradient-to-r from-[#320000] via-[#320000]/85 md:via-[#320000]/70 to-[#320000]/25 lg:from-[#320000] lg:via-[#320000]/80 lg:to-transparent"
          aria-hidden="true"
        />

        {/* 2. Top-to-bottom edge blend: seamless transition from navbar down into the deep burgundy page background */}
        <div
          className="absolute inset-0 bg-gradient-to-b from-[#320000]/80 via-transparent to-[#320000]"
          aria-hidden="true"
        />

        {/* 3. Subtle ambient champagne light orb */}
        <div
          className="absolute -top-24 left-1/4 w-96 h-96 bg-[radial-gradient(ellipse_at_center,_rgba(245,218,167,0.12)_0%,_transparent_70%)] blur-3xl pointer-events-none"
          aria-hidden="true"
        />
      </div>

      {/* ─── MAIN CONTENT CONTAINER (60-70% AVAILABLE WIDTH ON DESKTOP) ── */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-2xl lg:max-w-3xl text-left"
        >
          {/* Subtle Hospitality Tagline */}
          <motion.div variants={itemVariants} className="mb-4">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[rgba(245,218,167,0.08)] backdrop-blur-md border border-[rgba(245,218,167,0.2)] text-[11px] font-bold uppercase tracking-[0.2em] text-[#F5DAA7]">
              <Sparkles className="w-3.5 h-3.5 text-[#F5DAA7]" />
              Luxury Café &amp; Coworking Space
            </span>
          </motion.div>

          {/* Heading with clamp typography and subtle emphasis */}
          <motion.h1
            variants={itemVariants}
            className="text-[clamp(2.5rem,5.5vw,4.5rem)] leading-[1.08] font-bold font-serif text-[#F5DAA7] tracking-tight mb-6"
          >
            A Better Space to Work,{" "}
            <br className="hidden sm:inline" />
            <span className="italic font-normal text-[#F5DAA7] relative inline-block">
              Study &amp; Unwind.
              {/* Subtle champagne underline accent */}
              <span
                className="absolute left-0 -bottom-1 w-full h-[2px] bg-gradient-to-r from-[#F5DAA7]/60 via-[#F5DAA7]/30 to-transparent rounded-full"
                aria-hidden="true"
              />
            </span>
          </motion.h1>

          {/* Description */}
          <motion.p
            variants={itemVariants}
            className="text-base sm:text-lg md:text-xl text-[#F5DAA7]/85 leading-relaxed max-w-xl mb-9 font-sans font-normal"
          >
            Discover a café experience where exceptional coffee meets your
            perfect workspace. Handcrafted brews, reserved quiet zones, and
            gigabit connectivity.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 sm:gap-5 mb-11"
          >
            {/* Primary CTA */}
            <Link
              href="/book"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full font-bold text-xs uppercase tracking-[0.18em] text-[#320000] bg-[#F5DAA7] hover:bg-white shadow-[0_8px_30px_rgba(245,218,167,0.3)] hover:shadow-[0_12px_36px_rgba(245,218,167,0.45)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#F5DAA7] focus:ring-offset-2 focus:ring-offset-[#320000] group"
            >
              <span>Reserve Your Seat</span>
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>

            {/* Secondary CTA */}
            <Link
              href="/menu"
              className="inline-flex items-center justify-center px-8 py-4 rounded-full font-bold text-xs uppercase tracking-[0.18em] text-[#F5DAA7] bg-[rgba(245,218,167,0.06)] hover:bg-[rgba(245,218,167,0.15)] border border-[rgba(245,218,167,0.28)] hover:border-[#F5DAA7] backdrop-blur-md shadow-sm hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#F5DAA7]/50"
            >
              Explore RoyalCafe
            </Link>
          </motion.div>

          {/* Live Status Indicators (Compact, Glassmorphic Pills) */}
          <motion.div
            variants={itemVariants}
            className="flex flex-wrap gap-2.5 sm:gap-3 items-center"
          >
            {/* 1. Live Capacity */}
            <Link
              href="/live-status"
              className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-[rgba(245,218,167,0.07)] backdrop-blur-md border border-[rgba(245,218,167,0.18)] hover:border-[#F5DAA7]/50 hover:bg-[rgba(245,218,167,0.12)] transition-all duration-200 group shadow-xs"
              title="View live seating availability"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
              </span>
              <span className="text-xs font-medium text-[#F5DAA7]/90 tracking-wide">
                Live Capacity:{" "}
                <span className="font-bold text-emerald-300 group-hover:underline">
                  62% (Available)
                </span>
              </span>
            </Link>

            {/* 2. Fast Wi-Fi */}
            <Link
              href="/work-study"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[rgba(245,218,167,0.07)] backdrop-blur-md border border-[rgba(245,218,167,0.18)] hover:border-[#F5DAA7]/50 hover:bg-[rgba(245,218,167,0.12)] transition-all duration-200 group shadow-xs"
              title="Explore dedicated high-speed fiber passes"
            >
              <div className="w-4 h-4 rounded-full bg-emerald-400/15 flex items-center justify-center">
                <Check className="h-3 w-3 text-emerald-400 stroke-[3]" />
              </div>
              <span className="text-xs font-medium text-[#F5DAA7]/90 tracking-wide group-hover:text-[#F5DAA7]">
                Gigabit Wi-Fi Available
              </span>
            </Link>

            {/* 3. Ports Available */}
            <Link
              href="/work-study"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[rgba(245,218,167,0.07)] backdrop-blur-md border border-[rgba(245,218,167,0.18)] hover:border-[#F5DAA7]/50 hover:bg-[rgba(245,218,167,0.12)] transition-all duration-200 group shadow-xs"
              title="Power outlets provided for seamless productivity"
            >
              <Zap className="h-3.5 w-3.5 text-[#F5DAA7]" />
              <span className="text-xs font-semibold text-[#F5DAA7]/90 tracking-wide group-hover:text-[#F5DAA7]">
                Power Outlets at Every Seat
              </span>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
