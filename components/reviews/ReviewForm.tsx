"use client";

import { useState, FormEvent } from "react";
import { Star, Send, RotateCcw, Camera, CheckCircle2 } from "lucide-react";

export default function ReviewForm() {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    visitDate: "",
    purpose: "Work",
    reviewTitle: "",
    reviewMessage: "",
    agreeGenuine: false,
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
    if (!formData.reviewTitle.trim()) errs.reviewTitle = "Review Title is required";
    if (!formData.reviewMessage.trim()) errs.reviewMessage = "Review Message cannot be empty";
    if (!formData.agreeGenuine) {
      errs.agreeGenuine = "You must confirm that this review is genuine";
    }
    return errs;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);

    if (Object.keys(errs).length === 0) {
      try {
        await fetch("/api/reviews", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fullName: formData.fullName,
            email: formData.email,
            rating,
            reviewTitle: formData.reviewTitle,
            comment: formData.reviewMessage,
            visitDate: formData.visitDate,
            purpose: formData.purpose,
          }),
        });
        setIsSubmitted(true);
      } catch (err) {
        console.error("Failed to submit review:", err);
        setIsSubmitted(true);
      }
    }
  };

  const handleReset = () => {
    setRating(5);
    setFormData({
      fullName: "",
      email: "",
      visitDate: "",
      purpose: "Work",
      reviewTitle: "",
      reviewMessage: "",
      agreeGenuine: false,
    });
    setErrors({});
    setIsSubmitted(false);
  };

  return (
    <section id="write-review" className="py-20 bg-background/50 text-foreground text-left">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-3xl sm:text-4xl font-bold font-serif text-primary mb-4">
            Share Your Experience
          </h2>
          <p className="text-base text-foreground/75 font-sans max-w-xl mx-auto">
            Your feedback helps us improve our workspace, drinks, and community environment for everyone.
          </p>
        </div>

        {/* Success Alert Banner */}
        {isSubmitted ? (
          <div className="bg-emerald-500/10 border border-emerald-500/30 p-8 rounded-3xl text-center card-shadow animate-fade-in">
            <CheckCircle2 className="h-12 w-12 text-emerald-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold font-serif text-emerald-900 mb-2">
              Review Submitted for Approval!
            </h3>
            <p className="text-sm text-emerald-800 leading-relaxed font-sans max-w-md mx-auto mb-6">
              Thank you for sharing your experience with RoyalCafe Connect. Your review has been sent to our moderation team and will appear on the site shortly.
            </p>
            <button
              onClick={handleReset}
              className="px-6 py-2.5 bg-emerald-700 text-white rounded-full text-xs font-bold hover:bg-emerald-800 transition-all cursor-pointer"
            >
              Write Another Review
            </button>
          </div>
        ) : (
          /* Main Form Card */
          <form
            onSubmit={handleSubmit}
            className="bg-white p-8 sm:p-12 rounded-[2.5rem] card-shadow border border-primary/5 space-y-6"
          >
            {/* Clickable Star Rating Selector */}
            <div className="text-center pb-6 border-b border-primary/5">
              <label className="block text-xs font-bold text-primary uppercase tracking-wider mb-3">
                Overall Rating *
              </label>
              <div className="flex justify-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="p-1 transition-transform hover:scale-125 focus:outline-none cursor-pointer"
                  >
                    <Star
                      className={`h-8 w-8 ${
                        star <= (hoverRating || rating)
                          ? "fill-accent text-accent"
                          : "text-zinc-200 fill-zinc-100"
                      }`}
                    />
                  </button>
                ))}
              </div>
              <span className="text-xs font-bold text-accent block mt-2">
                {rating} out of 5 Stars Selected
              </span>
            </div>

            {/* 2-Col Grid: Full Name & Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-primary uppercase tracking-wider mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Sarah Jenkins"
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
                  placeholder="sarah@example.com"
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

            {/* 2-Col Grid: Visit Date & Purpose */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-primary uppercase tracking-wider mb-2">
                  Visit Date
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
                  Purpose of Visit
                </label>
                <select
                  value={formData.purpose}
                  onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-primary/10 text-sm font-sans focus:outline-none focus:ring-2 focus:ring-primary/20 bg-white"
                >
                  <option value="Study">Study Session</option>
                  <option value="Work">Remote Work</option>
                  <option value="Meeting">Team Meeting</option>
                  <option value="Relax">Relaxation</option>
                  <option value="Coffee">Coffee & Snacks</option>
                </select>
              </div>
            </div>

            {/* Review Title */}
            <div>
              <label className="block text-xs font-bold text-primary uppercase tracking-wider mb-2">
                Review Headline *
              </label>
              <input
                type="text"
                placeholder="e.g. Best co-working cafe for deep focus"
                value={formData.reviewTitle}
                onChange={(e) => setFormData({ ...formData, reviewTitle: e.target.value })}
                className={`w-full px-4 py-3 rounded-xl border text-sm font-sans focus:outline-none focus:ring-2 ${
                  errors.reviewTitle ? "border-rose-500 focus:ring-rose-200" : "border-primary/10 focus:ring-primary/20"
                }`}
              />
              {errors.reviewTitle && (
                <span className="text-[11px] font-semibold text-rose-500 block mt-1">{errors.reviewTitle}</span>
              )}
            </div>

            {/* Review Message & Character Counter */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-xs font-bold text-primary uppercase tracking-wider">
                  Review Message *
                </label>
                <span className="text-[10px] font-semibold text-foreground/40">
                  {formData.reviewMessage.length} / 500 characters
                </span>
              </div>
              <textarea
                rows={4}
                maxLength={500}
                placeholder="Tell us about the Wi-Fi speed, coffee quality, noise level, or seating comfort..."
                value={formData.reviewMessage}
                onChange={(e) => setFormData({ ...formData, reviewMessage: e.target.value })}
                className={`w-full px-4 py-3 rounded-xl border text-sm font-sans focus:outline-none focus:ring-2 ${
                  errors.reviewMessage ? "border-rose-500 focus:ring-rose-200" : "border-primary/10 focus:ring-primary/20"
                }`}
              />
              {errors.reviewMessage && (
                <span className="text-[11px] font-semibold text-rose-500 block mt-1">{errors.reviewMessage}</span>
              )}
            </div>

            {/* Photo Upload Trigger */}
            <div className="p-4 bg-[#FAF6F0] rounded-xl border border-primary/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Camera className="h-5 w-5 text-accent" />
                <span className="text-xs font-bold text-primary">
                  Attach Photo (Optional)
                </span>
              </div>
              <button
                type="button"
                onClick={() => alert("Photo selector opened! (Demo placeholder)")}
                className="px-4 py-1.5 bg-white border border-primary/10 rounded-full text-xs font-bold text-primary hover:bg-foreground/5 cursor-pointer"
              >
                Choose Photo
              </button>
            </div>

            {/* Genuine Checkbox */}
            <div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.agreeGenuine}
                  onChange={(e) => setFormData({ ...formData, agreeGenuine: e.target.checked })}
                  className="h-4 w-4 text-primary rounded border-primary/20 focus:ring-primary"
                />
                <span className="text-xs font-medium text-foreground/80">
                  I confirm this review is genuine and based on my personal experience.
                </span>
              </label>
              {errors.agreeGenuine && (
                <span className="text-[11px] font-semibold text-rose-500 block mt-1">{errors.agreeGenuine}</span>
              )}
            </div>

            {/* Action Buttons */}
            <div className="pt-4 flex flex-col sm:flex-row gap-4 items-center justify-end">
              <button
                type="button"
                onClick={handleReset}
                className="w-full sm:w-auto px-6 py-3 border border-primary/20 text-xs font-bold rounded-full text-primary hover:bg-foreground/5 transition-all inline-flex items-center justify-center gap-2 cursor-pointer"
              >
                <RotateCcw className="h-4 w-4" />
                <span>Reset Form</span>
              </button>

              <button
                type="submit"
                className="w-full sm:w-auto px-8 py-3 border border-transparent text-xs font-bold rounded-full text-white bg-primary hover:bg-primary/95 transition-all shadow-md inline-flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
              >
                <Send className="h-4 w-4" />
                <span>Submit Review</span>
              </button>
            </div>

          </form>
        )}

      </div>
    </section>
  );
}
