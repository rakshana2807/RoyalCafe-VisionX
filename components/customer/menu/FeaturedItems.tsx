"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Star, Sparkles, Clock, ShoppingBag, ArrowRight } from "lucide-react";
import { useBooking } from "@/context/BookingContext";
import { isAuthenticated } from "@/lib/auth";

export default function FeaturedItems() {
  const router = useRouter();
  const { bookingItems, addMenuItem } = useBooking();

  const featuredId = "featured_pistachio_cold_brew";
  const featuredName = "Signature Pistachio Cream Cold Brew";

  const isAlreadyInBooking = bookingItems.some(
    (b) => b.id === featuredId || b.name === featuredName
  );

  const handleAddFeatured = () => {
    if (isAlreadyInBooking) {
      if (!isAuthenticated()) {
        const msg = encodeURIComponent("Please login to your RoyalCafeConnect account to book a workspace.");
        router.push(`/login?redirect=/book&message=${msg}`);
      } else {
        router.push("/book");
      }
    } else {
      addMenuItem({
        id: featuredId,
        name: featuredName,
        category: "Coffee",
        price: 175,
        image: "/pistachio-cold-brew.png",
      });
    }
  };

  return (
    <section className="py-12 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="flex justify-between items-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold font-serif text-[#F5DAA7]">
            Today&apos;s Recommendation
          </h2>
          <Sparkles className="h-6 w-6 text-[#F5DAA7] animate-pulse" />
        </div>

        {/* Large Featured Horizontal Card - Editorial Layout */}
        <div className="royal-glass-card rounded-[32px] overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-0 group">

          {/* Left Side: Product Image (5 cols) */}
          <div className="lg:col-span-5 relative min-h-[400px] sm:min-h-[480px] w-full overflow-hidden">
            <Image
              src="/pistachio-cold-brew.png"
              alt="Signature Pistachio Cream Cold Brew"
              fill
              className="object-cover object-center"
              sizes="(max-w-1024px) 100vw, 40vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[rgba(65,0,19,0.7)] via-transparent to-transparent pointer-events-none lg:bg-gradient-to-r lg:from-transparent lg:to-[rgba(65,0,19,0.5)]" />
          </div>

          {/* Right Side: Product Details (7 cols) */}
          <div className="lg:col-span-7 p-8 sm:p-12 lg:p-14 flex flex-col justify-between text-left">

            <div>
              {/* Badges Row */}
              <div className="flex flex-wrap gap-2.5 mb-6">
                {/* Rating Badge */}
                <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[rgba(65,0,19,0.85)] border border-[#F5DAA7]/30 text-[#F5DAA7] shadow-sm">
                  <Star className="h-3.5 w-3.5 fill-[#F5DAA7] text-[#F5DAA7]" />
                  <span className="text-[10px] uppercase tracking-widest font-bold">4.9 Rating</span>
                </div>
                {/* Attribute Badge */}
                <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[rgba(65,0,19,0.75)] border border-[rgba(245,218,167,0.3)] shadow-sm">
                  <span className="text-[10px] uppercase tracking-widest font-bold text-[#F5DAA7]">Best for ⚡ Focus</span>
                </div>
              </div>

              {/* Title */}
              <h3 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-serif text-[#FFF8E9] mb-4 leading-tight tracking-tight">
                Signature Pistachio Cream Cold Brew
              </h3>

              {/* Description */}
              <p className="text-sm sm:text-base text-[#FFF8E9]/80 font-normal leading-relaxed mb-8 max-w-xl">
                Our slow-steeped cold brew topped with silky pistachio cream cold foam and a strike of salted brown butter sprinkles. Designed to provide a smooth, long-lasting energy boost for deep focus sessions.
              </p>
            </div>

            {/* Price, Prep Time and Button Footer */}
            <div className="pt-6 border-t border-[rgba(245,218,167,0.2)]">
              <div className="grid grid-cols-2 gap-8 mb-8">
                {/* Price column */}
                <div>
                  <span className="text-[10px] font-bold text-[#F5DAA7] uppercase tracking-widest block mb-1">
                    Price
                  </span>
                  <span className="text-3xl sm:text-4xl font-extrabold font-serif text-[#F5DAA7]">
                    ₹175
                  </span>
                </div>
                {/* Prep time column */}
                <div>
                  <span className="text-[10px] font-bold text-[#F5DAA7] uppercase tracking-widest block mb-1">
                    Prep Time
                  </span>
                  <span className="text-lg sm:text-xl font-bold font-serif text-[#FFF8E9] flex items-center gap-2 mt-1">
                    <Clock className="h-4 w-4 text-[#F5DAA7] stroke-[2]" />
                    ~ 4 mins
                  </span>
                </div>
              </div>

              {/* CTA Action Button */}
              <button
                onClick={handleAddFeatured}
                className={`w-full inline-flex items-center justify-center gap-2 px-8 py-4 border text-xs font-bold rounded-full shadow-lg hover:-translate-y-0.5 active:scale-[0.99] transition-all duration-300 cursor-pointer uppercase tracking-widest ${isAlreadyInBooking
                    ? "bg-[#FFF8E9] text-[#410013] border-[#FFF8E9] hover:bg-white"
                    : "bg-[#F5DAA7] text-[#410013] border-[#F5DAA7] hover:bg-[#fff2d6] shadow-[0_4px_20px_rgba(245,218,167,0.35)]"
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

      </div>
    </section>
  );
}
