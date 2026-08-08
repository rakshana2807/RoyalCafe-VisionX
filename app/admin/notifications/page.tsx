"use client";

import React, { useState } from "react";
import { Bell, CheckCircle2, AlertTriangle, XCircle, Info, Trash2 } from "lucide-react";

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  type: "success" | "warning" | "error" | "info";
  read: boolean;
}

export default function AdminNotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    { id: "1", title: "New Reservation Created", message: "Customer Rahul Sharma booked Single Desk #04 for 2:00 PM.", time: "10 mins ago", type: "success", read: false },
    { id: "2", title: "Payment Received", message: "Received ₹418 for Booking #RCC-2026-000145 via UPI.", time: "25 mins ago", type: "success", read: false },
    { id: "3", title: "WiFi Session Expired", message: "Device MAC 9C:1D:6E reached the 1-hour free limit.", time: "40 mins ago", type: "info", read: true },
    { id: "4", title: "Payment Failed Alert", message: "Transaction #PAY-88123 failed for Desk #12.", time: "1 hour ago", type: "error", read: true },
    { id: "5", title: "System Backup Successful", message: "MongoDB Atlas automated snapshot completed.", time: "2 hours ago", type: "info", read: true },
  ]);

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black font-serif text-[#2A1506]  tracking-tight">
            Real-Time Notifications &amp; System Alerts
          </h1>
          <p className="text-xs text-foreground/60  font-sans">
            Instant logs for bookings, payment triggers, WiFi session events &amp; system alerts
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={markAllRead}
            className="px-4 py-2 rounded-2xl bg-[#DCC8B2] border border-primary/10 hover:bg-green-200 text-xs font-bold text-primary  transition-colors cursor-pointer"
          >
            Mark All Read
          </button>
          <button
            onClick={clearAll}
            className="px-4 py-2 rounded-2xl bg-[#DCC8B2] hover:bg-rose-200 text-xs font-bold text-primary transition-colors cursor-pointer"
          >
            Clear Inbox
          </button>
        </div>
      </div>

      <div className="bg-[#DCC8B2] rounded-3xl border border-primary/10 p-6 shadow-xs space-y-3">
        {notifications.length > 0 ? (
          notifications.map((n) => (
            <div
              key={n.id}
              className={`p-4 rounded-2xl border flex items-start justify-between gap-4 transition-all ${
                n.read ? "bg-white dark:bg-[#E9DCCE] border-primary/5" : "bg-[#E9DCCE] border-[#EA5A0C]/20 shadow-xs"
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5">
                  {n.type === "success" && <CheckCircle2 className="h-5 w-5 text-emerald-600" />}
                  {n.type === "warning" && <AlertTriangle className="h-5 w-5 text-amber-600" />}
                  {n.type === "error" && <XCircle className="h-5 w-5 text-rose-600" />}
                  {n.type === "info" && <Info className="h-5 w-5 text-blue-600" />}
                </div>
                <div>
                  <h4 className="font-bold text-xs text-primary ">{n.title}</h4>
                  <p className="text-xs text-foreground/70  mt-0.5">{n.message}</p>
                </div>
              </div>

              <span className="text-[12px] text-foreground/40 font-mono shrink-0">{n.time}</span>
            </div>
          ))
        ) : (
          <div className="py-12 text-center text-xs text-foreground/50 font-semibold">
            Notification inbox is clear. No unread alerts.
          </div>
        )}
      </div>
    </div>
  );
}
