"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, ArrowLeft, CheckCircle2, AlertCircle, Loader2, KeyRound } from "lucide-react";
import Navbar from "@/components/Navbar";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validateEmail = (val: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(val);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim()) {
      setError("Please enter your email address");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepared for backend integration spot (e.g. await fetch('/api/auth/forgot-password', ...))
      await new Promise((resolve) => setTimeout(resolve, 1200));
      setIsSubmitted(true);
    } catch {
      setError("Failed to send reset link. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F1EA]">
      <Navbar />

      <main className="flex-grow pt-24 pb-12 flex items-center justify-center relative overflow-hidden px-4 sm:px-6 lg:px-8">
        {/* Subtle Background Elements */}
        <div className="absolute top-1/3 -left-24 w-80 h-80 bg-accent/10 rounded-full filter blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 -right-24 w-80 h-80 bg-primary/10 rounded-full filter blur-3xl pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md bg-white/90 backdrop-blur-xl rounded-3xl border border-primary/10 shadow-2xl p-8 sm:p-10 text-center relative z-10"
        >
          {/* Header Icon */}
          <div className="w-16 h-16 rounded-2xl bg-[#F8F1EA] border border-primary/15 flex items-center justify-center mx-auto mb-6 shadow-sm">
            <KeyRound className="w-8 h-8 text-primary" />
          </div>

          <h1 className="text-2xl font-bold font-serif text-primary mb-2">Forgot Password?</h1>
          <p className="text-xs text-foreground/70 mb-8 leading-relaxed">
            No worries! Enter your registered email address and we&apos;ll send you instructions to reset your password.
          </p>

          <AnimatePresence mode="wait">
            {isSubmitted ? (
              <motion.div
                key="success-message"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-6"
              >
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-center gap-3 text-left">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <div>
                    <span className="font-bold block text-emerald-900">Reset link sent!</span>
                    <span className="text-xs text-emerald-700">
                      We have dispatched a password reset link to <strong className="font-semibold">{email}</strong>.
                    </span>
                  </div>
                </div>

                <div className="pt-2 space-y-3">
                  <Link
                    href="/auth"
                    className="w-full py-3.5 px-6 rounded-full text-white font-semibold text-sm bg-gradient-to-r from-[#5A2E0C] via-[#6F3A0E] to-[#3D1E07] hover:from-[#472309] hover:to-[#2B1404] shadow-lg shadow-primary/20 transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    Return to Sign In
                  </Link>

                  <button
                    type="button"
                    onClick={() => {
                      setIsSubmitted(false);
                      setEmail("");
                    }}
                    className="text-xs font-semibold text-accent hover:text-primary transition-colors cursor-pointer"
                  >
                    Didn&apos;t receive the email? Try again
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.form
                key="reset-form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onSubmit={handleSubmit}
                className="space-y-6 text-left"
              >
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-foreground/80">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40" />
                    <input
                      type="email"
                      placeholder="yourname@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={`w-full pl-11 pr-4 py-3 rounded-2xl bg-[#F8F1EA]/60 border text-sm text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all ${
                        error ? "border-red-500 bg-red-50/30" : "border-primary/15 focus:border-primary"
                      }`}
                    />
                  </div>
                  {error && (
                    <p className="text-xs text-red-600 font-medium mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      {error}
                    </p>
                  )}
                </div>

                <motion.button
                  whileHover={{ scale: 1.015 }}
                  whileTap={{ scale: 0.985 }}
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 px-6 rounded-full text-white font-semibold text-sm bg-gradient-to-r from-[#5A2E0C] via-[#6F3A0E] to-[#3D1E07] hover:from-[#472309] hover:to-[#2B1404] shadow-lg shadow-primary/20 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Sending reset link...
                    </>
                  ) : (
                    "Send Reset Link"
                  )}
                </motion.button>

                <div className="text-center pt-2">
                  <Link
                    href="/auth"
                    className="inline-flex items-center justify-center gap-2 text-xs font-semibold text-foreground/70 hover:text-primary transition-colors group"
                  >
                    <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
                    Back to Sign In
                  </Link>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>
      </main>
    </div>
  );
}
