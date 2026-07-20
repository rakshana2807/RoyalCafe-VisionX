"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Hero from "@/components/book/Hero";
import WorkspaceSelector from "@/components/book/WorkspaceSelector";

export default function BookPage() {
  return (
    <>
      <Navbar />

      <main className="w-full flex-grow bg-background">
        {/* Title Header */}
        <Hero />

        {/* Main 3-Column Booking Interface (Matching Figma Design) */}
        <WorkspaceSelector />
      </main>

      <Footer />
    </>
  );
}
