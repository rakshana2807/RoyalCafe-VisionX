"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import {
  CreditCard,
  Lock,
  ArrowLeft,
  ShieldCheck,
  Building2,
  Smartphone,
  Banknote,
  Info,
  Calendar,
  Clock,
  MapPin,
  User,
  Coffee,
} from "lucide-react";
import Navbar from "@/components/customer/navbar/Navbar";
import Footer from "@/components/customer/footer/Footer";
import { isAuthenticated, getAuthenticatedUser } from "@/lib/auth";
import { createSupabaseBooking, parseDurationHours, resolveSpaceId } from "@/lib/reservation";
import { supabase } from "@/lib/supabase";
import { useBooking } from "@/context/BookingContext";

function PaymentContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { clearBooking } = useBooking();

  React.useEffect(() => {
    if (!isAuthenticated()) {
      const msg = encodeURIComponent("Please login to your RoyalCafeConnect account to book a workspace.");
      router.replace(`/login?redirect=/book&message=${msg}`);
    }
  }, [router]);

  const bookingType = searchParams.get("bookingType") || "Study Workspace";
  const workspace = searchParams.get("workspace") || "Quiet Study Zone";
  const seat = searchParams.get("seat") || "Desk #12";
  const date = searchParams.get("date") || "19/07/2026";
  const rawDate = searchParams.get("rawDate") || new Date().toISOString().split("T")[0];
  const time = searchParams.get("time") || "02:00 PM";
  const duration = searchParams.get("duration") || "2 Hours";
  const guests = searchParams.get("guests") || "1 Person";
  const purpose = searchParams.get("purpose") || "Work";
  const specialRequests = searchParams.get("specialRequests") || "";
  const grandTotal = parseFloat(searchParams.get("amount") || "368");

  const [paymentMethod, setPaymentMethod] = useState<"card" | "apple" | "upi" | "cash">("card");
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setErrorMessage(null);

    const user = getAuthenticatedUser();
    if (!user) {
      setErrorMessage("Please login before creating a booking.");
      setIsProcessing(false);
      return;
    }

    const displayBookingId = `RCC-2026-${Math.floor(100000 + Math.random() * 900000)}`;
    const paymentId = `PAY-${Math.floor(10000000 + Math.random() * 90000000)}`;
    const guestsCount = parseInt(guests, 10) || 1;
    const durationHours = parseDurationHours(duration);

    try {
      // Create confirmed row in Supabase bookings table
      const supabaseRecord = await createSupabaseBooking({
        userId: user.id,
        userName: user.name,
        userEmail: user.email,
        userPhone: user.phone,
        spaceId: resolveSpaceId(workspace || seat || bookingType),
        bookingDate: rawDate,
        startTime: time,
        durationHours: durationHours,
        numberOfPeople: guestsCount,
        totalAmount: grandTotal,
        paymentStatus: paymentMethod === "cash" ? "unpaid" : "paid",
        specialRequest: specialRequests || purpose,
      });

      // Save to localStorage for profile and admin views as fallback/UI state
      const newBookingRecord = {
        bookingId: displayBookingId,
        supabaseId: supabaseRecord?.id,
        paymentId,
        userName: user.name || "Customer",
        userEmail: user.email,
        userPhone: user.phone || "+91 98765 43210",
        workspace,
        workspaceType: bookingType,
        seat,
        date,
        arrivalTime: time,
        duration,
        guests,
        purpose,
        amount: grandTotal,
        status: "Confirmed",
        paymentStatus: paymentMethod === "cash" ? "Unpaid" : "Paid",
        createdAt: new Date().toISOString(),
      };

      if (typeof window !== "undefined") {
        const existingBookings = JSON.parse(localStorage.getItem("rcc_user_bookings") || "[]");
        localStorage.setItem("rcc_user_bookings", JSON.stringify([newBookingRecord, ...existingBookings]));

        const existingAdminRes = JSON.parse(localStorage.getItem("rcc_admin_reservations") || "[]");
        localStorage.setItem("rcc_admin_reservations", JSON.stringify([newBookingRecord, ...existingAdminRes]));

        const deskMatch = seat.match(/(W-\d+|T-[A-Z0-9-]+|L-SS-\d+|L-2S-\d+)/i);
        if (deskMatch) {
          const seatId = deskMatch[1];
          const currentSeatMap = JSON.parse(localStorage.getItem("rcc_seat_status_map") || "{}");
          currentSeatMap[seatId] = "reserved";
          localStorage.setItem("rcc_seat_status_map", JSON.stringify(currentSeatMap));
        }
      }

      clearBooking();

      const params = new URLSearchParams({
        bookingId: displayBookingId,
        supabaseBookingId: supabaseRecord?.id || "",
        paymentId,
        bookingType,
        workspace,
        seat,
        date,
        time,
        duration,
        guests,
        purpose,
        amount: grandTotal.toFixed(0),
        status: "confirmed",
        paymentStatus: paymentMethod === "cash" ? "unpaid" : "paid",
      });

      router.push(`/booking-confirmation?${params.toString()}`);
    } catch (err: any) {
      console.error("Payment & Booking insertion error:", err);
      setErrorMessage(err.message || "Unable to create booking. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <section className="pt-28 pb-20 bg-background text-foreground text-left min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back Link */}
        <Link
          href="/book"
          className="inline-flex items-center gap-2 text-xs font-bold text-primary hover:text-accent mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Booking Details</span>
        </Link>

        {/* Payment Form Screen */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Payment Method Form (7 Cols) */}
          <div className="lg:col-span-7 bg-white p-8 sm:p-10 rounded-[2.5rem] card-shadow border border-primary/5 space-y-6">
            
            <div className="flex items-center justify-between border-b border-primary/5 pb-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold font-serif text-primary">
                  Secure Payment
                </h1>
                <p className="text-xs text-foreground/60 font-sans">
                  256-Bit SSL Encrypted Checkout
                </p>
              </div>
              <Lock className="h-6 w-6 text-emerald-600" />
            </div>

            {errorMessage && (
              <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2">
                <span>⚠️ {errorMessage}</span>
              </div>
            )}

            {/* Select Method */}
            <div className="space-y-3">
              <label className="text-xs font-bold uppercase tracking-wider text-foreground/50 block">
                Select Payment Method
              </label>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentMethod("card")}
                  className={`p-4 rounded-2xl border text-left flex items-center gap-3 transition-all cursor-pointer ${
                    paymentMethod === "card"
                      ? "border-primary bg-primary/5 ring-2 ring-primary/20 text-primary font-bold"
                      : "border-primary/10 bg-white text-foreground/70 hover:border-primary/30"
                  }`}
                >
                  <CreditCard className="h-5 w-5 text-accent" />
                  <span className="text-xs">Credit/Debit Card</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod("upi")}
                  className={`p-4 rounded-2xl border text-left flex items-center gap-3 transition-all cursor-pointer ${
                    paymentMethod === "upi"
                      ? "border-primary bg-primary/5 ring-2 ring-primary/20 text-primary font-bold"
                      : "border-primary/10 bg-white text-foreground/70 hover:border-primary/30"
                  }`}
                >
                  <Smartphone className="h-5 w-5 text-accent" />
                  <span className="text-xs">UPI / GPay / PhonePe</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod("apple")}
                  className={`p-4 rounded-2xl border text-left flex items-center gap-3 transition-all cursor-pointer ${
                    paymentMethod === "apple"
                      ? "border-primary bg-primary/5 ring-2 ring-primary/20 text-primary font-bold"
                      : "border-primary/10 bg-white text-foreground/70 hover:border-primary/30"
                  }`}
                >
                  <Building2 className="h-5 w-5 text-accent" />
                  <span className="text-xs">Net Banking</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod("cash")}
                  className={`p-4 rounded-2xl border text-left flex items-center gap-3 transition-all cursor-pointer ${
                    paymentMethod === "cash"
                      ? "border-primary bg-primary/5 ring-2 ring-primary/20 text-primary font-bold"
                      : "border-primary/10 bg-white text-foreground/70 hover:border-primary/30"
                  }`}
                >
                  <Banknote className="h-5 w-5 text-accent" />
                  <span className="text-xs">Pay at Counter</span>
                </button>
              </div>
            </div>

            {/* Input fields for Card */}
            {paymentMethod === "card" && (
              <form onSubmit={handlePay} className="space-y-4 pt-2">
                <div>
                  <label className="text-xs font-bold text-primary block mb-1">
                    Cardholder Name
                  </label>
                  <input
                    type="text"
                    required
                    defaultValue="Alex Morgan"
                    placeholder="Full name on card"
                    className="w-full px-4 py-3 bg-[#FAF6F0] border border-primary/10 rounded-xl text-sm text-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-primary block mb-1">
                    Card Number
                  </label>
                  <input
                    type="text"
                    required
                    defaultValue="4532 •••• •••• 8892"
                    placeholder="16-digit card number"
                    className="w-full px-4 py-3 bg-[#FAF6F0] border border-primary/10 rounded-xl text-sm text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 font-mono"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-primary block mb-1">
                      Expiry Date
                    </label>
                    <input
                      type="text"
                      required
                      defaultValue="08/28"
                      placeholder="MM/YY"
                      className="w-full px-4 py-3 bg-[#FAF6F0] border border-primary/10 rounded-xl text-sm text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-primary block mb-1">
                      CVV
                    </label>
                    <input
                      type="password"
                      required
                      defaultValue="•••"
                      maxLength={4}
                      placeholder="3 digits"
                      className="w-full px-4 py-3 bg-[#FAF6F0] border border-primary/10 rounded-xl text-sm text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 font-mono"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full py-4 mt-4 bg-primary hover:bg-primary/95 text-white font-bold text-sm rounded-full shadow-md transition-all duration-300 cursor-pointer active:scale-98 uppercase tracking-wider flex items-center justify-center gap-2"
                >
                  {isProcessing ? (
                    <span className="flex items-center gap-2">
                      <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Processing Payment...
                    </span>
                  ) : (
                    <>
                      <ShieldCheck className="h-4 w-4 text-accent" />
                      <span>Pay ₹{grandTotal.toFixed(0)} Now</span>
                    </>
                  )}
                </button>
              </form>
            )}

            {/* Form for UPI */}
            {paymentMethod === "upi" && (
              <form onSubmit={handlePay} className="space-y-4 pt-2">
                <div>
                  <label className="text-xs font-bold text-primary block mb-1">
                    UPI ID / VPA
                  </label>
                  <input
                    type="text"
                    required
                    defaultValue="alex@okaxis"
                    placeholder="username@upi"
                    className="w-full px-4 py-3 bg-[#FAF6F0] border border-primary/10 rounded-xl text-sm text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 font-mono"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full py-4 mt-4 bg-primary hover:bg-primary/95 text-white font-bold text-sm rounded-full shadow-md transition-all duration-300 cursor-pointer uppercase tracking-wider flex items-center justify-center gap-2"
                >
                  {isProcessing ? "Verifying UPI..." : `Pay ₹${grandTotal.toFixed(0)} via UPI`}
                </button>
              </form>
            )}

            {/* Form for Apple / Net Banking / Cash */}
            {(paymentMethod === "apple" || paymentMethod === "cash") && (
              <div className="pt-2 space-y-4">
                <div className="p-4 bg-[#FAF6F0] rounded-xl border border-primary/10 text-xs text-foreground/75 leading-relaxed">
                  <Info className="h-4 w-4 text-accent inline mr-1" />
                  {paymentMethod === "cash"
                    ? "Pay at counter allows you to lock your desk or table reservation now and complete payment upon arrival."
                    : "Net Banking authentication will redirect directly to your bank portal after clicking confirm."}
                </div>
                <button
                  onClick={handlePay}
                  disabled={isProcessing}
                  className="w-full py-4 bg-primary hover:bg-primary/95 text-white font-bold text-sm rounded-full shadow-md transition-all duration-300 cursor-pointer uppercase tracking-wider flex items-center justify-center gap-2"
                >
                  {isProcessing ? "Processing..." : `Confirm Reservation (₹${grandTotal.toFixed(0)})`}
                </button>
              </div>
            )}

          </div>

          {/* Booking Summary Sidebar (5 Cols) */}
          <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-[2.5rem] card-shadow border border-primary/5 space-y-6">
            
            <div className="flex items-center justify-between border-b border-primary/5 pb-3">
              <h2 className="text-lg font-bold font-serif text-primary">
                Booking Summary
              </h2>
              <span className="text-[10px] font-extrabold px-3 py-1 bg-[#FAF6F0] text-accent rounded-full uppercase tracking-wider border border-primary/5">
                {bookingType}
              </span>
            </div>

            <div className="space-y-3.5 text-xs text-foreground/80 font-semibold">
              <div className="flex justify-between items-center pb-2 border-b border-primary/5">
                <span className="text-foreground/50 flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-accent" /> Selection
                </span>
                <span className="text-primary font-bold">{workspace}</span>
              </div>

              <div className="flex justify-between items-center pb-2 border-b border-primary/5">
                <span className="text-foreground/50 flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-accent" /> Reservation Date
                </span>
                <span className="text-accent font-bold font-mono">{date}</span>
              </div>

              <div className="flex justify-between items-center pb-2 border-b border-primary/5">
                <span className="text-foreground/50 flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-accent" /> Arrival Time
                </span>
                <span className="text-primary font-bold">{time}</span>
              </div>

              <div className="flex justify-between items-center pb-2 border-b border-primary/5">
                <span className="text-foreground/50 flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-accent" /> Duration
                </span>
                <span className="text-primary font-bold">{duration}</span>
              </div>

              <div className="flex justify-between items-center pb-2 border-b border-primary/5">
                <span className="text-foreground/50 flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5 text-accent" /> Guests &amp; Purpose
                </span>
                <span className="text-primary font-bold">{guests} • {purpose}</span>
              </div>
            </div>

            {/* Price Calculations */}
            <div className="pt-4 border-t border-primary/10 space-y-2 text-xs">
              <div className="flex justify-between text-base font-bold text-primary pt-1">
                <span>Total Payable</span>
                <span className="text-[#EA5A0C] font-serif text-xl">₹{grandTotal.toFixed(0)}</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}

export default function PaymentPage() {
  return (
    <>
      <Navbar />
      <main className="w-full flex-grow bg-background">
        <Suspense fallback={<div className="py-20 text-center text-primary font-bold">Loading payment details...</div>}>
          <PaymentContent />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
