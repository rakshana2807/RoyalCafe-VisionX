"use client";

import { Trees, Coffee } from "lucide-react";

export interface SeatDetails {
  id: string;
  number: string;
  zone: string;
  area: string;
  status: "available" | "occupied" | "reserved" | "work_study";
  amenities: string[];
}

interface SeatMapProps {
  activeZone: string;
  selectedSeatId: string | null;
  onSelectSeat: (seat: SeatDetails) => void;
}

export default function SeatMap({
  activeZone,
  selectedSeatId,
  onSelectSeat,
}: SeatMapProps) {
  // Configured seat data with corrected zone mapping:
  // - LEFT SIDE (2-Seater Tables & Single Seating): Social Area
  // - RIGHT SIDE (Work & Study Single Seating & Private Booths): Quiet Zone
  const areas = [
    {
      name: "2-Seater Tables",
      zone: "Social Area",
      styles: "col-span-12 md:col-span-4",
      bgStyle: "bg-white",
      seats: [
        { id: "S2-1", number: "1", status: "available", amenities: ["Power Outlet", "Conversations"] },
        { id: "S2-2", number: "2", status: "occupied", amenities: ["Power Outlet"] },
        { id: "S2-3", number: "3", status: "available", amenities: ["Power Outlet", "Friends & Family"] },
        { id: "S2-4", number: "4", status: "reserved", amenities: ["Power Outlet"] },
        { id: "S2-5", number: "5", status: "available", amenities: ["Near Window", "Coffee Seating"] },
      ],
    },
    {
      name: "Single Seating",
      zone: "Social Area",
      styles: "col-span-12 md:col-span-3 border-dashed border-2 border-primary/20",
      bgStyle: "bg-white",
      seats: [
        { id: "SS-1", number: "1", status: "available", amenities: ["Casual Seating", "Social Area"] },
        { id: "SS-2", number: "2", status: "available", amenities: ["Casual Seating", "Social Area"] },
        { id: "SS-3", number: "3", status: "occupied", amenities: ["Power Outlet"] },
      ],
    },
    {
      name: "Single Seating (Work & Study)",
      zone: "Quiet Zone",
      styles: "col-span-12 md:col-span-3",
      bgStyle: "bg-sky-50 border border-sky-100",
      seats: [
        { id: "QS-1", number: "1", status: "available", amenities: ["Gigabit Wi-Fi", "Power Outlet", "Silent Working"] },
        { id: "QS-2", number: "2", status: "available", amenities: ["Gigabit Wi-Fi", "Power Outlet", "Focus Zone"] },
        { id: "QS-3", number: "3", status: "occupied", amenities: ["Power Outlet"] },
      ],
    },
    {
      name: "Private Booths - 6",
      zone: "Quiet Zone",
      styles: "col-span-12 md:col-span-2",
      bgStyle: "bg-sky-50 border border-sky-100",
      seats: [
        { id: "PB-1", number: "1", status: "available", amenities: ["Leather Seating", "USB Ports", "Private Screen"] },
        { id: "PB-2", number: "2", status: "reserved", amenities: ["USB Ports", "Private Screen"] },
        { id: "PB-3", number: "3", status: "reserved", amenities: ["USB Ports", "Private Screen"] },
        { id: "PB-4", number: "4", status: "available", amenities: ["Leather Seating", "USB Ports", "Private Screen"] },
      ],
    },
    {
      name: "Social Lounge",
      zone: "Social Area",
      isSpecial: true,
      styles: "col-span-12 md:col-span-3 flex flex-col items-center justify-center min-h-[160px]",
      bgStyle: "bg-[#EBDCD0]/60",
      content: (
        <div className="flex flex-col items-center gap-2">
          <Trees className="h-8 w-8 text-primary/70 stroke-[1.25]" />
          <span className="text-[10px] font-bold tracking-widest text-primary/80 uppercase">
            Social Lounge
          </span>
        </div>
      ),
    },
    {
      name: "4-Seater Tables",
      zone: "Social Area",
      styles: "col-span-12 md:col-span-7",
      bgStyle: "bg-white",
      seats: [
        { id: "S4-1", number: "1", status: "occupied", amenities: ["Spacious Table"] },
        { id: "S4-2", number: "2", status: "occupied", amenities: ["Spacious Table"] },
        { id: "S4-3", number: "3", status: "available", amenities: ["Power Outlet", "Spacious Table"] },
        { id: "S4-4", number: "4", status: "available", amenities: ["Power Outlet", "Spacious Table"] },
        { id: "S4-5", number: "5", status: "reserved", amenities: ["Spacious Table"] },
        { id: "S4-6", number: "6", status: "reserved", amenities: ["Spacious Table"] },
        { id: "S4-7", number: "7", status: "occupied", amenities: ["Spacious Table"] },
      ],
    },
    {
      name: "Elder Friendly",
      zone: "Family Zone",
      styles: "col-span-12 md:col-span-5",
      bgStyle: "bg-white",
      seats: [
        { id: "EF-1", number: "1", status: "available", amenities: ["Padded Backrest", "Easy Access"] },
        { id: "EF-2", number: "2", status: "available", amenities: ["Padded Backrest", "Easy Access"] },
        { id: "EF-3", number: "3", status: "available", amenities: ["Padded Backrest", "Easy Access"] },
        { id: "EF-4", number: "4", status: "reserved", amenities: ["Easy Access"] },
        { id: "EF-5", number: "5", status: "occupied", amenities: ["Easy Access"] },
      ],
    },
    {
      name: "4-Seater Tables (Lower)",
      zone: "Social Area",
      styles: "col-span-12 md:col-span-5",
      bgStyle: "bg-white",
      seats: [
        { id: "Q4-1", number: "1", status: "available", amenities: ["Spacious Desk"] },
        { id: "Q4-2", number: "1", status: "available", amenities: ["Spacious Desk"] },
        { id: "Q4-3", number: "2", status: "available", amenities: ["Spacious Desk"] },
      ],
    },
    {
      name: "Booths (10 Seater)",
      zone: "Family Zone",
      styles: "col-span-12 md:col-span-4",
      bgStyle: "bg-white",
      seats: [
        { id: "B10-1", number: "1", status: "reserved", amenities: ["Group Seating", "Comfort Padding"] },
        { id: "B10-2", number: "2", status: "occupied", amenities: ["Group Seating"] },
        { id: "B10-3", number: "3", status: "available", amenities: ["Group Seating", "Comfort Padding"] },
        { id: "B10-4", number: "4", status: "available", amenities: ["Group Seating", "Comfort Padding"] },
      ],
    },
    {
      name: "Kids Zone",
      zone: "Family Zone",
      styles: "col-span-12 md:col-span-6",
      bgStyle: "bg-white",
      seats: [
        { id: "K-1", number: "1", status: "available", amenities: ["Low Height Table", "Soft Floor mat"] },
        { id: "K-2", number: "2", status: "available", amenities: ["Low Height Table"] },
        { id: "K-3", number: "3", status: "available", amenities: ["Low Height Table"] },
        { id: "K-4", number: "4", status: "available", amenities: ["Low Height Table"] },
        { id: "K-5", number: "5", status: "occupied", amenities: ["Soft Floor mat"] },
        { id: "K-6", number: "6", status: "occupied", amenities: ["Soft Floor mat"] },
        { id: "K-7", number: "7", status: "occupied", amenities: ["Soft Floor mat"] },
        { id: "K-8", number: "8", status: "occupied", amenities: ["Soft Floor mat"] },
      ],
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-emerald-500 hover:bg-emerald-600 text-white cursor-pointer";
      case "occupied":
        return "bg-zinc-300 text-foreground/40 cursor-not-allowed";
      case "reserved":
        return "bg-orange-500 hover:bg-orange-600 text-white cursor-pointer";
      case "work_study":
        return "bg-sky-400 hover:bg-sky-500 text-white cursor-pointer";
      default:
        return "bg-zinc-300";
    }
  };

  return (
    <div className="w-full overflow-x-auto bg-[#F2ECE4]/75 rounded-3xl p-6 sm:p-10 border border-primary/5 card-shadow relative">
      
      {/* Scroll Hint for Mobile Viewports */}
      <span className="text-[10px] font-bold text-foreground/30 uppercase block text-center mb-6 md:hidden">
        ← Swipe to explore the visual seating map →
      </span>

      {/* Visual Blueprint Main Wrap */}
      <div className="min-w-[900px] grid grid-cols-12 gap-6 items-stretch">
        
        {/* Left Seating Grid: Spans 10 columns */}
        <div className="col-span-10 grid grid-cols-12 gap-6">
          {areas.map((area, idx) => {
            // Check if active filters should dim this area
            const isDimmed =
              activeZone !== "All Areas" && area.zone !== activeZone;

            return (
              <div
                key={idx}
                className={`p-5 rounded-2xl flex flex-col justify-between transition-all duration-300 relative ${
                  area.bgStyle
                } ${area.styles} ${
                  isDimmed ? "opacity-35 blur-[0.5px]" : "opacity-100"
                }`}
              >
                {/* Area Badge/Name */}
                <span className="text-[9px] font-bold text-foreground/45 uppercase tracking-wider block mb-4">
                  {area.name}
                </span>

                {/* Content: Special Lounge block or Interactive Seats circles */}
                {area.isSpecial ? (
                  area.content
                ) : (
                  <div className="flex flex-wrap gap-2.5">
                    {area.seats?.map((seat) => {
                      const isSelected = selectedSeatId === seat.id;
                      const statusColor = getStatusColor(seat.status);

                      return (
                        <button
                          key={seat.id}
                          disabled={seat.status === "occupied"}
                          onClick={() =>
                            onSelectSeat({
                              id: seat.id,
                              number: seat.number,
                              zone: area.zone,
                              area: area.name,
                              status: seat.status as SeatDetails["status"],
                              amenities: seat.amenities,
                            })
                          }
                          className={`h-9 w-9 sm:h-10 sm:w-10 rounded-full font-sans font-semibold text-sm flex items-center justify-center transition-all ${statusColor} ${
                            isSelected
                              ? "ring-2 ring-primary ring-offset-2 scale-110 shadow-lg"
                              : "hover:scale-[1.05]"
                          }`}
                        >
                          {seat.number}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Right Counter Layout: Spans 2 columns */}
        <div className="col-span-2 flex flex-col gap-6 items-stretch justify-between">
          {/* Ordering Counter vertical container */}
          <div className="flex-1 bg-[#FAF6F0]/80 rounded-2xl border border-primary/5 p-6 flex flex-col items-center justify-center text-center card-shadow min-h-[350px]">
            <Coffee className="h-6 w-6 text-primary/75 mb-4 animate-pulse" />
            <span
              className="text-xs font-bold uppercase tracking-[0.25em] text-primary/80"
              style={{ writingMode: "vertical-lr", textOrientation: "mixed" }}
            >
              Ordering Counter
            </span>
          </div>

          {/* Entrance indicators at bottom */}
          <div className="bg-accent text-white py-3 px-4 rounded-xl text-center font-serif font-bold text-xs uppercase tracking-widest shadow-sm">
            Entrance
          </div>
        </div>

      </div>

    </div>
  );
}
