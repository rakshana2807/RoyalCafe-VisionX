"use client";

import Link from "next/link";
import { useState } from "react";
import Image from "next/image";
import { Laptop, ShoppingBag, Tag, ArrowRight } from "lucide-react";

export interface Seat {
  number: string;
  zone: string;
}

interface BookingSummaryProps {
  workspaceType?: string;
  selectedSeat: Seat | null;
  date?: string;
  time?: string;
  duration: string;
  guests?: string;
  addOnsTotal: number;
  onContinueToPayment: () => void;
}

export default function BookingSummary({
  workspaceType = "Workspace Booking",
  selectedSeat,
  date,
  time,
  duration,
  guests,
  addOnsTotal,
  onContinueToPayment,
}: BookingSummaryProps) {
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);

  const basePrice = duration === "Full Day" ? 500 : duration === "4 Hours" ? 350 : 200;
  const subtotal = basePrice + addOnsTotal;
  const tax = subtotal * 0.05;
  const totalAmount = Math.max(0, subtotal + tax - discount);

  const handleApplyPromo = () => {
    if (promoCode.trim().toUpperCase() === "ROYAL10" || promoCode.trim().toUpperCase() === "SAVE10") {
      setDiscount(50);
    } else {
      alert("Invalid promo code. Try 'ROYAL10'");
    }
  };

  return (
    <aside className="sticky top-28 space-y-6 text-left">
      
      {/* Sticky Booking Summary Card (Figma Screenshot) */}
      <div className="bg-[#FAF6F0] p-6 rounded-3xl border border-primary/5 card-shadow space-y-5">
        
        {/* Header */}
        <div className="flex items-center gap-2 border-b border-primary/10 pb-3">
          <ShoppingBag className="h-5 w-5 text-accent stroke-[1.75]" />
          <h3 className="text-lg font-bold font-serif text-primary">
            Booking Summary
          </h3>
        </div>

        {/* Outer White Details Box (Figma Screenshot) */}
        <div className="bg-white p-5 rounded-2xl border border-primary/5 space-y-4 shadow-sm">
          
          {/* Booking ID & Type */}
          <div>
            <span className="text-[10px] font-bold text-foreground/45 uppercase tracking-wider block mb-1">
              BOOKING ID
            </span>
            <span className="text-xs font-bold font-mono text-primary block mb-3">
              RCC-2026-000145
            </span>

            <div className="flex justify-between items-center text-xs font-bold text-primary border-t border-primary/5 pt-3">
              <div>
                <span className="text-[10px] text-foreground/45 block uppercase">TYPE</span>
                <span>{workspaceType}</span>
              </div>
              <Laptop className="h-4 w-4 text-primary" />
            </div>
          </div>

          {/* Space & Duration */}
          <div className="flex justify-between text-xs font-semibold border-t border-primary/5 pt-3">
            <div>
              <span className="text-[10px] text-foreground/45 block uppercase">SPACE</span>
              <span className="font-bold text-primary">{selectedSeat ? selectedSeat.number : "Desk #12"}</span>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-foreground/45 block uppercase">DURATION</span>
              <span className="font-bold text-primary">{duration || "4 Hours"}</span>
            </div>
          </div>

          {/* Date, Time & Guests */}
          {(date || time || guests) && (
            <div className="flex justify-between text-[11px] text-foreground/60 border-t border-primary/5 pt-2">
              <span>{date || "Today"} @ {time || "02:00 PM"}</span>
              <span>{guests || "1 Person"}</span>
            </div>
          )}

        </div>

        {/* Items & Add-ons list */}
        <div className="space-y-2 text-xs font-semibold text-foreground/75 pt-2">
          <span className="text-[10px] font-bold text-foreground/45 uppercase tracking-wider block mb-1 flex items-center gap-1">
            <Tag className="h-3 w-3" /> Items & Add-ons
          </span>

          <div className="flex justify-between">
            <span>Work Pass (Pro)</span>
            <span className="font-bold text-primary">₹{basePrice}</span>
          </div>

          {addOnsTotal > 0 && (
            <div className="flex justify-between">
              <span>Pre-order Food & Drinks</span>
              <span className="font-bold text-primary">₹{addOnsTotal}</span>
            </div>
          )}

          {discount > 0 && (
            <div className="flex justify-between text-emerald-600">
              <span>Promo Discount</span>
              <span className="font-bold">-₹{discount}</span>
            </div>
          )}
        </div>

        {/* Calculations */}
        <div className="space-y-1.5 text-xs text-foreground/70 border-t border-primary/10 pt-3">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span className="font-bold text-primary">₹{subtotal.toFixed(0)}</span>
          </div>
          <div className="flex justify-between">
            <span>Taxes & Fees</span>
            <span className="font-bold text-primary">₹{tax.toFixed(0)}</span>
          </div>
        </div>

        {/* Promo Code Input */}
        <div className="flex gap-2 pt-1">
          <input
            type="text"
            placeholder="Promo Code (e.g. ROYAL10)"
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value)}
            className="flex-1 px-3 py-2 rounded-xl border border-primary/10 text-xs font-sans bg-white focus:outline-none"
          />
          <button
            onClick={handleApplyPromo}
            className="px-4 py-2 bg-primary text-white rounded-xl text-xs font-bold hover:bg-primary/95 cursor-pointer"
          >
            Apply
          </button>
        </div>

        {/* Grand Total Bar (Figma Screenshot) */}
        <div className="bg-white p-4 rounded-2xl flex justify-between items-center border border-primary/5 shadow-sm">
          <span className="text-sm font-bold font-serif text-primary">Total Amount</span>
          <span className="text-xl font-bold font-serif text-[#EA5A0C]">₹{totalAmount.toFixed(0)}</span>
        </div>

        {/* Confirm Reservation Orange Button */}
        <button
          onClick={onContinueToPayment}
          className="w-full py-4 bg-[#EA5A0C] hover:bg-[#EA5A0C]/95 text-white rounded-full text-xs font-bold shadow-md transition-all cursor-pointer inline-flex items-center justify-center gap-2 uppercase tracking-wider hover:scale-[1.02] active:scale-[0.98]"
        >
          <span>Confirm Reservation</span>
          <ArrowRight className="h-4 w-4" />
        </button>

        <span className="text-[10px] text-foreground/45 text-center block font-medium">
          By confirming, you agree to our <Link href="/gallery-contact" className="underline">Terms of Service</Link>.
        </span>

      </div>

      {/* Membership Card (Figma Screenshot) */}
      <div className="relative h-36 rounded-3xl overflow-hidden card-shadow border border-primary/5 p-6 flex flex-col justify-end text-white">
        <Image
          src="/community-voices.png"
          alt="Join the Hub"
          fill
          className="object-cover object-center"
          sizes="320px"
        />
        <div className="absolute inset-0 bg-black/45" />

        <div className="relative z-10">
          <h4 className="text-base font-bold font-serif mb-1">
            Join the Hub
          </h4>
          <p className="text-[11px] text-white/80 font-sans">
            Unlock exclusive benefits with our membership.
          </p>
        </div>
      </div>

    </aside>
  );
}
