"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  X,
  Clock,
  Timer,
  Users,
  Armchair,
  Sparkles,
  ArrowRight,
  Loader2,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Zap,
  ChevronRight,
  Info,
  Check,
  Sliders,
  ShieldCheck,
  CreditCard
} from "lucide-react";
import { useBooking } from "@/context/BookingContext";
import { SeatDetails } from "./SeatMap";
import { isAuthenticated } from "@/lib/auth";

interface SlidingBookingPanelProps {
  selectedSeat: SeatDetails | null;
  isOpen: boolean;
  onClose: () => void;
  onSelectSeat?: (seat: SeatDetails) => void;
}

export interface WorkspaceTimeSlot {
  id: string;
  slotText: string;
  startTime: string;
  endTime: string;
  duration: string;
  dateText: string;
  isAvailable: boolean;
}

const DEMO_ALTERNATIVES: SeatDetails[] = [
  { id: "T-SS-9", number: "9", zone: "Quiet Zone", area: "Work & Study Zone", seatType: "Single Seater Workstation", status: "available" },
  { id: "T-SS-10", number: "10", zone: "Quiet Zone", area: "Work & Study Zone", seatType: "Single Seater Workstation", status: "available" },
  { id: "T-2S-12", number: "12", zone: "Quiet Zone", area: "Work & Study Zone", seatType: "2 Seater Desk", status: "available" },
  { id: "T-PB6-2", number: "B2", zone: "Quiet Zone", area: "Work & Study Zone", seatType: "Private Cabin (6 Seater)", status: "available", availableAfter: "Available after 30 mins" },
];

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

    if (addHrs === 0 && addMins === 0) addHrs = 1; // Default 1 hour

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

export default function SlidingBookingPanel({
  selectedSeat,
  isOpen,
  onClose,
  onSelectSeat,
}: SlidingBookingPanelProps) {
  const router = useRouter();
  const { setSelectedSeat, updateReservationDetails, reservationDetails } = useBooking();

  // State setup with DEFAULT 1 Hour duration & Arrival Time
  const [arrivalTime, setArrivalTime] = useState(reservationDetails.arrivalTime || "10:00 AM");
  const [duration, setDuration] = useState("1 Hour"); // Default 1 Hour!
  const [numberOfPeople, setNumberOfPeople] = useState(reservationDetails.guests || "1");
  const [isNavigating, setIsNavigating] = useState(false);

  // Time picker dropdown states (Hour, Minute, Period)
  const [pickerHour, setPickerHour] = useState("10");
  const [pickerMinute, setPickerMinute] = useState("00");
  const [pickerPeriod, setPickerPeriod] = useState("AM");

  // Custom duration states (Hours, Minutes)
  const [isCustomDurationMode, setIsCustomDurationMode] = useState(false);
  const [customHours, setCustomHours] = useState("2");
  const [customMinutes, setCustomMinutes] = useState("30");

  // Selected Time Slot override when choosing an alternative time for reserved/occupied desk
  const [selectedSlotOverride, setSelectedSlotOverride] = useState<WorkspaceTimeSlot | null>(null);

  // Dynamic available time slots for the SAME workspace
  const getSameWorkspaceTimeSlots = (seat: SeatDetails): WorkspaceTimeSlot[] => {
    if (seat.id.includes("SS") || seat.id.includes("2S")) {
      return [
        { id: "slot-1", slotText: "09:00 AM - 10:00 PM", startTime: "09:00 AM", endTime: "10:00 PM", duration: "1 Hours", dateText: "Today", isAvailable: true },
        { id: "slot-2", slotText: "05:30 PM - 06:30 PM", startTime: "05:30 PM", endTime: "06:30 PM", duration: "1 Hours", dateText: "Today", isAvailable: true },
        { id: "slot-3", slotText: "Tomorrow 09:00 AM - 10:00 PM", startTime: "09:00 AM", endTime: "10:00 PM", duration: "1 Hours", dateText: "Tomorrow", isAvailable: true },
      ];
    }
    return [
      { id: "slot-1", slotText: "08:00 AM - 09:00 AM", startTime: "08:00 AM", endTime: "09:00 AM", duration: "1 Hours", dateText: "Today", isAvailable: true },
      { id: "slot-2", slotText: "05:30 PM - 07:30 PM", startTime: "05:30 PM", endTime: "07:30 PM", duration: "2 Hours", dateText: "Today", isAvailable: true },
      { id: "slot-3", slotText: "Tomorrow 10:00 AM - 02:00 PM", startTime: "10:00 AM", endTime: "02:00 PM", duration: "4 Hours", dateText: "Tomorrow", isAvailable: true },
    ];
  };

  // Sync state when selectedSeat changes
  useEffect(() => {
    if (selectedSeat) {
      setSelectedSlotOverride(null);
      setDuration("1 Hour"); // Always default to 1 Hour!
      setIsCustomDurationMode(false);

      if (arrivalTime) {
        const match = arrivalTime.match(/(\d+):(\d+)\s*(AM|PM)/i);
        if (match) {
          setPickerHour(match[1].padStart(2, "0"));
          setPickerMinute(match[2].padStart(2, "0"));
          setPickerPeriod(match[3].toUpperCase());
        }
      }
    }
  }, [selectedSeat]);

  // Update arrivalTime string whenever time picker dropdowns change
  const handleTimePickerChange = (h: string, m: string, p: string) => {
    setPickerHour(h);
    setPickerMinute(m);
    setPickerPeriod(p);
    setArrivalTime(`${h}:${m} ${p}`);
  };

  // Update custom duration string
  const handleCustomDurationChange = (h: string, m: string) => {
    setCustomHours(h);
    setCustomMinutes(m);
    const hNum = parseInt(h, 10) || 0;
    const mNum = parseInt(m, 10) || 0;
    if (hNum > 0 && mNum > 0) {
      setDuration(`${hNum} Hour${hNum > 1 ? "s" : ""} ${mNum} Minutes`);
    } else if (hNum > 0) {
      setDuration(`${hNum} Hour${hNum > 1 ? "s" : ""}`);
    } else if (mNum > 0) {
      setDuration(`${mNum} Minutes`);
    } else {
      setDuration("1 Hour");
    }
  };

  // Calculated End Time
  const calculatedEndTime = useMemo(() => {
    return calculateEndTime(arrivalTime, duration);
  }, [arrivalTime, duration]);

  if (!isOpen || !selectedSeat) return null;

  const seatStatus = selectedSeat.status || "available";
  const isOriginallyAvailable = seatStatus === "available" || seatStatus === "selected";
  const isReserved = seatStatus === "reserved";
  const isOccupied = seatStatus === "occupied";
  const isMaintenance = seatStatus === "maintenance";

  // If user selected an available time slot override for a reserved/occupied seat, enable booking!
  const isBookingExecutable = isOriginallyAvailable || selectedSlotOverride !== null;

  // Available Time Slots for current workspace
  const sameWorkspaceSlots = getSameWorkspaceTimeSlots(selectedSeat);

  // Format seat number cleanly
  const formattedSeatNumber = selectedSeat.number.toLowerCase().startsWith("seat")
    ? selectedSeat.number
    : selectedSeat.number.startsWith("A") || selectedSeat.number.startsWith("L") || selectedSeat.number.startsWith("B")
      ? `Seat ${selectedSeat.number}`
      : `Seat #${selectedSeat.number}`;

  const formattedZone = selectedSeat.zone || selectedSeat.area || "Study & Work";

  const isFormValid =
    arrivalTime.trim() !== "" &&
    duration.trim() !== "" &&
    numberOfPeople.trim() !== "" &&
    parseInt(numberOfPeople, 10) > 0;

  const quickDurationPresets = ["30 Minutes", "1 Hour", "2 Hours", "3 Hours", "4 Hours", "Half Day"];

  const handleSelectSlotOverride = (slot: WorkspaceTimeSlot) => {
    setSelectedSlotOverride(slot);
    setArrivalTime(slot.startTime);
    setDuration(slot.duration);
  };

  const handleContinue = () => {
    if (!isBookingExecutable || !isFormValid || isNavigating) return;

    setIsNavigating(true);

    const derivedSeatType =
      selectedSeat.seatType ||
      (selectedSeat.area?.includes("Single")
        ? "Single Seater"
        : selectedSeat.area?.includes("2-Seater")
          ? "2 Seater"
          : selectedSeat.area?.includes("4-Seater")
            ? "4 Seater"
            : selectedSeat.area?.includes("Booths")
              ? "Private Booths (6 Seater)"
              : selectedSeat.area?.includes("Kids")
                ? "Kids Zone"
                : selectedSeat.area?.includes("Elder")
                  ? "Elder Friendly"
                  : "2 Seater");

    setSelectedSeat({
      id: selectedSeat.id,
      number: selectedSeat.number,
      seatNumber: formattedSeatNumber,
      zone: formattedZone,
      seatType: derivedSeatType,
      area: selectedSeat.area,
    });

    updateReservationDetails({
      arrivalTime: selectedSlotOverride ? selectedSlotOverride.startTime : arrivalTime,
      duration: selectedSlotOverride ? selectedSlotOverride.duration : duration,
      guests: numberOfPeople,
      seatingArea: formattedZone,
      tableType: derivedSeatType,
    });

    setTimeout(() => {
      if (!isAuthenticated()) {
        const msg = encodeURIComponent("Please login to your RoyalCafeConnect account to book a workspace.");
        router.push(`/login?redirect=/book&message=${msg}`);
      } else {
        router.push("/book");
      }
    }, 400);
  };

  return (
    <>
      {/* Backdrop overlay */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-xs z-40 transition-opacity duration-300 animate-in fade-in"
        onClick={onClose}
      />

      {/* Right Side Sliding Drawer Panel (Desktop Side Modal / Mobile Bottom Sheet) */}
      <div className="fixed top-0 right-0 h-full w-full max-w-md bg-[#FFFDF9] z-50 shadow-2xl flex flex-col justify-between overflow-y-auto font-sans transition-transform duration-300 ease-in-out animate-in slide-in-from-right text-[#3D2314]">

        {/* Panel Header */}
        <div className="p-6 bg-gradient-to-r from-[#2A1506] to-[#42220C] text-white flex items-center justify-between shadow-md shrink-0">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-[#8C4A21] text-white flex items-center justify-center font-bold shadow-xs">
              <Armchair className="h-5 w-5" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold text-amber-300 uppercase tracking-widest block">
                RoyalCafe Connect
              </span>
              <h2 className="text-xl font-bold font-serif tracking-tight text-amber-50">
                Workspace Booking &amp; Time
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            aria-label="Close booking panel"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Panel Body Content */}
        <div className="p-6 space-y-6 flex-1 bg-[#FFFDF9]">

          {/* Selected Desk ID & Status Highlight Banner */}
          <div className="bg-[#FAF4ED] p-4 rounded-2xl border border-[#DFCDBE] space-y-2 shadow-xs">
            <div className="flex items-center justify-between border-b border-[#DFCDBE]/60 pb-2">
              <span className="text-[11px] font-extrabold text-[#8C4A21] uppercase tracking-wider">
                DESK ID / SEAT
              </span>
              <span className="text-xs font-mono font-bold text-[#3D2314] bg-[#FFFDF9] px-3 py-1 rounded-full border border-[#DFCDBE]">
                {selectedSeat.id} ({formattedSeatNumber})
              </span>
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-[11px] font-extrabold text-[#8C4A21] uppercase tracking-wider">
                WORKSPACE TYPE
              </span>
              <span className="text-xs font-bold text-[#3D2314]">
                {selectedSeat.seatType || selectedSeat.area}
              </span>
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-[11px] font-extrabold text-[#8C4A21] uppercase tracking-wider">
                CURRENT STATUS
              </span>
              <span
                className={`px-3 py-0.5 rounded-full text-[11px] font-extrabold uppercase ${isOriginallyAvailable
                    ? "bg-emerald-500/15 text-emerald-800 border border-emerald-500/30"
                    : isReserved
                      ? "bg-amber-500/15 text-amber-800 border border-amber-500/30"
                      : isOccupied
                        ? "bg-rose-500/15 text-rose-800 border border-rose-500/30"
                        : "bg-slate-500/15 text-slate-800 border border-slate-500/30"
                  }`}
              >
                {seatStatus}
              </span>
            </div>
          </div>

          {/* STATUS MESSAGES FOR RESERVED / OCCUPIED DESKS */}
          {isReserved && (
            <div className="bg-amber-500/10 p-3.5 rounded-2xl border border-amber-500/30 space-y-1 text-xs">
              <div className="flex items-center gap-2 text-amber-900 font-bold">
                <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0" />
                <span>This workspace is unavailable at the selected time, but you can choose another available slot.</span>
              </div>
              <p className="text-[11px] text-amber-800">
                Current Booking: <strong className="font-mono">{selectedSeat.reservedTime || "02:00 PM - 05:00 PM"}</strong>
              </p>
            </div>
          )}

          {isOccupied && (
            <div className="bg-rose-500/10 p-3.5 rounded-2xl border border-rose-500/30 space-y-1 text-xs">
              <div className="flex items-center gap-2 text-rose-900 font-bold">
                <AlertTriangle className="w-4 h-4 text-rose-700 shrink-0" />
                <span>This workspace is currently in use. Select a later available time slot.</span>
              </div>
              <p className="text-[11px] text-rose-800">
                Expected Checkout: <strong className="font-mono">{selectedSeat.occupiedUntil || "06:30 PM"}</strong>
              </p>
            </div>
          )}

          {isMaintenance && (
            <div className="bg-slate-500/10 p-3.5 rounded-2xl border border-slate-500/30 text-xs text-slate-800 space-y-1">
              <div className="font-bold flex items-center gap-2">
                <Info className="w-4 h-4 text-slate-700" />
                <span>This workspace is currently under maintenance.</span>
              </div>
              <p className="text-[11px] text-slate-600">Please choose an alternative workspace below.</p>
            </div>
          )}

          {/* SECTION 1: AVAILABLE TIME SLOTS FOR THIS WORKSPACE */}
          {(!isOriginallyAvailable || selectedSlotOverride !== null) && !isMaintenance && (
            <div className="space-y-3 p-4 bg-[#FAF4ED] rounded-2xl border border-[#DFCDBE]">
              <div className="flex items-center justify-between border-b border-[#DFCDBE]/60 pb-2">
                <span className="text-xs font-bold text-[#3D2314] flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-[#8C4A21]" /> Available Time Slots for {selectedSeat.id}
                </span>
                <span className="text-[10px] font-extrabold text-[#8C4A21] bg-[#FFFDF9] px-2 py-0.5 rounded-full border border-[#DFCDBE]">
                  Same Desk
                </span>
              </div>

              <div className="space-y-2 text-xs">
                {sameWorkspaceSlots.map((slot) => {
                  const isSelectedSlot = selectedSlotOverride?.id === slot.id;

                  return (
                    <div
                      key={slot.id}
                      className={`p-3 rounded-xl border flex items-center justify-between transition-all ${isSelectedSlot
                          ? "bg-[#3D2314] text-white border-[#3D2314] shadow-sm"
                          : "bg-[#FFFDF9] hover:bg-[#F3E9DD] border-[#DFCDBE] text-[#3D2314]"
                        }`}
                    >
                      <div className="space-y-0.5">
                        <div className="font-bold flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${isSelectedSlot ? "bg-amber-300" : "bg-emerald-500"}`} />
                          <span className="font-mono">{slot.slotText}</span>
                        </div>
                        <div className={`text-[10px] ${isSelectedSlot ? "text-amber-200" : "text-[#7A5A43]"}`}>
                          Duration: {slot.duration} • {slot.dateText}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleSelectSlotOverride(slot)}
                        className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all cursor-pointer flex items-center gap-1 ${isSelectedSlot
                            ? "bg-amber-400 text-[#3D2314]"
                            : "bg-[#FAF4ED] hover:bg-[#8C4A21] hover:text-white text-[#8C4A21] border border-[#DFCDBE]"
                          }`}
                      >
                        {isSelectedSlot ? <><Check className="w-3.5 h-3.5" /> Selected</> : "Select Slot"}
                      </button>
                    </div>
                  );
                })}
              </div>

              {selectedSlotOverride && (
                <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-900 text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Selected Slot: {selectedSlotOverride.slotText} ({selectedSeat.id})</span>
                </div>
              )}
            </div>
          )}

          {/* FORM CONTROLS FOR ORIGINALLY AVAILABLE OR OVERRIDDEN SLOTS */}
          {isBookingExecutable && (
            <div className="space-y-5">
              {/* TIME SELECTOR UI: MODERN TIME PICKER */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#3D2314] flex items-center gap-2">
                    <Clock className="h-4 w-4 text-[#8C4A21]" />
                    Arrival Start Time
                  </label>
                  <span className="text-[11px] font-bold text-[#8C4A21] bg-[#FAF4ED] px-2.5 py-0.5 rounded-full border border-[#DFCDBE]">
                    {arrivalTime}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 bg-[#FAF4ED] p-3 rounded-2xl border border-[#DFCDBE]">
                  {/* Hour Select */}
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-[#7A5A43] block">Hour</span>
                    <select
                      value={pickerHour}
                      onChange={(e) => handleTimePickerChange(e.target.value, pickerMinute, pickerPeriod)}
                      className="w-full p-2 bg-[#FFFDF9] border border-[#DFCDBE] rounded-xl text-xs font-bold text-[#3D2314] focus:outline-none focus:ring-2 focus:ring-[#8C4A21]/30 cursor-pointer"
                    >
                      {["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"].map((h) => (
                        <option key={h} value={h}>{h}</option>
                      ))}
                    </select>
                  </div>

                  {/* Minute Select */}
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-[#7A5A43] block">Minute</span>
                    <select
                      value={pickerMinute}
                      onChange={(e) => handleTimePickerChange(pickerHour, e.target.value, pickerPeriod)}
                      className="w-full p-2 bg-[#FFFDF9] border border-[#DFCDBE] rounded-xl text-xs font-bold text-[#3D2314] focus:outline-none focus:ring-2 focus:ring-[#8C4A21]/30 cursor-pointer"
                    >
                      {["00", "15", "30", "45"].map((m) => (
                        <option key={m} value={m}>{m}</option>
                      ))}
                    </select>
                  </div>

                  {/* Period AM/PM Select */}
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-[#7A5A43] block">Period</span>
                    <select
                      value={pickerPeriod}
                      onChange={(e) => handleTimePickerChange(pickerHour, pickerMinute, e.target.value)}
                      className="w-full p-2 bg-[#FFFDF9] border border-[#DFCDBE] rounded-xl text-xs font-bold text-[#3D2314] focus:outline-none focus:ring-2 focus:ring-[#8C4A21]/30 cursor-pointer"
                    >
                      <option value="AM">AM</option>
                      <option value="PM">PM</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* DURATION SELECTOR: QUICK PRESETS & CUSTOM DURATION */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#3D2314] flex items-center gap-2">
                    <Timer className="h-4 w-4 text-[#8C4A21]" />
                    Booking Duration (Default: 1 Hour)
                  </label>

                  <button
                    type="button"
                    onClick={() => setIsCustomDurationMode(!isCustomDurationMode)}
                    className="text-[11px] font-extrabold text-[#8C4A21] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Sliders className="w-3.5 h-3.5" />
                    {isCustomDurationMode ? "Quick Presets" : "Customize Duration"}
                  </button>
                </div>

                {!isCustomDurationMode ? (
                  /* Quick Duration Presets */
                  <div className="grid grid-cols-3 gap-2">
                    {quickDurationPresets.map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => setDuration(opt)}
                        className={`py-2 px-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer text-center ${duration === opt
                            ? "bg-[#3D2314] text-white shadow-xs scale-[1.02]"
                            : "bg-[#FAF4ED] text-[#7A5A43] border border-[#DFCDBE] hover:bg-[#8C4A21] hover:text-white"
                          }`}
                      >
                        {opt} {opt === "1 Hour" ? "(Default)" : ""}
                      </button>
                    ))}
                  </div>
                ) : (
                  /* Custom Duration Input Fields */
                  <div className="p-3.5 bg-[#FAF4ED] rounded-2xl border border-[#DFCDBE] space-y-2">
                    <span className="text-[10px] font-extrabold text-[#7A5A43] uppercase block">
                      Custom Duration Setup
                    </span>
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div className="space-y-1">
                        <label className="font-bold text-[#3D2314]">Hours</label>
                        <select
                          value={customHours}
                          onChange={(e) => handleCustomDurationChange(e.target.value, customMinutes)}
                          className="w-full p-2 bg-[#FFFDF9] border border-[#DFCDBE] rounded-xl font-bold"
                        >
                          {["0", "1", "2", "3", "4", "5", "6", "7", "8"].map((h) => (
                            <option key={h} value={h}>{h} Hours</option>
                          ))}
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="font-bold text-[#3D2314]">Minutes</label>
                        <select
                          value={customMinutes}
                          onChange={(e) => handleCustomDurationChange(customHours, e.target.value)}
                          className="w-full p-2 bg-[#FFFDF9] border border-[#DFCDBE] rounded-xl font-bold"
                        >
                          {["00", "15", "30", "45"].map((m) => (
                            <option key={m} value={m}>{m} Mins</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* AUTOMATIC END TIME / CHECKOUT CALCULATION BADGE */}
              <div className="bg-gradient-to-r from-[#FAF4ED] to-[#F3E9DD] p-3.5 rounded-2xl border border-[#DFCDBE] flex items-center justify-between text-xs">
                <div className="space-y-0.5">
                  <span className="text-[10px] font-extrabold uppercase text-[#8C4A21] tracking-wider block">
                    AUTOMATIC END TIME / CHECKOUT
                  </span>
                  <span className="text-xs font-bold text-[#7A5A43]">
                    {arrivalTime} + {duration}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-black font-mono text-[#3D2314] block">
                    🏁 Ends At: {calculatedEndTime}
                  </span>
                </div>
              </div>

              {/* Number of People */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-[#3D2314] flex items-center gap-2">
                  <Users className="h-4 w-4 text-[#8C4A21]" />
                  Number of Guests
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={numberOfPeople}
                    onChange={(e) => setNumberOfPeople(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl border border-[#DFCDBE] bg-white text-xs font-bold text-[#3D2314]"
                  />
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        const val = Math.max(1, (parseInt(numberOfPeople, 10) || 1) - 1);
                        setNumberOfPeople(val.toString());
                      }}
                      className="h-10 w-10 rounded-xl bg-[#FAF4ED] hover:bg-[#8C4A21] hover:text-white flex items-center justify-center font-bold text-sm text-[#3D2314] border border-[#DFCDBE] transition-colors cursor-pointer"
                    >
                      -
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const val = (parseInt(numberOfPeople, 10) || 1) + 1;
                        setNumberOfPeople(val.toString());
                      }}
                      className="h-10 w-10 rounded-xl bg-[#FAF4ED] hover:bg-[#8C4A21] hover:text-white flex items-center justify-center font-bold text-sm text-[#3D2314] border border-[#DFCDBE] transition-colors cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* BOOKING SUMMARY PREVIEW CARD */}
              <div className="bg-[#FAF4ED] p-4 rounded-2xl border border-[#DFCDBE] space-y-2 text-xs">
                <div className="text-[10px] font-extrabold uppercase tracking-wider text-[#7A5A43] border-b border-[#DFCDBE]/60 pb-1.5 flex justify-between items-center">
                  <span>Booking Summary Preview</span>
                  <span className="font-mono text-[#8C4A21]">07 Aug 2026</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#7A5A43]">Workspace Desk:</span>
                  <span className="font-mono font-bold text-[#3D2314]">{selectedSeat.id} ({selectedSeat.seatType || selectedSeat.area})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#7A5A43]">Arrival &amp; Duration:</span>
                  <span className="font-bold text-[#3D2314]">{arrivalTime} ({duration})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#7A5A43]">Calculated Checkout:</span>
                  <span className="font-bold font-mono text-emerald-800">{calculatedEndTime}</span>
                </div>
                <div className="flex justify-between pt-1 border-t border-[#DFCDBE]/60 font-bold text-sm text-[#3D2314]">
                  <span>Total Amount:</span>
                  <span className="text-[#8C4A21] font-mono">₹499</span>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 2: AVAILABLE WORKSPACE ALTERNATIVES */}
          <div className="space-y-2.5 pt-2">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#7A5A43] block flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-[#8C4A21]" /> Other Available Workspaces
            </span>
            <div className="space-y-2 text-xs">
              {DEMO_ALTERNATIVES.map((alt) => (
                <div
                  key={alt.id}
                  className="p-3 rounded-2xl bg-[#FAF4ED] hover:bg-[#F3E9DD] border border-[#DFCDBE] flex items-center justify-between transition-all text-left"
                >
                  <div>
                    <div className="font-bold text-[#3D2314] flex items-center gap-2">
                      <span className="font-mono text-[#8C4A21]">{alt.id}</span>
                      <span>• {alt.seatType}</span>
                    </div>
                    <div className="text-[10px] text-emerald-700 font-bold mt-0.5">
                      🟢 {alt.availableAfter || "Available Now"}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      if (onSelectSeat) onSelectSeat(alt);
                    }}
                    className="px-3.5 py-1.5 rounded-xl bg-[#8C4A21] hover:bg-[#3D2314] text-white font-bold text-xs transition-all cursor-pointer flex items-center gap-1 shrink-0"
                  >
                    Book <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Panel Footer / Action Button */}
        <div className="p-6 bg-white border-t border-[#DFCDBE] space-y-3 shrink-0">
          {isBookingExecutable ? (
            <button
              type="button"
              onClick={handleContinue}
              disabled={!isFormValid || isNavigating}
              className="w-full py-4 px-6 rounded-full font-extrabold text-xs uppercase tracking-wider text-white shadow-lg transition-all duration-300 cursor-pointer flex items-center justify-center gap-2 bg-gradient-to-r from-[#3D2314] to-[#8C4A21] hover:from-[#8C4A21] hover:to-[#3D2314] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isNavigating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Saving Booking Details...</span>
                </>
              ) : (
                <>
                  <span>Continue to Booking</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          ) : (
            <div className="space-y-2">
              <button
                type="button"
                disabled
                className="w-full py-4 px-6 rounded-full font-extrabold text-xs uppercase tracking-wider text-slate-500 bg-slate-200 border border-slate-300 cursor-not-allowed text-center"
              >
                {isReserved
                  ? "Select a Time Slot or Alternative Desk"
                  : isOccupied
                    ? "Select a Later Time Slot or Desk"
                    : "Workspace Under Maintenance"}
              </button>
              <p className="text-[11px] text-[#8C4A21] font-bold text-center">
                * Select an available time slot above or choose another desk to continue.
              </p>
            </div>
          )}
        </div>

      </div>
    </>
  );
}
