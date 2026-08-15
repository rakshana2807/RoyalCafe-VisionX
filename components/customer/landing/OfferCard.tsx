"use client";

import Image from "next/image";
import Link from "next/link";
import { Coffee, GraduationCap, Laptop, ArrowRight } from "lucide-react";

export default function OfferCard() {
  return (
    <section id="menu"  className=" bg-background/50">
      <div className=" max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-4 text-left">
          <h2 className="text-3xl sm:text-4xl font-bold font-serif text-foreground mb-1">
            Curated for You
          </h2>
          <p className="text-sm sm:text-base text-foreground/75">
            Tasty options and spaces made just for you
          </p>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">

          {/* Left Column: Cold Brew Product Card (6 cols) */}
          <div className="lg:col-span-6 flex flex-col bg-white rounded-2xl overflow-hidden card-shadow card-shadow-hover border border-primary/5">
            <div className="relative h-[280px] w-full">
              <Image
                src="/cold-brew.png"
                alt="Salted Caramel Cold Brew"
                fill
                className="object-cover"
              />
              <span className="absolute top-4 left-4 bg-accent text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-sm">
                Chef&apos;s Special
              </span>
            </div>

            <div className="p-6 sm:p-8 flex flex-col flex-1">
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-xl sm:text-2xl font-bold font-serif text-foreground">
                  Salted Caramel Cold Brew
                </h3>
                <span className="text-xl sm:text-2xl font-bold font-serif text-accent">
                  ₹175
                </span>
              </div>
              <p className="text-sm sm:text-base text-foreground/80 leading-relaxed mb-6 flex-1">
                Our signature cold brew with house-made salted caramel syrup and cold foam. Perfect for a sweet afternoon pick-me-up.
              </p>
              <Link
                href="/book"
                className="w-full inline-flex items-center justify-center px-6 py-3 border border-transparent text-sm font-semibold rounded-lg text-white bg-primary hover:bg-primary/95 transition-all duration-250 cursor-pointer shadow-sm active:scale-[0.98]"
              >
                Include in booking
              </Link>
            </div>
          </div>

          {/* Right Column: Combined Offers (6 cols) */}
          <div className="lg:col-span-6 flex flex-col gap-6">

            {/* Top Right: Off-Peak Happy Hour (Dark Card) */}
            <div className="bg-primary text-white p-6 sm:p-8 rounded-2xl flex flex-col justify-between card-shadow card-shadow-hover relative overflow-hidden group min-h-[220px]">
              {/* Background vector */}
              <div className="absolute right-4 bottom-4 text-white/5 transform group-hover:scale-110 transition-transform duration-500">
                <Coffee className="h-44 w-44 stroke-[0.5]" />
              </div>

              <div className="relative z-10 flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <Coffee className="h-5 w-5 text-accent" />
                  <span className="text-xs font-bold uppercase tracking-wider text-accent">Limited Time</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold font-serif mb-3 text-[#F8F1EA]">
                  Off-Peak Happy Hour
                </h3>
                <p className="text-sm sm:text-base text-[#F8F1EA]/85 leading-relaxed mb-6 max-w-md">
                  Avoid the rush! Get a medium hot beverage and 20% off all baked goods between 2 PM and 5 PM.
                </p>
              </div>
              <div className="relative z-10">
                <Link
                  href="/specials"
                  className="inline-flex items-center justify-center px-6 py-2.5 border border-transparent text-sm font-semibold rounded-lg text-primary bg-[#F8F1EA] hover:bg-[#F8F1EA]/95 transition-all duration-250 cursor-pointer shadow-sm active:scale-[0.98]"
                >
                  View Offers
                </Link>
              </div>
            </div>

            {/* Bottom Right: Grid of Student and Work Passes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1">

              {/* Student Pass Card */}
              <div className="bg-[#FAF6F0] p-6 rounded-2xl flex flex-col justify-between card-shadow card-shadow-hover border border-primary/5">
                <div>
                  <div className="h-10 w-10 rounded-lg bg-primary/5 flex items-center justify-center mb-4 border border-primary/10">
                    <GraduationCap className="h-5 w-5 text-primary" />
                  </div>
                  <h4 className="text-base sm:text-lg font-bold font-serif text-primary mb-1">
                    Student Pass
                  </h4>
                  <span className="text-[11px] font-semibold text-accent block mb-3 uppercase tracking-wider">
                    Valid Mon-Fri, 9am - 3pm
                  </span>
                  <p className="text-xs sm:text-sm text-foreground/80 leading-relaxed mb-6">
                    Get unlimited drip coffee &amp; a reserved desk.
                  </p>
                </div>
                <Link
                  href="/work-study"
                  className="inline-flex items-center text-xs sm:text-sm font-semibold text-accent hover:text-primary transition-colors group cursor-pointer"
                >
                  Learn more
                  <ArrowRight className="ml-1 h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>

              {/* Work Pass Card */}
              <div className="bg-[#FAF6F0] p-6 rounded-2xl flex flex-col justify-between card-shadow card-shadow-hover border border-primary/5">
                <div>
                  <div className="h-10 w-10 rounded-lg bg-primary/5 flex items-center justify-center mb-4 border border-primary/10">
                    <Laptop className="h-5 w-5 text-primary" />
                  </div>
                  <h4 className="text-base sm:text-lg font-bold font-serif text-primary mb-1">
                    Work Pass
                  </h4>
                  <span className="text-[11px] font-semibold text-accent block mb-3 uppercase tracking-wider">
                    Single day or weekly
                  </span>
                  <p className="text-xs sm:text-sm text-foreground/80 leading-relaxed mb-6">
                    Get dedicated high-speed Wi-Fi, power outlets &amp; 10% off food.
                  </p>
                </div>
                <Link
                  href="/work-study"
                  className="inline-flex items-center text-xs sm:text-sm font-semibold text-accent hover:text-primary transition-colors group cursor-pointer"
                >
                  Learn more
                  <ArrowRight className="ml-1 h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>

            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
