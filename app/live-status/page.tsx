"use client";

import { useState } from "react";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LiveHeader from "@/components/live-status/LiveHeader";
import CapacityCard from "@/components/live-status/CapacityCard";
import Filters from "@/components/live-status/Filters";
import SeatMap, { SeatDetails } from "@/components/live-status/SeatMap";
import AmenitiesStatus from "@/components/live-status/AmenitiesStatus";
import BookingCTA from "@/components/live-status/BookingCTA";

export default function LiveStatusPage() {
  const [activeZone, setActiveZone] = useState("All Areas");
  const [selectedSeat, setSelectedSeat] = useState<SeatDetails | null>(null);

  const handleSelectSeat = (seat: SeatDetails) => {
    setSelectedSeat(seat);
  };

  return (
    <>
      {/* Floating Global Navbar */}
      <Navbar />

      <main className="w-full flex-grow bg-background">
        
        {/* Hero Header with Live stats card */}
        <LiveHeader />

        {/* Total, Available, Occupied metric cards */}
        <CapacityCard />

        {/* Visual floor plan blueprint segment */}
        <section className="py-12 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            {/* Legend & filter tabs */}
            <Filters
              activeZone={activeZone}
              onSelectZone={setActiveZone}
            />

            {/* Floor Plan (Full Width) */}
            <div className="w-full">
              <SeatMap
                activeZone={activeZone}
                selectedSeatId={selectedSeat ? selectedSeat.id : null}
                onSelectSeat={handleSelectSeat}
              />
            </div>

          </div>
        </section>

        {/* Premium Amenities list */}
        <AmenitiesStatus />

        {/* CTA section locking selected seat number */}
        <BookingCTA
          selectedSeatNumber={selectedSeat ? selectedSeat.number : null}
        />

      </main>

      {/* Global Footer */}
      <Footer />
    </>
  );
}
