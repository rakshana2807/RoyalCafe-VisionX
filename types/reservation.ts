export interface ReservationRecord {
  reservationId: string;
  fullName: string;
  mobile: string;
  email?: string;
  zone: string;
  seatNumber: string;
  seatType: string;
  date: string;
  arrivalTime: string;
  duration: string;
  guests: number;
  status: "confirmed" | "cancelled" | "checked_out";
  createdAt: string;
}
