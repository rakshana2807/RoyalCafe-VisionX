import mongoose, { Schema, Document, Model } from "mongoose";

export interface IMenu extends Document {
  category: string;
  itemName: string;
  description: string;
  image: string;
  price: number;
  available: boolean;
  isBestSeller?: boolean;
  isChefsSpecial?: boolean;
  rating?: number;
  reviewsCount?: string;
  createdAt: Date;
}

const MenuSchema: Schema<IMenu> = new Schema(
  {
    category: { type: String, required: true, trim: true },
    itemName: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    image: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    available: { type: Boolean, default: true },
    isBestSeller: { type: Boolean, default: false },
    isChefsSpecial: { type: Boolean, default: false },
    rating: { type: Number, default: 4.8 },
    reviewsCount: { type: String, default: "24 reviews" },
  },
  { timestamps: true }
);

const Menu: Model<IMenu> = mongoose.models.Menu || mongoose.model<IMenu>("Menu", MenuSchema);
export default Menu;
