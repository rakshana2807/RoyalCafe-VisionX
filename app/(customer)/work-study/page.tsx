"use client";

import Navbar from "@/components/customer/navbar/Navbar";
import Hero from "@/components/customer/workspace/Hero";
import MembershipPlans from "@/components/customer/workspace/MembershipPlans";
import FAQ from "@/components/customer/workspace/FAQ";

export default function WorkStudyPage() {
  return (
    <>
      <Navbar />

      <main className="w-full flex-grow bg-background">
        {/* Premium Typography Hero */}
        <Hero />

        {/* Premium Membership Passes */}
        <MembershipPlans />

        {/* Premium FAQ */}
        <FAQ />
      </main>

    </>
  );
}
