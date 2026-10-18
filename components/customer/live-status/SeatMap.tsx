"use client";

import React, { useState } from "react";
import { Trees, Check, Baby, Accessibility } from "lucide-react";

export interface SeatDetails {
  id: string;
  number: string;
  zone: string;
  area: string;
  seatType: string;
  status: "available" | "selected" | "occupied" | "reserved" | "maintenance" | "disabled";
  reservedTime?: string;
  occupiedUntil?: string;
  availableAfter?: string;
  seat_code?: string;
  seat_name?: string;
  capacity?: number;
  price_per_hour?: number;
  is_available?: boolean;
}

interface SeatMapProps {
  activeZone?: string;
  selectedSeatId?: string | null;
  onSelectSeat?: (seat: SeatDetails) => void;
  seatStatusMap?: Record<string, "available" | "selected" | "occupied" | "reserved" | "maintenance" | "disabled">;
  isAdminView?: boolean;
}

function getSeatStyle(
  status: "available" | "selected" | "occupied" | "reserved" | "maintenance" | "disabled",
  isSelected: boolean
) {
  if (isSelected) {
    return "bg-[#320000] text-[#F5DAA7] shadow-[0_0_18px_rgba(244,221,165,0.7)] ring-2 ring-[#F5DAA7] scale-110 cursor-pointer z-10 transition-all duration-200";
  }
  switch (status) {
    case "selected":
      return "bg-[#320000] text-[#F5DAA7] shadow-[0_0_18px_rgba(244,221,165,0.7)] ring-2 ring-[#F5DAA7] scale-110 cursor-pointer z-10 transition-all duration-200";
    case "available":
      return "bg-[rgba(255,248,230,0.65)] text-[#320000] border border-[#320000]/30 hover:bg-[#320000] hover:text-[#F5DAA7] hover:border-[#320000] cursor-pointer hover:scale-105 transition-all shadow-xs";
    case "reserved":
      return "bg-[#320000]/20 text-[#320000]/70 border border-[#320000]/20 cursor-not-allowed shadow-xs";
    case "occupied":
      return "bg-[#320000] text-[#F5DAA7]/60 border border-[#320000] cursor-not-allowed shadow-xs opacity-90";
    case "maintenance":
    case "disabled":
      return "bg-[#320000]/10 text-[#320000]/50 border border-[#320000]/20 cursor-not-allowed opacity-60 shadow-xs";
    default:
      return "bg-[rgba(255,248,230,0.5)] border border-[#320000]/30 text-[#320000]";
  }
}

export default function SeatMap({
  activeZone = "All Seats",
  selectedSeatId,
  onSelectSeat,
  seatStatusMap,
  isAdminView = false,
}: SeatMapProps) {
  const [hoveredTooltip, setHoveredTooltip] = useState<string | null>(null);

  const handleSeatClick = (
    id: string,
    number: string,
    area: string,
    zone: string,
    seatType: string,
    status: "available" | "selected" | "occupied" | "reserved" | "maintenance" | "disabled"
  ) => {
    if (onSelectSeat) {
      let reservedTime = "02:00 PM - 05:00 PM";
      let availableAfter = "Today after 05:00 PM";
      let occupiedUntil = "06:30 PM";

      if (id.includes("SS") || id.includes("2S") || id.includes("PB")) {
        reservedTime = "01:00 PM - 04:00 PM";
        availableAfter = "Today after 04:00 PM";
        occupiedUntil = "05:00 PM";
      }

      onSelectSeat({
        id,
        number,
        area,
        zone,
        seatType,
        status,
        reservedTime,
        availableAfter,
        occupiedUntil,
      });
    }
  };

  const renderSeat = (
    id: string,
    number: string,
    area: string,
    zone: string,
    seatType: string,
    status: "available" | "selected" | "occupied" | "reserved" | "maintenance" | "disabled",
    shape: "circle" | "square" | "booth-10" | "booth" | "lounge" | "rectangle" | "bench" = "square"
  ) => {
    const isSelected = selectedSeatId === id;

    // Filter dimming check strictly based on seat.zone metadata
    let isDimmed = false;
    if (activeZone && activeZone !== "All Areas" && activeZone !== "All Seats") {
      const azLower = activeZone.toLowerCase();
      const zoneLower = zone.toLowerCase();
      const areaLower = area.toLowerCase();
      const typeLower = seatType.toLowerCase();

      if (azLower.includes("work") || azLower.includes("study")) {
        const isWorkStudy =
          zoneLower === "work & study" ||
          zoneLower === "work & study zone" ||
          (zoneLower === "quiet zone" && (id.startsWith("T-SS") || id.startsWith("T-2S") || id.startsWith("T-PB6")));
        if (!isWorkStudy) isDimmed = true;
      } else if (azLower.includes("lounge")) {
        const isLounge = zoneLower.includes("lounge") || areaLower.includes("lounge") || typeLower.includes("lounge");
        if (!isLounge) isDimmed = true;
      } else if (azLower.includes("social")) {
        const isSocial = zoneLower.includes("social") || areaLower.includes("social");
        if (!isSocial) isDimmed = true;
      } else if (azLower.includes("outdoor")) {
        const isOutdoor = zoneLower.includes("outdoor") || areaLower.includes("outdoor");
        if (!isOutdoor) isDimmed = true;
      } else if (azLower.includes("family")) {
        const isFamily = zoneLower.includes("family") || areaLower.includes("family");
        if (!isFamily) isDimmed = true;
      } else if (azLower.includes("booth") || azLower.includes("private")) {
        const isBooth = typeLower.includes("booth") || areaLower.includes("booth") || shape.includes("booth");
        if (!isBooth) isDimmed = true;
      } else if (azLower.includes("kids")) {
        const isKids = zoneLower.includes("kids") || areaLower.includes("kids") || typeLower.includes("kids");
        if (!isKids) isDimmed = true;
      } else if (azLower.includes("elder")) {
        const isElder = zoneLower.includes("elder") || areaLower.includes("elder") || typeLower.includes("elder");
        if (!isElder) isDimmed = true;
      } else {
        if (!zoneLower.includes(azLower) && !areaLower.includes(azLower) && !typeLower.includes(azLower)) {
          isDimmed = true;
        }
      }
    }

    const effectiveStatus = (seatStatusMap && seatStatusMap[id]) || status;
    const styleClass = getSeatStyle(effectiveStatus, isSelected);

    let shapeClass = "rounded-xl";
    if (shape === "circle") shapeClass = "rounded-full";
    if (shape === "booth") {
      shapeClass = "rounded-md h-16 sm:h-20 w-10 sm:w-12 border border-background/10 font-bold shadow-xs";
    }
    if (shape === "booth-10") {
      shapeClass = "rounded-md h-18 sm:h-30 w-10 sm:w-12 border border-background/10 font-bold shadow-xs";
    }
    if (shape === "square") {
      shapeClass = "rounded-md h-11 w-10 sm:h-12 sm:w-10 border border-background/10 font-bold shadow-xs";
    }
    if (shape === "rectangle") {
      shapeClass = "rounded-md h-11 w-10 sm:h-20 sm:w-13 border border-background/10 font-bold shadow-xs";
    }
    if (shape === "bench") {
      shapeClass = "rounded-lg h-6 w-16 sm:w-20 border border-background/10";
    }
    if (shape === "lounge") {
      shapeClass = "rounded-md h-11 w-58 sm:h-40 sm:w-58 border border-background/10 font-bold shadow-xs";
    }

    const tooltipKey = `${id}-${effectiveStatus}`;

    return (
      <div
        key={id}
        className={`relative inline-block ${isDimmed ? "opacity-70 blur-[0.3px]" : "opacity-100"}`}
        onMouseEnter={() => setHoveredTooltip(tooltipKey)}
        onMouseLeave={() => setHoveredTooltip(null)}
      >
        <button
          type="button"
          onClick={() => handleSeatClick(id, number, area, zone, seatType, effectiveStatus)}
          className={`h-9 w-9 sm:h-10 sm:w-10 font-sans font-black text-xs sm:text-sm flex items-center justify-center transition-all ${shapeClass} ${styleClass}`}
          title={`Desk ID: ${id} | ${seatType} (${effectiveStatus.toUpperCase()})`}
        >
          {isSelected ? <Check className="h-4 w-4 stroke-[3]" /> : number}
        </button>

        {/* Enhanced Hover Tooltip */}
        {hoveredTooltip === tooltipKey && (
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 pointer-events-none whitespace-nowrap bg-background text-primary text-xs font-bold p-3 rounded-xl shadow-2xl border border-primary/20 text-left space-y-1 animate-in fade-in duration-150">
            <div className="font-mono text-amber-300 font-black">Desk ID: {id}</div>
            <div className="text-primary">{seatType} ({area})</div>
            <div className="flex items-center gap-1.5 pt-0.5">
              <span
                className={`w-2 h-2 rounded-full ${
                  effectiveStatus === "available"
                    ? "bg-amber-400"
                    : effectiveStatus === "reserved"
                    ? "bg-amber-400"
                    : effectiveStatus === "occupied"
                    ? "bg-amber-400"
                    : "bg-amber-400"
                }`}
              />
              <span className="capitalize font-extrabold">{effectiveStatus}</span>
            </div>
            {effectiveStatus === "reserved" && (
              <div className="text-amber-200 text-xs">Available after 05:00 PM</div>
            )}
            {effectiveStatus === "occupied" && (
              <div className="text-rose-200 text-xs">Expected checkout 06:30 PM</div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-full overflow-x-auto bg-[#320000] rounded-[32px] p-5 sm:p-8 border border-[#320000]/20 shadow-xl text-left font-sans space-y-4">
      {/* Blueprint Status Legend Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#320000] p-3 sm:px-6 rounded-2xl border border-[rgba(244,221,165,0.25)] text-[#F5DAA7] text-xs font-bold">
        <span className="uppercase tracking-widest text-[#F5DAA7] text-[11px] font-black">
          Floor Map Legend
        </span>
        <div className="flex flex-wrap items-center gap-4 text-[11px]">
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded bg-[rgba(255,248,230,0.7)] border border-[#320000]/40 inline-block" />
            <span>Available</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded bg-[#320000] border-2 border-[#F5DAA7] inline-block" />
            <span className="text-[#F5DAA7]">Selected</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded bg-[#320000]/30 border border-[#320000]/30 inline-block" />
            <span>Reserved</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded bg-[#320000] border border-[#320000] inline-block opacity-90" />
            <span>Occupied</span>
          </div>
        </div>
      </div>

      {/* Scroll Hint for Mobile */}
      <span className="text-xs font-extrabold text-[#320000]/80 uppercase block text-center mb-4 lg:hidden">
        ← Scroll horizontally to view full floor plan blueprint →
      </span>

      {/* Main Floor Blueprint Container (UNTOUCHED BLUEPRINT LAYOUT & STRUCTURE) */}
      <div className="min-w-[1150px] flex items-stretch gap-4 sm:gap-6">
        
        {/* ─── LEFT COLUMN ───────────────────────────────────────── */}
        <div className="w-[280px] shrink-0 flex flex-col justify-between gap-4">
          
          {/* Card 1: SINGLE SEATER TABLES */}
          <div className="bg-[#320000] p-4 rounded-2xl border border-[rgba(244,221,165,0.25)] space-y-3 shadow-md">
            <span className="text-xs font-black text-[#F5DAA7] uppercase tracking-wider block">
              SINGLE SEATER TABLES
            </span>
            <div className="flex items-center justify-between">
              {renderSeat("L-SS-1", "1", "Single Seater Tables", "Social", "Single Seater", "occupied", "circle")}
              {renderSeat("L-SS-2", "2", "Single Seater Tables", "Social", "Single Seater", "reserved", "circle")}
              {renderSeat("L-SS-3", "3", "Single Seater Tables", "Social", "Single Seater", "reserved", "circle")}
              {renderSeat("L-SS-4", "4", "Single Seater Tables", "Social", "Single Seater", "available", "circle")}
            </div>
          </div>

          {/* Card 2: 2-SEATER TABLES */}
          <div className="bg-[#320000] p-4 rounded-2xl border border-[rgba(244,221,165,0.25)] space-y-3 shadow-md">
            <span className="text-xs font-black text-[#F5DAA7] uppercase tracking-wider block">
              2-SEATER TABLES
            </span>
            <div className="flex items-center justify-between">
              {renderSeat("L-2S-1", "1", "2-Seater Tables", "Social", "2 Seater", "occupied", "square")}
              {renderSeat("L-2S-2", "2", "2-Seater Tables", "Social", "2 Seater", "reserved", "square")}
              {renderSeat("L-2S-3", "3", "2-Seater Tables", "Social", "2 Seater", "reserved", "square")}
              {renderSeat("L-2S-4", "4", "2-Seater Tables", "Social", "2 Seater", "available", "square")}
            </div>
            <div className="flex items-center justify-between">
              {renderSeat("L-2S-5", "5", "2-Seater Tables", "Social", "2 Seater", "occupied", "square")}
              {renderSeat("L-2S-6", "6", "2-Seater Tables", "Social", "2 Seater", "occupied", "square")}
              {renderSeat("L-2S-7", "7", "2-Seater Tables", "Social", "2 Seater", "available", "square")}
              {renderSeat("L-2S-8", "8", "2-Seater Tables", "Social", "2 Seater", "available", "square")}
            </div>
          </div>

          {/* Card 3: OUTDOOR SEATING */}
          <div className="bg-[#320000] p-4 rounded-2xl border border-[rgba(244,221,165,0.25)] space-y-3 shadow-md">
            <span className="text-xs font-black text-[#F5DAA7] uppercase tracking-wider block text-center">
              OUTDOOR SEATING
            </span>
            
            <div className="relative p-6 rounded-2xl bg-[#200000] border border-[rgba(244,221,165,0.2)] flex flex-col items-center justify-center min-h-[160px]">
              <span className="text-xs font-black text-[#F5DAA7] uppercase tracking-widest text-center">
                OUTDOOR<br />PARTY AREA
              </span>
              <span className="text-[9px] font-extrabold text-[#F5DAA7]/60 uppercase tracking-widest mt-1">
                ORB VIEWING DECK
              </span>

              {/* 4 Outdoor Green Bench Blocks */}
              <div className="absolute top-1 left-1/2 -translate-x-1/2">
                {renderSeat("OUT-B1", "A1", "Outdoor Party Area", "Outdoor", "Outdoor Terrace", "available", "bench")}
              </div>
              <div className="absolute bottom-1 left-1/2 -translate-x-1/2">
                {renderSeat("OUT-B2", "A2", "Outdoor Party Area", "Outdoor", "Outdoor Terrace", "available", "bench")}
              </div>
              <div className="absolute left-1 top-1/2 -translate-y-1/2 rotate-90">
                {renderSeat("OUT-B3", "A3", "Outdoor Party Area", "Outdoor", "Outdoor Terrace", "available", "bench")}
              </div>
              <div className="absolute right-1 top-1/2 -translate-y-1/2 rotate-90">
                {renderSeat("OUT-B4", "A4", "Outdoor Party Area", "Outdoor", "Outdoor Terrace", "available", "bench")}
              </div>
            </div>
          </div>

          {/* Card 4: SOCIAL LOUNGE WITH INTERACTIVE LOUNGE SEATS */}
          <div className="bg-[#320000] p-4 rounded-2xl border border-[rgba(244,221,165,0.25)] flex flex-col items-center justify-center text-center space-y-2 min-h-[130px] shadow-md">
            <div className="flex items-center gap-1.5">
              <Trees className="h-4 w-4 text-[#F5DAA7] stroke-[1.5]" />
              <span className="text-xs font-black text-[#F5DAA7] uppercase tracking-widest">
                SOCIAL LOUNGE
              </span>
            </div>
            <div className="flex items-center justify-around w-full pt-1">
              {renderSeat("LOU-1", "L1", "Social Lounge", "Lounge", "Lounge", "available", "lounge")}
            </div>
          </div>

        </div>

        {/* --- DARK VERTICAL DIVIDER LINE --- */}
        <div className="w-1.5 bg-[#320000]/20 rounded-full shrink-0 self-stretch my-1" />

        {/* --- CENTER AREA --- */}
        <div className="flex-1 flex flex-col justify-between gap-5 min-w-[660px]">
          
          {/* Top Row: 3 Equal Cards (ONLY WORK & STUDY ZONE) */}
          <div className="grid grid-cols-3 gap-4">
            
            {/* 1. SINGLE SEATER TABLES (WORK & STUDY ZONE ONLY) */}
            <div className="bg-[#320000] p-4 rounded-2xl border border-[rgba(244,221,165,0.3)] space-y-3 shadow-md">
              <div className="flex justify-between items-center">
                <span className="text-xs font-black text-[#F5DAA7] uppercase tracking-wider">
                  SINGLE SEATER TABLES
                </span>
                <span className="text-[9px] font-extrabold bg-[#F5DAA7]/20 text-[#F5DAA7] px-2 py-0.5 rounded-full border border-[#F5DAA7]/30">
                  8 Seats
                </span>
              </div>
              
              {/* Row 1: 1, 2, 3, 4 */}
              <div className="flex items-center justify-around">
                {renderSeat("T-SS-1", "1", "Single Seater Tables", "Work & Study", "Single Seater", "occupied", "circle")}
                {renderSeat("T-SS-2", "2", "Single Seater Tables", "Work & Study", "Single Seater", "reserved", "circle")}
                {renderSeat("T-SS-3", "3", "Single Seater Tables", "Work & Study", "Single Seater", "available", "circle")}
                {renderSeat("T-SS-4", "4", "Single Seater Tables", "Work & Study", "Single Seater", "available", "circle")}
              </div>
              {/* Row 2: 5, 6, 7, 8 */}
              <div className="flex items-center justify-around pt-1 border-t border-[rgba(244,221,165,0.15)]">
                {renderSeat("T-SS-5", "5", "Single Seater Tables", "Work & Study", "Single Seater", "available", "circle")}
                {renderSeat("T-SS-6", "6", "Single Seater Tables", "Work & Study", "Single Seater", "available", "circle")}
                {renderSeat("T-SS-7", "7", "Single Seater Tables", "Work & Study", "Single Seater", "reserved", "circle")}
                {renderSeat("T-SS-8", "8", "Single Seater Tables", "Work & Study", "Single Seater", "available", "circle")}
              </div>
            </div>

            {/* 2. 2-SEATER TABLES (WORK & STUDY ZONE ONLY) */}
            <div className="bg-[#320000] p-4 rounded-2xl border border-[rgba(244,221,165,0.3)] space-y-3 shadow-md">
              <div className="flex justify-between items-center">
                <span className="text-xs font-black text-[#F5DAA7] uppercase tracking-wider">
                  2-SEATER TABLES
                </span>
                <span className="text-[9px] font-extrabold bg-[#F5DAA7]/20 text-[#F5DAA7] px-2 py-0.5 rounded-full border border-[#F5DAA7]/30">
                  8 Seats
                </span>
              </div>

              {/* Row 1: 1, 2, 3, 4 */}
              <div className="flex items-center justify-around">
                {renderSeat("T-2S-1", "1", "2-Seater Tables", "Work & Study", "2 Seater", "occupied", "square")}
                {renderSeat("T-2S-2", "2", "2-Seater Tables", "Work & Study", "2 Seater", "reserved", "square")}
                {renderSeat("T-2S-3", "3", "2-Seater Tables", "Work & Study", "2 Seater", "reserved", "square")}
                {renderSeat("T-2S-4", "4", "2-Seater Tables", "Work & Study", "2 Seater", "available", "square")}
              </div>
              {/* Row 2: 5, 6, 7, 8 */}
              <div className="flex items-center justify-around pt-1 border-t border-[rgba(244,221,165,0.15)]">
                {renderSeat("T-2S-5", "5", "2-Seater Tables", "Work & Study", "2 Seater", "available", "square")}
                {renderSeat("T-2S-6", "6", "2-Seater Tables", "Work & Study", "2 Seater", "available", "square")}
                {renderSeat("T-2S-7", "7", "2-Seater Tables", "Work & Study", "2 Seater", "reserved", "square")}
                {renderSeat("T-2S-8", "8", "2-Seater Tables", "Work & Study", "2 Seater", "available", "square")}
              </div>
            </div>

            {/* 3. 6 SEAT – PRIVATE BOOTH (WORK & STUDY ZONE ONLY) */}
            <div className="bg-[#320000] p-4 rounded-2xl border border-[rgba(244,221,165,0.3)] flex flex-col justify-between min-h-[160px] shadow-md">
              <div className="flex justify-between items-center">
                <span className="text-xs font-black text-[#F5DAA7] uppercase tracking-wider">
                  6 SEAT – PRIVATE BOOTH
                </span>
              </div>
              <div className="flex items-center justify-around py-2">
                {renderSeat("T-PB6-1", "1", "Private Booth 6", "Work & Study", "Private Booths (6 Seater)", "reserved", "booth")}
                {renderSeat("T-PB6-2", "2", "Private Booth 6", "Work & Study", "Private Booths (6 Seater)", "available", "booth")}
                {renderSeat("T-PB6-3", "3", "Private Booth 6", "Work & Study", "Private Booths (6 Seater)", "available", "booth")}
              </div>
            </div>

          </div>

          {/* Second Row: ENLARGED 2X HEIGHT 10-SEATER BOOTH & 4-SEATER TABLES */}
          <div className="grid grid-cols-12 gap-4">
            
            {/* 10 SEAT – PRIVATE BOOTH (FAMILY ZONE) */}
            <div className="col-span-6 bg-[#320000] p-5 rounded-2xl border border-[rgba(244,221,165,0.25)] flex flex-col justify-between min-h-[200px] shadow-md space-y-3">
              <div className="flex justify-between items-center border-b border-[rgba(244,221,165,0.2)] pb-2">
                <span className="text-xs font-black text-[#F5DAA7] uppercase tracking-wider">
                  10 SEAT — PRIVATE BOOTH
                </span>
                <span className="text-[9px] font-extrabold bg-[#F5DAA7]/20 text-[#F5DAA7] px-2 py-0.5 rounded-full">
                  10 Seats
                </span>
              </div>

              <div className="space-y-3 py-1">
                {/* Row 1: 1 to 5 */}
                <div className="flex items-center justify-between">
                  {renderSeat("M-PB10-1", "1", "10-Seater Booth", "Family", "Booths (10 Seater)", "available", "booth-10")}
                  {renderSeat("M-PB10-2", "2", "10-Seater Booth", "Family", "Booths (10 Seater)", "available", "booth-10")}
                  {renderSeat("M-PB10-3", "3", "10-Seater Booth", "Family", "Booths (10 Seater)", "occupied", "booth-10")}
                  {renderSeat("M-PB10-4", "4", "10-Seater Booth", "Family", "Booths (10 Seater)", "reserved", "booth-10")}
                  {renderSeat("M-PB10-5", "5", "10-Seater Booth", "Family", "Booths (10 Seater)", "available", "booth-10")}
                </div>
              </div>
            </div>

            {/* 4-SEATER TABLES (SOCIAL AREA) */}
            <div className="col-span-6 bg-[#320000] p-5 rounded-2xl border border-[rgba(244,221,165,0.25)] flex flex-col justify-between min-h-[200px] shadow-md space-y-3">
              <div className="flex justify-between items-center border-b border-[rgba(244,221,165,0.2)] pb-2">
                <span className="text-xs font-black text-[#F5DAA7] uppercase tracking-wider">
                  4-SEATER TABLES
                </span>
                <span className="text-[9px] font-extrabold bg-[#F5DAA7]/20 text-[#F5DAA7] px-2 py-0.5 rounded-full">
                  Spacious
                </span>
              </div>
              <div className="flex items-center justify-around py-4">
                {renderSeat("M-4S-1", "1", "4-Seater Tables", "Social", "4 Seater", "occupied", "rectangle")}
                {renderSeat("M-4S-2", "2", "4-Seater Tables", "Social", "4 Seater", "reserved", "rectangle")}
                {renderSeat("M-4S-3", "3", "4-Seater Tables", "Social", "4 Seater", "reserved", "rectangle")}
                {renderSeat("M-4S-4", "4", "4-Seater Tables", "Social", "4 Seater", "available", "rectangle")}
              </div>
            </div>

          </div>

          {/* ADDITIONAL SINGLE SEATER TABLES (SOCIAL AREA) */}
          <div className="bg-[#320000] p-4 rounded-2xl border border-[rgba(244,221,165,0.25)] space-y-2.5 shadow-md">
            <div className="flex justify-between items-center">
              <span className="text-xs font-black text-[#F5DAA7] uppercase tracking-wider">
                ADDITIONAL SEATING &bull; SINGLE SEATER TABLES (SINGLE 9 TO 16)
              </span>
              <span className="text-[9px] font-extrabold bg-[#F5DAA7]/20 text-[#F5DAA7] px-2 py-0.5 rounded-full">
                Extra Seating
              </span>
            </div>
            <div className="flex items-center justify-between">
              {renderSeat("E-SS-9", "9", "Single Seater Tables", "Social", "Single Seater", "available", "circle")}
              {renderSeat("E-SS-10", "10", "Single Seater Tables", "Social", "Single Seater", "available", "circle")}
              {renderSeat("E-SS-11", "11", "Single Seater Tables", "Social", "Single Seater", "reserved", "circle")}
              {renderSeat("E-SS-12", "12", "Single Seater Tables", "Social", "Single Seater", "occupied", "circle")}
              {renderSeat("E-SS-13", "13", "Single Seater Tables", "Social", "Single Seater", "available", "circle")}
              {renderSeat("E-SS-14", "14", "Single Seater Tables", "Social", "Single Seater", "available", "circle")}
              {renderSeat("E-SS-15", "15", "Single Seater Tables", "Social", "Single Seater", "available", "circle")}
              {renderSeat("E-SS-16", "16", "Single Seater Tables", "Social", "Single Seater", "reserved", "circle")}
            </div>
          </div>

          {/* Third Row */}
          <div className="grid grid-cols-12 gap-4 items-stretch">
            {/* Bottom Left: Large SOCIAL LOUNGE Card WITH INTERACTIVE LOUNGE SEATS */}
            <div className="col-span-5 bg-[#320000] p-5 rounded-2xl border border-[rgba(244,221,165,0.25)] flex flex-col items-center justify-center text-center space-y-3 min-h-[190px] shadow-md">
              <div className="flex items-center gap-2">
                <Trees className="h-6 w-6 text-[#F5DAA7] stroke-[1.5]" />
                <span className="text-xs font-black text-[#F5DAA7] uppercase tracking-widest">
                  SOCIAL LOUNGE
                </span>
              </div>
              <div className="flex flex-col gap-2 w-full">
                <div className="flex items-center justify-around w-full">
                  {renderSeat("LOU-5", "L5", "Social Lounge", "Lounge", "Lounge", "available", "lounge")}
                </div>
              </div>
            </div>

            {/* Bottom Right: KIDS ZONE & ELDER FRIENDLY */}
            <div className="col-span-7 grid grid-cols-2 gap-4">
              {/* KIDS ZONE (2x3 Grid) */}
              <div className="bg-[#320000] p-4 rounded-2xl border border-[rgba(244,221,165,0.25)] space-y-2.5 shadow-md">
                <div className="flex items-center gap-1.5">
                  <Baby className="h-4 w-4 text-[#F5DAA7]" />
                  <span className="text-xs font-black text-[#F5DAA7] uppercase tracking-wider">
                    KIDS
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 justify-items-center">
                  {renderSeat("B-KID-1", "1", "Kids Zone", "Kids Zone", "Kids Zone", "occupied", "square")}
                  {renderSeat("B-KID-2", "2", "Kids Zone", "Kids Zone", "Kids Zone", "reserved", "square")}
                  {renderSeat("B-KID-3", "3", "Kids Zone", "Kids Zone", "Kids Zone", "reserved", "square")}
                  {renderSeat("B-KID-4", "4", "Kids Zone", "Kids Zone", "Kids Zone", "available", "square")}
                  {renderSeat("B-KID-5", "5", "Kids Zone", "Kids Zone", "Kids Zone", "available", "square")}
                  {renderSeat("B-KID-6", "6", "Kids Zone", "Kids Zone", "Kids Zone", "available", "square")}
                </div>
              </div>

              {/* ELDER FRIENDLY */}
              <div className="bg-[#320000] p-4 rounded-2xl border border-[rgba(244,221,165,0.25)] space-y-2.5 shadow-md">
                <div className="flex items-center gap-1.5">
                  <Accessibility className="h-4 w-4 text-[#F5DAA7]" />
                  <span className="text-xs font-black text-[#F5DAA7] uppercase tracking-wider">
                    ELDER FRIENDLY
                  </span>
                </div>
                <div className="flex flex-col gap-2.5 items-center">
                  <div className="flex gap-8 justify-center">
                    {renderSeat("B-ELD-1", "1", "Elder Friendly", "Elder Friendly", "Elder Friendly", "occupied", "square")}
                    {renderSeat("B-ELD-2", "2", "Elder Friendly", "Elder Friendly", "Elder Friendly", "reserved", "square")}
                  </div>
                  <div className="flex gap-8 justify-center">
                    {renderSeat("B-ELD-3", "3", "Elder Friendly", "Elder Friendly", "Elder Friendly", "available", "square")}
                    {renderSeat("B-ELD-4", "4", "Elder Friendly", "Elder Friendly", "Elder Friendly", "available", "square")}
                  </div>
                  <div className="flex gap-8 justify-center">
                    {renderSeat("B-ELD-5", "5", "Elder Friendly", "Elder Friendly", "Elder Friendly", "available", "square")}
                    {renderSeat("B-ELD-6", "6", "Elder Friendly", "Elder Friendly", "Elder Friendly", "available", "square")}
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* --- RIGHT SIDEBAR: ORDERING COUNTER & ENTRANCE --- */}
        <div className="w-[150px] shrink-0 flex flex-col justify-between gap-4">
          
          {/* ORDERING COUNTER (Tall Rounded Card with Vertical Text) */}
          <div className="flex-1 bg-[#320000] rounded-3xl border border-[rgba(244,221,165,0.25)] p-4 flex flex-col items-center justify-center text-center shadow-md min-h-[440px] relative">
            <div className="h-full w-14 rounded-full bg-[#200000] border border-[#F5DAA7]/30 flex items-center justify-center p-2 shadow-inner">
              <span
                className="text-xs font-black uppercase tracking-[0.25em] text-[#F5DAA7]"
                style={{ writingMode: "vertical-lr", textOrientation: "mixed" }}
              >
                ORDERING COUNTER
              </span>
            </div>
          </div>

          {/* ENTRANCE BUTTON */}
          <div className="bg-[#320000] text-[#F5DAA7] py-4 px-4 rounded-2xl text-center font-black text-xs sm:text-sm uppercase tracking-widest shadow-md border border-[#F5DAA7]/30 cursor-default">
            ENTRANCE
          </div>

        </div>

      </div>
    </div>
  );
}
