import { supabase } from "./supabase";

export async function getMenuItems() {
  const { data, error } = await supabase
    .from("menu_items")
    .select("*")
    .eq("is_available", true)
    .order("category")
    .order("name");

  if (error) {
    console.error("Error fetching menu:", error);
    throw error;
  }

  return (data ?? []).map((item) => ({
    id: item.item_code ?? item.id,
    name: item.name,
    price: Number(item.price),
    priceFormatted: item.price_formatted ?? `₹${item.price}`,
    description: item.description ?? "",
    image: item.image_url ?? "",
    category: item.category,
    filterType: item.filter_type,
    isVeg: item.is_vegetarian,
    spiceLevel: item.spice_level,
    prepTime: item.prep_time ?? "",
    rating: Number(item.rating ?? 0),
    reviewsCount: item.reviews_count ?? "0",
    isBestSeller: item.is_best_seller ?? false,
    isNew: item.is_new ?? false,
    isChefsSpecial: item.is_chefs_special ?? false,
    isSpecial: item.is_special ?? false,
    inStock: item.is_available ?? true,
  }));
}