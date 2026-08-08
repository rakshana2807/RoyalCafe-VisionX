export interface PaymentCalculation {
  foodTotal: number;
  wifiTotal: number;
  bookingFee: number;
  gst: number;
  grandTotal: number;
}

export function calculateBookingTotals(
  foodTotal: number = 0,
  wifiTotal: number = 0,
  bookingFee: number = 19
): PaymentCalculation {
  const subtotal = foodTotal + wifiTotal + bookingFee;
  const gst = Math.round(subtotal * 0.02);
  const grandTotal = subtotal + gst;

  return {
    foodTotal,
    wifiTotal,
    bookingFee,
    gst,
    grandTotal,
  };
}

export function formatINR(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}
