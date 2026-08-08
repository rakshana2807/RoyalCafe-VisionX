"use client";

import { useState, useEffect } from "react";

import Navbar from "@/components/customer/navbar/Navbar";
import Footer from "@/components/customer/footer/Footer";
import LiveHeader from "@/components/customer/live-status/LiveHeader";
import CapacityCard from "@/components/customer/live-status/CapacityCard";
import Filters from "@/components/customer/live-status/Filters";
import SeatMap, { SeatDetails } from "@/components/customer/live-status/SeatMap";
import AmenitiesStatus from "@/components/customer/live-status/AmenitiesStatus";
import BookingCTA from "@/components/customer/live-status/BookingCTA";
import SlidingBookingPanel from "@/components/customer/live-status/SlidingBookingPanel";

export default function LiveStatusPage() {
  const [activeZone, setActiveZone] = useState("All Areas");
  const [selectedSeat, setSelectedSeat] = useState<SeatDetails | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [seatStatusMap, setSeatStatusMap] = useState<Record<string, "available" | "selected" | "occupied" | "reserved" | "maintenance" | "disabled">>({});



  const handleSelectSeat = (seat: SeatDetails) => {
    const prevSeatId = selectedSeat?.id;
    setSelectedSeat(seat);
    setIsPanelOpen(true);

    setSeatStatusMap((prev) => {
      const nextMap = { ...prev };
      if (prevSeatId && nextMap[prevSeatId] === "selected") {
        nextMap[prevSeatId] = "available";
      }
      nextMap[seat.id] = "selected";
      return nextMap;
    });
  };

  const handleClosePanel = () => {
    setIsPanelOpen(false);
    if (selectedSeat) {
      setSeatStatusMap((prev) => {
        const nextMap = { ...prev };
        if (nextMap[selectedSeat.id] === "selected") {
          nextMap[selectedSeat.id] = "available";
        }
        return nextMap;
      });
      setSelectedSeat(null);
    }
  };

  return (
    <>
      {/* Floating Global Navbar */}
      <Navbar />

      <main className="w-full flex-grow bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 space-y-6 text-center">
          
          {/* Header Title Section with Pulse Badge */}
          <LiveHeader />

          {/* Real-time Capacity Metrics Card */}
          <CapacityCard />

          {/* Multi-level Dropdown & Filter Pills */}
          <Filters activeZone={activeZone} onSelectZone={setActiveZone} />

          {/* Interactive Café Seating Floor Plan Map */}
          <SeatMap
            activeZone={activeZone}
            selectedSeatId={selectedSeat?.id || null}
            onSelectSeat={handleSelectSeat}
            seatStatusMap={seatStatusMap}
          />

          {/* Live Amenities Indicators (Wi-Fi, Noise Level, Power Outlets) */}
          <AmenitiesStatus />

          {/* Action Bar / Seat Reservation CTA */}
          <BookingCTA selectedSeat={selectedSeat} />

        </div>
      </main>

      {/* Right Side Sliding Booking Panel */}
      <SlidingBookingPanel
        selectedSeat={selectedSeat}
        isOpen={isPanelOpen}
        onClose={handleClosePanel}
        onSelectSeat={handleSelectSeat}
      />

      {/* Global Footer */}
      <Footer />
    </>
  );
}
