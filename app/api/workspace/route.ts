import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Workspace from "@/models/Workspace";
import { getAuthUser } from "@/lib/auth";

const DEFAULT_SEATS = [
  { seatNumber: "Desk #01", seatType: "Study Desk", zone: "Quiet Study Zone", status: "available" },
  { seatNumber: "Desk #02", seatType: "Study Desk", zone: "Quiet Study Zone", status: "occupied" },
  { seatNumber: "Desk #03", seatType: "Study Desk", zone: "Quiet Study Zone", status: "available" },
  { seatNumber: "Desk #04", seatType: "Study Desk", zone: "Quiet Study Zone", status: "reserved" },
  { seatNumber: "Desk #05", seatType: "Study Desk", zone: "Quiet Study Zone", status: "available" },
  { seatNumber: "Desk #06", seatType: "Study Desk", zone: "Quiet Study Zone", status: "available" },
  { seatNumber: "Pod #01", seatType: "Focus Pod", zone: "Focus Pods", status: "occupied" },
  { seatNumber: "Pod #02", seatType: "Focus Pod", zone: "Focus Pods", status: "available" },
  { seatNumber: "Pod #03", seatType: "Focus Pod", zone: "Focus Pods", status: "reserved" },
  { seatNumber: "Booth #01", seatType: "Meeting Booth", zone: "Meeting Booths", status: "available" },
  { seatNumber: "Booth #02", seatType: "Meeting Booth", zone: "Meeting Booths", status: "occupied" },
  { seatNumber: "Terrace #01", seatType: "Outdoor Table", zone: "Outdoor Terrace", status: "available" },
];

export async function GET() {
  try {
    await connectToDatabase();

    let seats = await Workspace.find({});

    // Seed default seats if workspace collection is empty
    if (seats.length === 0) {
      await Workspace.insertMany(DEFAULT_SEATS);
      seats = await Workspace.find({});
    }

    const counts = {
      total: seats.length,
      available: seats.filter((s) => s.status === "available").length,
      reserved: seats.filter((s) => s.status === "reserved").length,
      occupied: seats.filter((s) => s.status === "occupied").length,
    };

    return NextResponse.json({
      success: true,
      counts,
      seats,
    });
  } catch (error) {
    console.error("GET Workspace Error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch seat status" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const authUser = getAuthUser(req);
    if (!authUser || authUser.role !== "admin") {
      return NextResponse.json(
        { success: false, message: "Admin authorization required" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { seatNumber, status } = body;

    if (!seatNumber || !["available", "reserved", "occupied"].includes(status)) {
      return NextResponse.json(
        { success: false, message: "Invalid seat number or status" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const updatedSeat = await Workspace.findOneAndUpdate(
      { seatNumber },
      { status, updatedAt: new Date() },
      { new: true, upsert: true }
    );

    return NextResponse.json({
      success: true,
      message: `Seat ${seatNumber} status updated to ${status}`,
      seat: updatedSeat,
    });
  } catch (error) {
    console.error("PATCH Workspace Error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update seat status" },
      { status: 500 }
    );
  }
}
