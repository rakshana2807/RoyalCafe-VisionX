"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Wifi,
  Clock,
  ShieldCheck,
  Ban,
  Plus,
  RefreshCw,
  Zap,
  Laptop,
  Smartphone,
  Tablet,
  Monitor,
  AlertTriangle,
  Search,
  Filter,
  ArrowUpDown,
  CheckCircle2,
  XCircle,
  X,
  Download,
  Settings,
  CreditCard,
  TrendingUp,
  User,
  MapPin,
  Activity,
  Signal,
  Eye,
  ShieldAlert,
  Sparkles,
  ChevronRight,
  LogOut,
  Lock,
  Unlock,
  BarChart3,
  Flame,
  UserCheck
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export type SessionStatus = "Active" | "Expiring Soon" | "Expired" | "Disconnected" | "Blocked";
export type SignalLevel = "Excellent" | "Good" | "Fair" | "Weak";
export type DeviceCategory = "Laptop" | "Phone" | "Tablet" | "Desktop";

export interface WifiSessionRecord {
  id: string; // Session ID e.g. WIFI-801
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  reservationId: string; // e.g. RES-1023
  deskId: string; // e.g. T-04, W-02, P-01
  workspaceType: string;
  deviceCategory: DeviceCategory;
  deviceName: string; // e.g. MacBook Pro M2
  osName: string; // e.g. macOS Sonoma
  macAddress: string;
  ipAddress: string;
  loginTime: string;
  remainingSeconds: number; // For live countdown timer!
  totalSeconds: number;
  usedBytesMB: number; // e.g. 620
  totalBytesMB: number; // e.g. 2048 (2GB) or -1 for Unlimited
  planName: string; // e.g. Free Tier, High-Speed Day Pass
  planPrice: string;
  paymentStatus: "Paid" | "Complimentary" | "Pending";
  signalStrength: SignalLevel;
  status: SessionStatus;
  blockedReason?: string;
  createdAt: string;
}

export interface ActivityFeedItem {
  id: string;
  title: string;
  customerName: string;
  subtitle: string;
  time: string;
  colorDot: "green" | "orange" | "blue" | "red";
  type: "connect" | "purchase" | "checkin" | "expire" | "block";
}

const INITIAL_SESSIONS: WifiSessionRecord[] = [
  {
    id: "WIFI-801",
    customerName: "Rahul Sharma",
    customerEmail: "rahul@gmail.com",
    customerPhone: "+91 98765 43210",
    reservationId: "RES-1023",
    deskId: "W-02",
    workspaceType: "Workstation",
    deviceCategory: "Laptop",
    deviceName: "MacBook Pro M2",
    osName: "macOS Sonoma",
    macAddress: "7A:9B:4C:12:34:56",
    ipAddress: "192.168.1.102",
    loginTime: "09:30 AM",
    remainingSeconds: 6138, // 1h 42m 18s
    totalSeconds: 14400,
    usedBytesMB: 620,
    totalBytesMB: 2048, // 2 GB
    planName: "High-Speed Day Pass",
    planPrice: "₹199",
    paymentStatus: "Paid",
    signalStrength: "Excellent",
    status: "Active",
    createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
  },
  {
    id: "WIFI-802",
    customerName: "Sarah Jenkins",
    customerEmail: "sarah.j@gmail.com",
    customerPhone: "+91 98123 45678",
    reservationId: "RES-1024",
    deskId: "T-04",
    workspaceType: "Café Table",
    deviceCategory: "Phone",
    deviceName: "iPhone 15 Pro",
    osName: "iOS 17.4",
    macAddress: "8B:0C:5D:23:45:67",
    ipAddress: "192.168.1.115",
    loginTime: "10:15 AM",
    remainingSeconds: 420, // 7 mins -> Expiring Soon!
    totalSeconds: 3600,
    usedBytesMB: 480,
    totalBytesMB: 500, // <10% left -> Low Data Alert!
    planName: "Complimentary Free 1 Hr",
    planPrice: "Free",
    paymentStatus: "Complimentary",
    signalStrength: "Good",
    status: "Expiring Soon",
    createdAt: new Date(Date.now() - 1000 * 60 * 53).toISOString(),
  },
  {
    id: "WIFI-803",
    customerName: "Anita Desai",
    customerEmail: "anita.desai@company.com",
    customerPhone: "+91 97654 32109",
    reservationId: "RES-1025",
    deskId: "M-02",
    workspaceType: "Meeting Room",
    deviceCategory: "Laptop",
    deviceName: "Dell XPS 15",
    osName: "Windows 11 Pro",
    macAddress: "9C:1D:6E:34:56:78",
    ipAddress: "192.168.1.128",
    loginTime: "11:00 AM",
    remainingSeconds: 18200, // 5h 03m
    totalSeconds: 28800,
    usedBytesMB: 1430,
    totalBytesMB: -1, // Unlimited
    planName: "VIP Meeting Room Pass",
    planPrice: "₹499",
    paymentStatus: "Paid",
    signalStrength: "Excellent",
    status: "Active",
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
  },
  {
    id: "WIFI-804",
    customerName: "Vikram Patel",
    customerEmail: "vikram.p@yahoo.com",
    customerPhone: "+91 96543 21098",
    reservationId: "RES-1026",
    deskId: "P-01",
    workspaceType: "Private Cabin",
    deviceCategory: "Tablet",
    deviceName: "iPad Pro 12.9",
    osName: "iPadOS 17.2",
    macAddress: "6F:2E:7A:89:10:11",
    ipAddress: "192.168.1.140",
    loginTime: "11:30 AM",
    remainingSeconds: 12400,
    totalSeconds: 28800,
    usedBytesMB: 890,
    totalBytesMB: -1, // Unlimited
    planName: "Weekly VIP Pass",
    planPrice: "₹799",
    paymentStatus: "Paid",
    signalStrength: "Excellent",
    status: "Active",
    createdAt: new Date(Date.now() - 1000 * 60 * 20).toISOString(),
  },
  {
    id: "WIFI-805",
    customerName: "Elena Rostova",
    customerEmail: "elena.r@design.io",
    customerPhone: "+91 95432 10987",
    reservationId: "RES-1027",
    deskId: "Study-05",
    workspaceType: "Study Space",
    deviceCategory: "Laptop",
    deviceName: "Lenovo ThinkPad X1",
    osName: "Linux Ubuntu 24.04",
    macAddress: "5D:1C:8B:90:21:32",
    ipAddress: "192.168.1.152",
    loginTime: "08:30 AM",
    remainingSeconds: 0,
    totalSeconds: 7200,
    usedBytesMB: 1000,
    totalBytesMB: 1024,
    planName: "Complimentary Free 1 Hr",
    planPrice: "Free",
    paymentStatus: "Complimentary",
    signalStrength: "Fair",
    status: "Expired",
    createdAt: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
  },
  {
    id: "WIFI-806",
    customerName: "Michael Chang",
    customerEmail: "m.chang@tech.com",
    customerPhone: "+91 94321 09876",
    reservationId: "RES-1028",
    deskId: "D-03",
    workspaceType: "Hot Desk",
    deviceCategory: "Phone",
    deviceName: "Samsung Galaxy S24",
    osName: "Android 14",
    macAddress: "4C:0B:9A:01:32:43",
    ipAddress: "192.168.1.165",
    loginTime: "01:00 PM",
    remainingSeconds: 0,
    totalSeconds: 3600,
    usedBytesMB: 310,
    totalBytesMB: 500,
    planName: "Complimentary Free 1 Hr",
    planPrice: "Free",
    paymentStatus: "Complimentary",
    signalStrength: "Weak",
    status: "Disconnected",
    createdAt: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
  },
  {
    id: "WIFI-807",
    customerName: "Unknown User",
    customerEmail: "suspicious@bot.net",
    customerPhone: "Unknown",
    reservationId: "N/A",
    deskId: "Public Lobby",
    workspaceType: "Public Area",
    deviceCategory: "Desktop",
    deviceName: "Unknown Linux Rig",
    osName: "Kali Linux",
    macAddress: "FF:EE:DD:CC:BB:AA",
    ipAddress: "192.168.1.199",
    loginTime: "07:15 AM",
    remainingSeconds: 0,
    totalSeconds: 0,
    usedBytesMB: 4200,
    totalBytesMB: 0,
    planName: "Unauthenticated",
    planPrice: "₹0",
    paymentStatus: "Pending",
    signalStrength: "Fair",
    status: "Blocked",
    blockedReason: "Suspicious Activity / Port Scanning",
    createdAt: new Date(Date.now() - 1000 * 60 * 300).toISOString(),
  },
  {
    id: "WIFI-808",
    customerName: "Priya Nair",
    customerEmail: "priya.nair@startup.in",
    customerPhone: "+91 93210 98765",
    reservationId: "RES-1029",
    deskId: "W-04",
    workspaceType: "Workstation",
    deviceCategory: "Laptop",
    deviceName: "ASUS ROG Zephyrus",
    osName: "Windows 11 Home",
    macAddress: "3B:9A:89:12:43:54",
    ipAddress: "192.168.1.171",
    loginTime: "01:30 PM",
    remainingSeconds: 9800,
    totalSeconds: 14400,
    usedBytesMB: 1200,
    totalBytesMB: 4096, // 4 GB
    planName: "High-Speed Day Pass",
    planPrice: "₹199",
    paymentStatus: "Paid",
    signalStrength: "Excellent",
    status: "Active",
    createdAt: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
  },
  {
    id: "WIFI-809",
    customerName: "David Miller",
    customerEmail: "david.m@finance.com",
    customerPhone: "+91 92109 87654",
    reservationId: "RES-1030",
    deskId: "P-03",
    workspaceType: "Private Cabin",
    deviceCategory: "Laptop",
    deviceName: "HP Spectre x360",
    osName: "Windows 11 Pro",
    macAddress: "2A:89:78:23:54:65",
    ipAddress: "192.168.1.180",
    loginTime: "02:00 PM",
    remainingSeconds: 520, // 8 mins -> Expiring Soon!
    totalSeconds: 7200,
    usedBytesMB: 1850,
    totalBytesMB: 2048,
    planName: "High-Speed Day Pass",
    planPrice: "₹199",
    paymentStatus: "Paid",
    signalStrength: "Good",
    status: "Expiring Soon",
    createdAt: new Date(Date.now() - 1000 * 60 * 110).toISOString(),
  },
  {
    id: "WIFI-810",
    customerName: "Aarav Gupta",
    customerEmail: "aarav.g@gmail.com",
    customerPhone: "+91 91098 76543",
    reservationId: "RES-1031",
    deskId: "T-08",
    workspaceType: "Café Table",
    deviceCategory: "Phone",
    deviceName: "Google Pixel 8 Pro",
    osName: "Android 14",
    macAddress: "19:78:67:34:65:76",
    ipAddress: "192.168.1.189",
    loginTime: "02:15 PM",
    remainingSeconds: 3200,
    totalSeconds: 3600,
    usedBytesMB: 140,
    totalBytesMB: 500,
    planName: "Complimentary Free 1 Hr",
    planPrice: "Free",
    paymentStatus: "Complimentary",
    signalStrength: "Good",
    status: "Active",
    createdAt: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
  },
];

const INITIAL_ACTIVITIES: ActivityFeedItem[] = [
  { id: "act-1", title: "Rahul Sharma connected to WiFi", customerName: "Rahul Sharma", subtitle: "MacBook Pro M2 • Desk W-02", time: "2 mins ago", colorDot: "green", type: "connect" },
  { id: "act-2", title: "Sarah Jenkins upgraded to Premium Pass", customerName: "Sarah Jenkins", subtitle: "High-Speed Day Pass (₹199)", time: "10 mins ago", colorDot: "orange", type: "purchase" },
  { id: "act-3", title: "John checked into Desk D-08", customerName: "John Doe", subtitle: "Desk D-08 • Free Tier Activated", time: "25 mins ago", colorDot: "blue", type: "checkin" },
  { id: "act-4", title: "Session expired for Device M-14", customerName: "Elena Rostova", subtitle: "Study-05 • 2 Hours Completed", time: "40 mins ago", colorDot: "red", type: "expire" },
  { id: "act-5", title: "Premium WiFi activated", customerName: "Anita Desai", subtitle: "Meeting Room M-02 • Unlimited Speed", time: "1 hour ago", colorDot: "green", type: "connect" },
  { id: "act-6", title: "Complimentary Pass assigned", customerName: "Aarav Gupta", subtitle: "T-08 • 1 Hour Free Pass", time: "1.5 hours ago", colorDot: "orange", type: "purchase" },
];

export default function AdminWifiPage() {
  const [sessions, setSessions] = useState<WifiSessionRecord[]>(INITIAL_SESSIONS);
  const [activities, setActivities] = useState<ActivityFeedItem[]>(INITIAL_ACTIVITIES);
  const [searchQuery, setSearchQuery] = useState("");
  const [planFilter, setPlanFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [workspaceFilter, setWorkspaceFilter] = useState("All");
  const [sortBy, setSortBy] = useState("default");

  // Drawer / Modals
  const [activeDrawerSession, setActiveDrawerSession] = useState<WifiSessionRecord | null>(null);
  const [blockingSession, setBlockingSession] = useState<WifiSessionRecord | null>(null);
  const [blockReasonInput, setBlockReasonInput] = useState("Suspicious Activity");
  const [showCreatePassModal, setShowCreatePassModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  // Live Timer tick every second
  useEffect(() => {
    const timer = setInterval(() => {
      setSessions((prev) =>
        prev.map((s) => {
          if (s.status === "Active" || s.status === "Expiring Soon") {
            const nextSec = Math.max(0, s.remainingSeconds - 1);
            let nextStatus: SessionStatus = s.status;
            if (nextSec === 0) {
              nextStatus = "Expired";
            } else if (nextSec < 600) { // < 10 mins remaining
              nextStatus = "Expiring Soon";
            }
            return { ...s, remainingSeconds: nextSec, status: nextStatus };
          }
          return s;
        })
      );
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleSyncConnections = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      showToast("🔄 Synced WiFi connections with network controller.");
    }, 1200);
  };

  const handleExtendSession = (id: string, secondsToAdd = 3600) => {
    setSessions((prev) =>
      prev.map((s) =>
        s.id === id
          ? {
              ...s,
              remainingSeconds: s.remainingSeconds + secondsToAdd,
              status: "Active",
            }
          : s
      )
    );
    showToast(`⚡ Extended session for ${id} (+${secondsToAdd / 60} mins)`);
    if (activeDrawerSession && activeDrawerSession.id === id) {
      setActiveDrawerSession((prev) =>
        prev
          ? {
              ...prev,
              remainingSeconds: prev.remainingSeconds + secondsToAdd,
              status: "Active",
            }
          : null
      );
    }
  };

  const handleDisconnectSession = (id: string) => {
    setSessions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, remainingSeconds: 0, status: "Disconnected" } : s))
    );
    showToast(`🔌 Disconnected device session ${id}`);
    if (activeDrawerSession && activeDrawerSession.id === id) {
      setActiveDrawerSession((prev) => (prev ? { ...prev, status: "Disconnected" } : null));
    }
  };

  const handleBlockDevice = () => {
    if (!blockingSession) return;
    setSessions((prev) =>
      prev.map((s) =>
        s.id === blockingSession.id
          ? {
              ...s,
              status: "Blocked",
              remainingSeconds: 0,
              blockedReason: blockReasonInput,
            }
          : s
      )
    );
    showToast(`🚫 Blacklisted MAC address ${blockingSession.macAddress}`);
    setBlockingSession(null);
  };

  const handleUnblockDevice = (id: string) => {
    setSessions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: "Disconnected", blockedReason: undefined } : s))
    );
    showToast(`✅ Unblocked device session ${id}`);
  };

  // Status Rank Sorting
  const STATUS_RANK: Record<SessionStatus, number> = {
    Active: 1,
    "Expiring Soon": 2,
    Expired: 3,
    Disconnected: 4,
    Blocked: 5,
  };

  const filteredAndSortedSessions = useMemo(() => {
    let result = sessions.filter((s) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        s.id.toLowerCase().includes(q) ||
        s.customerName.toLowerCase().includes(q) ||
        s.customerEmail.toLowerCase().includes(q) ||
        s.deviceName.toLowerCase().includes(q) ||
        s.macAddress.toLowerCase().includes(q) ||
        s.deskId.toLowerCase().includes(q) ||
        s.reservationId.toLowerCase().includes(q);

      const matchesPlan = planFilter === "All" || s.planName === planFilter;
      const matchesStatus = statusFilter === "All" || s.status === statusFilter;
      const matchesWorkspace = workspaceFilter === "All" || s.workspaceType === workspaceFilter;

      return matchesSearch && matchesPlan && matchesStatus && matchesWorkspace;
    });

    if (sortBy === "default") {
      result.sort((a, b) => {
        const rankA = STATUS_RANK[a.status] || 99;
        const rankB = STATUS_RANK[b.status] || 99;
        if (rankA !== rankB) return rankA - rankB;
        return b.remainingSeconds - a.remainingSeconds;
      });
    } else if (sortBy === "remaining") {
      result.sort((a, b) => b.remainingSeconds - a.remainingSeconds);
    } else if (sortBy === "usage") {
      result.sort((a, b) => b.usedBytesMB - a.usedBytesMB);
    } else if (sortBy === "login") {
      result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    return result;
  }, [sessions, searchQuery, planFilter, statusFilter, workspaceFilter, sortBy]);

  // Statistics Summary Cards calculation
  const stats = useMemo(() => {
    const activeCount = sessions.filter((s) => s.status === "Active" || s.status === "Expiring Soon").length;
    const premiumCount = sessions.filter((s) => s.planName !== "Complimentary Free 1 Hr").length;
    const freeCount = sessions.filter((s) => s.planName === "Complimentary Free 1 Hr").length;
    const expiredCount = sessions.filter((s) => s.status === "Expired").length;
    const blockedCount = sessions.filter((s) => s.status === "Blocked").length;
    const totalMB = sessions.reduce((sum, s) => sum + s.usedBytesMB, 0);

    return {
      activeCount,
      premiumCount,
      freeCount,
      expiredCount,
      avgDuration: "1 hr 42 mins",
      bandwidthUsage: `8.6 GB`,
      revenue: "₹4,250",
      blockedCount,
    };
  }, [sessions]);

  // Helper formatting for countdown seconds
  const formatTimeSeconds = (totalSec: number) => {
    if (totalSec <= 0) return "00:00:00 Expired";
    const hrs = Math.floor(totalSec / 3600);
    const mins = Math.floor((totalSec % 3600) / 60);
    const secs = totalSec % 60;
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${pad(hrs)}:${pad(mins)}:${pad(secs)} Remaining`;
  };

  const getDeviceIcon = (category: DeviceCategory) => {
    switch (category) {
      case "Laptop":
        return <Laptop className="w-4 h-4 text-[#8C4A21]" />;
      case "Phone":
        return <Smartphone className="w-4 h-4 text-amber-700" />;
      case "Tablet":
        return <Tablet className="w-4 h-4 text-purple-700" />;
      case "Desktop":
        return <Monitor className="w-4 h-4 text-blue-700" />;
    }
  };

  const getSignalStrengthIcon = (level: SignalLevel) => {
    switch (level) {
      case "Excellent":
        return <span className="font-bold text-emerald-700 flex items-center gap-1">📶 Excellent</span>;
      case "Good":
        return <span className="font-bold text-blue-700 flex items-center gap-1">📶 Good</span>;
      case "Fair":
        return <span className="font-bold text-amber-700 flex items-center gap-1">📶 Fair</span>;
      case "Weak":
        return <span className="font-bold text-rose-700 flex items-center gap-1">📶 Weak</span>;
    }
  };

  const getStatusBadge = (status: SessionStatus) => {
    switch (status) {
      case "Active":
        return "bg-emerald-500/15 text-emerald-800 border-emerald-500/30";
      case "Expiring Soon":
        return "bg-amber-500/15 text-amber-800 border-amber-500/30 animate-pulse";
      case "Expired":
        return "bg-slate-500/15 text-slate-700 border-slate-500/30";
      case "Disconnected":
        return "bg-purple-500/15 text-purple-800 border-purple-500/30";
      case "Blocked":
        return "bg-rose-500/15 text-rose-800 border-rose-500/30";
    }
  };

  return (
    <div className="space-y-6 text-[#3D2314]">
      {/* Toast Alert */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-6 right-6 z-50 bg-[#3D2314] text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-amber-500/30 flex items-center gap-3"
          >
            <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
            <span className="text-xs font-bold font-sans">{toast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <Wifi className="w-7 h-7 text-[#8C4A21]" />
            <h1 className="text-2xl sm:text-3xl font-black font-serif text-[#3D2314] tracking-tight">
              WiFi Management Dashboard
            </h1>
          </div>
          <p className="text-xs text-[#7A5A43] mt-1">
            Monitor customer WiFi sessions, bandwidth consumption, premium passes &amp; network security.
          </p>
        </div>

        {/* Top Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={handleSyncConnections}
            className="px-4 py-2.5 rounded-2xl bg-[#FFFDF9] hover:bg-[#3D2314] hover:text-white text-[#3D2314] font-bold text-xs border border-[#E5D5C5] shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? "animate-spin" : ""}`} />
            Sync Connections
          </button>

          <button
            type="button"
            onClick={() => setShowCreatePassModal(true)}
            className="px-4 py-2.5 rounded-2xl bg-[#8C4A21] hover:bg-[#3D2314] text-white font-bold text-xs shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            Create WiFi Pass
          </button>

          <button
            type="button"
            onClick={() => showToast("📤 WiFi sessions exported to CSV.")}
            className="px-4 py-2.5 rounded-2xl bg-[#FFFDF9] hover:bg-[#3D2314] hover:text-white text-[#3D2314] font-bold text-xs border border-[#E5D5C5] shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            Export Sessions
          </button>

          <button
            type="button"
            onClick={() => setShowSettingsModal(true)}
            className="p-2.5 rounded-2xl bg-[#FFFDF9] hover:bg-[#3D2314] hover:text-white text-[#3D2314] border border-[#E5D5C5] shadow-xs transition-all cursor-pointer flex items-center justify-center"
            title="WiFi Settings"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Top 8 Rich KPI Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        {/* Active Users */}
        <div className="bg-[#FFFDF9] rounded-2xl p-3.5 border border-[#E5D5C5] shadow-xs hover:-translate-y-1 hover:shadow-md transition-all duration-200">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-[#7A5A43] uppercase tracking-wider">Active Users</span>
            <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-800">
              <Wifi className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-xl font-bold font-mono text-[#3D2314]">{stats.activeCount}</div>
            <div className="text-[10px] text-emerald-700 font-medium truncate mt-0.5">Online Now</div>
          </div>
        </div>

        {/* Premium Pass Users */}
        <div className="bg-[#FFFDF9] rounded-2xl p-3.5 border border-[#E5D5C5] shadow-xs hover:-translate-y-1 hover:shadow-md transition-all duration-200">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-[#7A5A43] uppercase tracking-wider">Premium Passes</span>
            <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-800">
              <Zap className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-xl font-bold font-mono text-amber-800">{stats.premiumCount}</div>
            <div className="text-[10px] text-amber-700 font-medium truncate mt-0.5">Paid Tier</div>
          </div>
        </div>

        {/* Free WiFi Users */}
        <div className="bg-[#FFFDF9] rounded-2xl p-3.5 border border-[#E5D5C5] shadow-xs hover:-translate-y-1 hover:shadow-md transition-all duration-200">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-[#7A5A43] uppercase tracking-wider">Free Tier</span>
            <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-800">
              <User className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-xl font-bold font-mono text-blue-800">{stats.freeCount}</div>
            <div className="text-[10px] text-blue-700 font-medium truncate mt-0.5">1-Hr Free</div>
          </div>
        </div>

        {/* Expired Sessions */}
        <div className="bg-[#FFFDF9] rounded-2xl p-3.5 border border-[#E5D5C5] shadow-xs hover:-translate-y-1 hover:shadow-md transition-all duration-200">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-[#7A5A43] uppercase tracking-wider">Expired</span>
            <div className="p-1.5 rounded-lg bg-slate-500/10 text-slate-800">
              <Clock className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-xl font-bold font-mono text-slate-800">{stats.expiredCount}</div>
            <div className="text-[10px] text-slate-600 font-medium truncate mt-0.5">Completed</div>
          </div>
        </div>

        {/* Avg Session Duration */}
        <div className="bg-[#FFFDF9] rounded-2xl p-3.5 border border-[#E5D5C5] shadow-xs hover:-translate-y-1 hover:shadow-md transition-all duration-200">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-[#7A5A43] uppercase tracking-wider">Avg Session</span>
            <div className="p-1.5 rounded-lg bg-purple-500/10 text-purple-800">
              <Activity className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-xl font-bold font-mono text-purple-800">{stats.avgDuration}</div>
            <div className="text-[10px] text-purple-700 font-medium truncate mt-0.5">Per Guest</div>
          </div>
        </div>

        {/* Bandwidth Usage */}
        <div className="bg-[#FFFDF9] rounded-2xl p-3.5 border border-[#E5D5C5] shadow-xs hover:-translate-y-1 hover:shadow-md transition-all duration-200">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-[#7A5A43] uppercase tracking-wider">Bandwidth</span>
            <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-800">
              <Signal className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-xl font-bold font-mono text-cyan-800">{stats.bandwidthUsage}</div>
            <div className="text-[10px] text-cyan-700 font-medium truncate mt-0.5">Used Today</div>
          </div>
        </div>

        {/* Revenue */}
        <div className="bg-[#FFFDF9] rounded-2xl p-3.5 border border-[#E5D5C5] shadow-xs hover:-translate-y-1 hover:shadow-md transition-all duration-200">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-[#7A5A43] uppercase tracking-wider">WiFi Revenue</span>
            <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-800">
              <CreditCard className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-xl font-bold font-mono text-[#3D2314]">{stats.revenue}</div>
            <div className="text-[10px] text-emerald-700 font-medium truncate mt-0.5">Pass Sales</div>
          </div>
        </div>

        {/* Blacklisted Devices */}
        <div className="bg-[#FFFDF9] rounded-2xl p-3.5 border border-[#E5D5C5] shadow-xs hover:-translate-y-1 hover:shadow-md transition-all duration-200">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-[#7A5A43] uppercase tracking-wider">Blacklisted</span>
            <div className="p-1.5 rounded-lg bg-rose-500/10 text-rose-800">
              <Ban className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-xl font-bold font-mono text-rose-800">{stats.blockedCount}</div>
            <div className="text-[10px] text-rose-700 font-medium truncate mt-0.5">MAC Blocked</div>
          </div>
        </div>
      </div>

      {/* Toolbar Search & Filters */}
      <div className="bg-[#FFFDF9] p-4 rounded-2xl border border-[#E5D5C5] shadow-sm space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Search */}
          <div className="relative lg:col-span-2">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#7A5A43]" />
            <input
              type="text"
              placeholder="Search Customer Name, Email, Device, MAC, Desk ID (e.g. W-02)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-3 py-2 bg-[#FAF4ED] border border-[#DFCDBE] rounded-xl text-xs text-[#3D2314] focus:outline-none focus:ring-2 focus:ring-[#8C4A21]/30 placeholder-[#7A5A43]/60 transition-all font-medium"
            />
          </div>

          {/* Filter Plan */}
          <div>
            <select
              value={planFilter}
              onChange={(e) => setPlanFilter(e.target.value)}
              className="w-full px-3 py-2 bg-[#FAF4ED] border border-[#DFCDBE] rounded-xl text-xs text-[#3D2314] font-medium focus:outline-none focus:ring-2 focus:ring-[#8C4A21]/30 transition-all cursor-pointer"
            >
              <option value="All">WiFi Plan (All)</option>
              <option value="Complimentary Free 1 Hr">Free 1-Hr Tier</option>
              <option value="High-Speed Day Pass">Day Pass (₹199)</option>
              <option value="VIP Meeting Room Pass">VIP Meeting Pass</option>
              <option value="Weekly VIP Pass">Weekly Pass (₹799)</option>
            </select>
          </div>

          {/* Filter Status */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 bg-[#FAF4ED] border border-[#DFCDBE] rounded-xl text-xs text-[#3D2314] font-medium focus:outline-none focus:ring-2 focus:ring-[#8C4A21]/30 transition-all cursor-pointer"
            >
              <option value="All">Status (All)</option>
              <option value="Active">Active</option>
              <option value="Expiring Soon">Expiring Soon</option>
              <option value="Expired">Expired</option>
              <option value="Disconnected">Disconnected</option>
              <option value="Blocked">Blocked</option>
            </select>
          </div>

          {/* Sort By */}
          <div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3 py-2 bg-[#FAF4ED] border border-[#DFCDBE] rounded-xl text-xs text-[#3D2314] font-medium focus:outline-none focus:ring-2 focus:ring-[#8C4A21]/30 transition-all cursor-pointer"
            >
              <option value="default">Status Rank (Default)</option>
              <option value="remaining">Remaining Time</option>
              <option value="usage">Highest Data Usage</option>
              <option value="login">Latest Login</option>
            </select>
          </div>
        </div>
      </div>

      {/* PART 1 — FULL WIDTH TABLE (Stretches 100% across dashboard content area) */}
      <div className="bg-[#FFFDF9] rounded-2xl border border-[#E5D5C5] shadow-sm overflow-hidden space-y-4">
        <div className="hidden md:block overflow-x-auto max-h-[660px] overflow-y-auto">
          <table className="w-full text-left text-xs text-[#3D2314] border-collapse">
            <thead className="bg-[#F8F1EA] sticky top-0 z-10 uppercase text-[11px] font-extrabold tracking-wider text-[#7A5A43] border-b border-[#E5D5C5]">
              <tr>
                <th className="py-4 px-4 font-bold">Session ID</th>
                <th className="py-4 px-4 font-bold">Customer</th>
                <th className="py-4 px-4 font-bold">Reservation ID</th>
                <th className="py-4 px-4 font-bold">Desk ID</th>
                <th className="py-4 px-4 font-bold">Device &amp; OS</th>
                <th className="py-4 px-4 font-bold">MAC Address</th>
                <th className="py-4 px-4 font-bold">Login Time</th>
                <th className="py-4 px-4 font-bold">Remaining Time</th>
                <th className="py-4 px-4 font-bold">Used Data</th>
                <th className="py-4 px-4 font-bold">Plan</th>
                <th className="py-4 px-4 font-bold">Signal</th>
                <th className="py-4 px-4 font-bold">Status</th>
                <th className="py-4 px-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5D5C5]/60">
              {filteredAndSortedSessions.length > 0 ? (
                filteredAndSortedSessions.map((s, idx) => {
                  const isOdd = idx % 2 !== 0;
                  const isExpiringSoon = s.status === "Expiring Soon" || (s.remainingSeconds > 0 && s.remainingSeconds < 600);
                  const isLowData = s.totalBytesMB > 0 && (s.totalBytesMB - s.usedBytesMB) < (s.totalBytesMB * 0.1);

                  return (
                    <tr
                      key={s.id}
                      className={`${
                        isExpiringSoon
                          ? "bg-amber-100/60"
                          : isOdd
                          ? "bg-[#FBF7F1]/60"
                          : "bg-[#FFFDF9]"
                      } hover:bg-[#F3E9DD] transition-colors`}
                    >
                      {/* 1. Session ID */}
                      <td className="py-4 px-4 font-bold font-mono text-sm text-[#8C4A21] whitespace-nowrap">
                        {s.id}
                      </td>

                      {/* 2. Customer */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <div className="font-bold text-sm text-[#3D2314]">{s.customerName}</div>
                        <div className="text-[11px] text-[#7A5A43]">{s.customerEmail}</div>
                      </td>

                      {/* 3. Reservation ID */}
                      <td className="py-4 px-4 font-mono font-bold text-xs text-[#7A5A43] whitespace-nowrap">
                        {s.reservationId}
                      </td>

                      {/* 4. Desk ID */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <span className="font-extrabold font-mono text-xs text-[#8C4A21] bg-[#F8F1EA] px-3 py-1 rounded-full border border-[#E5D5C5]">
                          {s.deskId}
                        </span>
                      </td>

                      {/* 5. Device & OS */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-1.5 font-bold text-xs text-[#3D2314]">
                          {getDeviceIcon(s.deviceCategory)}
                          <span>{s.deviceName}</span>
                        </div>
                        <div className="text-[11px] text-[#7A5A43] pl-5.5">{s.osName}</div>
                      </td>

                      {/* 6. MAC Address */}
                      <td className="py-4 px-4 font-mono text-xs font-semibold text-[#3D2314] whitespace-nowrap">
                        {s.macAddress}
                      </td>

                      {/* 7. Login Time */}
                      <td className="py-4 px-4 text-xs font-medium text-[#7A5A43] whitespace-nowrap">
                        {s.loginTime}
                      </td>

                      {/* 8. Remaining Time (Live Countdown Timer) */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <span className="font-mono font-extrabold text-xs text-[#8C4A21]">
                          {formatTimeSeconds(s.remainingSeconds)}
                        </span>
                      </td>

                      {/* 9. Used Data + Low Data Alert */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <div className="space-y-1 max-w-[120px]">
                          <div className="flex justify-between text-[11px] font-bold">
                            <span>{s.usedBytesMB} MB</span>
                            <span>{s.totalBytesMB === -1 ? "∞" : `${s.totalBytesMB} MB`}</span>
                          </div>
                          {/* Progress bar */}
                          <div className="w-full h-1.5 bg-[#E5D5C5] rounded-full overflow-hidden">
                            <div
                              className={`h-full ${isLowData ? "bg-amber-600" : "bg-[#8C4A21]"}`}
                              style={{
                                width: `${s.totalBytesMB === -1 ? 35 : Math.min(100, (s.usedBytesMB / s.totalBytesMB) * 100)}%`,
                              }}
                            />
                          </div>
                          {isLowData && (
                            <span className="text-[9px] font-extrabold text-amber-800 bg-amber-100 px-1.5 py-0.5 rounded-full inline-block">
                              ⚠️ &lt;10% Data
                            </span>
                          )}
                        </div>
                      </td>

                      {/* 10. Plan */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <span className="px-3 py-1 rounded-full text-[11px] font-extrabold bg-[#F8F1EA] text-[#8C4A21] border border-[#E5D5C5]">
                          {s.planName}
                        </span>
                      </td>

                      {/* 11. Signal Strength */}
                      <td className="py-4 px-4 whitespace-nowrap text-xs">
                        {getSignalStrengthIcon(s.signalStrength)}
                      </td>

                      {/* 12. Status */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-[11px] font-extrabold border uppercase tracking-wider ${getStatusBadge(
                            s.status
                          )}`}
                        >
                          {s.status}
                        </span>
                      </td>

                      {/* 13. Actions */}
                      <td className="py-4 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Extend Session */}
                          {(s.status === "Active" || s.status === "Expiring Soon") && (
                            <button
                              type="button"
                              onClick={() => handleExtendSession(s.id, 3600)}
                              className="px-2.5 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 active:scale-95 text-white font-bold text-xs shadow-xs transition-all cursor-pointer"
                              title="Extend Session by 1 Hour"
                            >
                              +1h Extend
                            </button>
                          )}

                          {/* Disconnect */}
                          {(s.status === "Active" || s.status === "Expiring Soon") && (
                            <button
                              type="button"
                              onClick={() => handleDisconnectSession(s.id)}
                              className="p-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 transition-all cursor-pointer"
                              title="Disconnect Session"
                            >
                              <LogOut className="w-4 h-4" />
                            </button>
                          )}

                          {/* Blacklist Device */}
                          {s.status !== "Blocked" ? (
                            <button
                              type="button"
                              onClick={() => setBlockingSession(s)}
                              className="p-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 transition-all cursor-pointer"
                              title="Blacklist Device MAC"
                            >
                              <Ban className="w-4 h-4" />
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleUnblockDevice(s.id)}
                              className="px-3 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs transition-all cursor-pointer"
                              title="Unblock Device"
                            >
                              Unblock
                            </button>
                          )}

                          {/* View Details Drawer */}
                          <button
                            type="button"
                            onClick={() => setActiveDrawerSession(s)}
                            className="p-1.5 rounded-xl bg-[#F8F1EA] hover:bg-[#3D2314] hover:text-white text-[#3D2314] border border-[#E5D5C5] transition-all cursor-pointer"
                            title="View Session Details Drawer"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={13} className="py-12 text-center text-xs text-[#7A5A43]">
                    No WiFi sessions found matching your search and filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Responsive Cards View */}
        <div className="block md:hidden p-4 space-y-3">
          {filteredAndSortedSessions.map((s) => (
            <div key={s.id} className="bg-[#FFFDF9] rounded-2xl border border-[#E5D5C5] p-4 space-y-3 text-xs">
              <div className="flex justify-between items-center border-b border-[#E5D5C5]/50 pb-2.5">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-sm text-[#8C4A21]">{s.id}</span>
                  <span className="font-mono font-extrabold text-xs text-[#8C4A21] bg-[#F8F1EA] px-2.5 py-0.5 rounded-full border border-[#E5D5C5]">
                    {s.deskId}
                  </span>
                </div>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${getStatusBadge(s.status)}`}>
                  {s.status}
                </span>
              </div>
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-bold text-sm text-[#3D2314]">{s.customerName}</div>
                  <div className="text-xs text-[#7A5A43]">{s.customerEmail}</div>
                </div>
                <span className="text-xs font-mono font-bold text-[#7A5A43]">{s.reservationId}</span>
              </div>
              <div className="bg-[#F8F1EA]/60 p-2.5 rounded-xl text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-[#7A5A43] font-semibold">Device &amp; MAC:</span>
                  <span className="font-mono font-bold text-[#3D2314]">{s.deviceName} ({s.macAddress})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#7A5A43] font-semibold">Time Remaining:</span>
                  <span className="font-mono font-bold text-[#8C4A21]">{formatTimeSeconds(s.remainingSeconds)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#7A5A43] font-semibold">Data Used:</span>
                  <span className="font-mono font-bold">{s.usedBytesMB} MB</span>
                </div>
              </div>
              <div className="pt-2 flex justify-end gap-2 border-t border-[#E5D5C5]/50">
                {(s.status === "Active" || s.status === "Expiring Soon") && (
                  <button
                    onClick={() => handleExtendSession(s.id, 3600)}
                    className="flex-1 py-2 rounded-xl bg-emerald-700 text-white font-bold text-xs"
                  >
                    +1h Extend
                  </button>
                )}
                <button
                  onClick={() => setActiveDrawerSession(s)}
                  className="p-2 rounded-xl bg-[#F8F1EA] text-[#3D2314] border border-[#E5D5C5]"
                >
                  <Eye className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Side Drawer Modal: Session Details */}
      <AnimatePresence>
        {activeDrawerSession && (
          <div className="fixed inset-0 z-50 overflow-hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveDrawerSession(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-xs"
            />
            <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
              <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="w-screen max-w-md bg-[#FFFDF9] border-l border-[#E5D5C5] shadow-2xl flex flex-col justify-between"
              >
                {/* Header */}
                <div className="p-6 border-b border-[#E5D5C5] bg-[#F8F1EA] flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <Wifi className="w-5 h-5 text-[#8C4A21]" />
                      <h3 className="text-lg font-bold font-serif text-[#3D2314]">
                        WiFi Session Details
                      </h3>
                    </div>
                    <span className="text-xs font-mono font-bold text-[#8C4A21]">
                      {activeDrawerSession.id}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveDrawerSession(null)}
                    className="p-2 rounded-xl bg-[#FFFDF9] hover:bg-[#3D2314] hover:text-white text-[#3D2314] border border-[#E5D5C5] transition-colors cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto space-y-4 text-xs flex-1">
                  <div className="bg-[#FAF4ED] p-4 rounded-2xl border border-[#DFCDBE] space-y-2">
                    <div className="text-[10px] font-extrabold uppercase tracking-wider text-[#7A5A43]">
                      Customer &amp; Reservation Details
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#7A5A43] font-bold">Customer Name:</span>
                      <span className="font-bold text-[#3D2314]">{activeDrawerSession.customerName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#7A5A43] font-bold">Email Address:</span>
                      <span>{activeDrawerSession.customerEmail}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#7A5A43] font-bold">Reservation ID:</span>
                      <span className="font-mono text-[#8C4A21] font-bold">{activeDrawerSession.reservationId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#7A5A43] font-bold">Desk ID &amp; Type:</span>
                      <span className="font-bold">{activeDrawerSession.deskId} ({activeDrawerSession.workspaceType})</span>
                    </div>
                  </div>

                  <div className="bg-[#FAF4ED] p-4 rounded-2xl border border-[#DFCDBE] space-y-2">
                    <div className="text-[10px] font-extrabold uppercase tracking-wider text-[#7A5A43]">
                      Device &amp; Network Information
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#7A5A43] font-bold">Device Name:</span>
                      <span className="font-bold">{activeDrawerSession.deviceName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#7A5A43] font-bold">Operating System:</span>
                      <span>{activeDrawerSession.osName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#7A5A43] font-bold">MAC Address:</span>
                      <span className="font-mono text-[#3D2314] font-bold">{activeDrawerSession.macAddress}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#7A5A43] font-bold">IP Address:</span>
                      <span className="font-mono text-[#7A5A43]">{activeDrawerSession.ipAddress}</span>
                    </div>
                    <div className="flex justify-between pt-1 border-t border-[#DFCDBE]/60">
                      <span className="text-[#7A5A43] font-bold">Signal Strength:</span>
                      <span>{getSignalStrengthIcon(activeDrawerSession.signalStrength)}</span>
                    </div>
                  </div>

                  <div className="bg-[#FAF4ED] p-4 rounded-2xl border border-[#DFCDBE] space-y-2">
                    <div className="text-[10px] font-extrabold uppercase tracking-wider text-[#7A5A43]">
                      Session &amp; Data Consumption
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#7A5A43] font-bold">WiFi Plan:</span>
                      <span className="font-bold text-[#8C4A21]">{activeDrawerSession.planName} ({activeDrawerSession.planPrice})</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#7A5A43] font-bold">Login Time:</span>
                      <span>{activeDrawerSession.loginTime}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#7A5A43] font-bold">Remaining Time:</span>
                      <span className="font-mono font-bold text-[#8C4A21]">{formatTimeSeconds(activeDrawerSession.remainingSeconds)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#7A5A43] font-bold">Data Consumption:</span>
                      <span className="font-bold">{activeDrawerSession.usedBytesMB} MB used</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#7A5A43] font-bold">Payment Status:</span>
                      <span className="font-bold text-emerald-800">{activeDrawerSession.paymentStatus}</span>
                    </div>
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="p-6 border-t border-[#E5D5C5] bg-[#F8F1EA] space-y-2">
                  {(activeDrawerSession.status === "Active" || activeDrawerSession.status === "Expiring Soon") && (
                    <button
                      type="button"
                      onClick={() => handleExtendSession(activeDrawerSession.id, 3600)}
                      className="w-full py-3 rounded-2xl bg-[#8C4A21] hover:bg-[#3D2314] text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Clock className="w-4 h-4" /> Extend Session (+1 Hour)
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setActiveDrawerSession(null)}
                    className="w-full py-2.5 rounded-2xl bg-[#FFFDF9] text-[#3D2314] border border-[#E5D5C5] font-bold text-xs hover:bg-[#3D2314] hover:text-white transition-all cursor-pointer"
                  >
                    Close Drawer
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Blacklist / Block Modal */}
      <AnimatePresence>
        {blockingSession && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setBlockingSession(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-xs"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-md bg-[#FFFDF9] rounded-3xl border border-[#E5D5C5] shadow-2xl p-6 space-y-4 text-xs z-10"
            >
              <div className="flex items-center gap-2.5 text-rose-700">
                <Ban className="w-6 h-6 shrink-0" />
                <h3 className="text-lg font-bold font-serif">
                  Blacklist MAC Address Device
                </h3>
              </div>

              <p className="text-[#7A5A43]">
                Are you sure you want to block device <span className="font-mono font-bold text-[#3D2314]">{blockingSession.macAddress}</span> ({blockingSession.deviceName})?
              </p>

              <div className="space-y-1.5">
                <label className="font-bold text-[#3D2314]">Select Reason for Blacklisting:</label>
                <select
                  value={blockReasonInput}
                  onChange={(e) => setBlockReasonInput(e.target.value)}
                  className="w-full p-2.5 bg-[#FAF4ED] border border-[#DFCDBE] rounded-xl text-xs text-[#3D2314] font-medium"
                >
                  <option value="Suspicious Activity">Suspicious Activity / Port Scan</option>
                  <option value="Abuse">Network Abuse / Torrenting</option>
                  <option value="Exceeded Limits">Exceeded Data Quota Repeatedly</option>
                  <option value="Security Policy">Security Policy Violation</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setBlockingSession(null)}
                  className="px-4 py-2 rounded-xl bg-[#FAF4ED] text-[#3D2314] border border-[#E5D5C5] font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleBlockDevice}
                  className="px-4 py-2 rounded-xl bg-rose-700 text-white font-bold hover:bg-rose-800 transition-colors cursor-pointer"
                >
                  Block &amp; Blacklist Device
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
