"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Hero from "@/components/specials/Hero";
import TodaysSpecial from "@/components/specials/TodaysSpecial";
import ComboDeals from "@/components/specials/ComboDeals";
import CustomerFavorites from "@/components/specials/CustomerFavorites";
import CTA from "@/components/specials/CTA";
import TermsAccordion from "@/components/specials/TermsAccordion";

export default function SpecialsPage() {
  return (
    <>
      <Navbar />

      <main className="w-full flex-grow bg-background">
        {/* Hero Section */}
        <Hero />

        {/* Today's Specials & Off-Peak Happy Hour Banner */}
        <TodaysSpecial />

        {/* Best Combo Deals Grid */}
        <ComboDeals />

        {/* Customer Favorites Grid */}
        <CustomerFavorites />

        {/* Don't Miss Today's Exclusive Deals CTA Banner */}
        <CTA />

        {/* Terms & Conditions Accordion */}
        <TermsAccordion />
      </main>

      <Footer />
    </>
  );
}
