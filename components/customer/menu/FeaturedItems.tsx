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
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold font-serif text-primary">
            Today&apos;s Recommendation
          </h2>
          <Sparkles className="h-6 w-6 text-accent animate-pulse" />
        </div>

        {/* Large Featured Horizontal Card */}
        <div className="bg-white rounded-3xl overflow-hidden card-shadow border border-primary/5 grid grid-cols-1 lg:grid-cols-12 gap-0">

          {/* Left Side: Product Image (5 cols) */}
          <div className="lg:col-span-5 relative min-h-[300px] sm:min-h-[400px] w-full">
            <Image
              src="/pistachio-cold-brew.png"
              alt="Signature Pistachio Cream Cold Brew"
              fill
              className="object-cover object-center"
              sizes="(max-w-1024px) 100vw, 40vw"
            />
          </div>

          {/* Right Side: Product Details (7 cols) */}
          <div className="lg:col-span-7 p-8 sm:p-12 lg:p-14 flex flex-col justify-between text-left">

            <div>
              {/* Badges Row */}
              <div className="flex flex-wrap gap-2.5 mb-6">
                {/* Rating Badge */}
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-accent/10 border border-accent/20">
                  <Star className="h-3.5 w-3.5 fill-accent text-accent" />
                  <span className="text-xs font-bold text-accent">4.9 Rating</span>
                </div>
                {/* Attribute Badge */}
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/5 border border-primary/10">
                  <span className="text-xs font-bold text-primary">Best for ⚡ Focus</span>
                </div>
              </div>

              {/* Title */}
              <h3 className="text-3xl sm:text-4xl font-bold font-serif text-primary mb-4 leading-tight">
                Signature Pistachio Cream Cold Brew
              </h3>

              {/* Description */}
              <p className="text-sm sm:text-base text-foreground/80 leading-relaxed mb-8">
                Our slow-steeped cold brew topped with silky pistachio cream cold foam and a strike of salted brown butter sprinkles. Designed to provide a smooth, long-lasting energy boost for deep focus sessions.
              </p>
            </div>

            {/* Price, Prep Time and Button Footer */}
            <div className="pt-6 border-t border-primary/5">
              <div className="grid grid-cols-2 gap-6 mb-8">
                {/* Price column */}
                <div>
                  <span className="text-[11px] font-bold text-foreground/45 uppercase tracking-wider block mb-1">
                    Price
                  </span>
                  <span className="text-2xl sm:text-3xl font-bold font-serif text-accent">
                    ₹175
                  </span>
                </div>
                {/* Prep time column */}
                <div>
                  <span className="text-[11px] font-bold text-foreground/45 uppercase tracking-wider block mb-1">
                    Prep Time
                  </span>
                  <span className="text-base sm:text-lg font-bold font-serif text-primary flex items-center gap-1 mt-1">
                    <Clock className="h-4.5 w-4.5 text-primary stroke-[2]" />
                    ~ 4 mins
                  </span>
                </div>
              </div>

              {/* CTA Action Button */}
              <button
                onClick={handleAddFeatured}
                className={`w-full inline-flex items-center justify-center gap-2 px-8 py-4 border border-transparent text-base font-semibold rounded-xl text-white shadow-md hover:scale-[1.01] active:scale-[0.99] transition-all duration-250 cursor-pointer uppercase tracking-wider ${
                  isAlreadyInBooking ? "bg-[#8C4A21] hover:bg-[#3D2314]" : "bg-accent hover:bg-accent/95"
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
