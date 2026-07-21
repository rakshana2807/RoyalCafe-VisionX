import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Menu from "@/models/Menu";
import { MENU_ITEMS } from "@/data/menuData";
import { getAuthUser } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");

    let items = await Menu.find({});

    // Seed menu database if empty
    if (items.length === 0) {
      const seedData = MENU_ITEMS.map((item) => ({
        category: item.category,
        itemName: item.name,
        description: item.description,
        image: item.image,
        price: item.price,
        available: true,
        isBestSeller: item.isBestSeller || false,
        isChefsSpecial: item.isChefsSpecial || false,
        rating: item.rating || 4.8,
        reviewsCount: item.reviewsCount || "20+ reviews",
      }));

      await Menu.insertMany(seedData);
      items = await Menu.find({});
    }

    if (category && category !== "All" && category !== "All Categories") {
      items = items.filter(
        (i) => i.category.toLowerCase() === category.toLowerCase()
      );
    }

    return NextResponse.json({
      success: true,
      count: items.length,
      menu: items,
    });
  } catch (error) {
    console.error("GET Menu Error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch menu items" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const authUser = getAuthUser(req);
    if (!authUser || authUser.role !== "admin") {
      return NextResponse.json(
        { success: false, message: "Admin authorization required" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { category, itemName, description, image, price, available, isBestSeller, isChefsSpecial } = body;

    if (!category || !itemName || !description || price === undefined) {
      return NextResponse.json(
        { success: false, message: "Missing required menu item fields" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const newItem = await Menu.create({
      category,
      itemName,
      description,
      image: image || "/flat-white.png",
      price: Number(price),
      available: available !== undefined ? Boolean(available) : true,
      isBestSeller: Boolean(isBestSeller),
      isChefsSpecial: Boolean(isChefsSpecial),
    });

    return NextResponse.json(
      {
        success: true,
        message: "Menu item created successfully",
        menuItem: newItem,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST Menu Error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create menu item" },
      { status: 500 }
    );
  }
}
