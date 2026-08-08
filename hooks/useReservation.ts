import { useState, useCallback } from "react";

export interface ReservationState {
  isSubmitting: boolean;
  error: string | null;
}

export function useReservation() {
  const [state, setState] = useState<ReservationState>({
    isSubmitting: false,
    error: null,
  });

  const submitReservation = useCallback(async (payload: Record<string, unknown>) => {
    setState({ isSubmitting: true, error: null });
    try {
      const mockBooking = {
        success: true,
        booking: {
          bookingId: `RCC-${Date.now().toString().slice(-6)}`,
          ...payload,
        },
      };
      return mockBooking;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to create reservation";
      setState({ isSubmitting: false, error: msg });
      throw err;
    } finally {
      setState((prev) => ({ ...prev, isSubmitting: false }));
    }
  }, []);

  return { ...state, submitReservation };
}
