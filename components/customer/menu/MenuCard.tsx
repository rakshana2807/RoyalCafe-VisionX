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
    <div className="royal-glass-card overflow-hidden flex flex-col justify-between text-left h-full relative group">
      
      {/* Top Image Area */}
      <div className="relative h-[210px] w-full overflow-hidden rounded-t-[19px]">
        <Image
          src={item.image}
          alt={item.name}
          fill
          className="object-cover"
          sizes="(max-w-768px) 100vw, (max-w-1024px) 50vw, 25vw"
        />
        
        {/* Subtle glass gradient overlay over the image base */}
        <div className="absolute inset-0 bg-gradient-to-t from-[rgba(61,17,24,0.7)] via-transparent to-black/20 pointer-events-none" />

        {/* Top Badges (Best Seller, New, Chef's Special) */}
        <div className="absolute top-3.5 left-3.5 flex flex-wrap gap-1.5 z-10">
          {item.isBestSeller && (
            <span className="bg-[#E5CB90] text-[#561C24] text-[9px] font-bold px-2.5 py-1 rounded-full uppercase tracking-widest shadow-md">
              Best Seller
            </span>
          )}
          {item.isNew && (
            <span className="bg-[#FFF8E9] text-[#561C24] text-[9px] font-bold px-2.5 py-1 rounded-full uppercase tracking-widest shadow-md">
              New
            </span>
          )}
          {item.isChefsSpecial && (
            <span className="bg-[rgba(61,17,24,0.85)] text-[#E5CB90] border border-[#E5CB90]/40 text-[9px] font-bold px-2.5 py-1 rounded-full uppercase tracking-widest shadow-md backdrop-blur-sm">
              Chef&apos;s Special
            </span>
          )}
        </div>

        {/* Floating Like Heart Button */}
        <button
          onClick={() => setIsLiked(!isLiked)}
          className="absolute top-3.5 right-3.5 h-8 w-8 rounded-full bg-[rgba(61,17,24,0.65)] hover:bg-[rgba(61,17,24,0.9)] backdrop-blur-md border border-[rgba(229,203,144,0.3)] flex items-center justify-center shadow-md cursor-pointer hover:scale-110 active:scale-95 transition-all z-10"
          aria-label={isLiked ? "Unlike item" : "Like item"}
        >
          <Heart
            className={`h-4 w-4 transition-colors ${
              isLiked ? "fill-[#E5CB90] text-[#E5CB90]" : "text-[#FFF8E9]/80 hover:text-[#E5CB90]"
            }`}
          />
        </button>

        {/* Veg / Non-Veg Indicator Dot Overlay */}
        <div className="absolute bottom-3 left-3.5 bg-[rgba(61,17,24,0.75)] backdrop-blur-md px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-sm text-[9px] font-bold tracking-wider text-[#FFF8E9] border border-[rgba(229,203,144,0.2)]">
          <span
            className={`h-2 w-2 rounded-full ${
              item.isVeg ? "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]" : "bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.6)]"
            }`}
          />
          <span className="text-[9px] tracking-widest font-semibold">{item.isVeg ? "VEG" : "NON-VEG"}</span>
        </div>

        {item.spiceLevel && (
          <div className="absolute bottom-3 right-3.5 bg-[rgba(61,17,24,0.75)] backdrop-blur-md text-[#E5CB90] px-2.5 py-1 rounded-full flex items-center gap-1.5 text-[9px] font-bold tracking-widest uppercase shadow-sm border border-[rgba(229,203,144,0.2)]">
            <Flame className="h-3 w-3 text-[#E5CB90] fill-[#E5CB90]" />
            <span>{item.spiceLevel}</span>
          </div>
        )}
      </div>

      {/* Details Area */}
      <div className="p-5 sm:p-6 flex flex-col flex-1 justify-between">
        <div>
          {/* Category label */}
          <div className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#E5CB90] mb-1.5">
            {item.category}
          </div>

          {/* Header Row: Title & Price */}
          <div className="flex justify-between items-start gap-3 mb-2.5">
            <h3 className="text-lg sm:text-xl font-bold font-serif text-[#FFF8E9] leading-snug tracking-tight">
              {item.name}
            </h3>
            <span className="text-lg sm:text-xl font-extrabold text-[#E5CB90] shrink-0 mt-0.5 tracking-tight">
              {item.priceFormatted}
            </span>
          </div>

          {/* Description */}
          <p className="text-xs sm:text-sm text-[#FFF8E9]/75 font-normal leading-relaxed mb-5 line-clamp-2">
            {item.description}
          </p>
        </div>

        {/* Card Footer: Metadata and Action Button */}
        <div>
          {/* Metadata Row: Prep time and Rating */}
          <div className="flex justify-between items-center text-xs text-[#FFF8E9]/80 font-medium mb-5 pt-4 border-t border-[rgba(229,203,144,0.18)]">
            <span className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-[#FFF8E9]/70">
              <Clock className="h-3.5 w-3.5 text-[#E5CB90]" />
              {item.prepTime}
            </span>
            <span className="flex items-center gap-1 text-[11px] tracking-wider text-[#FFF8E9]/85">
              <Star className="h-3.5 w-3.5 fill-[#E5CB90] text-[#E5CB90]" />
              <span className="font-bold text-[#FFF8E9]">{item.rating}</span>
              <span className="text-[#FFF8E9]/60">({item.reviewsCount})</span>
            </span>
          </div>

          {/* Action Button */}
          <button
            onClick={handleClick}
            className={`w-full py-3 px-4 text-xs font-bold rounded-full transition-all duration-300 shadow-md cursor-pointer uppercase tracking-widest text-center flex items-center justify-center gap-2 hover:-translate-y-0.5 active:scale-[0.99] ${
              isAlreadyInBooking
                ? "bg-[#FFF8E9] text-[#561C24] border border-[#FFF8E9] hover:bg-white shadow-[0_4px_16px_rgba(255,248,233,0.2)]"
                : "bg-[#E5CB90] text-[#561C24] hover:bg-[#edd8a4] border border-[#E5CB90] shadow-[0_4px_16px_rgba(229,203,144,0.3)] hover:shadow-[0_6px_20px_rgba(229,203,144,0.45)]"
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
