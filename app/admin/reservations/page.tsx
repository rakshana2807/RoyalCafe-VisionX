"use client";

import React, { useState, useMemo } from "react";
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
  Headphones,
  Eye,
  Printer,
  ChevronLeft,
  ChevronRight,
  X,
  Plus
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export type WorkspaceType =
  | "Café Table"
  | "Workstation"
  | "Hot Desk"
  | "Private Cabin"
  | "Meeting Room"
  | "Study Space"
  | "Quiet Zone";

export type BookingStatus =
  | "Confirmed"
  | "Checked In"
  | "Checked Out";

export interface ReservationRow {
  bookingId: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  deskId: string;
  arrivalTime: string;
  date: string;
  duration: string;
  workspaceType: WorkspaceType;
  status: BookingStatus;
  amount: string;
  paymentStatus: "Paid" | "Pending" | "Refunded";
}

// 52 Realistic Demo Bookings (Final state is "Checked Out")
const DEMO_RESERVATIONS: ReservationRow[] = [
  { bookingId: "BK-1001", userName: "Rahul Sharma", userEmail: "rahul@gmail.com", userPhone: "+91 98765 43210", deskId: "W-08", arrivalTime: "09:30 AM", date: "07 Aug 2026", duration: "4 Hours", workspaceType: "Workstation", status: "Checked In", amount: "₹499", paymentStatus: "Paid" },
  { bookingId: "BK-1002", userName: "Sarah Jenkins", userEmail: "sarah.j@gmail.com", userPhone: "+91 98123 45678", deskId: "C-02", arrivalTime: "10:00 AM", date: "07 Aug 2026", duration: "2 Hours", workspaceType: "Café Table", status: "Confirmed", amount: "₹350", paymentStatus: "Paid" },
  { bookingId: "BK-1003", userName: "Anita Desai", userEmail: "anita.desai@company.com", userPhone: "+91 97654 32109", deskId: "M-05", arrivalTime: "11:00 AM", date: "07 Aug 2026", duration: "Half Day", workspaceType: "Meeting Room", status: "Checked In", amount: "₹1,250", paymentStatus: "Paid" },
  { bookingId: "BK-1004", userName: "Vikram Patel", userEmail: "vikram.p@yahoo.com", userPhone: "+91 96543 21098", deskId: "P-03", arrivalTime: "11:30 AM", date: "07 Aug 2026", duration: "Full Day", workspaceType: "Private Cabin", status: "Confirmed", amount: "₹1,800", paymentStatus: "Paid" },
  { bookingId: "BK-1005", userName: "Elena Rostova", userEmail: "elena.r@design.io", userPhone: "+91 95432 10987", deskId: "S-04", arrivalTime: "08:30 AM", date: "07 Aug 2026", duration: "2 Hours", workspaceType: "Study Space", status: "Checked Out", amount: "₹300", paymentStatus: "Paid" },
  { bookingId: "BK-1006", userName: "Michael Chang", userEmail: "m.chang@tech.com", userPhone: "+91 94321 09876", deskId: "D-01", arrivalTime: "01:00 PM", date: "07 Aug 2026", duration: "1 Hour", workspaceType: "Hot Desk", status: "Checked Out", amount: "₹200", paymentStatus: "Paid" },
  { bookingId: "BK-1007", userName: "Priya Nair", userEmail: "priya.nair@startup.in", userPhone: "+91 93210 98765", deskId: "W-04", arrivalTime: "02:00 PM", date: "07 Aug 2026", duration: "4 Hours", workspaceType: "Workstation", status: "Confirmed", amount: "₹499", paymentStatus: "Paid" },
  { bookingId: "BK-1008", userName: "David Miller", userEmail: "david.m@finance.com", userPhone: "+91 92109 87654", deskId: "P-01", arrivalTime: "02:30 PM", date: "07 Aug 2026", duration: "Half Day", workspaceType: "Private Cabin", status: "Checked In", amount: "₹1,100", paymentStatus: "Paid" },
  { bookingId: "BK-1009", userName: "Aarav Gupta", userEmail: "aarav.g@gmail.com", userPhone: "+91 91098 76543", deskId: "C-08", arrivalTime: "03:00 PM", date: "07 Aug 2026", duration: "2 Hours", workspaceType: "Café Table", status: "Confirmed", amount: "₹350", paymentStatus: "Paid" },
  { bookingId: "BK-1010", userName: "Sophia Al-Mansoor", userEmail: "sophia.a@consulting.org", userPhone: "+91 90987 65432", deskId: "M-02", arrivalTime: "03:30 PM", date: "07 Aug 2026", duration: "2 Hours", workspaceType: "Meeting Room", status: "Confirmed", amount: "₹950", paymentStatus: "Paid" },
  { bookingId: "BK-1011", userName: "Rohan Kapoor", userEmail: "rohan.k@workspace.io", userPhone: "+91 89876 54321", deskId: "Q-02", arrivalTime: "08:00 AM", date: "07 Aug 2026", duration: "3 Hours", workspaceType: "Quiet Zone", status: "Checked Out", amount: "₹450", paymentStatus: "Paid" },
  { bookingId: "BK-1012", userName: "Emily Watson", userEmail: "emily.w@creative.co", userPhone: "+91 88765 43210", deskId: "D-05", arrivalTime: "04:30 PM", date: "07 Aug 2026", duration: "1 Hour", workspaceType: "Hot Desk", status: "Confirmed", amount: "₹200", paymentStatus: "Paid" },
  { bookingId: "BK-1013", userName: "Arjun Verma", userEmail: "arjun.v@devs.net", userPhone: "+91 87654 32109", deskId: "W-12", arrivalTime: "09:00 AM", date: "06 Aug 2026", duration: "Full Day", workspaceType: "Workstation", status: "Checked Out", amount: "₹799", paymentStatus: "Paid" },
  { bookingId: "BK-1014", userName: "Jessica Taylor", userEmail: "jess.taylor@global.com", userPhone: "+91 86543 21098", deskId: "P-04", arrivalTime: "10:30 AM", date: "06 Aug 2026", duration: "Half Day", workspaceType: "Private Cabin", status: "Checked Out", amount: "₹1,200", paymentStatus: "Paid" },
  { bookingId: "BK-1015", userName: "Karan Mehta", userEmail: "karan.m@ventures.in", userPhone: "+91 85432 10987", deskId: "M-01", arrivalTime: "11:30 AM", date: "06 Aug 2026", duration: "2 Hours", workspaceType: "Meeting Room", status: "Checked Out", amount: "₹950", paymentStatus: "Paid" },
  { bookingId: "BK-1016", userName: "Chloe Bennett", userEmail: "chloe.b@designstudio.com", userPhone: "+91 84321 09876", deskId: "Q-04", arrivalTime: "01:30 PM", date: "06 Aug 2026", duration: "4 Hours", workspaceType: "Quiet Zone", status: "Checked Out", amount: "₹550", paymentStatus: "Paid" },
  { bookingId: "BK-1017", userName: "Siddharth Rao", userEmail: "siddharth.r@ai.org", userPhone: "+91 83210 98765", deskId: "S-01", arrivalTime: "02:00 PM", date: "06 Aug 2026", duration: "2 Hours", workspaceType: "Study Space", status: "Checked Out", amount: "₹300", paymentStatus: "Paid" },
  { bookingId: "BK-1018", userName: "Meera Fernandez", userEmail: "meera.f@consultancy.co", userPhone: "+91 82109 87654", deskId: "C-05", arrivalTime: "03:30 PM", date: "06 Aug 2026", duration: "1 Hour", workspaceType: "Café Table", status: "Checked Out", amount: "₹250", paymentStatus: "Paid" },
  { bookingId: "BK-1019", userName: "Alexei Volkov", userEmail: "alexei.v@traders.com", userPhone: "+91 81098 76543", deskId: "D-03", arrivalTime: "04:00 PM", date: "06 Aug 2026", duration: "2 Hours", workspaceType: "Hot Desk", status: "Checked Out", amount: "₹350", paymentStatus: "Paid" },
  { bookingId: "BK-1020", userName: "Tanya Sen", userEmail: "tanya.sen@media.in", userPhone: "+91 80987 65432", deskId: "W-02", arrivalTime: "05:00 PM", date: "06 Aug 2026", duration: "2 Hours", workspaceType: "Workstation", status: "Checked Out", amount: "₹399", paymentStatus: "Paid" },
  { bookingId: "BK-1021", userName: "Daniel Kim", userEmail: "daniel.k@seoul.kr", userPhone: "+91 79876 54321", deskId: "P-02", arrivalTime: "09:00 AM", date: "05 Aug 2026", duration: "Full Day", workspaceType: "Private Cabin", status: "Checked Out", amount: "₹1,800", paymentStatus: "Paid" },
  { bookingId: "BK-1022", userName: "Ananya Roy", userEmail: "ananya.r@writers.org", userPhone: "+91 78765 43210", deskId: "Q-01", arrivalTime: "10:00 AM", date: "05 Aug 2026", duration: "Half Day", workspaceType: "Quiet Zone", status: "Checked Out", amount: "₹600", paymentStatus: "Paid" },
  { bookingId: "BK-1023", userName: "Gautam Singhania", userEmail: "gautam.s@equity.in", userPhone: "+91 77654 32109", deskId: "M-04", arrivalTime: "11:00 AM", date: "05 Aug 2026", duration: "3 Hours", workspaceType: "Meeting Room", status: "Checked Out", amount: "₹1,400", paymentStatus: "Paid" },
  { bookingId: "BK-1024", userName: "Nisha Agarwal", userEmail: "nisha.a@legal.co", userPhone: "+91 76543 21098", deskId: "S-03", arrivalTime: "01:00 PM", date: "05 Aug 2026", duration: "2 Hours", workspaceType: "Study Space", status: "Checked Out", amount: "₹300", paymentStatus: "Paid" },
  { bookingId: "BK-1025", userName: "Lucas Silva", userEmail: "lucas.s@rio.br", userPhone: "+91 75432 10987", deskId: "C-01", arrivalTime: "02:30 PM", date: "05 Aug 2026", duration: "2 Hours", workspaceType: "Café Table", status: "Checked Out", amount: "₹350", paymentStatus: "Paid" },
  { bookingId: "BK-1026", userName: "Ritu Chawla", userEmail: "ritu.c@edu.in", userPhone: "+91 74321 09876", deskId: "W-09", arrivalTime: "03:30 PM", date: "05 Aug 2026", duration: "4 Hours", workspaceType: "Workstation", status: "Checked Out", amount: "₹499", paymentStatus: "Paid" },
  { bookingId: "BK-1027", userName: "Oliver Brown", userEmail: "oliver.b@uktech.co.uk", userPhone: "+91 73210 98765", deskId: "D-06", arrivalTime: "04:30 PM", date: "05 Aug 2026", duration: "2 Hours", workspaceType: "Hot Desk", status: "Checked Out", amount: "₹350", paymentStatus: "Paid" },
  { bookingId: "BK-1028", userName: "Kavita Reddy", userEmail: "kavita.r@health.org", userPhone: "+91 72109 87654", deskId: "P-05", arrivalTime: "09:30 AM", date: "04 Aug 2026", duration: "Full Day", workspaceType: "Private Cabin", status: "Checked Out", amount: "₹1,800", paymentStatus: "Paid" },
  { bookingId: "BK-1029", userName: "Zainab Khan", userEmail: "zainab.k@dubai.ae", userPhone: "+91 71098 76543", deskId: "M-03", arrivalTime: "11:00 AM", date: "04 Aug 2026", duration: "2 Hours", workspaceType: "Meeting Room", status: "Checked Out", amount: "₹950", paymentStatus: "Paid" },
  { bookingId: "BK-1030", userName: "Manish Joshi", userEmail: "manish.j@analytics.io", userPhone: "+91 70987 65432", deskId: "Q-03", arrivalTime: "01:00 PM", date: "04 Aug 2026", duration: "3 Hours", workspaceType: "Quiet Zone", status: "Checked Out", amount: "₹450", paymentStatus: "Paid" },
  { bookingId: "BK-1031", userName: "Hannah Abbott", userEmail: "hannah.a@oxford.ac.uk", userPhone: "+91 69876 54321", deskId: "S-05", arrivalTime: "02:00 PM", date: "04 Aug 2026", duration: "4 Hours", workspaceType: "Study Space", status: "Checked Out", amount: "₹500", paymentStatus: "Paid" },
  { bookingId: "BK-1032", userName: "Varun Bajaj", userEmail: "varun.b@auto.in", userPhone: "+91 68765 43210", deskId: "C-04", arrivalTime: "03:00 PM", date: "04 Aug 2026", duration: "1 Hour", workspaceType: "Café Table", status: "Checked Out", amount: "₹200", paymentStatus: "Paid" },
  { bookingId: "BK-1033", userName: "Grace Hopper", userEmail: "grace.h@computing.org", userPhone: "+91 67654 32109", deskId: "W-05", arrivalTime: "04:00 PM", date: "04 Aug 2026", duration: "2 Hours", workspaceType: "Workstation", status: "Checked Out", amount: "₹399", paymentStatus: "Paid" },
  { bookingId: "BK-1034", userName: "Sameer Nanda", userEmail: "sameer.n@logistics.com", userPhone: "+91 66543 21098", deskId: "D-02", arrivalTime: "10:00 AM", date: "03 Aug 2026", duration: "Full Day", workspaceType: "Hot Desk", status: "Checked Out", amount: "₹650", paymentStatus: "Paid" },
  { bookingId: "BK-1035", userName: "Fatima Syed", userEmail: "fatima.s@biotech.org", userPhone: "+91 65432 10987", deskId: "P-06", arrivalTime: "11:30 AM", date: "03 Aug 2026", duration: "Half Day", workspaceType: "Private Cabin", status: "Checked Out", amount: "₹1,100", paymentStatus: "Paid" },
  { bookingId: "BK-1036", userName: "Yash Bardhan", userEmail: "yash.b@gaming.in", userPhone: "+91 64321 09876", deskId: "Q-05", arrivalTime: "02:00 PM", date: "03 Aug 2026", duration: "4 Hours", workspaceType: "Quiet Zone", status: "Checked Out", amount: "₹550", paymentStatus: "Paid" },
  { bookingId: "BK-1037", userName: "Isobel Crawford", userEmail: "isobel.c@edinburgh.uk", userPhone: "+91 63210 98765", deskId: "M-06", arrivalTime: "03:00 PM", date: "03 Aug 2026", duration: "2 Hours", workspaceType: "Meeting Room", status: "Checked Out", amount: "₹950", paymentStatus: "Paid" },
  { bookingId: "BK-1038", userName: "Deepak Soni", userEmail: "deepak.s@jewels.in", userPhone: "+91 62109 87654", deskId: "C-06", arrivalTime: "04:30 PM", date: "03 Aug 2026", duration: "2 Hours", workspaceType: "Café Table", status: "Checked Out", amount: "₹350", paymentStatus: "Paid" },
  { bookingId: "BK-1039", userName: "Clara Schumann", userEmail: "clara.s@music.de", userPhone: "+91 61098 76543", deskId: "S-06", arrivalTime: "09:00 AM", date: "02 Aug 2026", duration: "3 Hours", workspaceType: "Study Space", status: "Checked Out", amount: "₹400", paymentStatus: "Paid" },
  { bookingId: "BK-1040", userName: "Pranav Pillai", userEmail: "pranav.p@kerala.in", userPhone: "+91 60987 65432", deskId: "W-10", arrivalTime: "10:30 AM", date: "02 Aug 2026", duration: "Half Day", workspaceType: "Workstation", status: "Checked Out", amount: "₹599", paymentStatus: "Paid" },
  { bookingId: "BK-1041", userName: "Nathalie Dubois", userEmail: "nathalie.d@paris.fr", userPhone: "+91 59876 54321", deskId: "P-07", arrivalTime: "12:00 PM", date: "02 Aug 2026", duration: "Full Day", workspaceType: "Private Cabin", status: "Checked Out", amount: "₹1,800", paymentStatus: "Paid" },
  { bookingId: "BK-1042", userName: "Aditya Hegde", userEmail: "aditya.h@mysore.in", userPhone: "+91 58765 43210", deskId: "D-04", arrivalTime: "02:00 PM", date: "02 Aug 2026", duration: "2 Hours", workspaceType: "Hot Desk", status: "Checked Out", amount: "₹350", paymentStatus: "Paid" },
  { bookingId: "BK-1043", userName: "Zara Thorne", userEmail: "zara.t@fashion.co", userPhone: "+91 57654 32109", deskId: "C-03", arrivalTime: "03:30 PM", date: "02 Aug 2026", duration: "1 Hour", workspaceType: "Café Table", status: "Checked Out", amount: "₹200", paymentStatus: "Paid" },
  { bookingId: "BK-1044", userName: "Harish Saxena", userEmail: "harish.s@infra.com", userPhone: "+91 56543 21098", deskId: "M-07", arrivalTime: "04:30 PM", date: "02 Aug 2026", duration: "2 Hours", workspaceType: "Meeting Room", status: "Checked Out", amount: "₹950", paymentStatus: "Paid" },
  { bookingId: "BK-1045", userName: "Sophia Loren", userEmail: "sophia.l@roma.it", userPhone: "+91 55432 10987", deskId: "Q-06", arrivalTime: "09:30 AM", date: "01 Aug 2026", duration: "4 Hours", workspaceType: "Quiet Zone", status: "Checked Out", amount: "₹550", paymentStatus: "Paid" },
  { bookingId: "BK-1046", userName: "Bhavesh Jain", userEmail: "bhavesh.j@solar.in", userPhone: "+91 54321 09876", deskId: "W-11", arrivalTime: "11:00 AM", date: "01 Aug 2026", duration: "Full Day", workspaceType: "Workstation", status: "Checked Out", amount: "₹799", paymentStatus: "Paid" },
  { bookingId: "BK-1047", userName: "Emma Stone", userEmail: "emma.s@hollywood.com", userPhone: "+91 53210 98765", deskId: "P-08", arrivalTime: "01:00 PM", date: "01 Aug 2026", duration: "Half Day", workspaceType: "Private Cabin", status: "Checked Out", amount: "₹1,200", paymentStatus: "Paid" },
  { bookingId: "BK-1048", userName: "Rishabh Tripathi", userEmail: "rishabh.t@varanasi.in", userPhone: "+91 52109 87654", deskId: "S-07", arrivalTime: "02:30 PM", date: "01 Aug 2026", duration: "2 Hours", workspaceType: "Study Space", status: "Checked Out", amount: "₹300", paymentStatus: "Paid" },
  { bookingId: "BK-1049", userName: "Laura Palmer", userEmail: "laura.p@twinpeaks.org", userPhone: "+91 51098 76543", deskId: "C-07", arrivalTime: "04:00 PM", date: "01 Aug 2026", duration: "2 Hours", workspaceType: "Café Table", status: "Checked Out", amount: "₹350", paymentStatus: "Paid" },
  { bookingId: "BK-1050", userName: "Kartik Aryan", userEmail: "kartik.a@cinema.in", userPhone: "+91 50987 65432", deskId: "D-07", arrivalTime: "05:00 PM", date: "01 Aug 2026", duration: "1 Hour", workspaceType: "Hot Desk", status: "Checked Out", amount: "₹200", paymentStatus: "Paid" },
  { bookingId: "BK-1051", userName: "Mia Wallace", userEmail: "mia.w@pulp.com", userPhone: "+91 49876 54321", deskId: "Q-07", arrivalTime: "10:00 AM", date: "31 Jul 2026", duration: "3 Hours", workspaceType: "Quiet Zone", status: "Checked Out", amount: "₹450", paymentStatus: "Paid" },
  { bookingId: "BK-1052", userName: "Dev Patel", userEmail: "dev.p@actor.co.uk", userPhone: "+91 48765 43210", deskId: "W-07", arrivalTime: "02:00 PM", date: "31 Jul 2026", duration: "4 Hours", workspaceType: "Workstation", status: "Checked Out", amount: "₹499", paymentStatus: "Paid" }
];

export default function AdminReservationsPage() {
  const [reservations, setReservations] = useState<ReservationRow[]>(DEMO_RESERVATIONS);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [workspaceFilter, setWorkspaceFilter] = useState<string>("All");
  const [dateFilter, setDateFilter] = useState<string>("All");
  const [sortBy, setSortBy] = useState<string>("priority");

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  // Modals State
  const [selectedBooking, setSelectedBooking] = useState<ReservationRow | null>(null);
  const [receiptBooking, setReceiptBooking] = useState<ReservationRow | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleStatusChange = (bookingId: string, newStatus: BookingStatus) => {
    setReservations((prev) =>
      prev.map((r) => (r.bookingId === bookingId ? { ...r, status: newStatus } : r))
    );
    showToast(`Booking ${bookingId} updated to ${newStatus}`);
  };

  const handleCancelBooking = (bookingId: string) => {
    setReservations((prev) => prev.filter((r) => r.bookingId !== bookingId));
    showToast(`Booking ${bookingId} cancelled`);
  };

  // Priority Rank mapping: Confirmed (1) > Checked In (2) > Checked Out (3)
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
    const ampm = match[3].toUpperCase();
    if (ampm === "PM" && hours < 12) hours += 12;
    if (ampm === "AM" && hours === 12) hours = 0;
    return hours * 60 + minutes;
  };

  const parseTimestamp = (dateStr: string): number => {
    return new Date(dateStr).getTime() || 0;
  };

  const filteredReservations = useMemo(() => {
    let result = reservations.filter((r) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        r.bookingId.toLowerCase().includes(q) ||
        r.userName.toLowerCase().includes(q) ||
        r.userEmail.toLowerCase().includes(q) ||
        r.deskId.toLowerCase().includes(q);

      const matchesStatus = statusFilter === "All" || r.status === statusFilter;
      const matchesWorkspace = workspaceFilter === "All" || r.workspaceType === workspaceFilter;

      return matchesSearch && matchesStatus && matchesWorkspace;
    });

    if (sortBy === "priority") {
      result.sort((a, b) => {
        const rankA = STATUS_RANK[a.status] || 99;
        const rankB = STATUS_RANK[b.status] || 99;
        if (rankA !== rankB) return rankA - rankB;

        const dateA = parseTimestamp(a.date);
        const dateB = parseTimestamp(b.date);
        if (dateA !== dateB) return dateB - dateA;

        const timeA = parseTimeMinutes(a.arrivalTime);
        const timeB = parseTimeMinutes(b.arrivalTime);
        if (timeA !== timeB) return timeB - timeA;

        return b.bookingId.localeCompare(a.bookingId);
      });
    } else if (sortBy === "latest") {
      result.sort((a, b) => {
        const dateA = parseTimestamp(a.date);
        const dateB = parseTimestamp(b.date);
        if (dateA !== dateB) return dateB - dateA;
        return parseTimeMinutes(b.arrivalTime) - parseTimeMinutes(a.arrivalTime);
      });
    } else if (sortBy === "oldest") {
      result.sort((a, b) => {
        const dateA = parseTimestamp(a.date);
        const dateB = parseTimestamp(b.date);
        if (dateA !== dateB) return dateA - dateB;
        return parseTimeMinutes(a.arrivalTime) - parseTimeMinutes(b.arrivalTime);
      });
    } else if (sortBy === "arrivalTime") {
      result.sort((a, b) => parseTimeMinutes(a.arrivalTime) - parseTimeMinutes(b.arrivalTime));
    } else if (sortBy === "bookingId") {
      result.sort((a, b) => b.bookingId.localeCompare(a.bookingId));
    } else if (sortBy === "userName") {
      result.sort((a, b) => a.userName.localeCompare(b.userName));
    } else if (sortBy === "workspaceType") {
      result.sort((a, b) => a.workspaceType.localeCompare(b.workspaceType));
    } else if (sortBy === "status") {
      result.sort((a, b) => a.status.localeCompare(b.status));
    }

    return result;
  }, [reservations, searchQuery, statusFilter, workspaceFilter, dateFilter, sortBy]);

  // Reset pagination when filter/search changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter, workspaceFilter, dateFilter, sortBy]);

  // Pagination Slice
  const totalPages = Math.ceil(filteredReservations.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedReservations = filteredReservations.slice(startIndex, startIndex + itemsPerPage);

  const getWorkspaceBadge = (type: WorkspaceType) => {
    switch (type) {
      case "Café Table":
        return {
          style: "bg-orange-500/15 text-orange-900 border-orange-500/30",
          icon: <Coffee className="w-3.5 h-3.5 text-orange-700" />,
          label: "☕ Café Table",
        };
      case "Workstation":
        return {
          style: "bg-indigo-500/15 text-indigo-900 border-indigo-500/30",
          icon: <Briefcase className="w-3.5 h-3.5 text-indigo-700" />,
          label: "💼 Workstation",
        };
      case "Hot Desk":
        return {
          style: "bg-amber-500/15 text-amber-900 border-amber-500/30",
          icon: <Armchair className="w-3.5 h-3.5 text-amber-700" />,
          label: "🪑 Hot Desk",
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
      case "Quiet Zone":
        return {
          style: "bg-cyan-500/15 text-cyan-900 border-cyan-500/30",
          icon: <Headphones className="w-3.5 h-3.5 text-cyan-700" />,
          label: "🎧 Quiet Zone",
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
            <CheckCircle2 className="h-5 w-5 text-emerald-400" />
            <span className="text-xs font-bold font-sans">{toast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Page Title & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <Calendar className="w-7 h-7 text-[#8C4A21]" />
            <h1 className="text-2xl sm:text-3xl font-black font-serif text-[#3D2314] tracking-tight">
              Reservations Management
            </h1>
          </div>
          <p className="text-xs text-[#7A5A43] mt-1">
            View, filter, sort, and manage all café and workspace desk bookings across your facility.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          <span className="text-xs font-mono font-bold text-[#8C4A21] bg-[#F8F1EA] px-4 py-2 rounded-full border border-[#E5D5C5] shadow-xs">
            Total: {reservations.length} Bookings
          </span>
        </div>
      </div>

      {/* Search & Multi-Filters Bar */}
      <div className="bg-[#FFFDF9] p-5 rounded-[20px] border border-[#E5D5C5] shadow-sm space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Search Bar */}
          <div className="relative lg:col-span-2">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#7A5A43]" />
            <input
              type="text"
              placeholder="Search by Booking ID, Customer Name, Email, Desk..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-3 py-2.5 bg-[#FAF4ED] border border-[#DFCDBE] rounded-xl text-xs text-[#3D2314] focus:outline-none focus:ring-2 focus:ring-[#8C4A21]/30 placeholder-[#7A5A43]/60 transition-all font-medium"
            />
          </div>

          {/* Filter by Status */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2.5 bg-[#FAF4ED] border border-[#DFCDBE] rounded-xl text-xs text-[#3D2314] font-medium focus:outline-none focus:ring-2 focus:ring-[#8C4A21]/30 transition-all cursor-pointer"
            >
              <option value="All">Filter by Status (All)</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Checked In">Checked In</option>
              <option value="Checked Out">Checked Out</option>
            </select>
          </div>

          {/* Filter by Workspace */}
          <div>
            <select
              value={workspaceFilter}
              onChange={(e) => setWorkspaceFilter(e.target.value)}
              className="w-full px-3 py-2.5 bg-[#FAF4ED] border border-[#DFCDBE] rounded-xl text-xs text-[#3D2314] font-medium focus:outline-none focus:ring-2 focus:ring-[#8C4A21]/30 transition-all cursor-pointer"
            >
              <option value="All">Workspace Type (All)</option>
              <option value="Café Table">Café Table</option>
              <option value="Workstation">Workstation</option>
              <option value="Hot Desk">Hot Desk</option>
              <option value="Private Cabin">Private Cabin</option>
              <option value="Meeting Room">Meeting Room</option>
              <option value="Study Space">Study Space</option>
              <option value="Quiet Zone">Quiet Zone</option>
            </select>
          </div>

          {/* Sort By Dropdown */}
          <div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3 py-2.5 bg-[#FAF4ED] border border-[#DFCDBE] rounded-xl text-xs text-[#3D2314] font-medium focus:outline-none focus:ring-2 focus:ring-[#8C4A21]/30 transition-all cursor-pointer"
            >
              <option value="priority">Priority First (Action Required)</option>
              <option value="latest">Latest Booking Date</option>
              <option value="oldest">Oldest Booking Date</option>
              <option value="arrivalTime">Arrival Time</option>
              <option value="bookingId">Booking ID</option>
              <option value="userName">User Name (A-Z)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-[#FFFDF9] rounded-[20px] border border-[#E5D5C5] shadow-sm overflow-hidden space-y-4">
        {/* Desktop View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-xs text-[#3D2314] border-collapse">
            <thead className="bg-[#F8F1EA] uppercase text-[11px] font-extrabold tracking-wider text-[#7A5A43] border-b border-[#E5D5C5]">
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
              {paginatedReservations.length > 0 ? (
                paginatedReservations.map((row, idx) => {
                  const isOdd = idx % 2 !== 0;
                  const wsBadge = getWorkspaceBadge(row.workspaceType);

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
                            <div className="font-bold text-sm text-[#3D2314]">{row.userName}</div>
                            <div className="text-[11px] text-[#7A5A43]">{row.userEmail}</div>
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
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Confirmed Check In */}
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
                                className="p-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs border border-rose-200 transition-all cursor-pointer flex items-center justify-center"
                                title="Cancel Reservation"
                              >
                                <XCircle className="w-4 h-4" />
                              </button>
                            </>
                          )}

                          {/* Checked In Check Out */}
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

                          {/* Checked Out Disabled Badge */}
                          {row.status === "Checked Out" && (
                            <span className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs border border-slate-200 inline-flex items-center gap-1 opacity-80">
                              <CheckCircle2 className="w-3.5 h-3.5 text-slate-600" />
                              Checked Out
                            </span>
                          )}

                          {/* View Details Trigger */}
                          <button
                            type="button"
                            onClick={() => setSelectedBooking(row)}
                            className="p-1.5 rounded-xl bg-[#F8F1EA] hover:bg-[#3D2314] hover:text-white text-[#3D2314] transition-all cursor-pointer flex items-center justify-center border border-[#E5D5C5]"
                            title="View Booking Details"
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
                  <td colSpan={9} className="py-12 text-center text-xs text-[#7A5A43]">
                    No bookings found matching your search and filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="p-4 bg-[#F8F1EA]/60 border-t border-[#E5D5C5] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="text-[#7A5A43] font-medium">
            Showing <span className="font-bold text-[#3D2314]">{paginatedReservations.length > 0 ? startIndex + 1 : 0}</span> to{" "}
            <span className="font-bold text-[#3D2314]">{Math.min(startIndex + itemsPerPage, filteredReservations.length)}</span> of{" "}
            <span className="font-bold text-[#3D2314]">{filteredReservations.length}</span> total entries
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-xl bg-[#FFFDF9] border border-[#E5D5C5] text-[#3D2314] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#3D2314] hover:text-white transition-all cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-3 py-1 font-bold font-mono text-[#8C4A21]">
              Page {currentPage} of {totalPages}
            </span>
            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-xl bg-[#FFFDF9] border border-[#E5D5C5] text-[#3D2314] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#3D2314] hover:text-white transition-all cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Details Drawer / Modal */}
      <AnimatePresence>
        {selectedBooking && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedBooking(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-xs"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-lg bg-[#FFFDF9] rounded-3xl border border-[#E5D5C5] shadow-2xl overflow-hidden text-xs z-10"
            >
              <div className="p-6 bg-[#F8F1EA] border-b border-[#E5D5C5] flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold font-serif text-[#3D2314]">
                    Booking Details — {selectedBooking.bookingId}
                  </h3>
                  <span className="text-xs text-[#7A5A43]">
                    RoyalCafe Connect Desk Reservation System
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedBooking(null)}
                  className="p-2 rounded-xl bg-[#FFFDF9] text-[#3D2314] hover:bg-[#3D2314] hover:text-white border border-[#E5D5C5] transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div className="bg-[#FAF4ED] p-4 rounded-2xl border border-[#DFCDBE] space-y-2">
                  <div className="flex justify-between">
                    <span className="text-[#7A5A43] font-bold">User Name:</span>
                    <span className="font-bold text-[#3D2314]">{selectedBooking.userName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#7A5A43] font-bold">User Email:</span>
                    <span>{selectedBooking.userEmail}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#7A5A43] font-bold">User Phone:</span>
                    <span>{selectedBooking.userPhone}</span>
                  </div>
                </div>

                <div className="bg-[#FAF4ED] p-4 rounded-2xl border border-[#DFCDBE] space-y-2">
                  <div className="flex justify-between">
                    <span className="text-[#7A5A43] font-bold">Desk / Workspace ID:</span>
                    <span className="font-extrabold font-mono text-[#8C4A21]">{selectedBooking.deskId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#7A5A43] font-bold">Workspace Type:</span>
                    <span>{selectedBooking.workspaceType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#7A5A43] font-bold">Arrival Time:</span>
                    <span>{selectedBooking.arrivalTime} ({selectedBooking.date})</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#7A5A43] font-bold">Duration:</span>
                    <span>{selectedBooking.duration}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#7A5A43] font-bold">Booking Status:</span>
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${getStatusBadge(
                        selectedBooking.status
                      )}`}
                    >
                      {selectedBooking.status}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-[#F8F1EA] border-t border-[#E5D5C5] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedBooking(null)}
                  className="px-5 py-2.5 rounded-2xl bg-[#FFFDF9] text-[#3D2314] font-bold border border-[#E5D5C5] hover:bg-[#3D2314] hover:text-white transition-all cursor-pointer"
                >
                  Close Window
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
