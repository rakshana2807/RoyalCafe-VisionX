"use client";

import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
}

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs: FAQItem[] = [
    {
      question: "Is Wi-Fi free?",
      answer: "Yes! Every customer receives complimentary high-speed Wi-Fi for up to 45 minutes with any purchase. If you require extended internet access for remote work or study, you can easily upgrade to a Smart Wi-Fi Pass, or buy a Daily Workspace Pass.",
    },
    {
      question: "Can I reserve seats?",
      answer: "Absolutely. You can view real-time seating availability on our Live Status dashboard page and book specific hot desks, window seats, quiet zone desks, or meeting booths in advance.",
    },
    {
      question: "Are charging ports available?",
      answer: "Yes, charging ports and power plugs are available at every single workspace desk, focus pod, and private booth in our cafe. They support standard power plugs and direct USB fast-charging cables.",
    },
    {
      question: "Can teams book together?",
      answer: "Yes! Teams can reserve meeting tables or collaborative private booths designed to fit up to 4-6 people. For larger groups, you can book multiple booths or reserve spaces together.",
    },
    {
      question: "What are the working hours?",
      answer: "Our co-working cafe is open Monday through Friday from 8:00 AM to 10:00 PM, and Saturday and Sunday from 9:00 AM to 11:00 PM.",
    },
  ];

  const toggleFAQ = (index: number) => {
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
          <h2 className="text-3xl sm:text-4xl font-bold font-serif text-[#5A2E0C] mb-3">
            Frequently Asked Questions
          </h2>
          <p className="text-xs sm:text-sm text-foreground/75 font-sans max-w-xl mx-auto">
            Got questions? We have answers. Find everything you need to know about our co-working workspace.
          </p>
        </div>

        {/* Interactive Accordion List matching Figma */}
        <div className="space-y-3.5">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-[20px] border border-primary/5 card-shadow overflow-hidden transition-all duration-300"
              >
                {/* Header Trigger button */}
                <button
                  onClick={() => toggleFAQ(idx)}
                  className="w-full p-5 flex justify-between items-center text-left font-serif font-bold text-primary text-sm sm:text-base transition-colors hover:text-accent cursor-pointer"
                >
                  <span className="flex items-center gap-3">
                    <div className="h-6 w-6 rounded-full bg-[#EA5A0C]/10 flex items-center justify-center text-[#EA5A0C] shrink-0">
                      <HelpCircle className="h-3.5 w-3.5 stroke-[2.5]" />
                    </div>
                    {faq.question}
                  </span>
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
                  <p className="p-5 text-xs text-foreground/80 leading-relaxed font-sans pl-14">
                    {faq.answer}
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
