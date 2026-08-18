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
import { createLocalBooking, parseDurationHours, resolveSpaceId } from "@/lib/reservation";
import { useBooking } from "@/context/BookingContext";

function PaymentContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { clearBooking, wifiPass } = useBooking();

  React.useEffect(() => {
    if (!isAuthenticated()) {
      const msg = encodeURIComponent("Please login to your RoyalCafeConnect account to reserve a seat.");
      router.replace(`/login?redirect=/book&message=${msg}`);
    }
  }, [router]);

  const bookingType = searchParams.get("bookingType") || "Study Seat";
  const workspace = searchParams.get("workspace") || "Quiet Study Area";
  const seat = searchParams.get("seat") || "Desk #12";
  const date = searchParams.get("date") || "19/07/2026";
  const rawDate = searchParams.get("rawDate") || new Date().toISOString().split("T")[0];
  const time = searchParams.get("time") || "02:00 PM";
  const duration = searchParams.get("duration") || "2 Hours";
  const guests = searchParams.get("guests") || "1 Person";
  const purpose = searchParams.get("purpose") || "Work";
  const specialRequests = searchParams.get("specialRequests") || "";
  const grandTotal = parseFloat(searchParams.get("amount") || "0");
  const seatTotal = parseFloat(searchParams.get("seatAmount") || "0");
  const wifiPassAmount = parseFloat(searchParams.get("wifiPassAmount") || "0");
  const foodAndDrinksTotal = parseFloat(searchParams.get("foodAndDrinksTotal") || "0");
  const parsedGst = parseFloat(searchParams.get("gstAmount") || "0");

  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const handleConfirm = async () => {
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
      // Create confirmed row in localDb bookings table
      const localRecord = await createLocalBooking({
        userId: user.id || "anonymous",
        userName: user.name,
        userEmail: user.email,
        userPhone: user.phone,
        spaceId: await resolveSpaceId(workspace || seat || bookingType),
        bookingDate: rawDate,
        startTime: time,
        durationHours: durationHours,
        numberOfPeople: guestsCount,
        totalAmount: grandTotal, // This will be ignored and recalculated on server
        wifiPassPrice: wifiPass?.price,
        wifiPassId: wifiPass?.id,
        wifiPassName: wifiPass?.name || searchParams.get("wifiPassName") || undefined,
        wifiPassDuration: wifiPass?.duration || searchParams.get("wifiPassDuration") || undefined,
        specialRequest: specialRequests || purpose,
      });

      // Save to localStorage for profile and admin views as fallback/UI state
      const serverCalculatedAmount = localRecord?.total_amount || grandTotal;
      const newBookingRecord = {
        bookingId: displayBookingId,
        localDbId: localRecord?.id,
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
        paymentStatus: "Paid",
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
        systemBookingId: localRecord?.id || "",
        paymentId,
        bookingType,
        workspace,
        seat,
        date,
        time,
        duration,
        guests,
        purpose,
        amount: serverCalculatedAmount.toString(),
        status: "confirmed",
        paymentStatus: "paid",
      });

      router.push(`/booking-confirmation?${params.toString()}`);
    } catch (err: any) {
      console.error("Payment & Booking insertion error:", err);
      setErrorMessage(err.message || "Unable to create booking. Please try again.");
    } finally {
      setIsProcessing(false);
      setShowPaymentModal(false);
    }
  };

  const handleOpenPaymentModal = (e: React.FormEvent) => {
    e.preventDefault();
    setShowPaymentModal(true);
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

        {/* Confirmation Screen */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Confirmation Form (7 Cols) */}
          <div className="lg:col-span-7 bg-white p-8 sm:p-10 rounded-[2.5rem] card-shadow border border-primary/5 space-y-6">
            
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-[#EA5A0C]/10 flex items-center justify-center text-[#EA5A0C]">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold font-serif text-[#2A1506]">Confirm Booking</h2>
                <p className="text-sm text-foreground/60 font-medium">Review your details before confirming</p>
              </div>
            </div>

            {errorMessage && (
              <div className="p-3 bg-red-50 text-red-600 text-sm font-bold rounded-xl border border-red-100 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 mt-0.5 shrink-0" />
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleOpenPaymentModal} className="space-y-6">
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full bg-[#2A1506] hover:bg-[#3D2314] text-white py-4 rounded-xl font-bold text-sm transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  Confirm & Pay
                </button>
              </div>
            </form>
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
              
              <div className="flex justify-between items-center pb-2 border-b border-primary/5">
                <span className="text-foreground/50">WiFi Pass</span>
                <span className="font-bold text-accent">{wifiPass ? `${wifiPass.name} (₹${wifiPass.price})` : "None"}</span>
              </div>

              <div className="flex justify-between items-center pt-2">
                <span className="text-sm font-bold text-primary">Expected Total</span>
                <span className="text-xl font-black text-accent">₹{grandTotal}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Dummy Payment Modal */}
        {showPaymentModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
            <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl space-y-6">
              <h3 className="text-xl font-bold font-serif text-center border-b pb-4">Payment Summary</h3>
              
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span>Seat Amount ({duration}):</span>
                  <span className="font-bold">₹{seatTotal}</span>
                </div>
                {wifiPassAmount > 0 && (
                  <div className="flex justify-between">
                    <span>WiFi Pass:</span>
                    <span className="font-bold">₹{wifiPassAmount}</span>
                  </div>
                )}
                {foodAndDrinksTotal > 0 && (
                  <div className="flex justify-between">
                    <span>Food &amp; Drinks:</span>
                    <span className="font-bold">₹{foodAndDrinksTotal}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>GST (2%):</span>
                  <span className="font-bold">₹{parsedGst}</span>
                </div>
                <div className="border-t pt-3 flex justify-between text-lg font-bold">
                  <span>Total:</span>
                  <span className="text-accent">₹{grandTotal}</span>
                </div>
              </div>

              <button
                onClick={handleConfirm}
                disabled={isProcessing}
                className="w-full bg-[#2A1506] hover:bg-[#3D2314] text-white py-3 rounded-xl font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isProcessing ? "Processing..." : `Pay ₹${grandTotal}`}
              </button>
              
              <button
                onClick={() => setShowPaymentModal(false)}
                disabled={isProcessing}
                className="w-full text-foreground/60 hover:text-foreground text-sm py-2"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
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
     
    </>
  );
}
