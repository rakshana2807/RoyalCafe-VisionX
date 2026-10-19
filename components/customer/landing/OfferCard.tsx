"use client";

import Image from "next/image";
import Link from "next/link";
import { Coffee, GraduationCap, Laptop, ArrowRight } from "lucide-react";

export default function OfferCard() {
  return (
    <section id="menu" className="py-12 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-12 text-left">
          <h2 className="text-3xl sm:text-4xl font-bold font-serif text-primary mb-3">
            Curated for You
          </h2>
          <p className="text-sm sm:text-base text-foreground/70 font-medium">
            Tasty options and spaces made just for you
          </p>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">

          {/* Left Column: Cold Brew Product Card (6 cols) */}
          <div className="lg:col-span-6 flex flex-col bg-surface rounded-3xl overflow-hidden card-shadow card-shadow-hover border border-border">
            <div className="relative h-[280px] w-full">
              <Image
                src="/cold-brew.png"
                alt="Salted Caramel Cold Brew"
                fill
                className="object-cover"
              />
              <span className="absolute top-4 left-4 bg-accent text-primary text-xs font-semibold px-3 py-1.5 rounded-full shadow-sm">
                Chef&apos;s Special
              </span>
            </div>

            <div className="p-6 sm:p-8 flex flex-col flex-1">
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-xl sm:text-2xl font-bold font-serif text-[#410013]">
                  Salted Caramel Cold Brew
                </h3>
                <span className="text-xl sm:text-2xl font-bold font-serif text-[#410013]">
                  ₹175
                </span>
              </div>
              <p className="text-sm sm:text-base text-[#410013]/80 leading-relaxed mb-8 flex-1 font-medium">
                Our signature cold brew with house-made salted caramel syrup and cold foam. Perfect for a sweet afternoon pick-me-up.
              </p>
              <Link
                href="/book"
                className="w-full inline-flex items-center justify-center px-6 py-4 border border-transparent text-xs uppercase tracking-[0.2em] font-bold rounded-full text-[#F5DAA7] bg-[#410013] hover:bg-[#561C24] transition-all duration-300 cursor-pointer shadow-md hover:-translate-y-0.5"
              >
                Include in booking
              </Link>
            </div>
          </div>

          {/* Right Column: Combined Offers (6 cols) */}
          <div className="lg:col-span-6 flex flex-col gap-6">

            {/* Top Right: Off-Peak Happy Hour (Dark Card) */}
            <div className="bg-background text-primary p-8 sm:p-10 rounded-3xl flex flex-col justify-between card-shadow card-shadow-hover relative overflow-hidden group min-h-[240px]">
              {/* Background vector */}
              <div className="absolute right-4 bottom-4 text-primary/5 transform group-hover:scale-110 group-hover:-rotate-6 transition-all duration-700">
                <Coffee className="h-44 w-44 stroke-[0.5]" />
              </div>

              <div className="relative z-10 flex-1">
                <div className="flex items-center gap-2 mb-4">
                  <Coffee className="h-5 w-5 text-accent" />
                  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Limited Time</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold font-serif mb-3 text-primary">
                  Off-Peak Happy Hour
                </h3>
                <p className="text-sm sm:text-base text-primary/80 leading-relaxed mb-8 max-w-md font-medium">
                  Avoid the rush! Get a medium hot beverage and 20% off all baked goods between 2 PM and 5 PM.
                </p>
              </div>
              <div className="relative z-10">
                <Link
                  href="/specials"
                  className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-xs uppercase tracking-[0.2em] font-bold rounded-full text-[#410013] bg-[#F5DAA7] hover:bg-[#F5DAA7]/90 transition-all duration-300 cursor-pointer shadow-sm hover:-translate-y-0.5"
                >
                  View Offers
                </Link>
              </div>
            </div>

            {/* Bottom Right: Grid of Student and Work Passes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1">

              {/* Student Pass Card */}
              <div className="bg-surface p-8 rounded-3xl flex flex-col justify-between card-shadow card-shadow-hover border border-border group">
                <div>
                  <div className="h-12 w-12 rounded-full bg-[#410013] flex items-center justify-center mb-6 border border-[#410013]/20 group-hover:scale-110 transition-transform duration-500 shadow-sm">
                    <GraduationCap className="h-5 w-5 text-[#F5DAA7]" />
                  </div>
                  <h4 className="text-lg sm:text-xl font-bold font-serif text-[#410013] mb-2">
                    Student Pass
                  </h4>
                  <span className="text-xs font-bold text-[#410013]/85 block mb-4 uppercase tracking-[0.1em]">
                    Valid Mon-Fri, 9am - 3pm
                  </span>
                  <p className="text-sm text-[#410013]/80 leading-relaxed mb-8 font-medium">
                    Get unlimited drip coffee &amp; a reserved desk.
                  </p>
                </div>
                <Link
                  href="/work-study"
                  className="inline-flex items-center text-xs uppercase tracking-widest font-bold text-[#410013] hover:text-[#561C24] transition-colors cursor-pointer"
                >
                  Learn more
                  <ArrowRight className="ml-2 h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>

              {/* Work Pass Card */}
              <div className="bg-surface p-8 rounded-3xl flex flex-col justify-between card-shadow card-shadow-hover border border-border group">
                <div>
                  <div className="h-12 w-12 rounded-full bg-[#410013] flex items-center justify-center mb-6 border border-[#410013]/20 group-hover:scale-110 transition-transform duration-500 shadow-sm">
                    <Laptop className="h-5 w-5 text-[#F5DAA7]" />
                  </div>
                  <h4 className="text-lg sm:text-xl font-bold font-serif text-[#410013] mb-2">
                    Work Pass
                  </h4>
                  <span className="text-xs font-bold text-[#410013]/85 block mb-4 uppercase tracking-[0.1em]">
                    Single day or weekly
                  </span>
                  <p className="text-sm text-[#410013]/80 leading-relaxed mb-8 font-medium">
                    Get dedicated high-speed Wi-Fi, power outlets &amp; 10% off food.
                  </p>
                </div>
                <Link
                  href="/work-study"
                  className="inline-flex items-center text-xs uppercase tracking-widest font-bold text-[#410013] hover:text-[#561C24] transition-colors cursor-pointer"
                >
                  Learn more
                  <ArrowRight className="ml-2 h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>

            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
