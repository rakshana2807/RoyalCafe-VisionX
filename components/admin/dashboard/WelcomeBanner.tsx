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
      className="relative overflow-hidden rounded-3xl bg-primary text-background p-6 sm:p-10 shadow-[0_8px_30px_rgba(10,5,3,0.15)] border border-primary"
    >
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 -mb-10 w-48 h-48 bg-accent/20 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-10 pointer-events-none hidden lg:block">
        <Coffee className="w-64 h-64 text-amber-200" />
      </div>

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        {/* Title & Subtitle */}
        <div className="space-y-3 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-surface/10 border border-primary/20 text-accent text-xs font-semibold uppercase tracking-[0.15em]">
            <Sparkles className="w-3 h-3" /> VisionX Admin Control
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-serif tracking-tight text-primary flex items-center gap-2">
            {greeting}, Administrator <span className="inline-block animate-bounce">☕</span>
          </h1>
          <p className="text-xs sm:text-sm text-primary/70 font-medium leading-relaxed">
            Welcome back to <strong className="text-primary font-semibold">RoyalCafe Connect</strong>. Here is your real-time business performance overview, floor occupancy metrics, and order streams.
          </p>
        </div>

      </div>
    </motion.div>
  );
}
