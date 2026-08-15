"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useBooking } from "@/context/BookingContext";
import Navbar from "@/components/customer/navbar/Navbar";
import Footer from "@/components/customer/footer/Footer";
import LiveHeader from "@/components/customer/live-status/LiveHeader";
import CapacityCard from "@/components/customer/live-status/CapacityCard";
import Filters from "@/components/customer/live-status/Filters";
import SeatMap, { SeatDetails } from "@/components/customer/live-status/SeatMap";
import AmenitiesStatus from "@/components/customer/live-status/AmenitiesStatus";
import BookingCTA from "@/components/customer/live-status/BookingCTA";
import SlidingBookingPanel from "@/components/customer/live-status/SlidingBookingPanel";
import { LayoutGrid, MapPin, Sparkles, Clock, Users, CheckCircle2, ArrowRight } from "lucide-react";

const getBadgeStyles = (status?: string) => {
  switch (status) {
    case "PARTIALLY BOOKED": return "bg-amber-300 text-amber-950 border border-amber-400";
    case "CURRENTLY OCCUPIED": return "bg-rose-500 text-white border border-rose-600";
    case "FULLY BOOKED": return "bg-rose-700 text-white border border-rose-800";
    case "AVAILABLE":
    default: return "bg-emerald-500 text-white border border-emerald-600";
  }
};

const getBadgeIcon = (status?: string) => {
  switch (status) {
    case "PARTIALLY BOOKED": return "🟡";
    case "CURRENTLY OCCUPIED": return "🔴";
    case "FULLY BOOKED": return "🔴";
    case "AVAILABLE":
    default: return "🟢";
  }
};


import { fetchAllWorkspaces, WorkspaceCardData } from "@/lib/workspaces";

export default function LiveStatusPage() {
  const router = useRouter();
  const { updateReservationDetails, setSelectedSeat: setContextSelectedSeat } = useBooking();
  const [activeZone, setActiveZone] = useState("All Seats");
  const [searchQuery, setSearchQuery] = useState("");
  const [priceFilter, setPriceFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortOrder, setSortOrder] = useState("Recommended");
  const [visibleCount, setVisibleCount] = useState(8);
  const [viewMode, setViewMode] = useState<"blueprint" | "grid">("grid");
  const [selectedSeat, setSelectedSeat] = useState<SeatDetails | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [seatStatusMap, setSeatStatusMap] = useState<Record<string, "available" | "selected" | "occupied" | "reserved" | "maintenance" | "disabled">>({});
  const [workspaces, setWorkspaces] = useState<WorkspaceCardData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function loadWorkspaces() {
      try {
        const data = await fetchAllWorkspaces();
        if (isMounted) setWorkspaces(data);
      } catch (error) {
        console.error("Failed to load workspaces:", error);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    loadWorkspaces();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleSelectSeat = (seat: SeatDetails) => {
    setSelectedSeat(seat);
    setContextSelectedSeat({
      id: seat.id,
      number: seat.number,
      seatNumber: seat.number,
      zone: seat.zone,
      seatType: seat.seatType || "Single Seater",
    });
    updateReservationDetails({
      tableType: seat.seatType || seat.id,
      seatingArea: seat.zone,
    });
    router.push('/book');
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

  const filteredWorkspaces = workspaces
    .filter((ws) => {
      // Category Filter
      if (activeZone !== "All Seats" && (!ws.categories || !ws.categories.includes(activeZone))) return false;
      
      // Search Query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        if (!ws.name.toLowerCase().includes(query) && !ws.seatType.toLowerCase().includes(query) && !ws.zone.toLowerCase().includes(query)) {
          return false;
        }
      }

      // Status Filter
      if (statusFilter !== "All") {
        if (statusFilter === "Available Now" && ws.realTimeStatus !== "AVAILABLE") return false;
        if (statusFilter === "Fully Booked" && ws.realTimeStatus !== "FULLY BOOKED") return false;
        if (statusFilter === "Limited Availability" && ws.realTimeStatus !== "PARTIALLY BOOKED" && ws.realTimeStatus !== "CURRENTLY OCCUPIED") return false;
      }

      // Price Filter
      if (priceFilter !== "All") {
        // ws.price is a string like "₹120 / hr"
        const numericPrice = parseInt(ws.price.replace(/[^\d]/g, ''), 10) || 0;
        if (priceFilter === "Under ₹100" && numericPrice >= 100) return false;
        if (priceFilter === "₹100-₹200" && (numericPrice < 100 || numericPrice > 200)) return false;
        if (priceFilter === "₹200-₹500" && (numericPrice < 200 || numericPrice > 500)) return false;
        if (priceFilter === "Above ₹500" && numericPrice <= 500) return false;
      }

      return true;
    })
    .sort((a, b) => {
      if (sortOrder === "Price Low-High") {
        const priceA = parseInt(a.price.replace(/[^\d]/g, ''), 10) || 0;
        const priceB = parseInt(b.price.replace(/[^\d]/g, ''), 10) || 0;
        return priceA - priceB;
      }
      if (sortOrder === "Price High-Low") {
        const priceA = parseInt(a.price.replace(/[^\d]/g, ''), 10) || 0;
        const priceB = parseInt(b.price.replace(/[^\d]/g, ''), 10) || 0;
        return priceB - priceA;
      }
      return 0; // Recommended / Rating fallback
    });

  const visibleWorkspaces = filteredWorkspaces.slice(0, visibleCount);

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
          <Filters 
            activeZone={activeZone} 
            onSelectZone={setActiveZone} 
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            priceFilter={priceFilter}
            onPriceFilterChange={setPriceFilter}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
            sortOrder={sortOrder}
            onSortOrderChange={setSortOrder}
          />

          {/* VIEW SWITCHER TAB BAR (WorkHub Inspired) */}
          <div className="flex items-center justify-center gap-2 pt-2">
            <div className="bg-[#FAF4ED] p-1.5 rounded-full border border-[#8C4A21]/20 inline-flex shadow-xs">
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                className={`px-4 py-2 rounded-full text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1.5 ${
                  viewMode === "grid"
                    ? "bg-[#3D2314] text-white shadow-xs"
                    : "text-[#8C4A21] hover:text-[#3D2314]"
                }`}
              >
                <MapPin className="w-3.5 h-3.5" /> Seating Cards
              </button>
              <button
                type="button"
                onClick={() => setViewMode("blueprint")}
                className={`px-4 py-2 rounded-full text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1.5 ${
                  viewMode === "blueprint"
                    ? "bg-[#3D2314] text-white shadow-xs"
                    : "text-[#8C4A21] hover:text-[#3D2314]"
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" /> Floor Blueprint
              </button>
            </div>
          </div>

          {/* VIEW CONTENT */}
          {viewMode === "blueprint" ? (
            /* Interactive Café Seating Floor Plan Map */
            <SeatMap
              activeZone={activeZone}
              selectedSeatId={selectedSeat?.id || null}
              onSelectSeat={handleSelectSeat}
              seatStatusMap={seatStatusMap}
            />
          ) : (
            /* WorkHub Style Seating Card Grid */
            <div className="flex flex-col gap-6 pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 text-left">
                {visibleWorkspaces.length > 0 ? visibleWorkspaces.map((ws) => (
                  <div
                    key={ws.id}
                    className="bg-white rounded-[24px] border border-primary/10 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
                  >
                    <div className="relative h-44 w-full overflow-hidden bg-muted">
                      <img
                        src={ws.image}
                        alt={ws.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className={`absolute top-3 left-3 text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full shadow-xs flex items-center gap-1 ${getBadgeStyles(ws.realTimeStatus)}`}>
                        {ws.realTimeStatus || "AVAILABLE"}
                      </div>
                      <div className="absolute top-3 right-3 bg-[#3D2314]/80 backdrop-blur-md text-white text-xs font-extrabold px-3 py-1 rounded-full border border-white/20">
                        {ws.price}
                      </div>
                    </div>

                    <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="text-[10px] font-extrabold text-[#8C4A21] uppercase tracking-wider mb-1">
                          {ws.zone} • {ws.seatType}
                        </div>
                        <h3 className="font-bold text-base text-[#2A1506] font-serif">{ws.name}</h3>
                        <p className="text-[11px] font-bold text-[#8C4A21] flex items-center gap-1.5 mt-1.5">
                          <span className="text-[10px]">{getBadgeIcon(ws.realTimeStatus)}</span> {ws.statusMessage}
                        </p>
                        <p className="text-xs text-foreground/60 font-medium flex items-center gap-1 mt-2">
                          <Users className="w-3.5 h-3.5 text-[#EA5A0C]" /> Capacity: {ws.capacity}
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-1.5 pt-2">
                        {ws.amenities.map((am, i) => (
                          <span key={i} className="text-[10px] font-bold bg-[#FAF4ED] text-[#7A5A43] px-2 py-0.5 rounded-md border border-[#DFCDBE]/50">
                            {am}
                          </span>
                        ))}
                      </div>

                      <button
                        type="button"
                        disabled={ws.realTimeStatus === "FULLY BOOKED"}
                        onClick={() => handleSelectSeat(ws)}
                        className={`w-full mt-3 py-2.5 px-4 font-bold text-xs rounded-xl transition-all shadow-2xs flex items-center justify-center gap-1.5 ${
                          ws.realTimeStatus === "FULLY BOOKED" 
                            ? "bg-gray-200 text-gray-400 cursor-not-allowed" 
                            : "bg-[#2563EB] hover:bg-[#1D4ED8] text-white cursor-pointer"
                        }`}
                      >
                        {ws.realTimeStatus === "FULLY BOOKED" ? "FULLY RESERVED" : 
                        ws.realTimeStatus === "AVAILABLE" ? "Reserve Seat" : "Check Seat Availability"} 
                        {ws.realTimeStatus !== "FULLY BOOKED" && <ArrowRight className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                )) : (
                  <div className="col-span-full py-12 text-center text-foreground/50 font-medium">
                    No seating options found matching your filters.
                  </div>
                )}
              </div>
              
              {visibleCount < filteredWorkspaces.length && (
                <div className="flex justify-center pt-4">
                  <button 
                    onClick={() => setVisibleCount(prev => prev + 8)}
                    className="px-8 py-3 bg-[#EAE0D5] hover:bg-[#DFCDBE] text-[#2A1506] font-bold text-sm rounded-xl transition-colors cursor-pointer"
                  >
                    View More Seating
                  </button>
                </div>
              )}
            </div>
          )}

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
    </>
  );
}
