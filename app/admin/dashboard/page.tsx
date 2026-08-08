"use client";

import React from "react";
import WelcomeBanner from "@/components/admin/dashboard/WelcomeBanner";
import QuickActions from "@/components/admin/dashboard/QuickActions";
import KpiCards from "@/components/admin/dashboard/KpiCards";
import AnalyticsCharts from "@/components/admin/dashboard/AnalyticsCharts";
import TodayReservationsTable from "@/components/admin/dashboard/TodayReservationsTable";
import BusinessInsights from "@/components/admin/dashboard/BusinessInsights";
import NotificationsPanel from "@/components/admin/dashboard/NotificationsPanel";

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6 pb-8 text-[#3D2314]">
      {/* Welcome Hero Banner */}
      <WelcomeBanner />

      {/* Quick Management Shortcuts */}
      <QuickActions />

      {/* Top 8 KPI Statistic Cards */}
      <KpiCards />

      {/* Revenue & Reservation Analytics Charts */}
      <AnalyticsCharts />

      {/* Today's Reservations Table (Full Width) */}
      <TodayReservationsTable />

      {/* System Notifications & Alerts (Separate Full Width Card Below Table) */}
      <NotificationsPanel />

      {/* AI Business Insights */}
      <BusinessInsights />
    </div>
  );
}
