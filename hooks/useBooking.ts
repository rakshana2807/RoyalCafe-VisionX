import { useBookingContext } from "@/context/BookingContext";

export function useBooking() {
  return useBookingContext();
}
