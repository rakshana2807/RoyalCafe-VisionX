"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useBooking } from "@/context/BookingContext";
import { SeatDetails } from "./SeatMap";

interface BookingCTAProps {
  selectedSeat: SeatDetails | null;
}

export default function BookingCTA({ selectedSeat }: BookingCTAProps) {
  const router = useRouter();
  const { setSelectedSeat } = useBooking();

  const handleBookClick = () => {
    if (selectedSeat) {
      const formattedSeatNumber = selectedSeat.number.startsWith("Seat") || selectedSeat.number.startsWith("#")
        ? selectedSeat.number
        : `Seat #${selectedSeat.number}`;

      const derivedSeatType = selectedSeat.seatType || (
        selectedSeat.area.includes("Single")
          ? "Single Seater"
          : selectedSeat.area.includes("2-Seater")
          ? "2 Seater"
          : selectedSeat.area.includes("4-Seater")
          ? "4 Seater"
          : selectedSeat.area.includes("Booths")
          ? "Private Booths (6 Seater)"
          : selectedSeat.area.includes("Kids")
          ? "Kids Zone"
          : selectedSeat.area.includes("Elder")
          ? "Elder Friendly"
          : "2 Seater"
      );

      setSelectedSeat({
        id: selectedSeat.id,
        number: selectedSeat.number,
        seatNumber: formattedSeatNumber,
        zone: selectedSeat.zone,
        seatType: derivedSeatType,
        area: selectedSeat.area,
      });
    }
    router.push("/book");
  };

  return (
    <section id="book" className="py-12 bg-background font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Large Rounded CTA container */}
        <div className="bg-[#FAF6F0] rounded-[2.5rem] p-8 sm:p-12 relative overflow-hidden text-center card-shadow border border-primary/10">
          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <h2 className="text-2xl sm:text-4xl font-bold font-serif text-[#2A1506]">
              Found Your Perfect Spot?
            </h2>
            
            <p className="text-xs sm:text-sm text-foreground/75 font-medium max-w-lg mx-auto">
              Reserve your selected table now, pre-order coffee, and enjoy guaranteed seating upon arrival.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-2">
              <button
                type="button"
                onClick={handleBookClick}
                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 border border-transparent text-xs font-bold uppercase tracking-wider rounded-full text-white bg-[#2A1506] hover:bg-[#EA5A0C] transition-all shadow-md hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              >
                {selectedSeat ? `Book Seat #${selectedSeat.number}` : "Book Available Workspace"}
              </button>
              
              <Link
                href="/work-study"
                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 border border-primary/20 text-xs font-bold uppercase tracking-wider rounded-full text-[#2A1506] bg-white hover:bg-[#FAF6F0] transition-all shadow-xs"
              >
                Explore Passes
              </Link>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
