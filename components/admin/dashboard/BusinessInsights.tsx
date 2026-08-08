"use client";

import React from "react";
import { Sparkles, TrendingUp, Clock, Award, Armchair, UserPlus } from "lucide-react";
import { motion } from "framer-motion";

export default function BusinessInsights() {
  const INSIGHTS = [
    { title: "Revenue Surge", desc: "Revenue increased by 18% compared to yesterday", icon: TrendingUp, color: "text-emerald-600 bg-emerald-50 border-emerald-200" },
    { title: "Peak Floor Hours", desc: "Highest traffic recorded between 5:00 PM – 7:00 PM", icon: Clock, color: "text-amber-700 bg-amber-50 border-amber-200" },
    { title: "Top Seller Item", desc: "Royal Espresso Roast (48 orders fulfilled)", icon: Award, color: "text-purple-600 bg-purple-50 border-purple-200" },
    { title: "Peak Occupancy", desc: "72% seat floor occupancy achieved during lunch & evening", icon: Armchair, color: "text-blue-600 bg-blue-50 border-blue-200" },
    { title: "New Customers", desc: "14 new guest accounts created today", icon: UserPlus, color: "text-rose-600 bg-rose-50 border-rose-200" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.45 }}
      className="bg-[#FFFDF9] rounded-3xl p-6 border border-[#E5D5C5] shadow-sm space-y-4"
    >
      <div className="flex items-center gap-2">
        <Sparkles className="w-5 h-5 text-[#8C4A21]" />
        <h3 className="text-lg font-bold font-serif text-[#3D2314]">Business AI Insights</h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {INSIGHTS.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div key={idx} className={`p-3.5 rounded-2xl border flex items-start gap-3 ${item.color}`}>
              <Icon className="w-5 h-5 shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-xs text-[#3D2314]">{item.title}</div>
                <div className="text-[11px] text-[#7A5A43] leading-relaxed mt-0.5">{item.desc}</div>
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
