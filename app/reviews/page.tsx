"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Hero from "@/components/reviews/Hero";
import ReviewSummary from "@/components/reviews/ReviewSummary";
import FeaturedTestimonials from "@/components/reviews/FeaturedTestimonials";
import ReviewGrid from "@/components/reviews/ReviewGrid";
import ReviewForm from "@/components/reviews/ReviewForm";
import FAQ from "@/components/reviews/FAQ";
import CTA from "@/components/reviews/CTA";

export default function ReviewsPage() {
  return (
    <>
      {/* Floating Global Navbar */}
      <Navbar />

      <main className="w-full flex-grow bg-background">
        
        {/* Community Voices Hero Header */}
        <Hero />

        {/* Overall Rating dashboard card and progress bars */}
        <ReviewSummary />

        {/* Featured customer stories (matching Figma screenshot cards) */}
        <FeaturedTestimonials />

        {/* Interactive customer reviews grid with search and filters */}
        <ReviewGrid />

        {/* Write a Review interactive form */}
        <ReviewForm />

        {/* FAQ Accordion */}
        <FAQ />

        {/* Final CTA banner */}
        <CTA />

      </main>

      {/* Global Footer */}
      <Footer />
    </>
  );
}
