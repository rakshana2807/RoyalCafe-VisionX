"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

interface TermItem {
  question: string;
  answer: string;
}

export default function TermsAccordion() {
  // First item open by default like in Figma design
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const terms: TermItem[] = [
    {
      question: "Offer Availability",
      answer: "Our daily promotions and seasonal offers are subject to ingredient availability and operating hours. Specific discounts cannot be combined with other ongoing promotional codes or student workspace day passes.",
    },
    {
      question: "Discounts and Promotions",
      answer: "Happy hour prices and combo specials apply strictly during designated time slots. Promotional discounts are applied automatically at checkout when ordering valid items.",
    },
    {
      question: "Redemption Policy",
      answer: "All pass redemptions and special offers must be presented to café staff or activated via our digital ordering system prior to order confirmation.",
    },
  ];

  const toggleTerm = (index: number) => {
    if (openIndex === index) {
      setOpenIndex(null);
    } else {
      setOpenIndex(index);
    }
  };

  return (
    <section className="py-12 bg-background text-foreground">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header matching Figma */}
        <div className="text-center mb-8 animate-fade-in">
          <h2 className="text-2xl sm:text-3xl font-bold font-serif text-[#5A2E0C]">
            Terms &amp; Conditions
          </h2>
        </div>

        {/* Accordion container matching Figma */}
        <div className="space-y-4">
          {terms.map((term, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-[20px] border border-primary/5 card-shadow overflow-hidden transition-all duration-300"
              >
                {/* Accordion trigger header */}
                <button
                  onClick={() => toggleTerm(idx)}
                  className="w-full p-5 flex justify-between items-center text-left font-serif font-bold text-primary text-sm sm:text-base transition-colors hover:text-accent cursor-pointer"
                >
                  <span>{term.question}</span>
                  <ChevronDown
                    className={`h-4 w-4 text-primary/60 transition-transform duration-300 ${
                      isOpen ? "transform rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Collapsible Answer panel */}
                <div
                  className={`transition-all duration-300 ease-in-out overflow-hidden ${
                    isOpen ? "max-h-[300px] border-t border-primary/5" : "max-h-0"
                  }`}
                >
                  <p className="p-5 text-xs text-foreground/75 leading-relaxed font-sans">
                    {term.answer}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
