export function generateBookingId(): string {
  const dateStr = new Date().toISOString().slice(2, 10).replace(/-/g, "");
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `RCC-${dateStr}-${randomNum}`;
}

export function isSeatAvailable(
  seatId: string,
  reservedSeats: string[] = []
): boolean {
  return !reservedSeats.includes(seatId);
}
