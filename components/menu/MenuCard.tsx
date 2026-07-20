"use client";

import { useState } from "react";
import Image from "next/image";
import { Star, Clock, Heart, Flame } from "lucide-react";
import { MenuItem } from "@/data/menuData";

interface MenuCardProps {
  item: MenuItem;
}

export default function MenuCard({ item }: MenuCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="bg-white rounded-2xl overflow-hidden card-shadow border border-primary/5 flex flex-col justify-between text-left card-shadow-hover h-full relative group">
      
      {/* Top Image Area */}
      <div className="relative h-[200px] w-full overflow-hidden">
        <Image
          src={item.image}
          alt={item.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-w-768px) 100vw, (max-w-1024px) 50vw, 25vw"
        />
        
        {/* Top Badges (Best Seller, New, Chef's Special) */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
          {item.isBestSeller && (
            <span className="bg-[#2A1506] text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm">
              Best Seller
            </span>
          )}
          {item.isNew && (
            <span className="bg-[#EA5A0C] text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm">
              New
            </span>
          )}
          {item.isChefsSpecial && (
            <span className="bg-[#D06B1C] text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm">
              Chef&apos;s Special
            </span>
          )}
        </div>

        {/* Floating Like Heart Button */}
        <button
          onClick={() => setIsLiked(!isLiked)}
          className="absolute top-3 right-3 h-8 w-8 rounded-full bg-white/90 hover:bg-white flex items-center justify-center shadow-sm cursor-pointer hover:scale-105 active:scale-95 transition-all z-10"
          aria-label={isLiked ? "Unlike item" : "Like item"}
        >
          <Heart
            className={`h-4 w-4 transition-colors ${
              isLiked ? "fill-rose-500 text-rose-500" : "text-foreground/60"
            }`}
          />
        </button>

        {/* Veg / Non-Veg Indicator Dot Overlay */}
        <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md flex items-center gap-1.5 shadow-sm text-[10px] font-bold text-primary">
          <span
            className={`h-2.5 w-2.5 rounded-full border border-white flex items-center justify-center ${
              item.isVeg ? "bg-emerald-600" : "bg-rose-600"
            }`}
          />
          <span>{item.isVeg ? "VEG" : "NON-VEG"}</span>
        </div>

        {/* Spice Level indicator if present */}
        {item.spiceLevel && (
          <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-sm text-white px-2 py-1 rounded-md flex items-center gap-1 text-[10px] font-bold">
            <Flame className="h-3 w-3 text-orange-400 fill-orange-400" />
            <span>{item.spiceLevel}</span>
          </div>
        )}
      </div>

      {/* Details Area */}
      <div className="p-5 flex flex-col flex-1 justify-between">
        <div>
          {/* Header Row: Title & Price */}
          <div className="flex justify-between items-start gap-2 mb-2">
            <h3 className="text-base font-bold font-serif text-primary leading-snug">
              {item.name}
            </h3>
            <span className="text-base font-bold font-serif text-[#EA5A0C] shrink-0">
              {item.priceFormatted}
            </span>
          </div>

          {/* Description */}
          <p className="text-xs text-foreground/75 leading-relaxed mb-4 line-clamp-2">
            {item.description}
          </p>
        </div>

        {/* Card Footer: Metadata and Action Button */}
        <div>
          {/* Metadata Row: Prep time and Rating */}
          <div className="flex justify-between items-center text-xs text-foreground/60 font-semibold mb-4 pt-3 border-t border-primary/5">
            <span className="flex items-center gap-1.5 text-[11px]">
              <Clock className="h-3.5 w-3.5 text-primary stroke-[2]" />
              {item.prepTime}
            </span>
            <span className="flex items-center gap-1 text-[11px]">
              <Star className="h-3.5 w-3.5 fill-accent text-accent" />
              <span className="text-primary font-bold">{item.rating}</span>
              <span className="text-foreground/45">({item.reviewsCount})</span>
            </span>
          </div>

          {/* Action Button */}
          <button
            onClick={handleAdd}
            className={`w-full py-2.5 px-4 text-xs font-bold rounded-full transition-all shadow-sm cursor-pointer uppercase tracking-wider text-center ${
              added
                ? "bg-emerald-600 text-white"
                : "bg-white border border-primary/20 text-primary hover:bg-[#2A1506] hover:text-white hover:border-transparent"
            }`}
          >
            {added ? "Added to Order ✓" : "Include in Booking"}
          </button>
        </div>
      </div>

    </div>
  );
}
