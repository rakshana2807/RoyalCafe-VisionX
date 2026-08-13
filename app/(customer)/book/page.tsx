"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/customer/navbar/Navbar";
import Footer from "@/components/customer/footer/Footer";
import Hero from "@/components/customer/booking/Hero";
import WorkspaceSelector from "@/components/customer/booking/WorkspaceSelector";
import { isAuthenticated } from "@/lib/auth";

export default function BookPage() {
  const router = useRouter();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    if (!isAuthenticated()) {
      const msg = encodeURIComponent("Please login to your RoyalCafeConnect account to book a workspace.");
      router.replace(`/login?redirect=/book&message=${msg}`);
    } else {
      setIsCheckingAuth(false);
    }
  }, [router]);

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex flex-col bg-[#FAF4ED]">
        <Navbar />
        <main className="grow flex items-center justify-center p-8">
          <div className="text-center space-y-3">
            <div className="w-10 h-10 border-4 border-[#8C4A21] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs font-bold text-[#3D2314]">Verifying authentication state...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <>
      <Navbar />

      <main className="w-full grow bg-background">
        {/* Title Header */}
        <Hero />

        {/* Main 3-Column Booking Interface (Matching Figma Design) */}
        <WorkspaceSelector />
      </main>

      <Footer />
    </>
  );
}
