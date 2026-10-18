"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Calendar,
  Armchair,
  ShoppingBag,
  CreditCard,
  Wifi,
  Bell,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Coffee,
  ShieldCheck,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const NAV_ITEMS = [
  { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Reservations", href: "/admin/reservations", icon: Calendar },
  { name: "Seat Management", href: "/admin/seats", icon: Armchair },
  { name: "Orders", href: "/admin/orders", icon: ShoppingBag },
  { name: "Payments", href: "/admin/payments", icon: CreditCard },
  { name: "WiFi Management", href: "/admin/wifi", icon: Wifi },
  { name: "Notifications", href: "/admin/notifications", icon: Bell },
  { name: "Settings", href: "/admin/settings", icon: Settings },
];

interface AdminSidebarProps {
  collapsed?: boolean;
  onToggleCollapse?: () => void;
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export default function AdminSidebar({
  collapsed = false,
  onToggleCollapse,
  mobileOpen = false,
  onCloseMobile,
}: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("role");
    localStorage.removeItem("email");
    localStorage.removeItem("adminEmail");
    localStorage.removeItem("user");
    localStorage.removeItem("royalcafe_user");
    localStorage.removeItem("token");
    window.dispatchEvent(new Event("auth-state-change"));
    router.push("/login");
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[#320000] text-[#F5DAA7] border-r border-[rgba(244,221,165,0.2)] shadow-xl relative">
      {/* Brand Header */}
      <div className="h-20 flex items-center justify-between px-4 border-b border-[rgba(244,221,165,0.2)] shrink-0">
        <Link href="/admin/dashboard" onClick={onCloseMobile} className="flex items-center gap-3 overflow-hidden">
          <div className="w-10 h-10 rounded-2xl bg-[rgba(244,221,165,0.15)] border border-[rgba(244,221,165,0.3)] flex items-center justify-center text-[#F5DAA7] shadow-md shrink-0">
            <Coffee className="h-5 w-5" />
          </div>
          {(!collapsed || mobileOpen) && (
            <div className="flex flex-col">
              <span className="font-serif font-black text-lg text-[#F5DAA7] leading-tight tracking-wide">
                RoyalCafe
              </span>
              <span className="text-xs uppercase font-bold text-[#F5DAA7] tracking-widest flex items-center gap-1">
                <ShieldCheck className="h-3 w-3" /> Admin Hub
              </span>
            </div>
          )}
        </Link>

        {/* Desktop / Tablet Collapse Button */}
        {onToggleCollapse && (
          <button
            type="button"
            onClick={onToggleCollapse}
            className="hidden lg:flex p-1.5 rounded-xl bg-[rgba(244,221,165,0.1)] hover:bg-[#F5DAA7] hover:text-[#320000] text-[#F5DAA7] transition-all cursor-pointer border border-[rgba(244,221,165,0.2)]"
            title={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        )}

        {/* Mobile Close Button */}
        {onCloseMobile && (
          <button
            type="button"
            onClick={onCloseMobile}
            className="lg:hidden p-2 rounded-xl bg-[rgba(244,221,165,0.1)] hover:bg-[#F5DAA7] hover:text-[#320000] text-[#F5DAA7] transition-all cursor-pointer border border-[rgba(244,221,165,0.2)]"
            title="Close Drawer"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 py-4 px-3 space-y-1.5 overflow-y-auto custom-scrollbar">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (pathname === "/admin" && item.href === "/admin/dashboard");

          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={onCloseMobile}
              className={`flex items-center gap-3.5 px-3.5 py-3 rounded-2xl text-xs font-semibold transition-all min-h-[44px] ${
                isActive
                  ? "bg-[#F5DAA7] text-[#320000] font-bold shadow-md"
                  : "text-[#F5DAA7]/80 hover:bg-[#200000] hover:text-[#F5DAA7]"
              } ${collapsed && !mobileOpen ? "justify-center px-0" : ""}`}
              title={collapsed && !mobileOpen ? item.name : undefined}
            >
              <Icon className={`h-5 w-5 shrink-0 ${isActive ? "text-[#320000]" : "text-[#F5DAA7]"}`} />
              {(!collapsed || mobileOpen) && <span>{item.name}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Footer / Logout */}
      <div className="p-3 border-t border-[rgba(244,221,165,0.2)] shrink-0">
        <button
          type="button"
          onClick={() => {
            if (onCloseMobile) onCloseMobile();
            handleLogout();
          }}
          className={`w-full flex items-center gap-3.5 px-3.5 py-3 rounded-2xl text-xs font-bold text-rose-300 hover:bg-rose-950/40 hover:text-rose-200 transition-all cursor-pointer min-h-[44px] ${
            collapsed && !mobileOpen ? "justify-center px-0" : ""
          }`}
          title={collapsed && !mobileOpen ? "Logout" : undefined}
        >
          <LogOut className="h-5 w-5 shrink-0" />
          {(!collapsed || mobileOpen) && <span>Logout</span>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop & Tablet Sidebar */}
      <aside
        className={`hidden lg:flex flex-col h-screen sticky top-0 transition-all duration-300 z-30 shrink-0 ${
          collapsed ? "w-20" : "w-64"
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Navigation Drawer Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <div className="fixed inset-0 z-50 lg:hidden overflow-hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onCloseMobile}
              className="absolute inset-0 bg-background/60 backdrop-blur-xs"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="relative w-72 max-w-[80vw] h-full shadow-2xl z-10"
            >
              {sidebarContent}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
