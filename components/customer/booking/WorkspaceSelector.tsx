"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { isAuthenticated } from "@/lib/auth";
import {
  User,
  Phone,
  Mail,
  Calendar,
  Coffee,
  Users,
  PartyPopper,
  MessageSquare,
  Sparkles,
  CheckCircle2,
  ShieldCheck,
  Plus,
  Minus,
  Timer,
  Armchair,
  ArrowRight,
  Clock,
  X,
  Check,
  AlertCircle
} from "lucide-react";
import { useBooking } from "@/context/BookingContext";
import BookingSummary from "./BookingSummary";
import SearchableTableDropdown from "./SearchableTableDropdown";
import NativeTimePicker from "./NativeTimePicker";

// Helper to calculate end checkout time automatically
function calculateEndTime(startTimeStr: string, durationStr: string): string {
  try {
    const match = startTimeStr.match(/(\d+):(\d+)\s*(AM|PM)/i);
    if (!match) return startTimeStr;
    let hrs = parseInt(match[1], 10);
    const mins = parseInt(match[2], 10);
    const period = match[3].toUpperCase();

    if (period === "PM" && hrs < 12) hrs += 12;
    if (period === "AM" && hrs === 12) hrs = 0;

    let addHrs = 0;
    let addMins = 0;

    if (durationStr.includes("Half Day")) {
      addHrs = 4;
    } else {
      const hMatch = durationStr.match(/(\d+)\s*Hour/i);
      const mMatch = durationStr.match(/(\d+)\s*Min/i);
      if (hMatch) addHrs = parseInt(hMatch[1], 10);
      if (mMatch) addMins = parseInt(mMatch[1], 10);
    }

    if (addHrs === 0 && addMins === 0) addHrs = 1;

    let totalMins = hrs * 60 + mins + addHrs * 60 + addMins;
    let endHrs = Math.floor(totalMins / 60) % 24;
    let endMins = totalMins % 60;

    const endPeriod = endHrs >= 12 ? "PM" : "AM";
    let displayHrs = endHrs % 12 || 12;

    const pad = (n: number) => String(n).padStart(2, "0");
    return `${pad(displayHrs)}:${pad(endMins)} ${endPeriod}`;
  } catch {
    return "11:00 AM";
  }
}

export default function WorkspaceSelector() {
  const router = useRouter();
  const {
    bookingItems,
    wifiPass,
    selectedSeat,
    reservationDetails,
    updateReservationDetails,
    checkAvailability,
    foodTotal,
    wifiTotal,
    bookingFee,
    gst,
    grandTotal,
    clearBooking,
  } = useBooking();

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Time & Duration Change Modal state
  const [isTimeModalOpen, setIsTimeModalOpen] = useState(false);
  const [modalHour, setModalHour] = useState("10");
  const [modalMinute, setModalMinute] = useState("00");
  const [modalPeriod, setModalPeriod] = useState("AM");
  const [modalDuration, setModalDuration] = useState(reservationDetails.duration || "1 Hour");

  // Date setup: Today's date in YYYY-MM-DD
  const todayStr = new Date().toISOString().split("T")[0];

  const formatDateDDMMYYYY = (isoDateStr: string) => {
    if (!isoDateStr) return "";
    const parts = isoDateStr.split("-");
    if (parts.length !== 3) return isoDateStr;
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  };

  const handleInputChange = (field: string, value: string) => {
    updateReservationDetails({ [field]: value });
  };

  // Helper for Number of People +/- controls
  const handleGuestCountChange = (delta: 1 | -1) => {
    const current = parseInt(reservationDetails.guests, 10) || 1;
    const nextVal = Math.min(20, Math.max(1, current + delta));
    updateReservationDetails({ guests: nextVal.toString() });
  };

  // Calculated End Time
  const calculatedEndTime = useMemo(() => {
    return calculateEndTime(
      reservationDetails.arrivalTime || "10:00 AM",
      reservationDetails.duration || "1 Hour"
    );
  }, [reservationDetails.arrivalTime, reservationDetails.duration]);

  // Open Time Edit Modal with current values
  const handleOpenTimeModal = () => {
    const currentArr = reservationDetails.arrivalTime || "10:00 AM";
    const match = currentArr.match(/(\d+):(\d+)\s*(AM|PM)/i);
    if (match) {
      setModalHour(match[1].padStart(2, "0"));
      setModalMinute(match[2].padStart(2, "0"));
      setModalPeriod(match[3].toUpperCase());
    }
    setModalDuration(reservationDetails.duration || "1 Hour");
    setIsTimeModalOpen(true);
  };

  // Save Modal Time Changes
  const handleSaveModalTime = () => {
    const newArrival = `${modalHour}:${modalMinute} ${modalPeriod}`;
    updateReservationDetails({
      arrivalTime: newArrival,
      duration: modalDuration,
    });
    setIsTimeModalOpen(false);
  };

  const handleFormSubmit = async () => {
    if (!isAuthenticated()) {
      const msg = encodeURIComponent("Please login to your RoyalCafeConnect account to book a workspace.");
      router.push(`/login?redirect=/book&message=${msg}`);
      return;
    }

    const guestsNum = parseInt(reservationDetails.guests, 10) || 0;

    if (!reservationDetails.fullName.trim()) {
      alert("Please complete workspace and time selection: Enter your Full Name.");
      return;
    }
    if (!reservationDetails.mobile.trim()) {
      alert("Please complete workspace and time selection: Enter your Mobile Number.");
      return;
    }
    if (!reservationDetails.resDate) {
      alert("Please select a booking date.");
      return;
    }
    if (!reservationDetails.arrivalTime.trim()) {
      alert("Please select a valid time.");
      return;
    }
    if (!reservationDetails.duration.trim()) {
      alert("Please complete workspace and time selection: Select Duration.");
      return;
    }
    if (guestsNum <= 0) {
      alert("Please complete workspace and time selection: Number of guests must be at least 1.");
      return;
    }

    setIsSubmitting(true);

    try {
      const effectiveWorkspace = selectedSeat?.id || reservationDetails.tableType || "Window Seat 01";

      // Check space availability in Supabase
      const isAvailable = await checkAvailability(
        effectiveWorkspace,
        reservationDetails.resDate,
        reservationDetails.arrivalTime,
        calculatedEndTime
      );

      const bookingId = `RCC-${Date.now().toString().slice(-6)}`;

      const queryParams = new URLSearchParams({
        bookingId,
        bookingType: selectedSeat?.seatType || reservationDetails.tableType,
        workspace: effectiveWorkspace,
        seat: selectedSeat?.zone || reservationDetails.seatingArea,
        date: formatDateDDMMYYYY(reservationDetails.resDate),
        rawDate: reservationDetails.resDate,
        time: reservationDetails.arrivalTime,
        duration: reservationDetails.duration,
        endTime: calculatedEndTime,
        guests: reservationDetails.guests,
        purpose: reservationDetails.occasion,
        amount: grandTotal.toString(),
        specialRequests: reservationDetails.specialRequests || "",
      }).toString();

      // Store in local storage for profile & admin fallback
      const newBookingRecord = {
        bookingId,
        userName: reservationDetails.fullName,
        userPhone: reservationDetails.mobile,
        userEmail: reservationDetails.email,
        workspace: effectiveWorkspace,
        workspaceType: selectedSeat?.seatType || reservationDetails.tableType,
        zone: selectedSeat?.zone || reservationDetails.seatingArea,
        date: formatDateDDMMYYYY(reservationDetails.resDate),
        arrivalTime: reservationDetails.arrivalTime,
        duration: reservationDetails.duration,
        endTime: calculatedEndTime,
        guests: reservationDetails.guests,
        amount: grandTotal,
        status: "Confirmed",
        createdAt: new Date().toISOString(),
      };

      if (typeof window !== "undefined") {
        const existingBookings = JSON.parse(localStorage.getItem("rcc_user_bookings") || "[]");
        localStorage.setItem("rcc_user_bookings", JSON.stringify([newBookingRecord, ...existingBookings]));

        const existingAdminRes = JSON.parse(localStorage.getItem("rcc_admin_reservations") || "[]");
        localStorage.setItem("rcc_admin_reservations", JSON.stringify([newBookingRecord, ...existingAdminRes]));
      }

      router.push(`/payment?${queryParams}`);
    } catch (err: any) {
      console.error("Booking error:", err);
      alert(err.message || "Unable to create booking. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="pb-16 pt-24 bg-[#FFFDF9] text-foreground font-sans">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Single Centered Content Flow Container */}
        <div className="bg-white p-6 sm:p-8 rounded-[28px] border border-primary/10 shadow-md shadow-primary/5 space-y-6">

          {/* Title Header */}
          <div className="border-b border-primary/10 pb-5 text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF6F0] text-[#EA5A0C] text-[10px] font-extrabold uppercase tracking-widest mb-2 border border-[#EA5A0C]/20">
              <Sparkles className="h-3 w-3" /> Premium Cafe Reservation
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold font-serif text-[#2A1506]">
              ☕ Reserve Your Perfect Spot
            </h1>
            <p className="text-xs sm:text-sm text-foreground/70 font-medium mt-1">
              Workspace and time details transferred automatically — review and confirm below.
            </p>
          </div>

          {/* AUTOMATICALLY POPULATED SELECTED WORKSPACE & TIME CARD */}
          <div className="bg-[#FAF4ED] p-5 rounded-2xl border-2 border-[#8C4A21]/30 shadow-sm text-left space-y-3 animate-in fade-in duration-300">
            <div className="flex flex-wrap items-center justify-between border-b border-[#DFCDBE] pb-3 gap-2">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-2xl bg-[#3D2314] text-white flex items-center justify-center shrink-0 shadow-xs">
                  <Armchair className="h-5 w-5" />
                </div>
                <div>
                  <span className="text-[10px] font-extrabold text-[#8C4A21] uppercase tracking-wider block">
                    AUTOMATICALLY POPULATED WORKSPACE
                  </span>
                  <p className="text-sm sm:text-base font-bold text-[#3D2314]">
                    🪑 {selectedSeat ? `Desk ${selectedSeat.id} (${selectedSeat.seatType})` : reservationDetails.tableType}
                  </p>
                  <p className="text-xs text-foreground/70 font-medium">
                    Zone: <strong className="text-[#3D2314]">{selectedSeat?.zone || reservationDetails.seatingArea}</strong>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* Action 1: Change Workspace (Back to Blueprint) */}
                <Link
                  href="/live-status"
                  className="px-3.5 py-1.5 text-xs font-bold text-[#3D2314] bg-white border border-[#DFCDBE] hover:bg-[#3D2314] hover:text-white rounded-full transition-all cursor-pointer shadow-2xs flex items-center gap-1.5"
                >
                  Change Workspace
                </Link>

                {/* Action 2: Change Time Modal trigger */}
                <button
                  type="button"
                  onClick={handleOpenTimeModal}
                  className="px-3.5 py-1.5 text-xs font-bold text-white bg-[#8C4A21] hover:bg-[#3D2314] rounded-full transition-all cursor-pointer shadow-2xs flex items-center gap-1.5"
                >
                  <Clock className="w-3.5 h-3.5" />
                  Change Time
                </button>
              </div>
            </div>

            {/* Time & Duration Summary Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-xs">
              <div className="bg-white p-2.5 rounded-xl border border-[#DFCDBE]">
                <span className="text-[10px] font-extrabold text-[#7A5A43] uppercase block">Date</span>
                <span className="font-bold text-[#3D2314]">{formatDateDDMMYYYY(reservationDetails.resDate) || "07/08/2026"}</span>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-[#DFCDBE]">
                <span className="text-[10px] font-extrabold text-[#7A5A43] uppercase block">Arrival Time</span>
                <span className="font-bold text-[#3D2314]">{reservationDetails.arrivalTime || "10:00 AM"}</span>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-[#DFCDBE]">
                <span className="text-[10px] font-extrabold text-[#7A5A43] uppercase block">Duration</span>
                <span className="font-bold text-[#3D2314]">{reservationDetails.duration || "1 Hour"}</span>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-[#DFCDBE]">
                <span className="text-[10px] font-extrabold text-emerald-800 uppercase block">Ends At (Checkout)</span>
                <span className="font-bold font-mono text-emerald-800">{calculatedEndTime}</span>
              </div>
            </div>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleFormSubmit();
            }}
            className="space-y-6 text-left"
          >

            {/* SECTION 1: GUEST DETAILS (PRE-FILLED OR AUTO-POPULATED) */}
            <div className="space-y-3">
              <h3 className="text-xs font-extrabold text-[#5A2E0C] uppercase tracking-wider flex items-center gap-1.5 border-b border-primary/5 pb-2">
                <User className="h-4 w-4 text-[#EA5A0C]" />
                Section 1 • Guest Details
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Full Name */}
                <div className="relative">
                  <User className="h-4 w-4 text-foreground/40 absolute left-3.5 top-3.5 pointer-events-none" />
                  <input
                    type="text"
                    required
                    placeholder="Full Name *"
                    value={reservationDetails.fullName}
                    onChange={(e) => handleInputChange("fullName", e.target.value)}
                    className="w-full pl-10 pr-3.5 py-3 rounded-[14px] border border-primary/15 text-xs bg-[#FAF6F0]/60 focus:bg-white text-[#2A1506] font-medium outline-none focus:border-[#EA5A0C] focus:ring-2 focus:ring-[#EA5A0C]/10 transition-all"
                  />
                </div>

                {/* Mobile Number */}
                <div className="relative">
                  <Phone className="h-4 w-4 text-foreground/40 absolute left-3.5 top-3.5 pointer-events-none" />
                  <input
                    type="tel"
                    required
                    placeholder="Mobile Number *"
                    value={reservationDetails.mobile}
                    onChange={(e) => handleInputChange("mobile", e.target.value)}
                    className="w-full pl-10 pr-3.5 py-3 rounded-[14px] border border-primary/15 text-xs bg-[#FAF6F0]/60 focus:bg-white text-[#2A1506] font-medium outline-none focus:border-[#EA5A0C] focus:ring-2 focus:ring-[#EA5A0C]/10 transition-all"
                  />
                </div>

                {/* Email */}
                <div className="relative">
                  <Mail className="h-4 w-4 text-foreground/40 absolute left-3.5 top-3.5 pointer-events-none" />
                  <input
                    type="email"
                    placeholder="Email Address (Optional)"
                    value={reservationDetails.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="w-full pl-10 pr-3.5 py-3 rounded-[14px] border border-primary/15 text-xs bg-[#FAF6F0]/60 focus:bg-white text-[#2A1506] font-medium outline-none focus:border-[#EA5A0C] focus:ring-2 focus:ring-[#EA5A0C]/10 transition-all"
                  />
                </div>
              </div>
            </div>

            {/* SECTION 2: SEATING PREFERENCES */}
            <div className="space-y-3">
              <h3 className="text-xs font-extrabold text-[#5A2E0C] uppercase tracking-wider flex items-center gap-1.5 border-b border-primary/5 pb-2">
                <Coffee className="h-4 w-4 text-[#EA5A0C]" />
                Section 2 • Seating Preferences
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
                {/* Indoor / Outdoor Environment */}
                <div>
                  <label className="block text-[10px] font-bold text-foreground/50 uppercase mb-1">
                    Environment *
                  </label>
                  <select
                    value={selectedSeat?.zone || reservationDetails.seatingArea}
                    onChange={(e) => handleInputChange("seatingArea", e.target.value)}
                    disabled={!!selectedSeat}
                    className="w-full px-3.5 py-3 rounded-[14px] border border-primary/15 text-xs bg-[#FAF6F0]/60 focus:bg-white text-[#2A1506] font-semibold outline-none focus:border-[#EA5A0C] transition-all cursor-pointer shadow-xs disabled:opacity-80"
                  >
                    <option value="Indoor Seating">Indoor Air-Conditioned</option>
                    <option value="Outdoor Terrace">Outdoor Garden Terrace</option>
                    <option value="Work & Study">Work &amp; Study Zone</option>
                    <option value="Lounge">Social Lounge Zone</option>
                    <option value="Social">Social Area</option>
                    <option value="Family">Family Zone</option>
                    <option value="Outdoor">Outdoor Terrace</option>
                    <option value="Kids Zone">Kids Zone</option>
                    <option value="Elder Friendly">Elder Friendly</option>
                  </select>
                </div>

                {/* PREMIUM SEARCHABLE TABLE TYPE DROPDOWN */}
                <SearchableTableDropdown
                  value={selectedSeat?.seatType || reservationDetails.tableType}
                  onChange={(val) => handleInputChange("tableType", val)}
                />

                {/* NUMBER OF PEOPLE WITH +/- CONTROLS & MANUAL TYPING */}
                <div>
                  <label className="block text-[10px] font-bold text-foreground/50 uppercase mb-1">
                    Number of People * (1 to 20)
                  </label>
                  <div className="flex items-center rounded-[14px] border border-primary/15 bg-[#FAF6F0]/60 focus-within:bg-white focus-within:border-[#EA5A0C] transition-all overflow-hidden p-1 shadow-xs">
                    <button
                      type="button"
                      onClick={() => handleGuestCountChange(-1)}
                      className="h-8 w-8 rounded-xl bg-white hover:bg-[#EA5A0C] hover:text-white text-[#2A1506] flex items-center justify-center transition-all cursor-pointer shrink-0 border border-primary/10 shadow-2xs"
                      aria-label="Decrease guest count"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>

                    <div className="flex-1 relative flex items-center justify-center px-2">
                      <Users className="h-3.5 w-3.5 text-foreground/40 absolute left-2 pointer-events-none" />
                      <input
                        type="number"
                        min={1}
                        max={20}
                        value={reservationDetails.guests}
                        onChange={(e) => handleInputChange("guests", e.target.value)}
                        className="w-full text-center pl-4 pr-1 py-1 font-bold text-xs bg-transparent text-[#2A1506] outline-none"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() => handleGuestCountChange(1)}
                      className="h-8 w-8 rounded-xl bg-white hover:bg-[#EA5A0C] hover:text-white text-[#2A1506] flex items-center justify-center transition-all cursor-pointer shrink-0 border border-primary/10 shadow-2xs"
                      aria-label="Increase guest count"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* RESERVATION DETAILS, PAYMENT SUMMARY & CONFIRMATION ACTION */}
            <div className="pt-2">
              <BookingSummary
                onConfirmBooking={handleFormSubmit}
                isSubmitting={isSubmitting}
              />
            </div>

          </form>
        </div>

      </div>

      {/* CHANGE TIME MODAL DIALOG */}
      {isTimeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
          <div className="bg-[#FFFDF9] p-6 rounded-[28px] border-2 border-[#8C4A21]/30 max-w-md w-full shadow-2xl space-y-4 text-left font-sans text-[#3D2314]">
            <div className="flex items-center justify-between border-b border-[#DFCDBE] pb-3">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-[#8C4A21]" />
                <h3 className="font-serif font-bold text-lg text-[#3D2314]">Modify Booking Time</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsTimeModalOpen(false)}
                className="p-1 rounded-full hover:bg-[#FAF4ED] text-[#7A5A43]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Date Input */}
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase text-[#7A5A43]">Reservation Date</label>
              <input
                type="date"
                min={todayStr}
                value={reservationDetails.resDate}
                onChange={(e) => handleInputChange("resDate", e.target.value)}
                className="w-full p-3 bg-white border border-[#DFCDBE] rounded-xl text-xs font-bold"
              />
            </div>

            {/* Time Picker Dropdowns */}
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase text-[#7A5A43]">Start Arrival Time</label>
              <div className="grid grid-cols-3 gap-2">
                <select
                  value={modalHour}
                  onChange={(e) => setModalHour(e.target.value)}
                  className="p-2.5 bg-white border border-[#DFCDBE] rounded-xl text-xs font-bold"
                >
                  {["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"].map((h) => (
                    <option key={h} value={h}>{h}</option>
                  ))}
                </select>
                <select
                  value={modalMinute}
                  onChange={(e) => setModalMinute(e.target.value)}
                  className="p-2.5 bg-white border border-[#DFCDBE] rounded-xl text-xs font-bold"
                >
                  {["00", "15", "30", "45"].map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
                <select
                  value={modalPeriod}
                  onChange={(e) => setModalPeriod(e.target.value)}
                  className="p-2.5 bg-white border border-[#DFCDBE] rounded-xl text-xs font-bold"
                >
                  <option value="AM">AM</option>
                  <option value="PM">PM</option>
                </select>
              </div>
            </div>

            {/* Duration Presets */}
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase text-[#7A5A43]">Booking Duration</label>
              <div className="grid grid-cols-3 gap-2">
                {["30 Minutes", "1 Hour", "2 Hours", "3 Hours", "4 Hours", "Half Day"].map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setModalDuration(d)}
                    className={`py-2 px-2 rounded-xl text-xs font-bold transition-all ${modalDuration === d
                        ? "bg-[#3D2314] text-white"
                        : "bg-[#FAF4ED] text-[#7A5A43] border border-[#DFCDBE]"
                      }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            {/* Calculated Checkout Preview */}
            <div className="p-3 bg-[#FAF4ED] rounded-xl border border-[#DFCDBE] flex justify-between items-center text-xs font-bold">
              <span className="text-[#7A5A43]">Calculated Checkout:</span>
              <span className="font-mono text-emerald-800">{calculateEndTime(`${modalHour}:${modalMinute} ${modalPeriod}`, modalDuration)}</span>
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsTimeModalOpen(false)}
                className="flex-1 py-3 rounded-full text-xs font-bold bg-gray-100 hover:bg-gray-200 text-gray-700"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveModalTime}
                className="flex-1 py-3 rounded-full text-xs font-bold bg-[#8C4A21] hover:bg-[#3D2314] text-white shadow-md"
              >
                Save Time Changes
              </button>
            </div>

          </div>
        </div>
      )}
    </section>
  );
}
