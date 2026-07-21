import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import User from "@/models/User";
import Booking from "@/models/Booking";
import Order from "@/models/Order";
import Workspace from "@/models/Workspace";
import { getAuthUser } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const authUser = getAuthUser(req);
    if (!authUser || authUser.role !== "admin") {
      return NextResponse.json(
        { success: false, message: "Admin authorization required" },
        { status: 403 }
      );
    }

    await connectToDatabase();

    const [totalCustomers, totalBookings, totalOrders, seats] = await Promise.all([
      User.countDocuments({ role: "customer" }),
      Booking.countDocuments({}),
      Order.countDocuments({}),
      Workspace.find({}),
    ]);

    // Calculate revenue
    const bookings = await Booking.find({ status: { $ne: "cancelled" } });
    const bookingRevenue = bookings.reduce((sum, b) => sum + (b.grandTotal || 0), 0);

    const orders = await Order.find({ paymentStatus: "paid" });
    const orderRevenue = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);

    const totalSeats = seats.length || 1;
    const occupiedSeats = seats.filter((s) => s.status === "occupied" || s.status === "reserved").length;
    const occupancyRate = Math.round((occupiedSeats / totalSeats) * 100);

    return NextResponse.json({
      success: true,
      stats: {
        totalCustomers,
        totalBookings,
        totalOrders,
        bookingRevenue,
        orderRevenue,
        totalRevenue: bookingRevenue + orderRevenue,
        occupancyRate,
        totalSeats,
        occupiedSeats,
      },
    });
  } catch (error) {
    console.error("GET Admin Stats Error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch admin stats" },
      { status: 500 }
    );
  }
}
