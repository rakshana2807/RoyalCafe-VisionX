"use client";

import React, { useState, useMemo } from "react";
import {
  CreditCard,
  DollarSign,
  Download,
  CheckCircle2,
  XCircle,
  Clock,
  RefreshCw,
  Search,
  Filter,
  ArrowUpDown,
  X,
  FileText,
  Eye,
  RotateCcw,
  TrendingUp,
  TrendingDown,
  Calendar,
  Sparkles,
  Smartphone,
  Wallet,
  Coins,
  ShieldCheck,
  Building2,
  Armchair,
  Briefcase,
  Users,
  BookOpen,
  Coffee,
  Check
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";

export type PaymentStatus = "Successful" | "Pending" | "Failed" | "Refunded" | "Cancelled";
export type PaymentMethod = "UPI" | "Credit Card" | "Debit Card" | "Wallet" | "Cash";
export type WorkspaceType = "Workstation" | "Café Table" | "Private Cabin" | "Meeting Room" | "Study Space" | "Hot Desk";

export interface PaymentRecord {
  id: string;
  transactionId: string; // TXN-9001
  bookingId: string; // BK-1001
  userName: string;
  userEmail: string;
  userPhone: string;
  deskId: string; // W-08, T-04, P-01, M-05
  workspaceType: WorkspaceType;
  reservationDate: string;
  duration: string;
  paymentDate: string; // 07 Aug 2026, 02:15 PM
  paymentMethod: PaymentMethod;
  subtotal: number;
  tax: number;
  discount: number;
  amount: number;
  status: PaymentStatus;
  gatewayRef?: string;
}

const INITIAL_PAYMENTS: PaymentRecord[] = [
  {
    id: "p-101",
    transactionId: "TXN-9001",
    bookingId: "BK-1001",
    userName: "Rahul Sharma",
    userEmail: "rahul@gmail.com",
    userPhone: "+91 98765 43210",
    deskId: "W-08",
    workspaceType: "Workstation",
    reservationDate: "07 Aug 2026",
    duration: "4 Hours",
    paymentDate: "07 Aug 2026, 02:15 PM",
    paymentMethod: "UPI",
    subtotal: 475,
    tax: 24,
    discount: 0,
    amount: 499,
    status: "Successful",
    gatewayRef: "RAZORPAY_UPI_987123",
  },
  {
    id: "p-102",
    transactionId: "TXN-9002",
    bookingId: "BK-1002",
    userName: "Sarah Jenkins",
    userEmail: "sarah.j@gmail.com",
    userPhone: "+91 98123 45678",
    deskId: "T-04",
    workspaceType: "Café Table",
    reservationDate: "07 Aug 2026",
    duration: "2 Hours",
    paymentDate: "07 Aug 2026, 01:40 PM",
    paymentMethod: "Credit Card",
    subtotal: 333,
    tax: 17,
    discount: 0,
    amount: 350,
    status: "Successful",
    gatewayRef: "STRIPE_CC_451290",
  },
  {
    id: "p-103",
    transactionId: "TXN-9003",
    bookingId: "BK-1003",
    userName: "Anita Desai",
    userEmail: "anita.desai@company.com",
    userPhone: "+91 97654 32109",
    deskId: "M-05",
    workspaceType: "Meeting Room",
    reservationDate: "07 Aug 2026",
    duration: "Half Day",
    paymentDate: "07 Aug 2026, 01:10 PM",
    paymentMethod: "Credit Card",
    subtotal: 1190,
    tax: 60,
    discount: 0,
    amount: 1250,
    status: "Successful",
    gatewayRef: "CORP_CARD_781290",
  },
  {
    id: "p-104",
    transactionId: "TXN-9004",
    bookingId: "BK-1004",
    userName: "Vikram Patel",
    userEmail: "vikram.p@yahoo.com",
    userPhone: "+91 96543 21098",
    deskId: "P-03",
    workspaceType: "Private Cabin",
    reservationDate: "07 Aug 2026",
    duration: "Full Day",
    paymentDate: "07 Aug 2026, 12:45 PM",
    paymentMethod: "UPI",
    subtotal: 1714,
    tax: 86,
    discount: 0,
    amount: 1800,
    status: "Successful",
    gatewayRef: "PAYTM_UPI_881290",
  },
  {
    id: "p-105",
    transactionId: "TXN-9005",
    bookingId: "BK-1005",
    userName: "Elena Rostova",
    userEmail: "elena.r@design.io",
    userPhone: "+91 95432 10987",
    deskId: "S-04",
    workspaceType: "Study Space",
    reservationDate: "07 Aug 2026",
    duration: "2 Hours",
    paymentDate: "07 Aug 2026, 12:10 PM",
    paymentMethod: "Wallet",
    subtotal: 285,
    tax: 15,
    discount: 0,
    amount: 300,
    status: "Refunded",
    gatewayRef: "APPLE_PAY_991280",
  },
  {
    id: "p-106",
    transactionId: "TXN-9006",
    bookingId: "BK-1006",
    userName: "Michael Chang",
    userEmail: "m.chang@tech.com",
    userPhone: "+91 94321 09876",
    deskId: "D-03",
    workspaceType: "Hot Desk",
    reservationDate: "07 Aug 2026",
    duration: "1 Hour",
    paymentDate: "07 Aug 2026, 11:30 AM",
    paymentMethod: "Debit Card",
    subtotal: 190,
    tax: 10,
    discount: 0,
    amount: 200,
    status: "Failed",
    gatewayRef: "HDFC_DB_FAIL_09",
  },
  {
    id: "p-107",
    transactionId: "TXN-9007",
    bookingId: "BK-1007",
    userName: "Priya Nair",
    userEmail: "priya.nair@startup.in",
    userPhone: "+91 93210 98765",
    deskId: "W-04",
    workspaceType: "Workstation",
    reservationDate: "07 Aug 2026",
    duration: "4 Hours",
    paymentDate: "07 Aug 2026, 11:05 AM",
    paymentMethod: "UPI",
    subtotal: 475,
    tax: 24,
    discount: 0,
    amount: 499,
    status: "Pending",
    gatewayRef: "PHONEPE_PENDING_01",
  },
  {
    id: "p-108",
    transactionId: "TXN-9008",
    bookingId: "BK-1008",
    userName: "David Miller",
    userEmail: "david.m@finance.com",
    userPhone: "+91 92109 87654",
    deskId: "P-01",
    workspaceType: "Private Cabin",
    reservationDate: "07 Aug 2026",
    duration: "Half Day",
    paymentDate: "07 Aug 2026, 10:20 AM",
    paymentMethod: "Credit Card",
    subtotal: 1047,
    tax: 53,
    discount: 0,
    amount: 1100,
    status: "Successful",
    gatewayRef: "AMEX_CC_90182",
  },
  {
    id: "p-109",
    transactionId: "TXN-9009",
    bookingId: "BK-1009",
    userName: "Aarav Gupta",
    userEmail: "aarav.g@gmail.com",
    userPhone: "+91 91098 76543",
    deskId: "T-08",
    workspaceType: "Café Table",
    reservationDate: "07 Aug 2026",
    duration: "2 Hours",
    paymentDate: "07 Aug 2026, 09:45 AM",
    paymentMethod: "Cash",
    subtotal: 333,
    tax: 17,
    discount: 0,
    amount: 350,
    status: "Successful",
    gatewayRef: "POS_CASH_102",
  },
  {
    id: "p-110",
    transactionId: "TXN-9010",
    bookingId: "BK-1010",
    userName: "Sophia Al-Mansoor",
    userEmail: "sophia.a@consulting.org",
    userPhone: "+91 90987 65432",
    deskId: "M-02",
    workspaceType: "Meeting Room",
    reservationDate: "07 Aug 2026",
    duration: "2 Hours",
    paymentDate: "07 Aug 2026, 09:10 AM",
    paymentMethod: "UPI",
    subtotal: 905,
    tax: 45,
    discount: 0,
    amount: 950,
    status: "Cancelled",
    gatewayRef: "GPAY_CANCELLED_04",
  },
  {
    id: "p-111",
    transactionId: "TXN-9011",
    bookingId: "BK-1011",
    userName: "Rohan Kapoor",
    userEmail: "rohan.k@workspace.io",
    userPhone: "+91 89876 54321",
    deskId: "W-02",
    workspaceType: "Workstation",
    reservationDate: "06 Aug 2026",
    duration: "3 Hours",
    paymentDate: "06 Aug 2026, 05:30 PM",
    paymentMethod: "UPI",
    subtotal: 428,
    tax: 22,
    discount: 0,
    amount: 450,
    status: "Successful",
    gatewayRef: "UPI_SUCCESS_441",
  },
  {
    id: "p-112",
    transactionId: "TXN-9012",
    bookingId: "BK-1012",
    userName: "Emily Watson",
    userEmail: "emily.w@creative.co",
    userPhone: "+91 88765 43210",
    deskId: "D-05",
    workspaceType: "Hot Desk",
    reservationDate: "06 Aug 2026",
    duration: "1 Hour",
    paymentDate: "06 Aug 2026, 04:15 PM",
    paymentMethod: "Debit Card",
    subtotal: 190,
    tax: 10,
    discount: 0,
    amount: 200,
    status: "Successful",
    gatewayRef: "ICICI_DB_90128",
  },
];

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<PaymentRecord[]>(INITIAL_PAYMENTS);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [methodFilter, setMethodFilter] = useState<string>("All");
  const [dateFilter, setDateFilter] = useState<string>("All");
  const [sortBy, setSortBy] = useState<string>("default");

  // Chart Toggle State
  const [revenueTimeframe, setRevenueTimeframe] = useState<"daily" | "weekly" | "monthly">("daily");

  React.useEffect(() => {
    async function fetchPayments() {
      const { data, error } = await supabase
        .from('payments')
        .select(`
          *,
          reservation (
            seat_code,
            seat_name,
            customer_name,
            booking_date,
            duration_hours,
            profiles ( email, phone )
          )
        `)
        .order('payment_date', { ascending: false });
        
      if (!error && data && data.length > 0) {
        const mapped = data.map((p: any) => {
          let wType: WorkspaceType = 'Workstation';
          const sn = p.reservation?.seat_name || '';
          if (sn.includes('Meeting')) wType = 'Meeting Room';
          else if (sn.includes('Study') || sn.includes('Quiet')) wType = 'Study Space';
          else if (sn.includes('Window')) wType = 'Café Table';
          else if (sn.includes('booth') || sn.includes('Cabin')) wType = 'Private Cabin';
          
          const pm: PaymentMethod = p.payment_method === 'credit_card' ? 'Credit Card' : p.payment_method === 'cash' ? 'Cash' : 'UPI';
          const stat: PaymentStatus = p.status === 'success' ? 'Successful' : p.status === 'failed' ? 'Failed' : p.status === 'refunded' ? 'Refunded' : 'Pending';

          return {
          id: p.id,
          transactionId: p.transaction_id || `TXN-${p.id.substring(0, 6).toUpperCase()}`,
          bookingId: p.reservation_id?.substring(0, 8).toUpperCase() || 'N/A',
          userName: p.reservation?.customer_name || 'Customer',
          userEmail: p.reservation?.profiles?.email || 'N/A',
          userPhone: p.reservation?.profiles?.phone || 'N/A',
          deskId: p.reservation?.seat_code || 'Unknown',
          workspaceType: wType,
          reservationDate: p.reservation?.booking_date || 'N/A',
          duration: `${p.reservation?.duration_hours || 0} Hours`,
          paymentDate: new Date(p.payment_date).toLocaleString(),
          paymentMethod: pm,
          subtotal: p.amount,
          tax: 0,
          discount: 0,
          amount: p.amount,
          status: stat,
          gatewayRef: p.transaction_id,
        };
      });
        setPayments(mapped);
      }
    }
    fetchPayments();
  }, []);

  // Drawer / Modals State
  const [activeDrawerPayment, setActiveDrawerPayment] = useState<PaymentRecord | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  const handleRefund = (id: string) => {
    setPayments((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: "Refunded" as const } : p))
    );
    showToast(`🔄 Full refund of payment for transaction ${id} processed.`);
    if (activeDrawerPayment && activeDrawerPayment.id === id) {
      setActiveDrawerPayment((prev) => (prev ? { ...prev, status: "Refunded" } : null));
    }
  };

  const filteredAndSortedPayments = useMemo(() => {
    let result = payments.filter((p) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        p.transactionId.toLowerCase().includes(q) ||
        p.bookingId.toLowerCase().includes(q) ||
        p.userName.toLowerCase().includes(q) ||
        p.userEmail.toLowerCase().includes(q) ||
        p.deskId.toLowerCase().includes(q);

      const matchesStatus = statusFilter === "All" || p.status === statusFilter;
      const matchesMethod = methodFilter === "All" || p.paymentMethod === methodFilter;

      return matchesSearch && matchesStatus && matchesMethod;
    });

    if (sortBy === "default") {
      result.sort((a, b) => new Date(b.paymentDate).getTime() - new Date(a.paymentDate).getTime());
    } else if (sortBy === "amount-high") {
      result.sort((a, b) => b.amount - a.amount);
    } else if (sortBy === "amount-low") {
      result.sort((a, b) => a.amount - b.amount);
    } else if (sortBy === "pending-first") {
      result.sort((a, b) => (a.status === "Pending" ? -1 : 1));
    } else if (sortBy === "failed-first") {
      result.sort((a, b) => (a.status === "Failed" ? -1 : 1));
    }

    return result;
  }, [payments, searchQuery, statusFilter, methodFilter, sortBy]);

  // Statistics Summary Cards calculation
  const stats = useMemo(() => {
    const totalTransactions = payments.length;
    const successfulCount = payments.filter((p) => p.status === "Successful").length;
    const pendingCount = payments.filter((p) => p.status === "Pending").length;
    const failedCount = payments.filter((p) => p.status === "Failed").length;
    const refundedCount = payments.filter((p) => p.status === "Refunded").length;

    const todayRevenue = payments
      .filter((p) => p.status === "Successful")
      .reduce((sum, p) => sum + p.amount, 0);

    const totalRefundAmount = payments
      .filter((p) => p.status === "Refunded")
      .reduce((sum, p) => sum + p.amount, 0);

    const avgTransactionValue = Math.round(todayRevenue / (successfulCount || 1));

    return {
      todayRevenue,
      totalTransactions,
      successfulCount,
      pendingCount,
      failedCount,
      totalRefundAmount,
      avgTransactionValue,
      onlinePercentage: "94%",
    };
  }, [payments]);

  const getStatusBadge = (status: PaymentStatus) => {
    switch (status) {
      case "Successful":
        return "bg-emerald-500/15 text-emerald-800 border-emerald-500/30";
      case "Pending":
        return "bg-amber-500/15 text-amber-800 border-amber-500/30";
      case "Failed":
        return "bg-rose-500/15 text-rose-800 border-rose-500/30";
      case "Refunded":
        return "bg-blue-500/15 text-blue-800 border-blue-500/30";
      case "Cancelled":
        return "bg-slate-500/15 text-slate-700 border-slate-500/30";
    }
  };

  const getMethodIcon = (method: PaymentMethod) => {
    switch (method) {
      case "UPI":
        return <Smartphone className="w-3.5 h-3.5 text-emerald-700 shrink-0" />;
      case "Credit Card":
        return <CreditCard className="w-3.5 h-3.5 text-blue-700 shrink-0" />;
      case "Debit Card":
        return <CreditCard className="w-3.5 h-3.5 text-purple-700 shrink-0" />;
      case "Wallet":
        return <Wallet className="w-3.5 h-3.5 text-amber-700 shrink-0" />;
      case "Cash":
        return <Coins className="w-3.5 h-3.5 text-amber-800 shrink-0" />;
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
            <CreditCard className="w-7 h-7 text-[#8C4A21]" />
            <h1 className="text-2xl sm:text-3xl font-black font-serif text-[#3D2314] tracking-tight">
              Payment Management
            </h1>
          </div>
          <p className="text-xs text-[#7A5A43] mt-1">
            Monitor transactions, revenue, refunds, and payment activity.
          </p>
        </div>

        {/* Export & Date Filter Controls */}
        <div className="flex items-center gap-3 self-start sm:self-auto">
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="px-3.5 py-2.5 bg-[#FFFDF9] border border-[#E5D5C5] rounded-2xl text-xs text-[#3D2314] font-bold focus:outline-none focus:ring-2 focus:ring-[#8C4A21]/30 transition-all cursor-pointer shadow-xs"
          >
            <option value="All">Date Range: All</option>
            <option value="Today">Today</option>
            <option value="Yesterday">Yesterday</option>
            <option value="Last 7 Days">Last 7 Days</option>
            <option value="This Month">This Month</option>
          </select>

          <button
            type="button"
            onClick={() => showToast("📥 Financial report exported to CSV successfully.")}
            className="px-4 py-2.5 rounded-2xl bg-[#8C4A21] hover:bg-[#3D2314] text-white font-bold text-xs shadow-xs transition-all flex items-center gap-2 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            Export Report
          </button>
        </div>
      </div>

      {/* Top 8 Rich KPI Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        {/* Today's Revenue */}
        <div className="bg-[#FFFDF9] rounded-2xl p-3.5 border border-[#E5D5C5] shadow-xs hover:-translate-y-1 hover:shadow-md transition-all duration-200">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-[#7A5A43] uppercase tracking-wider">Today's Revenue</span>
            <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-800">
              <DollarSign className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-xl font-bold font-mono text-[#3D2314]">₹{stats.todayRevenue.toLocaleString("en-IN")}</div>
            <div className="text-[10px] text-emerald-700 font-bold flex items-center gap-0.5 mt-0.5">
              <TrendingUp className="w-3 h-3" /> +18.4%
            </div>
          </div>
        </div>

        {/* Total Transactions */}
        <div className="bg-[#FFFDF9] rounded-2xl p-3.5 border border-[#E5D5C5] shadow-xs hover:-translate-y-1 hover:shadow-md transition-all duration-200">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-[#7A5A43] uppercase tracking-wider">Transactions</span>
            <div className="p-1.5 rounded-lg bg-[#8C4A21]/10 text-[#8C4A21]">
              <CreditCard className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-xl font-bold font-mono text-[#3D2314]">{stats.totalTransactions}</div>
            <div className="text-[10px] text-[#7A5A43] font-medium mt-0.5">Total Volume</div>
          </div>
        </div>

        {/* Successful Payments */}
        <div className="bg-[#FFFDF9] rounded-2xl p-3.5 border border-[#E5D5C5] shadow-xs hover:-translate-y-1 hover:shadow-md transition-all duration-200">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-[#7A5A43] uppercase tracking-wider">Successful</span>
            <div className="p-1.5 rounded-lg bg-emerald-500/15 text-emerald-800">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-xl font-bold font-mono text-emerald-800">{stats.successfulCount}</div>
            <div className="text-[10px] text-emerald-700 font-bold mt-0.5">90.1% Success Rate</div>
          </div>
        </div>

        {/* Pending Payments */}
        <div className="bg-[#FFFDF9] rounded-2xl p-3.5 border border-[#E5D5C5] shadow-xs hover:-translate-y-1 hover:shadow-md transition-all duration-200">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-[#7A5A43] uppercase tracking-wider">Pending</span>
            <div className="p-1.5 rounded-lg bg-amber-500/15 text-amber-800">
              <Clock className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-xl font-bold font-mono text-amber-800">{stats.pendingCount}</div>
            <div className="text-[10px] text-amber-700 font-semibold mt-0.5">Awaiting Gateway</div>
          </div>
        </div>

        {/* Failed Payments */}
        <div className="bg-[#FFFDF9] rounded-2xl p-3.5 border border-[#E5D5C5] shadow-xs hover:-translate-y-1 hover:shadow-md transition-all duration-200">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-[#7A5A43] uppercase tracking-wider">Failed</span>
            <div className="p-1.5 rounded-lg bg-rose-500/15 text-rose-800">
              <XCircle className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-xl font-bold font-mono text-rose-800">{stats.failedCount}</div>
            <div className="text-[10px] text-rose-700 font-semibold mt-0.5">Gateway Error</div>
          </div>
        </div>

        {/* Refund Amount */}
        <div className="bg-[#FFFDF9] rounded-2xl p-3.5 border border-[#E5D5C5] shadow-xs hover:-translate-y-1 hover:shadow-md transition-all duration-200">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-[#7A5A43] uppercase tracking-wider">Refunds</span>
            <div className="p-1.5 rounded-lg bg-blue-500/15 text-blue-800">
              <RotateCcw className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-xl font-bold font-mono text-blue-800">₹{stats.totalRefundAmount}</div>
            <div className="text-[10px] text-blue-700 font-medium mt-0.5">Processed Today</div>
          </div>
        </div>

        {/* Avg Transaction Value */}
        <div className="bg-[#FFFDF9] rounded-2xl p-3.5 border border-[#E5D5C5] shadow-xs hover:-translate-y-1 hover:shadow-md transition-all duration-200">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-[#7A5A43] uppercase tracking-wider">Avg Order</span>
            <div className="p-1.5 rounded-lg bg-purple-500/10 text-purple-800">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-xl font-bold font-mono text-purple-800">₹{stats.avgTransactionValue}</div>
            <div className="text-[10px] text-purple-700 font-medium mt-0.5">Per Ticket</div>
          </div>
        </div>

        {/* Online Payment Users */}
        <div className="bg-[#FFFDF9] rounded-2xl p-3.5 border border-[#E5D5C5] shadow-xs hover:-translate-y-1 hover:shadow-md transition-all duration-200">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-[#7A5A43] uppercase tracking-wider">Online Users</span>
            <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-800">
              <Smartphone className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-xl font-bold font-mono text-cyan-800">{stats.onlinePercentage}</div>
            <div className="text-[10px] text-cyan-700 font-medium mt-0.5">UPI / Cards</div>
          </div>
        </div>
      </div>

      {/* Payment Analytics Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Revenue Overview Chart */}
        <div className="bg-[#FFFDF9] rounded-3xl p-6 border border-[#E5D5C5] shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E5D5C5]/60 pb-3">
            <div>
              <h3 className="text-base font-bold font-serif text-[#3D2314]">
                📊 Revenue Overview
              </h3>
              <p className="text-xs text-[#7A5A43]">
                Daily, weekly, and monthly payment collections breakdown
              </p>
            </div>
            {/* Timeframe Toggle */}
            <div className="flex gap-1 bg-[#F8F1EA] p-1 rounded-xl border border-[#E5D5C5] text-xs font-bold self-start sm:self-auto">
              {(["daily", "weekly", "monthly"] as const).map((tf) => (
                <button
                  key={tf}
                  onClick={() => setRevenueTimeframe(tf)}
                  className={`px-3 py-1 rounded-lg capitalize transition-all cursor-pointer ${
                    revenueTimeframe === tf
                      ? "bg-[#3D2314] text-white shadow-2xs"
                      : "text-[#7A5A43] hover:text-[#3D2314]"
                  }`}
                >
                  {tf}
                </button>
              ))}
            </div>
          </div>

          {/* Revenue Bar Chart Visual */}
          <div className="h-44 flex items-end justify-between gap-2.5 pt-4 border-b border-[#E5D5C5]">
            {[14, 28, 45, 32, 78, 92, 64].map((val, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 group">
                <div
                  className="w-full bg-[#8C4A21] rounded-t-md group-hover:bg-[#3D2314] transition-all duration-200"
                  style={{ height: `${val}%` }}
                />
                <span className="text-[10px] font-mono font-bold text-[#7A5A43]">
                  {revenueTimeframe === "daily"
                    ? `${8 + idx * 2}:00`
                    : revenueTimeframe === "weekly"
                    ? ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][idx]
                    : `Wk ${idx + 1}`}
                </span>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center text-xs font-semibold text-[#7A5A43]">
            <span>Peak Collection Hour: <strong className="text-[#3D2314]">02:00 PM - 03:00 PM</strong></span>
            <span className="text-emerald-700 font-bold">↑ +14.2% Growth</span>
          </div>
        </div>

        {/* Right: Payment Methods Distribution */}
        <div className="bg-[#FFFDF9] rounded-3xl p-6 border border-[#E5D5C5] shadow-sm space-y-4">
          <div className="border-b border-[#E5D5C5]/60 pb-3">
            <h3 className="text-base font-bold font-serif text-[#3D2314]">
              💳 Payment Methods Distribution
            </h3>
            <p className="text-xs text-[#7A5A43]">
              Share of transactions processed by payment type
            </p>
          </div>

          <div className="space-y-3.5 my-2 text-xs">
            {/* UPI */}
            <div>
              <div className="flex justify-between font-bold text-[#3D2314] mb-1">
                <span className="flex items-center gap-1.5"><Smartphone className="w-3.5 h-3.5 text-emerald-700" /> UPI (GPay / PhonePe / Paytm)</span>
                <span>58% (₹14,410)</span>
              </div>
              <div className="w-full h-2.5 bg-[#E5D5C5] rounded-full overflow-hidden">
                <div className="h-full bg-emerald-600 rounded-full" style={{ width: "58%" }} />
              </div>
            </div>

            {/* Credit Card */}
            <div>
              <div className="flex justify-between font-bold text-[#3D2314] mb-1">
                <span className="flex items-center gap-1.5"><CreditCard className="w-3.5 h-3.5 text-blue-700" /> Credit Card</span>
                <span>24% (₹5,960)</span>
              </div>
              <div className="w-full h-2.5 bg-[#E5D5C5] rounded-full overflow-hidden">
                <div className="h-full bg-blue-600 rounded-full" style={{ width: "24%" }} />
              </div>
            </div>

            {/* Debit Card */}
            <div>
              <div className="flex justify-between font-bold text-[#3D2314] mb-1">
                <span className="flex items-center gap-1.5"><CreditCard className="w-3.5 h-3.5 text-purple-700" /> Debit Card</span>
                <span>10% (₹2,485)</span>
              </div>
              <div className="w-full h-2.5 bg-[#E5D5C5] rounded-full overflow-hidden">
                <div className="h-full bg-purple-600 rounded-full" style={{ width: "10%" }} />
              </div>
            </div>

            {/* Wallet */}
            <div>
              <div className="flex justify-between font-bold text-[#3D2314] mb-1">
                <span className="flex items-center gap-1.5"><Wallet className="w-3.5 h-3.5 text-amber-700" /> Digital Wallet (Apple / Amazon Pay)</span>
                <span>5% (₹1,240)</span>
              </div>
              <div className="w-full h-2.5 bg-[#E5D5C5] rounded-full overflow-hidden">
                <div className="h-full bg-amber-600 rounded-full" style={{ width: "5%" }} />
              </div>
            </div>

            {/* Cash */}
            <div>
              <div className="flex justify-between font-bold text-[#3D2314] mb-1">
                <span className="flex items-center gap-1.5"><Coins className="w-3.5 h-3.5 text-amber-800" /> Cash POS</span>
                <span>3% (₹755)</span>
              </div>
              <div className="w-full h-2.5 bg-[#E5D5C5] rounded-full overflow-hidden">
                <div className="h-full bg-amber-800 rounded-full" style={{ width: "3%" }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Toolbar Search & Multi-Filters */}
      <div className="bg-[#FFFDF9] p-4 rounded-2xl border border-[#E5D5C5] shadow-sm space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Search Bar */}
          <div className="relative lg:col-span-2">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#7A5A43]" />
            <input
              type="text"
              placeholder="Search Transaction ID, User, Booking ID, Desk..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-3 py-2.5 bg-[#FAF4ED] border border-[#DFCDBE] rounded-xl text-xs text-[#3D2314] focus:outline-none focus:ring-2 focus:ring-[#8C4A21]/30 placeholder-[#7A5A43]/60 transition-all font-medium"
            />
          </div>

          {/* Filter Status */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2.5 bg-[#FAF4ED] border border-[#DFCDBE] rounded-xl text-xs text-[#3D2314] font-medium focus:outline-none focus:ring-2 focus:ring-[#8C4A21]/30 transition-all cursor-pointer"
            >
              <option value="All">Payment Status (All)</option>
              <option value="Successful">Successful</option>
              <option value="Pending">Pending</option>
              <option value="Failed">Failed</option>
              <option value="Refunded">Refunded</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          {/* Filter Payment Method */}
          <div>
            <select
              value={methodFilter}
              onChange={(e) => setMethodFilter(e.target.value)}
              className="w-full px-3 py-2.5 bg-[#FAF4ED] border border-[#DFCDBE] rounded-xl text-xs text-[#3D2314] font-medium focus:outline-none focus:ring-2 focus:ring-[#8C4A21]/30 transition-all cursor-pointer"
            >
              <option value="All">Payment Method (All)</option>
              <option value="UPI">UPI</option>
              <option value="Credit Card">Credit Card</option>
              <option value="Debit Card">Debit Card</option>
              <option value="Wallet">Wallet</option>
              <option value="Cash">Cash</option>
            </select>
          </div>

          {/* Sort By Dropdown */}
          <div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3 py-2.5 bg-[#FAF4ED] border border-[#DFCDBE] rounded-xl text-xs text-[#3D2314] font-medium focus:outline-none focus:ring-2 focus:ring-[#8C4A21]/30 transition-all cursor-pointer"
            >
              <option value="default">Latest Transactions First</option>
              <option value="amount-high">Highest Amount</option>
              <option value="amount-low">Lowest Amount</option>
              <option value="pending-first">Pending First</option>
              <option value="failed-first">Failed First</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Full-Width Transaction Table */}
      <div className="bg-[#FFFDF9] rounded-2xl border border-[#E5D5C5] shadow-sm overflow-hidden space-y-4">
        {/* Desktop View Table */}
        <div className="hidden md:block overflow-x-auto max-h-[660px] overflow-y-auto">
          <table className="w-full text-left text-xs text-[#3D2314] border-collapse">
            <thead className="bg-[#F8F1EA] sticky top-0 z-10 uppercase text-[11px] font-extrabold tracking-wider text-[#7A5A43] border-b border-[#E5D5C5]">
              <tr>
                <th className="py-4 px-4 font-bold">Transaction ID</th>
                <th className="py-4 px-4 font-bold">Booking ID</th>
                <th className="py-4 px-4 font-bold">User Name</th>
                <th className="py-4 px-4 font-bold">Desk ID</th>
                <th className="py-4 px-4 font-bold">Workspace Type</th>
                <th className="py-4 px-4 font-bold">Payment Date</th>
                <th className="py-4 px-4 font-bold">Payment Method</th>
                <th className="py-4 px-4 font-bold">Amount</th>
                <th className="py-4 px-4 font-bold">Payment Status</th>
                <th className="py-4 px-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5D5C5]/60">
              {filteredAndSortedPayments.length > 0 ? (
                filteredAndSortedPayments.map((p, idx) => {
                  const isOdd = idx % 2 !== 0;

                  return (
                    <tr
                      key={p.id}
                      className={`${
                        isOdd ? "bg-[#FBF7F1]/60" : "bg-[#FFFDF9]"
                      } hover:bg-[#F3E9DD] transition-colors`}
                    >
                      {/* 1. Transaction ID */}
                      <td className="py-4 px-4 font-bold font-mono text-sm text-[#8C4A21] whitespace-nowrap">
                        {p.transactionId}
                      </td>

                      {/* 2. Booking ID */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <span className="font-extrabold font-mono text-xs text-[#8C4A21] bg-[#F8F1EA] px-2.5 py-1 rounded-full border border-[#E5D5C5]">
                          {p.bookingId}
                        </span>
                      </td>

                      {/* 3. User Name (Avatar + Name + Email) */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#3D2314] to-[#8C4A21] text-amber-200 flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs ring-2 ring-[#E5D5C5]/40">
                            {p.userName.charAt(0)}
                          </div>
                          <div>
                            <div className="font-bold text-sm text-[#3D2314]">{p.userName}</div>
                            <div className="text-[11px] text-[#7A5A43]">{p.userEmail}</div>
                          </div>
                        </div>
                      </td>

                      {/* 4. Desk ID */}
                      <td className="py-4 px-4 font-bold font-mono text-xs text-[#3D2314] whitespace-nowrap">
                        {p.deskId}
                      </td>

                      {/* 5. Workspace Type */}
                      <td className="py-4 px-4 text-xs font-semibold text-[#7A5A43] whitespace-nowrap">
                        {p.workspaceType}
                      </td>

                      {/* 6. Payment Date */}
                      <td className="py-4 px-4 text-xs font-medium text-[#7A5A43] whitespace-nowrap">
                        {p.paymentDate}
                      </td>

                      {/* 7. Payment Method */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1.5 font-bold text-xs text-[#3D2314]">
                          {getMethodIcon(p.paymentMethod)}
                          {p.paymentMethod}
                        </span>
                      </td>

                      {/* 8. Amount */}
                      <td className="py-4 px-4 font-bold font-mono text-sm text-[#3D2314] whitespace-nowrap">
                        ₹{p.amount}
                      </td>

                      {/* 9. Payment Status */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-[11px] font-extrabold border uppercase tracking-wider ${getStatusBadge(
                            p.status
                          )}`}
                        >
                          {p.status}
                        </span>
                      </td>

                      {/* 10. Actions */}
                      <td className="py-4 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Download Receipt */}
                          <button
                            type="button"
                            onClick={() => showToast(`📄 Receipt for ${p.transactionId} downloaded.`)}
                            className="p-1.5 rounded-xl bg-[#FAF4ED] hover:bg-[#3D2314] hover:text-white text-[#3D2314] border border-[#DFCDBE] transition-all cursor-pointer"
                            title="Download Receipt PDF"
                          >
                            <FileText className="w-4 h-4" />
                          </button>

                          {/* Refund Payment (Visible ONLY for Successful payments) */}
                          {p.status === "Successful" && (
                            <button
                              type="button"
                              onClick={() => handleRefund(p.id)}
                              className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-800 font-bold text-xs border border-rose-200 transition-all cursor-pointer flex items-center gap-1"
                              title="Process Full Refund"
                            >
                              <RotateCcw className="w-3.5 h-3.5" />
                              Refund
                            </button>
                          )}

                          {/* View Details Drawer Trigger */}
                          <button
                            type="button"
                            onClick={() => setActiveDrawerPayment(p)}
                            className="p-1.5 rounded-xl bg-[#F8F1EA] hover:bg-[#3D2314] hover:text-white text-[#3D2314] border border-[#E5D5C5] transition-all cursor-pointer"
                            title="View Payment Details"
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
                    No payment transactions found matching your search and filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile View Responsive Cards */}
        <div className="block md:hidden p-4 space-y-4">
          {filteredAndSortedPayments.length > 0 ? (
            filteredAndSortedPayments.map((p) => (
              <div key={p.id} className="bg-[#FFFDF9] rounded-2xl border border-[#E5D5C5] p-4 space-y-3 text-xs">
                <div className="flex justify-between items-center border-b border-[#E5D5C5]/50 pb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-sm text-[#8C4A21]">{p.transactionId}</span>
                    <span className="font-mono font-extrabold text-xs text-[#8C4A21] bg-[#F8F1EA] px-2.5 py-0.5 rounded-full border border-[#E5D5C5]">
                      {p.bookingId}
                    </span>
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${getStatusBadge(p.status)}`}>
                    {p.status}
                  </span>
                </div>

                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#3D2314] to-[#8C4A21] text-amber-200 flex items-center justify-center font-bold text-sm shrink-0 shadow-2xs">
                      {p.userName.charAt(0)}
                    </div>
                    <div>
                      <div className="font-bold text-sm text-[#3D2314]">{p.userName}</div>
                      <div className="text-xs text-[#7A5A43]">{p.userEmail}</div>
                    </div>
                  </div>
                  <span className="font-mono font-bold text-base text-[#3D2314]">₹{p.amount}</span>
                </div>

                <div className="bg-[#F8F1EA]/60 p-3 rounded-xl border border-[#E5D5C5]/40 space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-[#7A5A43] font-semibold">Location / Workspace:</span>
                    <span className="font-bold text-[#3D2314]">{p.deskId} ({p.workspaceType})</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#7A5A43] font-semibold">Payment Method:</span>
                    <span className="font-bold text-[#3D2314] flex items-center gap-1">{getMethodIcon(p.paymentMethod)} {p.paymentMethod}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#7A5A43] font-semibold">Date &amp; Time:</span>
                    <span className="font-mono text-[#7A5A43]">{p.paymentDate}</span>
                  </div>
                </div>

                <div className="pt-2 flex justify-end gap-2 border-t border-[#E5D5C5]/50">
                  <button
                    type="button"
                    onClick={() => showToast(`📄 Receipt for ${p.transactionId} downloaded.`)}
                    className="p-2 rounded-xl bg-[#FAF4ED] text-[#3D2314] border border-[#DFCDBE]"
                  >
                    <FileText className="w-4 h-4" />
                  </button>

                  {p.status === "Successful" && (
                    <button
                      type="button"
                      onClick={() => handleRefund(p.id)}
                      className="flex-1 py-2 rounded-xl bg-rose-50 text-rose-800 font-bold text-xs border border-rose-200 flex items-center justify-center gap-1"
                    >
                      <RotateCcw className="w-3.5 h-3.5" /> Refund
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => setActiveDrawerPayment(p)}
                    className="p-2 rounded-xl bg-[#F8F1EA] text-[#3D2314] border border-[#E5D5C5]"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="py-8 text-center text-xs text-[#7A5A43] bg-[#F8F1EA]/50 rounded-xl">
              No payment transactions found matching your search and filter criteria.
            </div>
          )}
        </div>
      </div>

      {/* Side Drawer Modal: Payment Details */}
      <AnimatePresence>
        {activeDrawerPayment && (
          <div className="fixed inset-0 z-50 overflow-hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveDrawerPayment(null)}
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
                {/* Drawer Header */}
                <div className="p-6 border-b border-[#E5D5C5] bg-[#F8F1EA] flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-5 h-5 text-[#8C4A21]" />
                      <h3 className="text-lg font-bold font-serif text-[#3D2314]">
                        Payment Details
                      </h3>
                    </div>
                    <span className="text-xs font-mono font-bold text-[#8C4A21]">
                      {activeDrawerPayment.transactionId}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveDrawerPayment(null)}
                    className="p-2 rounded-xl bg-[#FFFDF9] hover:bg-[#3D2314] hover:text-white text-[#3D2314] border border-[#E5D5C5] transition-colors cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Drawer Content */}
                <div className="p-6 overflow-y-auto space-y-4 text-xs flex-1">
                  {/* Customer Information */}
                  <div className="bg-[#FAF4ED] p-4 rounded-2xl border border-[#DFCDBE] space-y-2">
                    <div className="text-[10px] font-extrabold uppercase tracking-wider text-[#7A5A43]">
                      Customer Information
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#7A5A43] font-bold">Customer Name:</span>
                      <span className="font-bold text-[#3D2314]">{activeDrawerPayment.userName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#7A5A43] font-bold">Email Address:</span>
                      <span>{activeDrawerPayment.userEmail}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#7A5A43] font-bold">Phone Number:</span>
                      <span>{activeDrawerPayment.userPhone}</span>
                    </div>
                  </div>

                  {/* Connected Booking Information */}
                  <div className="bg-[#FAF4ED] p-4 rounded-2xl border border-[#DFCDBE] space-y-2">
                    <div className="text-[10px] font-extrabold uppercase tracking-wider text-[#7A5A43]">
                      Connected Booking Information
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#7A5A43] font-bold">Booking ID:</span>
                      <span className="font-mono font-bold text-[#8C4A21]">{activeDrawerPayment.bookingId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#7A5A43] font-bold">Desk ID &amp; Type:</span>
                      <span className="font-bold">{activeDrawerPayment.deskId} ({activeDrawerPayment.workspaceType})</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#7A5A43] font-bold">Reservation Date:</span>
                      <span>{activeDrawerPayment.reservationDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#7A5A43] font-bold">Duration:</span>
                      <span>{activeDrawerPayment.duration}</span>
                    </div>
                  </div>

                  {/* Amount Breakdown */}
                  <div className="bg-[#FAF4ED] p-4 rounded-2xl border border-[#DFCDBE] space-y-2">
                    <div className="text-[10px] font-extrabold uppercase tracking-wider text-[#7A5A43]">
                      Amount Breakdown &amp; Method
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#7A5A43]">Subtotal:</span>
                      <span className="font-semibold font-mono">₹{activeDrawerPayment.subtotal}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#7A5A43]">Tax (5% GST):</span>
                      <span className="font-semibold font-mono">₹{activeDrawerPayment.tax}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#7A5A43]">Discount / Promo:</span>
                      <span className="font-semibold font-mono">₹{activeDrawerPayment.discount}</span>
                    </div>
                    <div className="flex justify-between pt-1 border-t border-[#DFCDBE]/60 font-bold text-sm text-[#3D2314]">
                      <span>Final Amount Paid:</span>
                      <span className="text-[#8C4A21] font-mono">₹{activeDrawerPayment.amount}</span>
                    </div>
                    <div className="flex justify-between pt-2">
                      <span className="text-[#7A5A43] font-bold">Payment Method:</span>
                      <span className="font-bold flex items-center gap-1">{getMethodIcon(activeDrawerPayment.paymentMethod)} {activeDrawerPayment.paymentMethod}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#7A5A43] font-bold">Gateway Reference:</span>
                      <span className="font-mono text-[11px] text-[#7A5A43]">{activeDrawerPayment.gatewayRef || "REF-109283"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#7A5A43] font-bold">Payment Status:</span>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${getStatusBadge(activeDrawerPayment.status)}`}>
                        {activeDrawerPayment.status}
                      </span>
                    </div>
                  </div>

                  {/* Payment Timeline */}
                  <div className="bg-[#FAF4ED] p-4 rounded-2xl border border-[#DFCDBE] space-y-3">
                    <div className="text-[10px] font-extrabold uppercase tracking-wider text-[#7A5A43]">
                      Payment Timeline
                    </div>
                    <div className="space-y-2 text-[11px]">
                      <div className="flex items-center gap-2 text-emerald-800">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>Order Placed &amp; Checkout Initiated</span>
                      </div>
                      <div className="flex items-center gap-2 text-emerald-800">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>Gateway Authorized Payment</span>
                      </div>
                      <div className="flex items-center gap-2 text-emerald-800">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>Payment Captured ({activeDrawerPayment.paymentDate})</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="p-6 border-t border-[#E5D5C5] bg-[#F8F1EA] space-y-2">
                  <button
                    type="button"
                    onClick={() => showToast(`📄 Digital invoice for ${activeDrawerPayment.transactionId} downloaded.`)}
                    className="w-full py-3 rounded-2xl bg-[#8C4A21] hover:bg-[#3D2314] text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Download className="w-4 h-4" /> Download Official Receipt (PDF)
                  </button>

                  {activeDrawerPayment.status === "Successful" && (
                    <button
                      type="button"
                      onClick={() => handleRefund(activeDrawerPayment.id)}
                      className="w-full py-2.5 rounded-2xl bg-rose-50 text-rose-800 border border-rose-200 font-bold text-xs hover:bg-rose-100 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <RotateCcw className="w-4 h-4" /> Process Full Refund
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => setActiveDrawerPayment(null)}
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
