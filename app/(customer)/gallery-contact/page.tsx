"use client";

import Navbar from "@/components/customer/navbar/Navbar";
import Footer from "@/components/customer/footer/Footer";
import Hero from "@/components/customer/gallery/Hero";
import GalleryGrid from "@/components/customer/gallery/GalleryGrid";
import VirtualTour from "@/components/customer/gallery/VirtualTour";
import Features from "@/components/customer/gallery/Features";
import LocationMap from "@/components/customer/gallery/LocationMap";
import VisitInfo from "@/components/customer/gallery/VisitInfo";
import ContactForm from "@/components/customer/gallery/ContactForm";
import FAQ from "@/components/customer/gallery/FAQ";
import SocialLinks from "@/components/customer/gallery/SocialLinks";
import CTA from "@/components/customer/gallery/CTA";

export default function GalleryContactPage() {
  return (
    <>
      {/* Floating Global Navbar */}
      <Navbar />

      <main className="w-full flex-grow bg-background">
        {/* Hero Section with Subtitle */}
        <Hero />

        {/* Filterable Image Grid (High Resolution Cafe Photos) */}
        <GalleryGrid />

        {/* Interactive 360 Virtual Tour Mock / Preview */}
        <VirtualTour />

        {/* Key Features & Amenities Grid */}
        <Features />

        {/* Embedded Interactive Location Map */}
        <LocationMap />

        {/* Visit Information (Opening Hours, Parking, Transport, Code of Conduct) */}
        <VisitInfo />

        {/* Contact Us Form (Inquiries, Bookings, Events) */}
        <ContactForm />

        {/* Frequently Asked Questions */}
        <FAQ />

        {/* Social Media Links & Live Instagram Feed Preview */}
        <SocialLinks />

        {/* Final Page CTA */}
        <CTA />
      </main>

      {/* Global Footer */}
      <Footer />
    </>
  );
}
