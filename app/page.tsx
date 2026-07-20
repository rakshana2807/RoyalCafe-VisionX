"use client";

import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import OfferCard from "@/components/OfferCard";
import UserCategory from "@/components/UserCategory";
import WorkflowSteps from "@/components/WorkflowSteps";
import Amenities from "@/components/Amenities";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";

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

        {/* Curated For You Product/Offer Grid */}
        <div className="w-full animate-fade-in delay-200">
          <OfferCard />
        </div>

        {/* Workflow Segmentation Section */}
        <div className="w-full animate-fade-in delay-300">
          <UserCategory />
        </div>

        {/* Timeline Process Steps Section */}
        <div className="w-full animate-fade-in delay-300">
          <WorkflowSteps />
        </div>

        {/* World-Class Amenities Section */}
        <div className="w-full animate-fade-in delay-400">
          <Amenities />
        </div>

        {/* Banner CTA Section */}
        <div className="w-full animate-fade-in delay-500">
          <CTASection />
        </div>
      </main>

      {/* 4-Column Footer */}
      <Footer />
    </>
  );
}
