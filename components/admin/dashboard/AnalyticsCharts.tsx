"use client";

import React, { useState } from "react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { TrendingUp, Calendar, DollarSign, BarChart3 } from "lucide-react";
import { motion } from "framer-motion";

// Sample Data for Revenue
const REVENUE_DATA = {
  daily: [
    { time: "08 AM", cafeSales: 2100, workspace: 1400, total: 3500 },
    { time: "10 AM", cafeSales: 4200, workspace: 2800, total: 7000 },
    { time: "12 PM", cafeSales: 6800, workspace: 4100, total: 10900 },
    { time: "02 PM", cafeSales: 8900, workspace: 5200, total: 14100 },
    { time: "04 PM", cafeSales: 12400, workspace: 6900, total: 19300 },
    { time: "06 PM", cafeSales: 15600, workspace: 7900, total: 23500 },
    { time: "08 PM", cafeSales: 16800, workspace: 8050, total: 24850 },
  ],
  weekly: [
    { time: "Mon", cafeSales: 18200, workspace: 9400, total: 27600 },
    { time: "Tue", cafeSales: 21400, workspace: 10800, total: 32200 },
    { time: "Wed", cafeSales: 19800, workspace: 11200, total: 31000 },
    { time: "Thu", cafeSales: 24500, workspace: 12900, total: 37400 },
    { time: "Fri", cafeSales: 29800, workspace: 15400, total: 45200 },
    { time: "Sat", cafeSales: 34200, workspace: 17800, total: 52000 },
    { time: "Sun", cafeSales: 31000, workspace: 16200, total: 47200 },
  ],
  monthly: [
    { time: "Jan", cafeSales: 480000, workspace: 240000, total: 720000 },
    { time: "Feb", cafeSales: 520000, workspace: 265000, total: 785000 },
    { time: "Mar", cafeSales: 590000, workspace: 310000, total: 900000 },
    { time: "Apr", cafeSales: 640000, workspace: 340000, total: 980000 },
    { time: "May", cafeSales: 710000, workspace: 380000, total: 1090000 },
    { time: "Jun", cafeSales: 760000, workspace: 410000, total: 1170000 },
  ],
};

// Sample Data for Reservations
const RESERVATION_DATA = {
  bookings: [
    { time: "9 AM", count: 2, capacity: 8 },
    { time: "11 AM", count: 5, capacity: 12 },
    { time: "1 PM", count: 9, capacity: 14 },
    { time: "3 PM", count: 7, capacity: 14 },
    { time: "5 PM", count: 12, capacity: 16 },
    { time: "7 PM", count: 8, capacity: 16 },
  ],
  walkins: [
    { time: "9 AM", count: 1, capacity: 5 },
    { time: "11 AM", count: 4, capacity: 8 },
    { time: "1 PM", count: 8, capacity: 10 },
    { time: "3 PM", count: 6, capacity: 10 },
    { time: "5 PM", count: 10, capacity: 12 },
    { time: "7 PM", count: 5, capacity: 8 },
  ],
  workspaces: [
    { time: "9 AM", count: 4, capacity: 6 },
    { time: "11 AM", count: 6, capacity: 6 },
    { time: "1 PM", count: 6, capacity: 6 },
    { time: "3 PM", count: 5, capacity: 6 },
    { time: "5 PM", count: 5, capacity: 6 },
    { time: "7 PM", count: 3, capacity: 6 },
  ],
};

export default function AnalyticsCharts() {
  const [revenueFilter, setRevenueFilter] = useState<"daily" | "weekly" | "monthly">("daily");
  const [reservationFilter, setReservationFilter] = useState<"bookings" | "walkins" | "workspaces">("bookings");

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* LEFT: Revenue Analytics */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="bg-[#FFFDF9] rounded-3xl p-6 border border-[#E5D5C5] shadow-sm flex flex-col justify-between"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-[#8C4A21]" />
              <h3 className="text-lg font-bold font-serif text-[#3D2314]">Revenue Analytics</h3>
            </div>
            <p className="text-xs text-[#7A5A43] mt-0.5">Café sales &amp; workspace reservation breakdown</p>
          </div>

          {/* Time Filter Pills */}
          <div className="bg-[#F8F1EA] p-1 rounded-2xl border border-[#E5D5C5] flex items-center self-start sm:self-auto">
            {(["daily", "weekly", "monthly"] as const).map((period) => (
              <button
                key={period}
                type="button"
                onClick={() => setRevenueFilter(period)}
                className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all capitalize cursor-pointer ${
                  revenueFilter === period
                    ? "bg-[#3D2314] text-white shadow-xs"
                    : "text-[#7A5A43] hover:text-[#3D2314]"
                }`}
              >
                {period}
              </button>
            ))}
          </div>
        </div>

        {/* Area Chart Container */}
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={REVENUE_DATA[revenueFilter]} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8C4A21" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#8C4A21" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="colorWorkspace" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#D97706" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#D97706" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5D5C5" opacity={0.6} />
              <XAxis dataKey="time" stroke="#7A5A43" fontSize={11} tickLine={false} />
              <YAxis stroke="#7A5A43" fontSize={11} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#3D2314",
                  borderColor: "#8C4A21",
                  borderRadius: "16px",
                  color: "#fff",
                  fontSize: "12px",
                  boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.3)",
                }}
                formatter={(value: any) => [`₹${Number(value).toLocaleString()}`, "Amount"]}
              />
              <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: "12px", color: "#3D2314" }} />
              <Area type="monotone" dataKey="total" name="Total Revenue (₹)" stroke="#8C4A21" strokeWidth={3} fillOpacity={1} fill="url(#colorTotal)" />
              <Area type="monotone" dataKey="workspace" name="Workspace Sales (₹)" stroke="#D97706" strokeWidth={2} fillOpacity={1} fill="url(#colorWorkspace)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* RIGHT: Reservation Analytics */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="bg-[#FFFDF9] rounded-3xl p-6 border border-[#E5D5C5] shadow-sm flex flex-col justify-between"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-amber-700" />
              <h3 className="text-lg font-bold font-serif text-[#3D2314]">Reservation Analytics</h3>
            </div>
            <p className="text-xs text-[#7A5A43] mt-0.5">Booking volumes vs floor seating capacity</p>
          </div>

          {/* Type Filter Pills */}
          <div className="bg-[#F8F1EA] p-1 rounded-2xl border border-[#E5D5C5] flex items-center self-start sm:self-auto">
            {(["bookings", "walkins", "workspaces"] as const).map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setReservationFilter(type)}
                className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all capitalize cursor-pointer ${
                  reservationFilter === type
                    ? "bg-[#8C4A21] text-white shadow-xs"
                    : "text-[#7A5A43] hover:text-[#3D2314]"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Bar Chart Container */}
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={RESERVATION_DATA[reservationFilter]} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5D5C5" opacity={0.6} />
              <XAxis dataKey="time" stroke="#7A5A43" fontSize={11} tickLine={false} />
              <YAxis stroke="#7A5A43" fontSize={11} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#3D2314",
                  borderColor: "#8C4A21",
                  borderRadius: "16px",
                  color: "#fff",
                  fontSize: "12px",
                }}
              />
              <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: "12px" }} />
              <Bar dataKey="count" name="Active Guests" fill="#8C4A21" radius={[8, 8, 0, 0]} />
              <Bar dataKey="capacity" name="Max Capacity" fill="#E5D5C5" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </div>
  );
}
