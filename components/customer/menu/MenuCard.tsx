"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Star, Clock, Heart, Flame, ShoppingBag, ArrowRight } from "lucide-react";
import { MenuItem } from "@/data/menuData";
import { useBooking } from "@/context/BookingContext";
import { isAuthenticated } from "@/lib/auth";

interface MenuCardProps {
  item: MenuItem;
}

export default function MenuCard({ item }: MenuCardProps) {
  const router = useRouter();
  const [isLiked, setIsLiked] = useState(false);
  const { bookingItems, addMenuItem } = useBooking();

  const isAlreadyInBooking = bookingItems.some(
    (b) => b.id === item.id || b.name === item.name
  );

  const handleClick = () => {
    if (isAlreadyInBooking) {
      if (!isAuthenticated()) {
        const msg = encodeURIComponent("Please login to your RoyalCafeConnect account to book a workspace.");
        router.push(`/login?redirect=/book&message=${msg}`);
      } else {
        router.push("/book");
      }
    } else {
      addMenuItem({
        id: item.id,
        name: item.name,
        category: item.category,
        price: item.price,
        image: item.image,
      });
    }
  };

  return (
    <div className="bg-surface rounded-[24px] border border-primary/20 overflow-hidden shadow-sm hover:-translate-y-1 hover:shadow-xl transition-all duration-300 flex flex-col justify-between text-left h-full group">
      
      {/* Top Image Area */}
      <div className="relative h-56 w-full overflow-hidden bg-background">
        <Image
          src={item.image}
          alt={item.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />

        {/* Top-Left Badge (Status/Tag: Available / Best Seller / Chef's Special / New) */}
        <div className="absolute top-4 left-4 flex flex-wrap gap-1.5 z-10">
          <span className="bg-primary text-background text-[10px] font-bold uppercase px-3 py-1.5 rounded-full shadow-sm tracking-widest">
            {item.isBestSeller ? "BEST SELLER" : item.isChefsSpecial ? "CHEF SPECIAL" : item.isNew ? "NEW" : "AVAILABLE"}
          </span>
        </div>

        {/* Top-Right Price Badge */}
        <div className="absolute top-4 right-4 bg-background text-primary text-[11px] font-bold px-3 py-1.5 rounded-full shadow-sm tracking-wider">
          {item.priceFormatted}
        </div>

        {/* Floating Like Heart Button Bottom Right on Image */}
        <button
          onClick={() => setIsLiked(!isLiked)}
          className="absolute bottom-4 right-4 h-9 w-9 rounded-full bg-background hover:bg-primary flex items-center justify-center shadow-sm cursor-pointer group/fav transition-colors duration-300 z-10"
          aria-label={isLiked ? "Unlike item" : "Like item"}
        >
          <Heart
            className={`h-4 w-4 transition-colors ${
              isLiked ? "fill-primary text-primary" : "text-primary group-hover/fav:text-background"
            }`}
          />
        </button>

        {/* Veg / Non-Veg Indicator Badge Bottom Left on Image */}
        <div className="absolute bottom-4 left-4 bg-background/90 backdrop-blur-md px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-sm text-[10px] font-bold tracking-wider text-primary border border-primary/10">
          <span
            className={`h-2 w-2 rounded-full ${
              item.isVeg ? "bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.5)]" : "bg-rose-500 shadow-[0_0_6px_rgba(244,63,94,0.5)]"
            }`}
          />
          <span className="text-[9px] tracking-widest font-semibold">{item.isVeg ? "VEG" : "NON-VEG"}</span>
        </div>
      </div>

      {/* Details Area */}
      <div className="p-6 space-y-4 flex-1 flex flex-col justify-between text-left">
        <div>
          {/* Category & Attributes Tagline */}
          <div className="text-[11px] font-bold text-foreground/80 uppercase tracking-widest mb-1.5">
            {item.category.toUpperCase()} • {item.spiceLevel ? item.spiceLevel.toUpperCase() : "FRESH"}
          </div>

          {/* Title */}
          <h3 className="font-bold text-2xl text-foreground font-serif leading-snug mb-2 line-clamp-1">
            {item.name}
          </h3>

          {/* Description */}
          <p className="text-xs sm:text-sm text-foreground/75 font-normal leading-relaxed line-clamp-2 mb-3">
            {item.description}
          </p>

          {/* Availability / Status Message */}
          <p className="text-xs font-semibold text-foreground flex items-center gap-1.5 mt-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500 inline-block shrink-0" />
            <span>Freshly prepared upon order</span>
          </p>

          {/* Preparation Time & Rating */}
          <div className="flex items-center justify-between text-xs text-foreground/75 font-semibold mt-2.5 pt-2 border-t border-foreground/10">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-foreground/60" /> {item.prepTime}
            </span>
            <span className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-primary text-primary" />
              <span className="font-bold text-foreground">{item.rating}</span>
              <span className="text-foreground/60 font-normal">({item.reviewsCount})</span>
            </span>
          </div>
        </div>

        {/* Reserve / Add Button (Pill Button Matching Live Status) */}
        <button
          type="button"
          onClick={handleClick}
          className={`w-full mt-4 py-3.5 px-4 font-bold text-sm rounded-full transition-all duration-300 shadow-md flex items-center justify-center gap-2 uppercase tracking-widest cursor-pointer hover:-translate-y-0.5 ${
            isAlreadyInBooking
              ? "bg-background text-primary border border-primary hover:bg-primary hover:text-background"
              : "bg-primary text-background hover:bg-background hover:text-primary hover:border hover:border-primary border border-transparent"
          }`}
        >
          {isAlreadyInBooking ? (
            <>
              Go to Bookings <ArrowRight className="w-4 h-4" />
            </>
          ) : (
            <>
              Include in Booking <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>

    </div>
  );
}
