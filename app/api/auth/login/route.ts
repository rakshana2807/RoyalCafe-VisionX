import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import connectToDatabase from "@/lib/mongodb";
import User from "@/models/User";
import { comparePassword, signToken } from "@/lib/auth";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export async function POST(req: NextRequest) {
  try {
    // 1. Environment Verification
    if (!process.env.MONGODB_URI) {
      const err = new Error("MONGODB_URI is not defined in environment variables (.env.local)");
      console.error("Login Error:", err);
      return NextResponse.json(
        {
          success: false,
          message: err.message,
          stack: process.env.NODE_ENV !== "production" ? err.stack : undefined,
        },
        { status: 500 }
      );
    }

    if (!process.env.JWT_SECRET && !process.env.NEXTAUTH_SECRET) {
      const err = new Error("JWT_SECRET or NEXTAUTH_SECRET is missing in environment variables (.env.local)");
      console.error("Login Error:", err);
      return NextResponse.json(
        {
          success: false,
          message: err.message,
          stack: process.env.NODE_ENV !== "production" ? err.stack : undefined,
        },
        { status: 500 }
      );
    }

    // 2. Input Validation
    const body = await req.json();
    const validation = loginSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Validation failed",
          errors: validation.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { email, password } = validation.data;

    // 3. Connect to MongoDB Atlas
    await connectToDatabase();

    // 4. User Lookup in MongoDB Atlas
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Invalid email address or password" },
        { status: 401 }
      );
    }

    // 5. Password Comparison
    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return NextResponse.json(
        { success: false, message: "Invalid email address or password" },
        { status: 401 }
      );
    }

    const userIdStr = String(user._id);

    // 6. JWT Signing
    const token = signToken({
      id: userIdStr,
      email: user.email,
      name: user.name,
      role: user.role,
    });

    const response = NextResponse.json({
      success: true,
      message: "Logged in successfully from MongoDB Atlas",
      database: "royalcafe",
      collection: "users",
      user: {
        id: userIdStr,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
      token,
    });

    // 7. Cookie Creation
    response.cookies.set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60,
      path: "/",
    });

    return response;
  } catch (error: any) {
    console.error("Login Error:", error);
    return NextResponse.json(
      {
        success: false,
        message: error?.message || "Internal server error during login",
        stack: process.env.NODE_ENV !== "production" ? error?.stack : undefined,
      },
      { status: 500 }
    );
  }
}
