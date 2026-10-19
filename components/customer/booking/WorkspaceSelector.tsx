"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { isAuthenticated } from "@/lib/auth";
import { getAlternativeSlots, parseDurationHours, AlternativeSlot } from "@/lib/reservation";
import { fetchAllWorkspaces, WorkspaceCardData } from "@/lib/workspaces";
import {
  User, Phone, Mail, Calendar, Coffee, Users,
  CheckCircle2, AlertCircle, Plus, Minus, X, Clock, Armchair, Sparkles
} from "lucide-react";
import { useBooking } from "@/context/BookingContext";
import BookingSummary from "./BookingSummary";
import SearchableTableDropdown from "./SearchableTableDropdown";

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
    selectedSeat,
    reservationDetails,
    updateReservationDetails,
    checkAvailability,
    bookingFee,
    wifiTotal,
    wifiPass,
    foodTotal,
    gst,
    grandTotal,
  } = useBooking();

  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleGuestCountChange = (delta: 1 | -1) => {
    const current = parseInt(reservationDetails.guests, 10) || 1;
    const nextVal = Math.min(20, Math.max(1, current + delta));
    updateReservationDetails({ guests: nextVal.toString() });
  };

  const calculatedEndTime = useMemo(() => {
    return calculateEndTime(
      reservationDetails.arrivalTime || "10:00 AM",
      reservationDetails.duration || "1 Hour"
    );
  }, [reservationDetails.arrivalTime, reservationDetails.duration]);

  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);
  const [isSlotAvailable, setIsSlotAvailable] = useState<boolean | null>(true);
  const [checkError, setCheckError] = useState<string | null>(null);
  const [alternativeSlots, setAlternativeSlots] = useState<AlternativeSlot[]>([]);

  const [workspaceDetails, setWorkspaceDetails] = useState<WorkspaceCardData | null>(null);
  const effectiveWorkspace = selectedSeat?.seat_code || selectedSeat?.id || reservationDetails.tableType || "Window Seat 01";

  useEffect(() => {
    async function loadWorkspaceDetails() {
      try {
        const allSpaces = await fetchAllWorkspaces();
        const found = allSpaces.find(s => s.id === effectiveWorkspace || s.number === effectiveWorkspace || s.name === effectiveWorkspace || s.seat_code === effectiveWorkspace);
        if (found) {
          setWorkspaceDetails(found);
        }
      } catch (err) {
        console.error("Failed to load workspace details", err);
      }
    }
    loadWorkspaceDetails();
  }, [effectiveWorkspace]);

  useEffect(() => {
    let isMounted = true;
    async function verifySlot() {
      setIsCheckingAvailability(true);
      try {
        const avail = await checkAvailability(
          effectiveWorkspace,
          reservationDetails.resDate,
          reservationDetails.arrivalTime || "10:00 AM",
          calculatedEndTime
        );
        if (isMounted) {
          setIsSlotAvailable(avail);
          setCheckError(null);
          if (!avail) {
            const durationHrs = parseDurationHours(reservationDetails.duration);
            const alts = await getAlternativeSlots(
              effectiveWorkspace,
              reservationDetails.resDate,
              reservationDetails.arrivalTime || "10:00 AM",
              durationHrs
            );
            setAlternativeSlots(alts);
          } else {
            setAlternativeSlots([]);
          }
        }
      } catch (err: any) {
        if (isMounted) {
          setIsSlotAvailable(false);
          setCheckError(err.message || "Failed to check seat availability.");
          setAlternativeSlots([]);
        }
      } finally {
        if (isMounted) setIsCheckingAvailability(false);
      }
    }
    verifySlot();
    return () => {
      isMounted = false;
    };
  }, [
    effectiveWorkspace,
    reservationDetails.resDate,
    reservationDetails.arrivalTime,
    reservationDetails.duration,
    calculatedEndTime,
    checkAvailability,
  ]);

  const handleFormSubmit = async () => {
    if (!isAuthenticated()) {
      const msg = encodeURIComponent("Please login to your RoyalCafeConnect account to reserve a seat.");
      router.push(`/login?redirect=/book&message=${msg}`);
      return;
    }

    const guestsNum = parseInt(reservationDetails.guests, 10) || 0;

    if (!reservationDetails.fullName.trim()) {
      alert("Please complete seating and time selection: Enter your Full Name.");
      return;
    }
    if (!reservationDetails.mobile.trim()) {
      alert("Please complete seating and time selection: Enter your Mobile Number.");
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
      alert("Please complete seating and time selection: Select Duration.");
      return;
    }
    if (guestsNum <= 0) {
      alert("Please complete seating and time selection: Number of guests must be at least 1.");
      return;
    }

    setIsSubmitting(true);

    try {
      const isAvailable = await checkAvailability(
        effectiveWorkspace,
        reservationDetails.resDate,
        reservationDetails.arrivalTime,
        calculatedEndTime
      );

      if (!isAvailable) {
        alert("The selected seat is no longer available for this time. Please select another time.");
        setIsSubmitting(false);
        return;
      }

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
        purpose: reservationDetails.occasion || "",
        amount: grandTotal.toString(),
        seatAmount: bookingFee.toString(),
        wifiPassAmount: wifiTotal.toString(),
        wifiPassName: wifiPass?.name || "",
        wifiPassDuration: wifiPass?.duration || "",
        foodAndDrinksTotal: foodTotal.toString(),
        gstAmount: gst.toString(),
        specialRequests: reservationDetails.specialRequests || "",
      }).toString();

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

      router.push(`/confirmation?${queryParams}`);
    } catch (err: any) {
      console.error("Booking error:", err);
      alert(err.message || "Unable to create booking. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="pb-24 pt-32 bg-background text-foreground font-sans">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-10 items-start">
          
          {/* LEFT COLUMN: Seating Details Card */}
          <div className="bg-surface rounded-3xl border border-border shadow-[0_8px_30px_rgba(10,5,3,0.04)] overflow-hidden sticky top-28">
            {workspaceDetails ? (
              <div className="flex flex-col">
                <div className="h-48 w-full bg-muted relative">
                  <img src={workspaceDetails.image} alt={workspaceDetails.name} className="w-full h-full object-cover" />
                </div>
                <div className="p-8 space-y-5 text-left">
                  <div>
                    <h3 className="font-bold text-2xl text-primary font-serif">{workspaceDetails.name}</h3>
                    <p className="text-xs font-semibold text-foreground/80 mt-1 uppercase tracking-widest">
                      {workspaceDetails.seatType} • {workspaceDetails.zone}
                    </p>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {workspaceDetails.amenities.map((am, i) => (
                      <span key={i} className="text-xs font-semibold bg-background text-primary px-3 py-1 rounded-md border border-border tracking-wide uppercase">
                        ✓ {am}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-5 border-t border-border">
                    <span className="font-semibold text-primary text-xl">{workspaceDetails.price}</span>
                    <span className="text-xs uppercase tracking-wider font-semibold text-foreground/80 flex items-center gap-1.5">
                      <Users className="w-4 h-4 text-accent"/> Capacity: {workspaceDetails.capacity}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-6 text-center text-sm font-bold text-foreground/80">
                <div className="flex items-center justify-center gap-2">
                  <Armchair className="w-5 h-5 animate-pulse text-[#8C4A21]" />
                  Loading Seating Details...
                </div>
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: Booking Form */}
          <div className="bg-surface p-8 sm:p-10 rounded-3xl border border-border shadow-[0_8px_30px_rgba(10,5,3,0.04)] space-y-8">
            
            <div className="border-b border-border pb-6 text-left">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-background text-accent text-xs font-semibold uppercase tracking-[0.2em] mb-4 border border-border">
                <Calendar className="h-3.5 w-3.5" /> Seat Reservation Configuration
              </div>
              {/* Header */}
          <div className="flex flex-col mb-2">
            <h3 className="text-2xl sm:text-3xl font-bold font-serif text-primary">
              Select Your Cafe Space
            </h3>
            <p className="text-sm text-foreground/70 mt-2 font-medium">
              Choose from available seating areas, booths, and tables.
            </p>
          </div>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleFormSubmit();
              }}
              className="space-y-6 text-left"
            >
              {/* Booking Configuration Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-left border-b border-border pb-8">
                <div>
                  <label className="block text-xs font-semibold text-primary uppercase tracking-[0.1em] mb-2">Select Date *</label>
                  <div className="relative">
                    <Calendar className="h-4 w-4 text-primary/80 absolute left-4 top-3.5 pointer-events-none" />
                    <input
                      type="date"
                      min={todayStr}
                      value={reservationDetails.resDate}
                      onChange={(e) => handleInputChange("resDate", e.target.value)}
                      className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-border text-xs bg-background focus:bg-surface text-foreground font-medium outline-none focus:border-accent focus:ring-1 focus:ring-accent/20 transition-all cursor-pointer"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-primary uppercase tracking-[0.1em] mb-2">Select Start Time *</label>
                  <select
                    value={reservationDetails.arrivalTime}
                    onChange={(e) => handleInputChange("arrivalTime", e.target.value)}
                    className="w-full px-4 py-3.5 rounded-2xl border border-border text-xs bg-background focus:bg-surface text-foreground font-medium outline-none focus:border-accent focus:ring-1 focus:ring-accent/20 transition-all cursor-pointer"
                  >
                    {["08:00 AM", "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM", "06:00 PM", "07:00 PM", "08:00 PM"].map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-primary uppercase tracking-[0.1em] mb-2">Select Duration *</label>
                  <select
                    value={reservationDetails.duration}
                    onChange={(e) => handleInputChange("duration", e.target.value)}
                    className="w-full px-4 py-3.5 rounded-2xl border border-border text-xs bg-background focus:bg-surface text-foreground font-medium outline-none focus:border-accent focus:ring-1 focus:ring-accent/20 transition-all cursor-pointer"
                  >
                    <option value="1 Hour">1 Hour</option>
                    <option value="2 Hours">2 Hours</option>
                    <option value="3 Hours">3 Hours</option>
                    <option value="4 Hours">4 Hours</option>
                    <option value="Half Day">Half Day (4 Hours)</option>
                    <option value="Full Day">Full Day (8 Hours)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-primary uppercase tracking-[0.1em] mb-2">Calculated Time Range</label>
                  <div className="w-full px-4 py-3.5 rounded-2xl border border-border bg-background text-primary text-xs font-semibold flex items-center justify-center">
                    {reservationDetails.arrivalTime} — {calculatedEndTime} ({reservationDetails.duration})
                  </div>
                </div>
              </div>

              {/* LIVE CONTINUOUS AVAILABILITY BADGE & ALTERNATIVE SLOTS */}
              <div className="pt-2 text-left">
                {isCheckingAvailability ? (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-xs font-bold animate-pulse">
                    <Clock className="w-3.5 h-3.5" /> Checking continuous availability...
                  </div>
                ) : checkError ? (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-red-800 border border-red-300 text-xs font-extrabold">
                    <AlertCircle className="w-3.5 h-3.5 text-red-600" /> {checkError}
                  </div>
                ) : isSlotAvailable ? (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-300 text-xs font-extrabold">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> This seat is available for the selected duration
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="p-4 rounded-xl bg-rose-50 text-rose-800 border border-rose-300 text-xs font-medium space-y-2">
                      <p className="flex items-center gap-1.5 font-extrabold text-sm">
                        <X className="w-4 h-4 text-rose-600" /> This seat is not available for the selected {reservationDetails.duration.toLowerCase()} ({reservationDetails.arrivalTime} — {calculatedEndTime}).
                      </p>
                      <p>The seat is booked for part of this time range. Please select an available alternative:</p>
                    </div>
                    {alternativeSlots.length > 0 && (
                      <div className="p-4 bg-amber-50/90 border border-amber-200 rounded-xl space-y-2 text-left">
                        <div className="flex flex-wrap gap-2 pt-1">
                          {alternativeSlots.map((slot, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => {
                                updateReservationDetails({
                                  arrivalTime: slot.startTime,
                                });
                              }}
                              className="px-3 py-1.5 text-xs font-bold bg-surface text-primary hover:bg-surface border border-primary/20 rounded-lg shadow-sm transition-all cursor-pointer flex items-center gap-1.5"
                            >
                              <span className="text-xs">🟢</span>
                              {slot.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* SECTION 1: GUEST DETAILS */}
              <div className="space-y-4 pt-6 border-t border-border">
                <h3 className="text-xs font-semibold text-primary uppercase tracking-[0.15em] flex items-center gap-2 pb-2">
                  <User className="h-4 w-4 text-accent" />
                  Guest Details
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="relative">
                    <User className="h-4 w-4 text-primary/80 absolute left-4 top-3.5 pointer-events-none" />
                    <input
                      type="text"
                      required
                      placeholder="Full Name *"
                      value={reservationDetails.fullName}
                      onChange={(e) => handleInputChange("fullName", e.target.value)}
                      className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-border text-xs bg-background focus:bg-surface text-foreground font-medium outline-none focus:border-accent focus:ring-1 focus:ring-accent/20 transition-all"
                    />
                  </div>

                  <div className="relative">
                    <Phone className="h-4 w-4 text-foreground/80 absolute left-3.5 top-3.5 pointer-events-none" />
                    <input
                      type="tel"
                      required
                      placeholder="Mobile Number *"
                      value={reservationDetails.mobile}
                      onChange={(e) => handleInputChange("mobile", e.target.value)}
                      className="w-full pl-10 pr-3.5 py-3 rounded-[14px] border border-primary/15 text-xs bg-surface/60 focus:bg-surface text-primary font-medium outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                    />
                  </div>

                  <div className="relative">
                    <Mail className="h-4 w-4 text-foreground/80 absolute left-3.5 top-3.5 pointer-events-none" />
                    <input
                      type="email"
                      placeholder="Email Address (Optional)"
                      value={reservationDetails.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      className="w-full pl-10 pr-3.5 py-3 rounded-[14px] border border-primary/15 text-xs bg-surface/60 focus:bg-surface text-primary font-medium outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 2: SEATING PREFERENCES */}
              <div className="space-y-4 pt-6 border-t border-border">
                <h3 className="text-xs font-semibold text-primary uppercase tracking-[0.15em] flex items-center gap-2 pb-2">
                  <Coffee className="h-4 w-4 text-accent" />
                  Seating Preferences
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
                  <div>
                    <label className="block text-xs font-semibold text-primary uppercase tracking-[0.1em] mb-2">
                      Environment *
                    </label>
                    <select
                      value={selectedSeat?.zone || reservationDetails.seatingArea}
                      onChange={(e) => handleInputChange("seatingArea", e.target.value)}
                      disabled={!!selectedSeat}
                      className="w-full px-4 py-3.5 rounded-2xl border border-border text-xs bg-background focus:bg-surface text-foreground font-medium outline-none focus:border-accent transition-all cursor-pointer disabled:opacity-80"
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

                  <SearchableTableDropdown
                    value={selectedSeat?.seatType || reservationDetails.tableType}
                    onChange={(val) => handleInputChange("tableType", val)}
                  />

                  <div>
                    <label className="block text-xs font-semibold text-primary uppercase tracking-[0.1em] mb-2">
                      Number of People * (1 to 20)
                    </label>
                    <div className="flex items-center rounded-2xl border border-border bg-background focus-within:bg-surface focus-within:border-accent transition-all overflow-hidden p-1 shadow-sm">
                      <button
                        type="button"
                        onClick={() => handleGuestCountChange(-1)}
                        className="h-10 w-10 rounded-xl bg-surface hover:bg-accent hover:text-primary text-primary flex items-center justify-center transition-all cursor-pointer shrink-0 border border-border shadow-sm"
                        aria-label="Decrease guest count"
                      >
                        <Minus className="h-4 w-4" />
                      </button>

                      <div className="flex-1 relative flex items-center justify-center px-2">
                        <Users className="h-4 w-4 text-primary/80 absolute left-2 pointer-events-none" />
                        <input
                          type="number"
                          min={1}
                          max={20}
                          value={reservationDetails.guests}
                          onChange={(e) => handleInputChange("guests", e.target.value)}
                          className="w-full text-center pl-4 pr-1 py-1 font-semibold text-xs bg-transparent text-foreground outline-none"
                        />
                      </div>

                      <button
                        type="button"
                        onClick={() => handleGuestCountChange(1)}
                        className="h-10 w-10 rounded-xl bg-surface hover:bg-accent hover:text-primary text-primary flex items-center justify-center transition-all cursor-pointer shrink-0 border border-border shadow-sm"
                        aria-label="Increase guest count"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* SPECIAL REQUEST */}
              <div className="space-y-4 pt-6 border-t border-border">
                <h3 className="text-xs font-semibold text-primary uppercase tracking-[0.15em] flex items-center gap-2 pb-2">
                  <Sparkles className="h-4 w-4 text-accent" />
                  Special Requests (Optional)
                </h3>
                <textarea
                  value={reservationDetails.specialRequests || ""}
                  onChange={(e) => handleInputChange("specialRequests", e.target.value)}
                  placeholder="Any special accommodations or requests?"
                  className="w-full px-4 py-4 rounded-2xl border border-border text-xs bg-background focus:bg-surface text-foreground font-medium outline-none focus:border-accent focus:ring-1 focus:ring-accent/20 transition-all min-h-[100px]"
                ></textarea>
              </div>

              {/* RESERVATION DETAILS, PAYMENT SUMMARY & CONFIRMATION ACTION */}
              <div className="pt-2">
                <BookingSummary
                  onConfirmBooking={handleFormSubmit}
                  isSubmitting={isSubmitting || isSlotAvailable === false || !!checkError}
                />
              </div>

            </form>
          </div>
        </div>
      </div>
    </section>
  );
}