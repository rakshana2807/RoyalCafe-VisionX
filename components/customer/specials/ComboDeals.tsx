"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { useBooking } from "@/context/BookingContext";
import { isAuthenticated } from "@/lib/auth";

export default function ComboDeals() {
  const router = useRouter();
  const { bookingItems, addMenuItem } = useBooking();

  const combos = [
    {
      id: "combo_coffee_croissant",
      name: "Coffee + Croissant Combo",
      price: 220,
      priceFormatted: "₹220",
      description: "Freshly baked morning delight.",
      image: "/flat-white-pastry.png",
      category: "Combos",
    },
    {
      id: "combo_latte_muffin",
      name: "Latte + Muffin Combo",
      price: 240,
      priceFormatted: "₹240",
      description: "Fulfilling afternoon snack combo.",
      image: "/flat-white.png",
      category: "Combos",
    },
    {
      id: "combo_coldbrew_brownie",
      name: "Cold Brew + Brownie Combo",
      price: 260,
      priceFormatted: "₹260",
      description: "Rich, smooth, chocolatey indulgence.",
      image: "/cold-brew.png",
      category: "Combos",
    },
  ];

  const isAlreadyInBooking = (combo: (typeof combos)[0]) =>
    bookingItems.some((b) => b.id === combo.id || b.name === combo.name);

  const handleAddCombo = (combo: (typeof combos)[0]) => {
    if (isAlreadyInBooking(combo)) {
      if (!isAuthenticated()) {
        const msg = encodeURIComponent("Please login to your RoyalCafeConnect account to book a workspace.");
        router.push(`/login?redirect=/book&message=${msg}`);
      } else {
        router.push("/book");
      }
    } else {
      addMenuItem({
        id: combo.id,
        name: combo.name,
        category: combo.category,
        price: combo.price,
        image: combo.image,
      });
    }
  };

  return (
    <section id="combos" className="py-10 bg-background text-foreground text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold font-serif text-[#5A2E0C]">
            Best Combo Deals
          </h2>
        </div>

        {/* 3 Combos Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {combos.map((combo, idx) => (
            <div
              key={idx}
              className="bg-white rounded-[24px] overflow-hidden card-shadow border border-primary/5 flex flex-col justify-between text-left h-full"
            >
              {/* Image Cover */}
              <div className="relative h-[220px] w-full">
                <Image
                  src={combo.image}
                  alt={combo.name}
                  fill
                  className="object-cover object-center"
                  sizes="(max-w-768px) 100vw, 33vw"
                />
              </div>

              {/* Card content */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-baseline mb-2">
                    <h3 className="text-lg font-bold font-serif text-primary">
                      {combo.name}
                    </h3>
                    <span className="text-lg font-bold font-serif text-[#5A2E0C]">
                      {combo.priceFormatted}
                    </span>
                  </div>
                  <p className="text-xs text-foreground/70 leading-relaxed font-sans mb-6">
                    {combo.description}
                  </p>
                </div>

                <button
                  onClick={() => handleAddCombo(combo)}
                  className={`w-full py-3 px-5 border border-transparent text-xs font-bold rounded-full text-white transition-all shadow-md cursor-pointer uppercase tracking-wider text-center flex items-center justify-center gap-1.5 ${
                    isAlreadyInBooking(combo) ? "bg-[#8C4A21] hover:bg-[#3D2314]" : "bg-[#2A1506] hover:bg-[#2A1506]/90"
                  }`}
                >
                  {isAlreadyInBooking(combo) ? (
                    <>
                      <ArrowRight className="h-3.5 w-3.5" />
                      Go to Bookings
                    </>
                  ) : (
                    "Include in Booking"
                  )}
                </button>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
