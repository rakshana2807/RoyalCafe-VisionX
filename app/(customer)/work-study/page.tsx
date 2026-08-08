"use client";

import Navbar from "@/components/customer/navbar/Navbar";
import Footer from "@/components/customer/footer/Footer";
import Hero from "@/components/customer/workspace/Hero";
import MembershipPlans from "@/components/customer/workspace/MembershipPlans";
import FAQ from "@/components/customer/workspace/FAQ";

export default function WorkStudyPage() {
  return (
    <>
      <Navbar />

      <main className="w-full flex-grow bg-background">
        {/* Hero Section & Work Suitability Score Grid */}
        <Hero />

        {/* Workspace Plans & Passes Section */}
        <MembershipPlans />

        {/* Workspace FAQ */}
        <FAQ />
      </main>

      <Footer />
    </>
  );
}
