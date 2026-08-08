export interface PaymentRecord {
  paymentId: string;
  bookingId?: string;
  amount: number;
  currency: string;
  status: "pending" | "completed" | "failed" | "refunded";
  paymentMethod: string;
  createdAt: string;
}
