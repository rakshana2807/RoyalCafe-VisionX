"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Coffee,
  Users,
  Calendar,
  ShoppingBag,
  DollarSign,
  Utensils,
  Plus,
  Trash2,
  Edit,
  CheckCircle2,
  XCircle,
  Armchair,
  RefreshCw,
  LogOut,
  LayoutDashboard,
} from "lucide-react";
import Navbar from "@/components/Navbar";

interface AdminStats {
  totalCustomers: number;
  totalBookings: number;
  totalOrders: number;
  bookingRevenue: number;
  orderRevenue: number;
  totalRevenue: number;
  occupancyRate: number;
  totalSeats: number;
  occupiedSeats: number;
}

interface Booking {
  _id: string;
  bookingId: string;
  fullName: string;
  mobile: string;
  email?: string;
  seatType: string;
  seatNumber?: string;
  date: string;
  arrivalTime: string;
  amount: number;
  status: "pending" | "confirmed" | "cancelled" | "rejected";
}

interface MenuItem {
  _id: string;
  category: string;
  itemName: string;
  description: string;
  image: string;
  price: number;
  available: boolean;
  isBestSeller?: boolean;
}

interface Seat {
  _id: string;
  seatNumber: string;
  seatType: string;
  zone: string;
  status: "available" | "reserved" | "occupied";
}

interface Customer {
  _id: string;
  name: string;
  email: string;
  phone: string;
  createdAt: string;
}

interface Order {
  _id: string;
  orderId: string;
  customerName: string;
  totalAmount: number;
  paymentStatus: string;
  status: string;
  createdAt: string;
}

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<"overview" | "bookings" | "menu" | "seats" | "customers" | "orders">("overview");

  const [stats, setStats] = useState<AdminStats | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [seats, setSeats] = useState<Seat[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  const [loading, setLoading] = useState(true);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  // New Menu Item Form State
  const [showAddMenuModal, setShowAddMenuModal] = useState(false);
  const [newMenu, setNewMenu] = useState({
    category: "Signature Coffee",
    itemName: "",
    description: "",
    price: 180,
    image: "/cold-brew.png",
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [resStats, resBookings, resMenu, resSeats, resCustomers, resOrders] = await Promise.all([
        fetch("/api/admin/stats"),
        fetch("/api/booking"),
        fetch("/api/menu"),
        fetch("/api/workspace"),
        fetch("/api/admin/customers"),
        fetch("/api/orders"),
      ]);

      if (resStats.ok) {
        const data = await resStats.json();
        if (data.success) setStats(data.stats);
      }

      if (resBookings.ok) {
        const data = await resBookings.json();
        if (data.success) setBookings(data.bookings);
      }

      if (resMenu.ok) {
        const data = await resMenu.json();
        if (data.success) setMenuItems(data.menu);
      }

      if (resSeats.ok) {
        const data = await resSeats.json();
        if (data.success) setSeats(data.seats);
      }

      if (resCustomers.ok) {
        const data = await resCustomers.json();
        if (data.success) setCustomers(data.customers);
      }

      if (resOrders.ok) {
        const data = await resOrders.json();
        if (data.success) setOrders(data.orders);
      }
    } catch (err) {
      console.error("Failed to load admin data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleBookingStatus = async (id: string, status: "confirmed" | "rejected" | "cancelled") => {
    try {
      const res = await fetch(`/api/booking/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (res.ok) {
        setActionMessage(`Booking ${status} successfully`);
        setTimeout(() => setActionMessage(null), 3000);
        fetchData();
      }
    } catch (err) {
      console.error("Booking status update failed:", err);
    }
  };

  const handleCreateMenu = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/menu", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newMenu),
      });

      if (res.ok) {
        setActionMessage("Menu item created successfully");
        setShowAddMenuModal(false);
        setNewMenu({
          category: "Signature Coffee",
          itemName: "",
          description: "",
          price: 180,
          image: "/cold-brew.png",
        });
        setTimeout(() => setActionMessage(null), 3000);
        fetchData();
      }
    } catch (err) {
      console.error("Failed to create menu item:", err);
    }
  };

  const handleDeleteMenu = async (id: string) => {
    if (!confirm("Are you sure you want to delete this menu item?")) return;
    try {
      const res = await fetch(`/api/menu/${id}`, { method: "DELETE" });
      if (res.ok) {
        setActionMessage("Menu item deleted");
        setTimeout(() => setActionMessage(null), 3000);
        fetchData();
      }
    } catch (err) {
      console.error("Failed to delete menu item:", err);
    }
  };

  const handleSeatStatusChange = async (seatNumber: string, status: "available" | "reserved" | "occupied") => {
    try {
      const res = await fetch("/api/workspace", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ seatNumber, status }),
      });

      if (res.ok) {
        setActionMessage(`Seat ${seatNumber} set to ${status}`);
        setTimeout(() => setActionMessage(null), 3000);
        fetchData();
      }
    } catch (err) {
      console.error("Seat status update failed:", err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F1EA]">
      <Navbar />

      <main className="flex-grow pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        {/* Header Title Banner */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 bg-white p-6 sm:p-8 rounded-3xl border border-primary/10 shadow-lg">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-widest text-accent mb-1">
              <LayoutDashboard className="w-4 h-4" /> Admin Operations Control
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold font-serif text-primary">
              RoyalCafe Connect Dashboard
            </h1>
            <p className="text-xs text-foreground/60 mt-1">
              Manage live bookings, seating availability, menu items, customer accounts, and orders.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchData}
              className="p-3 rounded-2xl bg-[#F8F1EA] border border-primary/15 text-primary hover:bg-primary/5 transition-all cursor-pointer flex items-center gap-2 text-xs font-bold"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} /> Refresh
            </button>
            <Link
              href="/"
              className="py-3 px-5 rounded-2xl bg-primary text-white text-xs font-bold hover:bg-primary/95 transition-all shadow-md flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" /> Exit Dashboard
            </Link>
          </div>
        </div>

        {/* Action Notification Toast */}
        {actionMessage && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-600 text-white font-semibold text-xs flex items-center gap-2 shadow-lg animate-fade-in">
            <CheckCircle2 className="w-4 h-4" /> {actionMessage}
          </div>
        )}

        {/* Admin Navigation Tabs */}
        <div className="flex flex-wrap gap-2 mb-8 bg-white p-2 rounded-2xl border border-primary/10 shadow-sm">
          {[
            { id: "overview", label: "Overview Stats", icon: LayoutDashboard },
            { id: "bookings", label: `Bookings (${bookings.length})`, icon: Calendar },
            { id: "menu", label: `Menu Management (${menuItems.length})`, icon: Utensils },
            { id: "seats", label: `Seat Availability (${seats.length})`, icon: Armchair },
            { id: "customers", label: `Customers (${customers.length})`, icon: Users },
            { id: "orders", label: `Orders (${orders.length})`, icon: ShoppingBag },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`py-3 px-5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                  activeTab === tab.id
                    ? "bg-primary text-white shadow-md"
                    : "text-foreground/70 hover:text-primary hover:bg-[#F8F1EA]"
                }`}
              >
                <Icon className="w-4 h-4" /> {tab.label}
              </button>
            );
          })}
        </div>

        {/* ================= TAB 1: OVERVIEW STATS ================= */}
        {activeTab === "overview" && (
          <div className="space-y-8 animate-fade-in">
            {/* Metric Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-3xl border border-primary/10 shadow-md">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-foreground/50 uppercase">Total Revenue</span>
                  <DollarSign className="w-5 h-5 text-accent" />
                </div>
                <div className="text-3xl font-extrabold text-primary font-serif">
                  ₹{(stats?.totalRevenue || 0).toLocaleString()}
                </div>
                <span className="text-[10px] text-foreground/60 mt-1 block">
                  Bookings: ₹{stats?.bookingRevenue || 0} • Orders: ₹{stats?.orderRevenue || 0}
                </span>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-primary/10 shadow-md">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-foreground/50 uppercase">Total Bookings</span>
                  <Calendar className="w-5 h-5 text-accent" />
                </div>
                <div className="text-3xl font-extrabold text-primary font-serif">
                  {stats?.totalBookings || bookings.length}
                </div>
                <span className="text-[10px] text-emerald-600 font-semibold mt-1 block">
                  Active Desks &amp; Tables
                </span>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-primary/10 shadow-md">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-foreground/50 uppercase">Registered Customers</span>
                  <Users className="w-5 h-5 text-accent" />
                </div>
                <div className="text-3xl font-extrabold text-primary font-serif">
                  {stats?.totalCustomers || customers.length}
                </div>
                <span className="text-[10px] text-foreground/60 mt-1 block">RoyalCafe Connect Members</span>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-primary/10 shadow-md">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-foreground/50 uppercase">Seat Occupancy Rate</span>
                  <Armchair className="w-5 h-5 text-accent" />
                </div>
                <div className="text-3xl font-extrabold text-primary font-serif">
                  {stats?.occupancyRate || 0}%
                </div>
                <span className="text-[10px] text-foreground/60 mt-1 block">
                  {stats?.occupiedSeats || 0} of {stats?.totalSeats || 12} Seats Reserved / Occupied
                </span>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 2: BOOKINGS ================= */}
        {activeTab === "bookings" && (
          <div className="bg-white rounded-3xl border border-primary/10 shadow-md overflow-hidden animate-fade-in p-6">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-primary/10">
              <h3 className="text-lg font-bold font-serif text-primary">All Workspace &amp; Café Bookings</h3>
              <span className="text-xs font-semibold text-foreground/60">{bookings.length} Total Bookings</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-primary/10 text-[10px] uppercase font-bold text-foreground/50 tracking-wider">
                    <th className="py-3 px-4">Booking ID</th>
                    <th className="py-3 px-4">Customer</th>
                    <th className="py-3 px-4">Workspace / Table</th>
                    <th className="py-3 px-4">Date &amp; Time</th>
                    <th className="py-3 px-4">Amount</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-primary/5 text-xs">
                  {bookings.map((b) => (
                    <tr key={b._id} className="hover:bg-[#F8F1EA]/50 transition-colors">
                      <td className="py-4 px-4 font-mono font-bold text-primary">{b.bookingId}</td>
                      <td className="py-4 px-4 font-semibold text-primary">
                        <div>{b.fullName}</div>
                        <div className="text-[10px] text-foreground/60 font-normal">{b.mobile}</div>
                      </td>
                      <td className="py-4 px-4 font-medium text-foreground/80">{b.seatNumber || b.seatType}</td>
                      <td className="py-4 px-4 text-foreground/70">
                        {b.date} • {b.arrivalTime}
                      </td>
                      <td className="py-4 px-4 font-bold text-accent">₹{b.amount}</td>
                      <td className="py-4 px-4">
                        <span
                          className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                            b.status === "confirmed"
                              ? "bg-emerald-100 text-emerald-800"
                              : b.status === "rejected" || b.status === "cancelled"
                              ? "bg-red-100 text-red-800"
                              : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {b.status}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right space-x-2">
                        {b.status !== "confirmed" && (
                          <button
                            onClick={() => handleBookingStatus(b._id, "confirmed")}
                            className="px-3 py-1 rounded-lg bg-emerald-600 text-white text-[11px] font-bold hover:bg-emerald-700 transition-colors cursor-pointer"
                          >
                            Approve
                          </button>
                        )}
                        {b.status !== "rejected" && (
                          <button
                            onClick={() => handleBookingStatus(b._id, "rejected")}
                            className="px-3 py-1 rounded-lg bg-red-600 text-white text-[11px] font-bold hover:bg-red-700 transition-colors cursor-pointer"
                          >
                            Reject
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ================= TAB 3: MENU MANAGEMENT ================= */}
        {activeTab === "menu" && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-center bg-white p-6 rounded-3xl border border-primary/10 shadow-sm">
              <div>
                <h3 className="text-lg font-bold font-serif text-primary">Live Menu Items ({menuItems.length})</h3>
                <p className="text-xs text-foreground/60">Add, edit, or remove menu items displayed on the customer menu page.</p>
              </div>
              <button
                onClick={() => setShowAddMenuModal(true)}
                className="py-3 px-5 rounded-2xl bg-accent text-white font-bold text-xs hover:bg-accent/90 transition-all flex items-center gap-2 cursor-pointer shadow-md"
              >
                <Plus className="w-4 h-4" /> Add Menu Item
              </button>
            </div>

            {/* Menu Items Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {menuItems.map((item) => (
                <div key={item._id} className="bg-white p-5 rounded-3xl border border-primary/10 shadow-md space-y-3 flex flex-col justify-between">
                  <div>
                    <span className="text-[9px] font-extrabold uppercase tracking-wider text-accent bg-[#F8F1EA] px-2.5 py-1 rounded-full inline-block mb-2">
                      {item.category}
                    </span>
                    <h4 className="font-bold text-sm text-primary font-serif">{item.itemName}</h4>
                    <p className="text-xs text-foreground/70 line-clamp-2 mt-1 font-light">{item.description}</p>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-primary/5">
                    <span className="text-base font-bold text-primary font-serif">₹{item.price}</span>
                    <button
                      onClick={() => handleDeleteMenu(item._id)}
                      className="p-2 rounded-xl text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                      title="Delete Item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Add Menu Modal */}
            {showAddMenuModal && (
              <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl border border-primary/10">
                  <h3 className="text-xl font-bold font-serif text-primary mb-4">Add New Menu Item</h3>
                  <form onSubmit={handleCreateMenu} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold uppercase text-foreground/80 mb-1">Item Name</label>
                      <input
                        type="text"
                        required
                        value={newMenu.itemName}
                        onChange={(e) => setNewMenu({ ...newMenu, itemName: e.target.value })}
                        className="w-full p-3 rounded-xl border border-primary/15 text-xs text-primary bg-[#F8F1EA]/50"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase text-foreground/80 mb-1">Category</label>
                      <select
                        value={newMenu.category}
                        onChange={(e) => setNewMenu({ ...newMenu, category: e.target.value })}
                        className="w-full p-3 rounded-xl border border-primary/15 text-xs text-primary bg-[#F8F1EA]/50"
                      >
                        <option value="Signature Coffee">Signature Coffee</option>
                        <option value="Espresso Bar">Espresso Bar</option>
                        <option value="Cappuccino & Latte">Cappuccino &amp; Latte</option>
                        <option value="Cold Coffee">Cold Coffee</option>
                        <option value="Breakfast">Breakfast</option>
                        <option value="Sandwiches">Sandwiches</option>
                        <option value="Burgers">Burgers</option>
                        <option value="Desserts">Desserts</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase text-foreground/80 mb-1">Price (₹)</label>
                      <input
                        type="number"
                        required
                        value={newMenu.price}
                        onChange={(e) => setNewMenu({ ...newMenu, price: Number(e.target.value) })}
                        className="w-full p-3 rounded-xl border border-primary/15 text-xs text-primary bg-[#F8F1EA]/50"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase text-foreground/80 mb-1">Description</label>
                      <textarea
                        rows={3}
                        required
                        value={newMenu.description}
                        onChange={(e) => setNewMenu({ ...newMenu, description: e.target.value })}
                        className="w-full p-3 rounded-xl border border-primary/15 text-xs text-primary bg-[#F8F1EA]/50"
                      />
                    </div>

                    <div className="flex gap-3 pt-4">
                      <button
                        type="button"
                        onClick={() => setShowAddMenuModal(false)}
                        className="flex-1 py-3 text-xs font-bold rounded-xl border border-primary/20 text-primary hover:bg-[#F8F1EA]"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="flex-1 py-3 text-xs font-bold rounded-xl bg-primary text-white hover:bg-primary/95 shadow-md"
                      >
                        Create Item
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ================= TAB 4: SEATS ================= */}
        {activeTab === "seats" && (
          <div className="bg-white rounded-3xl border border-primary/10 shadow-md p-6 animate-fade-in space-y-6">
            <div>
              <h3 className="text-lg font-bold font-serif text-primary">Manage Live Seat Status</h3>
              <p className="text-xs text-foreground/60">Update availability of individual desks and dining tables in real time.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {seats.map((seat) => (
                <div key={seat._id} className="p-4 rounded-2xl border border-primary/10 bg-[#F8F1EA]/40 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-primary font-mono">{seat.seatNumber}</span>
                    <span className="text-[10px] text-foreground/60">{seat.zone}</span>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase text-foreground/50 mb-1">Status</label>
                    <select
                      value={seat.status}
                      onChange={(e) => handleSeatStatusChange(seat.seatNumber, e.target.value as any)}
                      className={`w-full p-2 rounded-xl text-xs font-bold border ${
                        seat.status === "available"
                          ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                          : seat.status === "reserved"
                          ? "bg-amber-50 text-amber-800 border-amber-200"
                          : "bg-red-50 text-red-800 border-red-200"
                      }`}
                    >
                      <option value="available">Available</option>
                      <option value="reserved">Reserved</option>
                      <option value="occupied">Occupied</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= TAB 5: CUSTOMERS ================= */}
        {activeTab === "customers" && (
          <div className="bg-white rounded-3xl border border-primary/10 shadow-md p-6 animate-fade-in">
            <h3 className="text-lg font-bold font-serif text-primary mb-4">Customer Accounts ({customers.length})</h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-primary/10 text-[10px] uppercase font-bold text-foreground/50 tracking-wider">
                    <th className="py-3 px-4">Name</th>
                    <th className="py-3 px-4">Email</th>
                    <th className="py-3 px-4">Phone</th>
                    <th className="py-3 px-4">Joined Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-primary/5 text-xs">
                  {customers.map((c) => (
                    <tr key={c._id} className="hover:bg-[#F8F1EA]/50">
                      <td className="py-4 px-4 font-bold text-primary">{c.name}</td>
                      <td className="py-4 px-4 text-foreground/80">{c.email}</td>
                      <td className="py-4 px-4 text-foreground/80">{c.phone}</td>
                      <td className="py-4 px-4 text-foreground/60">{new Date(c.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ================= TAB 6: ORDERS ================= */}
        {activeTab === "orders" && (
          <div className="bg-white rounded-3xl border border-primary/10 shadow-md p-6 animate-fade-in">
            <h3 className="text-lg font-bold font-serif text-primary mb-4">Café Food &amp; Drink Orders ({orders.length})</h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-primary/10 text-[10px] uppercase font-bold text-foreground/50 tracking-wider">
                    <th className="py-3 px-4">Order ID</th>
                    <th className="py-3 px-4">Customer</th>
                    <th className="py-3 px-4">Total Amount</th>
                    <th className="py-3 px-4">Payment</th>
                    <th className="py-3 px-4">Order Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-primary/5 text-xs">
                  {orders.map((o) => (
                    <tr key={o._id} className="hover:bg-[#F8F1EA]/50">
                      <td className="py-4 px-4 font-mono font-bold text-primary">{o.orderId}</td>
                      <td className="py-4 px-4 font-semibold text-primary">{o.customerName}</td>
                      <td className="py-4 px-4 font-bold text-accent">₹{o.totalAmount}</td>
                      <td className="py-4 px-4 font-bold text-emerald-600 uppercase text-[10px]">{o.paymentStatus}</td>
                      <td className="py-4 px-4 font-semibold text-primary uppercase text-[10px]">{o.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
