"use client";

import React, { useState, useEffect } from "react";
import { Coffee, TrendingUp, Calendar, Armchair, DollarSign, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export default function WelcomeBanner() {
  const [greeting, setGreeting] = useState("Good Afternoon");

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good Morning");
    else if (hour < 17) setGreeting("Good Afternoon");
    else setGreeting("Good Evening");
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#3D2314] via-[#4A2B18] to-[#2B1407] text-white p-6 sm:p-8 shadow-xl border border-[#8C4A21]/30"
    >
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 -mb-10 w-48 h-48 bg-[#8C4A21]/20 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-10 pointer-events-none hidden lg:block">
        <Coffee className="w-64 h-64 text-amber-200" />
      </div>

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        {/* Title & Subtitle */}
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/15 border border-amber-400/30 text-amber-300 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" /> VisionX Admin Control
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-serif tracking-tight text-white flex items-center gap-2">
            {greeting}, Administrator <span className="inline-block animate-bounce">☕</span>
          </h1>
          <p className="text-xs sm:text-sm text-amber-100/80 font-light leading-relaxed">
            Welcome back to <strong className="text-amber-300 font-semibold">RoyalCafe Connect</strong>. Here is your real-time business performance overview, floor occupancy metrics, and order streams.
          </p>
        </div>

      </div>
    </motion.div>
  );
}
