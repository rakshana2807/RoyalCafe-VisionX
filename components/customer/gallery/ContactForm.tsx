"use client";

import { useState, FormEvent } from "react";
import { Send, CheckCircle2, RotateCcw } from "lucide-react";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    subject: "General Inquiry",
    message: "",
    visitDate: "",
    visitTime: "",
    agreePrivacy: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.fullName.trim()) errs.fullName = "Full Name is required";
    if (!formData.email.trim()) {
      errs.email = "Email address is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errs.email = "Please enter a valid email address";
    }
    if (!formData.phone.trim()) {
      errs.phone = "Phone number is required";
    }
    if (!formData.message.trim()) errs.message = "Message cannot be empty";
    if (!formData.agreePrivacy) {
      errs.agreePrivacy = "You must agree to the Privacy Policy";
    }
    return errs;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);

    if (Object.keys(errs).length === 0) {
      setIsSubmitted(true);
    }
  };

  const handleClear = () => {
    setFormData({
      fullName: "",
      email: "",
      phone: "",
      subject: "General Inquiry",
      message: "",
      visitDate: "",
      visitTime: "",
      agreePrivacy: false,
    });
    setErrors({});
    setIsSubmitted(false);
  };

  return (
    <section id="contact-form" className="py-20 bg-background/50 text-foreground text-left">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-3xl sm:text-4xl font-bold font-serif text-primary mb-4">
            Get In Touch
          </h2>
          <p className="text-base text-foreground/75 font-sans max-w-xl mx-auto">
            Have questions about seat reservations, event bookings, or corporate passes? Send us a message today.
          </p>
        </div>

        {/* Success Alert Banner */}
        {isSubmitted ? (
          <div className="bg-emerald-500/10 border border-emerald-500/30 p-8 rounded-3xl text-center card-shadow animate-fade-in">
            <CheckCircle2 className="h-12 w-12 text-emerald-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold font-serif text-emerald-900 mb-2">
              Message Sent Successfully!
            </h3>
            <p className="text-sm text-emerald-800 leading-relaxed font-sans max-w-md mx-auto mb-6">
              Thank you for reaching out to RoyalCafe Connect. Our team will review your inquiry and respond within 24 hours.
            </p>
            <button
              onClick={handleClear}
              className="px-6 py-2.5 bg-emerald-700 text-white rounded-full text-xs font-bold hover:bg-emerald-800 transition-all cursor-pointer"
            >
              Send Another Message
            </button>
          </div>
        ) : (
          /* Main Form Card */
          <form
            onSubmit={handleSubmit}
            className="bg-white p-8 sm:p-12 rounded-[2.5rem] card-shadow border border-primary/5 space-y-6"
          >
            {/* 2-Col Grid: Full Name & Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-primary uppercase tracking-wider mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Alex Morgan"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className={`w-full px-4 py-3 rounded-xl border text-sm font-sans focus:outline-none focus:ring-2 ${
                    errors.fullName ? "border-rose-500 focus:ring-rose-200" : "border-primary/10 focus:ring-primary/20"
                  }`}
                />
                {errors.fullName && (
                  <span className="text-[11px] font-semibold text-rose-500 block mt-1">{errors.fullName}</span>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-primary uppercase tracking-wider mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  placeholder="alex@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className={`w-full px-4 py-3 rounded-xl border text-sm font-sans focus:outline-none focus:ring-2 ${
                    errors.email ? "border-rose-500 focus:ring-rose-200" : "border-primary/10 focus:ring-primary/20"
                  }`}
                />
                {errors.email && (
                  <span className="text-[11px] font-semibold text-rose-500 block mt-1">{errors.email}</span>
                )}
              </div>
            </div>

            {/* 2-Col Grid: Phone & Subject */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-primary uppercase tracking-wider mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className={`w-full px-4 py-3 rounded-xl border text-sm font-sans focus:outline-none focus:ring-2 ${
                    errors.phone ? "border-rose-500 focus:ring-rose-200" : "border-primary/10 focus:ring-primary/20"
                  }`}
                />
                {errors.phone && (
                  <span className="text-[11px] font-semibold text-rose-500 block mt-1">{errors.phone}</span>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-primary uppercase tracking-wider mb-2">
                  Subject
                </label>
                <select
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-primary/10 text-sm font-sans focus:outline-none focus:ring-2 focus:ring-primary/20 bg-white"
                >
                  <option value="General Inquiry">General Inquiry</option>
                  <option value="Desk Reservation">Desk Reservation</option>
                  <option value="Event Booking">Event / Meeting Booking</option>
                  <option value="Feedback">Feedback & Suggestions</option>
                </select>
              </div>
            </div>

            {/* 2-Col Grid: Visit Date & Time */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-primary uppercase tracking-wider mb-2">
                  Preferred Visit Date
                </label>
                <input
                  type="date"
                  value={formData.visitDate}
                  onChange={(e) => setFormData({ ...formData, visitDate: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-primary/10 text-sm font-sans focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-primary uppercase tracking-wider mb-2">
                  Preferred Time
                </label>
                <input
                  type="time"
                  value={formData.visitTime}
                  onChange={(e) => setFormData({ ...formData, visitTime: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-primary/10 text-sm font-sans focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>

            {/* Message Area */}
            <div>
              <label className="block text-xs font-bold text-primary uppercase tracking-wider mb-2">
                Message *
              </label>
              <textarea
                rows={4}
                placeholder="How can we help you?"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className={`w-full px-4 py-3 rounded-xl border text-sm font-sans focus:outline-none focus:ring-2 ${
                  errors.message ? "border-rose-500 focus:ring-rose-200" : "border-primary/10 focus:ring-primary/20"
                }`}
              />
              {errors.message && (
                <span className="text-[11px] font-semibold text-rose-500 block mt-1">{errors.message}</span>
              )}
            </div>

            {/* Privacy Checkbox */}
            <div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.agreePrivacy}
                  onChange={(e) => setFormData({ ...formData, agreePrivacy: e.target.checked })}
                  className="h-4 w-4 text-primary rounded border-primary/20 focus:ring-primary"
                />
                <span className="text-xs font-medium text-foreground/80">
                  I agree to the Privacy Policy and terms of service.
                </span>
              </label>
              {errors.agreePrivacy && (
                <span className="text-[11px] font-semibold text-rose-500 block mt-1">{errors.agreePrivacy}</span>
              )}
            </div>

            {/* Action Buttons */}
            <div className="pt-4 flex flex-col sm:flex-row gap-4 items-center justify-end">
              <button
                type="button"
                onClick={handleClear}
                className="w-full sm:w-auto px-6 py-3 border border-primary/20 text-xs font-bold rounded-full text-primary hover:bg-foreground/5 transition-all inline-flex items-center justify-center gap-2 cursor-pointer"
              >
                <RotateCcw className="h-4 w-4" />
                <span>Clear Form</span>
              </button>

              <button
                type="submit"
                className="w-full sm:w-auto px-8 py-3 border border-transparent text-xs font-bold rounded-full text-white bg-primary hover:bg-primary/95 transition-all shadow-md inline-flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
              >
                <Send className="h-4 w-4" />
                <span>Send Message</span>
              </button>
            </div>

          </form>
        )}

      </div>
    </section>
  );
}
