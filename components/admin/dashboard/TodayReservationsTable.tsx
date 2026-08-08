"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Calendar,
  Clock,
  UserCheck,
  LogOut,
  XCircle,
  Search,
  Filter,
  ArrowUpDown,
  CheckCircle2,
  Armchair,
  Briefcase,
  Building2,
  Users,
  BookOpen,
  Coffee,
  X,
  ArrowRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export type WorkspaceType =
  | "Desk"
  | "Workstation"
  | "Private Cabin"
  | "Meeting Room"
  | "Study Space"
  | "Café Table";

export type BookingStatus =
  | "Confirmed"
  | "Checked In"
  | "Checked Out";

export interface ReservationRow {
  bookingId: string;
  userName: string;
  userEmail: string;
  deskId: string;
  arrivalTime: string;
  date: string;
  duration: string;
  workspaceType: WorkspaceType;
  status: BookingStatus;
}

const INITIAL_RESERVATIONS: ReservationRow[] = [
  {
    bookingId: "BK-1001",
    userName: "Rahul Sharma",
    userEmail: "rahul@gmail.com",
    deskId: "W-08",
    arrivalTime: "09:30 AM",
    date: "07 Aug 2026",
    duration: "4 Hours",
    workspaceType: "Workstation",
    status: "Checked In",
  },
  {
    bookingId: "BK-1002",
    userName: "Sarah Jenkins",
    userEmail: "sarah.j@gmail.com",
    deskId: "C-02",
    arrivalTime: "10:00 AM",
    date: "07 Aug 2026",
    duration: "2 Hours",
    workspaceType: "Café Table",
    status: "Confirmed",
  },
  {
    bookingId: "BK-1003",
    userName: "Anita Desai",
    userEmail: "anita.desai@company.com",
    deskId: "M-05",
    arrivalTime: "11:00 AM",
    date: "07 Aug 2026",
    duration: "Half Day",
    workspaceType: "Meeting Room",
    status: "Checked In",
  },
  {
    bookingId: "BK-1004",
    userName: "Vikram Patel",
    userEmail: "vikram.p@yahoo.com",
    deskId: "P-03",
    arrivalTime: "11:30 AM",
    date: "07 Aug 2026",
    duration: "Full Day",
    workspaceType: "Private Cabin",
    status: "Confirmed",
  },
  {
    bookingId: "BK-1005",
    userName: "Elena Rostova",
    userEmail: "elena.r@design.io",
    deskId: "S-04",
    arrivalTime: "08:30 AM",
    date: "07 Aug 2026",
    duration: "2 Hours",
    workspaceType: "Study Space",
    status: "Checked Out",
  },
  {
    bookingId: "BK-1006",
    userName: "Michael Chang",
    userEmail: "m.chang@tech.com",
    deskId: "D-01",
    arrivalTime: "01:00 PM",
    date: "07 Aug 2026",
    duration: "1 Hour",
    workspaceType: "Desk",
    status: "Checked Out",
  },
  {
    bookingId: "BK-1007",
    userName: "Priya Nair",
    userEmail: "priya.nair@startup.in",
    deskId: "W-04",
    arrivalTime: "02:00 PM",
    date: "07 Aug 2026",
    duration: "4 Hours",
    workspaceType: "Workstation",
    status: "Confirmed",
  },
  {
    bookingId: "BK-1008",
    userName: "David Miller",
    userEmail: "david.m@finance.com",
    deskId: "P-01",
    arrivalTime: "02:30 PM",
    date: "07 Aug 2026",
    duration: "Half Day",
    workspaceType: "Private Cabin",
    status: "Checked In",
  },
  {
    bookingId: "BK-1009",
    userName: "Aarav Gupta",
    userEmail: "aarav.g@gmail.com",
    deskId: "C-08",
    arrivalTime: "03:00 PM",
    date: "07 Aug 2026",
    duration: "2 Hours",
    workspaceType: "Café Table",
    status: "Confirmed",
  },
  {
    bookingId: "BK-1010",
    userName: "Sophia Al-Mansoor",
    userEmail: "sophia.a@consulting.org",
    deskId: "M-02",
    arrivalTime: "03:30 PM",
    date: "07 Aug 2026",
    duration: "2 Hours",
    workspaceType: "Meeting Room",
    status: "Confirmed",
  },
  {
    bookingId: "BK-1011",
    userName: "Rohan Kapoor",
    userEmail: "rohan.k@workspace.io",
    deskId: "S-02",
    arrivalTime: "08:00 AM",
    date: "07 Aug 2026",
    duration: "3 Hours",
    workspaceType: "Study Space",
    status: "Checked Out",
  },
  {
    bookingId: "BK-1012",
    userName: "Emily Watson",
    userEmail: "emily.w@creative.co",
    deskId: "D-05",
    arrivalTime: "04:30 PM",
    date: "07 Aug 2026",
    duration: "1 Hour",
    workspaceType: "Desk",
    status: "Confirmed",
  },
];

export default function TodayReservationsTable() {
  const [reservations, setReservations] = useState<ReservationRow[]>(INITIAL_RESERVATIONS);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [workspaceFilter, setWorkspaceFilter] = useState<string>("All");
  const [dateFilter, setDateFilter] = useState<string>("All");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [toast, setToast] = useState<string | null>(null);

  const handleStatusChange = (bookingId: string, newStatus: BookingStatus) => {
    setReservations((prev) =>
      prev.map((item) => (item.bookingId === bookingId ? { ...item, status: newStatus } : item))
    );
    setToast(`Booking ${bookingId} updated to ${newStatus}`);
    setTimeout(() => setToast(null), 3000);
  };

  const handleCancelBooking = (bookingId: string) => {
    setReservations((prev) => prev.filter((item) => item.bookingId !== bookingId));
    setToast(`Booking ${bookingId} cancelled`);
    setTimeout(() => setToast(null), 3000);
  };

  // Status Priority Rank mapping: Confirmed (1) > Checked In (2) > Checked Out (3)
  const STATUS_RANK: Record<string, number> = {
    Confirmed: 1,
    "Checked In": 2,
    "Checked Out": 3,
  };

  const parseTimeMinutes = (timeStr: string): number => {
    if (!timeStr) return 0;
    const match = timeStr.match(/(\d+):(\d+)\s*(AM|PM)/i);
    if (!match) return 0;
    let hours = parseInt(match[1], 10);
    const minutes = parseInt(match[2], 10);
    const period = match[3].toUpperCase();
    if (period === "PM" && hours < 12) hours += 12;
    if (period === "AM" && hours === 12) hours = 0;
    return hours * 60 + minutes;
  };

  const parseTimestamp = (dateStr: string): number => {
    const ts = Date.parse(dateStr);
    return isNaN(ts) ? 0 : ts;
  };

  // Filtered & Sorted Reservations (Default: Priority Rank -> Newest Date -> Latest Arrival Time)
  const filteredReservations = useMemo(() => {
    return reservations
      .filter((r) => {
        const matchesSearch =
          r.bookingId.toLowerCase().includes(searchQuery.toLowerCase()) ||
          r.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          r.userEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
          r.deskId.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesStatus = statusFilter === "All" || r.status === statusFilter;
        const matchesWorkspace = workspaceFilter === "All" || r.workspaceType === workspaceFilter;
        const matchesDate = dateFilter === "All" || r.date === dateFilter;

        return matchesSearch && matchesStatus && matchesWorkspace && matchesDate;
      })
      .sort((a, b) => {
        // Priority Rank first
        const rankA = STATUS_RANK[a.status] || 99;
        const rankB = STATUS_RANK[b.status] || 99;
        if (rankA !== rankB) return rankA - rankB;

        // Newest Date first
        const dateA = parseTimestamp(a.date);
        const dateB = parseTimestamp(b.date);
        if (dateA !== dateB) return dateB - dateA;

        // Latest Arrival Time first
        const timeA = parseTimeMinutes(a.arrivalTime);
        const timeB = parseTimeMinutes(b.arrivalTime);
        if (timeA !== timeB) return timeB - timeA;

        return b.bookingId.localeCompare(a.bookingId);
      });
  }, [reservations, searchQuery, statusFilter, workspaceFilter, dateFilter]);

  const dashboardReservations = useMemo(() => filteredReservations.slice(0, 8), [filteredReservations]);

  const getWorkspaceBadge = (type: WorkspaceType) => {
    switch (type) {
      case "Desk":
        return {
          style: "bg-amber-500/15 text-amber-900 border-amber-500/30",
          icon: <Armchair className="w-3.5 h-3.5 text-amber-700" />,
          label: "🪑 Desk",
        };
      case "Workstation":
        return {
          style: "bg-indigo-500/15 text-indigo-900 border-indigo-500/30",
          icon: <Briefcase className="w-3.5 h-3.5 text-indigo-700" />,
          label: "💼 Workstation",
        };
      case "Private Cabin":
        return {
          style: "bg-purple-500/15 text-purple-900 border-purple-500/30",
          icon: <Building2 className="w-3.5 h-3.5 text-purple-700" />,
          label: "🏢 Private Cabin",
        };
      case "Meeting Room":
        return {
          style: "bg-blue-500/15 text-blue-900 border-blue-500/30",
          icon: <Users className="w-3.5 h-3.5 text-blue-700" />,
          label: "👥 Meeting Room",
        };
      case "Study Space":
        return {
          style: "bg-emerald-500/15 text-emerald-900 border-emerald-500/30",
          icon: <BookOpen className="w-3.5 h-3.5 text-emerald-700" />,
          label: "📚 Study Space",
        };
      case "Café Table":
        return {
          style: "bg-orange-500/15 text-orange-900 border-orange-500/30",
          icon: <Coffee className="w-3.5 h-3.5 text-orange-700" />,
          label: "☕ Café Table",
        };
    }
  };

  const getStatusBadge = (status: BookingStatus) => {
    switch (status) {
      case "Confirmed":
        return "bg-blue-500/15 text-blue-800 border-blue-500/30";
      case "Checked In":
        return "bg-emerald-500/15 text-emerald-800 border-emerald-500/30";
      case "Checked Out":
        return "bg-slate-500/15 text-slate-700 border-slate-500/30";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
      className="bg-[#FFFDF9] rounded-[20px] p-6 border border-[#E5D5C5] shadow-sm space-y-6 w-full relative"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <Calendar className="w-6 h-6 text-[#8C4A21]" />
            <h3 className="text-xl font-bold font-serif text-[#3D2314]">Today's Reservations</h3>
          </div>
          <p className="text-xs text-[#7A5A43] mt-1">
            Manage today's workspace bookings and customer check-ins.
          </p>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="text-xs font-mono font-bold text-[#8C4A21] bg-[#F8F1EA] px-3.5 py-1.5 rounded-full border border-[#E5D5C5] shadow-2xs">
            {filteredReservations.length} Bookings Today
          </span>
        </div>
      </div>

      {/* Toast Alert */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-3.5 rounded-2xl bg-[#3D2314] text-white text-xs font-semibold flex items-center justify-between shadow-md border border-amber-900/40"
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{toast}</span>
            </div>
            <button
              type="button"
              onClick={() => setToast(null)}
              className="text-amber-300 hover:text-white font-bold p-1 cursor-pointer transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search & Filters Toolbar */}
      <div className="bg-[#F8F1EA]/80 p-4 rounded-2xl border border-[#E5D5C5] space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Search */}
          <div className="relative lg:col-span-2">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#7A5A43]" />
            <input
              type="text"
              placeholder="Search Booking ID, User, Desk..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-[#FFFDF9] border border-[#E5D5C5] rounded-xl text-xs text-[#3D2314] focus:outline-none focus:ring-2 focus:ring-[#8C4A21]/30 placeholder-[#7A5A43]/60 transition-all"
            />
          </div>

          {/* Filter Status */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 bg-[#FFFDF9] border border-[#E5D5C5] rounded-xl text-xs text-[#3D2314] font-medium focus:outline-none focus:ring-2 focus:ring-[#8C4A21]/30 transition-all"
            >
              <option value="All">Filter by Status (All)</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Checked In">Checked In</option>
              <option value="Checked Out">Checked Out</option>
            </select>
          </div>

          {/* Filter Workspace Type */}
          <div>
            <select
              value={workspaceFilter}
              onChange={(e) => setWorkspaceFilter(e.target.value)}
              className="w-full px-3 py-2 bg-[#FFFDF9] border border-[#E5D5C5] rounded-xl text-xs text-[#3D2314] font-medium focus:outline-none focus:ring-2 focus:ring-[#8C4A21]/30 transition-all"
            >
              <option value="All">Workspace Type (All)</option>
              <option value="Desk">Desk</option>
              <option value="Workstation">Workstation</option>
              <option value="Private Cabin">Private Cabin</option>
              <option value="Meeting Room">Meeting Room</option>
              <option value="Study Space">Study Space</option>
              <option value="Café Table">Café Table</option>
            </select>
          </div>

          {/* Filter Date & Sort */}
          <div className="flex items-center gap-2">
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full px-3 py-2 bg-[#FFFDF9] border border-[#E5D5C5] rounded-xl text-xs text-[#3D2314] font-medium focus:outline-none focus:ring-2 focus:ring-[#8C4A21]/30 transition-all"
            >
              <option value="All">Filter by Date (All)</option>
              <option value="07 Aug 2026">Today (07 Aug 2026)</option>
            </select>

            <button
              type="button"
              onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
              className="p-2 bg-[#FFFDF9] border border-[#E5D5C5] rounded-xl text-[#8C4A21] hover:bg-[#F8F1EA] transition-all cursor-pointer shrink-0"
              title={`Sort Arrival Time (${sortOrder === "asc" ? "Ascending" : "Descending"})`}
            >
              <ArrowUpDown className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto rounded-[20px] border border-[#E5D5C5] shadow-xs max-h-[600px] overflow-y-auto">
        <table className="w-full text-left text-xs text-[#3D2314] border-collapse">
          <thead className="bg-[#F8F1EA] sticky top-0 z-10 uppercase text-[11px] font-extrabold tracking-wider text-[#7A5A43] border-b border-[#E5D5C5] shadow-2xs">
            <tr>
              <th className="py-4 px-4 font-bold">Booking ID</th>
              <th className="py-4 px-4 font-bold">User Name</th>
              <th className="py-4 px-4 font-bold">Desk ID</th>
              <th className="py-4 px-4 font-bold">Arrival Time</th>
              <th className="py-4 px-4 font-bold">Date</th>
              <th className="py-4 px-4 font-bold">Duration</th>
              <th className="py-4 px-4 font-bold">Workspace Type</th>
              <th className="py-4 px-4 font-bold">Booking Status</th>
              <th className="py-4 px-4 font-bold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E5D5C5]/60">
            {dashboardReservations.length > 0 ? (
              dashboardReservations.map((row, idx) => {
                const wsBadge = getWorkspaceBadge(row.workspaceType);
                const isOdd = idx % 2 !== 0;
                const isInactive = row.status === "Checked Out";

                return (
                  <tr
                    key={row.bookingId}
                    className={`${
                      isOdd ? "bg-[#FBF7F1]/60" : "bg-[#FFFDF9]"
                    } hover:bg-[#F3E9DD] transition-colors`}
                  >
                    {/* 1. Booking ID */}
                    <td className="py-4 px-4 font-bold font-mono text-sm text-[#8C4A21] whitespace-nowrap">
                      {row.bookingId}
                    </td>

                    {/* 2. User Name */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#3D2314] to-[#8C4A21] text-amber-200 flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs ring-2 ring-[#E5D5C5]/40">
                          {row.userName.charAt(0)}
                        </div>
                        <div>
                          <div className="font-bold text-sm text-[#3D2314]">
                            {row.userName}
                          </div>
                          <div className="text-[11px] text-[#7A5A43]">
                            {row.userEmail}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* 3. Desk ID */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <span className="font-extrabold font-mono text-xs text-[#8C4A21] bg-[#F8F1EA] px-3 py-1 rounded-full border border-[#E5D5C5] shadow-2xs">
                        {row.deskId}
                      </span>
                    </td>

                    {/* 4. Arrival Time */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-[#3D2314]">
                        <Clock className="w-3.5 h-3.5 text-[#8C4A21] shrink-0" />
                        <span>{row.arrivalTime}</span>
                      </div>
                    </td>

                    {/* 5. Date */}
                    <td className="py-4 px-4 text-xs font-medium text-[#7A5A43] whitespace-nowrap">
                      {row.date}
                    </td>

                    {/* 6. Duration */}
                    <td className="py-4 px-4 text-xs font-semibold text-[#3D2314] whitespace-nowrap">
                      {row.duration}
                    </td>

                    {/* 7. Workspace Type */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold border shadow-2xs ${wsBadge.style}`}
                      >
                        {wsBadge.label}
                      </span>
                    </td>

                    {/* 8. Booking Status */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-[11px] font-extrabold border uppercase tracking-wider shadow-2xs ${getStatusBadge(
                          row.status
                        )}`}
                      >
                        {row.status}
                      </span>
                    </td>

                    {/* 9. Actions */}
                    <td className="py-4 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        {/* Confirmed state actions */}
                        {row.status === "Confirmed" && (
                          <>
                            <button
                              type="button"
                              onClick={() => handleStatusChange(row.bookingId, "Checked In")}
                              className="px-3 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 active:scale-95 text-white font-bold text-xs shadow-xs transition-all cursor-pointer flex items-center gap-1"
                              title="Check In Guest"
                            >
                              <UserCheck className="w-3.5 h-3.5" />
                              Check In
                            </button>
                            <button
                              type="button"
                              onClick={() => handleCancelBooking(row.bookingId)}
                              className="px-2.5 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs border border-rose-200 transition-all cursor-pointer flex items-center gap-1"
                              title="Cancel Booking"
                            >
                              <XCircle className="w-3.5 h-3.5" />
                              Cancel
                            </button>
                          </>
                        )}

                        {/* Checked In state actions */}
                        {row.status === "Checked In" && (
                          <button
                            type="button"
                            onClick={() => handleStatusChange(row.bookingId, "Checked Out")}
                            className="px-3.5 py-1.5 rounded-xl bg-amber-700 hover:bg-amber-800 active:scale-95 text-white font-bold text-xs shadow-xs transition-all cursor-pointer flex items-center gap-1"
                            title="Check Out Guest"
                          >
                            <LogOut className="w-3.5 h-3.5" />
                            Check Out
                          </button>
                        )}

                        {/* Checked Out state badge */}
                        {row.status === "Checked Out" && (
                          <span className="px-3 py-1 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs border border-slate-200 inline-flex items-center gap-1 opacity-80">
                            <CheckCircle2 className="w-3.5 h-3.5 text-slate-600" />
                            Checked Out
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={9} className="py-12 text-center text-xs text-[#7A5A43]">
                  No bookings found matching your search and filter criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Responsive Card View */}
      <div className="block md:hidden space-y-4">
        {dashboardReservations.length > 0 ? (
          dashboardReservations.map((row) => {
            const wsBadge = getWorkspaceBadge(row.workspaceType);
            const isInactive = row.status === "Checked Out";

            return (
              <div
                key={row.bookingId}
                className="bg-[#FFFDF9] rounded-2xl border border-[#E5D5C5] p-4 shadow-xs space-y-3"
              >
                {/* Top Row: Booking ID, Desk ID, Status */}
                <div className="flex items-center justify-between gap-2 border-b border-[#E5D5C5]/50 pb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold font-mono text-sm text-[#8C4A21]">
                      {row.bookingId}
                    </span>
                    <span className="font-extrabold font-mono text-xs text-[#8C4A21] bg-[#F8F1EA] px-2.5 py-0.5 rounded-full border border-[#E5D5C5]">
                      {row.deskId}
                    </span>
                  </div>
                  <span
                    className={`inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border uppercase tracking-wider ${getStatusBadge(
                      row.status
                    )}`}
                  >
                    {row.status}
                  </span>
                </div>

                {/* User Info & Workspace */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#3D2314] to-[#8C4A21] text-amber-200 flex items-center justify-center font-bold text-sm shrink-0 shadow-2xs">
                      {row.userName.charAt(0)}
                    </div>
                    <div>
                      <div className="font-bold text-sm text-[#3D2314]">
                        {row.userName}
                      </div>
                      <div className="text-xs text-[#7A5A43]">
                        {row.userEmail}
                      </div>
                    </div>
                  </div>
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-extrabold border shrink-0 ${wsBadge.style}`}
                  >
                    {wsBadge.label}
                  </span>
                </div>

                {/* Arrival Time, Date, Duration Grid */}
                <div className="grid grid-cols-3 gap-2 bg-[#F8F1EA]/60 p-2.5 rounded-xl text-center border border-[#E5D5C5]/40 text-xs">
                  <div>
                    <div className="text-[10px] text-[#7A5A43] font-semibold">Arrival</div>
                    <div className="font-bold text-[#3D2314] mt-0.5">{row.arrivalTime}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-[#7A5A43] font-semibold">Date</div>
                    <div className="font-bold text-[#3D2314] mt-0.5">{row.date}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-[#7A5A43] font-semibold">Duration</div>
                    <div className="font-bold text-[#3D2314] mt-0.5">{row.duration}</div>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-1 flex items-center justify-end gap-2">
                  {row.status === "Confirmed" && (
                    <>
                      <button
                        type="button"
                        onClick={() => handleStatusChange(row.bookingId, "Checked In")}
                        className="flex-1 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-1"
                      >
                        <UserCheck className="w-3.5 h-3.5" />
                        Check In
                      </button>
                      <button
                        type="button"
                        onClick={() => handleCancelBooking(row.bookingId)}
                        className="py-2 px-3 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs border border-rose-200 transition-all flex items-center justify-center gap-1"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        Cancel
                      </button>
                    </>
                  )}

                  {row.status === "Checked In" && (
                    <button
                      type="button"
                      onClick={() => handleStatusChange(row.bookingId, "Checked Out")}
                      className="w-full py-2 rounded-xl bg-amber-700 hover:bg-amber-800 text-white font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-1"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      Check Out
                    </button>
                  )}

                  {row.status === "Checked Out" && (
                    <span className="w-full py-2 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs border border-slate-200 flex items-center justify-center gap-1 opacity-80">
                      <CheckCircle2 className="w-3.5 h-3.5 text-slate-600" />
                      Checked Out
                    </span>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="py-8 text-center text-xs text-[#7A5A43] bg-[#F8F1EA]/50 rounded-xl">
            No bookings found matching your search and filter criteria.
          </div>
        )}
      </div>

      {/* Centered View All Reservations Button */}
      <div className="flex justify-center pt-2">
        <Link
          href="/admin/reservations"
          className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full bg-[#3D2314] hover:bg-[#8C4A21] text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
        >
          <span>View All Reservations</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </motion.div>
  );
}
