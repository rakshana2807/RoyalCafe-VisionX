"use client";

import { useState } from "react";
import Image from "next/image";
import { X, Eye } from "lucide-react";

interface GalleryItem {
  id: string;
  title: string;
  category: string;
  image: string;
}

export default function GalleryGrid() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null);

  const categories = ["All", "Coffee Craft", "Study Spaces", "Ambiance", "Community"];

  const items: GalleryItem[] = [
    {
      id: "g1",
      title: "Artisan Barista Pour",
      category: "Coffee Craft",
      image: "/flat-white-pastry.png",
    },
    {
      id: "g2",
      title: "Cozy Lounge Armchairs",
      category: "Ambiance",
      image: "/cafe-interior-lounge.png",
    },
    {
      id: "g3",
      title: "Main Co-Working Space",
      category: "Study Spaces",
      image: "/productivity-feature.png",
    },
    {
      id: "g4",
      title: "Natural Focus Desk",
      category: "Study Spaces",
      image: "/pistachio-cold-brew.png",
    },
    {
      id: "g5",
      title: "Community Collaboration",
      category: "Community",
      image: "/group-collaboration.png",
    },
    {
      id: "g6",
      title: "Window Study Counter",
      category: "Study Spaces",
      image: "/work-study-hero.png",
    },
  ];

  const filteredItems =
    activeCategory === "All"
      ? items
      : items.filter((item) => item.category === activeCategory);

  return (
    <section id="gallery" className="py-12 bg-background text-foreground text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Figma Heading Block */}
        <div className="mb-8">
          <h2 className="text-3xl sm:text-[44px] font-bold font-serif text-primary leading-tight mb-3">
            Our Space
          </h2>
          <p className="text-sm sm:text-base text-foreground/75 font-sans max-w-2xl">
            Explore the ambiance, our dedicated study zones, and the craft behind every cup. A glimpse into your next favorite workspace.
          </p>
        </div>

        {/* Category Filter Pills (Figma layout) */}
        <div className="flex flex-wrap gap-2.5 mb-10">
          {categories.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2 rounded-full text-xs font-bold transition-all duration-300 cursor-pointer ${
                  isActive
                    ? "bg-primary text-white shadow-sm"
                    : "bg-[#EAE0D5]/60 text-primary hover:bg-[#EAE0D5] border border-primary/5"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* 6 Images Grid (2 rows x 3 cols on desktop) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedImage(item)}
              className="group relative h-[240px] sm:h-[260px] rounded-3xl overflow-hidden card-shadow cursor-pointer border border-primary/5"
            >
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-cover object-center group-hover:scale-110 transition-transform duration-500 ease-out"
                sizes="(max-w-768px) 100vw, (max-w-1024px) 50vw, 33vw"
              />

              {/* Hover Dark Overlay with Title & Icon */}
              <div className="absolute inset-0 bg-black/45 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center text-center p-6 text-white z-10">
                <Eye className="h-8 w-8 text-white mb-2 stroke-[1.5] animate-bounce" />
                <h3 className="text-lg font-bold font-serif mb-1">
                  {item.title}
                </h3>
                <span className="text-[10px] font-bold uppercase tracking-widest text-accent">
                  {item.category}
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Lightbox Modal Preview */}
      {selectedImage && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
          <div className="relative max-w-4xl w-full bg-white rounded-3xl overflow-hidden card-shadow border border-white/20">
            {/* Close Button */}
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 h-10 w-10 rounded-full bg-black/60 text-white hover:bg-black flex items-center justify-center transition-colors z-20 cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Modal Image */}
            <div className="relative aspect-[16/10] w-full max-h-[70vh]">
              <Image
                src={selectedImage.image}
                alt={selectedImage.title}
                fill
                className="object-cover object-center"
              />
            </div>

            {/* Modal Footer Caption */}
            <div className="p-6 bg-white text-left flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-accent uppercase tracking-widest block mb-1">
                  {selectedImage.category}
                </span>
                <h3 className="text-xl font-bold font-serif text-primary">
                  {selectedImage.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedImage(null)}
                className="px-6 py-2 border border-primary/20 text-xs font-bold rounded-full text-primary hover:bg-foreground/5 cursor-pointer"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
