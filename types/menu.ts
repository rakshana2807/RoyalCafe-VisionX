export interface MenuItem {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  image: string;
  rating?: number;
  reviewsCount?: number;
  prepTime?: string;
  dietary?: "veg" | "non-veg";
  tags?: string[];
  isPopular?: boolean;
}
