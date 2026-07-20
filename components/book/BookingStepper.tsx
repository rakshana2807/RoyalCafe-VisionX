"use client";

import { Check } from "lucide-react";

interface StepperProps {
  currentStep: number;
  onStepClick: (step: number) => void;
}

export default function BookingStepper({ currentStep, onStepClick }: StepperProps) {
  const steps = [
    { num: 1, label: "Select Workspace" },
    { num: 2, label: "Date & Time" },
    { num: 3, label: "Select Seat" },
    { num: 4, label: "Review Booking" },
    { num: 5, label: "Payment" },
  ];

  return (
    <div className="py-6 bg-background/50 text-foreground border-b border-primary/5 mb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 overflow-x-auto scrollbar-hide">
        <div className="flex items-center justify-between min-w-[640px]">
          {steps.map((step, idx) => {
            const isCompleted = currentStep > step.num;
            const isCurrent = currentStep === step.num;

            return (
              <div key={step.num} className="flex items-center flex-1 last:flex-initial">
                
                {/* Circle & Label */}
                <button
                  onClick={() => onStepClick(step.num)}
                  className="flex items-center gap-2.5 group cursor-pointer focus:outline-none"
                >
                  <div
                    className={`h-8 w-8 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-300 ${
                      isCompleted
                        ? "bg-emerald-600 text-white shadow-sm"
                        : isCurrent
                        ? "bg-primary text-white shadow-md ring-4 ring-primary/15"
                        : "bg-white text-primary/40 border border-primary/10"
                    }`}
                  >
                    {isCompleted ? <Check className="h-4 w-4 stroke-[3]" /> : step.num}
                  </div>

                  <span
                    className={`text-xs font-bold whitespace-nowrap transition-colors ${
                      isCurrent
                        ? "text-primary font-serif"
                        : isCompleted
                        ? "text-emerald-700"
                        : "text-foreground/45"
                    }`}
                  >
                    {step.label}
                  </span>
                </button>

                {/* Connecting Line (except for last step) */}
                {idx < steps.length - 1 && (
                  <div
                    className={`flex-1 h-0.5 mx-4 transition-all duration-300 ${
                      currentStep > step.num ? "bg-emerald-500" : "bg-primary/10"
                    }`}
                  />
                )}

              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
