"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Coffee,
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  Phone,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Sparkles,
  Wifi,
  Armchair,
} from "lucide-react";
import Navbar from "@/components/customer/navbar/Navbar";

export default function AuthPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"signin" | "signup">("signin");

  // Form states
  const [signInData, setSignInData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const [signUpData, setSignUpData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    agreeTerms: false,
  });

  // Password visibility
  const [showSignInPassword, setShowSignInPassword] = useState(false);
  const [showSignUpPassword, setShowSignUpPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Errors & Loading state
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Password strength calculation
  const calculatePasswordStrength = (pass: string) => {
    let score = 0;
    if (!pass) return { score: 0, label: "", color: "bg-gray-200" };
    if (pass.length >= 8) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;

    switch (score) {
      case 1:
        return { score: 1, label: "Weak", color: "bg-red-500", text: "text-red-600" };
      case 2:
        return { score: 2, label: "Fair", color: "bg-amber-500", text: "text-amber-600" };
      case 3:
        return { score: 3, label: "Good", color: "bg-yellow-500", text: "text-yellow-600" };
      case 4:
        return { score: 4, label: "Strong", color: "bg-emerald-500", text: "text-emerald-600" };
      default:
        return { score: 0, label: "Very Weak", color: "bg-red-300", text: "text-red-400" };
    }
  };

  const passwordStrength = calculatePasswordStrength(signUpData.password);

  // Validation functions
  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validatePhone = (phone: string) => {
    const re = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
    return re.test(phone);
  };

  const validateSignIn = () => {
    const newErrors: Record<string, string> = {};
    if (!signInData.email.trim()) {
      newErrors.signInEmail = "Email address is required";
    } else if (!validateEmail(signInData.email)) {
      newErrors.signInEmail = "Please enter a valid email address";
    }

    if (!signInData.password) {
      newErrors.signInPassword = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateSignUp = () => {
    const newErrors: Record<string, string> = {};
    if (!signUpData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    } else if (signUpData.fullName.trim().length < 2) {
      newErrors.fullName = "Name must be at least 2 characters";
    }

    if (!signUpData.email.trim()) {
      newErrors.email = "Email address is required";
    } else if (!validateEmail(signUpData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!signUpData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!validatePhone(signUpData.phone.trim())) {
      newErrors.phone = "Please enter a valid phone number (e.g. +1 234 567 8900)";
    }

    if (!signUpData.password) {
      newErrors.password = "Password is required";
    } else if (signUpData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (!signUpData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (signUpData.password !== signUpData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (!signUpData.agreeTerms) {
      newErrors.agreeTerms = "You must agree to the Terms & Privacy Policy";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit Handlers connected to backend API
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateSignIn()) return;

    setIsSubmitting(true);
    setErrors({});
    try {
      const userRole = signInData.email.toLowerCase().includes("admin") ? "admin" : "customer";
      const userName = signInData.email.split("@")[0].replace(/[._]/g, " ") || "Cafe Guest";
      const formattedName = userName.charAt(0).toUpperCase() + userName.slice(1);

      const userObj = {
        id: `usr-${Date.now()}`,
        name: formattedName,
        email: signInData.email,
        role: userRole,
      };

      localStorage.setItem("user", JSON.stringify(userObj));
      localStorage.setItem("royalcafe_user", JSON.stringify(userObj));
      window.dispatchEvent(new Event("auth-state-change"));

      setToastMessage("Welcome back to RoyalCafe Connect!");
      setTimeout(() => {
        router.push("/");
      }, 1200);
    } catch {
      setErrors({ form: "Error signing in. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateSignUp()) return;

    setIsSubmitting(true);
    setErrors({});
    try {
      const userObj = {
        id: `usr-${Date.now()}`,
        name: signUpData.fullName,
        email: signUpData.email,
        phone: signUpData.phone,
        role: "customer",
      };

      localStorage.setItem("user", JSON.stringify(userObj));
      localStorage.setItem("royalcafe_user", JSON.stringify(userObj));
      window.dispatchEvent(new Event("auth-state-change"));

      setToastMessage("Account created successfully.");
      setTimeout(() => {
        router.push("/");
      }, 1200);
    } catch {
      setErrors({ form: "Error during registration. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F1EA]">
      {/* Toast Notification Banner */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-6 py-3.5 bg-primary text-white rounded-full shadow-2xl border border-accent/40 backdrop-blur-md"
          >
            <CheckCircle2 className="w-5 h-5 text-accent animate-pulse" />
            <span className="text-sm font-semibold tracking-wide">{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Navigation */}
      <Navbar />

      <main className="flex-grow pt-20 lg:pt-24 flex items-center justify-center relative overflow-hidden px-4 sm:px-6 lg:px-8 py-8">
        {/* Subtle Background Glows */}
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-accent/10 rounded-full filter blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 -right-32 w-96 h-96 bg-primary/10 rounded-full filter blur-3xl pointer-events-none" />

        <div className="w-full max-w-6xl bg-white/60 backdrop-blur-xl rounded-3xl border border-primary/10 shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[640px]">
          {/* ================= LEFT SIDE (Desktop/Laptop/Tablet Illustration & Welcome) ================= */}
          <div className="hidden lg:flex lg:col-span-6 relative bg-gradient-to-br from-[#2B2118] via-[#42220C] to-[#1E140C] text-white p-12 flex-col justify-between overflow-hidden">
            {/* Background Image overlay with darkening gradient */}
            <div className="absolute inset-0 z-0 opacity-40 mix-blend-overlay">
              <Image
                src="/auth-bg.png"
                alt="RoyalCafe Atmosphere"
                fill
                priority
                className="object-cover"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#1E140C] via-transparent to-[#2B2118]/80 z-0" />

            {/* Top Brand & Logo */}
            <div className="relative z-10">
              <Link href="/" className="flex items-center gap-3 group inline-flex">
                <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                  <Coffee className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <span className="text-2xl font-bold font-serif tracking-tight text-white block">
                    RoyalCafe<span className="text-accent">Connect</span>
                  </span>
                  <span className="text-[11px] uppercase tracking-widest text-white/60 font-medium">
                    Premium Workspace &amp; Cafe
                  </span>
                </div>
              </Link>
            </div>

            {/* Middle Welcome Content & Tagline */}
            <div className="relative z-10 space-y-6 my-auto py-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-accent/20 border border-accent/30 text-accent text-xs font-semibold uppercase tracking-wider mb-4">
                  <Sparkles className="w-3.5 h-3.5" />
                  Your Ultimate Productivity Sanctuary
                </div>
                <h1 className="text-3xl lg:text-4xl font-extrabold font-serif leading-tight text-white">
                  Welcome back to your <span className="text-accent font-italic">favourite café.</span>
                </h1>
                <p className="mt-4 text-base text-white/80 leading-relaxed font-light">
                  Book your favourite workspace, reserve café seating, discover today&apos;s specials, and enjoy a seamless RoyalCafe Connect experience.
                </p>
              </motion.div>

              {/* Feature Badges */}
              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                  <Wifi className="w-5 h-5 text-accent shrink-0" />
                  <div>
                    <div className="text-xs font-semibold text-white">1000 Mbps WiFi</div>
                    <div className="text-[10px] text-white/60">Ultra-fast fiber network</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                  <Armchair className="w-5 h-5 text-accent shrink-0" />
                  <div>
                    <div className="text-xs font-semibold text-white">Reserved Seating</div>
                    <div className="text-[10px] text-white/60">Guaranteed desk space</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Footer Quote */}
            <div className="relative z-10 border-t border-white/10 pt-6 flex items-center justify-between text-xs text-white/60">
              <span>Crafted for creators &amp; remote teams</span>
              <span className="text-accent font-semibold">#RoyalCafeConnect</span>
            </div>
          </div>

          {/* ================= RIGHT SIDE (AUTHENTICATION CARD) ================= */}
          <div className="col-span-1 lg:col-span-6 p-6 sm:p-10 lg:p-12 flex flex-col justify-center bg-white/90 backdrop-blur-md">
            {/* Mobile Header Logo (Visible only on mobile) */}
            <div className="lg:hidden flex items-center justify-center gap-2 mb-6 text-center">
              <Coffee className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold font-serif text-primary">
                RoyalCafe<span className="text-accent">Connect</span>
              </span>
            </div>

            {/* Auth Mode Toggle Switch */}
            <div className="bg-[#F8F1EA] p-1.5 rounded-full border border-primary/10 flex items-center relative mb-8 shadow-inner">
              <button
                type="button"
                onClick={() => {
                  setActiveTab("signin");
                  setErrors({});
                }}
                className={`flex-1 py-3 text-sm font-semibold rounded-full transition-all duration-300 relative z-10 cursor-pointer text-center ${
                  activeTab === "signin" ? "text-white" : "text-foreground/70 hover:text-primary"
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveTab("signup");
                  setErrors({});
                }}
                className={`flex-1 py-3 text-sm font-semibold rounded-full transition-all duration-300 relative z-10 cursor-pointer text-center ${
                  activeTab === "signup" ? "text-white" : "text-foreground/70 hover:text-primary"
                }`}
              >
                Create Account
              </button>

              {/* Animated Tab Indicator Pill */}
              <motion.div
                className="absolute top-1.5 bottom-1.5 rounded-full bg-gradient-to-r from-primary to-[#422007] shadow-md z-0"
                initial={false}
                animate={{
                  left: activeTab === "signin" ? "6px" : "calc(50% + 3px)",
                  width: "calc(50% - 9px)",
                }}
                transition={{ type: "spring", stiffness: 400, damping: 35 }}
              />
            </div>

            {/* General Form Error Banner */}
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

            {/* Animate Tab Content Switch */}
            <AnimatePresence mode="wait">
              {activeTab === "signin" ? (
                /* ================= SIGN IN FORM ================= */
                <motion.form
                  key="signin-form"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  onSubmit={handleLogin}
                  className="space-y-5"
                >
                  <div className="space-y-1">
                    <h2 className="text-2xl font-bold font-serif text-primary">Sign in to your account</h2>
                    <p className="text-xs text-foreground/60">Enter your credentials to access your bookings and rewards.</p>
                  </div>

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
                        value={signInData.email}
                        onChange={(e) => setSignInData({ ...signInData, email: e.target.value })}
                        className={`w-full pl-11 pr-4 py-3 rounded-2xl bg-[#F8F1EA]/60 border text-sm text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all ${
                          errors.signInEmail ? "border-red-500 bg-red-50/30" : "border-primary/15 focus:border-primary"
                        }`}
                      />
                    </div>
                    {errors.signInEmail && (
                      <p className="text-xs text-red-600 font-medium mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        {errors.signInEmail}
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
                        type={showSignInPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={signInData.password}
                        onChange={(e) => setSignInData({ ...signInData, password: e.target.value })}
                        className={`w-full pl-11 pr-11 py-3 rounded-2xl bg-[#F8F1EA]/60 border text-sm text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all ${
                          errors.signInPassword ? "border-red-500 bg-red-50/30" : "border-primary/15 focus:border-primary"
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowSignInPassword(!showSignInPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-foreground/40 hover:text-primary transition-colors cursor-pointer"
                        aria-label="Toggle password visibility"
                      >
                        {showSignInPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {errors.signInPassword && (
                      <p className="text-xs text-red-600 font-medium mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        {errors.signInPassword}
                      </p>
                    )}
                  </div>

                  {/* Remember Me Checkbox */}
                  <div className="flex items-center justify-between pt-1">
                    <label className="flex items-center gap-2.5 cursor-pointer text-xs text-foreground/80 font-medium select-none">
                      <input
                        type="checkbox"
                        checked={signInData.rememberMe}
                        onChange={(e) => setSignInData({ ...signInData, rememberMe: e.target.checked })}
                        className="w-4 h-4 rounded border-primary/30 text-primary focus:ring-primary/20 accent-primary cursor-pointer"
                      />
                      Remember Me
                    </label>
                  </div>

                  {/* Primary Submit Button */}
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
                        Signing in...
                      </>
                    ) : (
                      "Sign In"
                    )}
                  </motion.button>

                  {/* Divider */}
                  <div className="relative py-2 flex items-center justify-center">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-primary/10" />
                    </div>
                    <span className="relative px-4 bg-white text-xs uppercase tracking-widest text-foreground/50 font-medium">
                      Or continue with
                    </span>
                  </div>

                  {/* OAuth Buttons */}
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setToastMessage("Google Sign In initialized...");
                        setTimeout(() => setToastMessage(null), 2000);
                      }}
                      className="py-2.5 px-4 rounded-full border border-primary/20 bg-white hover:bg-[#F8F1EA] text-xs font-semibold text-foreground/80 hover:text-primary transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24">
                        <path
                          fill="#4285F4"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                          fill="#34A853"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                          fill="#FBBC05"
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                        />
                        <path
                          fill="#EA4335"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                        />
                      </svg>
                      Google
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setToastMessage("Apple Sign In initialized...");
                        setTimeout(() => setToastMessage(null), 2000);
                      }}
                      className="py-2.5 px-4 rounded-full border border-primary/20 bg-white hover:bg-[#F8F1EA] text-xs font-semibold text-foreground/80 hover:text-primary transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                    >
                      <svg className="w-4 h-4 fill-current text-foreground" viewBox="0 0 170 170">
                        <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.82.13-9.67-1.92-14.55-6.14-3.35-2.88-7.24-7.6-11.66-14.16-7.85-11.75-13.88-24.81-18.09-39.18-4.21-14.37-6.32-28.09-6.32-41.16 0-16.14 3.97-29.6 11.9-40.38 7.93-10.78 17.84-16.27 29.74-16.47 4.74 0 9.97 1.14 15.69 3.42 5.72 2.28 9.77 3.42 12.16 3.42 2.05 0 6.23-1.22 12.54-3.66 6.31-2.44 11.73-3.56 16.27-3.35 13.08.74 23.64 5.37 31.69 13.89-11.5 6.94-17.11 16.79-16.82 29.54.27 9.87 4.18 18.23 11.73 25.07 7.55 6.84 16.4 10.7 26.54 11.58-2.6 7.64-6.07 15.34-10.41 23.1zm-28.61-105.7c0 7.42-2.73 14.45-8.19 21.09-5.46 6.64-12.24 10.66-20.34 12.06-.27-.82-.41-1.78-.41-2.88 0-7.29 2.85-14.46 8.55-21.51 5.7-7.05 12.63-11.08 20.79-12.09.14 1.1.2 2.21.2 3.33z" />
                      </svg>
                      Apple
                    </button>
                  </div>

                  {/* Tab Switch Link */}
                  <p className="text-center text-xs text-foreground/70 pt-2">
                    Don&apos;t have an account?{" "}
                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab("signup");
                        setErrors({});
                      }}
                      className="font-bold text-accent hover:text-primary transition-colors cursor-pointer hover:underline"
                    >
                      Create Account
                    </button>
                  </p>
                </motion.form>
              ) : (
                /* ================= CREATE ACCOUNT FORM ================= */
                <motion.form
                  key="signup-form"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  onSubmit={handleSignup}
                  className="space-y-4"
                >
                  <div className="space-y-1">
                    <h2 className="text-2xl font-bold font-serif text-primary">Create your Account</h2>
                    <p className="text-xs text-foreground/60">Join RoyalCafe Connect for exclusive perks and effortless bookings.</p>
                  </div>

                  {/* Full Name */}
                  <div className="space-y-1">
                    <label className="block text-xs font-bold uppercase tracking-wider text-foreground/80">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40" />
                      <input
                        type="text"
                        placeholder="Alex Morgan"
                        value={signUpData.fullName}
                        onChange={(e) => setSignUpData({ ...signUpData, fullName: e.target.value })}
                        className={`w-full pl-11 pr-4 py-2.5 rounded-2xl bg-[#F8F1EA]/60 border text-sm text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all ${
                          errors.fullName ? "border-red-500 bg-red-50/30" : "border-primary/15 focus:border-primary"
                        }`}
                      />
                    </div>
                    {errors.fullName && (
                      <p className="text-xs text-red-600 font-medium flex items-center gap-1">
                        <AlertCircle className="w-3 h-3 shrink-0" />
                        {errors.fullName}
                      </p>
                    )}
                  </div>

                  {/* Email & Phone Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Email */}
                    <div className="space-y-1">
                      <label className="block text-xs font-bold uppercase tracking-wider text-foreground/80">
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40" />
                        <input
                          type="email"
                          placeholder="alex@example.com"
                          value={signUpData.email}
                          onChange={(e) => setSignUpData({ ...signUpData, email: e.target.value })}
                          className={`w-full pl-10 pr-3 py-2.5 rounded-2xl bg-[#F8F1EA]/60 border text-sm text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all ${
                            errors.email ? "border-red-500 bg-red-50/30" : "border-primary/15 focus:border-primary"
                          }`}
                        />
                      </div>
                      {errors.email && (
                        <p className="text-[11px] text-red-600 font-medium flex items-center gap-1">
                          <AlertCircle className="w-3 h-3 shrink-0" />
                          {errors.email}
                        </p>
                      )}
                    </div>

                    {/* Phone */}
                    <div className="space-y-1">
                      <label className="block text-xs font-bold uppercase tracking-wider text-foreground/80">
                        Phone Number
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40" />
                        <input
                          type="tel"
                          placeholder="+1 234 567 8900"
                          value={signUpData.phone}
                          onChange={(e) => setSignUpData({ ...signUpData, phone: e.target.value })}
                          className={`w-full pl-10 pr-3 py-2.5 rounded-2xl bg-[#F8F1EA]/60 border text-sm text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all ${
                            errors.phone ? "border-red-500 bg-red-50/30" : "border-primary/15 focus:border-primary"
                          }`}
                        />
                      </div>
                      {errors.phone && (
                        <p className="text-[11px] text-red-600 font-medium flex items-center gap-1">
                          <AlertCircle className="w-3 h-3 shrink-0" />
                          {errors.phone}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Password Field */}
                  <div className="space-y-1">
                    <label className="block text-xs font-bold uppercase tracking-wider text-foreground/80">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40" />
                      <input
                        type={showSignUpPassword ? "text" : "password"}
                        placeholder="Min. 8 characters"
                        value={signUpData.password}
                        onChange={(e) => setSignUpData({ ...signUpData, password: e.target.value })}
                        className={`w-full pl-11 pr-11 py-2.5 rounded-2xl bg-[#F8F1EA]/60 border text-sm text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all ${
                          errors.password ? "border-red-500 bg-red-50/30" : "border-primary/15 focus:border-primary"
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowSignUpPassword(!showSignUpPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-foreground/40 hover:text-primary transition-colors cursor-pointer"
                        aria-label="Toggle password visibility"
                      >
                        {showSignUpPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="text-[11px] text-red-600 font-medium flex items-center gap-1">
                        <AlertCircle className="w-3 h-3 shrink-0" />
                        {errors.password}
                      </p>
                    )}

                    {/* Password Strength Indicator */}
                    {signUpData.password.length > 0 && (
                      <div className="pt-1.5 space-y-1">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-foreground/60">Password Strength:</span>
                          <span className={`font-semibold ${passwordStrength.text}`}>
                            {passwordStrength.label}
                          </span>
                        </div>
                        <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden flex gap-1 p-0.5">
                          <div
                            className={`h-full rounded-full transition-all duration-300 ${
                              passwordStrength.score >= 1 ? passwordStrength.color : "bg-transparent"
                            }`}
                            style={{ width: "25%" }}
                          />
                          <div
                            className={`h-full rounded-full transition-all duration-300 ${
                              passwordStrength.score >= 2 ? passwordStrength.color : "bg-transparent"
                            }`}
                            style={{ width: "25%" }}
                          />
                          <div
                            className={`h-full rounded-full transition-all duration-300 ${
                              passwordStrength.score >= 3 ? passwordStrength.color : "bg-transparent"
                            }`}
                            style={{ width: "25%" }}
                          />
                          <div
                            className={`h-full rounded-full transition-all duration-300 ${
                              passwordStrength.score >= 4 ? passwordStrength.color : "bg-transparent"
                            }`}
                            style={{ width: "25%" }}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Confirm Password Field */}
                  <div className="space-y-1">
                    <label className="block text-xs font-bold uppercase tracking-wider text-foreground/80">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40" />
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Re-enter password"
                        value={signUpData.confirmPassword}
                        onChange={(e) => setSignUpData({ ...signUpData, confirmPassword: e.target.value })}
                        className={`w-full pl-11 pr-11 py-2.5 rounded-2xl bg-[#F8F1EA]/60 border text-sm text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all ${
                          errors.confirmPassword ? "border-red-500 bg-red-50/30" : "border-primary/15 focus:border-primary"
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-foreground/40 hover:text-primary transition-colors cursor-pointer"
                        aria-label="Toggle confirm password visibility"
                      >
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <p className="text-[11px] text-red-600 font-medium flex items-center gap-1">
                        <AlertCircle className="w-3 h-3 shrink-0" />
                        {errors.confirmPassword}
                      </p>
                    )}
                  </div>

                  {/* Terms & Privacy Policy Checkbox */}
                  <div className="pt-1">
                    <label className="flex items-start gap-2.5 cursor-pointer text-xs text-foreground/80 font-medium select-none">
                      <input
                        type="checkbox"
                        checked={signUpData.agreeTerms}
                        onChange={(e) => setSignUpData({ ...signUpData, agreeTerms: e.target.checked })}
                        className="w-4 h-4 rounded border-primary/30 text-primary focus:ring-primary/20 accent-primary cursor-pointer mt-0.5 shrink-0"
                      />
                      <span>
                        I agree to the{" "}
                        <Link href="/gallery-contact" className="text-accent hover:underline font-semibold">
                          Terms of Service
                        </Link>{" "}
                        &amp;{" "}
                        <Link href="/gallery-contact" className="text-accent hover:underline font-semibold">
                          Privacy Policy
                        </Link>
                      </span>
                    </label>
                    {errors.agreeTerms && (
                      <p className="text-[11px] text-red-600 font-medium mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3 shrink-0" />
                        {errors.agreeTerms}
                      </p>
                    )}
                  </div>

                  {/* Primary Create Account Button */}
                  <motion.button
                    whileHover={{ scale: 1.015 }}
                    whileTap={{ scale: 0.985 }}
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 px-6 rounded-full text-white font-semibold text-sm bg-gradient-to-r from-[#5A2E0C] via-[#6F3A0E] to-[#3D1E07] hover:from-[#472309] hover:to-[#2B1404] shadow-lg shadow-primary/20 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 mt-2"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Creating Account...
                      </>
                    ) : (
                      "Create Account"
                    )}
                  </motion.button>

                  {/* Tab Switch Link */}
                  <p className="text-center text-xs text-foreground/70 pt-2">
                    Already have an account?{" "}
                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab("signin");
                        setErrors({});
                      }}
                      className="font-bold text-accent hover:text-primary transition-colors cursor-pointer hover:underline"
                    >
                      Sign In
                    </button>
                  </p>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  );
}
