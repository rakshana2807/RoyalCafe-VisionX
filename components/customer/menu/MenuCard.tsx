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
    <div className="bg-[#F5DAA7] text-[#320000] rounded-3xl overflow-hidden flex flex-col justify-between text-left h-full relative group shadow-xl border border-[rgba(245,218,167,0.4)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl">
      
      {/* Top Image Area */}
      <div className="relative h-[210px] w-full overflow-hidden rounded-t-[23px]">
        <Image
          src={item.image}
          alt={item.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          sizes="(max-w-768px) 100vw, (max-w-1024px) 50vw, 25vw"
        />
        
        {/* Subtle dark gradient overlay over image base */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#320000]/60 via-transparent to-black/20 pointer-events-none" />

        {/* Top Badges (Best Seller, New, Chef's Special) */}
        <div className="absolute top-3.5 left-3.5 flex flex-wrap gap-1.5 z-10">
          {item.isBestSeller && (
            <span className="bg-[#320000] text-[#F5DAA7] text-[9px] font-bold px-2.5 py-1 rounded-full uppercase tracking-widest shadow-md">
              Best Seller
            </span>
          )}
          {item.isNew && (
            <span className="bg-[#320000] text-[#F5DAA7] text-[9px] font-bold px-2.5 py-1 rounded-full uppercase tracking-widest shadow-md">
              New
            </span>
          )}
          {item.isChefsSpecial && (
            <span className="bg-[#320000]/90 text-[#F5DAA7] border border-[#F5DAA7]/40 text-[9px] font-bold px-2.5 py-1 rounded-full uppercase tracking-widest shadow-md backdrop-blur-sm">
              Chef&apos;s Special
            </span>
          )}
        </div>

        {/* Floating Like Heart Button */}
        <button
          onClick={() => setIsLiked(!isLiked)}
          className="absolute top-3.5 right-3.5 h-8 w-8 rounded-full bg-[#320000]/70 hover:bg-[#320000] backdrop-blur-md border border-[rgba(245,218,167,0.3)] flex items-center justify-center shadow-md cursor-pointer hover:scale-110 active:scale-95 transition-all z-10"
          aria-label={isLiked ? "Unlike item" : "Like item"}
        >
          <Heart
            className={`h-4 w-4 transition-colors ${
              isLiked ? "fill-[#F5DAA7] text-[#F5DAA7]" : "text-[#F5DAA7]/80 hover:text-[#F5DAA7]"
            }`}
          />
        </button>

        {/* Veg / Non-Veg Indicator Dot Overlay */}
        <div className="absolute bottom-3 left-3.5 bg-[#320000]/80 backdrop-blur-md px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-sm text-[9px] font-bold tracking-wider text-[#F5DAA7] border border-[rgba(245,218,167,0.25)]">
          <span
            className={`h-2 w-2 rounded-full ${
              item.isVeg ? "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]" : "bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.6)]"
            }`}
          />
          <span className="text-[9px] tracking-widest font-semibold">{item.isVeg ? "VEG" : "NON-VEG"}</span>
        </div>

        {item.spiceLevel && (
          <div className="absolute bottom-3 right-3.5 bg-[#320000]/80 backdrop-blur-md text-[#F5DAA7] px-2.5 py-1 rounded-full flex items-center gap-1.5 text-[9px] font-bold tracking-widest uppercase shadow-sm border border-[rgba(245,218,167,0.25)]">
            <Flame className="h-3 w-3 text-[#F5DAA7] fill-[#F5DAA7]" />
            <span>{item.spiceLevel}</span>
          </div>
        )}
      </div>

      {/* Details Area */}
      <div className="p-5 sm:p-6 flex flex-col flex-1 justify-between">
        <div>
          {/* Category label */}
          <div className="text-[10px] uppercase tracking-[0.2em] font-extrabold text-[#320000]/70 mb-1.5">
            {item.category}
          </div>

          {/* Header Row: Title & Price */}
          <div className="flex justify-between items-start gap-3 mb-2.5">
            <h3 className="text-lg sm:text-xl font-bold font-serif text-[#320000] leading-snug tracking-tight">
              {item.name}
            </h3>
            <span className="text-lg sm:text-xl font-black text-[#320000] shrink-0 mt-0.5 tracking-tight">
              {item.priceFormatted}
            </span>
          </div>

          {/* Description */}
          <p className="text-xs sm:text-sm text-[#320000]/80 font-medium leading-relaxed mb-5 line-clamp-2">
            {item.description}
          </p>
        </div>

        {/* Card Footer: Metadata and Action Button */}
        <div>
          {/* Metadata Row: Prep time and Rating */}
          <div className="flex justify-between items-center text-xs text-[#320000]/75 font-semibold mb-5 pt-4 border-t border-[#320000]/15">
            <span className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-[#320000]/70">
              <Clock className="h-3.5 w-3.5 text-[#320000]" />
              {item.prepTime}
            </span>
            <span className="flex items-center gap-1 text-[11px] tracking-wider text-[#320000]/85">
              <Star className="h-3.5 w-3.5 fill-[#320000] text-[#320000]" />
              <span className="font-bold text-[#320000]">{item.rating}</span>
              <span className="text-[#320000]/60">({item.reviewsCount})</span>
            </span>
          </div>

          {/* Action Button */}
          <button
            onClick={handleClick}
            className={`w-full py-3 px-4 text-xs font-bold rounded-full transition-all duration-300 shadow-md cursor-pointer uppercase tracking-widest text-center flex items-center justify-center gap-2 hover:-translate-y-0.5 active:scale-[0.99] ${
              isAlreadyInBooking
                ? "bg-[#320000] text-[#F5DAA7] border border-[#320000] hover:bg-black"
                : "bg-[#320000] text-[#F5DAA7] hover:bg-black border border-[#320000] shadow-[0_4px_16px_rgba(50,0,0,0.25)] hover:shadow-[0_6px_20px_rgba(50,0,0,0.4)]"
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
