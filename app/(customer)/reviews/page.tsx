"use client";

import Navbar from "@/components/customer/navbar/Navbar";
import Footer from "@/components/customer/footer/Footer";
import Hero from "@/components/customer/reviews/Hero";
import ReviewSummary from "@/components/customer/reviews/ReviewSummary";
import FeaturedTestimonials from "@/components/customer/reviews/FeaturedTestimonials";
import ReviewGrid from "@/components/customer/reviews/ReviewGrid";
import ReviewForm from "@/components/customer/reviews/ReviewForm";
import FAQ from "@/components/customer/reviews/FAQ";
import CTA from "@/components/customer/reviews/CTA";

export default function ReviewsPage() {
  return (
    <>
      {/* Floating Global Navbar */}
      <Navbar />

      <main className="w-full flex-grow bg-background">
        
        {/* Title Header with Overall Rating Badge */}
        <Hero />

        {/* Breakdown of Ratings & Category Averages */}
        <ReviewSummary />

        {/* Handpicked Featured Testimonials Carousel */}
        <FeaturedTestimonials />

        {/* Filterable Reviews Grid (Search + Category Filter) */}
        <ReviewGrid />

        {/* Interactive Submit Your Review Form */}
        <ReviewForm />

        {/* Review System FAQ */}
        <FAQ />

        {/* Page CTA */}
        <CTA />

      </main>

      {/* Global Footer */}
      <Footer />
    </>
  );
}
