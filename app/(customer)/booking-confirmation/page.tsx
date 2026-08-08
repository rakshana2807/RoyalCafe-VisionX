"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, Home, Calendar, Utensils, Star, ShieldCheck, Download } from "lucide-react";
import Navbar from "@/components/customer/navbar/Navbar";
import Footer from "@/components/customer/footer/Footer";

function BookingConfirmationContent() {
  const searchParams = useSearchParams();

  const bookingId = searchParams.get("bookingId") || "RCC-2026-000145";
  const paymentId = searchParams.get("paymentId") || "PAY-98765432";
  const bookingType = searchParams.get("bookingType") || "Study Workspace";
  const workspace = searchParams.get("workspace") || "Quiet Study Zone";
  const seat = searchParams.get("seat") || "Desk #12";
  const date = searchParams.get("date") || "19/07/2026";
  const time = searchParams.get("time") || "02:00 PM";
  const duration = searchParams.get("duration") || "2 Hours";
  const guests = searchParams.get("guests") || "1 Person";
  const purpose = searchParams.get("purpose") || "Work";
  const amount = searchParams.get("amount") || "368";

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-28 text-left">
      <div className="bg-white p-8 sm:p-12 rounded-[2.5rem] card-shadow border border-primary/5 text-center space-y-6 animate-fade-in">
        
        {/* Success Icon Badge */}
        <div className="h-20 w-20 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center border-4 border-emerald-200 shadow-sm">
          <CheckCircle2 className="h-10 w-10 stroke-[2.5]" />
        </div>

        {/* Title */}
        <div className="space-y-2">
          <span className="inline-flex items-center gap-1.5 text-xs font-extrabold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full uppercase tracking-wider">
            <ShieldCheck className="h-3.5 w-3.5" /> Payment Confirmed
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold font-serif text-[#5A2E0C]">
            Reservation Confirmed!
          </h1>
          <p className="text-xs sm:text-sm text-foreground/75 font-sans max-w-md mx-auto">
            Your reservation at RoyalCafe Connect has been successfully processed and locked in.
          </p>
        </div>

        {/* Booking & Payment Details Summary Card */}
        <div className="bg-[#FAF6F0] p-6 sm:p-8 rounded-[20px] border border-primary/10 text-left text-xs space-y-3.5 font-semibold max-w-xl mx-auto card-shadow">
          <div className="flex justify-between border-b border-primary/10 pb-3">
            <span className="text-foreground/50 uppercase tracking-wider">Booking Type:</span>
            <span className="font-bold text-accent uppercase tracking-wider">{bookingType}</span>
          </div>
          <div className="flex justify-between border-b border-primary/10 pb-3">
            <span className="text-foreground/50 uppercase tracking-wider">Booking ID:</span>
            <span className="font-mono font-bold text-[#5A2E0C] text-sm">{bookingId}</span>
          </div>
          <div className="flex justify-between border-b border-primary/10 pb-3">
            <span className="text-foreground/50 uppercase tracking-wider">Payment ID:</span>
            <span className="font-mono font-bold text-accent">{paymentId}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-foreground/50">Reservation Date:</span>
            <span className="font-bold font-mono text-[#5A2E0C]">{date}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-foreground/50">Arrival Time:</span>
            <span className="font-bold text-primary">{time}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-foreground/50">Details / Selection:</span>
            <span className="font-bold text-primary">{workspace} ({seat})</span>
          </div>
          <div className="flex justify-between">
            <span className="text-foreground/50">Guests &amp; Purpose:</span>
            <span className="font-bold text-primary">{guests} • {purpose}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-foreground/50">Booking Status:</span>
            <span className="font-bold text-emerald-600">Confirmed</span>
          </div>
          <div className="flex justify-between">
            <span className="text-foreground/50">Payment Status:</span>
            <span className="font-bold text-emerald-600">Paid &amp; Verified</span>
          </div>
          <div className="flex justify-between text-sm font-bold text-primary border-t border-primary/10 pt-3">
            <span>Total Amount Paid:</span>
            <span className="text-[#EA5A0C] font-serif text-lg">₹{amount}</span>
          </div>
        </div>

        {/* PDF Receipt download trigger */}
        <div className="pt-2">
          <button
            onClick={() => alert(`Downloading official tax receipt for ${bookingId}...`)}
            className="inline-flex items-center gap-2 text-xs font-bold text-[#5A2E0C] hover:text-accent transition-colors cursor-pointer uppercase tracking-wider"
          >
            <Download className="h-4 w-4" /> Download Official PDF Receipt
          </button>
        </div>

        {/* Action Navigation Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-6 border-t border-primary/10">
          <Link
            href="/"
            className="px-4 py-3 bg-[#2A1506] text-white text-xs font-bold rounded-full hover:bg-[#2A1506]/90 shadow-md inline-flex items-center justify-center gap-1.5 uppercase tracking-wider text-center"
          >
            <Home className="h-3.5 w-3.5" /> Back to Home
          </Link>

          <Link
            href="/book"
            className="px-4 py-3 bg-white border border-primary/20 text-[#5A2E0C] text-xs font-bold rounded-full hover:bg-foreground/5 shadow-sm inline-flex items-center justify-center gap-1.5 uppercase tracking-wider text-center"
          >
            <Calendar className="h-3.5 w-3.5 text-accent" /> Book Another
          </Link>

          <Link
            href="/menu"
            className="px-4 py-3 bg-white border border-primary/20 text-[#5A2E0C] text-xs font-bold rounded-full hover:bg-foreground/5 shadow-sm inline-flex items-center justify-center gap-1.5 uppercase tracking-wider text-center"
          >
            <Utensils className="h-3.5 w-3.5 text-accent" /> View Menu
          </Link>

          <Link
            href="/reviews"
            className="px-4 py-3 bg-white border border-primary/20 text-[#5A2E0C] text-xs font-bold rounded-full hover:bg-foreground/5 shadow-sm inline-flex items-center justify-center gap-1.5 uppercase tracking-wider text-center"
          >
            <Star className="h-3.5 w-3.5 text-accent" /> Leave Review
          </Link>
        </div>

      </div>
    </div>
  );
}

export default function BookingConfirmationPage() {
  return (
    <>
      <Navbar />
      <main className="w-full flex-grow bg-background min-h-screen">
        <Suspense fallback={<div className="py-32 text-center text-primary font-bold">Loading confirmation details...</div>}>
          <BookingConfirmationContent />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
