"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Coffee, Mail, Lock, Eye, EyeOff, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get("redirect") || "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const validateEmail = (val: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!email.trim()) {
      newErrors.email = "Email address is required";
    } else if (!validateEmail(email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setErrors({});

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrors({ form: data.message || "Invalid email address or password" });
        return;
      }

      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
        // Dispatch custom event to notify Navbar of state change
        window.dispatchEvent(new Event("auth-state-change"));
      }

      setToastMessage("Login successful! Redirecting...");
      setTimeout(() => {
        router.push(redirectPath);
      }, 1000);
    } catch {
      setErrors({ form: "Network error during login. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-white/90 backdrop-blur-xl rounded-3xl border border-primary/10 shadow-2xl p-8 sm:p-10 relative z-10">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-14 h-14 rounded-2xl bg-[#F8F1EA] border border-primary/15 flex items-center justify-center mx-auto mb-4 shadow-sm">
          <Coffee className="w-7 h-7 text-primary" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold font-serif text-primary">Welcome Back</h1>
        <p className="text-xs text-foreground/70 mt-1">
          Sign in to access your RoyalCafe Connect account &amp; workspace bookings.
        </p>
      </div>

      {/* Error Alert Banner */}
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
      <form onSubmit={handleLogin} className="space-y-5 text-left">
        {/* Email Field */}
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
                errors.email ? "border-red-500 bg-red-50/30" : "border-primary/15 focus:border-primary"
              }`}
            />
          </div>
          {errors.email && (
            <p className="text-xs text-red-600 font-medium mt-1 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              {errors.email}
            </p>
          )}
        </div>

        {/* Password Field */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-bold uppercase tracking-wider text-foreground/80">
              Password
            </label>
            <Link
              href="/forgot-password"
              className="text-xs font-semibold text-accent hover:text-primary transition-colors hover:underline"
            >
              Forgot Password?
            </Link>
          </div>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full pl-11 pr-11 py-3 rounded-2xl bg-[#F8F1EA]/60 border text-sm text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all ${
                errors.password ? "border-red-500 bg-red-50/30" : "border-primary/15 focus:border-primary"
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-foreground/40 hover:text-primary transition-colors cursor-pointer"
              aria-label="Toggle password visibility"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.password && (
            <p className="text-xs text-red-600 font-medium mt-1 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              {errors.password}
            </p>
          )}
        </div>

        {/* Remember Me */}
        <div className="flex items-center justify-between pt-1">
          <label className="flex items-center gap-2.5 cursor-pointer text-xs text-foreground/80 font-medium select-none">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 rounded border-primary/30 text-primary focus:ring-primary/20 accent-primary cursor-pointer"
            />
            Remember Me
          </label>
        </div>

        {/* Login Button */}
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
              Logging in...
            </>
          ) : (
            "Login"
          )}
        </motion.button>
      </form>

      {/* Switch to Register */}
      <p className="text-center text-xs text-foreground/70 pt-6">
        Don&apos;t have an account?{" "}
        <Link
          href="/register"
          className="font-bold text-accent hover:text-primary transition-colors hover:underline"
        >
          Register
        </Link>
      </p>

      {/* Toast Notification Banner */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute -bottom-16 left-0 right-0 p-3.5 bg-emerald-700 text-white text-xs font-semibold rounded-2xl shadow-xl flex items-center justify-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-300" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F8F1EA]">
      <Navbar />

      <main className="flex-grow pt-24 pb-16 flex items-center justify-center relative overflow-hidden px-4 sm:px-6 lg:px-8">
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-accent/10 rounded-full filter blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 -right-32 w-96 h-96 bg-primary/10 rounded-full filter blur-3xl pointer-events-none" />

        <Suspense fallback={<div className="p-8 text-center text-xs text-primary font-bold">Loading Login...</div>}>
          <LoginFormContent />
        </Suspense>
      </main>

      <Footer />
    </div>
  );
}
