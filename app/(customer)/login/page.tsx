"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Coffee, Mail, KeyRound, CheckCircle2, AlertCircle, Loader2, User, ShieldCheck } from "lucide-react";
import Navbar from "@/components/customer/navbar/Navbar";
import Footer from "@/components/customer/footer/Footer";
import { ADMIN_SECRET_PIN } from "@/lib/constants";

import { supabase } from "@/lib/supabase";

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTarget = searchParams.get("redirect") || "/";
  const customNoticeMessage = searchParams.get("message");

  const [activeMode, setActiveMode] = useState<"user" | "admin">("user");

  // User form states
  const [userEmail, setUserEmail] = useState("");

  // Admin form states
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPin, setAdminPin] = useState("");

  // Shared state
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const validateEmail = (val: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);

  const handleUserLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!userEmail.trim()) {
      newErrors.userEmail = "Email address is required";
    } else if (!validateEmail(userEmail)) {
      newErrors.userEmail = "Please enter a valid email address";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      const emailVal = userEmail.trim();

      const userObj = {
        id: `usr-${Date.now()}`,
        name: emailVal.split("@")[0] || "User",
        email: emailVal,
        role: "user",
      };

      // Store requested objects and role keys in localStorage
      localStorage.setItem("role", "user");
      localStorage.setItem("email", emailVal);
      localStorage.setItem("user", JSON.stringify(userObj));
      localStorage.setItem("royalcafe_user", JSON.stringify(userObj));
      window.dispatchEvent(new Event("auth-state-change"));

      setToastMessage("User login successful! Redirecting...");
      setTimeout(() => {
        router.push(redirectTarget);
      }, 900);
    } catch {
      setErrors({ form: "An error occurred during login. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!adminEmail.trim()) {
      newErrors.adminEmail = "Admin email address is required";
    } else if (!validateEmail(adminEmail)) {
      newErrors.adminEmail = "Please enter a valid email address";
    }

    if (!adminPin.trim()) {
      newErrors.adminPin = "Invalid Secret PIN";
    } else if (adminPin.trim() !== ADMIN_SECRET_PIN) {
      newErrors.adminPin = "Invalid Secret PIN";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      const adminObj = {
        role: "admin",
        email: adminEmail.trim(),
      };

      // Store requested objects and admin keys in localStorage
      localStorage.setItem("role", "admin");
      localStorage.setItem("email", adminEmail.trim());
      localStorage.setItem("adminEmail", adminEmail.trim());
      localStorage.setItem("user", JSON.stringify(adminObj));
      localStorage.setItem(
        "royalcafe_user",
        JSON.stringify({
          id: `admin-${Date.now()}`,
          name: "Administrator",
          email: adminEmail.trim(),
          role: "admin",
        })
      );
      window.dispatchEvent(new Event("auth-state-change"));

      setToastMessage("Admin PIN verified! Redirecting to Admin Dashboard...");
      setTimeout(() => {
        router.push("/admin/dashboard");
      }, 900);
    } catch {
      setErrors({ form: "An error occurred during admin login. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-white/90 backdrop-blur-xl rounded-3xl border border-primary/10 shadow-2xl p-8 sm:p-10 relative z-10">
      {/* Notice Banner when redirecting from booking */}
      {(customNoticeMessage || redirectTarget === "/book") && (
        <div className="mb-6 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-950 text-xs font-semibold flex items-start gap-2.5 shadow-xs">
          <AlertCircle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-amber-950">
              {customNoticeMessage || "Please login to your RoyalCafeConnect account to book a workspace."}
            </p>
            <p className="text-[11px] text-amber-800/90 mt-0.5">
              Login is required to make and manage workspace reservations.
            </p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="text-center mb-6">
        <div className="w-14 h-14 rounded-2xl bg-[#F8F1EA] border border-primary/15 flex items-center justify-center mx-auto mb-4 shadow-sm">
          <Coffee className="w-7 h-7 text-primary" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold font-serif text-primary">RoyalCafe Connect</h1>
        <p className="text-xs text-foreground/70 mt-1">Select your portal to sign in to your workspace account.</p>
      </div>

      {/* Mode Switcher Tabs */}
      <div className="bg-[#F8F1EA] p-1.5 rounded-2xl border border-primary/10 flex items-center relative mb-6 shadow-inner">
        <button
          type="button"
          onClick={() => {
            setActiveMode("user");
            setErrors({});
          }}
          className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all duration-300 relative z-10 cursor-pointer flex items-center justify-center gap-2 ${activeMode === "user" ? "text-white" : "text-foreground/70 hover:text-primary"
            }`}
        >
          <User className="w-3.5 h-3.5" />
          User Login
        </button>
        <button
          type="button"
          onClick={() => {
            setActiveMode("admin");
            setErrors({});
          }}
          className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all duration-300 relative z-10 cursor-pointer flex items-center justify-center gap-2 ${activeMode === "admin" ? "text-white" : "text-foreground/70 hover:text-primary"
            }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          Admin Login
        </button>

        <motion.div
          className="absolute top-1.5 bottom-1.5 rounded-xl bg-gradient-to-r from-primary to-[#422007] shadow-md z-0"
          initial={false}
          animate={{
            left: activeMode === "user" ? "6px" : "calc(50% + 3px)",
            width: "calc(50% - 9px)",
          }}
          transition={{ type: "spring", stiffness: 400, damping: 35 }}
        />
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

      {/* Tab Panels */}
      <AnimatePresence mode="wait">
        {activeMode === "user" ? (
          /* OPTION 1: USER LOGIN */
          <motion.form
            key="user-login-form"
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 15 }}
            transition={{ duration: 0.2 }}
            onSubmit={handleUserLogin}
            className="space-y-5 text-left"
          >
            <div className="p-3.5 rounded-2xl bg-primary/5 border border-primary/10 text-xs text-foreground/80">
              <span className="font-bold text-primary block mb-0.5">User Workspace Portal</span>
              Enter your email address to log in. No password required.
            </div>

            {/* Email Address */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-foreground/80">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40" />
                <input
                  type="email"
                  placeholder="user@email.com"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  className={`w-full pl-11 pr-4 py-3 rounded-2xl bg-[#F8F1EA]/60 border text-sm text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all ${errors.userEmail ? "border-red-500 bg-red-50/30" : "border-primary/15 focus:border-primary"
                    }`}
                />
              </div>
              {errors.userEmail && (
                <p className="text-xs text-red-600 font-medium mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  {errors.userEmail}
                </p>
              )}
            </div>

            {/* Login as User Button */}
            <motion.button
              whileHover={{ scale: 1.015 }}
              whileTap={{ scale: 0.985 }}
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 px-6 rounded-full text-white font-semibold text-sm bg-gradient-to-r from-[#5A2E0C] via-[#6F3A0E] to-[#3D1E07] hover:from-[#472309] hover:to-[#2B1404] shadow-lg shadow-primary/20 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 mt-4"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Logging in as User...
                </>
              ) : (
                "Login as User"
              )}
            </motion.button>
          </motion.form>
        ) : (
          /* OPTION 2: ADMIN LOGIN */
          <motion.form
            key="admin-login-form"
            initial={{ opacity: 0, x: 15 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -15 }}
            transition={{ duration: 0.2 }}
            onSubmit={handleAdminLogin}
            className="space-y-5 text-left"
          >
            <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-foreground/80">
              <span className="font-bold text-[#8C4A21] block mb-0.5">Admin Security Portal</span>
              Requires authorized admin email and secret PIN.
            </div>

            {/* Admin Email */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-foreground/80">
                Admin Email
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40" />
                <input
                  type="email"
                  placeholder="admin@email.com"
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  className={`w-full pl-11 pr-4 py-3 rounded-2xl bg-[#F8F1EA]/60 border text-sm text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all ${errors.adminEmail ? "border-red-500 bg-red-50/30" : "border-primary/15 focus:border-primary"
                    }`}
                />
              </div>
              {errors.adminEmail && (
                <p className="text-xs text-red-600 font-medium mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  {errors.adminEmail}
                </p>
              )}
            </div>

            {/* Secret PIN */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-foreground/80">
                Secret PIN
              </label>
              <div className="relative">
                <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40" />
                <input
                  type="password"
                  placeholder="Enter Secret PIN(845291)"
                  value={adminPin}
                  onChange={(e) => setAdminPin(e.target.value)}
                  className={`w-full pl-11 pr-4 py-3 rounded-2xl bg-[#F8F1EA]/60 border text-sm text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all ${errors.adminPin ? "border-red-500 bg-red-50/30" : "border-primary/15 focus:border-primary"
                    }`}
                />
              </div>
              {errors.adminPin && (
                <p className="text-xs text-red-600 font-medium mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  {errors.adminPin}
                </p>
              )}
            </div>

            {/* Login as Admin Button */}
            <motion.button
              whileHover={{ scale: 1.015 }}
              whileTap={{ scale: 0.985 }}
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 px-6 rounded-full text-white font-semibold text-sm bg-gradient-to-r from-[#5A2E0C] via-[#6F3A0E] to-[#3D1E07] hover:from-[#472309] hover:to-[#2B1404] shadow-lg shadow-primary/20 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 mt-4"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Authenticating Admin...
                </>
              ) : (
                "Login as Admin"
              )}
            </motion.button>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Bottom link to Register */}
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
