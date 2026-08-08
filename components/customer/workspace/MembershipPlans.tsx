"use client";

import { useState } from "react";
import { Check, Info } from "lucide-react";
import { useBooking } from "@/context/BookingContext";

export default function MembershipPlans() {
  const [activePlanType, setActivePlanType] = useState<"wifi" | "daily">("wifi");
  const [addedPass, setAddedPass] = useState<string | null>(null);
  const { setWifiPass } = useBooking();

  const handleSelectPass = (name: string, duration: string, price: number) => {
    setWifiPass({ name, duration, price });
    setAddedPass(name);
    setTimeout(() => setAddedPass(null), 2500);
  };

  return (
    <section id="passes" className="py-12 bg-background text-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-8 animate-fade-in">
          <h2 className="text-3xl sm:text-4xl font-bold font-serif text-[#5A2E0C] mb-4">
            Workspace Plans &amp; Passes
          </h2>

          {/* Toggle pills matching Figma */}
          <div className="inline-flex p-1 bg-[#FAF6F0] rounded-full border border-primary/10">
            <button
              onClick={() => setActivePlanType("wifi")}
              className={`px-6 py-2 rounded-full text-xs font-bold transition-all duration-300 cursor-pointer ${
                activePlanType === "wifi"
                  ? "bg-white text-[#5A2E0C] shadow-sm"
                  : "text-primary/70 hover:text-primary"
              }`}
            >
              Smart Wi-Fi Passes
            </button>
            <button
              onClick={() => setActivePlanType("daily")}
              className={`px-6 py-2 rounded-full text-xs font-bold transition-all duration-300 cursor-pointer ${
                activePlanType === "daily"
                  ? "bg-white text-[#5A2E0C] shadow-sm"
                  : "text-primary/70 hover:text-primary"
              }`}
            >
              Daily Workspace Passes
            </button>
          </div>
        </div>

        {/* Info Callout Banner matching Figma */}
        <div className="max-w-4xl mx-auto mb-10 bg-[#FAF6F0] border-l-4 border-[#5A2E0C] rounded-r-2xl p-5 sm:p-6 flex items-start gap-3.5 text-left card-shadow">
          <div className="h-6 w-6 rounded-full bg-[#5A2E0C]/10 text-[#5A2E0C] flex items-center justify-center shrink-0 mt-0.5">
            <Info className="h-4 w-4 stroke-[2.5]" />
          </div>
          <p className="text-xs sm:text-sm text-foreground/80 leading-relaxed font-sans font-medium">
            Every guest receives 30 minutes of Complimentary Wi-Fi with any purchase. For extended study sessions, choose a pass below.
          </p>
        </div>

        {/* Passes grid (2 cols) matching Figma */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          
          {/* Card 1: Student Pass */}
          <div className="bg-[#FAF6F0]/60 p-8 sm:p-10 rounded-[28px] border border-primary/10 flex flex-col justify-between text-left card-shadow h-full">
            <div>
              <h3 className="text-2xl font-bold font-serif text-[#5A2E0C] text-center mb-2">
                Student Pass
              </h3>
              <div className="text-center mb-6">
                <span className="text-3xl font-bold font-serif text-[#5A2E0C]">₹39</span>
                <span className="text-xs font-semibold text-foreground/50"> / 1 Hours</span>
              </div>

              {/* Feature checkmarks */}
              <ul className="space-y-3.5 mb-8">
                <li className="flex gap-2.5 items-center text-xs sm:text-sm font-semibold text-foreground/85">
                  <div className="h-5 w-5 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 text-emerald-600">
                    <Check className="h-3.5 w-3.5 stroke-[3]" />
                  </div>
                  <span>100 Mbps Dedicated Bandwidth</span>
                </li>
                <li className="flex gap-2.5 items-center text-xs sm:text-sm font-semibold text-foreground/85">
                  <div className="h-5 w-5 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 text-emerald-600">
                    <Check className="h-3.5 w-3.5 stroke-[3]" />
                  </div>
                  <span>Access to Student Study Zone</span>
                </li>
                <li className="flex gap-2.5 items-center text-xs sm:text-sm font-semibold text-foreground/85">
                  <div className="h-5 w-5 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 text-emerald-600">
                    <Check className="h-3.5 w-3.5 stroke-[3]" />
                  </div>
                  <span>Priority Power Outlet Seating</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => handleSelectPass("Student Pass", "1 Hour", 39)}
              className={`w-full py-4 px-6 border border-transparent text-xs font-bold rounded-full text-white transition-all shadow-md cursor-pointer uppercase tracking-wider text-center ${
                addedPass === "Student Pass"
                  ? "bg-emerald-600"
                  : "bg-[#EA5A0C] hover:bg-[#EA5A0C]/90"
              }`}
            >
              {addedPass === "Student Pass" ? "✓ Added to Booking" : "Buy Student Pass"}
            </button>
          </div>

          {/* Card 2: Work Pass (POPULAR) */}
          <div className="bg-[#FAF6F0]/60 p-8 sm:p-10 rounded-[28px] border-2 border-[#5A2E0C]/30 flex flex-col justify-between text-left card-shadow h-full relative">
            
            {/* POPULAR badge at top */}
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#2A1506] text-white text-[9px] font-extrabold uppercase tracking-widest px-4 py-1 rounded-full shadow-sm">
              POPULAR
            </div>

            <div>
              <h3 className="text-2xl font-bold font-serif text-[#5A2E0C] text-center mb-2 pt-2">
                Work Pass
              </h3>
              <div className="text-center mb-6">
                <span className="text-3xl font-bold font-serif text-[#5A2E0C]">₹49</span>
                <span className="text-xs font-semibold text-foreground/50"> / 1 Hours</span>
              </div>

              {/* Feature checkmarks */}
              <ul className="space-y-3.5 mb-8">
                <li className="flex gap-2.5 items-center text-xs sm:text-sm font-semibold text-foreground/85">
                  <div className="h-5 w-5 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 text-emerald-600">
                    <Check className="h-3.5 w-3.5 stroke-[3]" />
                  </div>
                  <span>Unlimited 200 Mbps Fiber connection</span>
                </li>
                <li className="flex gap-2.5 items-center text-xs sm:text-sm font-semibold text-foreground/85">
                  <div className="h-5 w-5 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 text-emerald-600">
                    <Check className="h-3.5 w-3.5 stroke-[3]" />
                  </div>
                  <span>Noise-cancelling headphone rental</span>
                </li>
                <li className="flex gap-2.5 items-center text-xs sm:text-sm font-semibold text-foreground/85">
                  <div className="h-5 w-5 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 text-emerald-600">
                    <Check className="h-3.5 w-3.5 stroke-[3]" />
                  </div>
                  <span>10% discount on coffee refills</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => handleSelectPass("Work Pass", "1 Hour", 49)}
              className={`w-full py-4 px-6 border border-transparent text-xs font-bold rounded-full text-white transition-all shadow-md cursor-pointer uppercase tracking-wider text-center ${
                addedPass === "Work Pass"
                  ? "bg-emerald-600"
                  : "bg-[#EA5A0C] hover:bg-[#EA5A0C]/90"
              }`}
            >
              {addedPass === "Work Pass" ? "✓ Added to Booking" : "Buy Work Pass"}
            </button>
          </div>

        </div>

      </div>
    </section>
  );
}
