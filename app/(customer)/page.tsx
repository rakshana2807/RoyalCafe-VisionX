"use client";

import Navbar from "@/components/customer/navbar/Navbar";
import Hero from "@/components/customer/landing/Hero";
import OfferCard from "@/components/customer/landing/OfferCard";
import UserCategory from "@/components/customer/landing/UserCategory";
import WorkflowSteps from "@/components/customer/landing/WorkflowSteps";
import Amenities from "@/components/customer/landing/Amenities";
import CTASection from "@/components/customer/landing/CTASection";
import Footer from "@/components/customer/footer/Footer";

export default function Home() {
  return (
    <>
      {/* Floating Responsive Navbar */}
      <Navbar />

      <main className="w-full flex-grow">
        {/* Hero Banner Section */}
        <div className="w-full">
          <Hero />
        </div>

        {/* Special Discount Banner */}
        <OfferCard />

        {/* Dynamic Category Tabs */}
        <UserCategory />

        {/* Step-by-Step Experience Section */}
        <WorkflowSteps />

        {/* Amenity Badges Grid */}
        <Amenities />

        {/* Prominent CTA Footer Banner */}
        <CTASection />
      </main>

      {/* Global Footer */}
      <Footer />
    </>
  );
}
