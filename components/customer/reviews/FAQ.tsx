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
      question: "How are reviews verified?",
      answer: "Reviews marked with a Verified Customer badge are submitted by customers who have checked in or placed an order using our Live Status page, wifi portal, or cafe app.",
    },
    {
      question: "Can I edit my review?",
      answer: "Yes! If you submitted a review while logged in, you can update your star rating, review headline, or comments directly from your user dashboard at any time.",
    },
    {
      question: "Can I upload photos?",
      answer: "Absolutely. We encourage customers to upload photos of their desk setups, specialty drinks, or team meetings. High-quality photos may be featured in our Captured Moments gallery!",
    },
    {
      question: "How long does approval take?",
      answer: "Reviews submitted by verified customers are published automatically. Unverified submissions undergo a quick automated safety check that takes between 1 to 4 hours.",
    },
    {
      question: "How are ratings calculated?",
      answer: "Overall cafe ratings are calculated using a weighted Bayesian average of all verified customer reviews across Wi-Fi quality, noise levels, seating comfort, and coffee service.",
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
            Review Guidelines & FAQ
          </h2>
          <p className="text-base text-foreground/75 font-sans">
            How we maintain authentic, helpful feedback for our co-working community.
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
