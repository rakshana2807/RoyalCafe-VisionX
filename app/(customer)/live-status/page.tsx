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
import { LayoutGrid, MapPin, Sparkles, Clock, Users, CheckCircle2, ArrowRight, Heart } from "lucide-react";

const getBadgeStyles = (status?: string) => {
  switch (status) {
    case "PARTIALLY BOOKED": return "bg-amber-300 text-amber-950 border border-amber-400";
    case "CURRENTLY OCCUPIED": return "bg-rose-500 text-primary border border-rose-600";
    case "FULLY BOOKED": return "bg-rose-700 text-primary border border-rose-800";
    case "AVAILABLE":
    default: return "bg-emerald-500 text-primary border border-emerald-600";
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
    // If the seat comes from SeatMap, id is the seat_code. If from grid, seat_code is present.
    const seatCode = seat.seat_code || seat.id;
    setContextSelectedSeat({
      id: seat.id,
      seat_code: seatCode,
      seat_name: seat.seat_name || seat.area || seat.zone,
      number: seat.number,
      seatNumber: seat.number,
      zone: seat.zone,
      seatType: seat.seatType || "Single Seater",
      price_per_hour: seat.price_per_hour,
    });
    updateReservationDetails({
      tableType: seat.seatType || seatCode,
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

          {/* VIEW SWITCHER TAB BAR */}
          <div className="flex items-center justify-center gap-2 pt-2 mb-6">
            <div className="bg-background p-1.5 rounded-full border border-primary/30 inline-flex shadow-sm">
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all duration-300 cursor-pointer flex items-center gap-2 uppercase tracking-widest ${
                  viewMode === "grid"
                    ? "bg-primary text-background shadow-md"
                    : "text-primary hover:bg-primary/10"
                }`}
              >
                <LayoutGrid className="w-4 h-4" /> Seating Cards
              </button>
              <button
                type="button"
                onClick={() => setViewMode("blueprint")}
                className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all duration-300 cursor-pointer flex items-center gap-2 uppercase tracking-widest ${
                  viewMode === "blueprint"
                    ? "bg-primary text-background shadow-md"
                    : "text-primary hover:bg-primary/10"
                }`}
              >
                <MapPin className="w-4 h-4" /> Floor Blueprint
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
                    className="bg-surface rounded-[24px] border border-primary/20 overflow-hidden shadow-sm hover:-translate-y-1 hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
                  >
                    <div className="relative h-56 w-full overflow-hidden bg-background">
                      <img
                        src={ws.image}
                        alt={ws.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                      />
                      
                      {/* Status Badge */}
                      <div className={`absolute top-4 left-4 text-[10px] font-bold uppercase px-3 py-1.5 rounded-full shadow-sm flex items-center gap-1.5 tracking-widest ${
                        ws.realTimeStatus === 'AVAILABLE' 
                          ? 'bg-primary text-background' 
                          : getBadgeStyles(ws.realTimeStatus)
                      }`}>
                        {ws.realTimeStatus || "AVAILABLE"}
                      </div>
                      
                      {/* Price Badge */}
                      <div className="absolute top-4 right-4 bg-background text-primary text-[11px] font-bold px-3 py-1.5 rounded-full shadow-sm tracking-wider">
                        {ws.price}
                      </div>

                      {/* Favorite Button */}
                      <button className="absolute bottom-4 right-4 h-9 w-9 rounded-full bg-background hover:bg-primary flex items-center justify-center shadow-sm cursor-pointer group/fav transition-colors duration-300 z-10">
                        <Heart className="h-4 w-4 text-primary group-hover/fav:text-background transition-colors" />
                      </button>
                    </div>

                    <div className="p-6 space-y-4 flex-1 flex flex-col justify-between text-left">
                      <div>
                        {/* Category Label */}
                        <div className="text-[11px] font-bold text-foreground/80 uppercase tracking-widest mb-1.5">
                          {ws.zone} • {ws.seatType}
                        </div>
                        
                        {/* Title */}
                        <h3 className="font-bold text-2xl text-foreground font-serif leading-snug mb-2">{ws.name}</h3>
                        
                        {/* Status Message */}
                        <p className="text-sm font-semibold text-foreground flex items-center gap-1.5 mt-2">
                          <span className="text-xs">{getBadgeIcon(ws.realTimeStatus)}</span> {ws.statusMessage}
                        </p>
                        
                        {/* Capacity */}
                        <p className="text-sm text-foreground/75 font-semibold flex items-center gap-1.5 mt-2.5">
                          <Users className="w-4 h-4 text-foreground/60" /> Capacity: {ws.capacity}
                        </p>
                      </div>

                      {/* Reserve Button */}
                      <button
                        type="button"
                        disabled={ws.realTimeStatus === "FULLY BOOKED"}
                        onClick={() => handleSelectSeat(ws as unknown as SeatDetails)}
                        className={`w-full mt-4 py-3.5 px-4 font-bold text-sm rounded-full transition-all duration-300 shadow-md flex items-center justify-center gap-2 uppercase tracking-widest group-hover:-translate-y-0.5 ${
                          ws.realTimeStatus === "FULLY BOOKED" 
                            ? "bg-foreground/10 text-foreground/50 cursor-not-allowed border border-foreground/20" 
                            : "bg-primary text-background hover:bg-background hover:text-primary hover:border hover:border-primary border border-transparent cursor-pointer"
                        }`}
                      >
                        {ws.realTimeStatus === "FULLY BOOKED" ? "FULLY RESERVED" : "Reserve Seat"} 
                        {ws.realTimeStatus !== "FULLY BOOKED" && <ArrowRight className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                )) : (
                  <div className="col-span-full py-12 text-center text-foreground/80 font-medium">
                    No seating options found matching your filters.
                  </div>
                )}
              </div>
              
              {visibleCount < filteredWorkspaces.length && (
                <div className="flex justify-center pt-4">
                  <button 
                    onClick={() => setVisibleCount(prev => prev + 8)}
                    className="px-8 py-3 bg-border/50 hover:bg-border/50 text-accent font-bold text-sm rounded-xl transition-colors cursor-pointer"
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
