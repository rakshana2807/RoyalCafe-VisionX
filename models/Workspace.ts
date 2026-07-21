import mongoose, { Schema, Document, Model } from "mongoose";

export interface IWorkspace extends Document {
  seatNumber: string;
  seatType: string;
  zone: string;
  status: "available" | "reserved" | "occupied";
  powerOutlet: boolean;
  updatedAt: Date;
}

const WorkspaceSchema: Schema<IWorkspace> = new Schema(
  {
    seatNumber: { type: String, required: true, unique: true, index: true },
    seatType: { type: String, required: true },
    zone: { type: String, required: true },
    status: {
      type: String,
      enum: ["available", "reserved", "occupied"],
      default: "available",
    },
    powerOutlet: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Workspace: Model<IWorkspace> =
  mongoose.models.Workspace || mongoose.model<IWorkspace>("Workspace", WorkspaceSchema);
export default Workspace;
