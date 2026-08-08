"use client";

import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import AdminSidebar from "@/components/admin/layout/AdminSidebar";
import AdminNavbar from "@/components/admin/layout/AdminNavbar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  // Sidebar responsiveness state
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      let role = localStorage.getItem("role");

      if (!role) {
        const storedUser = localStorage.getItem("royalcafe_user") || localStorage.getItem("user");
        if (storedUser) {
          try {
            const user = JSON.parse(storedUser);
            role = user.role;
          } catch {
            role = null;
          }
        }
      }

      if (role !== "admin") {
        setIsAuthorized(false);
        router.push("/login");
      } else {
        setIsAuthorized(true);
      }
    };

    checkAuth();
    window.addEventListener("auth-state-change", checkAuth);
    return () => {
      window.removeEventListener("auth-state-change", checkAuth);
    };
  }, [router, pathname]);

  if (isAuthorized === null) {
    return (
      <div className="min-h-screen bg-[#2A1506] flex items-center justify-center text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-full border-4 border-amber-400 border-t-transparent animate-spin" />
          <span className="text-xs font-bold uppercase tracking-widest text-amber-300">
            Authenticating Admin Portal...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#F7F0E6] text-[#3D2314] overflow-hidden">
      {/* Left Sidebar (Desktop, Tablet & Mobile Drawer) */}
      <AdminSidebar
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        mobileOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Navbar */}
        <AdminNavbar
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
          onToggleTabletCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        />

        {/* Scrollable Content Container */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6">
          {children}
        </main>
      </div>
    </div>
  );
}
