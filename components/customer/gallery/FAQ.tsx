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
      question: "Do I need a reservation?",
      answer: "Walk-ins are always welcome! However, if you are planning to work during peak hours (10:00 AM - 3:00 PM) or require specific seating like quiet pods, we recommend reserving your desk in advance via our Live Status dashboard.",
    },
    {
      question: "Can I book for groups?",
      answer: "Yes, we have 4-seater tables and private 6-person meeting booths available for group work sessions, sprint planning, or team catch-ups. Group reservations can be made online or through our contact form.",
    },
    {
      question: "Is Wi-Fi free?",
      answer: "Every cafe purchase includes 45 minutes of complimentary high-speed fiber Wi-Fi. For extended sessions or heavy bandwidth work, you can purchase a Smart Wi-Fi Pass or a Daily Co-working Pass.",
    },
    {
      question: "Are power outlets available?",
      answer: "Yes, every single desk, study booth, and focus pod features dedicated AC power outlets and USB fast-charging ports right at table height.",
    },
    {
      question: "Can I host meetings?",
      answer: "Yes, we have semi-private and fully enclosed private meeting booths with TV displays and whiteboards designed specifically for video calls and team presentations.",
    },
    {
      question: "What payment methods are accepted?",
      answer: "We accept all major credit and debit cards, Apple Pay, Google Pay, UPI payments, and contactless mobile payments. Cash is also accepted at our ordering counter.",
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
    <section className="py-20 bg-background text-foreground">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-3xl sm:text-4xl font-bold font-serif text-primary mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-base text-foreground/75 font-sans">
            Everything you need to know before visiting RoyalCafe Connect.
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-primary/5 card-shadow overflow-hidden transition-all duration-300"
              >
                {/* Header/Question Trigger button */}
                <button
                  onClick={() => toggleFAQ(idx)}
                  className="w-full p-6 flex justify-between items-center text-left font-serif font-bold text-primary text-base sm:text-lg transition-colors hover:text-accent cursor-pointer"
                >
                  <span className="flex items-center gap-3">
                    <HelpCircle className="h-5 w-5 text-accent shrink-0 stroke-[2]" />
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`h-5 w-5 text-primary/60 transition-transform duration-300 ${
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
                  <p className="p-6 text-sm text-foreground/80 leading-relaxed font-sans">
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
