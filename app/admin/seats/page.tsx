"use client";

import React, { useState, useEffect } from "react";
import SeatMap, { SeatDetails } from "@/components/customer/live-status/SeatMap";
import {
  Armchair,
  RefreshCw,
  Search,
  CheckCircle2,
  AlertCircle,
  Save,
  Loader2,
} from "lucide-react";

interface SeatRecord {
  seatId: string;
  seatNumber: string;
  zone: string;
  area: string;
  seatType: string;
  status: "available" | "reserved" | "occupied" | "maintenance" | "disabled";
  currentCustomer?: string | null;
  currentBookingId?: string | null;
  checkInTime?: string | null;
  checkOutTime?: string | null;
}

export default function AdminSeatsPage() {
  const [seatRecords, setSeatRecords] = useState<SeatRecord[]>([]);
  const [seatStatusMap, setSeatStatusMap] = useState<Record<string, "available" | "reserved" | "occupied" | "maintenance" | "disabled">>({});
  const [selectedSeat, setSelectedSeat] = useState<SeatDetails | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<"available" | "reserved" | "occupied" | "maintenance" | "disabled">("available");
  const [activeZoneFilter, setActiveZoneFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Toast notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form states inside admin side panel
  const [customerInput, setCustomerInput] = useState("");

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const fetchSeats = () => {
    setIsLoading(false);
  };

  useEffect(() => {
    fetchSeats();
  }, []);

  const handleSelectSeat = (seat: SeatDetails) => {
    setSelectedSeat(seat);
    const currentMapStatus = seatStatusMap[seat.id] || seat.status || "available";
    setSelectedStatus(currentMapStatus);
    const existing = seatRecords.find((r) => r.seatId === seat.id);
    setCustomerInput(existing?.currentCustomer || "");
  };

  const handleSaveChanges = () => {
    if (!selectedSeat) return;
    setIsSaving(true);
    setSeatStatusMap((prev) => ({ ...prev, [selectedSeat.id]: selectedStatus }));
    
    setSeatRecords((prev) => {
      const idx = prev.findIndex((r) => r.seatId === selectedSeat.id);
      const updatedItem: SeatRecord = {
        seatId: selectedSeat.id,
        seatNumber: selectedSeat.number,
        zone: selectedSeat.zone,
        area: selectedSeat.area,
        seatType: selectedSeat.seatType,
        status: selectedStatus,
        currentCustomer: selectedStatus === "occupied" ? customerInput || "Occupant Guest" : selectedStatus === "available" ? undefined : customerInput,
      };
      if (idx !== -1) {
        const copy = [...prev];
        copy[idx] = updatedItem;
        return copy;
      }
      return [...prev, updatedItem];
    });

    const toastMsg =
      selectedStatus === "occupied"
        ? "Seat Status Updated to Occupied"
        : selectedStatus === "available"
          ? "Seat Available Again"
          : selectedStatus === "reserved"
            ? "Seat Reserved Successfully"
            : "Seat Status Updated Successfully";
    showToast(toastMsg);
    setSelectedSeat(null);
    setIsSaving(false);
  };

  const selectedRecord = selectedSeat ? seatRecords.find((r) => r.seatId === selectedSeat.id) : null;
  const currentStatus = (selectedSeat && seatStatusMap[selectedSeat.id]) || selectedSeat?.status || "available";

  const zoneFilterOptions = [
    "All",
    "Study & Work",
    "Outdoor",
    "Family",
    "Social",
    "Lounge",
    "Kids",
    "Elder Friendly",
    "Private Booth",
    "10-Seater Booth",
  ];

  const statusFilterOptions = [
    "All",
    "Available",
    "Reserved",
    "Occupied",
    "Maintenance",
    "Disabled",
  ];

  return (
    <div className="space-y-6 text-[#3D2314]">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 bg-[#3D2314] text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-amber-500/30 flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-200">
          <CheckCircle2 className="h-5 w-5 text-emerald-400" />
          <span className="text-xs font-bold font-sans">{toastMessage}</span>
        </div>
      )}

      {/* Title & Sync Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black font-serif text-[#3D2314] tracking-tight">
            Admin Seat Availability Management
          </h1>
          <p className="text-xs text-[#7A5A43] font-sans">
            Manage seat availability &amp; status for internal cafe operations. Updates persist to Supabase.
          </p>
        </div>

        <button
          onClick={fetchSeats}
          disabled={isLoading}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-[#3D2314] text-white hover:bg-[#8C4A21] transition-all text-xs font-bold shadow-md cursor-pointer self-start sm:self-auto"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          <span>Sync Admin Seats</span>
        </button>
      </div>

      {/* Search & Status Legend Bar */}
      <div className="bg-[#FFFDF9] p-5 rounded-3xl border border-[#E5D5C5] shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8A6D56]" />
            <input
              type="text"
              placeholder="Search Seat Number, Zone, Type..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-[#DFCDBE] text-xs bg-[#FAF4ED] text-[#3D2314] focus:outline-none focus:border-[#8C4A21]"
            />
          </div>

          {/* Status Indicators Legend */}
          <div className="flex items-center gap-3 text-xs font-extrabold flex-wrap">
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300">
              <span className="h-2.5 w-2.5 rounded-full bg-[#22C55E]" />  Available
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-yellow-100 text-yellow-900 border border-yellow-300">
              <span className="h-2.5 w-2.5 rounded-full bg-[#EAB308]" />  Reserved
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-100 text-blue-900 border border-blue-300">
              <span className="h-2.5 w-2.5 rounded-full bg-[#3B82F6]" />  Occupied
            </span>
          </div>
        </div>

        {/* Zone Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pt-2 border-t border-[#E5D5C5]">
          <span className="text-xs font-bold text-[#7A5A43] shrink-0 mr-1">Zone:</span>
          {zoneFilterOptions.map((z) => (
            <button
              key={z}
              onClick={() => setActiveZoneFilter(z)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${activeZoneFilter === z
                  ? "bg-[#3D2314] text-amber-200 shadow-xs"
                  : "bg-[#EFE4D6] text-[#5C3A21] hover:bg-[#3D2314]/10"
                }`}
            >
              {z}
            </button>
          ))}
        </div>

      </div>

      {/* Main Blueprint Floor Map Container */}
      <div className="bg-[#FFFDF9] p-4 sm:p-6 rounded-[32px] border border-[#E5D5C5] shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-[#E5D5C5] pb-3">
          <h2 className="text-lg font-bold font-serif text-[#3D2314] flex items-center gap-2">
            <Armchair className="h-5 w-5 text-[#8C4A21]" /> Admin Seating Map
          </h2>
          <span className="text-xs font-mono font-bold text-[#7A5A43]">
            Click any seat to update status
          </span>
        </div>

        <SeatMap
          activeZone={activeZoneFilter === "All" ? "All Areas" : activeZoneFilter}
          selectedSeatId={selectedSeat?.id || null}
          onSelectSeat={handleSelectSeat}
          seatStatusMap={seatStatusMap}
          isAdminView={true}
        />
      </div>

      {/* Admin Action Side Modal Drawer */}
      {selectedSeat && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FFFDF9] p-6 sm:p-8 rounded-[32px] max-w-md w-full space-y-6 shadow-2xl border border-[#E5D5C5] animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#E5D5C5] pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#8C4A21] to-[#3D2314] text-white flex items-center justify-center font-serif font-black text-xl shadow-md">
                  {selectedSeat.number}
                </div>
                <div>
                  <h3 className="text-xl font-bold font-serif text-[#3D2314]">
                    Seat #{selectedSeat.number}
                  </h3>
                  <span className="text-xs text-[#7A5A43] font-semibold">{selectedSeat.area} • {selectedSeat.zone}</span>
                </div>
              </div>
              <button
                onClick={() => setSelectedSeat(null)}
                className="p-2 rounded-2xl bg-[#EFE4D6] text-[#3D2314] hover:bg-[#3D2314] hover:text-white transition-colors cursor-pointer font-bold"
              >
                ✕
              </button>
            </div>

            {/* Seat Details Summary */}
            <div className="bg-[#FAF4ED] p-4 rounded-2xl border border-[#DFCDBE] space-y-2.5 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-[#7A5A43] font-bold">Seat Number:</span>
                <span className="font-bold text-[#3D2314]">Seat #{selectedSeat.number}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#7A5A43] font-bold">Zone:</span>
                <span className="font-bold text-[#3D2314]">{selectedSeat.zone}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#7A5A43] font-bold">Seat Type:</span>
                <span className="font-bold text-[#3D2314]">{selectedSeat.seatType}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#7A5A43] font-bold">Current Status:</span>
                <span
                  className={`px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${currentStatus === "available"
                      ? "bg-emerald-100 text-emerald-900 border border-emerald-300"
                      : currentStatus === "reserved"
                        ? "bg-yellow-100 text-yellow-900 border border-yellow-300"
                        : currentStatus === "occupied"
                          ? "bg-blue-100 text-blue-900 border border-blue-300"
                          : currentStatus === "maintenance"
                            ? "bg-red-100 text-red-900 border border-red-300"
                            : "bg-gray-200 text-gray-900 border border-gray-400"
                    }`}
                >
                  {currentStatus}
                </span>
              </div>
              {selectedRecord?.currentCustomer && (
                <div className="flex justify-between items-center pt-2 border-t border-[#DFCDBE]">
                  <span className="text-[#7A5A43] font-bold">Current Customer:</span>
                  <span className="font-bold text-[#8C4A21]">{selectedRecord.currentCustomer}</span>
                </div>
              )}
              {selectedRecord?.currentBookingId && (
                <div className="flex justify-between items-center font-mono">
                  <span className="text-[#7A5A43] font-bold">Reservation ID:</span>
                  <span className="font-bold text-[#3D2314]">{selectedRecord.currentBookingId}</span>
                </div>
              )}
              {selectedRecord?.checkInTime && (
                <div className="flex justify-between items-center">
                  <span className="text-[#7A5A43] font-bold">Check-In Time:</span>
                  <span>{new Date(selectedRecord.checkInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              )}
              <div className="flex justify-between items-center">
                <span className="text-[#7A5A43] font-bold">Expected Checkout:</span>
                <span>2 Hours after Arrival</span>
              </div>
            </div>

            {/* Dropdown for Changing Status */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#3D2314] uppercase tracking-wider block">
                Select New Status:
              </label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value as any)}
                className="w-full px-4 py-3 rounded-2xl border border-[#DFCDBE] bg-[#FAF4ED] text-xs font-bold text-[#3D2314] focus:outline-none focus:border-[#8C4A21]"
              >
                <option value="available">🟢 Available</option>
                <option value="reserved">🟡 Reserved</option>
                <option value="occupied">🔵 Occupied</option>
                <option value="maintenance">🔴 Maintenance</option>
                <option value="disabled">⚫ Disabled</option>
              </select>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setSelectedSeat(null)}
                className="flex-1 py-3 px-4 rounded-2xl bg-[#EFE4D6] text-[#3D2314] font-bold text-xs hover:bg-[#3D2314] hover:text-white transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isSaving}
                onClick={handleSaveChanges}
                className="flex-1 py-3 px-4 rounded-2xl bg-gradient-to-r from-[#8C4A21] to-[#3D2314] text-white font-bold text-xs hover:opacity-95 transition-all cursor-pointer shadow-md flex items-center justify-center gap-2"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" /> Save Changes
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
