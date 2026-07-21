import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import connectToDatabase from "@/lib/mongodb";
import User from "@/models/User";
import { hashPassword, signToken } from "@/lib/auth";

const registerSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(7, "Invalid phone number"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export async function POST(req: NextRequest) {
  try {
    // 1. Environment Verification
    if (!process.env.MONGODB_URI) {
      const err = new Error("MONGODB_URI is not defined in environment variables (.env.local)");
      console.error("Register Error:", err);
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
      console.error("Register Error:", err);
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
    const validation = registerSchema.safeParse(body);

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

    const { fullName, email, phone, password } = validation.data;

    // 3. Connect to MongoDB Atlas
    await connectToDatabase();

    // 4. Email Uniqueness Check in Atlas
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: "An account with this email address already exists" },
        { status: 400 }
      );
    }

    // 5. Password Hashing
    const hashedPassword = await hashPassword(password);

    // 6. User Creation in MongoDB Atlas
    const newUser = await User.create({
      name: fullName,
      email: email.toLowerCase(),
      phone,
      password: hashedPassword,
      role: "customer",
    });

    const userIdStr = String(newUser._id);

    // 7. Sign JWT Token
    const token = signToken({
      id: userIdStr,
      email: newUser.email,
      name: newUser.name,
      role: newUser.role,
    });

    const response = NextResponse.json({
      success: true,
      message: "User registered successfully in MongoDB Atlas",
      database: "royalcafe",
      collection: "users",
      user: {
        id: userIdStr,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        role: newUser.role,
      },
      token,
    });

    // 8. Set HTTP-only Cookie
    response.cookies.set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60,
      path: "/",
    });

    return response;
  } catch (error: any) {
    console.error("Register Error:", error);
    return NextResponse.json(
      {
        success: false,
        message: error?.message || "Internal server error during registration",
        stack: process.env.NODE_ENV !== "production" ? error?.stack : undefined,
      },
      { status: 500 }
    );
  }
}
