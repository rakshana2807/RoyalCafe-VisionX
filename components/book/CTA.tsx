"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface CTAProps {
  onProceed: () => void;
}

export default function CTA({ onProceed }: CTAProps) {
  return (
    <section className="py-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="bg-[#FAF6F0] rounded-[2.5rem] p-10 sm:p-14 text-center card-shadow border border-primary/5 relative overflow-hidden">
          <div className="relative z-10 max-w-xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold font-serif text-primary mb-3">
              Almost Ready!
            </h2>
            <p className="text-xs sm:text-sm text-foreground/80 leading-relaxed mb-8 font-sans">
              Review your workspace selection and proceed to secure payment to lock in your desk reservation.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={onProceed}
                className="w-full sm:w-auto px-8 py-3.5 bg-[#EA5A0C] hover:bg-[#EA5A0C]/95 text-white rounded-full text-xs font-bold shadow-md inline-flex items-center justify-center gap-2 cursor-pointer uppercase tracking-wider hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>Proceed to Payment</span>
                <ArrowRight className="h-4 w-4" />
              </button>

              <Link
                href="/live-status"
                className="w-full sm:w-auto px-8 py-3.5 border border-primary/20 text-xs font-bold rounded-full text-primary bg-white hover:bg-foreground/5 cursor-pointer uppercase tracking-wider"
              >
                Back to Live Status
              </Link>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
