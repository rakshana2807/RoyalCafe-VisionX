"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Coffee, Mail, Lock, User, Phone, Eye, EyeOff, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import Navbar from "@/components/customer/navbar/Navbar";
import Footer from "@/components/customer/footer/Footer";

export default function RegisterPage() {
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const validateEmail = (val: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
  const validatePhone = (val: string) => /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/.test(val);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!fullName.trim()) {
      newErrors.fullName = "Full Name is required";
    } else if (fullName.trim().length < 2) {
      newErrors.fullName = "Name must be at least 2 characters";
    }

    if (!email.trim()) {
      newErrors.email = "Email address is required";
    } else if (!validateEmail(email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!validatePhone(phone.trim())) {
      newErrors.phone = "Please enter a valid phone number";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setErrors({});

    try {
      const userObj = {
        id: `usr-${Date.now()}`,
        name: fullName,
        email: email,
        phone: phone,
        role: "customer",
      };

      localStorage.setItem("user", JSON.stringify(userObj));
      localStorage.setItem("royalcafe_user", JSON.stringify(userObj));
      window.dispatchEvent(new Event("auth-state-change"));

      setToastMessage("Registration successful! Redirecting to login...");
      setTimeout(() => {
        router.push("/login");
      }, 1400);
    } catch {
      setErrors({ form: "Error during registration. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-grow pt-32 pb-24 flex items-center justify-center relative overflow-hidden px-4 sm:px-6 lg:px-8">
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-accent/10 rounded-full filter blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 -right-32 w-96 h-96 bg-primary/10 rounded-full filter blur-3xl pointer-events-none" />

        <div className="w-full max-w-lg bg-surface/90 backdrop-blur-xl rounded-3xl border border-border shadow-[0_8px_30px_rgba(10,5,3,0.08)] p-8 sm:p-12 relative z-10">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="w-14 h-14 rounded-2xl bg-background border border-border flex items-center justify-center mx-auto mb-5 shadow-sm">
              <Coffee className="w-7 h-7 text-primary" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold font-serif text-primary">Create an Account</h1>
            <p className="text-xs text-foreground/80 font-medium mt-2">
              Join RoyalCafe Connect for seamless workspace bookings and exclusive perks.
            </p>
          </div>

          {/* Form Error Banner */}
          {errors.form && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-3"
            >
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              <span>{errors.form}</span>
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleRegister} className="space-y-5 text-left">
            {/* Full Name */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold uppercase tracking-[0.15em] text-primary">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/80" />
                <input
                  type="text"
                  placeholder="Alex Morgan"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className={`w-full pl-11 pr-4 py-3.5 rounded-2xl bg-background border text-xs text-foreground placeholder:text-foreground/80 focus:outline-none focus:ring-1 focus:ring-accent/30 transition-all ${
                    errors.fullName ? "border-red-500 bg-red-50/30" : "border-border focus:border-accent"
                  }`}
                />
              </div>
              {errors.fullName && (
                <p className="text-xs text-red-600 font-medium flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  {errors.fullName}
                </p>
              )}
            </div>

            {/* Email & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Email */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold uppercase tracking-[0.15em] text-primary">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/80" />
                  <input
                    type="email"
                    placeholder="alex@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`w-full pl-11 pr-4 py-3.5 rounded-2xl bg-background border text-xs text-foreground placeholder:text-foreground/80 focus:outline-none focus:ring-1 focus:ring-accent/30 transition-all ${
                      errors.email ? "border-red-500 bg-red-50/30" : "border-border focus:border-accent"
                    }`}
                  />
                </div>
                {errors.email && (
                  <p className="text-xs text-red-600 font-medium flex items-center gap-1">
                    <AlertCircle className="w-3 h-3 shrink-0" />
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold uppercase tracking-[0.15em] text-primary">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/80" />
                  <input
                    type="tel"
                    placeholder="+1 234 567 8900"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className={`w-full pl-11 pr-4 py-3.5 rounded-2xl bg-background border text-xs text-foreground placeholder:text-foreground/80 focus:outline-none focus:ring-1 focus:ring-accent/30 transition-all ${
                      errors.phone ? "border-red-500 bg-red-50/30" : "border-border focus:border-accent"
                    }`}
                  />
                </div>
                {errors.phone && (
                  <p className="text-xs text-red-600 font-medium flex items-center gap-1">
                    <AlertCircle className="w-3 h-3 shrink-0" />
                    {errors.phone}
                  </p>
                )}
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold uppercase tracking-[0.15em] text-primary">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/80" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full pl-11 pr-11 py-3.5 rounded-2xl bg-background border text-xs text-foreground placeholder:text-foreground/80 focus:outline-none focus:ring-1 focus:ring-accent/30 transition-all ${
                    errors.password ? "border-red-500 bg-red-50/30" : "border-border focus:border-accent"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-foreground/80 hover:text-primary transition-colors cursor-pointer"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-red-600 font-medium flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  {errors.password}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold uppercase tracking-[0.15em] text-primary">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/80" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Re-enter password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`w-full pl-11 pr-11 py-3.5 rounded-2xl bg-background border text-xs text-foreground placeholder:text-foreground/80 focus:outline-none focus:ring-1 focus:ring-accent/30 transition-all ${
                    errors.confirmPassword ? "border-red-500 bg-red-50/30" : "border-border focus:border-accent"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-foreground/80 hover:text-primary transition-colors cursor-pointer"
                  aria-label="Toggle confirm password visibility"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-xs text-red-600 font-medium flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            {/* Register Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 px-6 rounded-full text-background font-semibold text-xs uppercase tracking-[0.15em] bg-primary hover:bg-primary/95 shadow-[0_8px_30px_rgba(10,5,3,0.15)] hover:shadow-[0_12px_40px_rgba(10,5,3,0.25)] hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 mt-6"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Creating Account...
                </>
              ) : (
                "Register"
              )}
            </button>
          </form>

          {/* Switch to Login */}
          <p className="text-center text-xs text-foreground/70 pt-6">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-bold text-accent hover:text-primary transition-colors hover:underline"
            >
              Login
            </Link>
          </p>

          {/* Toast Notification Banner */}
          <AnimatePresence>
            {toastMessage && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute -bottom-16 left-0 right-0 p-3.5 bg-emerald-700 text-primary text-xs font-semibold rounded-2xl shadow-xl flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                <span>{toastMessage}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      <Footer />
    </div>
  );
}
