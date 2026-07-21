import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Booking from "@/models/Booking";
import Workspace from "@/models/Workspace";
import { getAuthUser } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();

    const authUser = getAuthUser(req);
    let bookings;

    if (authUser && authUser.role === "admin") {
      bookings = await Booking.find({}).sort({ createdAt: -1 });
    } else if (authUser) {
      bookings = await Booking.find({ userId: authUser.id }).sort({ createdAt: -1 });
    } else {
      bookings = await Booking.find({}).sort({ createdAt: -1 }).limit(20);
    }

    return NextResponse.json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    console.error("GET Bookings Error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch bookings" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      fullName,
      mobile,
      email,
      seatType,
      seatNumber,
      date,
      arrivalTime,
      duration,
      guests,
      purpose,
      specialRequests,
      amount,
      // New cart fields
      menuItems,
      wifiPass,
      foodTotal,
      wifiTotal,
      bookingFee,
      grandTotal,
    } = body;

    if (!fullName || !mobile || !seatType || !date || !arrivalTime) {
      return NextResponse.json(
        { success: false, message: "Missing required booking fields" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Generate unique Booking ID (RCC-YYYYMMDD-XXXX)
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const randomSeq = Math.floor(1000 + Math.random() * 9000);
    const bookingId = `RCC-${dateStr}-${randomSeq}`;

    // WiFi password generation
    const wifiPassCode = `ROYAL-WIFI-${Math.floor(1000 + Math.random() * 9000)}`;

    const authUser = getAuthUser(req);

    // Build sanitized menu items with subtotals
    const sanitizedMenuItems = Array.isArray(menuItems)
      ? menuItems.map((item: { id?: string; itemId?: string; name: string; price: number; quantity: number }) => ({
          itemId: item.id || item.itemId || "",
          name: item.name,
          price: Number(item.price),
          quantity: Number(item.quantity),
          subtotal: Number(item.price) * Number(item.quantity),
        }))
      : [];

    // Derive totals from cart data or fallback to passed amounts
    const computedFoodTotal = sanitizedMenuItems.reduce(
      (sum: number, i: { subtotal: number }) => sum + i.subtotal,
      0
    );
    const computedWifiTotal = wifiPass?.price ? Number(wifiPass.price) : 0;
    const computedBookingFee = bookingFee ?? Number(amount) ?? 350;
    const computedGrandTotal =
      grandTotal ??
      computedFoodTotal + computedWifiTotal + computedBookingFee;

    const newBooking = await Booking.create({
      bookingId,
      userId: authUser?.id ? authUser.id : undefined,
      fullName,
      mobile,
      email,
      seatType: seatType || "Study Workspace",
      seatNumber: seatNumber || "Flexible Desk",
      date,
      arrivalTime,
      departureTime: duration || "2 Hours",
      people: guests || "1 Person",
      wifiPassCode,
      purpose: purpose || "Study",
      specialRequests: specialRequests || "",
      // Detailed cart breakdown
      menuItems: sanitizedMenuItems,
      wifiPass: wifiPass
        ? {
            name: wifiPass.name,
            duration: wifiPass.duration,
            price: Number(wifiPass.price),
          }
        : undefined,
      foodTotal: foodTotal ?? computedFoodTotal,
      wifiTotal: wifiTotal ?? computedWifiTotal,
      bookingFee: computedBookingFee,
      grandTotal: computedGrandTotal,
      status: "confirmed",
    });

    // Update seat status if a specific seat was selected
    if (seatNumber && seatNumber !== "Flexible Desk") {
      await Workspace.findOneAndUpdate(
        { seatNumber },
        { status: "reserved", updatedAt: new Date() }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Booking created successfully",
        booking: newBooking,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST Booking Error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to process booking" },
      { status: 500 }
    );
  }
}
