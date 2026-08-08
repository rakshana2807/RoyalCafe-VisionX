"use client";

import React, { useState } from "react";
import { Bell, AlertCircle, CheckCircle2, Clock, ShieldCheck, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  type: "booking" | "stock" | "membership" | "payment";
  isRead: boolean;
}

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  { id: "n-1", title: "New Reservation Alert", message: "Sarah Jenkins booked Desk D-04 for 2:30 PM today.", time: "3 mins ago", type: "booking", isRead: false },
  { id: "n-2", title: "Low Stock Alert", message: "Royal Dark Espresso beans stock is below 15%. Restock required.", time: "18 mins ago", type: "stock", isRead: false },
  { id: "n-3", title: "Membership Expiring", message: "John Doe's Monthly VIP Pass expires in 2 days.", time: "45 mins ago", type: "membership", isRead: true },
  { id: "n-4", title: "Payment Completed", message: "Payment of ₹1,450 completed for Order #104 via UPI.", time: "1 hour ago", type: "payment", isRead: true },
];

export default function NotificationsPanel() {
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);

  const dismissNotification = (id: string) => {
    setNotifications((prev) => prev.filter((item) => item.id !== id));
  };

  const getBadgeStyle = (type: NotificationItem["type"]) => {
    switch (type) {
      case "booking":
        return "bg-blue-500/10 text-blue-700 border-blue-500/20";
      case "stock":
        return "bg-rose-500/10 text-rose-700 border-rose-500/20";
      case "membership":
        return "bg-amber-500/10 text-amber-800 border-amber-500/20";
      case "payment":
        return "bg-emerald-500/10 text-emerald-700 border-emerald-500/20";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.55 }}
      className="bg-[#FFFDF9] rounded-3xl p-6 border border-[#E5D5C5] shadow-sm space-y-4"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell className="w-5 h-5 text-[#8C4A21]" />
          <h3 className="text-lg font-bold font-serif text-[#3D2314]">System Notifications</h3>
        </div>
        <span className="text-xs font-mono font-bold text-[#8C4A21] bg-[#F8F1EA] px-2.5 py-1 rounded-full border border-[#E5D5C5]">
          {notifications.length} Alerts
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        <AnimatePresence>
          {notifications.length > 0 ? (
            notifications.map((n) => (
              <motion.div
                key={n.id}
                initial={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95, height: 0 }}
                className={`p-4 rounded-2xl border flex items-start justify-between gap-3 ${getBadgeStyle(n.type)} transition-all shadow-2xs`}
              >
                <div className="space-y-1 pr-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-[#3D2314]">{n.title}</span>
                    {!n.isRead && (
                      <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-[#7A5A43] leading-relaxed">{n.message}</p>
                  <div className="text-[10px] text-[#7A5A43]/70 font-mono font-semibold pt-1">
                    {n.time}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => dismissNotification(n.id)}
                  className="text-foreground/40 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-100/50 transition-colors cursor-pointer shrink-0"
                  title="Dismiss alert"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full py-6 text-center text-xs text-[#7A5A43]">All notifications cleared.</div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
