export interface LocalProfile {
  id: string;
  full_name: string;
  email: string;
  phone: string;
}

export interface LocalBooking {
  id: string;
  user_id?: string;
  customer_name?: string;
  seat_id: string;
  space_id?: string;
  seat_name: string;
  seat_code: string;
  booking_date: string;
  start_time: string;
  end_time: string;
  duration_hours: number;
  number_of_people: number;
  total_amount: number;
  status: "confirmed" | "checked_in" | "checked_out" | "cancelled";
  payment_status: "paid" | "pending";
  created_at: string;
  updated_at: string;
  profiles?: LocalProfile | LocalProfile[]; // For joins
}

const BOOKINGS_KEY = "mock_bookings";
const PROFILES_KEY = "mock_profiles";

export const localDb = {
  getProfiles: (): LocalProfile[] => {
    if (typeof window === "undefined") return [];
    try {
      const data = localStorage.getItem(PROFILES_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  saveProfile: (profile: LocalProfile): void => {
    if (typeof window === "undefined") return;
    const profiles = localDb.getProfiles();
    const existingIndex = profiles.findIndex((p) => p.email === profile.email);
    if (existingIndex >= 0) {
      profiles[existingIndex] = { ...profiles[existingIndex], ...profile };
    } else {
      profiles.push(profile);
    }
    localStorage.setItem(PROFILES_KEY, JSON.stringify(profiles));
  },

  getProfileByEmail: (email: string): LocalProfile | undefined => {
    return localDb.getProfiles().find((p) => p.email === email);
  },

  getBookings: (): LocalBooking[] => {
    if (typeof window === "undefined") return [];
    try {
      const data = localStorage.getItem(BOOKINGS_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  saveBooking: (booking: LocalBooking): void => {
    if (typeof window === "undefined") return;
    const bookings = localDb.getBookings();
    const existingIndex = bookings.findIndex((b) => b.id === booking.id);
    if (existingIndex >= 0) {
      bookings[existingIndex] = { ...bookings[existingIndex], ...booking };
    } else {
      bookings.push(booking);
    }
    localStorage.setItem(BOOKINGS_KEY, JSON.stringify(bookings));
  },

  updateBookingStatus: (id: string, status: LocalBooking["status"]): void => {
    if (typeof window === "undefined") return;
    const bookings = localDb.getBookings();
    const index = bookings.findIndex((b) => b.id === id);
    if (index >= 0) {
      bookings[index].status = status;
      bookings[index].updated_at = new Date().toISOString();
      localStorage.setItem(BOOKINGS_KEY, JSON.stringify(bookings));
    }
  },

  getBookingsWithProfiles: (): LocalBooking[] => {
    const bookings = localDb.getBookings();
    const profiles = localDb.getProfiles();
    return bookings.map((b) => {
      const profile = profiles.find((p) => p.id === b.user_id);
      return { ...b, profiles: profile };
    });
  }
};
