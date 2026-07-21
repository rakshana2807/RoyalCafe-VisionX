import mongoose, { Schema, Document, Model } from "mongoose";

export interface IBookingMenuItem {
  itemId: string;
  name: string;
  price: number;
  quantity: number;
  subtotal: number;
}

export interface IBookingWifiPass {
  name: string;
  duration: string;
  price: number;
}

export interface IBooking extends Document {
  bookingId: string;
  userId?: mongoose.Types.ObjectId;
  fullName: string;
  mobile: string;
  email?: string;
  seatType: string;
  seatNumber?: string;
  date: string;
  arrivalTime: string;
  departureTime?: string;
  people: string;
  wifiPassCode?: string;
  purpose?: string;
  specialRequests?: string;
  // New: menu + wifi pass breakdown
  menuItems: IBookingMenuItem[];
  wifiPass?: IBookingWifiPass;
  foodTotal: number;
  wifiTotal: number;
  bookingFee: number;
  grandTotal: number;
  status: "pending" | "confirmed" | "cancelled" | "rejected";
  createdAt: Date;
}

const BookingMenuItemSchema = new Schema<IBookingMenuItem>(
  {
    itemId: { type: String, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1 },
    subtotal: { type: Number, required: true },
  },
  { _id: false }
);

const BookingWifiPassSchema = new Schema<IBookingWifiPass>(
  {
    name: { type: String, required: true },
    duration: { type: String, required: true },
    price: { type: Number, required: true },
  },
  { _id: false }
);

const BookingSchema: Schema<IBooking> = new Schema(
  {
    bookingId: { type: String, required: true, unique: true, index: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: false },
    fullName: { type: String, required: true, trim: true },
    mobile: { type: String, required: true, trim: true },
    email: { type: String, trim: true },
    seatType: { type: String, required: true },
    seatNumber: { type: String, default: "Flexible Desk" },
    date: { type: String, required: true },
    arrivalTime: { type: String, required: true },
    departureTime: { type: String, default: "2 Hours" },
    people: { type: String, required: true },
    wifiPassCode: { type: String, default: "" },
    purpose: { type: String, default: "Study" },
    specialRequests: { type: String, default: "" },
    // Menu items & pass breakdown
    menuItems: { type: [BookingMenuItemSchema], default: [] },
    wifiPass: { type: BookingWifiPassSchema, required: false },
    foodTotal: { type: Number, default: 0 },
    wifiTotal: { type: Number, default: 0 },
    bookingFee: { type: Number, default: 0 },
    grandTotal: { type: Number, required: true, default: 0 },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled", "rejected"],
      default: "confirmed",
    },
  },
  { timestamps: true }
);

const Booking: Model<IBooking> =
  mongoose.models.Booking || mongoose.model<IBooking>("Booking", BookingSchema);
export default Booking;
