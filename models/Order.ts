import mongoose, { Schema, Document, Model } from "mongoose";

export interface IOrderItem {
  menuItemId?: string;
  name: string;
  price: number;
  quantity: number;
}

export interface IOrder extends Document {
  orderId: string;
  userId?: mongoose.Types.ObjectId;
  bookingId?: string;
  customerName: string;
  customerPhone?: string;
  orderedItems: IOrderItem[];
  totalAmount: number;
  paymentStatus: "pending" | "paid" | "failed";
  status: "received" | "preparing" | "ready" | "served" | "completed";
  createdAt: Date;
}

const OrderSchema: Schema<IOrder> = new Schema(
  {
    orderId: { type: String, required: true, unique: true, index: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: false },
    bookingId: { type: String, required: false },
    customerName: { type: String, required: true },
    customerPhone: { type: String, required: false },
    orderedItems: [
      {
        menuItemId: { type: String },
        name: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true, default: 1 },
      },
    ],
    totalAmount: { type: Number, required: true },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "paid",
    },
    status: {
      type: String,
      enum: ["received", "preparing", "ready", "served", "completed"],
      default: "received",
    },
  },
  { timestamps: true }
);

const Order: Model<IOrder> = mongoose.models.Order || mongoose.model<IOrder>("Order", OrderSchema);
export default Order;
