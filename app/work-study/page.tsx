"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Hero from "@/components/work-study/Hero";
import MembershipPlans from "@/components/work-study/MembershipPlans";
import FAQ from "@/components/work-study/FAQ";

export default function WorkStudyPage() {
  return (
    <>
      <Navbar />

      <main className="w-full flex-grow bg-background">
        {/* Hero Section & Work Suitability Score Grid */}
        <Hero />

        {/* Workspace Plans & Passes Section */}
        <MembershipPlans />

        {/* Frequently Asked Questions Accordions */}
        <FAQ />
      </main>

      <Footer />
    </>
  );
}
