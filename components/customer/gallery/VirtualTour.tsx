"use client";

import { useState } from "react";
import Image from "next/image";
import { Play, X } from "lucide-react";

export default function VirtualTour() {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <section className="py-16 bg-background/50 text-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-12 animate-fade-in">
          <span className="text-[10px] font-bold text-accent uppercase tracking-widest block mb-2">
            Interactive Experience
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold font-serif text-primary mb-4">
            Take a Virtual Tour
          </h2>
          <p className="text-base text-foreground/75 font-sans">
            Explore every corner of RoyalCafe Connect before your visit.
          </p>
        </div>

        {/* Large Video Preview Container */}
        <div className="relative max-w-5xl mx-auto aspect-[21/9] min-h-[300px] sm:min-h-[400px] rounded-[2.5rem] overflow-hidden card-shadow border border-primary/5 group">
          <Image
            src="/cafe-interior-lounge.png"
            alt="Virtual Cafe Tour"
            fill
            className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
            sizes="(max-w-1280px) 100vw, 80vw"
          />
          <div className="absolute inset-0 bg-black/30 backdrop-blur-[0.5px]" />

          {/* Central Play Button */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 z-10">
            <button
              onClick={() => setIsPlaying(true)}
              className="h-20 w-20 sm:h-24 sm:w-24 rounded-full bg-primary text-white flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 cursor-pointer border-4 border-white/20 mb-4"
            >
              <Play className="h-8 w-8 sm:h-10 sm:w-10 fill-white text-white translate-x-0.5" />
            </button>
            
            <span className="text-white font-serif font-bold text-lg sm:text-2xl drop-shadow-md">
              Watch 360° Café Tour
            </span>
            <span className="text-white/80 text-xs sm:text-sm font-sans mt-1">
              2 mins walkthrough of study pods, lounge & barista counter
            </span>
          </div>
        </div>

      </div>

      {/* Tour Video Modal */}
      {isPlaying && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative max-w-4xl w-full bg-black rounded-3xl overflow-hidden card-shadow border border-white/20 aspect-video flex flex-col items-center justify-center text-white p-8">
            <button
              onClick={() => setIsPlaying(false)}
              className="absolute top-4 right-4 h-10 w-10 rounded-full bg-white/20 hover:bg-white text-white hover:text-black flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
            <Play className="h-16 w-16 text-accent mb-4 animate-pulse" />
            <h3 className="text-2xl font-bold font-serif mb-2">
              Virtual 360° Tour Demonstration
            </h3>
            <p className="text-sm text-zinc-400 text-center max-w-md">
              Interactive 3D walkthrough rendering of the co-working space, private cabins, and ordering counter.
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
