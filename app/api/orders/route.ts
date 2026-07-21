import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Order from "@/models/Order";
import { getAuthUser } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();

    const authUser = getAuthUser(req);
    let orders;

    if (authUser && authUser.role === "admin") {
      orders = await Order.find({}).sort({ createdAt: -1 });
    } else if (authUser) {
      orders = await Order.find({ userId: authUser.id }).sort({ createdAt: -1 });
    } else {
      orders = await Order.find({}).sort({ createdAt: -1 }).limit(20);
    }

    return NextResponse.json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    console.error("GET Orders Error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { customerName, customerPhone, orderedItems, totalAmount, bookingId } = body;

    if (!customerName || !orderedItems || orderedItems.length === 0 || !totalAmount) {
      return NextResponse.json(
        { success: false, message: "Missing required order information" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const randomSeq = Math.floor(1000 + Math.random() * 9000);
    const orderId = `ORD-${dateStr}-${randomSeq}`;

    const authUser = getAuthUser(req);

    const newOrder = await Order.create({
      orderId,
      userId: authUser?.id ? authUser.id : undefined,
      bookingId: bookingId || "",
      customerName,
      customerPhone: customerPhone || "",
      orderedItems,
      totalAmount: Number(totalAmount),
      paymentStatus: "paid",
      status: "received",
    });

    return NextResponse.json(
      {
        success: true,
        message: "Order placed successfully",
        order: newOrder,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST Order Error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to place order" },
      { status: 500 }
    );
  }
}
