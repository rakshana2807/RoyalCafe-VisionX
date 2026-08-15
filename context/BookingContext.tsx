"use client";
import { supabase } from "@/lib/supabase";
import {
  isSpaceAvailable,
  createSupabaseBooking,
  parseDurationHours,
  calculateWorkspacePrice,
  CreateBookingInput,
} from "@/lib/reservation";
import { getAuthenticatedUser } from "@/lib/auth";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";

// ─── Types ─────────────────────────────────────────────────────────────────

export interface BookingMenuItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  price: number;
  image: string;
}

export interface BookingWifiPass {
  id?: string;
  name: string;
  duration: string;
  price: number;
}

export interface SelectedSeatDetails {
  id?: string;
  workspaceCode?: string;
  number?: string;
  seatNumber: string;
  zone: string;
  seatType: string;
  area?: string;
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

export interface RoyalCafeBookingStorage {
  selectedSeat: SelectedSeatDetails | null;
  customer: {
    fullName: string;
    email: string;
    phone: string;
  };
  reservation: {
    date: string;
    arrivalTime: string;
    duration: string;
    numberOfPeople: string;
    tableType: string;
    occasion: string;
    specialRequest: string;
  };
  menuItems: {
    id: string;
    name: string;
    image: string;
    price: number;
    quantity: number;
    subtotal: number;
  }[];
  wifiPass: {
    id?: string;
    name: string;
    duration: string;
    price: number;
  } | null;
  payment: {
    foodTotal: number;
    wifiTotal: number;
    reservationFee: number;
    gst: number;
    grandTotal: number;
  };
}

export const TABLE_TYPES = [
  "Single Seater",
  "2 Seater",
  "4 Seater",
  "Lounge",
  "Private Booths (6 Seater)",
  "Booths (10 Seater)",
  "Kids Zone",
  "Elder Friendly",
];

export const DEFAULT_RESERVATION_DETAILS: ReservationDetails = {
  fullName: "",
  mobile: "",
  email: "",
  resDate: new Date().toISOString().split("T")[0],
  arrivalTime: "09:30 AM",
  duration: "2 Hours",
  seatingArea: "Indoor Seating",
  tableType: "2 Seater",
  guests: "2",
  occasion: "Casual Visit",
  specialRequests: "",
  bookingType: "relax",
};

interface BookingContextValue {
  bookingItems: BookingMenuItem[];
  menuItems: BookingMenuItem[]; // Alias
  wifiPass: BookingWifiPass | null;
  selectedSeat: SelectedSeatDetails | null;
  reservationDetails: ReservationDetails;
  addMenuItem: (item: Omit<BookingMenuItem, "quantity">) => void;
  removeMenuItem: (id: string) => void;
  updateQty: (id: string, delta: 1 | -1) => void;
  setWifiPass: (pass: BookingWifiPass | null) => void;
  setSelectedSeat: (seat: SelectedSeatDetails | null) => void;
  updateReservationDetails: (details: Partial<ReservationDetails>) => void;
  clearBooking: () => void;
  checkAvailability: (
    spaceId: string,
    bookingDate: string,
    startTime: string,
    endTime: string
  ) => Promise<boolean>;
  createBooking: (params?: Partial<import("@/lib/reservation").CreateBookingInput>) => Promise<any>;
  foodTotal: number;
  wifiTotal: number;
  bookingFee: number;
  gst: number;
  grandTotal: number;
  totalPrice: number; // Alias
}

// ─── Context & Storage Key ──────────────────────────────────────────────────

const BookingContext = createContext<BookingContextValue | null>(null);

const PRIMARY_KEY = "royalcafe_booking";

function loadFromStorage(): {
  bookingItems: BookingMenuItem[];
  wifiPass: BookingWifiPass | null;
  selectedSeat: SelectedSeatDetails | null;
  reservationDetails: ReservationDetails;
} {
  if (typeof window === "undefined") {
    return {
      bookingItems: [],
      wifiPass: null,
      selectedSeat: null,
      reservationDetails: DEFAULT_RESERVATION_DETAILS,
    };
  }
  try {
    const raw = localStorage.getItem(PRIMARY_KEY);
    if (!raw) {
      return {
        bookingItems: [],
        wifiPass: null,
        selectedSeat: null,
        reservationDetails: DEFAULT_RESERVATION_DETAILS,
      };
    }
    const parsed = JSON.parse(raw) as Partial<RoyalCafeBookingStorage>;

    const customer = (parsed.customer || {}) as Partial<RoyalCafeBookingStorage["customer"]>;
    const reservation = (parsed.reservation || {}) as Partial<RoyalCafeBookingStorage["reservation"]>;

    const selectedSeat: SelectedSeatDetails | null = parsed.selectedSeat
      ? {
          id: (parsed.selectedSeat as any).id,
          number: (parsed.selectedSeat as any).number,
          seatNumber: parsed.selectedSeat.seatNumber || (parsed.selectedSeat as any).number || "",
          zone: parsed.selectedSeat.zone,
          seatType: parsed.selectedSeat.seatType,
          area: (parsed.selectedSeat as any).area,
        }
      : null;

    const reservationDetails: ReservationDetails = {
      ...DEFAULT_RESERVATION_DETAILS,
      fullName: customer.fullName || "",
      email: customer.email || "",
      mobile: customer.phone || "",
      resDate: reservation.date || DEFAULT_RESERVATION_DETAILS.resDate,
      arrivalTime: reservation.arrivalTime || DEFAULT_RESERVATION_DETAILS.arrivalTime,
      duration: reservation.duration || DEFAULT_RESERVATION_DETAILS.duration,
      guests: reservation.numberOfPeople || DEFAULT_RESERVATION_DETAILS.guests,
      tableType: selectedSeat?.seatType || reservation.tableType || DEFAULT_RESERVATION_DETAILS.tableType,
      seatingArea: selectedSeat?.zone || DEFAULT_RESERVATION_DETAILS.seatingArea,
      occasion: reservation.occasion || DEFAULT_RESERVATION_DETAILS.occasion,
      specialRequests: reservation.specialRequest || DEFAULT_RESERVATION_DETAILS.specialRequests,
    };

    const bookingItems: BookingMenuItem[] = Array.isArray(parsed.menuItems)
      ? parsed.menuItems.map((m: any) => ({
          id: m.id || m.name,
          name: m.name,
          category: m.category || "Menu",
          price: Number(m.price) || 0,
          quantity: Number(m.quantity) || 1,
          image: m.image || "/flat-white.png",
        }))
      : [];

    const wifiPass: BookingWifiPass | null = parsed.wifiPass
      ? {
          id: parsed.wifiPass.id,
          name: parsed.wifiPass.name,
          duration: parsed.wifiPass.duration,
          price: Number(parsed.wifiPass.price) || 0,
        }
      : null;

    return { bookingItems, wifiPass, selectedSeat, reservationDetails };
  } catch (err) {
    console.warn("Corrupted royalcafe_booking in localStorage — clearing safely.", err);
    localStorage.removeItem(PRIMARY_KEY);
    return {
      bookingItems: [],
      wifiPass: null,
      selectedSeat: null,
      reservationDetails: DEFAULT_RESERVATION_DETAILS,
    };
  }
}

function saveToStorage(
  items: BookingMenuItem[],
  pass: BookingWifiPass | null,
  seat: SelectedSeatDetails | null,
  res: ReservationDetails,
  totals: { foodTotal: number; wifiTotal: number; bookingFee: number; gst: number; grandTotal: number }
) {
  if (typeof window === "undefined") return;
  try {
    const payload: RoyalCafeBookingStorage = {
      selectedSeat: seat
        ? {
            id: seat.id,
            number: seat.number,
            seatNumber: seat.seatNumber,
            zone: seat.zone,
            seatType: seat.seatType,
            area: seat.area,
          }
        : null,
      customer: {
        fullName: res.fullName,
        email: res.email,
        phone: res.mobile,
      },
      reservation: {
        date: res.resDate,
        arrivalTime: res.arrivalTime,
        duration: res.duration,
        numberOfPeople: res.guests,
        tableType: seat?.seatType || res.tableType,
        occasion: res.occasion,
        specialRequest: res.specialRequests,
      },
      menuItems: items.map((i) => ({
        id: i.id,
        name: i.name,
        image: i.image,
        price: i.price,
        quantity: i.quantity,
        subtotal: i.price * i.quantity,
      })),
      wifiPass: pass
        ? {
            id: pass.id || pass.name.toLowerCase().replace(/\s+/g, "_"),
            name: pass.name,
            duration: pass.duration,
            price: pass.price,
          }
        : null,
      payment: {
        foodTotal: totals.foodTotal,
        wifiTotal: totals.wifiTotal,
        reservationFee: totals.bookingFee,
        gst: totals.gst,
        grandTotal: totals.grandTotal,
      },
    };
    localStorage.setItem(PRIMARY_KEY, JSON.stringify(payload));
  } catch (err) {
    console.warn("Failed to write to localStorage:", err);
  }
}

// ─── Provider ───────────────────────────────────────────────────────────────

export function BookingProvider({ children }: { children: ReactNode }) {
  const [bookingItems, setBookingItems] = useState<BookingMenuItem[]>([]);
  const [wifiPass, setWifiPassState] = useState<BookingWifiPass | null>(null);
  const [selectedSeat, setSelectedSeatState] = useState<SelectedSeatDetails | null>(null);
  const [reservationDetails, setReservationDetails] = useState<ReservationDetails>(
    DEFAULT_RESERVATION_DETAILS
  );
  const [hydrated, setHydrated] = useState(false);

  // Hydrate from localStorage once on mount
  useEffect(() => {
    const saved = loadFromStorage();
    setBookingItems(saved.bookingItems);
    setWifiPassState(saved.wifiPass);
    setSelectedSeatState(saved.selectedSeat);
    setReservationDetails(saved.reservationDetails);
    setHydrated(true);
  }, []);

  // ── Derived Calculations ─────────────────────────────────────────────────
  const foodTotal = bookingItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const wifiTotal = wifiPass?.price ?? 0;
  const durationHrs = parseDurationHours(reservationDetails.duration);
  const guestsNum = parseInt(reservationDetails.guests, 10) || 1;
  const effectiveType = selectedSeat?.seatType || reservationDetails.tableType || "2 Seater";
  const bookingFee = calculateWorkspacePrice(effectiveType, durationHrs, guestsNum);
  const subtotalBeforeTax = foodTotal + wifiTotal + bookingFee;
  const gst = Math.round(subtotalBeforeTax * 0.02);
  const grandTotal = subtotalBeforeTax + gst;

  // Persist to localStorage whenever any field changes after initial hydration
  useEffect(() => {
    if (!hydrated) return;
    saveToStorage(bookingItems, wifiPass, selectedSeat, reservationDetails, {
      foodTotal,
      wifiTotal,
      bookingFee,
      gst,
      grandTotal,
    });
  }, [bookingItems, wifiPass, selectedSeat, reservationDetails, foodTotal, wifiTotal, bookingFee, gst, grandTotal, hydrated]);

  // ── Actions ─────────────────────────────────────────────────────────────

  const addMenuItem = useCallback((item: Omit<BookingMenuItem, "quantity">) => {
    setBookingItems((prev) => {
      const idx = prev.findIndex((m) => m.id === item.id || m.name === item.name);
      if (idx !== -1) {
        const updated = [...prev];
        updated[idx] = { ...updated[idx], quantity: updated[idx].quantity + 1 };
        return updated;
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  }, []);

  const removeMenuItem = useCallback((id: string) => {
    setBookingItems((prev) => prev.filter((m) => m.id !== id));
  }, []);

  const updateQty = useCallback((id: string, delta: 1 | -1) => {
    setBookingItems((prev) => {
      const idx = prev.findIndex((m) => m.id === id);
      if (idx === -1) return prev;
      const newQty = prev[idx].quantity + delta;
      if (newQty <= 0) return prev.filter((m) => m.id !== id);
      const updated = [...prev];
      updated[idx] = { ...updated[idx], quantity: newQty };
      return updated;
    });
  }, []);

  const setWifiPass = useCallback((pass: BookingWifiPass | null) => {
    setWifiPassState(pass);
  }, []);

  const setSelectedSeat = useCallback((seat: SelectedSeatDetails | null) => {
    setSelectedSeatState(seat);
    if (seat) {
      setReservationDetails((prev) => ({
        ...prev,
        tableType: seat.seatType || prev.tableType,
        seatingArea: seat.zone || prev.seatingArea,
      }));
    }
  }, []);

  const updateReservationDetails = useCallback(
    (details: Partial<ReservationDetails>) => {
      setReservationDetails((prev) => ({ ...prev, ...details }));
    },
    []
  );

  const clearBooking = useCallback(() => {
    setBookingItems([]);
    setWifiPassState(null);
    setSelectedSeatState(null);
    setReservationDetails(DEFAULT_RESERVATION_DETAILS);
    if (typeof window !== "undefined") {
      localStorage.removeItem(PRIMARY_KEY);
    }
  }, []);

  const checkAvailability = useCallback(
    async (spaceId: string, bookingDate: string, startTime: string, endTime: string) => {
      return await isSpaceAvailable(spaceId, bookingDate, startTime, endTime);
    },
    []
  );

  const createBooking = useCallback(
    async (overrideParams?: Partial<CreateBookingInput>) => {
      const user = getAuthenticatedUser();

      const spaceId = selectedSeat?.id || reservationDetails.tableType || "Window Seat 01";
      const durationHours = parseDurationHours(reservationDetails.duration);

      const bookingInput: CreateBookingInput = {
        userId: user?.id || "",
        userEmail: user?.email || "",
        spaceId: spaceId,
        bookingDate: reservationDetails.resDate,
        startTime: reservationDetails.arrivalTime,
        durationHours: durationHours,
        numberOfPeople: parseInt(reservationDetails.guests, 10) || 1,
        totalAmount: grandTotal,
        paymentStatus: "paid",
        specialRequest: reservationDetails.specialRequests || undefined,
        ...overrideParams,
      };

      return await createSupabaseBooking(bookingInput);
    },
    [selectedSeat, reservationDetails, grandTotal]
  );

  return (
    <BookingContext.Provider
      value={{
        bookingItems,
        menuItems: bookingItems,
        wifiPass,
        selectedSeat,
        reservationDetails,
        addMenuItem,
        removeMenuItem,
        updateQty,
        setWifiPass,
        setSelectedSeat,
        updateReservationDetails,
        clearBooking,
        checkAvailability,
        createBooking,
        foodTotal,
        wifiTotal,
        bookingFee,
        gst,
        grandTotal,
        totalPrice: grandTotal,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
}

// ─── Hook ────────────────────────────────────────────────────────────────────

export function useBooking(): BookingContextValue {
  const ctx = useContext(BookingContext);
  if (!ctx) {
    throw new Error("useBooking must be used inside <BookingProvider>");
  }
  return ctx;
}

export const useBookingContext = useBooking;
