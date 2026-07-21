import mongoose, { Schema, Document, Model } from "mongoose";

export interface IReview extends Document {
  userId?: mongoose.Types.ObjectId;
  fullName: string;
  email: string;
  rating: number;
  reviewTitle?: string;
  comment: string;
  visitDate?: string;
  purpose?: string;
  status: "pending" | "approved" | "rejected";
  createdAt: Date;
}

const ReviewSchema: Schema<IReview> = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: false },
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    reviewTitle: { type: String, default: "Great Cafe Experience" },
    comment: { type: String, required: true, trim: true },
    visitDate: { type: String, default: "" },
    purpose: { type: String, default: "Work" },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "approved",
    },
  },
  { timestamps: true }
);

const Review: Model<IReview> = mongoose.models.Review || mongoose.model<IReview>("Review", ReviewSchema);
export default Review;
