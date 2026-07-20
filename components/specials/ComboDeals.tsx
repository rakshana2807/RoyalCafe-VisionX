"use client";

import Image from "next/image";

export default function ComboDeals() {
  const combos = [
    {
      name: "Coffee + Croissant",
      price: "₹220",
      description: "Freshly baked morning delight.",
      image: "/flat-white-pastry.png",
    },
    {
      name: "Latte + Muffin",
      price: "₹240",
      description: "Fulfilling afternoon snack combo.",
      image: "/flat-white.png",
    },
    {
      name: "Cold Brew + Brownie",
      price: "₹260",
      description: "Rich, smooth, chocolatey indulgence.",
      image: "/cold-brew.png",
    },
  ];

  return (
    <section id="combos" className="py-10 bg-background text-foreground text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header matching Figma */}
        <div className="mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold font-serif text-[#5A2E0C]">
            Best Combo Deals
          </h2>
        </div>

        {/* 3 Combos Grid matching Figma */}
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
                      {combo.price}
                    </span>
                  </div>
                  <p className="text-xs text-foreground/70 leading-relaxed font-sans mb-6">
                    {combo.description}
                  </p>
                </div>

                <button
                  onClick={() => alert(`${combo.name} added to booking!`)}
                  className="w-full py-3 px-5 border border-transparent text-xs font-bold rounded-full text-white bg-[#2A1506] hover:bg-[#2A1506]/90 transition-all shadow-md cursor-pointer uppercase tracking-wider text-center"
                >
                  Include in Booking
                </button>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
