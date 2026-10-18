"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/customer/navbar/Navbar";
import Footer from "@/components/customer/footer/Footer";
import { getAuthenticatedUser } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import {
  User,
  Mail,
  Phone,
  Calendar,
  Crown,
  Award,
  Edit,
  Save,
  LogOut,
  MapPin,
  Briefcase,
  Globe,
  Clock,
  Armchair,
  CheckCircle2,
  XCircle,
  CreditCard,
  Download,
  Gift,
  Heart,
  Bell,
  Settings,
  ShieldCheck,
  QrCode,
  Eye,
  Trash2,
  Copy,
  ChevronRight,
  Coffee,
  Sparkles,
  Lock,
  Camera,
  X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export interface UserBooking {
  id: string; // BK-1001
  deskId: string; // W-02
  workspaceType: string;
  cafeName: string;
  date: string;
  time: string;
  duration: string;
  guests: number;
  amount: number;
  paymentStatus: "Paid" | "Pending";
  status: "Confirmed" | "Checked In" | "Checked Out" | "Cancelled";
  image: string;
}

export interface UserPayment {
  id: string; // PAY-98123
  bookingId: string;
  amount: number;
  method: string;
  date: string;
  status: "Successful" | "Pending" | "Refunded";
}

export default function UserProfilePage() {
  const router = useRouter();

  // User Profile State
  const [userInfo, setUserInfo] = useState({
    name: "Rahul Sharma",
    email: "rahul@gmail.com",
    phone: "+91 98765 43210",
    gender: "Male",
    dob: "15 May 1996",
    address: "102 Royal Heights, MG Road",
    city: "Bangalore",
    state: "Karnataka",
    country: "India",
    profession: "Software Architect",
    memberSince: "Aug 2026",
    membershipPlan: "VIP Premium",
    loyaltyPoints: 240,
    avatarUrl: "",
  });

  const [activeTab, setActiveTab] = useState<
    "profile" | "upcoming" | "history" | "payments" | "membership" | "rewards" | "favorites" | "notifications" | "settings"
  >("profile");

  const [toast, setToast] = useState<string | null>(null);

  // Modals State
  const [selectedBookingDetails, setSelectedBookingDetails] = useState<UserBooking | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [bookings, setBookings] = useState<UserBooking[]>([]);

  // Demo User Payment History
  const [payments] = useState<UserPayment[]>([
    { id: "PAY-98123", bookingId: "BK-1001", amount: 499, method: "UPI (GPay)", date: "07 Aug 2026, 02:15 PM", status: "Successful" },
    { id: "PAY-98124", bookingId: "BK-1002", amount: 350, method: "Credit Card", date: "07 Aug 2026, 01:40 PM", status: "Successful" },
    { id: "PAY-97800", bookingId: "BK-0982", amount: 1800, method: "UPI (PhonePe)", date: "02 Aug 2026, 08:50 AM", status: "Successful" },
    { id: "PAY-97650", bookingId: "BK-0975", amount: 1250, method: "Net Banking", date: "25 Jul 2026, 01:30 PM", status: "Successful" },
  ]);

  // Load Logged In User Data from LocalStorage
  useEffect(() => {
    let currentUser: any = null;
    try {
      const stored = localStorage.getItem("royalcafe_user") || localStorage.getItem("user");
      if (stored) {
        const parsed = JSON.parse(stored);
        currentUser = parsed;
        setUserInfo((prev) => ({
          ...prev,
          name: parsed.name || parsed.email?.split("@")[0] || prev.name,
          email: parsed.email || prev.email,
          phone: parsed.phone || prev.phone,
        }));
      }
    } catch {
      // Keep fallbacks
    }

    async function fetchUserBookings() {
      const authUser = getAuthenticatedUser() || currentUser;
      if (!authUser || (!authUser.id && !authUser.email)) return;
      
      try {
        const { data, error } = await supabase
          .from('reservation')
          .select('*')
          .eq('user_id', authUser.id)
          .order('created_at', { ascending: false });

        if (error) {
          console.error("Error fetching user reservations:", error);
          return;
        }
          
        if (data && data.length > 0) {
          const mappedBookings: UserBooking[] = data.map((b: any) => {
            const spaceName = b.seat_name || b.seat_code || "Unknown Workspace";
            const spaceCode = b.seat_code || spaceName;
            const spaceType = "seat";
            
            let statusEnum: any = "Confirmed";
            if (b.status === "checked_in") statusEnum = "Checked In";
            if (b.status === "checked_out") statusEnum = "Checked Out";
            if (b.status === "cancelled") statusEnum = "Cancelled";
            
            return {
              id: b.id, // Keep full ID for updates, UI uses substring if needed
              deskId: spaceCode,
              workspaceType: spaceType,
              cafeName: "RoyalCafe Main Branch",
              date: b.booking_date,
              time: b.start_time,
              duration: `${b.duration_hours} Hour(s)`,
              guests: b.number_of_people || 1,
              amount: b.total_amount,
              paymentStatus: b.payment_status === "paid" ? "Paid" : "Pending",
              status: statusEnum,
              image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&q=80",
            };
          });
          setBookings(mappedBookings);
        }
      } catch (err) {
        console.error("Failed to fetch user bookings:", err);
      }
    }
    
    fetchUserBookings();
  }, []);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const stored = localStorage.getItem("royalcafe_user") || localStorage.getItem("user");
      let existingObj = {};
      if (stored) existingObj = JSON.parse(stored);
      const updatedObj = { ...existingObj, name: userInfo.name, email: userInfo.email, phone: userInfo.phone };
      localStorage.setItem("royalcafe_user", JSON.stringify(updatedObj));
    } catch {
      // Ignore
    }
    showToast("✅ Profile details updated successfully!");
  };

  const handleCancelBooking = async (bookingId: string) => {
    if (confirm("Are you sure you want to cancel this booking?")) {
      const { error } = await supabase.from('reservation').update({ status: 'cancelled' }).eq('id', bookingId);
      if (error) {
        showToast(`❌ Failed to cancel booking.`);
        return;
      }
      setBookings((prev) => prev.map((b) => b.id === bookingId ? { ...b, status: 'Cancelled' } : b));
      showToast(`❌ Booking ${bookingId.slice(0, 8).toUpperCase()} has been cancelled.`);
      setShowDeleteModal(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("role");
    localStorage.removeItem("email");
    localStorage.removeItem("adminEmail");
    localStorage.removeItem("user");
    localStorage.removeItem("royalcafe_user");
    localStorage.removeItem("token");
    window.dispatchEvent(new Event("auth-state-change"));
    router.push("/login");
  };

  const upcomingBookingsList = bookings.filter(
    (b) => b.status === "Confirmed" || b.status === "Checked In"
  );
  const completedBookingsList = bookings.filter(
    (b) => b.status === "Checked Out" || b.status === "Cancelled"
  );

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground font-sans relative overflow-hidden">
      {/* Toast Alert */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-24 right-6 z-50 bg-accent text-primary px-5 py-3.5 rounded-2xl shadow-2xl border border-amber-500/30 flex items-center gap-3"
          >
            <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
            <span className="text-xs font-bold font-sans">{toast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Customer Navbar */}
      <Navbar />

      {/* Main Profile Body with Proper Top Spacing from Navbar */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-22 lg:pt-24 pb-12 space-y-8">
        {/* PROFILE HEADER HERO */}
        <div className="bg-[#561C24] text-[#FFF8E6] rounded-3xl p-6 sm:p-8 border border-[rgba(244,221,165,0.25)] shadow-xl relative overflow-hidden space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            {/* Avatar + User Info */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start md:items-center gap-5 text-center sm:text-left">
              {/* Profile Avatar with Camera Trigger */}
              <div className="relative group">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-[rgba(244,221,165,0.15)] text-[#F4DDA5] border border-[rgba(244,221,165,0.3)] flex items-center justify-center font-bold text-3xl shadow-md ring-4 ring-[#F4DDA5]/20 overflow-hidden">
                  {userInfo.avatarUrl ? (
                    <img src={userInfo.avatarUrl} alt={userInfo.name} className="w-full h-full object-cover" />
                  ) : (
                    userInfo.name.charAt(0)
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => showToast("📷 Profile avatar updated")}
                  className="absolute bottom-0 right-0 p-2 rounded-xl bg-[#F4DDA5] hover:bg-[#FFF8E6] text-[#561C24] shadow-md transition-all cursor-pointer"
                  title="Upload / Change Avatar"
                >
                  <Camera className="w-4 h-4" />
                </button>
              </div>

              {/* Text Info */}
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <h1 className="text-2xl sm:text-3xl font-black font-serif text-[#FFF8E6]">
                    {userInfo.name}
                  </h1>
                  <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-[#F4DDA5]/20 text-[#F4DDA5] border border-[#F4DDA5]/30 flex items-center gap-1">
                    <Crown className="w-3.5 h-3.5 text-[#F4DDA5]" /> {userInfo.membershipPlan}
                  </span>
                </div>
                <p className="text-xs text-[#FFF8E6]/80 font-medium flex flex-wrap items-center justify-center sm:justify-start gap-3">
                  <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5 text-[#F4DDA5]" /> {userInfo.email}</span>
                  <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5 text-[#F4DDA5]" /> {userInfo.phone}</span>
                </p>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 pt-1 text-xs">
                  <span className="text-[#FFF8E6]/75 font-semibold">
                    Member Since: <strong className="text-[#FFF8E6]">{userInfo.memberSince}</strong>
                  </span>
                  <span className="text-[#F4DDA5] font-bold bg-[#3D1118] px-3 py-1 rounded-full border border-[rgba(244,221,165,0.25)] flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-[#F4DDA5]" /> {userInfo.loyaltyPoints} Loyalty Points
                  </span>
                </div>
              </div>
            </div>

            {/* Edit Profile Action */}
            <div className="flex items-center justify-center sm:justify-start md:justify-end gap-3">
              <button
                type="button"
                onClick={() => setActiveTab("profile")}
                className="px-5 py-2.5 rounded-2xl bg-[#F4DDA5] hover:bg-[#FFF8E6] text-[#561C24] font-bold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer"
              >
                <Edit className="w-4 h-4" /> Edit Profile
              </button>
            </div>
          </div>
        </div>

        {/* QUICK STATS CARDS (6 Responsive KPI Cards) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="bg-[#561C24] text-[#FFF8E6] rounded-2xl p-4 border border-[rgba(244,221,165,0.25)] shadow-md hover:-translate-y-1 hover:border-[#F4DDA5] transition-all duration-200">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-[#FFF8E6]/75 uppercase tracking-wider">Upcoming</span>
              <Calendar className="w-4 h-4 text-[#F4DDA5]" />
            </div>
            <div className="mt-2">
              <div className="text-xl font-bold font-mono text-[#FFF8E6]">{upcomingBookingsList.length}</div>
              <div className="text-xs text-emerald-400 font-bold mt-0.5">Active Bookings</div>
            </div>
          </div>

          <div className="bg-[#561C24] text-[#FFF8E6] rounded-2xl p-4 border border-[rgba(244,221,165,0.25)] shadow-md hover:-translate-y-1 hover:border-[#F4DDA5] transition-all duration-200">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-[#FFF8E6]/75 uppercase tracking-wider">Completed</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="mt-2">
              <div className="text-xl font-bold font-mono text-[#FFF8E6]">12</div>
              <div className="text-xs text-[#FFF8E6]/75 font-medium mt-0.5">Past Visits</div>
            </div>
          </div>

          <div className="bg-[#561C24] text-[#FFF8E6] rounded-2xl p-4 border border-[rgba(244,221,165,0.25)] shadow-md hover:-translate-y-1 hover:border-[#F4DDA5] transition-all duration-200">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-[#FFF8E6]/75 uppercase tracking-wider">Cancelled</span>
              <XCircle className="w-4 h-4 text-rose-400" />
            </div>
            <div className="mt-2">
              <div className="text-xl font-bold font-mono text-[#FFF8E6]">1</div>
              <div className="text-xs text-[#FFF8E6]/75 font-medium mt-0.5">Cancelled Booking</div>
            </div>
          </div>

          <div className="bg-surface rounded-2xl p-4 border border-border/50 shadow-xs hover:-translate-y-1 hover:shadow-md transition-all duration-200">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-foreground/80 uppercase tracking-wider">Membership</span>
              <Crown className="w-4 h-4 text-amber-700" />
            </div>
            <div className="mt-2">
              <div className="text-base font-bold text-amber-900 truncate">VIP Premium</div>
              <div className="text-xs text-amber-800 font-bold mt-0.5">Renews 31 Dec</div>
            </div>
          </div>

          <div className="bg-surface rounded-2xl p-4 border border-border/50 shadow-xs hover:-translate-y-1 hover:shadow-md transition-all duration-200">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-foreground/80 uppercase tracking-wider">Total Spent</span>
              <CreditCard className="w-4 h-4 text-purple-700" />
            </div>
            <div className="mt-2">
              <div className="text-xl font-bold font-mono text-purple-900 font-extrabold">₹5,840</div>
              <div className="text-xs text-purple-700 font-medium mt-0.5">14 Invoices</div>
            </div>
          </div>

          <div className="bg-surface rounded-2xl p-4 border border-border/50 shadow-xs hover:-translate-y-1 hover:shadow-md transition-all duration-200">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-foreground/80 uppercase tracking-wider">Fav Desk</span>
              <Armchair className="w-4 h-4 text-accent" />
            </div>
            <div className="mt-2">
              <div className="text-base font-bold text-foreground truncate">Desk W-02</div>
              <div className="text-xs text-foreground/80 font-medium mt-0.5">Workstation</div>
            </div>
          </div>
        </div>

        {/* TWO-COLUMN NAVIGATION & MAIN TABS */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
          {/* LEFT TAB NAVIGATION SIDEBAR */}
          <div className="bg-surface rounded-3xl p-3 border border-border/50 shadow-sm space-y-1">
            <div className="px-3 py-2 text-xs font-extrabold uppercase tracking-widest text-foreground/80">
              Profile Sections
            </div>

            {[
              { id: "profile", label: "Profile Information", icon: User },
              { id: "upcoming", label: "Upcoming Bookings", icon: Calendar, badge: upcomingBookingsList.length },
              { id: "history", label: "Booking History", icon: Clock },
              { id: "payments", label: "Payment History", icon: CreditCard },
              { id: "membership", label: "VIP Membership", icon: Crown },
              { id: "rewards", label: "Loyalty & Rewards", icon: Gift },
              { id: "favorites", label: "Saved Favorites", icon: Heart },
              { id: "notifications", label: "Notifications", icon: Bell },
              { id: "settings", label: "Account Settings", icon: Settings },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? "bg-accent text-primary shadow-md scale-[1.01]"
                      : "text-foreground/70 hover:bg-background hover:text-foreground"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? "text-amber-300" : "text-accent"}`} />
                    <span>{tab.label}</span>
                  </div>
                  {tab.badge !== undefined && tab.badge > 0 && (
                    <span className="px-2 py-0.5 rounded-full text-xs font-extrabold bg-amber-500 text-primary">
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}

            {/* Logout Button */}
            <div className="pt-2 border-t border-border/50 mt-2">
              <button
                type="button"
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3.5 py-3 rounded-2xl text-xs font-bold text-rose-700 hover:bg-rose-100 transition-all cursor-pointer"
              >
                <LogOut className="w-4 h-4 shrink-0" />
                <span>Logout Session</span>
              </button>
            </div>
          </div>

          {/* RIGHT CONTENT TAB PANELS */}
          <div className="lg:col-span-3 bg-surface rounded-3xl p-6 sm:p-8 border border-border/50 shadow-sm space-y-6">
            {/* TAB 1: PROFILE INFORMATION */}
            {activeTab === "profile" && (
              <form onSubmit={handleSaveProfile} className="space-y-6">
                <div className="border-b border-border/50 pb-4">
                  <h2 className="text-xl font-bold font-serif text-foreground flex items-center gap-2">
                    <User className="w-5 h-5 text-accent" /> Edit Personal Profile
                  </h2>
                  <p className="text-xs text-foreground/80">
                    Update your account details, contact information, and personal preferences.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="space-y-1.5">
                    <label className="font-bold text-foreground">Full Name</label>
                    <input
                      type="text"
                      value={userInfo.name}
                      onChange={(e) => setUserInfo({ ...userInfo, name: e.target.value })}
                      className="w-full p-3 bg-background border border-border/50 rounded-xl text-foreground font-medium"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-foreground">Email Address</label>
                    <input
                      type="email"
                      value={userInfo.email}
                      onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })}
                      className="w-full p-3 bg-background border border-border/50 rounded-xl text-foreground font-medium"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-foreground">Phone Number</label>
                    <input
                      type="text"
                      value={userInfo.phone}
                      onChange={(e) => setUserInfo({ ...userInfo, phone: e.target.value })}
                      className="w-full p-3 bg-background border border-border/50 rounded-xl text-foreground font-medium"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-foreground">Gender</label>
                    <select
                      value={userInfo.gender}
                      onChange={(e) => setUserInfo({ ...userInfo, gender: e.target.value })}
                      className="w-full p-3 bg-background border border-border/50 rounded-xl text-foreground font-medium"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                      <option value="Prefer not to say">Prefer not to say</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-foreground">Date of Birth</label>
                    <input
                      type="text"
                      value={userInfo.dob}
                      onChange={(e) => setUserInfo({ ...userInfo, dob: e.target.value })}
                      className="w-full p-3 bg-background border border-border/50 rounded-xl text-foreground font-medium"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-foreground">Profession / Designation</label>
                    <input
                      type="text"
                      value={userInfo.profession}
                      onChange={(e) => setUserInfo({ ...userInfo, profession: e.target.value })}
                      className="w-full p-3 bg-background border border-border/50 rounded-xl text-foreground font-medium"
                    />
                  </div>

                  <div className="sm:col-span-2 space-y-1.5">
                    <label className="font-bold text-foreground">Address</label>
                    <input
                      type="text"
                      value={userInfo.address}
                      onChange={(e) => setUserInfo({ ...userInfo, address: e.target.value })}
                      className="w-full p-3 bg-background border border-border/50 rounded-xl text-foreground font-medium"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-foreground">City</label>
                    <input
                      type="text"
                      value={userInfo.city}
                      onChange={(e) => setUserInfo({ ...userInfo, city: e.target.value })}
                      className="w-full p-3 bg-background border border-border/50 rounded-xl text-foreground font-medium"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-foreground">State &amp; Country</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={userInfo.state}
                        onChange={(e) => setUserInfo({ ...userInfo, state: e.target.value })}
                        className="w-1/2 p-3 bg-background border border-border/50 rounded-xl text-foreground font-medium"
                      />
                      <input
                        type="text"
                        value={userInfo.country}
                        onChange={(e) => setUserInfo({ ...userInfo, country: e.target.value })}
                        className="w-1/2 p-3 bg-background border border-border/50 rounded-xl text-foreground font-medium"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-4 border-t border-border/50">
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-2xl bg-accent hover:bg-accent text-primary font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Save className="w-4 h-4" /> Save Profile Changes
                  </button>
                </div>
              </form>
            )}

            {/* TAB 2: UPCOMING BOOKINGS */}
            {activeTab === "upcoming" && (
              <div className="space-y-4">
                <div className="border-b border-border/50 pb-4">
                  <h2 className="text-xl font-bold font-serif text-foreground flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-accent" /> Upcoming Reservations
                  </h2>
                  <p className="text-xs text-foreground/80">
                    View and manage your active desk &amp; room reservations.
                  </p>
                </div>

                {upcomingBookingsList.length > 0 ? (
                  <div className="space-y-3">
                    {upcomingBookingsList.map((b) => (
                      <div
                        key={b.id}
                        className="p-4 rounded-2xl bg-background border border-border/50 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:shadow-md transition-all"
                      >
                        <div className="flex items-center gap-4">
                          <img
                            src={b.image}
                            alt={b.workspaceType}
                            className="w-20 h-20 rounded-2xl object-cover shadow-xs shrink-0"
                          />
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-mono font-bold text-sm text-accent">{b.id}</span>
                              <span className="font-extrabold font-mono text-xs text-accent bg-surface px-2.5 py-0.5 rounded-full border border-border/50">
                                Desk {b.deskId}
                              </span>
                            </div>
                            <h3 className="font-bold text-sm text-foreground">{b.workspaceType}</h3>
                            <p className="text-xs text-foreground/80">{b.cafeName}</p>
                            <div className="text-xs text-accent font-semibold flex items-center gap-3">
                              <span>📅 {b.date}</span>
                              <span>⏰ {b.time} ({b.duration})</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex md:flex-col items-center md:items-end justify-between gap-2 pt-2 md:pt-0 border-t md:border-t-0 border-border/50">
                          <span className="font-mono font-bold text-base text-foreground">₹{b.amount}</span>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => setSelectedBookingDetails(b)}
                              className="px-3.5 py-1.5 rounded-xl bg-accent hover:bg-accent text-primary font-bold text-xs shadow-xs transition-all cursor-pointer flex items-center gap-1"
                            >
                              <Eye className="w-3.5 h-3.5" /> View Details
                            </button>
                            <button
                              type="button"
                              onClick={() => handleCancelBooking(b.id)}
                              className="px-3.5 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-800 font-bold text-xs border border-rose-200 transition-all cursor-pointer"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-12 text-center text-xs text-foreground/80 space-y-2">
                    <p className="font-bold text-sm text-foreground">No upcoming reservations found.</p>
                    <button
                      type="button"
                      onClick={() => router.push("/book")}
                      className="px-5 py-2.5 rounded-2xl bg-accent text-primary font-bold text-xs"
                    >
                      Book a Seat Now
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: BOOKING HISTORY */}
            {activeTab === "history" && (
              <div className="space-y-4">
                <div className="border-b border-border/50 pb-4">
                  <h2 className="text-xl font-bold font-serif text-foreground flex items-center gap-2">
                    <Clock className="w-5 h-5 text-accent" /> Booking History
                  </h2>
                  <p className="text-xs text-foreground/80">
                    Archived past reservations and completed seating visits.
                  </p>
                </div>

                <div className="space-y-3">
                  {completedBookingsList.map((b) => (
                    <div
                      key={b.id}
                      className="p-4 rounded-2xl bg-background border border-border/50 flex flex-col md:flex-row md:items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-4">
                        <img
                          src={b.image}
                          alt={b.workspaceType}
                          className="w-16 h-16 rounded-2xl object-cover shadow-xs shrink-0"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-xs text-accent">{b.id}</span>
                            <span className="text-xs font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-surface-secondary text-primary/80">
                              {b.status}
                            </span>
                          </div>
                          <h4 className="font-bold text-xs text-foreground">{b.workspaceType} ({b.deskId})</h4>
                          <p className="text-xs text-foreground/80">{b.date} • {b.duration}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between md:justify-end gap-4">
                        <span className="font-mono font-bold text-sm text-foreground">₹{b.amount}</span>
                        <button
                          type="button"
                          onClick={() => setSelectedBookingDetails(b)}
                          className="p-2 rounded-xl bg-surface hover:bg-accent hover:text-primary text-foreground border border-border/50 transition-all cursor-pointer"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 4: PAYMENT HISTORY */}
            {activeTab === "payments" && (
              <div className="space-y-4">
                <div className="border-b border-border/50 pb-4">
                  <h2 className="text-xl font-bold font-serif text-foreground flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-accent" /> Payment History &amp; Receipts
                  </h2>
                  <p className="text-xs text-foreground/80">
                    Review invoice payments, download receipts, and check transaction statuses.
                  </p>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-foreground">
                    <thead className="bg-surface uppercase text-xs font-extrabold text-foreground/80 border-b border-border/50">
                      <tr>
                        <th className="p-3">Payment ID</th>
                        <th className="p-3">Booking ID</th>
                        <th className="p-3">Amount</th>
                        <th className="p-3">Method</th>
                        <th className="p-3">Date</th>
                        <th className="p-3">Status</th>
                        <th className="p-3 text-right">Receipt</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/50">
                      {payments.map((p) => (
                        <tr key={p.id} className="hover:bg-background">
                          <td className="p-3 font-mono font-bold text-accent">{p.id}</td>
                          <td className="p-3 font-mono font-bold text-foreground/80">{p.bookingId}</td>
                          <td className="p-3 font-mono font-bold text-foreground">₹{p.amount}</td>
                          <td className="p-3 font-medium">{p.method}</td>
                          <td className="p-3 text-foreground/80">{p.date}</td>
                          <td className="p-3">
                            <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold uppercase bg-emerald-500/15 text-emerald-800">
                              {p.status}
                            </span>
                          </td>
                          <td className="p-3 text-right">
                            <button
                              type="button"
                              onClick={() => showToast(`📄 Receipt for ${p.id} downloaded.`)}
                              className="px-3 py-1 rounded-xl bg-background hover:bg-accent hover:text-primary text-foreground border border-border/50 font-bold text-xs transition-all cursor-pointer flex items-center gap-1 ml-auto"
                            >
                              <Download className="w-3.5 h-3.5" /> PDF
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB 5: MEMBERSHIP */}
            {activeTab === "membership" && (
              <div className="space-y-6">
                <div className="border-b border-border/50 pb-4">
                  <h2 className="text-xl font-bold font-serif text-foreground flex items-center gap-2">
                    <Crown className="w-5 h-5 text-amber-600" /> Royal VIP Membership Plan
                  </h2>
                  <p className="text-xs text-foreground/80">
                    Enjoy exclusive desk discounts, priority bookings, free high-speed WiFi &amp; perks.
                  </p>
                </div>

                <div className="bg-accent text-primary p-6 rounded-3xl text-primary space-y-4 shadow-lg relative overflow-hidden">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-xs font-bold uppercase tracking-widest text-amber-300 block">Current Membership</span>
                      <h3 className="text-2xl font-serif font-black text-amber-100 mt-1">Royal VIP Membership</h3>
                      <p className="text-xs text-amber-200/80 mt-0.5">Valid until 31 December 2026</p>
                    </div>
                    <Crown className="w-10 h-10 text-amber-400 opacity-80" />
                  </div>

                  <div className="pt-2 border-t border-amber-500/30 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-amber-100">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>15% Discount on All Seating Bookings</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Free Unlimited 5G High-Speed WiFi</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Priority Desk Reservation Guarantee</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>2 Free Artisanal Coffees Monthly</span>
                    </div>
                  </div>

                  <div className="pt-4 flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={() => showToast("⭐ Membership renewed until Dec 2027")}
                      className="px-5 py-2.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-foreground font-black text-xs shadow-md transition-all cursor-pointer"
                    >
                      Renew Membership
                    </button>
                    <button
                      type="button"
                      onClick={() => showToast("👑 Upgraded to Platinum Elite")}
                      className="px-5 py-2.5 rounded-2xl bg-surface/10 hover:bg-surface/20 text-primary font-bold text-xs border border-primary/20 transition-all cursor-pointer"
                    >
                      Upgrade Plan
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 6: LOYALTY & REWARDS */}
            {activeTab === "rewards" && (
              <div className="space-y-6">
                <div className="border-b border-border/50 pb-4">
                  <h2 className="text-xl font-bold font-serif text-foreground flex items-center gap-2">
                    <Gift className="w-5 h-5 text-amber-700" /> Loyalty Rewards &amp; Coupons
                  </h2>
                  <p className="text-xs text-foreground/80">
                    Redeem points for complimentary beverages, desk vouchers &amp; discount codes.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 rounded-2xl bg-background border border-border/50 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-foreground">COFFEE20 Coupon Code</span>
                      <span className="text-emerald-700 font-bold bg-emerald-100 px-2 py-0.5 rounded-full">20% OFF</span>
                    </div>
                    <p className="text-xs text-foreground/80">Valid on all food &amp; beverage menu orders.</p>
                    <button
                      type="button"
                      onClick={() => showToast("📋 Coupon COFFEE20 copied!")}
                      className="w-full py-2 rounded-xl bg-surface hover:bg-accent hover:text-primary border border-border/50 font-bold text-xs transition-all cursor-pointer flex items-center justify-center gap-1"
                    >
                      <Copy className="w-3.5 h-3.5" /> Copy Code COFFEE20
                    </button>
                  </div>

                  <div className="p-4 rounded-2xl bg-background border border-border/50 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-foreground">WORKSTATION100</span>
                      <span className="text-amber-800 font-bold bg-amber-100 px-2 py-0.5 rounded-full">₹100 OFF</span>
                    </div>
                    <p className="text-xs text-foreground/80">Valid on minimum booking of 4 hours.</p>
                    <button
                      type="button"
                      onClick={() => showToast("📋 Coupon WORKSTATION100 copied!")}
                      className="w-full py-2 rounded-xl bg-surface hover:bg-accent hover:text-primary border border-border/50 font-bold text-xs transition-all cursor-pointer flex items-center justify-center gap-1"
                    >
                      <Copy className="w-3.5 h-3.5" /> Copy Code WORKSTATION100
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 7: SAVED FAVORITES */}
            {activeTab === "favorites" && (
              <div className="space-y-4">
                <div className="border-b border-border/50 pb-4">
                  <h2 className="text-xl font-bold font-serif text-foreground flex items-center gap-2">
                    <Heart className="w-5 h-5 text-rose-600" /> Saved Favorites
                  </h2>
                  <p className="text-xs text-foreground/80">
                    Quickly re-book your favorite café locations, seating options, and menu treats.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 rounded-2xl bg-background border border-border/50 space-y-2">
                    <div className="flex items-center gap-3">
                      <div className="p-3 rounded-2xl bg-accent text-primary">
                        <Armchair className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-foreground">Workstation W-02</h4>
                        <p className="text-xs text-foreground/80">Dual Monitor Desk • Cyber City</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => router.push("/book")}
                      className="w-full py-2 rounded-xl bg-accent text-primary font-bold text-xs"
                    >
                      Quick Book Desk
                    </button>
                  </div>

                  <div className="p-4 rounded-2xl bg-background border border-border/50 space-y-2">
                    <div className="flex items-center gap-3">
                      <div className="p-3 rounded-2xl bg-amber-800 text-primary">
                        <Coffee className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-foreground">Hazelnut Latte</h4>
                        <p className="text-xs text-foreground/80">Artisanal Espresso Brew • ₹220</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => showToast("☕ Hazelnut Latte added to cart")}
                      className="w-full py-2 rounded-xl bg-accent text-primary font-bold text-xs"
                    >
                      Order Drink
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 8: NOTIFICATIONS */}
            {activeTab === "notifications" && (
              <div className="space-y-4">
                <div className="border-b border-border/50 pb-4">
                  <h2 className="text-xl font-bold font-serif text-foreground flex items-center gap-2">
                    <Bell className="w-5 h-5 text-accent" /> Recent Notifications
                  </h2>
                  <p className="text-xs text-foreground/80">
                    Activity timeline of your desk bookings, payments, and perks.
                  </p>
                </div>

                <div className="space-y-3 text-xs">
                  {[
                    { title: "Booking Confirmed for Desk W-02", desc: "Arrival today at 02:30 PM", time: "2 hours ago", dot: "bg-emerald-500" },
                    { title: "Payment Successful ₹499", desc: "Razorpay UPI transaction TXN-9001", time: "2 hours ago", dot: "bg-blue-500" },
                    { title: "VIP Membership Renewed", desc: "Status valid until 31 Dec 2026", time: "2 days ago", dot: "bg-amber-500" },
                    { title: "Special Weekend Offer", desc: "Get 20% off on Private Cabins", time: "4 days ago", dot: "bg-purple-500" },
                  ].map((n, idx) => (
                    <div key={idx} className="p-3.5 rounded-2xl bg-background border border-border/50 flex items-start justify-between">
                      <div className="flex items-start gap-2.5">
                        <span className={`w-2.5 h-2.5 rounded-full ${n.dot} mt-1 shrink-0`} />
                        <div>
                          <div className="font-bold text-foreground">{n.title}</div>
                          <div className="text-xs text-foreground/80">{n.desc}</div>
                        </div>
                      </div>
                      <span className="text-xs font-mono text-foreground/80">{n.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 9: ACCOUNT SETTINGS */}
            {activeTab === "settings" && (
              <div className="space-y-6">
                <div className="border-b border-border/50 pb-4">
                  <h2 className="text-xl font-bold font-serif text-foreground flex items-center gap-2">
                    <Settings className="w-5 h-5 text-accent" /> Account &amp; Privacy Settings
                  </h2>
                  <p className="text-xs text-foreground/80">
                    Change password, adjust notification preferences, and manage account security.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="space-y-1.5">
                    <label className="font-bold text-foreground">Current Password</label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      className="w-full p-3 bg-background border border-border/50 rounded-xl text-foreground font-medium"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-foreground">New Password</label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      className="w-full p-3 bg-background border border-border/50 rounded-xl text-foreground font-medium"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => showToast("🔒 Password updated successfully")}
                    className="px-5 py-2.5 rounded-2xl bg-accent text-primary font-bold text-xs"
                  >
                    Update Password
                  </button>
                </div>

                {/* Danger Zone */}
                <div className="pt-6 border-t border-rose-200 space-y-3">
                  <span className="text-xs font-bold text-rose-800 block">Danger Zone</span>
                  <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div>
                      <div className="font-bold text-rose-900">Delete Account</div>
                      <div className="text-xs text-rose-700">Permanently remove your profile &amp; reservation history.</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowDeleteModal(true)}
                      className="px-4 py-2 rounded-xl bg-rose-700 text-primary font-bold hover:bg-rose-800 transition-colors cursor-pointer"
                    >
                      Delete Account
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Booking Details Modal */}
      <AnimatePresence>
        {selectedBookingDetails && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedBookingDetails(null)}
              className="absolute inset-0 bg-background/60 backdrop-blur-xs"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-lg bg-surface rounded-3xl border border-border/50 shadow-2xl p-6 space-y-4 text-xs z-10"
            >
              <div className="flex justify-between items-start border-b border-border/50 pb-3">
                <div>
                  <h3 className="text-lg font-bold font-serif text-foreground">
                    Booking Details ({selectedBookingDetails.id})
                  </h3>
                  <p className="text-xs text-foreground/80">{selectedBookingDetails.cafeName}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedBookingDetails(null)}
                  className="p-2 rounded-xl bg-surface text-foreground hover:bg-accent hover:text-primary"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center gap-4 bg-background p-3 rounded-2xl border border-border/50">
                <img
                  src={selectedBookingDetails.image}
                  alt={selectedBookingDetails.workspaceType}
                  className="w-20 h-20 rounded-2xl object-cover shrink-0"
                />
                <div className="space-y-1">
                  <div className="font-bold text-sm text-foreground">
                    {selectedBookingDetails.workspaceType} (Desk {selectedBookingDetails.deskId})
                  </div>
                  <div className="text-xs text-foreground/80">Date: {selectedBookingDetails.date}</div>
                  <div className="text-xs text-foreground/80">Time: {selectedBookingDetails.time} ({selectedBookingDetails.duration})</div>
                  <div className="text-xs font-mono font-bold text-accent">Total Paid: ₹{selectedBookingDetails.amount}</div>
                </div>
              </div>

              {/* QR Code Demo Section */}
              <div className="p-4 rounded-2xl bg-accent text-primary text-center space-y-2">
                <span className="text-xs font-bold tracking-widest text-amber-300 uppercase block">Check-in Scan QR</span>
                <div className="w-24 h-24 mx-auto bg-surface p-2 rounded-xl flex items-center justify-center text-foreground">
                  <QrCode className="w-full h-full" />
                </div>
                <p className="text-xs text-amber-200/80">Scan this QR code at the RoyalCafe entrance kiosk.</p>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedBookingDetails(null)}
                  className="px-5 py-2.5 rounded-2xl bg-accent text-primary font-bold cursor-pointer"
                >
                  Close Details
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Account Demo Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowDeleteModal(false)}
              className="absolute inset-0 bg-background/60 backdrop-blur-xs"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-md bg-surface rounded-3xl border border-border/50 shadow-2xl p-6 space-y-4 text-xs z-10"
            >
              <h3 className="text-lg font-bold font-serif text-rose-800">
                Confirm Account Deletion
              </h3>
              <p className="text-foreground/80">
                This is a demo action. Clicking confirm will log you out of RoyalCafe Connect.
              </p>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 rounded-xl bg-background text-foreground border border-border/50 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowDeleteModal(false);
                    handleLogout();
                  }}
                  className="px-4 py-2 rounded-xl bg-rose-700 text-primary font-bold"
                >
                  Confirm Delete &amp; Logout
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Customer Footer */}
      <Footer />
    </div>
  );
}
