"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Info, ArrowRight, Wifi } from "lucide-react";
import { useBooking } from "@/context/BookingContext";
import { isAuthenticated } from "@/lib/auth";

export default function MembershipPlans() {
  const router = useRouter();

  const [activePlanType, setActivePlanType] = useState<"wifi" | "daily">(
    "wifi"
  );

  const { wifiPass, setWifiPass, clearSelectedSeat } = useBooking();

  const isSelectedPass = (name: string) => {
    return wifiPass?.name === name;
  };

  const handleSelectPass = (
    name: string,
    duration: string,
    price: number
  ) => {
    /*
     * ---------------------------------------------------------
     * 1. LOGIN CHECK
     * ---------------------------------------------------------
     */
    if (!isAuthenticated()) {
      const msg = encodeURIComponent(
        "Please login to your RoyalCafeConnect account to select a WiFi pass."
      );
      router.push(`/login?redirect=/work-study&message=${msg}`);
      return;
    }

    /*
     * ---------------------------------------------------------
     * 2. ALREADY SELECTED
     * ---------------------------------------------------------
     *
     * If the user clicks the selected pass again,
     * take them to the booking page.
     */
    if (wifiPass?.name === name) {
      clearSelectedSeat(); // Important: Starting a NEW booking flow!
      router.push("/book");
      return;
    }

    /*
     * ---------------------------------------------------------
     * 3. SELECT WIFI PASS
     * ---------------------------------------------------------
     */
    setWifiPass({
      name,
      duration,
      price,
    });
  };

  return (
    <section id="passes" className="pb-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ===================================================== */}
        {/* COMPLIMENTARY WIFI SECTION */}
        {/* ===================================================== */}
        
        <div className="text-center mb-8 animate-fade-in pt-12">
          <h2 className="text-3xl sm:text-4xl font-extrabold font-serif text-primary mb-3">
            Try Our Complimentary WiFi
          </h2>
          <p className="text-base text-primary/80 font-sans max-w-xl mx-auto">
            Need to check your mail, send a quick message, or get something done fast? Start with our complimentary connection.
          </p>
        </div>

        <div className="max-w-2xl mx-auto mb-24">
          <div className="relative bg-[#320000] p-8 sm:p-12 rounded-[24px] flex flex-col justify-between text-left shadow-xl border border-[rgba(244,221,165,0.25)] transition-all duration-300 transform hover:-translate-y-1 hover:border-[#F5DAA7]">
            
            {/* COMPLIMENTARY BADGE */}
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#F5DAA7] text-[#320000] text-[10px] font-extrabold uppercase tracking-widest px-4 py-1.5 rounded-full shadow-md border border-[#F5DAA7]">
              COMPLIMENTARY
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8 mb-8">
              <div>
                <h3 className="text-[30px] sm:text-[34px] font-extrabold font-serif text-[#F5DAA7] mb-2 flex items-center gap-3">
                  <Wifi className="h-8 w-8 text-[#F5DAA7]" />
                  Complimentary WiFi
                </h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-[40px] sm:text-[48px] font-extrabold text-[#F5DAA7] leading-none">
                    FREE
                  </span>
                  <span className="text-[16px] sm:text-[18px] font-bold text-[#F5DAA7]/80">
                    / 45 Minutes
                  </span>
                </div>
                <div className="mt-2 text-sm font-bold text-[#F5DAA7]/90 tracking-wide">
                  500 MB Usage Limit
                </div>
              </div>

              {/* Complimentary Button */}
              <div className="w-full sm:w-auto shrink-0">
                <button
                  onClick={() => alert("Redirecting to WiFi login portal...")}
                  className="w-full sm:w-auto px-8 h-[56px] bg-[#F5DAA7] text-[#320000] font-bold text-sm uppercase tracking-widest rounded-full transition-all duration-300 hover:bg-[#F5DAA7] hover:-translate-y-0.5 hover:shadow-lg flex items-center justify-center cursor-pointer border border-[#F5DAA7]"
                >
                  START FREE WIFI
                </button>
              </div>
            </div>

            <div className="w-full h-px bg-primary/10 mb-8" />

            <div className="flex flex-col sm:flex-row gap-8 justify-between">
              <ul className="space-y-4">
                <li className="flex gap-3 items-start font-semibold text-primary">
                  <div className="h-5 w-5 rounded-full bg-primary flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="h-3 w-3 text-surface stroke-[3]" />
                  </div>
                  <span>Free for 45 minutes</span>
                </li>
                <li className="flex gap-3 items-start font-semibold text-primary">
                  <div className="h-5 w-5 rounded-full bg-primary flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="h-3 w-3 text-surface stroke-[3]" />
                  </div>
                  <span>Up to 500 MB usage</span>
                </li>
              </ul>
              <ul className="space-y-4">
                <li className="flex gap-3 items-start font-semibold text-primary">
                  <div className="h-5 w-5 rounded-full bg-primary flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="h-3 w-3 text-surface stroke-[3]" />
                  </div>
                  <span>Suitable for quick browsing and essential tasks</span>
                </li>
                <li className="flex gap-3 items-start font-semibold text-primary">
                  <div className="h-5 w-5 rounded-full bg-primary flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="h-3 w-3 text-surface stroke-[3]" />
                  </div>
                  <span>No payment required</span>
                </li>
              </ul>
            </div>

            <div className="mt-8 p-4 bg-primary/5 rounded-xl border border-primary/10 text-xs text-primary font-semibold leading-relaxed">
              <strong>Best for quick browsing, messaging, email, and light online tasks.</strong><br/>
              For longer work sessions or higher bandwidth needs, choose a premium pass below.
            </div>

          </div>
        </div>

        {/* ===================================================== */}
        {/* PREMIUM PASSES HEADER */}
        {/* ===================================================== */}

        <div className="text-center mb-12 animate-fade-in pt-12">
          <h2 className="text-3xl sm:text-4xl font-extrabold font-serif text-primary mb-3">
            Upgrade Your Connection
          </h2>
          <p className="text-base text-primary/80 font-sans max-w-xl mx-auto">
            Need more time, higher bandwidth, or dedicated workspace benefits? Choose the pass that matches your session.
          </p>
        </div>

        {/* Pass Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-32">
          
          {/* =================================================== */}
          {/* STUDENT PASS */}
          {/* =================================================== */}
          
          <div className={`bg-[#F5DAA7] text-[#320000] p-10 rounded-[28px] flex flex-col justify-between text-left shadow-2xl transition-all duration-300 transform group hover:-translate-y-1 ${
            isSelectedPass("Student Pass") 
              ? "border-4 border-[#320000] scale-[1.02] shadow-[0_20px_50px_rgba(50,0,0,0.3)]" 
              : "border border-[rgba(245,218,167,0.5)]"
          }`}>
            <div>
              {/* Header Icon */}
              <div className="h-14 w-14 rounded-2xl bg-[#320000]/10 border border-[#320000]/15 flex items-center justify-center mb-6">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 14L22 9L12 4L2 9L12 14Z" stroke="#320000" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M22 9V15" stroke="#320000" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M6 11V16C6 17.6569 8.68629 19 12 19C15.3137 19 18 17.6569 18 16V11" stroke="#320000" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>

              <h3 className="text-[28px] sm:text-[32px] font-black font-serif text-[#320000] mb-2">
                Student Pass
              </h3>

              <div className="flex items-baseline mb-8 gap-1.5">
                <span className="text-[42px] sm:text-[52px] font-black text-[#320000] leading-none">
                  ₹39
                </span>
                <span className="text-[16px] sm:text-[18px] font-bold text-[#320000]/70">
                  / 1 Hour
                </span>
              </div>

              {/* Benefits */}
              <ul className="space-y-5 mb-10">
                <li className="flex gap-3 items-start font-bold text-[#320000]">
                  <div className="h-5 w-5 rounded-full bg-[#320000] flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="h-3 w-3 text-[#F5DAA7] stroke-[3]" />
                  </div>
                  <span>Up to 1.5 GB Usage</span>
                </li>
                <li className="flex gap-3 items-start font-bold text-[#320000]">
                  <div className="h-5 w-5 rounded-full bg-[#320000] flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="h-3 w-3 text-[#F5DAA7] stroke-[3]" />
                  </div>
                  <span>Access to Student Study Zone</span>
                </li>
                <li className="flex gap-3 items-start font-bold text-[#320000]">
                  <div className="h-5 w-5 rounded-full bg-[#320000] flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="h-3 w-3 text-[#F5DAA7] stroke-[3]" />
                  </div>
                  <span>Priority Power Outlet Seating</span>
                </li>
              </ul>
            </div>

            {/* Selection Indicator & CTA */}
            <div>
              {isSelectedPass("Student Pass") && (
                <div className="flex items-center gap-2 mb-4 animate-fade-in text-[#320000] font-black text-sm">
                  <span className="h-5 w-5 rounded-full bg-[#320000] text-[#F5DAA7] flex items-center justify-center"><Check className="h-3 w-3 stroke-[3]" /></span>
                  Selected
                </div>
              )}
              <button
                onClick={() => handleSelectPass("Student Pass", "1 Hour", 39)}
                className="w-full h-[56px] bg-[#320000] text-[#F5DAA7] hover:bg-[#200000] font-black text-sm uppercase tracking-widest rounded-full transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                {isSelectedPass("Student Pass") ? (
                  <>
                    GO TO BOOKINGS <ArrowRight className="h-4 w-4" />
                  </>
                ) : (
                  "BUY STUDENT PASS"
                )}
              </button>
            </div>
          </div>

          {/* =================================================== */}
          {/* WORK PASS */}
          {/* =================================================== */}

          <div className={`relative bg-[#F5DAA7] text-[#320000] p-10 rounded-[28px] flex flex-col justify-between text-left shadow-2xl transition-all duration-300 transform group hover:-translate-y-1 ${
            isSelectedPass("Work Pass") 
              ? "border-4 border-[#320000] scale-[1.02] shadow-[0_20px_50px_rgba(50,0,0,0.3)]" 
              : "border border-[rgba(245,218,167,0.5)]"
          }`}>
            
            {/* POPULAR BADGE */}
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#320000] text-[#F5DAA7] text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full shadow-lg border border-[#320000]">
              POPULAR
            </div>

            <div>
              {/* Header Icon */}
              <div className="h-14 w-14 rounded-2xl bg-[#320000]/10 border border-[#320000]/15 flex items-center justify-center mb-6">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 7H4C2.89543 7 2 7.89543 2 9V19C2 20.1046 2.89543 21 4 21H20C21.1046 21 22 20.1046 22 19V9C22 7.89543 21.1046 7 20 7Z" stroke="#320000" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M16 21V5C16 4.46957 15.7893 3.96086 15.4142 3.58579C15.0391 3.21071 14.5304 3 14 3H10C9.46957 3 8.96086 3.21071 8.58579 3.58579C8.21071 3.96086 8 4.46957 8 5V21" stroke="#320000" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>

              <h3 className="text-[28px] sm:text-[32px] font-black font-serif text-[#320000] mb-2">
                Work Pass
              </h3>

              <div className="flex items-baseline mb-8 gap-1.5">
                <span className="text-[42px] sm:text-[52px] font-black text-[#320000] leading-none">
                  ₹49
                </span>
                <span className="text-[16px] sm:text-[18px] font-bold text-[#320000]/70">
                  / 1 Hour
                </span>
              </div>

              {/* Benefits */}
              <ul className="space-y-5 mb-10">
                <li className="flex gap-3 items-start font-bold text-[#320000]">
                  <div className="h-5 w-5 rounded-full bg-[#320000] flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="h-3 w-3 text-[#F5DAA7] stroke-[3]" />
                  </div>
                  <span>Up to 2.5 GB Usage</span>
                </li>
                <li className="flex gap-3 items-start font-bold text-[#320000]">
                  <div className="h-5 w-5 rounded-full bg-[#320000] flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="h-3 w-3 text-[#F5DAA7] stroke-[3]" />
                  </div>
                  <span>Noise-cancelling headphone rental</span>
                </li>
                <li className="flex gap-3 items-start font-bold text-[#320000]">
                  <div className="h-5 w-5 rounded-full bg-[#320000] flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="h-3 w-3 text-[#F5DAA7] stroke-[3]" />
                  </div>
                  <span>10% discount on coffee refills</span>
                </li>
              </ul>
            </div>

            {/* Selection Indicator & CTA */}
            <div>
              {isSelectedPass("Work Pass") && (
                <div className="flex items-center gap-2 mb-4 animate-fade-in text-[#320000] font-black text-sm">
                  <span className="h-5 w-5 rounded-full bg-[#320000] text-[#F5DAA7] flex items-center justify-center"><Check className="h-3 w-3 stroke-[3]" /></span>
                  Selected
                </div>
              )}
              <button
                onClick={() => handleSelectPass("Work Pass", "1 Hour", 49)}
                className="w-full h-[56px] bg-[#320000] text-[#F5DAA7] hover:bg-[#200000] font-black text-sm uppercase tracking-widest rounded-full transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                {isSelectedPass("Work Pass") ? (
                  <>
                    GO TO BOOKINGS <ArrowRight className="h-4 w-4" />
                  </>
                ) : (
                  "BUY WORK PASS"
                )}
              </button>
            </div>
          </div>

        </div>

        {/* ===================================================== */}
        {/* PASS COMPARISON */}
        {/* ===================================================== */}
        
        <div className="max-w-5xl mx-auto pt-12">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-3xl sm:text-4xl font-extrabold font-serif text-primary mb-3">
              Choose the Right Pass
            </h2>
          </div>

          <div className="w-full overflow-x-auto pb-4 scrollbar-hide">
            <div className="min-w-[700px] border border-[rgba(244,221,165,0.25)] rounded-2xl overflow-hidden bg-[#320000] text-[#F5DAA7] shadow-xl">
              
              {/* Header Row */}
              <div className="grid grid-cols-4 bg-[#200000] text-[#F5DAA7] border-b border-[rgba(244,221,165,0.2)]">
                <div className="p-5 font-bold font-sans text-sm uppercase tracking-wider">Feature</div>
                <div className="p-5 font-bold font-sans text-sm uppercase tracking-wider text-center border-l border-[rgba(244,221,165,0.15)]">Complimentary</div>
                <div className="p-5 font-bold font-sans text-sm uppercase tracking-wider text-center border-l border-[rgba(244,221,165,0.15)]">Student</div>
                <div className="p-5 font-bold font-sans text-sm uppercase tracking-wider text-center border-l border-[rgba(244,221,165,0.15)]">Work</div>
              </div>

              {/* Row 1: Price */}
              <div className="grid grid-cols-4 text-[#F5DAA7] border-b border-[rgba(244,221,165,0.1)] hover:bg-[#200000]/50 transition-colors">
                <div className="p-5 font-semibold text-sm">Price</div>
                <div className="p-5 font-extrabold text-sm text-center border-l border-[rgba(244,221,165,0.1)] text-[#F5DAA7]">FREE</div>
                <div className="p-5 font-semibold text-sm text-center border-l border-[rgba(244,221,165,0.1)]">₹39</div>
                <div className="p-5 font-semibold text-sm text-center border-l border-[rgba(244,221,165,0.1)]">₹49</div>
              </div>

              {/* Row 2: Duration */}
              <div className="grid grid-cols-4 text-[#F5DAA7] border-b border-[rgba(244,221,165,0.1)] hover:bg-[#200000]/50 transition-colors">
                <div className="p-5 font-semibold text-sm">Duration</div>
                <div className="p-5 font-extrabold text-sm text-center border-l border-[rgba(244,221,165,0.1)]">45 min</div>
                <div className="p-5 font-semibold text-sm text-center border-l border-[rgba(244,221,165,0.1)]">1 Hour</div>
                <div className="p-5 font-semibold text-sm text-center border-l border-[rgba(244,221,165,0.1)]">1 Hour</div>
              </div>

              {/* Row 3: Data */}
              <div className="grid grid-cols-4 text-[#F5DAA7] border-b border-[rgba(244,221,165,0.1)] hover:bg-[#200000]/50 transition-colors">
                <div className="p-5 font-semibold text-sm">Data</div>
                <div className="p-5 font-extrabold text-sm text-center border-l border-[rgba(244,221,165,0.1)]">Up to 500 MB</div>
                <div className="p-5 font-semibold text-sm text-center border-l border-[rgba(244,221,165,0.1)]">Up to 1.5 GB</div>
                <div className="p-5 font-semibold text-sm text-center border-l border-[rgba(244,221,165,0.1)]">Up to 2.5 GB</div>
              </div>

              {/* Row 4: Workspace Benefit */}
              <div className="grid grid-cols-4 text-[#F5DAA7] border-b border-[rgba(244,221,165,0.1)] hover:bg-[#200000]/50 transition-colors">
                <div className="p-5 font-semibold text-sm">Workspace Benefit</div>
                <div className="p-5 font-semibold text-sm text-center border-l border-[rgba(244,221,165,0.1)] text-[#F5DAA7]/70">Limited</div>
                <div className="p-5 font-semibold text-sm text-center border-l border-[rgba(244,221,165,0.1)]">Student Zones</div>
                <div className="p-5 font-semibold text-sm text-center border-l border-[rgba(244,221,165,0.1)]">Premium Seating</div>
              </div>

              {/* Row 5: Premium Benefits */}
              <div className="grid grid-cols-4 text-[#F5DAA7] hover:bg-[#200000]/50 transition-colors">
                <div className="p-5 font-semibold text-sm">Premium Benefits</div>
                <div className="p-5 font-semibold text-sm text-center border-l border-[rgba(244,221,165,0.1)] text-[#F5DAA7]/70">No</div>
                <div className="p-5 font-semibold text-sm text-center border-l border-[rgba(244,221,165,0.1)]">No</div>
                <div className="p-5 font-semibold text-sm text-center border-l border-[rgba(244,221,165,0.1)] flex items-center justify-center gap-1.5 text-[#F5DAA7]"><Check className="h-4 w-4" /> Yes</div>
              </div>

            </div>
          </div>
        </div>

      </div>
      
      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  );
}
