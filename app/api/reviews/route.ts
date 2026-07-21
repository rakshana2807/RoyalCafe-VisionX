import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Review from "@/models/Review";
import { getAuthUser } from "@/lib/auth";

const DEFAULT_REVIEWS = [
  {
    fullName: "Sarah Jenkins",
    email: "sarah.j@example.com",
    rating: 5,
    reviewTitle: "Best co-working cafe for deep focus!",
    comment: "The fiber WiFi speed is incredible (over 950 Mbps!), and the seat ergonomics in the quiet study zone made my 6-hour work sprint effortless. Highly recommended!",
    visitDate: "2026-07-15",
    purpose: "Remote Work",
    status: "approved",
  },
  {
    fullName: "David Chen",
    email: "david.c@example.com",
    rating: 5,
    reviewTitle: "Outstanding Signature Cold Brew & Ambient Lighting",
    comment: "Royal Signature Brew is easily top tier in the city. The staff is warm and attentive, and desk power sockets everywhere mean zero battery anxiety.",
    visitDate: "2026-07-18",
    purpose: "Study Session",
    status: "approved",
  },
  {
    fullName: "Priya Sharma",
    email: "priya.s@example.com",
    rating: 5,
    reviewTitle: "Perfect for Team Collaborations",
    comment: "We booked the meeting booth for our startup sprint. Great acoustic isolation, great coffee, and super smooth booking experience!",
    visitDate: "2026-07-19",
    purpose: "Team Meeting",
    status: "approved",
  },
];

export async function GET() {
  try {
    await connectToDatabase();

    let reviews = await Review.find({ status: "approved" }).sort({ createdAt: -1 });

    // Seed default reviews if empty
    if (reviews.length === 0) {
      await Review.insertMany(DEFAULT_REVIEWS);
      reviews = await Review.find({ status: "approved" }).sort({ createdAt: -1 });
    }

    return NextResponse.json({
      success: true,
      count: reviews.length,
      reviews,
    });
  } catch (error) {
    console.error("GET Reviews Error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch reviews" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { fullName, email, rating, reviewTitle, comment, visitDate, purpose } = body;

    if (!fullName || !email || !rating || !comment) {
      return NextResponse.json(
        { success: false, message: "Missing required review fields" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const authUser = getAuthUser(req);

    const newReview = await Review.create({
      userId: authUser?.id ? authUser.id : undefined,
      fullName,
      email,
      rating: Number(rating),
      reviewTitle: reviewTitle || "Great Cafe Experience",
      comment,
      visitDate: visitDate || new Date().toISOString().slice(0, 10),
      purpose: purpose || "Work",
      status: "approved",
    });

    return NextResponse.json(
      {
        success: true,
        message: "Review submitted successfully",
        review: newReview,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST Review Error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to submit review" },
      { status: 500 }
    );
  }
}
