import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import User from "@/models/User";
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

    const customers = await User.find({ role: "customer" }).select("-password").sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      count: customers.length,
      customers,
    });
  } catch (error) {
    console.error("GET Admin Customers Error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch customer accounts" },
      { status: 500 }
    );
  }
}
