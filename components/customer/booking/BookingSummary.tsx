"use client";

import Link from "next/link";
import { useState } from "react";
import Image from "next/image";
import {
  ShoppingBag,
  Wifi,
  Trash2,
  Plus,
  Minus,
  UtensilsCrossed,
  ArrowRight,
  Sparkles,
  Calendar,
  Clock,
  Users,
  Coffee,
  MapPin,
  PartyPopper,
  Receipt,
  Loader2,
  Timer,
  Lock,
} from "lucide-react";
import { useBooking } from "@/context/BookingContext";

interface BookingSummaryProps {
  onConfirmBooking: () => Promise<void> | void;
  isSubmitting?: boolean;
}

export default function BookingSummary({
  onConfirmBooking,
  isSubmitting = false,
}: BookingSummaryProps) {
  const {
    bookingItems,
    wifiPass,
    selectedSeat,
    reservationDetails,
    removeMenuItem,
    updateQty,
    setWifiPass,
    foodTotal,
    wifiTotal,
    bookingFee,
    gst,
    grandTotal,
    clearBooking,
  } = useBooking();

  const guestsNum = parseInt(reservationDetails.guests, 10) || 0;
  const effectiveTableType = selectedSeat?.seatType || reservationDetails.tableType;

  const isFormValid =
    reservationDetails.fullName.trim() !== "" &&
    reservationDetails.mobile.trim() !== "" &&
    reservationDetails.arrivalTime.trim() !== "" &&
    reservationDetails.duration.trim() !== "" &&
    (effectiveTableType || "").trim() !== "" &&
    guestsNum > 0;

  const handleClearBooking = () => {
    const confirmed = window.confirm(
      "Are you sure you want to clear your booking selections? This will reset all form fields and items."
    );
    if (confirmed) {
      clearBooking();
    }
  };

  return (
    <div className="space-y-5 text-left font-sans">

      {/* Main Glassmorphic Summary Card */}
      <div className="bg-white/95 backdrop-blur-md p-5 sm:p-6 rounded-[24px] border border-primary/10 shadow-lg shadow-primary/5 space-y-5">

        {/* Card Header */}
        <div className="flex items-center justify-between border-b border-primary/10 pb-3.5">
          <div>
            <h3 className="text-lg sm:text-xl font-bold font-serif text-[#2A1506] flex items-center gap-2">
              <ShoppingBag className="h-5 w-5 text-[#EA5A0C]" />
              Booking Summary
            </h3>
            <p className="text-[11px] text-foreground/55 font-medium mt-0.5">
              Everything updates automatically
            </p>
          </div>
          <button
            type="button"
            onClick={handleClearBooking}
            className="text-[10px] font-extrabold px-2.5 py-1 bg-rose-50 text-rose-600 border border-rose-200 hover:bg-rose-600 hover:text-white rounded-full transition-all cursor-pointer flex items-center gap-1 uppercase tracking-wider shadow-2xs"
            title="Clear all booking data"
          >
            <Trash2 className="h-3 w-3" /> Clear Booking
          </button>
        </div>

        {/* ─── SECTION 1: INCLUDED MENU ITEMS ─────────────────────── */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-[11px] font-extrabold text-[#5A2E0C] uppercase tracking-wider flex items-center gap-1.5">
              <UtensilsCrossed className="h-3.5 w-3.5 text-[#EA5A0C]" />
              Included Menu Items
            </span>
            {bookingItems.length > 0 && (
              <span className="text-[10px] font-bold text-foreground/50 bg-[#FAF6F0] px-2 py-0.5 rounded-full">
                {bookingItems.reduce((s, i) => s + i.quantity, 0)} items
              </span>
            )}
          </div>

          {bookingItems.length > 0 ? (
            <div className="bg-[#FAF6F0]/70 rounded-2xl border border-primary/10 divide-y divide-primary/5 overflow-hidden shadow-inner max-h-[220px] overflow-y-auto custom-scrollbar">
              {bookingItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 p-3 hover:bg-white/60 transition-colors"
                >
                  {/* Item Image */}
                  <div className="relative h-11 w-11 rounded-xl overflow-hidden shrink-0 bg-white shadow-xs border border-primary/5">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                      sizes="44px"
                    />
                  </div>

                  {/* Name & Unit Price */}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-[#2A1506] truncate">
                      {item.name}
                    </p>
                    <p className="text-[11px] text-foreground/55 font-medium">
                      ₹{item.price} each
                    </p>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-1 shrink-0 bg-white px-1.5 py-1 rounded-full border border-primary/10 shadow-xs">
                    <button
                      type="button"
                      onClick={() => updateQty(item.id, -1)}
                      className="h-5 w-5 rounded-full bg-[#FAF6F0] hover:bg-[#EA5A0C] hover:text-white flex items-center justify-center text-primary transition-all cursor-pointer"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="text-xs font-extrabold text-[#2A1506] w-4 text-center">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateQty(item.id, 1)}
                      className="h-5 w-5 rounded-full bg-[#FAF6F0] hover:bg-[#EA5A0C] hover:text-white flex items-center justify-center text-primary transition-all cursor-pointer"
                      aria-label="Increase quantity"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>

                  {/* Subtotal */}
                  <span className="text-xs font-extrabold text-[#2A1506] w-12 text-right shrink-0">
                    ₹{item.price * item.quantity}
                  </span>

                  {/* Remove Button */}
                  <button
                    type="button"
                    onClick={() => removeMenuItem(item.id)}
                    className="text-foreground/30 hover:text-rose-600 transition-colors p-1 cursor-pointer shrink-0"
                    aria-label={`Remove ${item.name}`}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            /* EMPTY STATE FOR MENU ITEMS */
            <div className="bg-[#FAF6F0]/60 p-4 rounded-2xl border border-dashed border-primary/15 text-center space-y-2">
              <UtensilsCrossed className="h-6 w-6 text-[#EA5A0C]/60 mx-auto" />
              <p className="text-xs font-bold text-[#5A2E0C]">
                No menu items added yet
              </p>
              <p className="text-[10px] text-foreground/50 max-w-xs mx-auto">
                Pre-order your favorite coffee &amp; bites to have them ready upon arrival.
              </p>
              <Link
                href="/menu"
                className="inline-flex items-center gap-1.5 px-4 py-1.5 text-[11px] font-bold text-white bg-[#2A1506] hover:bg-[#EA5A0C] rounded-full shadow-xs transition-all cursor-pointer uppercase tracking-wider"
              >
                Browse Menu <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          )}
        </div>

        {/* ─── SECTION 2: WIFI PASS ──────────────────────────────── */}
        <div className="space-y-2">
          <span className="text-[11px] font-extrabold text-[#5A2E0C] uppercase tracking-wider flex items-center gap-1.5">
            <Wifi className="h-3.5 w-3.5 text-[#EA5A0C]" />
            WiFi Pass
          </span>

          {wifiPass ? (
            <div className="bg-[#FAF6F0] rounded-2xl p-3 border border-primary/10 flex items-center justify-between gap-3 shadow-xs">
              <div className="flex items-center gap-2.5">
                <div className="h-9 w-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs shrink-0">
                  ⚡
                </div>
                <div>
                  <p className="text-xs font-bold text-[#2A1506]">
                    {wifiPass.name}
                  </p>
                  <p className="text-[10px] font-semibold text-foreground/60">
                    High-Speed Fiber • {wifiPass.duration}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-extrabold text-[#EA5A0C]">
                  ₹{wifiPass.price}
                </span>
                <button
                  type="button"
                  onClick={() => setWifiPass(null)}
                  className="text-foreground/30 hover:text-rose-600 transition-colors p-1 cursor-pointer"
                  aria-label="Remove WiFi pass"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ) : (
            /* EMPTY STATE FOR WIFI PASS */
            <div className="bg-[#FAF6F0]/60 p-3.5 rounded-2xl border border-dashed border-primary/15 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Wifi className="h-4 w-4 text-foreground/35" />
                <div>
                  <p className="text-xs font-bold text-foreground/60">
                    No WiFi Pass Selected
                  </p>
                  <p className="text-[10px] text-foreground/45">
                    100 Mbps dedicated workspace internet
                  </p>
                </div>
              </div>
              <Link
                href="/work-study"
                className="px-3 py-1 text-[10px] font-bold text-[#5A2E0C] border border-[#5A2E0C]/30 hover:bg-[#5A2E0C] hover:text-white rounded-full transition-all cursor-pointer shrink-0 uppercase tracking-wider"
              >
                Browse Passes
              </Link>
            </div>
          )}
        </div>

        {/* ─── SECTION 3: RESERVATION DETAILS SUMMARY ─────────────── */}
        <div className="bg-[#FAF6F0]/80 p-3.5 rounded-2xl border border-primary/10 space-y-2.5 text-xs font-semibold text-foreground/80">
          <div className="flex items-center justify-between border-b border-primary/5 pb-1.5">
            <span className="text-[10px] font-extrabold text-foreground/45 uppercase tracking-wider">
              RESERVATION DETAILS
            </span>
            <Link
              href="/live-status"
              className="text-[10px] font-bold text-[#EA5A0C] hover:underline flex items-center gap-1"
            >
              <span>Change Seat</span>
            </Link>
          </div>

          {selectedSeat && (
            <div className="bg-white p-2.5 rounded-xl border border-primary/10 flex items-center justify-between gap-2 shadow-2xs">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-[#EA5A0C]/10 text-[#EA5A0C]">
                  <Coffee className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs font-extrabold text-[#2A1506]">
                    Selected Seat #{selectedSeat.seatNumber.replace(/^Seat #?/, "")}
                  </p>
                  <p className="text-[10px] font-semibold text-foreground/60">
                    {selectedSeat.zone} • {selectedSeat.seatType}
                  </p>
                </div>
              </div>
              <span className="text-[9px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                Locked
              </span>
            </div>
          )}

          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <div className="flex items-center gap-1.5">
              <Coffee className="h-3.5 w-3.5 text-[#EA5A0C]" />
              <span className="truncate">{reservationDetails.tableType || "Table"}</span>
            </div>
            <div className="flex items-center gap-1.5 justify-end text-right">
              <MapPin className="h-3.5 w-3.5 text-[#EA5A0C]" />
              <span className="truncate">{reservationDetails.seatingArea}</span>
            </div>

            <div className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-[#EA5A0C]" />
              <span>{reservationDetails.resDate}</span>
            </div>
            <div className="flex items-center gap-1.5 justify-end text-right">
              <Clock className="h-3.5 w-3.5 text-[#EA5A0C]" />
              <span>{reservationDetails.arrivalTime || "09:30 AM"}</span>
            </div>

            <div className="flex items-center gap-1.5">
              <Timer className="h-3.5 w-3.5 text-[#EA5A0C]" />
              <span>{reservationDetails.duration || "1 Hour"}</span>
            </div>
            <div className="flex items-center gap-1.5 justify-end text-right">
              <Users className="h-3.5 w-3.5 text-[#EA5A0C]" />
              <span>{reservationDetails.guests || "1"} Guests</span>
            </div>

            {/* Calculated Checkout Time */}
            <div className="flex items-center justify-between col-span-2 text-[#3D2314] font-bold bg-[#FAF4ED] p-2 rounded-xl border border-[#DFCDBE]">
              <span className="text-[10px] uppercase tracking-wider text-[#8C4A21] flex items-center gap-1">
                🏁 Checkout (Ends At)
              </span>
              <span className="font-mono text-emerald-800 text-xs">
                {(() => {
                  try {
                    const start = reservationDetails.arrivalTime || "10:00 AM";
                    const dur = reservationDetails.duration || "1 Hour";
                    const match = start.match(/(\d+):(\d+)\s*(AM|PM)/i);
                    if (!match) return "11:00 AM";
                    let hrs = parseInt(match[1], 10);
                    const mins = parseInt(match[2], 10);
                    const period = match[3].toUpperCase();
                    if (period === "PM" && hrs < 12) hrs += 12;
                    if (period === "AM" && hrs === 12) hrs = 0;
                    let addHrs = 0;
                    let addMins = 0;
                    if (dur.includes("Half Day")) {
                      addHrs = 4;
                    } else {
                      const hMatch = dur.match(/(\d+)\s*Hour/i);
                      const mMatch = dur.match(/(\d+)\s*Min/i);
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
                })()}
              </span>
            </div>

            <div className="flex items-center gap-1.5 col-span-2 text-foreground/75 border-t border-primary/5 pt-1.5">
              <PartyPopper className="h-3.5 w-3.5 text-[#EA5A0C]" />
              <span>{reservationDetails.occasion}</span>
            </div>
          </div>
        </div>

        {/* ─── SECTION 4: PAYMENT BREAKDOWN (DYNAMIC) ─────────────── */}
        <div className="space-y-2.5 pt-1 border-t border-primary/10">
          <span className="text-[12px] font-extrabold text-[#5A2E0C] uppercase tracking-wider flex items-center gap-2 mb-3.5">
            <Receipt className="h-3.5 w-3.5 text-[#EA5A0C]" />
            Payment Summary
          </span>

          <div className="space-y-2 text-xs font-bold text-foreground/75">
            <div className="flex justify-between">
              <span>Food &amp; Drinks Total</span>
              <span className="font-bold text-[#2A1506]">₹{foodTotal}</span>
            </div>

            <div className="flex justify-between">
              <span>WiFi Pass</span>
              <span className="font-bold text-[#2A1506]">₹{wifiTotal}</span>
            </div>

            <div className="flex justify-between text-[#EA5A0C] font-bold">
              <span>Reservation Fee</span>
              <span>₹{bookingFee}</span>
            </div>
            
            <div className="flex justify-between">
              <span>GST (2%)</span>
              <span className="font-bold text-[#2A1506]">₹{gst}</span>
            </div>
          </div>

          {/* NEW PREMIUM PAYMENT SUMMARY CARD */}
          <div className="bg-gradient-to-br from-[#FFFDF9] via-[#FAF6F0] to-[#F5EBE1] p-5 sm:p-6 rounded-[24px] border border-[#5A2E0C]/20 shadow-md shadow-[#5A2E0C]/5 mt-4 space-y-4 animate-in fade-in duration-300">
            {/* Top Row: Label + Large Amount */}
            <div className="flex justify-between items-start gap-4">
              <div>
                <span className="text-2xs font-black text-[#2A1506] uppercase tracking-wider block">
                  Total Amount Due
                </span>
                <span className="text-[13px] font-medium text-foreground/50 mt-0.5 block">
                  Inclusive of taxes
                </span>
              </div>
              <span className="text-2xl sm:text-3xl font-black font-serif text-[#5A2E0C] tracking-tight shrink-0 transition-all duration-300">
                ₹{grandTotal}
              </span>
            </div>

            {/* Bottom Row: Security Badge */}
            <div className="border-t border-[#5A2E0C]/10 pt-3 flex items-center justify-between text-emerald-700 text-[11px] font-extrabold">
              <div className="flex items-center gap-1.5">
                <Lock className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                <span>Secure Payment &bull; 100% Safe Checkout</span>
              </div>
            </div>
          </div>
        </div>

        {/* ─── CONFIRM RESERVATION BUTTON ───────────────────────── */}
        <button
          type="button"
          onClick={onConfirmBooking}
          disabled={!isFormValid || isSubmitting}
          className="w-full py-4 px-6 rounded-full font-bold text-xs sm:text-sm uppercase tracking-wider text-white shadow-lg shadow-[#5A2E0C]/20 transition-all duration-300 cursor-pointer flex items-center justify-center gap-2 bg-gradient-to-r from-[#5A2E0C] to-[#2A1506] hover:from-[#EA5A0C] hover:to-[#D06B1C] hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Confirming Reservation...</span>
            </>
          ) : (
            <>
              <span>Confirm &amp; Proceed to Payment</span>
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>

        {!isFormValid && (
          <span className="text-[10px] text-rose-600 text-center block font-bold">
            * Fill required fields (Name, Mobile, Time, Duration, Guests, Table Type).
          </span>
        )}

      </div>

      {/* Mini Brand Guarantee Badge */}
      <div className="p-4 rounded-2xl bg-[#FAF6F0] border border-primary/5 flex items-center gap-3 text-xs font-semibold text-[#5A2E0C]">
        <Sparkles className="h-5 w-5 text-[#EA5A0C] shrink-0" />
        <p className="text-[11px] leading-tight">
          <strong>Instant Seat Guarantee</strong> — Reservation Fee is $29 with table guaranteed up to 15 mins past arrival.
        </p>
      </div>

    </div>
  );
}
