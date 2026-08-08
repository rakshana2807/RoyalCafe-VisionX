"use client";

import React, { useState } from "react";
import {
  Store,
  User,
  Armchair,
  Calendar,
  CreditCard,
  Wifi,
  Bell,
  ShieldCheck,
  Palette,
  FileSpreadsheet,
  Save,
  RotateCcw,
  Upload,
  QrCode,
  Lock,
  Smartphone,
  Mail,
  MapPin,
  Clock,
  Check,
  CheckCircle2,
  AlertCircle,
  X,
  ChevronRight,
  Download,
  Laptop,
  KeyRound,
  Sparkles,
  Coffee,
  Globe,
  Camera,
  Layers,
  CheckSquare
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export type SettingsTab =
  | "cafe"
  | "profile"
  | "workspace"
  | "booking"
  | "payment"
  | "wifi"
  | "notifications"
  | "security"
  | "appearance"
  | "reports";

const MENU_ITEMS: { id: SettingsTab; label: string; icon: React.ElementType }[] = [
  { id: "cafe", label: "Café Information", icon: Store },
  { id: "profile", label: "Admin Profile", icon: User },
  { id: "workspace", label: "Workspace Settings", icon: Armchair },
  { id: "booking", label: "Booking Settings", icon: Calendar },
  { id: "payment", label: "Payment Settings", icon: CreditCard },
  { id: "wifi", label: "WiFi Settings", icon: Wifi },
  { id: "notifications", label: "Notification Settings", icon: Bell },
  { id: "security", label: "Security & PIN", icon: ShieldCheck },
  { id: "appearance", label: "Appearance", icon: Palette },
  { id: "reports", label: "Data & Reports", icon: FileSpreadsheet },
];

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>("cafe");
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string = "Settings updated successfully") => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  // Section 1: Café Information State
  const [cafeData, setCafeData] = useState({
    name: "RoyalCafe Connect",
    description: "Premium co-working space & artisanal coffee lounge offering high-speed WiFi, private cabins, meeting rooms & handcrafted beverages.",
    phone: "+91 98765 43210",
    email: "contact@royalcafeconnect.com",
    address: "102 Royal Boulevard, MG Road, Cyber City, Bangalore - 560001",
    openHours: "07:30 AM",
    closeHours: "11:00 PM",
    mapsUrl: "https://maps.google.com/?q=RoyalCafe+Connect",
    instagram: "@royalcafe.connect",
    facebook: "/royalcafeconnect",
    website: "https://royalcafeconnect.com",
  });

  // Section 2: Profile State
  const [profileData, setProfileData] = useState({
    fullName: "Vikram Singh",
    email: "admin@royalcafeconnect.com",
    phone: "+91 98123 45678",
    role: "Super Administrator",
    adminId: "ADM-1001",
  });

  // Section 3: Workspace State
  const [workspaceData, setWorkspaceData] = useState({
    totalSeats: 48,
    seatPrefix: "D-",
    maxDurationHours: 8,
    minDurationHours: 1,
    cafeTableEnabled: true,
    workDeskEnabled: true,
    privateCabinEnabled: true,
    meetingRoomEnabled: true,
    studySpaceEnabled: true,
  });

  // Section 4: Booking Settings State
  const [bookingSettings, setBookingSettings] = useState({
    approvalType: "Automatic Confirmation",
    cancellationPolicy: "Full refund if cancelled at least 2 hours prior to arrival time.",
    cancelLimitHours: 2,
    maxAdvanceDays: 30,
    allowWalkIn: true,
    allowSameDay: true,
  });

  // Section 5: Payment Settings State
  const [paymentSettings, setPaymentSettings] = useState({
    upiEnabled: true,
    cardsEnabled: true,
    cashEnabled: true,
    walletsEnabled: true,
    currency: "INR (₹)",
    taxPercentage: 5,
    gstin: "29ABCDE1234F1Z5",
    onlinePaymentActive: true,
    sendInvoiceEmail: true,
  });

  // Section 6: WiFi Settings State
  const [wifiSettings, setWifiSettings] = useState({
    ssid: "RoyalCafe_Guest_5G",
    password: "RoyalCoffee2026!",
    freeDurationMins: 60,
    premiumDurationHours: 24,
    dataLimitGB: "2 GB",
    autoDisconnect: true,
    maxDevices: 100,
  });

  // Section 7: Notification Toggles State
  const [notifications, setNotifications] = useState({
    newBooking: true,
    paymentReceived: true,
    cancellation: true,
    lowSeatAvailability: true,
    wifiExpiry: true,
    membershipExpiry: true,
    emailAlerts: true,
    pushAlerts: true,
  });

  // Section 8: Security State
  const [securityData, setSecurityData] = useState({
    currentPassword: "",
    newPassword: "",
    pin: "4321",
    enable2FA: true,
  });

  // Section 9: Appearance State
  const [appearance, setAppearance] = useState({
    theme: "light",
    density: "comfortable",
    accentColor: "Coffee Gold",
    language: "English (US)",
  });

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
      <div>
        <div className="flex items-center gap-2.5">
          <Store className="w-7 h-7 text-[#8C4A21]" />
          <h1 className="text-2xl sm:text-3xl font-black font-serif text-[#3D2314] tracking-tight">
            Settings &amp; Configuration Center
          </h1>
        </div>
        <p className="text-xs text-[#7A5A43] mt-1">
          Manage your café profile, workspace capacity, booking rules, payment gateway, WiFi credentials, and security settings.
        </p>
      </div>

      {/* Main Two-Column Layout */}
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        {/* LEFT SETTINGS SIDEBAR MENU */}
        <div className="w-full lg:w-64 bg-[#FFFDF9] rounded-3xl p-3 border border-[#E5D5C5] shadow-sm shrink-0 space-y-1">
          <div className="px-3 py-2 text-[10px] font-extrabold uppercase tracking-widest text-[#7A5A43]">
            Settings Navigation
          </div>
          {MENU_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                  isActive
                    ? "bg-[#3D2314] text-white shadow-md scale-[1.01]"
                    : "text-[#5C3A21] hover:bg-[#F8F1EA] hover:text-[#3D2314]"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-amber-300" : "text-[#8C4A21]"}`} />
                  <span>{item.label}</span>
                </div>
                <ChevronRight className={`w-3.5 h-3.5 transition-transform ${isActive ? "text-amber-300 translate-x-0.5" : "text-[#7A5A43]/40"}`} />
              </button>
            );
          })}
        </div>

        {/* RIGHT SETTINGS CONTENT AREA */}
        <div className="flex-1 w-full bg-[#FFFDF9] rounded-3xl p-6 sm:p-8 border border-[#E5D5C5] shadow-sm space-y-6">
          {/* SECTION 1: CAFÉ INFORMATION */}
          {activeTab === "cafe" && (
            <div className="space-y-6">
              <div className="border-b border-[#E5D5C5] pb-4">
                <h2 className="text-xl font-bold font-serif text-[#3D2314] flex items-center gap-2">
                  <Store className="w-5 h-5 text-[#8C4A21]" /> Café Information
                </h2>
                <p className="text-xs text-[#7A5A43]">
                  Update public café branding, contact details, business hours, and social media links.
                </p>
              </div>

              {/* Logo & Cover Image Upload Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-[#FAF4ED] p-4 rounded-2xl border border-[#DFCDBE] space-y-3">
                  <span className="text-xs font-bold text-[#3D2314] block">Café Logo</span>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-[#8C4A21] text-amber-200 flex items-center justify-center font-serif font-black text-xl shadow-xs shrink-0">
                      RC
                    </div>
                    <button
                      type="button"
                      onClick={() => showToast("📸 Logo updated successfully")}
                      className="px-3.5 py-2 rounded-xl bg-[#FFFDF9] hover:bg-[#3D2314] hover:text-white border border-[#E5D5C5] text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      <Camera className="w-3.5 h-3.5" /> Upload Logo
                    </button>
                  </div>
                </div>

                <div className="bg-[#FAF4ED] p-4 rounded-2xl border border-[#DFCDBE] space-y-3">
                  <span className="text-xs font-bold text-[#3D2314] block">Cover Header Banner</span>
                  <div className="flex items-center gap-4">
                    <div className="h-16 flex-1 rounded-2xl bg-gradient-to-r from-[#8C4A21] to-[#3D2314] flex items-center justify-center text-amber-200 text-xs font-bold shadow-xs">
                      RoyalCafe Interior Banner
                    </div>
                    <button
                      type="button"
                      onClick={() => showToast("🖼 Cover banner updated")}
                      className="px-3.5 py-2 rounded-xl bg-[#FFFDF9] hover:bg-[#3D2314] hover:text-white border border-[#E5D5C5] text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      <Upload className="w-3.5 h-3.5" /> Upload Cover
                    </button>
                  </div>
                </div>
              </div>

              {/* Form Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1.5">
                  <label className="font-bold text-[#3D2314]">Café Name</label>
                  <input
                    type="text"
                    value={cafeData.name}
                    onChange={(e) => setCafeData({ ...cafeData, name: e.target.value })}
                    className="w-full p-3 bg-[#FAF4ED] border border-[#DFCDBE] rounded-xl text-[#3D2314] font-medium"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-[#3D2314]">Contact Phone</label>
                  <input
                    type="text"
                    value={cafeData.phone}
                    onChange={(e) => setCafeData({ ...cafeData, phone: e.target.value })}
                    className="w-full p-3 bg-[#FAF4ED] border border-[#DFCDBE] rounded-xl text-[#3D2314] font-medium"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-[#3D2314]">Official Email</label>
                  <input
                    type="email"
                    value={cafeData.email}
                    onChange={(e) => setCafeData({ ...cafeData, email: e.target.value })}
                    className="w-full p-3 bg-[#FAF4ED] border border-[#DFCDBE] rounded-xl text-[#3D2314] font-medium"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-[#3D2314]">Opening &amp; Closing Hours</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={cafeData.openHours}
                      onChange={(e) => setCafeData({ ...cafeData, openHours: e.target.value })}
                      className="w-1/2 p-3 bg-[#FAF4ED] border border-[#DFCDBE] rounded-xl text-[#3D2314] font-medium"
                    />
                    <input
                      type="text"
                      value={cafeData.closeHours}
                      onChange={(e) => setCafeData({ ...cafeData, closeHours: e.target.value })}
                      className="w-1/2 p-3 bg-[#FAF4ED] border border-[#DFCDBE] rounded-xl text-[#3D2314] font-medium"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2 space-y-1.5">
                  <label className="font-bold text-[#3D2314]">Café Address &amp; Location</label>
                  <input
                    type="text"
                    value={cafeData.address}
                    onChange={(e) => setCafeData({ ...cafeData, address: e.target.value })}
                    className="w-full p-3 bg-[#FAF4ED] border border-[#DFCDBE] rounded-xl text-[#3D2314] font-medium"
                  />
                </div>

                <div className="sm:col-span-2 space-y-1.5">
                  <label className="font-bold text-[#3D2314]">Café Description</label>
                  <textarea
                    rows={3}
                    value={cafeData.description}
                    onChange={(e) => setCafeData({ ...cafeData, description: e.target.value })}
                    className="w-full p-3 bg-[#FAF4ED] border border-[#DFCDBE] rounded-xl text-[#3D2314] font-medium"
                  />
                </div>
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-[#E5D5C5]">
                <button
                  type="button"
                  onClick={() => showToast("Settings reset to defaults")}
                  className="px-5 py-2.5 rounded-2xl bg-[#FAF4ED] text-[#3D2314] font-bold border border-[#E5D5C5] text-xs hover:bg-[#3D2314] hover:text-white transition-all cursor-pointer"
                >
                  Reset
                </button>
                <button
                  type="button"
                  onClick={() => showToast("Café Information updated successfully")}
                  className="px-6 py-2.5 rounded-2xl bg-[#8C4A21] hover:bg-[#3D2314] text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Save className="w-4 h-4" /> Save Changes
                </button>
              </div>
            </div>
          )}

          {/* SECTION 2: ADMIN PROFILE */}
          {activeTab === "profile" && (
            <div className="space-y-6">
              <div className="border-b border-[#E5D5C5] pb-4">
                <h2 className="text-xl font-bold font-serif text-[#3D2314] flex items-center gap-2">
                  <User className="w-5 h-5 text-[#8C4A21]" /> Admin Profile
                </h2>
                <p className="text-xs text-[#7A5A43]">
                  Manage your administrator account credentials, avatar, and system privileges.
                </p>
              </div>

              <div className="flex items-center gap-5 bg-[#FAF4ED] p-5 rounded-2xl border border-[#DFCDBE]">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-[#3D2314] to-[#8C4A21] text-amber-200 flex items-center justify-center font-bold text-2xl shadow-md ring-4 ring-[#8C4A21]/20 shrink-0">
                  VS
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-[#3D2314]">{profileData.fullName}</h3>
                  <p className="text-xs font-mono font-bold text-[#8C4A21]">{profileData.role} ({profileData.adminId})</p>
                  <button
                    type="button"
                    onClick={() => showToast("Profile avatar updated")}
                    className="px-3.5 py-1.5 rounded-xl bg-[#FFFDF9] border border-[#E5D5C5] text-xs font-bold hover:bg-[#3D2314] hover:text-white transition-all cursor-pointer mt-1"
                  >
                    Change Profile Image
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1.5">
                  <label className="font-bold text-[#3D2314]">Full Name</label>
                  <input
                    type="text"
                    value={profileData.fullName}
                    onChange={(e) => setProfileData({ ...profileData, fullName: e.target.value })}
                    className="w-full p-3 bg-[#FAF4ED] border border-[#DFCDBE] rounded-xl text-[#3D2314] font-medium"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-[#3D2314]">Admin Email</label>
                  <input
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                    className="w-full p-3 bg-[#FAF4ED] border border-[#DFCDBE] rounded-xl text-[#3D2314] font-medium"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-[#3D2314]">Phone Number</label>
                  <input
                    type="text"
                    value={profileData.phone}
                    onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                    className="w-full p-3 bg-[#FAF4ED] border border-[#DFCDBE] rounded-xl text-[#3D2314] font-medium"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-[#3D2314]">Admin ID</label>
                  <input
                    type="text"
                    disabled
                    value={profileData.adminId}
                    className="w-full p-3 bg-[#E5D5C5]/40 border border-[#DFCDBE] rounded-xl text-[#7A5A43] font-mono font-bold cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-[#E5D5C5]">
                <button
                  type="button"
                  onClick={() => showToast("Admin Profile updated successfully")}
                  className="px-6 py-2.5 rounded-2xl bg-[#8C4A21] hover:bg-[#3D2314] text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Save className="w-4 h-4" /> Update Profile
                </button>
              </div>
            </div>
          )}

          {/* SECTION 3: WORKSPACE SETTINGS */}
          {activeTab === "workspace" && (
            <div className="space-y-6">
              <div className="border-b border-[#E5D5C5] pb-4">
                <h2 className="text-xl font-bold font-serif text-[#3D2314] flex items-center gap-2">
                  <Armchair className="w-5 h-5 text-[#8C4A21]" /> Workspace Settings
                </h2>
                <p className="text-xs text-[#7A5A43]">
                  Configure desk seating areas, workspace types, prefixes, and booking durations.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1.5">
                  <label className="font-bold text-[#3D2314]">Total Seats Capacity</label>
                  <input
                    type="number"
                    value={workspaceData.totalSeats}
                    onChange={(e) => setWorkspaceData({ ...workspaceData, totalSeats: Number(e.target.value) })}
                    className="w-full p-3 bg-[#FAF4ED] border border-[#DFCDBE] rounded-xl text-[#3D2314] font-medium font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-[#3D2314]">Seat Number Prefix</label>
                  <input
                    type="text"
                    value={workspaceData.seatPrefix}
                    onChange={(e) => setWorkspaceData({ ...workspaceData, seatPrefix: e.target.value })}
                    className="w-full p-3 bg-[#FAF4ED] border border-[#DFCDBE] rounded-xl text-[#3D2314] font-medium font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-[#3D2314]">Minimum Booking Duration (Hours)</label>
                  <input
                    type="number"
                    value={workspaceData.minDurationHours}
                    onChange={(e) => setWorkspaceData({ ...workspaceData, minDurationHours: Number(e.target.value) })}
                    className="w-full p-3 bg-[#FAF4ED] border border-[#DFCDBE] rounded-xl text-[#3D2314] font-medium font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-[#3D2314]">Maximum Booking Duration (Hours)</label>
                  <input
                    type="number"
                    value={workspaceData.maxDurationHours}
                    onChange={(e) => setWorkspaceData({ ...workspaceData, maxDurationHours: Number(e.target.value) })}
                    className="w-full p-3 bg-[#FAF4ED] border border-[#DFCDBE] rounded-xl text-[#3D2314] font-medium font-mono"
                  />
                </div>
              </div>

              {/* Workspace Types Enable Toggles */}
              <div className="space-y-3 pt-2">
                <span className="text-xs font-bold text-[#3D2314] block">Available Workspace Types</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {[
                    { key: "cafeTableEnabled", label: "☕ Café Table", fee: "₹150 / hr" },
                    { key: "workDeskEnabled", label: "💼 Work Desk / Workstation", fee: "₹250 / hr" },
                    { key: "privateCabinEnabled", label: "🏢 Private Cabin", fee: "₹600 / hr" },
                    { key: "meetingRoomEnabled", label: "👥 Meeting Room", fee: "₹950 / hr" },
                    { key: "studySpaceEnabled", label: "📚 Study Space", fee: "₹200 / hr" },
                  ].map((ws) => (
                    <div key={ws.key} className="p-3.5 rounded-2xl bg-[#FAF4ED] border border-[#DFCDBE] flex items-center justify-between">
                      <div>
                        <div className="font-bold text-[#3D2314]">{ws.label}</div>
                        <div className="text-[11px] text-[#7A5A43]">{ws.fee}</div>
                      </div>
                      <input
                        type="checkbox"
                        checked={(workspaceData as any)[ws.key]}
                        onChange={(e) => setWorkspaceData({ ...workspaceData, [ws.key]: e.target.checked })}
                        className="w-4 h-4 accent-[#8C4A21] cursor-pointer"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-[#E5D5C5]">
                <button
                  type="button"
                  onClick={() => showToast("Workspace settings updated successfully")}
                  className="px-6 py-2.5 rounded-2xl bg-[#8C4A21] hover:bg-[#3D2314] text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Save className="w-4 h-4" /> Save Workspace Settings
                </button>
              </div>
            </div>
          )}

          {/* SECTION 4: BOOKING SETTINGS */}
          {activeTab === "booking" && (
            <div className="space-y-6">
              <div className="border-b border-[#E5D5C5] pb-4">
                <h2 className="text-xl font-bold font-serif text-[#3D2314] flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-[#8C4A21]" /> Booking Settings
                </h2>
                <p className="text-xs text-[#7A5A43]">
                  Manage booking approval workflows, cancellation limits, and advance booking rules.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="font-bold text-[#3D2314]">Booking Approval Mode</label>
                  <select
                    value={bookingSettings.approvalType}
                    onChange={(e) => setBookingSettings({ ...bookingSettings, approvalType: e.target.value })}
                    className="w-full p-3 bg-[#FAF4ED] border border-[#DFCDBE] rounded-xl text-[#3D2314] font-medium"
                  >
                    <option value="Automatic Confirmation">Automatic Instant Confirmation</option>
                    <option value="Manual Approval">Manual Admin Approval Required</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-[#3D2314]">Cancellation Time Limit (Hours)</label>
                  <input
                    type="number"
                    value={bookingSettings.cancelLimitHours}
                    onChange={(e) => setBookingSettings({ ...bookingSettings, cancelLimitHours: Number(e.target.value) })}
                    className="w-full p-3 bg-[#FAF4ED] border border-[#DFCDBE] rounded-xl text-[#3D2314] font-medium font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-[#3D2314]">Maximum Advance Booking Days</label>
                  <input
                    type="number"
                    value={bookingSettings.maxAdvanceDays}
                    onChange={(e) => setBookingSettings({ ...bookingSettings, maxAdvanceDays: Number(e.target.value) })}
                    className="w-full p-3 bg-[#FAF4ED] border border-[#DFCDBE] rounded-xl text-[#3D2314] font-medium font-mono"
                  />
                </div>

                <div className="sm:col-span-2 space-y-1.5">
                  <label className="font-bold text-[#3D2314]">Cancellation Policy Text</label>
                  <textarea
                    rows={2}
                    value={bookingSettings.cancellationPolicy}
                    onChange={(e) => setBookingSettings({ ...bookingSettings, cancellationPolicy: e.target.value })}
                    className="w-full p-3 bg-[#FAF4ED] border border-[#DFCDBE] rounded-xl text-[#3D2314] font-medium"
                  />
                </div>

                <div className="p-3.5 rounded-2xl bg-[#FAF4ED] border border-[#DFCDBE] flex items-center justify-between">
                  <span className="font-bold text-[#3D2314]">Allow Walk-in Bookings</span>
                  <input
                    type="checkbox"
                    checked={bookingSettings.allowWalkIn}
                    onChange={(e) => setBookingSettings({ ...bookingSettings, allowWalkIn: e.target.checked })}
                    className="w-4 h-4 accent-[#8C4A21] cursor-pointer"
                  />
                </div>

                <div className="p-3.5 rounded-2xl bg-[#FAF4ED] border border-[#DFCDBE] flex items-center justify-between">
                  <span className="font-bold text-[#3D2314]">Allow Same Day Bookings</span>
                  <input
                    type="checkbox"
                    checked={bookingSettings.allowSameDay}
                    onChange={(e) => setBookingSettings({ ...bookingSettings, allowSameDay: e.target.checked })}
                    className="w-4 h-4 accent-[#8C4A21] cursor-pointer"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-[#E5D5C5]">
                <button
                  type="button"
                  onClick={() => showToast("Booking settings saved successfully")}
                  className="px-6 py-2.5 rounded-2xl bg-[#8C4A21] hover:bg-[#3D2314] text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Save className="w-4 h-4" /> Save Booking Rules
                </button>
              </div>
            </div>
          )}

          {/* SECTION 5: PAYMENT SETTINGS */}
          {activeTab === "payment" && (
            <div className="space-y-6">
              <div className="border-b border-[#E5D5C5] pb-4">
                <h2 className="text-xl font-bold font-serif text-[#3D2314] flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-[#8C4A21]" /> Payment Settings
                </h2>
                <p className="text-xs text-[#7A5A43]">
                  Configure active payment gateways, tax percentages, currency, and invoice details.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1.5">
                  <label className="font-bold text-[#3D2314]">System Currency</label>
                  <input
                    type="text"
                    value={paymentSettings.currency}
                    onChange={(e) => setPaymentSettings({ ...paymentSettings, currency: e.target.value })}
                    className="w-full p-3 bg-[#FAF4ED] border border-[#DFCDBE] rounded-xl text-[#3D2314] font-medium"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-[#3D2314]">Tax Percentage (GST %)</label>
                  <input
                    type="number"
                    value={paymentSettings.taxPercentage}
                    onChange={(e) => setPaymentSettings({ ...paymentSettings, taxPercentage: Number(e.target.value) })}
                    className="w-full p-3 bg-[#FAF4ED] border border-[#DFCDBE] rounded-xl text-[#3D2314] font-medium font-mono"
                  />
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <label className="font-bold text-[#3D2314]">GSTIN Invoice Header Number</label>
                  <input
                    type="text"
                    value={paymentSettings.gstin}
                    onChange={(e) => setPaymentSettings({ ...paymentSettings, gstin: e.target.value })}
                    className="w-full p-3 bg-[#FAF4ED] border border-[#DFCDBE] rounded-xl text-[#3D2314] font-medium font-mono"
                  />
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <span className="text-xs font-bold text-[#3D2314] block">Accepted Payment Gateways</span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  {[
                    { key: "upiEnabled", label: "📱 UPI (GPay/Paytm)" },
                    { key: "cardsEnabled", label: "💳 Credit / Debit Cards" },
                    { key: "cashEnabled", label: "💵 Cash POS" },
                    { key: "walletsEnabled", label: "👛 Digital Wallets" },
                  ].map((pm) => (
                    <div key={pm.key} className="p-3.5 rounded-2xl bg-[#FAF4ED] border border-[#DFCDBE] flex items-center justify-between">
                      <span className="font-bold text-[#3D2314]">{pm.label}</span>
                      <input
                        type="checkbox"
                        checked={(paymentSettings as any)[pm.key]}
                        onChange={(e) => setPaymentSettings({ ...paymentSettings, [pm.key]: e.target.checked })}
                        className="w-4 h-4 accent-[#8C4A21] cursor-pointer"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-[#E5D5C5]">
                <button
                  type="button"
                  onClick={() => showToast("Payment settings updated successfully")}
                  className="px-6 py-2.5 rounded-2xl bg-[#8C4A21] hover:bg-[#3D2314] text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Save className="w-4 h-4" /> Save Payment Configuration
                </button>
              </div>
            </div>
          )}

          {/* SECTION 6: WIFI SETTINGS */}
          {activeTab === "wifi" && (
            <div className="space-y-6">
              <div className="border-b border-[#E5D5C5] pb-4">
                <h2 className="text-xl font-bold font-serif text-[#3D2314] flex items-center gap-2">
                  <Wifi className="w-5 h-5 text-[#8C4A21]" /> WiFi Settings
                </h2>
                <p className="text-xs text-[#7A5A43]">
                  Configure customer WiFi SSID, pass durations, quotas, and generate connection QR codes.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1.5">
                  <label className="font-bold text-[#3D2314]">WiFi Network Name (SSID)</label>
                  <input
                    type="text"
                    value={wifiSettings.ssid}
                    onChange={(e) => setWifiSettings({ ...wifiSettings, ssid: e.target.value })}
                    className="w-full p-3 bg-[#FAF4ED] border border-[#DFCDBE] rounded-xl text-[#3D2314] font-medium font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-[#3D2314]">Network WPA2 Password</label>
                  <input
                    type="text"
                    value={wifiSettings.password}
                    onChange={(e) => setWifiSettings({ ...wifiSettings, password: e.target.value })}
                    className="w-full p-3 bg-[#FAF4ED] border border-[#DFCDBE] rounded-xl text-[#3D2314] font-medium font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-[#3D2314]">Free Tier Duration (Minutes)</label>
                  <input
                    type="number"
                    value={wifiSettings.freeDurationMins}
                    onChange={(e) => setWifiSettings({ ...wifiSettings, freeDurationMins: Number(e.target.value) })}
                    className="w-full p-3 bg-[#FAF4ED] border border-[#DFCDBE] rounded-xl text-[#3D2314] font-medium font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-[#3D2314]">Maximum Connected Devices</label>
                  <input
                    type="number"
                    value={wifiSettings.maxDevices}
                    onChange={(e) => setWifiSettings({ ...wifiSettings, maxDevices: Number(e.target.value) })}
                    className="w-full p-3 bg-[#FAF4ED] border border-[#DFCDBE] rounded-xl text-[#3D2314] font-medium font-mono"
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => showToast("📶 WiFi QR Code generated for printing")}
                  className="px-4 py-2 rounded-xl bg-[#FAF4ED] hover:bg-[#3D2314] hover:text-white border border-[#E5D5C5] text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <QrCode className="w-4 h-4" /> Generate WiFi QR Code
                </button>
                <button
                  type="button"
                  onClick={() => showToast("🔑 Password reset & updated on router")}
                  className="px-4 py-2 rounded-xl bg-[#FAF4ED] hover:bg-[#3D2314] hover:text-white border border-[#E5D5C5] text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <KeyRound className="w-4 h-4" /> Reset Password
                </button>
              </div>

              <div className="flex justify-end pt-4 border-t border-[#E5D5C5]">
                <button
                  type="button"
                  onClick={() => showToast("WiFi settings saved successfully")}
                  className="px-6 py-2.5 rounded-2xl bg-[#8C4A21] hover:bg-[#3D2314] text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Save className="w-4 h-4" /> Save WiFi Settings
                </button>
              </div>
            </div>
          )}

          {/* SECTION 7: NOTIFICATION SETTINGS */}
          {activeTab === "notifications" && (
            <div className="space-y-6">
              <div className="border-b border-[#E5D5C5] pb-4">
                <h2 className="text-xl font-bold font-serif text-[#3D2314] flex items-center gap-2">
                  <Bell className="w-5 h-5 text-[#8C4A21]" /> Notification Settings
                </h2>
                <p className="text-xs text-[#7A5A43]">
                  Enable or disable real-time email, push, and dashboard alerts.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                {[
                  { key: "newBooking", label: "📅 New Booking Alert", desc: "Notify when a new reservation is placed" },
                  { key: "paymentReceived", label: "💳 Payment Received Alert", desc: "Notify upon successful gateway payment" },
                  { key: "cancellation", label: "❌ Cancellation Alert", desc: "Notify if a customer cancels booking" },
                  { key: "lowSeatAvailability", label: "🪑 Low Seat Availability Alert", desc: "Notify when capacity exceeds 85%" },
                  { key: "wifiExpiry", label: "📶 WiFi Expiry Alert", desc: "Alert when guest session expires" },
                  { key: "membershipExpiry", label: "👑 Membership Expiry Alert", desc: "Alert 3 days prior to VIP pass expiry" },
                  { key: "emailAlerts", label: "📧 Email Notifications", desc: "Send summary emails to admin address" },
                  { key: "pushAlerts", label: "🔔 Push Notifications", desc: "Send browser desktop push alerts" },
                ].map((n) => (
                  <div key={n.key} className="p-4 rounded-2xl bg-[#FAF4ED] border border-[#DFCDBE] flex items-center justify-between gap-3">
                    <div>
                      <div className="font-bold text-[#3D2314]">{n.label}</div>
                      <div className="text-[11px] text-[#7A5A43] mt-0.5">{n.desc}</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={(notifications as any)[n.key]}
                      onChange={(e) => setNotifications({ ...notifications, [n.key]: e.target.checked })}
                      className="w-4 h-4 accent-[#8C4A21] cursor-pointer shrink-0"
                    />
                  </div>
                ))}
              </div>

              <div className="flex justify-end pt-4 border-t border-[#E5D5C5]">
                <button
                  type="button"
                  onClick={() => showToast("Notification preferences updated")}
                  className="px-6 py-2.5 rounded-2xl bg-[#8C4A21] hover:bg-[#3D2314] text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Save className="w-4 h-4" /> Save Notifications
                </button>
              </div>
            </div>
          )}

          {/* SECTION 8: SECURITY & PIN */}
          {activeTab === "security" && (
            <div className="space-y-6">
              <div className="border-b border-[#E5D5C5] pb-4">
                <h2 className="text-xl font-bold font-serif text-[#3D2314] flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-[#8C4A21]" /> Security &amp; PIN
                </h2>
                <p className="text-xs text-[#7A5A43]">
                  Change admin password, update security PIN, manage active sessions, and review security logs.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1.5">
                  <label className="font-bold text-[#3D2314]">Current Password</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={securityData.currentPassword}
                    onChange={(e) => setSecurityData({ ...securityData, currentPassword: e.target.value })}
                    className="w-full p-3 bg-[#FAF4ED] border border-[#DFCDBE] rounded-xl text-[#3D2314] font-medium"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-[#3D2314]">New Password</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={securityData.newPassword}
                    onChange={(e) => setSecurityData({ ...securityData, newPassword: e.target.value })}
                    className="w-full p-3 bg-[#FAF4ED] border border-[#DFCDBE] rounded-xl text-[#3D2314] font-medium"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-[#3D2314]">4-Digit Admin Quick PIN</label>
                  <input
                    type="text"
                    maxLength={4}
                    value={securityData.pin}
                    onChange={(e) => setSecurityData({ ...securityData, pin: e.target.value })}
                    className="w-full p-3 bg-[#FAF4ED] border border-[#DFCDBE] rounded-xl text-[#3D2314] font-medium font-mono tracking-widest text-center"
                  />
                </div>

                <div className="p-3.5 rounded-2xl bg-[#FAF4ED] border border-[#DFCDBE] flex items-center justify-between">
                  <div>
                    <span className="font-bold text-[#3D2314] block">Two-Factor Auth (2FA)</span>
                    <span className="text-[10px] text-[#7A5A43]">Require OTP code on login</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={securityData.enable2FA}
                    onChange={(e) => setSecurityData({ ...securityData, enable2FA: e.target.checked })}
                    className="w-4 h-4 accent-[#8C4A21] cursor-pointer"
                  />
                </div>
              </div>

              {/* Active Sessions */}
              <div className="bg-[#FAF4ED] p-4 rounded-2xl border border-[#DFCDBE] space-y-2 text-xs">
                <div className="flex justify-between items-center font-bold text-[#3D2314]">
                  <span>Active Device Sessions</span>
                  <button
                    type="button"
                    onClick={() => showToast("Logged out from all other devices")}
                    className="text-rose-700 hover:underline text-[11px]"
                  >
                    Logout From All Devices
                  </button>
                </div>
                <div className="divide-y divide-[#DFCDBE]/60 text-[11px]">
                  <div className="py-2 flex justify-between">
                    <span>💻 Chrome on macOS • Bangalore, India (Current)</span>
                    <span className="text-emerald-700 font-bold">Active Now</span>
                  </div>
                  <div className="py-2 flex justify-between text-[#7A5A43]">
                    <span>📱 iPhone 15 Pro • Mobile App Session</span>
                    <span>2 hours ago</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-[#E5D5C5]">
                <button
                  type="button"
                  onClick={() => showToast("Security settings updated successfully")}
                  className="px-6 py-2.5 rounded-2xl bg-[#8C4A21] hover:bg-[#3D2314] text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Save className="w-4 h-4" /> Save Security Rules
                </button>
              </div>
            </div>
          )}

          {/* SECTION 9: APPEARANCE */}
          {activeTab === "appearance" && (
            <div className="space-y-6">
              <div className="border-b border-[#E5D5C5] pb-4">
                <h2 className="text-xl font-bold font-serif text-[#3D2314] flex items-center gap-2">
                  <Palette className="w-5 h-5 text-[#8C4A21]" /> Appearance
                </h2>
                <p className="text-xs text-[#7A5A43]">
                  Customize your dashboard theme, layout density, accent colors, and display language.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1.5">
                  <label className="font-bold text-[#3D2314]">Dashboard Theme</label>
                  <select
                    value={appearance.theme}
                    onChange={(e) => setAppearance({ ...appearance, theme: e.target.value })}
                    className="w-full p-3 bg-[#FAF4ED] border border-[#DFCDBE] rounded-xl text-[#3D2314] font-medium"
                  >
                    <option value="light">Light Cream (Default)</option>
                    <option value="dark">Dark Espresso</option>
                    <option value="system">System Preference</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-[#3D2314]">Layout Density</label>
                  <select
                    value={appearance.density}
                    onChange={(e) => setAppearance({ ...appearance, density: e.target.value })}
                    className="w-full p-3 bg-[#FAF4ED] border border-[#DFCDBE] rounded-xl text-[#3D2314] font-medium"
                  >
                    <option value="comfortable">Comfortable (Default)</option>
                    <option value="compact">Compact Data Density</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-[#3D2314]">Accent Color Theme</label>
                  <select
                    value={appearance.accentColor}
                    onChange={(e) => setAppearance({ ...appearance, accentColor: e.target.value })}
                    className="w-full p-3 bg-[#FAF4ED] border border-[#DFCDBE] rounded-xl text-[#3D2314] font-medium"
                  >
                    <option value="Coffee Gold">Coffee Gold (Royal)</option>
                    <option value="Warm Amber">Warm Amber</option>
                    <option value="Royal Espresso">Royal Espresso</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-[#3D2314]">Display Language</label>
                  <select
                    value={appearance.language}
                    onChange={(e) => setAppearance({ ...appearance, language: e.target.value })}
                    className="w-full p-3 bg-[#FAF4ED] border border-[#DFCDBE] rounded-xl text-[#3D2314] font-medium"
                  >
                    <option value="English (US)">English (US)</option>
                    <option value="Hindi">Hindi (हिंदी)</option>
                    <option value="Spanish">Spanish (Español)</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-[#E5D5C5]">
                <button
                  type="button"
                  onClick={() => showToast("Appearance settings updated")}
                  className="px-6 py-2.5 rounded-2xl bg-[#8C4A21] hover:bg-[#3D2314] text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Save className="w-4 h-4" /> Apply Theme
                </button>
              </div>
            </div>
          )}

          {/* SECTION 10: DATA & REPORTS */}
          {activeTab === "reports" && (
            <div className="space-y-6">
              <div className="border-b border-[#E5D5C5] pb-4">
                <h2 className="text-xl font-bold font-serif text-[#3D2314] flex items-center gap-2">
                  <FileSpreadsheet className="w-5 h-5 text-[#8C4A21]" /> Data &amp; Reports
                </h2>
                <p className="text-xs text-[#7A5A43]">
                  Export system records, download audit logs, and trigger full database backups.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-2xl bg-[#FAF4ED] border border-[#DFCDBE] space-y-2">
                  <div className="font-bold text-[#3D2314] flex items-center gap-2">
                    <User className="w-4 h-4 text-[#8C4A21]" /> Customer Data Export
                  </div>
                  <p className="text-[11px] text-[#7A5A43]">Export verified customer list, contact details &amp; membership info.</p>
                  <button
                    type="button"
                    onClick={() => showToast("📥 Exporting Customers CSV...")}
                    className="w-full py-2.5 rounded-xl bg-[#FFFDF9] hover:bg-[#3D2314] hover:text-white border border-[#E5D5C5] font-bold text-xs transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5" /> Export Customers CSV
                  </button>
                </div>

                <div className="p-4 rounded-2xl bg-[#FAF4ED] border border-[#DFCDBE] space-y-2">
                  <div className="font-bold text-[#3D2314] flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-[#8C4A21]" /> Reservations History Export
                  </div>
                  <p className="text-[11px] text-[#7A5A43]">Export complete desk booking logs, check-ins, and durations.</p>
                  <button
                    type="button"
                    onClick={() => showToast("📥 Exporting Bookings CSV...")}
                    className="w-full py-2.5 rounded-xl bg-[#FFFDF9] hover:bg-[#3D2314] hover:text-white border border-[#E5D5C5] font-bold text-xs transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5" /> Export Bookings CSV
                  </button>
                </div>

                <div className="p-4 rounded-2xl bg-[#FAF4ED] border border-[#DFCDBE] space-y-2">
                  <div className="font-bold text-[#3D2314] flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-[#8C4A21]" /> Payment &amp; Revenue Reports
                  </div>
                  <p className="text-[11px] text-[#7A5A43]">Export transaction ledger, GST tax summaries, and refunds.</p>
                  <button
                    type="button"
                    onClick={() => showToast("📥 Exporting Financial Ledger...")}
                    className="w-full py-2.5 rounded-xl bg-[#FFFDF9] hover:bg-[#3D2314] hover:text-white border border-[#E5D5C5] font-bold text-xs transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5" /> Export Financial Ledger
                  </button>
                </div>

                <div className="p-4 rounded-2xl bg-[#FAF4ED] border border-[#DFCDBE] space-y-2">
                  <div className="font-bold text-[#3D2314] flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-[#8C4A21]" /> System Audit &amp; Backup
                  </div>
                  <p className="text-[11px] text-[#7A5A43]">Generate full JSON system backup &amp; download security logs.</p>
                  <button
                    type="button"
                    onClick={() => showToast("📦 System Backup JSON generated")}
                    className="w-full py-2.5 rounded-xl bg-[#8C4A21] hover:bg-[#3D2314] text-white font-bold text-xs transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5" /> Download Full System Backup
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
