"use client";

import Image from "next/image";

export default function CustomerFavorites() {
  const favorites = [
    {
      id: "#1",
      name: "Pistachio Cold Brew",
      price: "₹220",
      image: "/pistachio-cold-brew.png",
    },
    {
      id: "#2",
      name: "Artisan Flat White",
      price: "₹180",
      image: "/flat-white.png",
    },
    {
      id: "#3",
      name: "Sourdough Avocado",
      price: "₹250",
      image: "/poached-eggs.png",
    },
    {
      id: "#4",
      name: "Gourmet Club Sandwich",
      price: "₹200",
      image: "/macarons.png",
    },
    {
      id: "#5",
      name: "Bagel with Cream",
      price: "₹175",
      image: "/flat-white-pastry.png",
    },
    {
      id: "#6",
      name: "Slice of Cheesecake",
      price: "₹190",
      image: "/macarons.png",
    },
  ];

  return (
    <section className="py-12 bg-background text-foreground text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header matching Figma */}
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold font-serif text-[#5A2E0C]">
            Customer Favorites
          </h2>
        </div>

        {/* 6 Favorites Grid (3 cols x 2 rows) matching Figma */}
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
                    <span>{item.id}</span>
                    <span className="font-bold font-serif text-[#5A2E0C] text-base">{item.price}</span>
                  </div>

                  <h3 className="text-base font-bold font-serif text-primary mb-4">
                    {item.name}
                  </h3>
                </div>

                <button
                  onClick={() => alert(`${item.name} added to booking!`)}
                  className="w-full py-2.5 px-4 border border-transparent text-xs font-bold rounded-full text-white bg-[#2A1506] hover:bg-[#2A1506]/90 transition-all shadow-md cursor-pointer uppercase tracking-wider text-center"
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
