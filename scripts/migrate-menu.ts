import { createClient } from '@supabase/supabase-js';
import { MENU_ITEMS, MenuItem } from "../data/menuData";
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function migrateMenu() {
  console.log(`Found ${MENU_ITEMS.length} menu items.`);

  const rows = MENU_ITEMS.map((item) => ({
    item_code: item.id,
    name: item.name,
    price: item.price,
    price_formatted: item.priceFormatted,
    description: item.description,
    image_url: item.image,
    category: item.category,
    filter_type: item.filterType,
    is_vegetarian: item.isVeg,
    spice_level: item.spiceLevel ?? null,
    prep_time: item.prepTime,
    rating: item.rating,
    reviews_count: item.reviewsCount,
    is_best_seller: item.isBestSeller ?? false,
    is_new: item.isNew ?? false,
    is_chefs_special: item.isChefsSpecial ?? false,
    is_special: item.isSpecial ?? false,
    is_available: item.inStock ?? true,
  }));

  const { data, error } = await supabase
    .from('menu_items')
    .upsert(rows, {
      onConflict: 'item_code',
    })
    .select();

  if (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }

  console.log(`✅ Successfully migrated ${data.length} menu items.`);
}

migrateMenu();