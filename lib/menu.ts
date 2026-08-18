import { MenuItem } from "@/data/menuData";
import { supabase } from "@/lib/supabase";

export async function getMenuItems(): Promise<MenuItem[]> {
  const { data, error } = await supabase
    .from('menu_items')
    .select('*')
    .eq('is_available', true)
    .order('name', { ascending: true });

  if (error || !data) {
    console.error("Error fetching menu items:", error);
    return [];
  }

  return data.map((item: any) => ({
    id: item.item_code || item.id,
    name: item.name,
    price: item.price,
    priceFormatted: `₹${item.price}`,
    description: item.description,
    image: item.image_url || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c",
    category: item.category,
    filterType: item.filter_type || "Food",
    isVeg: item.is_vegetarian !== false,
    spiceLevel: item.spice_level || null,
    prepTime: item.prep_time || "10 mins",
    rating: item.rating || 4.5,
    reviewsCount: item.reviews_count || "0",
    isBestSeller: item.is_best_seller || false,
    isNew: item.is_new || false,
    isChefsSpecial: item.is_chefs_special || false,
    isSpecial: item.is_special || false,
    inStock: item.is_available !== false,
  }));
}