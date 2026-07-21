"use client";

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
  name: string;
  duration: string;
  price: number;
}

export interface BookingState {
  bookingItems: BookingMenuItem[];
  menuItems: BookingMenuItem[]; // Alias for backward compatibility
  wifiPass: BookingWifiPass | null;
}

interface BookingContextValue {
  bookingItems: BookingMenuItem[];
  menuItems: BookingMenuItem[]; // Alias
  wifiPass: BookingWifiPass | null;
  addMenuItem: (item: Omit<BookingMenuItem, "quantity">) => void;
  removeMenuItem: (id: string) => void;
  updateQty: (id: string, delta: 1 | -1) => void;
  setWifiPass: (pass: BookingWifiPass | null) => void;
  clearBooking: () => void;
  foodTotal: number;
  wifiTotal: number;
  grandTotal: number;
  totalPrice: number; // Alias for grandTotal
}

// ─── Context ────────────────────────────────────────────────────────────────

const BookingContext = createContext<BookingContextValue | null>(null);

const STORAGE_KEY = "royalcafe_booking_cart";

function loadFromStorage(): { bookingItems: BookingMenuItem[]; wifiPass: BookingWifiPass | null } {
  if (typeof window === "undefined") return { bookingItems: [], wifiPass: null };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { bookingItems: [], wifiPass: null };
    const parsed = JSON.parse(raw);
    const bookingItems = parsed.bookingItems || parsed.menuItems || [];
    const wifiPass = parsed.wifiPass || null;
    return { bookingItems, wifiPass };
  } catch {
    return { bookingItems: [], wifiPass: null };
  }
}

function saveToStorage(state: { bookingItems: BookingMenuItem[]; wifiPass: BookingWifiPass | null }) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore
  }
}

// ─── Provider ───────────────────────────────────────────────────────────────

export function BookingProvider({ children }: { children: ReactNode }) {
  const [bookingItems, setBookingItems] = useState<BookingMenuItem[]>([]);
  const [wifiPass, setWifiPassState] = useState<BookingWifiPass | null>(null);
  const [hydrated, setHydrated] = useState(false);

  // Hydrate from localStorage once on mount (client side)
  useEffect(() => {
    const saved = loadFromStorage();
    setBookingItems(saved.bookingItems);
    setWifiPassState(saved.wifiPass);
    setHydrated(true);
  }, []);

  // Persist to localStorage whenever state changes after initial hydration
  useEffect(() => {
    if (!hydrated) return;
    saveToStorage({ bookingItems, wifiPass });
  }, [bookingItems, wifiPass, hydrated]);

  // ── Actions ─────────────────────────────────────────────────────────────

  const addMenuItem = useCallback((item: Omit<BookingMenuItem, "quantity">) => {
    console.log("Adding Item:", item);
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
    console.log("Setting WiFi Pass:", pass);
    setWifiPassState(pass);
  }, []);

  const clearBooking = useCallback(() => {
    setBookingItems([]);
    setWifiPassState(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  // ── Derived Totals ───────────────────────────────────────────────────────

  const foodTotal = bookingItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const wifiTotal = wifiPass?.price ?? 0;
  const grandTotal = foodTotal + wifiTotal;

  return (
    <BookingContext.Provider
      value={{
        bookingItems,
        menuItems: bookingItems, // Alias
        wifiPass,
        addMenuItem,
        removeMenuItem,
        updateQty,
        setWifiPass,
        clearBooking,
        foodTotal,
        wifiTotal,
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
