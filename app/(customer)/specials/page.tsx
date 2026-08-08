"use client";

import Navbar from "@/components/customer/navbar/Navbar";
import Footer from "@/components/customer/footer/Footer";
import Hero from "@/components/customer/specials/Hero";
import TodaysSpecial from "@/components/customer/specials/TodaysSpecial";
import ComboDeals from "@/components/customer/specials/ComboDeals";
import CustomerFavorites from "@/components/customer/specials/CustomerFavorites";
import CTA from "@/components/customer/specials/CTA";
import TermsAccordion from "@/components/customer/specials/TermsAccordion";

export default function SpecialsPage() {
  return (
    <>
      <Navbar />

      <main className="w-full flex-grow bg-background">
        {/* Hero Section */}
        <Hero />

        {/* Highlighted Today's Special Dish */}
        <TodaysSpecial />

        {/* Value Combo Packages */}
        <ComboDeals />

        {/* Top-rated Customer Favorites */}
        <CustomerFavorites />

        {/* CTA Section */}
        <CTA />

        {/* Offer Terms & Conditions Accordion */}
        <TermsAccordion />
      </main>

      <Footer />
    </>
  );
}
