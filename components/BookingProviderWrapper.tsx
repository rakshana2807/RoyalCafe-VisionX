"use client";

import { BookingProvider } from "@/context/BookingContext";
import { ReactNode } from "react";

/**
 * Client-side wrapper that provides the BookingContext to the entire app.
 * Placed in layout.tsx which is a Server Component, so we need this
 * thin client boundary.
 */
export default function BookingProviderWrapper({ children }: { children: ReactNode }) {
  return <BookingProvider>{children}</BookingProvider>;
}
