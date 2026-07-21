"use client";

import { useState } from "react";
import { useBooking } from "@/context/BookingContext";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Laptop,
  Coffee,
  BookOpen,
  Users,
  CheckCircle2,
  Calendar,
  Clock,
  MapPin,
  Wifi,
  Zap,
  Sparkles,
  ArrowRight,
  ChevronDown,
  Info,
  Heart,
  MessageSquare,
  ShieldCheck,
} from "lucide-react";

export default function WorkspaceSelector() {
  const router = useRouter();
  const { menuItems, wifiPass, foodTotal, wifiTotal, clearBooking } = useBooking();

  // Date setup: Today's date in YYYY-MM-DD
  const todayObj = new Date();
  const todayStr = todayObj.toISOString().split("T")[0];

  // Helper to format YYYY-MM-DD to DD/MM/YYYY
  const formatDateDDMMYYYY = (isoDateStr: string) => {
    if (!isoDateStr) return "";
    const parts = isoDateStr.split("-");
    if (parts.length !== 3) return isoDateStr;
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  };

  // Step 1 State: Visit Purpose Choice ('study' | 'relax')
  const [bookingType, setBookingType] = useState<"study" | "relax">("study");

  // =========================================
  // STUDY WORKSPACE FORM STATE
  // =========================================
  const [studyForm, setStudyForm] = useState({
    fullName: "",
    mobile: "",
    email: "",
    resDate: todayStr,
    arrivalTime: "09:00 AM",
    duration: "2 Hours",
    guests: "1 Person",
    purpose: "Study",
    workspaceName: "Quiet Study Zone",
    seat: "Desk #12",
  });

  // =========================================
  // CAFÉ SEATING RESERVATION FORM STATE
  // =========================================
  const [relaxForm, setRelaxForm] = useState({
    fullName: "",
    mobile: "",
    email: "",
    resDate: todayStr,
    arrivalTime: "02:00 PM",
    guests: "2 People",
    seatingArea: "Indoor Seating",
    tableType: "2-Seater",
    occasion: "Coffee Break",
    specialRequests: "",
  });

  // Fully booked date condition check
  const isStudyDateFullyBooked = studyForm.resDate === "2026-12-25";
  const isRelaxDateFullyBooked = relaxForm.resDate === "2026-12-25";

  // Pricing calculations
  const studyBasePrice = 350;
  const studyTax = studyBasePrice * 0.05;
  const studyGrandTotal = studyBasePrice + studyTax;

  const relaxBasePrice = 250;
  const relaxTax = relaxBasePrice * 0.05;
  const relaxGrandTotal = relaxBasePrice + relaxTax;

  // Handlers for submission connected to backend /api/booking
  const handleStudySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isStudyDateFullyBooked) return;

    const bookingFee = studyBasePrice;
    const grandTotal = bookingFee + foodTotal + wifiTotal + Math.round((bookingFee + foodTotal + wifiTotal) * 0.05);

    try {
      const res = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: studyForm.fullName,
          mobile: studyForm.mobile,
          email: studyForm.email,
          seatType: "Study Workspace",
          seatNumber: studyForm.workspaceName,
          date: formatDateDDMMYYYY(studyForm.resDate),
          arrivalTime: studyForm.arrivalTime,
          duration: studyForm.duration,
          guests: studyForm.guests,
          purpose: studyForm.purpose,
          amount: bookingFee,
          // Cart / Context data
          menuItems,
          wifiPass,
          foodTotal,
          wifiTotal,
          bookingFee,
          grandTotal,
        }),
      });

      const data = await res.json();
      const bookingId = data?.booking?.bookingId || "";

      const queryParams = new URLSearchParams({
        bookingId,
        bookingType: "Study Workspace",
        workspace: studyForm.workspaceName,
        seat: studyForm.seat,
        zone: studyForm.purpose,
        date: formatDateDDMMYYYY(studyForm.resDate),
        time: studyForm.arrivalTime,
        duration: studyForm.duration,
        guests: studyForm.guests,
        purpose: studyForm.purpose,
        amount: grandTotal.toFixed(0),
      }).toString();

      clearBooking();
      router.push(`/payment?${queryParams}`);
    } catch (err) {
      console.error("Booking API error:", err);
      router.push(`/payment?amount=${grandTotal.toFixed(0)}`);
    }
  };

  const handleRelaxSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isRelaxDateFullyBooked) return;

    const bookingFee = relaxBasePrice;
    const grandTotal = bookingFee + foodTotal + wifiTotal + Math.round((bookingFee + foodTotal + wifiTotal) * 0.05);

    try {
      const res = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: relaxForm.fullName,
          mobile: relaxForm.mobile,
          email: relaxForm.email,
          seatType: "Café Reservation",
          seatNumber: `${relaxForm.tableType} (${relaxForm.seatingArea})`,
          date: formatDateDDMMYYYY(relaxForm.resDate),
          arrivalTime: relaxForm.arrivalTime,
          duration: "Table Booking",
          guests: relaxForm.guests,
          purpose: relaxForm.occasion,
          specialRequests: relaxForm.specialRequests,
          amount: bookingFee,
          // Cart / Context data
          menuItems,
          wifiPass,
          foodTotal,
          wifiTotal,
          bookingFee,
          grandTotal,
        }),
      });

      const data = await res.json();
      const bookingId = data?.booking?.bookingId || "";

      const queryParams = new URLSearchParams({
        bookingId,
        bookingType: "Café Reservation",
        workspace: `${relaxForm.tableType} (${relaxForm.seatingArea})`,
        seat: relaxForm.tableType,
        zone: relaxForm.seatingArea,
        date: formatDateDDMMYYYY(relaxForm.resDate),
        time: relaxForm.arrivalTime,
        duration: "Table Booking",
        guests: relaxForm.guests,
        purpose: relaxForm.occasion,
        specialRequests: relaxForm.specialRequests,
        amount: grandTotal.toFixed(0),
      }).toString();

      clearBooking();
      router.push(`/payment?${queryParams}`);
    } catch (err) {
      console.error("Booking API error:", err);
      router.push(`/payment?amount=${grandTotal.toFixed(0)}`);
    }
  };

  return (
    <section className="pb-20 bg-background text-foreground text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* ====================================================== */}
        {/* STEP 1: VISIT PURPOSE SELECTION CARD */}
        {/* ====================================================== */}
        <div className="bg-white rounded-[28px] p-6 sm:p-10 card-shadow border border-primary/5 text-center max-w-4xl mx-auto space-y-6 animate-fade-in">
          
          <div>
            <span className="text-[10px] font-extrabold text-accent uppercase tracking-widest block mb-2">
              STEP 1 OF 2 • SELECT VISIT TYPE
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold font-serif text-[#5A2E0C]">
              What brings you to RoyalCafe Connect today?
            </h2>
            <p className="text-xs sm:text-sm text-foreground/75 font-sans mt-2 max-w-xl mx-auto">
              Please choose your primary visit purpose to view tailored booking options and seat layouts.
            </p>
          </div>

          {/* 2 Selectable Purpose Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            
            {/* OPTION 1: STUDY / WORK */}
            <div
              onClick={() => setBookingType("study")}
              className={`p-6 sm:p-8 rounded-[24px] border-2 text-left cursor-pointer transition-all duration-300 flex flex-col justify-between space-y-6 relative overflow-hidden ${
                bookingType === "study"
                  ? "border-[#5A2E0C] bg-[#FAF6F0] shadow-md ring-2 ring-[#5A2E0C]/20"
                  : "border-primary/10 bg-white hover:border-primary/30 card-shadow-hover"
              }`}
            >
              {bookingType === "study" && (
                <div className="absolute top-4 right-4 bg-[#5A2E0C] text-white text-[9px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full flex items-center gap-1 shadow-sm">
                  <CheckCircle2 className="h-3 w-3" /> Selected
                </div>
              )}

              <div>
                <div className="h-12 w-12 rounded-2xl bg-[#5A2E0C]/10 text-[#5A2E0C] flex items-center justify-center mb-4">
                  <BookOpen className="h-6 w-6 stroke-[2]" />
                </div>

                <h3 className="text-xl font-bold font-serif text-[#5A2E0C] mb-2 flex items-center gap-2">
                  <span>📚 Study / Work</span>
                </h3>

                <p className="text-xs sm:text-sm text-foreground/75 leading-relaxed font-sans">
                  I need a quiet workspace with charging ports, high-speed Wi-Fi, and a tech-optimized productive environment.
                </p>
              </div>

              <button
                type="button"
                className={`w-full py-3 px-5 text-xs font-bold rounded-full uppercase tracking-wider transition-all text-center ${
                  bookingType === "study"
                    ? "bg-[#2A1506] text-white shadow-sm"
                    : "bg-white border border-primary/20 text-[#5A2E0C] hover:bg-foreground/5"
                }`}
              >
                Choose Study Workspace
              </button>
            </div>

            {/* OPTION 2: RELAX / MEET FRIENDS */}
            <div
              onClick={() => setBookingType("relax")}
              className={`p-6 sm:p-8 rounded-[24px] border-2 text-left cursor-pointer transition-all duration-300 flex flex-col justify-between space-y-6 relative overflow-hidden ${
                bookingType === "relax"
                  ? "border-[#5A2E0C] bg-[#FAF6F0] shadow-md ring-2 ring-[#5A2E0C]/20"
                  : "border-primary/10 bg-white hover:border-primary/30 card-shadow-hover"
              }`}
            >
              {bookingType === "relax" && (
                <div className="absolute top-4 right-4 bg-[#5A2E0C] text-white text-[9px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full flex items-center gap-1 shadow-sm">
                  <CheckCircle2 className="h-3 w-3" /> Selected
                </div>
              )}

              <div>
                <div className="h-12 w-12 rounded-2xl bg-[#EA5A0C]/10 text-[#EA5A0C] flex items-center justify-center mb-4">
                  <Coffee className="h-6 w-6 stroke-[2]" />
                </div>

                <h3 className="text-xl font-bold font-serif text-[#5A2E0C] mb-2 flex items-center gap-2">
                  <span>☕ Relax / Meet Friends</span>
                </h3>

                <p className="text-xs sm:text-sm text-foreground/75 leading-relaxed font-sans">
                  I want to enjoy coffee, food, or spend leisure time with family or friends in a cozy café setting.
                </p>
              </div>

              <button
                type="button"
                className={`w-full py-3 px-5 text-xs font-bold rounded-full uppercase tracking-wider transition-all text-center ${
                  bookingType === "relax"
                    ? "bg-[#2A1506] text-white shadow-sm"
                    : "bg-white border border-primary/20 text-[#5A2E0C] hover:bg-foreground/5"
                }`}
              >
                Reserve Café Seating
              </button>
            </div>

          </div>

        </div>

        {/* ====================================================== */}
        {/* STEP 2: CONDITIONAL BOOKING FORMS + SUMMARY SIDEBAR */}
        {/* ====================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT FORM COLUMN (7 COLS) */}
          <div className="lg:col-span-7">
            
            {/* ---------------------------------------------------- */}
            {/* MODE A: STUDY WORKSPACE FORM */}
            {/* ---------------------------------------------------- */}
            {bookingType === "study" && (
              <div className="bg-white rounded-[28px] p-6 sm:p-10 card-shadow border border-primary/5 space-y-6 animate-fade-in">
                
                <div className="border-b border-primary/10 pb-4">
                  <div className="flex items-center gap-2 text-xs font-bold text-accent uppercase tracking-wider mb-1">
                    <Laptop className="h-4 w-4" /> Workspace Booking Form
                  </div>
                  <h3 className="text-2xl font-bold font-serif text-[#5A2E0C]">
                    Study &amp; Work Seat Details
                  </h3>
                  <p className="text-xs text-foreground/60 font-sans mt-1">
                    Reserve dedicated desks equipped with power ports and 1 Gbps Fiber Wi-Fi.
                  </p>
                </div>

                <form onSubmit={handleStudySubmit} className="space-y-5">
                  
                  {/* Contact Info */}
                  <div className="p-4 rounded-2xl bg-[#FAF6F0] border border-primary/5 space-y-3">
                    <span className="text-[10px] font-bold text-foreground/50 uppercase tracking-wider block">
                      CONTACT INFORMATION
                    </span>
                    <input
                      type="text"
                      required
                      placeholder="Full Name *"
                      value={studyForm.fullName}
                      onChange={(e) => setStudyForm({ ...studyForm, fullName: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-primary/10 text-xs bg-white text-primary placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input
                        type="tel"
                        required
                        placeholder="Mobile Number *"
                        value={studyForm.mobile}
                        onChange={(e) => setStudyForm({ ...studyForm, mobile: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-primary/10 text-xs bg-white text-primary placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/20"
                      />
                      <input
                        type="email"
                        placeholder="Email (Optional)"
                        value={studyForm.email}
                        onChange={(e) => setStudyForm({ ...studyForm, email: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-primary/10 text-xs bg-white text-primary placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                  </div>

                  {/* Workspace Selection Dropdown */}
                  <div>
                    <label className="block text-[10px] font-bold text-foreground/50 uppercase mb-1">
                      Workspace Environment *
                    </label>
                    <div className="relative">
                      <select
                        value={studyForm.workspaceName}
                        onChange={(e) => setStudyForm({ ...studyForm, workspaceName: e.target.value })}
                        className="w-full appearance-none px-4 py-3 rounded-xl border border-primary/10 text-xs font-semibold text-primary bg-[#FAF6F0] pr-8 focus:outline-none cursor-pointer"
                      >
                        <option value="Quiet Study Zone">Quiet Study Zone (Silent Ambient)</option>
                        <option value="Focus Pods">Focus Pods (Individual Booths)</option>
                        <option value="Window Seats">Window Seats (Natural Light)</option>
                        <option value="Meeting Booths">Meeting Booths (Group Collaborations)</option>
                        <option value="Open Workspace">Open Workspace (Flexible Seating)</option>
                      </select>
                      <ChevronDown className="h-4 w-4 text-primary/60 absolute right-3 top-3.5 pointer-events-none" />
                    </div>
                  </div>

                  {/* Visit Date & Arrival Time */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-foreground/50 uppercase mb-1 flex items-center justify-between">
                        <span>Reservation Date *</span>
                        <span className="text-accent font-mono text-[9px] font-bold">
                          {formatDateDDMMYYYY(studyForm.resDate)}
                        </span>
                      </label>
                      <input
                        type="date"
                        required
                        min={todayStr}
                        value={studyForm.resDate}
                        onChange={(e) => setStudyForm({ ...studyForm, resDate: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-primary/10 text-xs font-semibold text-primary bg-[#FAF6F0] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-foreground/50 uppercase mb-1">
                        Arrival Time *
                      </label>
                      <div className="relative">
                        <select
                          value={studyForm.arrivalTime}
                          onChange={(e) => setStudyForm({ ...studyForm, arrivalTime: e.target.value })}
                          className="w-full appearance-none px-4 py-3 rounded-xl border border-primary/10 text-xs font-semibold text-primary bg-[#FAF6F0] pr-8 focus:outline-none cursor-pointer"
                        >
                          <option value="08:00 AM">08:00 AM</option>
                          <option value="09:00 AM">09:00 AM</option>
                          <option value="11:00 AM">11:00 AM</option>
                          <option value="02:00 PM">02:00 PM</option>
                          <option value="04:00 PM">04:00 PM</option>
                          <option value="06:00 PM">06:00 PM</option>
                        </select>
                        <ChevronDown className="h-4 w-4 text-primary/60 absolute right-3 top-3.5 pointer-events-none" />
                      </div>
                    </div>
                  </div>

                  {/* Duration & Number of Guests */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-foreground/50 uppercase mb-1">
                        Duration *
                      </label>
                      <div className="relative">
                        <select
                          value={studyForm.duration}
                          onChange={(e) => setStudyForm({ ...studyForm, duration: e.target.value })}
                          className="w-full appearance-none px-4 py-3 rounded-xl border border-primary/10 text-xs font-semibold text-primary bg-[#FAF6F0] pr-8 focus:outline-none cursor-pointer"
                        >
                          <option value="1 Hour">1 Hour Pass</option>
                          <option value="2 Hours">2 Hours Pass</option>
                          <option value="4 Hours">4 Hours Half-Day Pass</option>
                          <option value="Full Day">Full Day Pass (8h)</option>
                        </select>
                        <ChevronDown className="h-4 w-4 text-primary/60 absolute right-3 top-3.5 pointer-events-none" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-foreground/50 uppercase mb-1">
                        Number of Guests *
                      </label>
                      <div className="relative">
                        <select
                          value={studyForm.guests}
                          onChange={(e) => setStudyForm({ ...studyForm, guests: e.target.value })}
                          className="w-full appearance-none px-4 py-3 rounded-xl border border-primary/10 text-xs font-semibold text-primary bg-[#FAF6F0] pr-8 focus:outline-none cursor-pointer"
                        >
                          <option value="1 Person">1 Person (Solo Desk)</option>
                          <option value="2 People">2 People (Pair Desk)</option>
                          <option value="4 People">4 People (Group Table)</option>
                        </select>
                        <ChevronDown className="h-4 w-4 text-primary/60 absolute right-3 top-3.5 pointer-events-none" />
                      </div>
                    </div>
                  </div>

                  {/* Purpose Selection */}
                  <div>
                    <label className="block text-[10px] font-bold text-foreground/50 uppercase mb-1">
                      Purpose of Visit *
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {["Study", "Work", "Meeting"].map((p) => (
                        <button
                          key={p}
                          type="button"
                          onClick={() => setStudyForm({ ...studyForm, purpose: p })}
                          className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                            studyForm.purpose === p
                              ? "bg-[#2A1506] text-white border-transparent shadow-sm"
                              : "bg-[#FAF6F0] text-primary border-primary/10 hover:bg-foreground/5"
                          }`}
                        >
                          {p}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Workspace Amenities Display */}
                  <div className="p-4 bg-[#FAF6F0] rounded-2xl border border-primary/5 space-y-2">
                    <span className="text-[10px] font-bold text-foreground/50 uppercase tracking-wider block mb-1">
                      INCLUDED WORKSPACE AMENITIES
                    </span>
                    <div className="grid grid-cols-2 gap-2 text-xs font-semibold text-primary">
                      <div className="flex items-center gap-1.5">
                        <Wifi className="h-3.5 w-3.5 text-emerald-600" />
                        <span>1 Gbps Dedicated Fiber</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Zap className="h-3.5 w-3.5 text-accent" />
                        <span>Ports at Every Desk</span>
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isStudyDateFullyBooked}
                    className="w-full py-4 rounded-full bg-[#EA5A0C] hover:bg-[#EA5A0C]/95 disabled:bg-gray-300 text-white font-bold text-xs shadow-md transition-all uppercase tracking-wider cursor-pointer active:scale-98"
                  >
                    {isStudyDateFullyBooked ? "Fully Booked for Selected Date" : "Book Workspace Now"}
                  </button>

                </form>

              </div>
            )}

            {/* ---------------------------------------------------- */}
            {/* MODE B: CAFÉ SEATING RESERVATION FORM */}
            {/* ---------------------------------------------------- */}
            {bookingType === "relax" && (
              <div className="bg-white rounded-[28px] p-6 sm:p-10 card-shadow border border-primary/5 space-y-6 animate-fade-in">
                
                <div className="border-b border-primary/10 pb-4">
                  <div className="flex items-center gap-2 text-xs font-bold text-accent uppercase tracking-wider mb-1">
                    <Coffee className="h-4 w-4" /> Café Seating Reservation
                  </div>
                  <h3 className="text-2xl font-bold font-serif text-[#5A2E0C]">
                    Table &amp; Dining Details
                  </h3>
                  <p className="text-xs text-foreground/60 font-sans mt-1">
                    Reserve a table to enjoy artisanal coffee, food, or quality time with friends.
                  </p>
                </div>

                <form onSubmit={handleRelaxSubmit} className="space-y-5">
                  
                  {/* Contact Info */}
                  <div className="p-4 rounded-2xl bg-[#FAF6F0] border border-primary/5 space-y-3">
                    <span className="text-[10px] font-bold text-foreground/50 uppercase tracking-wider block">
                      GUEST DETAILS
                    </span>
                    <input
                      type="text"
                      required
                      placeholder="Full Name *"
                      value={relaxForm.fullName}
                      onChange={(e) => setRelaxForm({ ...relaxForm, fullName: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-primary/10 text-xs bg-white text-primary placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input
                        type="tel"
                        required
                        placeholder="Mobile Number *"
                        value={relaxForm.mobile}
                        onChange={(e) => setRelaxForm({ ...relaxForm, mobile: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-primary/10 text-xs bg-white text-primary placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/20"
                      />
                      <input
                        type="email"
                        placeholder="Email (Optional)"
                        value={relaxForm.email}
                        onChange={(e) => setRelaxForm({ ...relaxForm, email: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-primary/10 text-xs bg-white text-primary placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                  </div>

                  {/* Visit Date & Arrival Time */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-foreground/50 uppercase mb-1 flex items-center justify-between">
                        <span>Reservation Date *</span>
                        <span className="text-accent font-mono text-[9px] font-bold">
                          {formatDateDDMMYYYY(relaxForm.resDate)}
                        </span>
                      </label>
                      <input
                        type="date"
                        required
                        min={todayStr}
                        value={relaxForm.resDate}
                        onChange={(e) => setRelaxForm({ ...relaxForm, resDate: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-primary/10 text-xs font-semibold text-primary bg-[#FAF6F0] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-foreground/50 uppercase mb-1">
                        Arrival Time *
                      </label>
                      <div className="relative">
                        <select
                          value={relaxForm.arrivalTime}
                          onChange={(e) => setRelaxForm({ ...relaxForm, arrivalTime: e.target.value })}
                          className="w-full appearance-none px-4 py-3 rounded-xl border border-primary/10 text-xs font-semibold text-primary bg-[#FAF6F0] pr-8 focus:outline-none cursor-pointer"
                        >
                          <option value="10:00 AM">10:00 AM (Morning Coffee)</option>
                          <option value="01:00 PM">01:00 PM (Lunch Hour)</option>
                          <option value="04:00 PM">04:00 PM (Afternoon Tea)</option>
                          <option value="07:00 PM">07:00 PM (Evening Vibes)</option>
                          <option value="08:30 PM">08:30 PM (Late Dinner)</option>
                        </select>
                        <ChevronDown className="h-4 w-4 text-primary/60 absolute right-3 top-3.5 pointer-events-none" />
                      </div>
                    </div>
                  </div>

                  {/* Seating Environment & Table Type */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-foreground/50 uppercase mb-1">
                        Indoor / Outdoor *
                      </label>
                      <div className="relative">
                        <select
                          value={relaxForm.seatingArea}
                          onChange={(e) => setRelaxForm({ ...relaxForm, seatingArea: e.target.value })}
                          className="w-full appearance-none px-4 py-3 rounded-xl border border-primary/10 text-xs font-semibold text-primary bg-[#FAF6F0] pr-8 focus:outline-none cursor-pointer"
                        >
                          <option value="Indoor Seating">Indoor Air-Conditioned</option>
                          <option value="Outdoor Terrace">Outdoor Garden Terrace</option>
                        </select>
                        <ChevronDown className="h-4 w-4 text-primary/60 absolute right-3 top-3.5 pointer-events-none" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-foreground/50 uppercase mb-1">
                        Table Type *
                      </label>
                      <div className="relative">
                        <select
                          value={relaxForm.tableType}
                          onChange={(e) => setRelaxForm({ ...relaxForm, tableType: e.target.value })}
                          className="w-full appearance-none px-4 py-3 rounded-xl border border-primary/10 text-xs font-semibold text-primary bg-[#FAF6F0] pr-8 focus:outline-none cursor-pointer"
                        >
                          <option value="2-Seater">2-Seater Cozy Table</option>
                          <option value="4-Seater">4-Seater Standard Table</option>
                          <option value="Family Table">Family Table (6-8 Seats)</option>
                          <option value="Window Seat">Window Seat View</option>
                          <option value="Sofa Seating">Sofa Lounge Seating</option>
                        </select>
                        <ChevronDown className="h-4 w-4 text-primary/60 absolute right-3 top-3.5 pointer-events-none" />
                      </div>
                    </div>
                  </div>

                  {/* Number of Guests & Occasion */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-foreground/50 uppercase mb-1">
                        Number of Guests *
                      </label>
                      <div className="relative">
                        <select
                          value={relaxForm.guests}
                          onChange={(e) => setRelaxForm({ ...relaxForm, guests: e.target.value })}
                          className="w-full appearance-none px-4 py-3 rounded-xl border border-primary/10 text-xs font-semibold text-primary bg-[#FAF6F0] pr-8 focus:outline-none cursor-pointer"
                        >
                          <option value="1 Person">1 Person</option>
                          <option value="2 People">2 People</option>
                          <option value="4 People">4 People</option>
                          <option value="Family (6+)">Family Group (6+)</option>
                        </select>
                        <ChevronDown className="h-4 w-4 text-primary/60 absolute right-3 top-3.5 pointer-events-none" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-foreground/50 uppercase mb-1">
                        Occasion *
                      </label>
                      <div className="relative">
                        <select
                          value={relaxForm.occasion}
                          onChange={(e) => setRelaxForm({ ...relaxForm, occasion: e.target.value })}
                          className="w-full appearance-none px-4 py-3 rounded-xl border border-primary/10 text-xs font-semibold text-primary bg-[#FAF6F0] pr-8 focus:outline-none cursor-pointer"
                        >
                          <option value="Coffee Break">Coffee Break</option>
                          <option value="Casual Visit">Casual Visit</option>
                          <option value="Friends Meetup">Friends Meetup</option>
                          <option value="Family Time">Family Time</option>
                          <option value="Birthday">Birthday Celebration</option>
                        </select>
                        <ChevronDown className="h-4 w-4 text-primary/60 absolute right-3 top-3.5 pointer-events-none" />
                      </div>
                    </div>
                  </div>

                  {/* Special Requests */}
                  <div>
                    <label className="block text-[10px] font-bold text-foreground/50 uppercase mb-1 flex items-center gap-1">
                      <MessageSquare className="h-3 w-3 text-accent" /> Special Requests (Optional)
                    </label>
                    <textarea
                      rows={2}
                      placeholder="High chair needed, quiet corner preferred, birthday candle on dessert..."
                      value={relaxForm.specialRequests}
                      onChange={(e) => setRelaxForm({ ...relaxForm, specialRequests: e.target.value })}
                      className="w-full p-3 rounded-xl border border-primary/10 text-xs bg-[#FAF6F0] text-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isRelaxDateFullyBooked}
                    className="w-full py-4 rounded-full bg-[#EA5A0C] hover:bg-[#EA5A0C]/95 disabled:bg-gray-300 text-white font-bold text-xs shadow-md transition-all uppercase tracking-wider cursor-pointer active:scale-98"
                  >
                    {isRelaxDateFullyBooked ? "Fully Booked for Selected Date" : "Reserve Table Now"}
                  </button>

                </form>

              </div>
            )}

          </div>

          {/* RIGHT DYNAMIC BOOKING SUMMARY COLUMN (5 COLS) */}
          <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-[28px] card-shadow border border-primary/5 space-y-6 sticky top-28">
            
            <div className="flex items-center justify-between border-b border-primary/10 pb-4">
              <h3 className="text-xl font-bold font-serif text-[#5A2E0C]">
                Booking Summary
              </h3>
              <span className="text-[10px] font-extrabold px-3 py-1 bg-[#FAF6F0] border border-primary/10 text-accent rounded-full uppercase tracking-wider">
                {bookingType === "study" ? "Study Workspace" : "Table Reservation"}
              </span>
            </div>

            {/* SUMMARY FOR STUDY WORKSPACE */}
            {bookingType === "study" && (
              <div className="space-y-3.5 text-xs text-foreground/80 font-semibold animate-fade-in">
                <div className="flex justify-between items-center pb-2 border-b border-primary/5">
                  <span className="text-foreground/50 flex items-center gap-1.5">
                    <Laptop className="h-3.5 w-3.5 text-accent" /> Workspace
                  </span>
                  <span className="text-[#5A2E0C] font-bold">{studyForm.workspaceName}</span>
                </div>

                <div className="flex justify-between items-center pb-2 border-b border-primary/5">
                  <span className="text-foreground/50 flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-accent" /> Reservation Date
                  </span>
                  <span className="text-accent font-bold font-mono">
                    {formatDateDDMMYYYY(studyForm.resDate)}
                  </span>
                </div>

                <div className="flex justify-between items-center pb-2 border-b border-primary/5">
                  <span className="text-foreground/50 flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-accent" /> Arrival &amp; Duration
                  </span>
                  <span className="text-[#5A2E0C] font-bold">
                    {studyForm.arrivalTime} ({studyForm.duration})
                  </span>
                </div>

                <div className="flex justify-between items-center pb-2 border-b border-primary/5">
                  <span className="text-foreground/50 flex items-center gap-1.5">
                    <Users className="h-3.5 w-3.5 text-accent" /> Guests &amp; Purpose
                  </span>
                  <span className="text-[#5A2E0C] font-bold">
                    {studyForm.guests} • {studyForm.purpose}
                  </span>
                </div>

                {/* Included Tech Amenities */}
                <div className="p-3 bg-[#FAF6F0] rounded-xl border border-primary/5 space-y-1.5 text-[11px] font-semibold text-primary">
                  <span className="text-[9px] font-bold text-foreground/45 uppercase tracking-wider block">
                    TECH AMENITIES INCLUDED
                  </span>
                  <div className="flex items-center gap-1.5 text-emerald-600">
                    <CheckCircle2 className="h-3.5 w-3.5" /> High-Speed 1 Gbps Wi-Fi
                  </div>
                  <div className="flex items-center gap-1.5 text-emerald-600">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Dedicated Power Outlet Seating
                  </div>
                </div>

                {/* Price Breakdown */}
                <div className="pt-3 border-t border-primary/10 space-y-2 text-xs">
                  <div className="flex justify-between text-foreground/70">
                    <span>Study Pass Fee</span>
                    <span className="font-semibold text-primary">₹{studyBasePrice.toFixed(0)}</span>
                  </div>
                  <div className="flex justify-between text-foreground/70">
                    <span>GST (5%)</span>
                    <span className="font-semibold text-primary">₹{studyTax.toFixed(0)}</span>
                  </div>
                  <div className="flex justify-between text-base font-bold text-primary pt-3 border-t border-primary/10">
                    <span>Total Amount</span>
                    <span className="text-[#EA5A0C] font-serif text-xl">₹{studyGrandTotal.toFixed(0)}</span>
                  </div>
                </div>
              </div>
            )}

            {/* SUMMARY FOR CAFÉ RESERVATION */}
            {bookingType === "relax" && (
              <div className="space-y-3.5 text-xs text-foreground/80 font-semibold animate-fade-in">
                <div className="flex justify-between items-center pb-2 border-b border-primary/5">
                  <span className="text-foreground/50 flex items-center gap-1.5">
                    <Coffee className="h-3.5 w-3.5 text-accent" /> Table Type
                  </span>
                  <span className="text-[#5A2E0C] font-bold">{relaxForm.tableType}</span>
                </div>

                <div className="flex justify-between items-center pb-2 border-b border-primary/5">
                  <span className="text-foreground/50 flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-accent" /> Environment
                  </span>
                  <span className="text-[#5A2E0C] font-bold">{relaxForm.seatingArea}</span>
                </div>

                <div className="flex justify-between items-center pb-2 border-b border-primary/5">
                  <span className="text-foreground/50 flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-accent" /> Reservation Date
                  </span>
                  <span className="text-accent font-bold font-mono">
                    {formatDateDDMMYYYY(relaxForm.resDate)}
                  </span>
                </div>

                <div className="flex justify-between items-center pb-2 border-b border-primary/5">
                  <span className="text-foreground/50 flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-accent" /> Arrival Time
                  </span>
                  <span className="text-[#5A2E0C] font-bold">{relaxForm.arrivalTime}</span>
                </div>

                <div className="flex justify-between items-center pb-2 border-b border-primary/5">
                  <span className="text-foreground/50 flex items-center gap-1.5">
                    <Users className="h-3.5 w-3.5 text-accent" /> Guests &amp; Occasion
                  </span>
                  <span className="text-[#5A2E0C] font-bold">
                    {relaxForm.guests} • {relaxForm.occasion}
                  </span>
                </div>

                {relaxForm.specialRequests && (
                  <div className="p-3 bg-[#FAF6F0] rounded-xl border border-primary/5 text-[11px] font-normal text-foreground/75 italic">
                    &ldquo;{relaxForm.specialRequests}&rdquo;
                  </div>
                )}

                {/* Price Breakdown */}
                <div className="pt-3 border-t border-primary/10 space-y-2 text-xs">
                  <div className="flex justify-between text-foreground/70">
                    <span>Table Cover Charge</span>
                    <span className="font-semibold text-primary">₹{relaxBasePrice.toFixed(0)}</span>
                  </div>
                  <div className="flex justify-between text-foreground/70">
                    <span>GST (5%)</span>
                    <span className="font-semibold text-primary">₹{relaxTax.toFixed(0)}</span>
                  </div>
                  <div className="flex justify-between text-base font-bold text-primary pt-3 border-t border-primary/10">
                    <span>Total Amount</span>
                    <span className="text-[#EA5A0C] font-serif text-xl">₹{relaxGrandTotal.toFixed(0)}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Confirmation CTA button */}
            <button
              onClick={bookingType === "study" ? handleStudySubmit : handleRelaxSubmit}
              disabled={bookingType === "study" ? isStudyDateFullyBooked : isRelaxDateFullyBooked}
              className="w-full py-4 bg-[#EA5A0C] hover:bg-[#EA5A0C]/95 text-white rounded-full text-xs font-bold shadow-md transition-all cursor-pointer inline-flex items-center justify-center gap-2 uppercase tracking-wider active:scale-98"
            >
              <span>Continue to Payment</span>
              <ArrowRight className="h-4 w-4" />
            </button>

            <span className="text-[10px] text-foreground/45 text-center block font-medium">
              By confirming, you agree to our <Link href="/gallery-contact" className="underline">Terms of Service</Link>.
            </span>

          </div>

        </div>

      </div>
    </section>
  );
}
