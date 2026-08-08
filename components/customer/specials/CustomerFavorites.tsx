"use client";

import { useState } from "react";
import Image from "next/image";
import { useBooking } from "@/context/BookingContext";

export default function CustomerFavorites() {
  const { addMenuItem } = useBooking();
  const [addedId, setAddedId] = useState<string | null>(null);

  const favorites = [
    {
      id: "fav_pistachio_brew",
      name: "Pistachio Cold Brew",
      price: 220,
      priceFormatted: "₹220",
      image: "/pistachio-cold-brew.png",
      category: "Coffee",
    },
    {
      id: "fav_flat_white",
      name: "Artisan Flat White",
      price: 180,
      priceFormatted: "₹180",
      image: "/flat-white.png",
      category: "Coffee",
    },
    {
      id: "fav_avocado_toast",
      name: "Sourdough Avocado",
      price: 250,
      priceFormatted: "₹250",
      image: "/poached-eggs.png",
      category: "Breakfast",
    },
    {
      id: "fav_club_sandwich",
      name: "Gourmet Club Sandwich",
      price: 200,
      priceFormatted: "₹200",
      image: "/macarons.png",
      category: "Sandwiches",
    },
    {
      id: "fav_bagel_cream",
      name: "Bagel with Cream",
      price: 175,
      priceFormatted: "₹175",
      image: "/flat-white-pastry.png",
      category: "Breakfast",
    },
    {
      id: "fav_cheesecake",
      name: "Slice of Cheesecake",
      price: 190,
      priceFormatted: "₹190",
      image: "/macarons.png",
      category: "Desserts",
    },
  ];

  const handleAdd = (item: (typeof favorites)[0]) => {
    addMenuItem({
      id: item.id,
      name: item.name,
      category: item.category,
      price: item.price,
      image: item.image,
    });
    setAddedId(item.id);
    setTimeout(() => setAddedId(null), 2000);
  };

  return (
    <section className="py-12 bg-background text-foreground text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold font-serif text-[#5A2E0C]">
            Customer Favorites
          </h2>
        </div>

        {/* 6 Favorites Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((item, idx) => (
            <div
              key={idx}
              className="bg-white rounded-[24px] overflow-hidden card-shadow border border-primary/5 flex flex-col justify-between text-left h-full"
            >
              {/* Image Cover */}
              <div className="relative h-[200px] w-full">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover object-center"
                  sizes="(max-w-768px) 100vw, (max-w-1024px) 50vw, 33vw"
                />
              </div>

              {/* Card Details */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center text-xs font-semibold text-foreground/50 mb-1">
                    <span>#{idx + 1}</span>
                    <span className="font-bold font-serif text-[#5A2E0C] text-base">{item.priceFormatted}</span>
                  </div>

                  <h3 className="text-base font-bold font-serif text-primary mb-4">
                    {item.name}
                  </h3>
                </div>

                <button
                  onClick={() => handleAdd(item)}
                  className={`w-full py-2.5 px-4 border border-transparent text-xs font-bold rounded-full text-white transition-all shadow-md cursor-pointer uppercase tracking-wider text-center ${
                    addedId === item.id ? "bg-emerald-600" : "bg-[#2A1506] hover:bg-[#2A1506]/90"
                  }`}
                >
                  {addedId === item.id ? "✓ Added to Booking" : "Include in Booking"}
                </button>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
