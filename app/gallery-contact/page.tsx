"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Hero from "@/components/gallery-contact/Hero";
import GalleryGrid from "@/components/gallery-contact/GalleryGrid";
import VirtualTour from "@/components/gallery-contact/VirtualTour";
import Features from "@/components/gallery-contact/Features";
import LocationMap from "@/components/gallery-contact/LocationMap";
import VisitInfo from "@/components/gallery-contact/VisitInfo";
import ContactForm from "@/components/gallery-contact/ContactForm";
import FAQ from "@/components/gallery-contact/FAQ";
import SocialLinks from "@/components/gallery-contact/SocialLinks";
import CTA from "@/components/gallery-contact/CTA";

export default function GalleryContactPage() {
  return (
    <>
      {/* Floating Global Navbar */}
      <Navbar />

      <main className="w-full flex-grow bg-background">
        
        {/* Hero Section */}
        <Hero />

        {/* Photo Gallery Grid ("Our Space") with filter pills and Lightbox modal */}
        <GalleryGrid />

        {/* 360° Virtual Tour preview */}
        <VirtualTour />

        {/* Why People Love RoyalCafe Connect */}
        <Features />

        {/* Location & Map mockup (matching Figma screenshot) */}
        <LocationMap />

        {/* Opening Hours & Cafe Details cards */}
        <VisitInfo />

        {/* Contact Form with validation */}
        <ContactForm />

        {/* Accordion FAQ list */}
        <FAQ />

        {/* Social Media links */}
        <SocialLinks />

        {/* Final CTA banner */}
        <CTA />

      </main>

      {/* Global Footer */}
      <Footer />
    </>
  );
}
