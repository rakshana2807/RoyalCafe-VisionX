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
      {/* Main Champagne Content Card */}
      <div className="bg-[#F5DAA7] text-[#320000] p-6 sm:p-8 rounded-3xl border border-[rgba(245,218,167,0.4)] shadow-2xl space-y-6">

        {/* Card Header */}
        <div className="flex items-center justify-between border-b border-[#320000]/15 pb-4">
          <div>
            <h3 className="text-xl sm:text-2xl font-black font-serif text-[#320000] flex items-center gap-2">
              <ShoppingBag className="h-6 w-6 text-[#320000]" />
              Booking Summary
            </h3>
            <p className="text-xs text-[#320000]/70 font-semibold mt-1">
              Everything updates automatically
            </p>
          </div>
          <button
            type="button"
            onClick={handleClearBooking}
            className="text-xs font-black px-3.5 py-1.5 bg-[#320000]/10 text-[#320000] border border-[#320000]/20 hover:bg-[#320000] hover:text-[#F5DAA7] rounded-full transition-all cursor-pointer flex items-center gap-1 uppercase tracking-wider"
            title="Clear all booking data"
          >
            <Trash2 className="h-3 w-3" /> Clear Booking
          </button>
        </div>

        {/* ─── SECTION 1: INCLUDED MENU ITEMS ─────────────────────── */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-xs font-black text-[#320000] uppercase tracking-[0.15em] flex items-center gap-2">
              <UtensilsCrossed className="h-4 w-4 text-[#320000]" />
              Included Menu Items
            </span>
            {bookingItems.length > 0 && (
              <span className="text-xs font-black text-[#320000] bg-[#320000]/10 px-2.5 py-0.5 rounded-full border border-[#320000]/15">
                {bookingItems.reduce((s, i) => s + i.quantity, 0)} items
              </span>
            )}
          </div>

          {bookingItems.length > 0 ? (
            <div className="bg-[#320000]/5 rounded-2xl border border-[#320000]/15 divide-y divide-[#320000]/10 overflow-hidden shadow-inner max-h-[220px] overflow-y-auto custom-scrollbar">
              {bookingItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 p-3 hover:bg-[#320000]/10 transition-colors"
                >
                  {/* Item Image */}
                  <div className="relative h-11 w-11 rounded-xl overflow-hidden shrink-0 bg-[#320000]/10 shadow-xs border border-[#320000]/10">
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
                    <p className="text-xs font-black text-[#320000] truncate">
                      {item.name}
                    </p>
                    <p className="text-xs text-[#320000]/70 font-semibold">
                      ₹{item.price} each
                    </p>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-1 shrink-0 bg-[#F5DAA7] px-2 py-1 rounded-full border border-[#320000]/20 shadow-xs">
                    <button
                      type="button"
                      onClick={() => updateQty(item.id, -1)}
                      className="h-5 w-5 rounded-full bg-[#320000] text-[#F5DAA7] hover:opacity-90 flex items-center justify-center transition-all cursor-pointer"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="text-xs font-black text-[#320000] w-4 text-center">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateQty(item.id, 1)}
                      className="h-5 w-5 rounded-full bg-[#320000] text-[#F5DAA7] hover:opacity-90 flex items-center justify-center transition-all cursor-pointer"
                      aria-label="Increase quantity"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>

                  {/* Subtotal */}
                  <span className="text-xs font-black text-[#320000] w-12 text-right shrink-0">
                    ₹{item.price * item.quantity}
                  </span>

                  {/* Remove Button */}
                  <button
                    type="button"
                    onClick={() => removeMenuItem(item.id)}
                    className="text-[#320000]/60 hover:text-rose-700 transition-colors p-1 cursor-pointer shrink-0"
                    aria-label={`Remove ${item.name}`}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            /* EMPTY STATE FOR MENU ITEMS */
            <div className="bg-[#320000]/5 p-4 rounded-2xl border border-dashed border-[#320000]/20 text-center space-y-2">
              <UtensilsCrossed className="h-6 w-6 text-[#320000]/60 mx-auto" />
              <p className="text-xs font-black text-[#320000]">
                No menu items added yet
              </p>
              <p className="text-xs text-[#320000]/70 max-w-xs mx-auto font-medium">
                Pre-order your favorite coffee &amp; bites to have them ready upon arrival.
              </p>
              <Link
                href="/menu"
                className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-black text-[#F5DAA7] bg-[#320000] hover:bg-[#200000] rounded-full shadow-md transition-all cursor-pointer uppercase tracking-wider"
              >
                Browse Menu <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          )}
        </div>

        {/* ─── SECTION 2: WIFI PASS ──────────────────────────────── */}
        <div className="space-y-4">
          <span className="text-xs font-black text-[#320000] uppercase tracking-[0.15em] flex items-center gap-2">
            <Wifi className="h-4 w-4 text-[#320000]" />
            WiFi Pass
          </span>

          {wifiPass ? (
            <div className="bg-[#320000]/5 rounded-2xl p-3 border border-[#320000]/15 flex items-center justify-between gap-3 shadow-xs">
              <div className="flex items-center gap-2.5">
                <div className="h-9 w-9 rounded-xl bg-[#320000] text-[#F5DAA7] flex items-center justify-center font-bold text-xs shrink-0">
                  ⚡
                </div>
                <div>
                  <p className="text-xs font-black text-[#320000]">
                    {wifiPass.name}
                  </p>
                  <p className="text-xs font-semibold text-[#320000]/70">
                    High-Speed Fiber • {wifiPass.duration}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-[#320000]">
                  ₹{wifiPass.price}
                </span>
                <button
                  type="button"
                  onClick={() => setWifiPass(null)}
                  className="text-[#320000]/60 hover:text-rose-700 transition-colors p-1 cursor-pointer"
                  aria-label="Remove WiFi pass"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ) : (
            /* EMPTY STATE FOR WIFI PASS */
            <div className="bg-[#320000]/5 p-3.5 rounded-2xl border border-dashed border-[#320000]/20 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Wifi className="h-4 w-4 text-[#320000]/50" />
                <div>
                  <p className="text-xs font-black text-[#320000]">
                    No WiFi pass selected.
                  </p>
                  <p className="text-xs text-[#320000]/60 font-medium">
                    100 Mbps dedicated high-speed internet
                  </p>
                </div>
              </div>
              <Link
                href="/work-study"
                className="px-3 py-1 text-xs font-black text-[#320000] border border-[#320000]/30 hover:bg-[#320000] hover:text-[#F5DAA7] rounded-full transition-all cursor-pointer shrink-0 uppercase tracking-wider"
              >
                Browse Passes
              </Link>
            </div>
          )}
        </div>

        {/* ─── SECTION 3: RESERVATION DETAILS SUMMARY ─────────────── */}
        <div className="bg-[#320000]/5 p-5 rounded-3xl border border-[#320000]/15 space-y-3 text-xs font-semibold text-[#320000]">
          <div className="flex items-center justify-between border-b border-[#320000]/10 pb-3">
            <span className="text-xs font-black text-[#320000] uppercase tracking-[0.15em]">
              RESERVATION DETAILS
            </span>
            <Link
              href="/live-status"
              className="text-xs font-black text-[#320000] hover:underline flex items-center gap-1"
            >
              <span>Change Seat</span>
            </Link>
          </div>

          {selectedSeat && (
            <div className="bg-[#320000] text-[#F5DAA7] p-2.5 rounded-xl border border-[#320000] flex items-center justify-between gap-2 shadow-xs">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-[#F5DAA7]/20 text-[#F5DAA7]">
                  <Coffee className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs font-black text-[#F5DAA7]">
                    Selected Seat #{selectedSeat.seatNumber.replace(/^Seat #?/, "")}
                  </p>
                  <p className="text-xs font-medium text-[#F5DAA7]/80">
                    {selectedSeat.zone} • {selectedSeat.seatType}
                  </p>
                </div>
              </div>
              <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-[#F5DAA7] text-[#320000]">
                Locked
              </span>
            </div>
          )}

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center gap-1.5">
              <Coffee className="h-3.5 w-3.5 text-[#320000]" />
              <span className="truncate">{reservationDetails.tableType || "Table"}</span>
            </div>
            <div className="flex items-center gap-1.5 justify-end text-right">
              <MapPin className="h-3.5 w-3.5 text-[#320000]" />
              <span className="truncate">{reservationDetails.seatingArea}</span>
            </div>

            <div className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-[#320000]" />
              <span>{reservationDetails.resDate}</span>
            </div>
            <div className="flex items-center gap-1.5 justify-end text-right">
              <Clock className="h-3.5 w-3.5 text-[#320000]" />
              <span>{reservationDetails.arrivalTime || "09:30 AM"}</span>
            </div>

            <div className="flex items-center gap-1.5">
              <Timer className="h-3.5 w-3.5 text-[#320000]" />
              <span>{reservationDetails.duration || "1 Hour"}</span>
            </div>
            <div className="flex items-center gap-1.5 justify-end text-right">
              <Users className="h-3.5 w-3.5 text-[#320000]" />
              <span>{reservationDetails.guests || "1"} Guests</span>
            </div>

            {/* Calculated Checkout Time */}
            <div className="flex items-center justify-between col-span-2 text-[#320000] font-black bg-[#F5DAA7] p-3 rounded-xl border border-[#320000]/20 mt-2 shadow-xs">
              <span className="text-xs uppercase tracking-[0.1em] text-[#320000] flex items-center gap-1.5">
                🏁 Checkout (Ends At)
              </span>
              <span className="font-mono text-[#320000] text-xs font-black">
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

            <div className="flex items-center gap-1.5 col-span-2 text-[#320000]/75 border-t border-[#320000]/10 pt-1.5">
              <PartyPopper className="h-3.5 w-3.5 text-[#320000]" />
              <span>{reservationDetails.occasion}</span>
            </div>
          </div>
        </div>

        {/* ─── SECTION 4: PAYMENT BREAKDOWN (DYNAMIC) ─────────────── */}
        <div className="space-y-4 pt-4 border-t border-[#320000]/15">
          <span className="text-[12px] font-black text-[#320000] uppercase tracking-[0.15em] flex items-center gap-2 mb-4">
            <Receipt className="h-4 w-4 text-[#320000]" />
            Payment Summary
          </span>

          <div className="space-y-2 text-xs font-bold text-[#320000]/80">
            <div className="flex justify-between">
              <span>Food &amp; Drinks Total</span>
              <span className="font-black text-[#320000]">₹{foodTotal}</span>
            </div>

            <div className="flex justify-between">
              <span>WiFi Pass</span>
              <span className="font-black text-[#320000]">₹{wifiTotal}</span>
            </div>

            <div className="flex justify-between text-[#320000] font-black">
              <span>Reservation Fee</span>
              <span>₹{bookingFee}</span>
            </div>
            
            <div className="flex justify-between">
              <span>GST (2%)</span>
              <span className="font-black text-[#320000]">₹{gst}</span>
            </div>
          </div>

          {/* TOTAL AMOUNT DUE INVERSE CARD */}
          <div className="bg-[#320000] text-[#F5DAA7] p-6 rounded-3xl border border-[#320000] shadow-xl mt-6 space-y-4 animate-in fade-in duration-300">
            {/* Top Row: Label + Large Amount */}
            <div className="flex justify-between items-start gap-4">
              <div>
                <span className="text-xs font-bold text-[#F5DAA7] uppercase tracking-[0.1em] block">
                  Total Amount Due
                </span>
                <span className="text-xs font-medium text-[#F5DAA7]/70 mt-1 block">
                  Inclusive of taxes
                </span>
              </div>
              <span className="text-3xl sm:text-4xl font-black font-serif text-[#F5DAA7] tracking-tight shrink-0">
                ₹{grandTotal}
              </span>
            </div>

            {/* Bottom Row: Security Badge */}
            <div className="border-t border-[#F5DAA7]/20 pt-3 flex items-center justify-between text-[#F5DAA7] text-xs font-bold">
              <div className="flex items-center gap-1.5">
                <Lock className="h-3.5 w-3.5 text-[#F5DAA7] shrink-0" />
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
          className="w-full py-4 px-6 rounded-full font-black text-xs sm:text-sm uppercase tracking-[0.15em] text-[#F5DAA7] bg-[#320000] hover:bg-[#200000] shadow-xl transition-all duration-300 cursor-pointer flex items-center justify-center gap-2 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin text-[#F5DAA7]" />
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
          <span className="text-xs text-rose-700 text-center block font-black">
            * Fill required fields (Name, Mobile, Time, Duration, Guests, Table Type).
          </span>
        )}

      </div>

      {/* Mini Brand Guarantee Badge */}
      <div className="p-4 rounded-2xl bg-[rgba(245,218,167,0.08)] border border-[rgba(245,218,167,0.22)] backdrop-blur-xl flex items-center gap-3 text-xs font-semibold text-[#F5DAA7]">
        <Sparkles className="h-5 w-5 text-[#F5DAA7] shrink-0" />
        <p className="text-xs leading-tight">
          <strong className="text-[#F5DAA7]">Instant Seat Guarantee</strong> — Reservation Fee is dynamically calculated based on your seat choice, with table guaranteed up to 15 mins past arrival.
        </p>
      </div>

    </div>
  );
}
