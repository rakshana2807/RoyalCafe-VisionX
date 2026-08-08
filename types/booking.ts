export interface SelectedSeatDetails {
  seatNumber: string;
  zone: string;
  seatType: string;
}

export interface BookingMenuItem {
  id: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  subtotal: number;
}

export interface BookingWifiPass {
  id: string;
  name: string;
  speed: string;
  duration: string;
  price: number;
}

export interface ReservationDetails {
  fullName: string;
  mobile: string;
  email: string;
  resDate: string;
  arrivalTime: string;
  duration: string;
  seatingArea: string;
  tableType: string;
  guests: string;
  occasion: string;
  specialRequests: string;
  bookingType: "study" | "relax";
}
