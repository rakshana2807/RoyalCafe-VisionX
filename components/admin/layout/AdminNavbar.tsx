"use client";

import React, { useState, useEffect } from "react";
import { Search, Bell, Clock, ShieldCheck, Menu, Coffee } from "lucide-react";
import Link from "next/link";

interface AdminNavbarProps {
  onOpenMobileMenu?: () => void;
  onToggleTabletCollapse?: () => void;
}

export default function AdminNavbar({ onOpenMobileMenu, onToggleTabletCollapse }: AdminNavbarProps) {
  const [timeStr, setTimeStr] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="h-20 bg-surface border-b border-border px-4 sm:px-6 flex items-center justify-between shadow-xs z-20 transition-colors shrink-0">
      {/* Mobile Hamburger & Logo Header */}
      <div className="flex items-center gap-3">
        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 rounded-xl bg-background hover:bg-primary hover:text-background text-primary transition-all cursor-pointer border border-border"
          title="Open Navigation Menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Mobile Brand Logo */}
        <Link href="/admin/dashboard" className="flex items-center gap-2 lg:hidden">
          <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-background shadow-xs">
            <Coffee className="h-4 w-4" />
          </div>
          <span className="font-serif font-black text-base text-primary/90">
            RoyalCafe
          </span>
        </Link>
      </div>

      {/* Search Bar */}
      <div className="hidden sm:flex items-center gap-3 flex-1 max-w-md mx-4">
        <div className="relative w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground/80" />
          <input
            type="text"
            placeholder="Search reservations, customers, menu, payments..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-border text-xs bg-background text-primary placeholder-foreground/40 focus:outline-none focus:border-accent transition-all font-medium"
          />
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3.5">
        {/* Real-time Clock */}
        <div className="hidden md:flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-background border border-border text-xs font-mono font-semibold text-primary">
          <Clock className="h-3.5 w-3.5 text-accent" />
          <span>{timeStr || "12:00:00 PM"}</span>
        </div>

        {/* Notification Bell */}
        <div className="relative">
          <button
            className="p-2.5 rounded-2xl bg-background border border-border hover:border-accent text-primary transition-all relative cursor-pointer"
            title="Notifications"
          >
            <Bell className="h-4 w-4 text-accent" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-rose-500 animate-ping" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-rose-500" />
          </button>
        </div>

        {/* Admin Avatar & Profile Badge */}
        <div className="flex items-center gap-2.5 pl-2 border-l border-border">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-primary text-background flex items-center justify-center font-semibold text-xs sm:text-sm shadow-sm">
            AD
          </div>
          <div className="hidden md:flex flex-col text-left">
            <span className="text-xs font-bold text-primary/90 flex items-center gap-1">
              Administrator <ShieldCheck className="h-3 w-3 text-accent" />
            </span>
            <span className="text-xs text-emerald-700 font-extrabold flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" /> Live Active
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
