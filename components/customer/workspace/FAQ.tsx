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
      question: "What is the Complimentary WiFi Pass?",
      answer: "The Complimentary WiFi Pass gives visitors free internet access for 45 minutes with a usage limit of 500 MB. It is designed for quick browsing, messaging, email, and other light online tasks.",
    },
    {
      question: "Is the Complimentary WiFi Pass really free?",
      answer: "Yes. The Complimentary WiFi Pass is completely free and does not require payment.",
    },
    {
      question: "How long can I use the free WiFi?",
      answer: "The complimentary connection is available for up to 45 minutes.",
    },
    {
      question: "How much data is included?",
      answer: "The complimentary pass includes up to 500 MB of usage.",
    },
    {
      question: "What can I use the Complimentary WiFi for?",
      answer: "It is ideal for messaging, email, quick browsing, checking documents, and other light internet activities.",
    },
    {
      question: "What should I choose for longer work sessions?",
      answer: "Choose the Student Pass or Work Pass for longer sessions, higher bandwidth, and additional workspace benefits.",
    },
    {
      question: "Can I switch from the free pass to a premium pass?",
      answer: "Yes. You can choose a premium WiFi pass whenever you need a longer or more feature-rich workspace session, subject to the existing booking flow.",
    },
    {
      question: "Does using WiFi require booking a seat?",
      answer: "Follow the existing Royal Cafe booking rules shown by the application. Keep this answer synchronized with the current implemented functionality rather than introducing new rules.",
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
    <section className="py-24 bg-background">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-3xl sm:text-4xl font-extrabold font-serif text-primary mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-base text-primary/80 font-sans max-w-xl mx-auto">
            Everything you need to know about staying connected at Royal Cafe.
          </p>
        </div>

        {/* Interactive Accordion List */}
        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className={`rounded-[20px] border overflow-hidden transition-all duration-300 ${
                  isOpen ? "bg-background border-primary/20 shadow-md" : "bg-background border-primary/20"
                }`}
              >
                {/* Header Trigger button */}
                <button
                  onClick={() => toggleFAQ(idx)}
                  className="w-full p-6 flex justify-between items-center text-left font-serif font-bold text-primary text-base sm:text-lg transition-colors hover:text-primary/90 cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <span className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                      <HelpCircle className="h-4 w-4 stroke-[2.5]" />
                    </div>
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`h-5 w-5 text-primary transition-transform duration-300 shrink-0 ${
                      isOpen ? "transform rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Collapsible Answer panel */}
                <div
                  className={`transition-all duration-300 ease-in-out overflow-hidden ${
                    isOpen ? "max-h-[300px] border-t border-primary/10 opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  <p className="p-6 text-sm text-primary/80 leading-relaxed font-sans pl-16">
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
