"use client";

import { useState } from "react";
import { ChevronDown, ShieldCheck } from "lucide-react";

interface PolicyItem {
  title: string;
  detail: string;
}

export default function Policies() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const policies: PolicyItem[] = [
    { title: "Cancellation Policy", detail: "Free cancellation is available up to 2 hours before your scheduled arrival time with 100% refund." },
    { title: "Refund Policy", detail: "Refunds are processed automatically and credited back to your original payment method within 1 to 3 business days." },
    { title: "Late Arrival", detail: "We hold your reserved desk for 20 minutes past your scheduled arrival time before marking it available for walk-ins." },
    { title: "Seat Holding Time", detail: "Your reservation guarantees your seat for the full duration specified in your pass." },
    { title: "Membership Benefits", detail: "RoyalCafe Connect members receive 10% discount on pre-ordered coffee and priority desk booking." },
  ];

  const togglePolicy = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section className="py-12 bg-background text-foreground text-left">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-10">
          <h3 className="text-2xl sm:text-3xl font-bold font-serif text-primary mb-2">
            Booking Policies & Guarantee
          </h3>
          <p className="text-xs sm:text-sm text-foreground/75 font-sans">
            Transparent rules for cancellations, refunds, and late arrivals.
          </p>
        </div>

        <div className="space-y-3">
          {policies.map((item, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div key={idx} className="bg-white rounded-2xl border border-primary/5 card-shadow overflow-hidden">
                <button
                  onClick={() => togglePolicy(idx)}
                  className="w-full p-5 flex justify-between items-center text-left font-serif font-bold text-primary text-base cursor-pointer"
                >
                  <span className="flex items-center gap-2.5">
                    <ShieldCheck className="h-4 w-4 text-accent" />
                    {item.title}
                  </span>
                  <ChevronDown className={`h-4 w-4 text-primary/60 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                </button>
                {isOpen && (
                  <div className="p-5 pt-0 text-xs text-foreground/75 border-t border-primary/5 font-sans leading-relaxed">
                    {item.detail}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
