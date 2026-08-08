"use client";

import React, { useState, useEffect } from "react";
import {
  DollarSign,
  Calendar,
  ShoppingBag,
  Armchair,
  CheckCircle2,
  Users,
  Clock,
  Star,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { motion } from "framer-motion";

interface KpiCardData {
  id: string;
  title: string;
  value: string;
  numericTarget?: number;
  prefix?: string;
  suffix?: string;
  subtitle: string;
  change: string;
  isPositive: boolean;
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
  borderAccent: string;
}

const KPI_LIST: KpiCardData[] = [
  {
    id: "revenue",
    title: "Today's Revenue",
    value: "24,850",
    numericTarget: 24850,
    prefix: "₹",
    subtitle: "Combined bookings & café sales",
    change: "+18.4%",
    isPositive: true,
    icon: DollarSign,
    iconBg: "bg-emerald-500/10 border-emerald-500/20",
    iconColor: "text-emerald-700",
    borderAccent: "hover:border-emerald-500/40",
  },
  {
    id: "reservations",
    title: "Today's Reservations",
    value: "18",
    numericTarget: 18,
    suffix: " Bookings",
    subtitle: "14 Reserved, 4 Walk-in",
    change: "+12.5%",
    isPositive: true,
    icon: Calendar,
    iconBg: "bg-[#8C4A21]/10 border-[#8C4A21]/20",
    iconColor: "text-[#8C4A21]",
    borderAccent: "hover:border-[#8C4A21]/40",
  },
  {
    id: "orders",
    title: "Orders Today",
    value: "42",
    numericTarget: 42,
    suffix: " Orders",
    subtitle: "38 Completed, 4 In-Kitchen",
    change: "+8.0%",
    isPositive: true,
    icon: ShoppingBag,
    iconBg: "bg-amber-500/10 border-amber-500/20",
    iconColor: "text-amber-700",
    borderAccent: "hover:border-amber-500/40",
  },
  {
    id: "occupied",
    title: "Occupied Seats",
    value: "23 / 32",
    subtitle: "72% Floor Capacity",
    change: "72%",
    isPositive: true,
    icon: Armchair,
    iconBg: "bg-amber-600/10 border-amber-600/20",
    iconColor: "text-amber-800",
    borderAccent: "hover:border-amber-600/40",
  },
  {
    id: "available",
    title: "Available Seats",
    value: "9",
    numericTarget: 9,
    suffix: " Seats",
    subtitle: "Ready for immediate guest check-in",
    change: "28% Open",
    isPositive: true,
    icon: CheckCircle2,
    iconBg: "bg-blue-500/10 border-blue-500/20",
    iconColor: "text-blue-700",
    borderAccent: "hover:border-blue-500/40",
  },
  {
    id: "customers",
    title: "Active Customers",
    value: "28",
    numericTarget: 28,
    suffix: " Active",
    subtitle: "Currently inside café & workspaces",
    change: "+14.2%",
    isPositive: true,
    icon: Users,
    iconBg: "bg-purple-500/10 border-purple-500/20",
    iconColor: "text-purple-700",
    borderAccent: "hover:border-purple-500/40",
  },
  {
    id: "pending_payments",
    title: "Pending Payments",
    value: "₹1,240",
    subtitle: "3 Unsettled guest orders",
    change: "3 Orders",
    isPositive: false,
    icon: Clock,
    iconBg: "bg-rose-500/10 border-rose-500/20",
    iconColor: "text-rose-700",
    borderAccent: "hover:border-rose-500/40",
  },
  {
    id: "rating",
    title: "Average Rating",
    value: "4.9 ★",
    subtitle: "Based on 124 verified customer reviews",
    change: "+0.2 vs avg",
    isPositive: true,
    icon: Star,
    iconBg: "bg-yellow-500/15 border-yellow-500/30",
    iconColor: "text-amber-600",
    borderAccent: "hover:border-yellow-500/40",
  },
];

export default function KpiCards() {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold font-serif uppercase tracking-wider text-[#7A5A43]">
          Key Business Indicators
        </h2>
        <span className="text-[11px] font-semibold text-[#8C4A21] bg-[#8C4A21]/10 px-2.5 py-1 rounded-full border border-[#8C4A21]/15">
          Real-Time Synced
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {KPI_LIST.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <motion.div
              key={kpi.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className={`bg-[#FFFDF9] rounded-3xl p-5 border border-[#E5D5C5] shadow-sm hover:shadow-md transition-all ${kpi.borderAccent} relative overflow-hidden group cursor-pointer flex flex-col justify-between`}
            >
              {/* Top Row: Title & Icon */}
              <div className="flex items-start justify-between gap-3">
                <span className="text-xs font-extrabold uppercase tracking-wider text-[#7A5A43]">
                  {kpi.title}
                </span>
                <div className={`w-9 h-9 rounded-2xl border flex items-center justify-center shrink-0 transition-transform group-hover:scale-110 ${kpi.iconBg}`}>
                  <Icon className={`w-4 h-4 ${kpi.iconColor}`} />
                </div>
              </div>

              {/* Middle Row: Large Value */}
              <div className="my-3">
                <div className="text-2xl sm:text-3xl font-black font-serif text-[#3D2314] tracking-tight">
                  {kpi.value}
                </div>
              </div>

              {/* Bottom Row: Badge & Subtitle */}
              <div className="pt-2 border-t border-[#E5D5C5]/60 flex items-center justify-between text-xs">
                <span className="text-[11px] text-[#7A5A43]/80 font-medium truncate max-w-[140px]" title={kpi.subtitle}>
                  {kpi.subtitle}
                </span>
                <span
                  className={`inline-flex items-center gap-0.5 text-[10px] font-extrabold px-2 py-0.5 rounded-full shrink-0 ${
                    kpi.isPositive
                      ? "bg-emerald-500/10 text-emerald-700 border border-emerald-500/20"
                      : "bg-rose-500/10 text-rose-700 border border-rose-500/20"
                  }`}
                >
                  {kpi.isPositive ? (
                    <TrendingUp className="w-3 h-3" />
                  ) : (
                    <TrendingDown className="w-3 h-3" />
                  )}
                  {kpi.change}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
