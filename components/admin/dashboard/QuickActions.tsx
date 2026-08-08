"use client";

import React, { useState } from "react";
import { Plus, Calendar, Utensils, Armchair, FileText, Tag, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

export default function QuickActions() {
  const router = useRouter();
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleAction = (actionName: string, path?: string) => {
    if (path) {
      router.push(path);
      return;
    }
    setToastMessage(`Action Triggered: ${actionName}`);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const ACTIONS = [
    { label: "Add Reservation", icon: Calendar, path: "/admin/reservations", color: "from-[#8C4A21] to-[#5C2E13]" },
    { label: "Add Menu Item", icon: Utensils, path: "/admin/orders", color: "from-[#6F3A0E] to-[#422007]" },
    { label: "Add Workspace", icon: Armchair, path: "/admin/seats", color: "from-[#8C4A21] to-[#3D2314]" },
    { label: "Generate Report", icon: FileText, path: undefined, color: "from-[#4A2B18] to-[#2B1407]" },
    { label: "Add Offer", icon: Tag, path: undefined, color: "from-[#A65B28] to-[#6F3A0E]" },
  ];

  return (
    <div className="bg-[#FFFDF9] rounded-3xl p-6 border border-[#E5D5C5] shadow-sm space-y-4 relative">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold font-serif text-[#3D2314]">Quick Management Actions</h3>
        <span className="text-xs text-[#7A5A43] font-semibold">Shortcuts</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {ACTIONS.map((act, idx) => {
          const Icon = act.icon;
          return (
            <motion.button
              key={idx}
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => handleAction(act.label, act.path)}
              className={`p-3.5 rounded-2xl bg-gradient-to-r ${act.color} text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer border border-white/10`}
            >
              <Plus className="w-4 h-4 text-amber-300 shrink-0" />
              <span className="truncate">{act.label}</span>
            </motion.button>
          );
        })}
      </div>

      {/* Toast Notification Banner */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="p-3 bg-emerald-700 text-white rounded-2xl text-xs font-semibold flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-300" />
              <span>{toastMessage}</span>
            </div>
            <button onClick={() => setToastMessage(null)} className="text-amber-300 font-bold hover:underline">
              Dismiss
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
