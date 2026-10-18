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
          <h2 className="text-3xl sm:text-4xl font-bold font-serif text-primary">
            Today&apos;s Recommendation
          </h2>
          <Sparkles className="h-6 w-6 text-primary animate-pulse" />
        </div>

        {/* Large Featured Horizontal Card - Editorial Layout */}
        <div className="bg-surface rounded-[32px] overflow-hidden shadow-2xl border border-primary/20 grid grid-cols-1 lg:grid-cols-12 gap-0 transition-transform duration-500 hover:-translate-y-2 group">

          {/* Left Side: Product Image (5 cols) */}
          <div className="lg:col-span-5 relative min-h-[400px] sm:min-h-[500px] w-full">
            <Image
              src="/pistachio-cold-brew.png"
              alt="Signature Pistachio Cream Cold Brew"
              fill
              className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
              sizes="(max-w-1024px) 100vw, 40vw"
            />
          </div>

          {/* Right Side: Product Details (7 cols) */}
          <div className="lg:col-span-7 p-8 sm:p-12 lg:p-14 flex flex-col justify-between text-left">

            <div>
              {/* Badges Row */}
              <div className="flex flex-wrap gap-3 mb-8">
                {/* Rating Badge */}
                <div className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-primary border border-primary/20 shadow-sm">
                  <Star className="h-4 w-4 fill-background text-background" />
                  <span className="text-[11px] uppercase tracking-widest font-bold text-background">4.9 Rating</span>
                </div>
                {/* Attribute Badge */}
                <div className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-primary border border-primary/20 shadow-sm">
                  <span className="text-[11px] uppercase tracking-widest font-bold text-background">Best for ⚡ Focus</span>
                </div>
              </div>

              {/* Title */}
              <h3 className="text-4xl sm:text-5xl font-bold font-serif text-foreground mb-6 leading-tight">
                Signature Pistachio Cream Cold Brew
              </h3>

              {/* Description */}
              <p className="text-base text-foreground/80 font-medium leading-relaxed mb-10 max-w-xl">
                Our slow-steeped cold brew topped with silky pistachio cream cold foam and a strike of salted brown butter sprinkles. Designed to provide a smooth, long-lasting energy boost for deep focus sessions.
              </p>
            </div>

            {/* Price, Prep Time and Button Footer */}
            <div className="pt-8 border-t border-primary/20">
              <div className="grid grid-cols-2 gap-8 mb-10">
                {/* Price column */}
                <div>
                  <span className="text-[11px] font-bold text-foreground/80 uppercase tracking-widest block mb-2">
                    Price
                  </span>
                  <span className="text-3xl sm:text-4xl font-extrabold font-serif text-foreground">
                    ₹175
                  </span>
                </div>
                {/* Prep time column */}
                <div>
                  <span className="text-[11px] font-bold text-foreground/80 uppercase tracking-widest block mb-2">
                    Prep Time
                  </span>
                  <span className="text-xl font-bold font-serif text-foreground flex items-center gap-2 mt-2">
                    <Clock className="h-5 w-5 text-foreground stroke-[2]" />
                    ~ 4 mins
                  </span>
                </div>
              </div>

              {/* CTA Action Button */}
              <button
                onClick={handleAddFeatured}
                className={`w-full inline-flex items-center justify-center gap-2 px-8 py-5 border border-transparent text-sm font-bold rounded-full text-background shadow-xl hover:-translate-y-1 active:scale-[0.99] transition-all duration-300 cursor-pointer uppercase tracking-widest ${
                  isAlreadyInBooking ? "bg-foreground text-background hover:bg-foreground/90" : "bg-primary text-background hover:bg-background hover:text-primary hover:border-primary"
                }`}
              >
                {isAlreadyInBooking ? (
                  <>
                    <ArrowRight className="h-5 w-5" />
                    Go to Bookings
                  </>
                ) : (
                  <>
                    <ShoppingBag className="h-5 w-5" />
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
