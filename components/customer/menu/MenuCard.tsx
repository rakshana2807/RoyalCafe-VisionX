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
    <div className="bg-surface rounded-[24px] overflow-hidden card-shadow border border-primary/20 flex flex-col justify-between text-left h-full relative group transition-all duration-400 hover:-translate-y-2 hover:shadow-2xl">
      
      {/* Top Image Area */}
      <div className="relative h-[200px] w-full overflow-hidden">
        <Image
          src={item.image}
          alt={item.name}
          fill
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          sizes="(max-w-768px) 100vw, (max-w-1024px) 50vw, 25vw"
        />
        
        {/* Top Badges (Best Seller, New, Chef's Special) */}
        <div className="absolute top-4 left-4 flex flex-wrap gap-2 z-10">
          {item.isBestSeller && (
            <span className="bg-primary text-background text-[9px] font-semibold px-3 py-1 rounded-full uppercase tracking-widest shadow-sm">
              Best Seller
            </span>
          )}
          {item.isNew && (
            <span className="bg-accent text-primary text-[9px] font-semibold px-3 py-1 rounded-full uppercase tracking-widest shadow-sm">
              New
            </span>
          )}
          {item.isChefsSpecial && (
            <span className="bg-primary text-background text-[9px] font-semibold px-3 py-1 rounded-full uppercase tracking-widest shadow-sm">
              Chef&apos;s Special
            </span>
          )}
        </div>

        {/* Floating Like Heart Button */}
        <button
          onClick={() => setIsLiked(!isLiked)}
          className="absolute top-4 right-4 h-9 w-9 rounded-full bg-surface/90 hover:bg-surface flex items-center justify-center shadow-sm cursor-pointer hover:scale-110 active:scale-95 transition-all z-10"
          aria-label={isLiked ? "Unlike item" : "Like item"}
        >
          <Heart
            className={`h-4 w-4 transition-colors ${
              isLiked ? "fill-primary text-primary" : "text-primary"
            }`}
          />
        </button>

        {/* Veg / Non-Veg Indicator Dot Overlay */}
        <div className="absolute bottom-4 left-4 bg-surface/95 backdrop-blur-sm px-2.5 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm text-[9px] font-semibold tracking-wider text-primary">
          <span
            className={`h-2.5 w-2.5 rounded-full flex items-center justify-center ${
              item.isVeg ? "bg-emerald-600" : "bg-rose-600"
            }`}
          />
          <span>{item.isVeg ? "VEG" : "NON-VEG"}</span>
        </div>

        {item.spiceLevel && (
          <div className="absolute bottom-4 right-4 bg-background/95 backdrop-blur-sm text-primary px-3 py-1.5 rounded-full flex items-center gap-1.5 text-[9px] font-bold tracking-widest uppercase shadow-sm">
            <Flame className="h-3 w-3 text-primary fill-primary" />
            <span>{item.spiceLevel}</span>
          </div>
        )}
      </div>

      {/* Details Area */}
      <div className="p-6 flex flex-col flex-1 justify-between">
        <div>
          {/* Header Row: Title & Price */}
          <div className="flex justify-between items-start gap-4 mb-3">
            <h3 className="text-xl sm:text-[22px] font-bold font-serif text-foreground leading-tight">
              {item.name}
            </h3>
            <span className="text-xl font-extrabold text-foreground shrink-0 mt-0.5">
              {item.priceFormatted}
            </span>
          </div>

          {/* Description */}
          <p className="text-sm text-foreground/80 font-medium leading-relaxed mb-6 line-clamp-2">
            {item.description}
          </p>
        </div>

        {/* Card Footer: Metadata and Action Button */}
        <div>
          {/* Metadata Row: Prep time and Rating */}
          <div className="flex justify-between items-center text-xs text-foreground/90 font-bold mb-6 pt-5 border-t border-primary/20">
            <span className="flex items-center gap-1.5 text-[11px] uppercase tracking-widest">
              <Clock className="h-4 w-4 text-foreground stroke-[2]" />
              {item.prepTime}
            </span>
            <span className="flex items-center gap-1 text-[11px] tracking-wider">
              <Star className="h-4 w-4 fill-foreground text-foreground" />
              <span className="text-foreground">{item.rating}</span>
              <span className="text-foreground/70">({item.reviewsCount})</span>
            </span>
          </div>

          {/* Action Button */}
          <button
            onClick={handleClick}
            className={`w-full py-3.5 px-4 text-xs font-bold rounded-full transition-all duration-300 shadow-md cursor-pointer uppercase tracking-widest text-center flex items-center justify-center gap-2 group-hover:-translate-y-1 ${
              isAlreadyInBooking
                ? "bg-foreground text-background border border-foreground hover:bg-foreground/90"
                : "bg-primary text-background border border-primary hover:bg-background hover:text-primary hover:border-primary"
            }`}
          >
            {isAlreadyInBooking ? (
              <>
                <ArrowRight className="h-4 w-4" />
                Go to Bookings
              </>
            ) : (
              <>
                <ShoppingBag className="h-4 w-4" />
                Include in Booking
              </>
            )}
          </button>
        </div>
      </div>

    </div>
  );
}
