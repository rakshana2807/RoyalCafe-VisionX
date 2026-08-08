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
    { question: "Can I reschedule?", answer: "Yes, you can reschedule your visit up to 1 hour before arrival directly through your booking confirmation email." },
    { question: "Can I cancel?", answer: "Yes, cancellations are free of charge up to 2 hours before your scheduled arrival time." },
    { question: "Can I book multiple seats?", answer: "Yes, you can select up to 4 individual desks or book a 6-person meeting booth for group work." },
    { question: "Can I extend my booking?", answer: "Yes, if the desk is not reserved for the following slot, you can extend your session on the spot via your phone." },
    { question: "Are walk-ins allowed?", answer: "Walk-ins are welcome, but desk availability is subject to live capacity. We recommend booking in advance." },
  ];

  return (
    <section className="py-12 bg-background/50 text-foreground text-left">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-10">
          <h3 className="text-2xl sm:text-3xl font-bold font-serif text-primary mb-2">
            Frequently Asked Questions
          </h3>
          <p className="text-xs sm:text-sm text-foreground/75 font-sans">
            Need help with your reservation? Here are answers to common questions.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div key={idx} className="bg-white rounded-2xl border border-primary/5 card-shadow overflow-hidden">
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full p-5 flex justify-between items-center text-left font-serif font-bold text-primary text-base cursor-pointer"
                >
                  <span className="flex items-center gap-2.5">
                    <HelpCircle className="h-4 w-4 text-accent" />
                    {faq.question}
                  </span>
                  <ChevronDown className={`h-4 w-4 text-primary/60 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                </button>
                {isOpen && (
                  <div className="p-5 pt-0 text-xs text-foreground/75 border-t border-primary/5 font-sans leading-relaxed">
                    {faq.answer}
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
