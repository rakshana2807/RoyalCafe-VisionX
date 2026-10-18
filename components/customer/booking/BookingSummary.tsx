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
      <div className="bg-[#561C24] text-[#FFF8E6] p-6 sm:p-8 rounded-3xl border border-[rgba(244,221,165,0.25)] shadow-xl space-y-6">

        {/* Card Header */}
        <div className="flex items-center justify-between border-b border-[rgba(244,221,165,0.2)] pb-4">
          <div>
            <h3 className="text-xl sm:text-2xl font-bold font-serif text-[#FFF8E6] flex items-center gap-2">
              <ShoppingBag className="h-6 w-6 text-[#F4DDA5]" />
              Booking Summary
            </h3>
            <p className="text-xs text-[#FFF8E6]/75 font-medium mt-1">
              Everything updates automatically
            </p>
          </div>
          <button
            type="button"
            onClick={handleClearBooking}
            className="text-xs font-extrabold px-3 py-1 bg-rose-500/20 text-rose-300 border border-rose-500/30 hover:bg-rose-600 hover:text-white rounded-full transition-all cursor-pointer flex items-center gap-1 uppercase tracking-wider"
            title="Clear all booking data"
          >
            <Trash2 className="h-3 w-3" /> Clear Booking
          </button>
        </div>

        {/* ─── SECTION 1: INCLUDED MENU ITEMS ─────────────────────── */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-xs font-semibold text-primary uppercase tracking-[0.15em] flex items-center gap-2">
              <UtensilsCrossed className="h-4 w-4 text-accent" />
              Included Menu Items
            </span>
            {bookingItems.length > 0 && (
              <span className="text-xs font-bold text-foreground/80 bg-surface px-2 py-0.5 rounded-full">
                {bookingItems.reduce((s, i) => s + i.quantity, 0)} items
              </span>
            )}
          </div>

          {bookingItems.length > 0 ? (
            <div className="bg-surface/70 rounded-2xl border border-primary/10 divide-y divide-primary/5 overflow-hidden shadow-inner max-h-[220px] overflow-y-auto custom-scrollbar">
              {bookingItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 p-3 hover:bg-surface/60 transition-colors"
                >
                  {/* Item Image */}
                  <div className="relative h-11 w-11 rounded-xl overflow-hidden shrink-0 bg-surface shadow-xs border border-primary/5">
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
                    <p className="text-xs font-bold text-primary truncate">
                      {item.name}
                    </p>
                    <p className="text-xs text-foreground/55 font-medium">
                      ₹{item.price} each
                    </p>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-1 shrink-0 bg-surface px-1.5 py-1 rounded-full border border-primary/10 shadow-xs">
                    <button
                      type="button"
                      onClick={() => updateQty(item.id, -1)}
                      className="h-5 w-5 rounded-full bg-surface hover:bg-accent hover:text-primary flex items-center justify-center text-primary transition-all cursor-pointer"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="text-xs font-extrabold text-primary w-4 text-center">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateQty(item.id, 1)}
                      className="h-5 w-5 rounded-full bg-surface hover:bg-accent hover:text-primary flex items-center justify-center text-primary transition-all cursor-pointer"
                      aria-label="Increase quantity"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>

                  {/* Subtotal */}
                  <span className="text-xs font-extrabold text-primary w-12 text-right shrink-0">
                    ₹{item.price * item.quantity}
                  </span>

                  {/* Remove Button */}
                  <button
                    type="button"
                    onClick={() => removeMenuItem(item.id)}
                    className="text-foreground/70 hover:text-rose-600 transition-colors p-1 cursor-pointer shrink-0"
                    aria-label={`Remove ${item.name}`}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            /* EMPTY STATE FOR MENU ITEMS */
            <div className="bg-surface/60 p-4 rounded-2xl border border-dashed border-primary/15 text-center space-y-2">
              <UtensilsCrossed className="h-6 w-6 text-accent/60 mx-auto" />
              <p className="text-xs font-bold text-primary">
                No menu items added yet
              </p>
              <p className="text-xs text-foreground/80 max-w-xs mx-auto">
                Pre-order your favorite coffee &amp; bites to have them ready upon arrival.
              </p>
              <Link
                href="/menu"
                className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold text-background bg-primary hover:bg-accent rounded-full shadow-xs transition-all cursor-pointer uppercase tracking-wider"
              >
                Browse Menu <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          )}
        </div>

        {/* ─── SECTION 2: WIFI PASS ──────────────────────────────── */}
        <div className="space-y-4">
          <span className="text-xs font-semibold text-primary uppercase tracking-[0.15em] flex items-center gap-2">
            <Wifi className="h-4 w-4 text-accent" />
            WiFi Pass
          </span>

          {wifiPass ? (
            <div className="bg-surface rounded-2xl p-3 border border-primary/10 flex items-center justify-between gap-3 shadow-xs">
              <div className="flex items-center gap-2.5">
                <div className="h-9 w-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs shrink-0">
                  ⚡
                </div>
                <div>
                  <p className="text-xs font-bold text-primary">
                    {wifiPass.name}
                  </p>
                  <p className="text-xs font-semibold text-foreground/80">
                    High-Speed Fiber • {wifiPass.duration}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-extrabold text-accent">
                  ₹{wifiPass.price}
                </span>
                <button
                  type="button"
                  onClick={() => setWifiPass(null)}
                  className="text-foreground/70 hover:text-rose-600 transition-colors p-1 cursor-pointer"
                  aria-label="Remove WiFi pass"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ) : (
            /* EMPTY STATE FOR WIFI PASS */
            <div className="bg-surface/60 p-3.5 rounded-2xl border border-dashed border-primary/15 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Wifi className="h-4 w-4 text-foreground/35" />
                <div>
                  <p className="text-xs font-bold text-foreground/80">
                    No WiFi pass selected.
                  </p>
                  <p className="text-xs text-foreground/45">
                    100 Mbps dedicated high-speed internet
                  </p>
                </div>
              </div>
              <Link
                href="/work-study"
                className="px-3 py-1 text-xs font-bold text-primary border border-primary/30 hover:bg-primary hover:text-background rounded-full transition-all cursor-pointer shrink-0 uppercase tracking-wider"
              >
                Browse WiFi Passes
              </Link>
            </div>
          )}
        </div>

        {/* ─── SECTION 3: RESERVATION DETAILS SUMMARY ─────────────── */}
        <div className="bg-background/80 p-5 rounded-3xl border border-border space-y-3 text-xs font-semibold text-foreground/80">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <span className="text-xs font-semibold text-foreground/80 uppercase tracking-[0.15em]">
              RESERVATION DETAILS
            </span>
            <Link
              href="/live-status"
              className="text-xs font-bold text-accent hover:underline flex items-center gap-1"
            >
              <span>Change Seat</span>
            </Link>
          </div>

          {selectedSeat && (
            <div className="bg-surface p-2.5 rounded-xl border border-primary/10 flex items-center justify-between gap-2 shadow-2xs">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-accent/10 text-accent">
                  <Coffee className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs font-extrabold text-primary">
                    Selected Seat #{selectedSeat.seatNumber.replace(/^Seat #?/, "")}
                  </p>
                  <p className="text-xs font-semibold text-foreground/80">
                    {selectedSeat.zone} • {selectedSeat.seatType}
                  </p>
                </div>
              </div>
              <span className="text-[9px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                Locked
              </span>
            </div>
          )}

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center gap-1.5">
              <Coffee className="h-3.5 w-3.5 text-accent" />
              <span className="truncate">{reservationDetails.tableType || "Table"}</span>
            </div>
            <div className="flex items-center gap-1.5 justify-end text-right">
              <MapPin className="h-3.5 w-3.5 text-accent" />
              <span className="truncate">{reservationDetails.seatingArea}</span>
            </div>

            <div className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-accent" />
              <span>{reservationDetails.resDate}</span>
            </div>
            <div className="flex items-center gap-1.5 justify-end text-right">
              <Clock className="h-3.5 w-3.5 text-accent" />
              <span>{reservationDetails.arrivalTime || "09:30 AM"}</span>
            </div>

            <div className="flex items-center gap-1.5">
              <Timer className="h-3.5 w-3.5 text-accent" />
              <span>{reservationDetails.duration || "1 Hour"}</span>
            </div>
            <div className="flex items-center gap-1.5 justify-end text-right">
              <Users className="h-3.5 w-3.5 text-accent" />
              <span>{reservationDetails.guests || "1"} Guests</span>
            </div>

            {/* Calculated Checkout Time */}
            <div className="flex items-center justify-between col-span-2 text-primary font-semibold bg-background p-3 rounded-xl border border-border mt-2 shadow-sm">
              <span className="text-xs uppercase tracking-[0.1em] text-accent flex items-center gap-1.5">
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
              <PartyPopper className="h-3.5 w-3.5 text-accent" />
              <span>{reservationDetails.occasion}</span>
            </div>
          </div>
        </div>

        {/* ─── SECTION 4: PAYMENT BREAKDOWN (DYNAMIC) ─────────────── */}
        <div className="space-y-4 pt-4 border-t border-border">
          <span className="text-[12px] font-semibold text-primary uppercase tracking-[0.15em] flex items-center gap-2 mb-4">
            <Receipt className="h-4 w-4 text-accent" />
            Payment Summary
          </span>

          <div className="space-y-2 text-xs font-bold text-[#FFF8E6]/80">
            <div className="flex justify-between">
              <span>Food &amp; Drinks Total</span>
              <span className="font-bold text-[#FFF8E6]">₹{foodTotal}</span>
            </div>

            <div className="flex justify-between">
              <span>WiFi Pass</span>
              <span className="font-bold text-[#FFF8E6]">₹{wifiTotal}</span>
            </div>

            <div className="flex justify-between text-[#F4DDA5] font-bold">
              <span>Reservation Fee</span>
              <span>₹{bookingFee}</span>
            </div>
            
            <div className="flex justify-between">
              <span>GST (2%)</span>
              <span className="font-bold text-[#FFF8E6]">₹{gst}</span>
            </div>
          </div>

          {/* NEW PREMIUM PAYMENT SUMMARY CARD */}
          <div className="bg-[#3D1118] p-6 rounded-3xl border border-[rgba(244,221,165,0.25)] shadow-md mt-6 space-y-4 animate-in fade-in duration-300">
            {/* Top Row: Label + Large Amount */}
            <div className="flex justify-between items-start gap-4">
              <div>
                <span className="text-xs font-semibold text-[#F4DDA5] uppercase tracking-[0.1em] block">
                  Total Amount Due
                </span>
                <span className="text-xs font-medium text-[#FFF8E6]/75 mt-1 block">
                  Inclusive of taxes
                </span>
              </div>
              <span className="text-3xl sm:text-4xl font-bold font-serif text-[#F4DDA5] tracking-tight shrink-0 transition-all duration-300">
                ₹{grandTotal}
              </span>
            </div>

            {/* Bottom Row: Security Badge */}
            <div className="border-t border-[rgba(244,221,165,0.15)] pt-3 flex items-center justify-between text-emerald-400 text-xs font-extrabold">
              <div className="flex items-center gap-1.5">
                <Lock className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
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
          className="w-full py-4 px-6 rounded-full font-bold text-xs sm:text-sm uppercase tracking-[0.15em] text-[#561C24] bg-[#F4DDA5] hover:bg-[#FFF8E6] shadow-lg transition-all duration-300 cursor-pointer flex items-center justify-center gap-2 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin text-[#561C24]" />
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
          <span className="text-xs text-rose-600 text-center block font-bold">
            * Fill required fields (Name, Mobile, Time, Duration, Guests, Table Type).
          </span>
        )}

      </div>

      {/* Mini Brand Guarantee Badge */}
      <div className="p-4 rounded-2xl bg-surface border border-primary/5 flex items-center gap-3 text-xs font-semibold text-primary">
        <Sparkles className="h-5 w-5 text-accent shrink-0" />
        <p className="text-xs leading-tight">
          <strong>Instant Seat Guarantee</strong> — Reservation Fee is dynamically calculated based on your seat choice, with table guaranteed up to 15 mins past arrival.
        </p>
      </div>

    </div>
  );
}
