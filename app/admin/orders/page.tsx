"use client";

import React, { useState, useMemo } from "react";
import {
  ShoppingBag,
  Clock,
  CheckCircle2,
  XCircle,
  ChefHat,
  BellRing,
  Coffee,
  Eye,
  Search,
  ArrowUpDown,
  X,
  CreditCard,
  Sparkles,
  Utensils,
  TrendingUp,
  MapPin,
  Check
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export type OrderStatus = "preparing" | "ready" | "completed" | "cancelled";
export type PaymentStatus = "paid" | "pending" | "refunded" | "failed";

export interface OrderItem {
  name: string;
  quantity: number;
  price: number;
  categoryIcon?: string;
}

export interface OrderRecord {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  deskId: string;
  workspaceType: string;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: string;
  createdAt: string;
  orderTime: string;
  specialInstructions?: string;
}

const INITIAL_ORDERS: OrderRecord[] = [
  {
    id: "ord-101",
    orderNumber: "ORD-101",
    customerName: "Rahul Sharma",
    customerEmail: "rahul@gmail.com",
    customerPhone: "+91 98765 43210",
    deskId: "T-01",
    workspaceType: "Café Table",
    items: [
      { name: "Cappuccino", quantity: 2, price: 180, categoryIcon: "☕" },
      { name: "Butter Croissant", quantity: 1, price: 140, categoryIcon: "🥐" },
    ],
    totalAmount: 500,
    status: "preparing",
    paymentStatus: "paid",
    paymentMethod: "UPI / GPay",
    createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    orderTime: "02:30 PM",
    specialInstructions: "Extra hot cappuccino with oat milk, less sugar please.",
  },
  {
    id: "ord-102",
    orderNumber: "ORD-102",
    customerName: "Sarah Jenkins",
    customerEmail: "sarah.j@gmail.com",
    customerPhone: "+91 98123 45678",
    deskId: "W-12",
    workspaceType: "Workstation",
    items: [
      { name: "Artisanal Cold Brew", quantity: 1, price: 220, categoryIcon: "🧋" },
      { name: "Avocado Sourdough Toast", quantity: 1, price: 340, categoryIcon: "🥑" },
    ],
    totalAmount: 560,
    status: "preparing",
    paymentStatus: "paid",
    paymentMethod: "Credit Card",
    createdAt: new Date(Date.now() - 1000 * 60 * 8).toISOString(),
    orderTime: "02:25 PM",
    specialInstructions: "Poached egg on top, no coriander.",
  },
  {
    id: "ord-103",
    orderNumber: "ORD-103",
    customerName: "Anita Desai",
    customerEmail: "anita.desai@company.com",
    customerPhone: "+91 97654 32109",
    deskId: "M-05",
    workspaceType: "Meeting Room",
    items: [
      { name: "Iced Caramel Macchiato", quantity: 4, price: 240, categoryIcon: "☕" },
      { name: "Assorted Bagel Platter", quantity: 2, price: 450, categoryIcon: "🥯" },
    ],
    totalAmount: 1860,
    status: "ready",
    paymentStatus: "paid",
    paymentMethod: "Corporate Card",
    createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    orderTime: "02:15 PM",
    specialInstructions: "Deliver directly to Meeting Room M-05 with extra napkins.",
  },
  {
    id: "ord-104",
    orderNumber: "ORD-104",
    customerName: "Vikram Patel",
    customerEmail: "vikram.p@yahoo.com",
    customerPhone: "+91 96543 21098",
    deskId: "P-03",
    workspaceType: "Private Cabin",
    items: [
      { name: "Royal Espresso Roast", quantity: 2, price: 160, categoryIcon: "☕" },
      { name: "Chocolate Hazelnut Mousse", quantity: 1, price: 280, categoryIcon: "🍰" },
    ],
    totalAmount: 600,
    status: "ready",
    paymentStatus: "paid",
    paymentMethod: "UPI / Paytm",
    createdAt: new Date(Date.now() - 1000 * 60 * 18).toISOString(),
    orderTime: "02:10 PM",
  },
  {
    id: "ord-105",
    orderNumber: "ORD-105",
    customerName: "Elena Rostova",
    customerEmail: "elena.r@design.io",
    customerPhone: "+91 95432 10987",
    deskId: "S-04",
    workspaceType: "Study Space",
    items: [
      { name: "Matcha Green Tea Latte", quantity: 1, price: 230, categoryIcon: "🍵" },
      { name: "Blueberry Cheesecake", quantity: 1, price: 290, categoryIcon: "🍰" },
    ],
    totalAmount: 520,
    status: "completed",
    paymentStatus: "paid",
    paymentMethod: "Apple Pay",
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    orderTime: "01:58 PM",
  },
  {
    id: "ord-106",
    orderNumber: "ORD-106",
    customerName: "Michael Chang",
    customerEmail: "m.chang@tech.com",
    customerPhone: "+91 94321 09876",
    deskId: "D-03",
    workspaceType: "Hot Desk",
    items: [
      { name: "Flat White", quantity: 1, price: 190, categoryIcon: "☕" },
    ],
    totalAmount: 190,
    status: "completed",
    paymentStatus: "paid",
    paymentMethod: "Cash",
    createdAt: new Date(Date.now() - 1000 * 60 * 40).toISOString(),
    orderTime: "01:45 PM",
  },
  {
    id: "ord-107",
    orderNumber: "ORD-107",
    customerName: "Priya Nair",
    customerEmail: "priya.nair@startup.in",
    customerPhone: "+91 93210 98765",
    deskId: "W-08",
    workspaceType: "Workstation",
    items: [
      { name: "Spanish Latte", quantity: 1, price: 250, categoryIcon: "☕" },
      { name: "Truffle Mushroom Panini", quantity: 1, price: 380, categoryIcon: "🥪" },
    ],
    totalAmount: 630,
    status: "completed",
    paymentStatus: "paid",
    paymentMethod: "UPI / PhonePe",
    createdAt: new Date(Date.now() - 1000 * 60 * 75).toISOString(),
    orderTime: "01:10 PM",
  },
  {
    id: "ord-108",
    orderNumber: "ORD-108",
    customerName: "David Miller",
    customerEmail: "david.m@finance.com",
    customerPhone: "+91 92109 87654",
    deskId: "P-05",
    workspaceType: "Private Cabin",
    items: [
      { name: "Double Shot Americano", quantity: 2, price: 170, categoryIcon: "☕" },
      { name: "Smoked Salmon Croissant", quantity: 2, price: 420, categoryIcon: "🥐" },
    ],
    totalAmount: 1180,
    status: "completed",
    paymentStatus: "paid",
    paymentMethod: "Credit Card",
    createdAt: new Date(Date.now() - 1000 * 60 * 110).toISOString(),
    orderTime: "12:35 PM",
  },
  {
    id: "ord-109",
    orderNumber: "ORD-109",
    customerName: "Aarav Gupta",
    customerEmail: "aarav.g@gmail.com",
    customerPhone: "+91 91098 76543",
    deskId: "T-08",
    workspaceType: "Café Table",
    items: [
      { name: "Iced Vanilla Latte", quantity: 1, price: 210, categoryIcon: "☕" },
      { name: "Cranberry Scone", quantity: 1, price: 160, categoryIcon: "🧁" },
    ],
    totalAmount: 370,
    status: "completed",
    paymentStatus: "paid",
    paymentMethod: "UPI",
    createdAt: new Date(Date.now() - 1000 * 60 * 140).toISOString(),
    orderTime: "12:05 PM",
  },
  {
    id: "ord-110",
    orderNumber: "ORD-110",
    customerName: "Sophia Al-Mansoor",
    customerEmail: "sophia.a@consulting.org",
    customerPhone: "+91 90987 65432",
    deskId: "M-02",
    workspaceType: "Meeting Room",
    items: [
      { name: "Filter Coffee", quantity: 3, price: 140, categoryIcon: "☕" },
      { name: "Club Sandwich", quantity: 2, price: 320, categoryIcon: "🥪" },
      { name: "Almond Croissant", quantity: 2, price: 180, categoryIcon: "🥐" },

    ],
    totalAmount: 1060,
    status: "cancelled",
    paymentStatus: "refunded",
    paymentMethod: "Credit Card",
    createdAt: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    orderTime: "11:20 AM",
    specialInstructions: "Order cancelled by customer due to meeting reschedule.",
  },
  {
    id: "ord-111",
    orderNumber: "ORD-111",
    customerName: "Rohan Kapoor",
    customerEmail: "rohan.k@workspace.io",
    customerPhone: "+91 89876 54321",
    deskId: "W-02",
    workspaceType: "Workstation",
    items: [
      { name: "Nitro Cold Brew", quantity: 2, price: 260, categoryIcon: "🧋" },
      { name: "Almond Croissant", quantity: 2, price: 180, categoryIcon: "🥐" },
    ],
    totalAmount: 880,
    status: "completed",
    paymentStatus: "paid",
    paymentMethod: "UPI",
    createdAt: new Date(Date.now() - 1000 * 60 * 220).toISOString(),
    orderTime: "10:45 AM",
  },
  {
    id: "ord-112",
    orderNumber: "ORD-112",
    customerName: "Emily Watson",
    customerEmail: "emily.w@creative.co",
    customerPhone: "+91 88765 43210",
    deskId: "D-01",
    workspaceType: "Hot Desk",
    items: [
      { name: "Chai Latte", quantity: 1, price: 160, categoryIcon: "🍵" },
      { name: "Banana Walnut Bread", quantity: 1, price: 190, categoryIcon: "🍞" },
    ],
    totalAmount: 350,
    status: "completed",
    paymentStatus: "paid",
    paymentMethod: "Cash",
    createdAt: new Date(Date.now() - 1000 * 60 * 260).toISOString(),
    orderTime: "10:05 AM",
  },
];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<OrderRecord[]>(INITIAL_ORDERS);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [paymentFilter, setPaymentFilter] = useState<string>("All");
  const [sortBy, setSortBy] = useState<string>("default");
  const [recentUpdatedId, setRecentUpdatedId] = useState<string | null>(null);

  // Order Details Drawer Modal
  const [activeDrawerOrder, setActiveDrawerOrder] = useState<OrderRecord | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  const updateOrderStatus = (id: string, targetStatus: OrderStatus | "served") => {
    const finalStatus: OrderStatus = targetStatus === "served" ? "completed" : (targetStatus as OrderStatus);

    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status: finalStatus } : o))
    );

    setRecentUpdatedId(id);
    setTimeout(() => setRecentUpdatedId(null), 2000);

    if (targetStatus === "served" || targetStatus === "completed") {
      showToast(`✅ Order served successfully. Order marked as Completed.`);
    } else if (targetStatus === "ready") {
      showToast(`Order ${id} marked as READY to serve.`);
    } else if (targetStatus === "cancelled") {
      showToast(`Order ${id} cancelled.`);
    }

    if (activeDrawerOrder && activeDrawerOrder.id === id) {
      setActiveDrawerOrder((prev) => (prev ? { ...prev, status: finalStatus } : null));
    }
  };

  // Status priority order: preparing (1) > ready (2) > completed (3) > cancelled (4)
  const STATUS_PRIORITY: Record<string, number> = {
    preparing: 1,
    ready: 2,
    completed: 3,
    cancelled: 4,
  };

  const filteredAndSortedOrders = useMemo(() => {
    let result = orders.filter((o) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        o.orderNumber.toLowerCase().includes(q) ||
        o.customerName.toLowerCase().includes(q) ||
        o.customerEmail.toLowerCase().includes(q) ||
        o.deskId.toLowerCase().includes(q) ||
        o.items.some((item) => item.name.toLowerCase().includes(q));

      const matchesStatus = statusFilter === "All" || o.status === statusFilter.toLowerCase();
      const matchesPayment = paymentFilter === "All" || o.paymentStatus === paymentFilter.toLowerCase();

      return matchesSearch && matchesStatus && matchesPayment;
    });

    if (sortBy === "default") {
      result.sort((a, b) => {
        const rankA = STATUS_PRIORITY[a.status] || 99;
        const rankB = STATUS_PRIORITY[b.status] || 99;
        if (rankA !== rankB) return rankA - rankB;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
    } else if (sortBy === "latest") {
      result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (sortBy === "oldest") {
      result.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    } else if (sortBy === "amount-high") {
      result.sort((a, b) => b.totalAmount - a.totalAmount);
    } else if (sortBy === "amount-low") {
      result.sort((a, b) => a.totalAmount - b.totalAmount);
    }

    return result;
  }, [orders, searchQuery, statusFilter, paymentFilter, sortBy]);

  // Statistics Summary Cards
  const stats = useMemo(() => {
    const totalOrders = orders.length;
    const preparingCount = orders.filter((o) => o.status === "preparing").length;
    const readyCount = orders.filter((o) => o.status === "ready").length;
    const completedCount = orders.filter((o) => o.status === "completed").length;
    const cancelledCount = orders.filter((o) => o.status === "cancelled").length;
    const totalRevenue = orders
      .filter((o) => o.paymentStatus === "paid" && o.status !== "cancelled")
      .reduce((sum, o) => sum + o.totalAmount, 0);

    return {
      totalOrders,
      preparingCount,
      readyCount,
      completedCount,
      cancelledCount,
      totalRevenue,
    };
  }, [orders]);

  const getOrderStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case "preparing":
        return "bg-amber-500/15 text-amber-800 border-amber-500/30";
      case "ready":
        return "bg-blue-500/15 text-blue-800 border-blue-500/30";
      case "completed":
        return "bg-emerald-500/15 text-emerald-800 border-emerald-500/30";
      case "cancelled":
        return "bg-rose-500/15 text-rose-800 border-rose-500/30";
    }
  };

  const getPaymentStatusBadge = (status: PaymentStatus) => {
    switch (status) {
      case "paid":
        return "bg-emerald-500/15 text-emerald-800 border-emerald-500/30";
      case "pending":
        return "bg-amber-500/15 text-amber-800 border-amber-500/30";
      case "refunded":
        return "bg-blue-500/15 text-blue-800 border-blue-500/30";
      case "failed":
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="w-7 h-7 text-[#8C4A21]" />
            <h1 className="text-2xl sm:text-3xl font-black font-serif text-[#3D2314] tracking-tight">
              Order Management
            </h1>
          </div>
          <p className="text-xs text-[#7A5A43] mt-1">
            Manage all food and beverage orders efficiently.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          <span className="text-xs font-mono font-bold text-[#8C4A21] bg-[#F8F1EA] px-4 py-2 rounded-full border border-[#E5D5C5] shadow-xs flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            {stats.totalOrders} Orders Today
          </span>
        </div>
      </div>

      {/* Top 6 Summary KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        {/* Total Orders */}
        <div className="bg-[#FFFDF9] rounded-2xl p-4 border border-[#E5D5C5] shadow-xs hover:-translate-y-1 hover:shadow-md transition-all duration-200">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-[#7A5A43] uppercase tracking-wider">Total Orders</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-800">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono text-[#3D2314]">{stats.totalOrders}</span>
            <span className="text-[10px] text-emerald-700 font-bold flex items-center gap-0.5">
              <TrendingUp className="w-3 h-3" /> +12%
            </span>
          </div>
        </div>

        {/* Preparing */}
        <div className="bg-[#FFFDF9] rounded-2xl p-4 border border-[#E5D5C5] shadow-xs hover:-translate-y-1 hover:shadow-md transition-all duration-200">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-[#7A5A43] uppercase tracking-wider">Preparing</span>
            <div className="p-2 rounded-xl bg-amber-500/15 text-amber-800">
              <ChefHat className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono text-amber-800">{stats.preparingCount}</span>
            <span className="text-[10px] text-amber-700 font-semibold animate-pulse">In Kitchen</span>
          </div>
        </div>

        {/* Ready to Serve */}
        <div className="bg-[#FFFDF9] rounded-2xl p-4 border border-[#E5D5C5] shadow-xs hover:-translate-y-1 hover:shadow-md transition-all duration-200">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-[#7A5A43] uppercase tracking-wider">Ready</span>
            <div className="p-2 rounded-xl bg-blue-500/15 text-blue-800">
              <BellRing className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono text-blue-800">{stats.readyCount}</span>
            <span className="text-[10px] text-blue-700 font-semibold">Pickup Ready</span>
          </div>
        </div>

        {/* Completed */}
        <div className="bg-[#FFFDF9] rounded-2xl p-4 border border-[#E5D5C5] shadow-xs hover:-translate-y-1 hover:shadow-md transition-all duration-200">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-[#7A5A43] uppercase tracking-wider">Completed</span>
            <div className="p-2 rounded-xl bg-emerald-500/15 text-emerald-800">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono text-emerald-800">{stats.completedCount}</span>
            <span className="text-[10px] text-emerald-700 font-semibold">Fulfilled</span>
          </div>
        </div>

        {/* Cancelled */}
        <div className="bg-[#FFFDF9] rounded-2xl p-4 border border-[#E5D5C5] shadow-xs hover:-translate-y-1 hover:shadow-md transition-all duration-200">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-[#7A5A43] uppercase tracking-wider">Cancelled</span>
            <div className="p-2 rounded-xl bg-rose-500/15 text-rose-800">
              <XCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono text-rose-800">{stats.cancelledCount}</span>
            <span className="text-[10px] text-rose-700 font-semibold">Voided</span>
          </div>
        </div>

        {/* Total Revenue Today */}
        <div className="bg-[#FFFDF9] rounded-2xl p-4 border border-[#E5D5C5] shadow-xs hover:-translate-y-1 hover:shadow-md transition-all duration-200">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-[#7A5A43] uppercase tracking-wider">Revenue</span>
            <div className="p-2 rounded-xl bg-emerald-500/15 text-emerald-800">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-xl font-bold font-mono text-[#3D2314]">₹{stats.totalRevenue.toLocaleString("en-IN")}</span>
            <span className="text-[10px] text-emerald-700 font-bold">Today</span>
          </div>
        </div>
      </div>

      {/* Toolbar / Search & Filters */}
      <div className="bg-[#FFFDF9] p-5 rounded-[20px] border border-[#E5D5C5] shadow-sm space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Search Order ID / Customer / Desk ID */}
          <div className="relative lg:col-span-2">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#7A5A43]" />
            <input
              type="text"
              placeholder="Search Order ID, Customer, Desk ID (e.g. T-01)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-3 py-2.5 bg-[#FAF4ED] border border-[#DFCDBE] rounded-xl text-xs text-[#3D2314] focus:outline-none focus:ring-2 focus:ring-[#8C4A21]/30 placeholder-[#7A5A43]/60 transition-all font-medium"
            />
          </div>

          {/* Filter Order Status */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2.5 bg-[#FAF4ED] border border-[#DFCDBE] rounded-xl text-xs text-[#3D2314] font-medium focus:outline-none focus:ring-2 focus:ring-[#8C4A21]/30 transition-all cursor-pointer"
            >
              <option value="All">Order Status (All)</option>
              <option value="preparing">Preparing</option>
              <option value="ready">Ready to Serve</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          {/* Filter Payment Status */}
          <div>
            <select
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
              className="w-full px-3 py-2.5 bg-[#FAF4ED] border border-[#DFCDBE] rounded-xl text-xs text-[#3D2314] font-medium focus:outline-none focus:ring-2 focus:ring-[#8C4A21]/30 transition-all cursor-pointer"
            >
              <option value="All">Payment Status (All)</option>
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
              <option value="refunded">Refunded</option>
              <option value="failed">Failed</option>
            </select>
          </div>

          {/* Sort By */}
          <div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3 py-2.5 bg-[#FAF4ED] border border-[#DFCDBE] rounded-xl text-xs text-[#3D2314] font-medium focus:outline-none focus:ring-2 focus:ring-[#8C4A21]/30 transition-all cursor-pointer"
            >
              <option value="default">Status Priority (Default)</option>
              <option value="latest">Latest First</option>
              <option value="oldest">Oldest First</option>
              <option value="amount-high">Amount: High to Low</option>
              <option value="amount-low">Amount: Low to High</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Full-Width Table Card */}
      <div className="bg-[#FFFDF9] rounded-[20px] border border-[#E5D5C5] shadow-sm overflow-hidden space-y-4">
        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto max-h-[680px] overflow-y-auto">
          <table className="w-full text-left text-xs text-[#3D2314] border-collapse">
            <thead className="bg-[#F8F1EA] sticky top-0 z-10 uppercase text-[11px] font-extrabold tracking-wider text-[#7A5A43] border-b border-[#E5D5C5] shadow-2xs">
              <tr>
                <th className="py-4 px-4 font-bold">Order ID</th>
                <th className="py-4 px-4 font-bold">Customer Name</th>
                <th className="py-4 px-4 font-bold">Desk ID</th>
                <th className="py-4 px-4 font-bold">Items Ordered</th>
                <th className="py-4 px-4 font-bold">Qty</th>
                <th className="py-4 px-4 font-bold">Order Amount</th>
                <th className="py-4 px-4 font-bold">Order Time</th>
                <th className="py-4 px-4 font-bold">Payment</th>
                <th className="py-4 px-4 font-bold">Order Status</th>
                <th className="py-4 px-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5D5C5]/60">
              {filteredAndSortedOrders.length > 0 ? (
                filteredAndSortedOrders.map((ord, idx) => {
                  const isOdd = idx % 2 !== 0;
                  const totalQty = ord.items.reduce((sum, item) => sum + item.quantity, 0);
                  const isRecentlyUpdated = recentUpdatedId === ord.id;

                  return (
                    <tr
                      key={ord.id}
                      className={`${
                        isRecentlyUpdated
                          ? "bg-emerald-100/70 transition-all duration-500"
                          : isOdd
                          ? "bg-[#FBF7F1]/60"
                          : "bg-[#FFFDF9]"
                      } hover:bg-[#F3E9DD] transition-colors`}
                    >
                      {/* 1. Order ID */}
                      <td className="py-4 px-4 font-bold font-mono text-sm text-[#8C4A21] whitespace-nowrap">
                        {ord.orderNumber}
                      </td>

                      {/* 2. Customer Name */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#3D2314] to-[#8C4A21] text-amber-200 flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs ring-2 ring-[#E5D5C5]/40">
                            {ord.customerName.charAt(0)}
                          </div>
                          <div>
                            <div className="font-bold text-sm text-[#3D2314]">{ord.customerName}</div>
                            <div className="text-[11px] text-[#7A5A43]">{ord.customerEmail}</div>
                          </div>
                        </div>
                      </td>

                      {/* 3. DESK ID */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <span className="font-extrabold font-mono text-xs text-[#8C4A21] bg-[#F8F1EA] px-3 py-1 rounded-full border border-[#E5D5C5] shadow-2xs flex items-center gap-1.5 w-fit">
                          <MapPin className="w-3 h-3 text-[#8C4A21]" />
                          {ord.deskId}
                        </span>
                      </td>

                      {/* 4. Items Ordered */}
                      <td className="py-4 px-4">
                        <div className="space-y-1 max-w-[220px]">
                          {ord.items.slice(0, 2).map((item, i) => (
                            <div key={i} className="flex items-center gap-1.5 text-xs">
                              <span className="text-sm">{item.categoryIcon || "☕"}</span>
                              <span className="font-semibold text-[#3D2314] truncate">{item.name}</span>
                              <span className="font-mono text-[#7A5A43] font-bold text-[11px]">×{item.quantity}</span>
                            </div>
                          ))}
                          {ord.items.length > 2 && (
                            <div className="text-[10px] font-bold text-[#8C4A21]">
                              +{ord.items.length - 2} more item(s)
                            </div>
                          )}
                        </div>
                      </td>

                      {/* 5. Quantity */}
                      <td className="py-4 px-4 font-extrabold font-mono text-xs text-[#3D2314] whitespace-nowrap">
                        {totalQty} {totalQty === 1 ? "item" : "items"}
                      </td>

                      {/* 6. Order Amount */}
                      <td className="py-4 px-4 font-bold text-xs text-[#3D2314] whitespace-nowrap">
                        ₹{ord.totalAmount}
                      </td>

                      {/* 7. Order Time */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-1.5 text-xs font-medium text-[#7A5A43]">
                          <Clock className="w-3.5 h-3.5 text-[#8C4A21] shrink-0" />
                          <span>{ord.orderTime}</span>
                        </div>
                      </td>

                      {/* 8. Payment Status */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-[11px] font-extrabold border uppercase tracking-wider shadow-2xs ${getPaymentStatusBadge(
                            ord.paymentStatus
                          )}`}
                        >
                          {ord.paymentStatus}
                        </span>
                      </td>

                      {/* 9. Order Status */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-[11px] font-extrabold border uppercase tracking-wider shadow-2xs ${getOrderStatusBadge(
                            ord.status
                          )}`}
                        >
                          {ord.status}
                        </span>
                      </td>

                      {/* 10. Actions */}
                      <td className="py-4 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Preparing state action */}
                          {ord.status === "preparing" && (
                            <>
                              <button
                                type="button"
                                onClick={() => updateOrderStatus(ord.id, "ready")}
                                className="px-3 py-1.5 rounded-xl bg-blue-700 hover:bg-blue-800 active:scale-95 text-white font-bold text-xs shadow-xs transition-all cursor-pointer flex items-center gap-1"
                                title="Mark Ready to Serve"
                              >
                                <BellRing className="w-3.5 h-3.5" />
                                Mark Ready
                              </button>
                              <button
                                type="button"
                                onClick={() => updateOrderStatus(ord.id, "cancelled")}
                                className="p-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs border border-rose-200 transition-all cursor-pointer flex items-center justify-center"
                                title="Cancel Order"
                              >
                                <XCircle className="w-4 h-4" />
                              </button>
                            </>
                          )}

                          {/* Ready state action: Mark as Served directly completes order */}
                          {ord.status === "ready" && (
                            <>
                              <button
                                type="button"
                                onClick={() => updateOrderStatus(ord.id, "served")}
                                className="px-3.5 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 active:scale-95 text-white font-bold text-xs shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
                                title="Mark as Served (Automatically Completes Order)"
                              >
                                <Utensils className="w-3.5 h-3.5" />
                                Mark as Served
                              </button>
                              <button
                                type="button"
                                onClick={() => updateOrderStatus(ord.id, "cancelled")}
                                className="p-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs border border-rose-200 transition-all cursor-pointer flex items-center justify-center"
                                title="Cancel Order"
                              >
                                <XCircle className="w-4 h-4" />
                              </button>
                            </>
                          )}

                          {/* Completed state badge */}
                          {ord.status === "completed" && (
                            <span className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 font-bold text-xs border border-emerald-200 inline-flex items-center gap-1 opacity-90">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              ✅ Completed
                            </span>
                          )}

                          {/* Cancelled state badge */}
                          {ord.status === "cancelled" && (
                            <span className="px-3 py-1.5 rounded-xl bg-rose-50 text-rose-800 font-bold text-xs border border-rose-200 inline-flex items-center gap-1 opacity-90">
                              <XCircle className="w-3.5 h-3.5 text-rose-600" />
                              Cancelled
                            </span>
                          )}

                          {/* View Details Drawer Trigger */}
                          <button
                            type="button"
                            onClick={() => setActiveDrawerOrder(ord)}
                            className="p-1.5 rounded-xl bg-[#F8F1EA] hover:bg-[#3D2314] hover:text-white text-[#3D2314] transition-all cursor-pointer flex items-center justify-center border border-[#E5D5C5]"
                            title="View Order Details Drawer"
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
                  <td colSpan={10} className="py-12 text-center text-xs text-[#7A5A43]">
                    No orders found matching your search and filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile View */}
        <div className="block md:hidden p-4 space-y-4">
          {filteredAndSortedOrders.length > 0 ? (
            filteredAndSortedOrders.map((ord) => {
              const totalQty = ord.items.reduce((sum, item) => sum + item.quantity, 0);

              return (
                <div
                  key={ord.id}
                  className="bg-[#FFFDF9] rounded-2xl border border-[#E5D5C5] p-4 shadow-xs space-y-3"
                >
                  <div className="flex items-center justify-between border-b border-[#E5D5C5]/50 pb-2.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold font-mono text-sm text-[#8C4A21]">
                        {ord.orderNumber}
                      </span>
                      <span className="font-extrabold font-mono text-xs text-[#8C4A21] bg-[#F8F1EA] px-2.5 py-0.5 rounded-full border border-[#E5D5C5] flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-[#8C4A21]" />
                        {ord.deskId}
                      </span>
                    </div>
                    <span
                      className={`inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border uppercase tracking-wider ${getOrderStatusBadge(
                        ord.status
                      )}`}
                    >
                      {ord.status}
                    </span>
                  </div>

                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#3D2314] to-[#8C4A21] text-amber-200 flex items-center justify-center font-bold text-sm shrink-0 shadow-2xs">
                        {ord.customerName.charAt(0)}
                      </div>
                      <div>
                        <div className="font-bold text-sm text-[#3D2314]">{ord.customerName}</div>
                        <div className="text-xs text-[#7A5A43]">{ord.customerEmail}</div>
                      </div>
                    </div>
                    <span
                      className={`inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border uppercase ${getPaymentStatusBadge(
                        ord.paymentStatus
                      )}`}
                    >
                      {ord.paymentStatus}
                    </span>
                  </div>

                  {/* Items summary */}
                  <div className="bg-[#F8F1EA]/60 p-3 rounded-xl border border-[#E5D5C5]/40 space-y-1.5 text-xs">
                    {ord.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center font-medium">
                        <span>
                          {item.categoryIcon || "☕"} {item.name} ×{item.quantity}
                        </span>
                        <span className="font-mono text-[#3D2314] font-bold">₹{item.price * item.quantity}</span>
                      </div>
                    ))}
                    <div className="pt-1.5 border-t border-[#E5D5C5]/40 flex justify-between font-bold text-xs text-[#3D2314]">
                      <span>Total ({totalQty} items)</span>
                      <span className="text-[#8C4A21]">₹{ord.totalAmount}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-1 flex items-center justify-end gap-2">
                    {ord.status === "preparing" && (
                      <>
                        <button
                          type="button"
                          onClick={() => updateOrderStatus(ord.id, "ready")}
                          className="flex-1 py-2 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-1"
                        >
                          <BellRing className="w-3.5 h-3.5" />
                          Mark Ready
                        </button>
                        <button
                          type="button"
                          onClick={() => updateOrderStatus(ord.id, "cancelled")}
                          className="py-2 px-3 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs border border-rose-200 transition-all flex items-center justify-center gap-1"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          Cancel
                        </button>
                      </>
                    )}

                    {ord.status === "ready" && (
                      <>
                        <button
                          type="button"
                          onClick={() => updateOrderStatus(ord.id, "served")}
                          className="flex-1 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-1.5"
                        >
                          <Utensils className="w-3.5 h-3.5" />
                          Mark as Served
                        </button>
                        <button
                          type="button"
                          onClick={() => updateOrderStatus(ord.id, "cancelled")}
                          className="py-2 px-3 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs border border-rose-200 transition-all flex items-center justify-center gap-1"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          Cancel
                        </button>
                      </>
                    )}

                    {ord.status === "completed" && (
                      <span className="w-full py-2 rounded-xl bg-emerald-50 text-emerald-800 font-bold text-xs border border-emerald-200 flex items-center justify-center gap-1 opacity-90">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        ✅ Completed
                      </span>
                    )}

                    {ord.status === "cancelled" && (
                      <span className="w-full py-2 rounded-xl bg-rose-50 text-rose-800 font-bold text-xs border border-rose-200 flex items-center justify-center gap-1 opacity-90">
                        <XCircle className="w-3.5 h-3.5 text-rose-600" />
                        Cancelled
                      </span>
                    )}

                    <button
                      type="button"
                      onClick={() => setActiveDrawerOrder(ord)}
                      className="p-2 rounded-xl bg-[#F8F1EA] hover:bg-[#3D2314] hover:text-white text-[#3D2314] transition-colors border border-[#E5D5C5]"
                      title="View Details Drawer"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="py-8 text-center text-xs text-[#7A5A43] bg-[#F8F1EA]/50 rounded-xl">
              No orders found matching your search and filter criteria.
            </div>
          )}
        </div>
      </div>

      {/* Order Details Side Drawer Modal */}
      <AnimatePresence>
        {activeDrawerOrder && (
          <div className="fixed inset-0 z-50 overflow-hidden">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveDrawerOrder(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-xs"
            />

            {/* Right Side Drawer */}
            <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
              <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="w-screen max-w-md bg-[#FFFDF9] border-l border-[#E5D5C5] shadow-2xl flex flex-col justify-between"
              >
                {/* Drawer Header */}
                <div className="p-6 border-b border-[#E5D5C5] bg-[#F8F1EA] flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <ShoppingBag className="w-5 h-5 text-[#8C4A21]" />
                      <h3 className="text-lg font-bold font-serif text-[#3D2314]">
                        Order Details
                      </h3>
                    </div>
                    <span className="text-xs font-mono font-bold text-[#8C4A21]">
                      {activeDrawerOrder.orderNumber}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setActiveDrawerOrder(null)}
                    className="p-2 rounded-xl bg-[#FFFDF9] hover:bg-[#3D2314] hover:text-white text-[#3D2314] border border-[#E5D5C5] transition-colors cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Drawer Content */}
                <div className="p-6 overflow-y-auto space-y-5 text-xs flex-1">
                  {/* Customer & Location */}
                  <div className="bg-[#FAF4ED] p-4 rounded-2xl border border-[#DFCDBE] space-y-2">
                    <div className="text-[10px] font-extrabold uppercase tracking-wider text-[#7A5A43]">
                      Customer &amp; Table Info
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#7A5A43] font-bold">Customer Name:</span>
                      <span className="font-bold text-[#3D2314]">{activeDrawerOrder.customerName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#7A5A43] font-bold">Phone Number:</span>
                      <span>{activeDrawerOrder.customerPhone}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#7A5A43] font-bold">Email Address:</span>
                      <span>{activeDrawerOrder.customerEmail}</span>
                    </div>
                    <div className="flex justify-between pt-1 border-t border-[#DFCDBE]/50">
                      <span className="text-[#7A5A43] font-bold">Desk ID / Table:</span>
                      <span className="font-extrabold font-mono text-[#8C4A21] bg-[#FFFDF9] px-2.5 py-0.5 rounded-full border border-[#E5D5C5]">
                        {activeDrawerOrder.deskId} ({activeDrawerOrder.workspaceType})
                      </span>
                    </div>
                  </div>

                  {/* Items Ordered List */}
                  <div className="bg-[#FAF4ED] p-4 rounded-2xl border border-[#DFCDBE] space-y-3">
                    <div className="text-[10px] font-extrabold uppercase tracking-wider text-[#7A5A43]">
                      Items Ordered
                    </div>
                    <div className="divide-y divide-[#DFCDBE]/60 space-y-2">
                      {activeDrawerOrder.items.map((item, idx) => (
                        <div key={idx} className="pt-2 flex items-center justify-between">
                          <div>
                            <div className="font-bold text-[#3D2314]">
                              {item.categoryIcon || "☕"} {item.name}
                            </div>
                            <div className="text-[11px] text-[#7A5A43]">
                              ₹{item.price} × {item.quantity}
                            </div>
                          </div>
                          <span className="font-bold font-mono text-[#3D2314]">
                            ₹{item.price * item.quantity}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Financial Breakdown */}
                  <div className="bg-[#FAF4ED] p-4 rounded-2xl border border-[#DFCDBE] space-y-2">
                    <div className="text-[10px] font-extrabold uppercase tracking-wider text-[#7A5A43]">
                      Payment &amp; Invoice
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#7A5A43]">Subtotal:</span>
                      <span className="font-semibold">₹{activeDrawerOrder.totalAmount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#7A5A43]">Tax (5% GST):</span>
                      <span className="font-semibold">₹{(activeDrawerOrder.totalAmount * 0.05).toFixed(0)}</span>
                    </div>
                    <div className="flex justify-between pt-1 border-t border-[#DFCDBE]/60 font-bold text-sm text-[#3D2314]">
                      <span>Grand Total:</span>
                      <span className="text-[#8C4A21]">₹{(activeDrawerOrder.totalAmount * 1.05).toFixed(0)}</span>
                    </div>
                    <div className="flex justify-between pt-2">
                      <span className="text-[#7A5A43] font-bold">Payment Method:</span>
                      <span className="font-bold">{activeDrawerOrder.paymentMethod}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#7A5A43] font-bold">Payment Status:</span>
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${getPaymentStatusBadge(
                          activeDrawerOrder.paymentStatus
                        )}`}
                      >
                        {activeDrawerOrder.paymentStatus}
                      </span>
                    </div>
                  </div>

                  {/* Special Instructions */}
                  {activeDrawerOrder.specialInstructions && (
                    <div className="bg-amber-500/10 p-3.5 rounded-2xl border border-amber-500/20 text-xs text-amber-900 space-y-1">
                      <div className="font-bold text-[10px] uppercase tracking-wider">
                        Special Instructions:
                      </div>
                      <p className="leading-relaxed font-medium">
                        "{activeDrawerOrder.specialInstructions}"
                      </p>
                    </div>
                  )}

                  {/* Order Progress Flow */}
                  <div className="bg-[#FAF4ED] p-4 rounded-2xl border border-[#DFCDBE] space-y-3">
                    <div className="text-[10px] font-extrabold uppercase tracking-wider text-[#7A5A43]">
                      Order Progress Flow
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-center text-xs font-bold">
                      <div className={`p-2 rounded-xl border ${activeDrawerOrder.status === "preparing" ? "bg-amber-500 text-white shadow-xs" : "bg-[#FFFDF9] text-[#7A5A43]"}`}>
                        Preparing
                      </div>
                      <div className={`p-2 rounded-xl border ${activeDrawerOrder.status === "ready" ? "bg-blue-600 text-white shadow-xs" : "bg-[#FFFDF9] text-[#7A5A43]"}`}>
                        Ready
                      </div>
                      <div className={`p-2 rounded-xl border ${activeDrawerOrder.status === "completed" ? "bg-emerald-600 text-white shadow-xs" : "bg-[#FFFDF9] text-[#7A5A43]"}`}>
                        Completed
                      </div>
                    </div>
                  </div>
                </div>

                {/* Drawer Footer Actions */}
                <div className="p-6 border-t border-[#E5D5C5] bg-[#F8F1EA] space-y-2">
                  {activeDrawerOrder.status === "preparing" && (
                    <button
                      type="button"
                      onClick={() => updateOrderStatus(activeDrawerOrder.id, "ready")}
                      className="w-full py-3 rounded-2xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <BellRing className="w-4 h-4" /> Mark Order Ready
                    </button>
                  )}

                  {activeDrawerOrder.status === "ready" && (
                    <button
                      type="button"
                      onClick={() => updateOrderStatus(activeDrawerOrder.id, "served")}
                      className="w-full py-3 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Utensils className="w-4 h-4" /> Mark as Served (Complete Order)
                    </button>
                  )}

                  {activeDrawerOrder.status === "completed" && (
                    <div className="w-full py-3 rounded-2xl bg-emerald-100 text-emerald-900 border border-emerald-300 font-bold text-xs flex items-center justify-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-700" /> ✅ Order Completed
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => setActiveDrawerOrder(null)}
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
    </div>
  );
}
