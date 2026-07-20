"use client";

import { Clock, Phone, MapPin, Navigation, Bus, Car } from "lucide-react";

export default function LocationMap() {
  return (
    <section id="location" className="py-16 bg-background text-foreground text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header (Figma Design) */}
        <div className="mb-12">
          <h2 className="text-3xl sm:text-[44px] font-bold font-serif text-primary leading-tight mb-3">
            Contact & Location
          </h2>
          <p className="text-sm sm:text-base text-foreground/75 font-sans max-w-2xl">
            Find us in the heart of the city, or book a space tailored for your next deep-work session or collaborative meeting.
          </p>
        </div>

        {/* Laptop Frame Map View & Cards Layout (Figma screenshot) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-12">
          
          {/* Left: Laptop Screen Frame containing Map (8 cols) */}
          <div className="lg:col-span-8 w-full">
            <div className="bg-[#1A1A1A] p-3 sm:p-4 rounded-3xl card-shadow border border-zinc-800 shadow-2xl relative">
              {/* Laptop top camera dot */}
              <div className="h-2 w-2 rounded-full bg-zinc-700 mx-auto mb-2" />

              {/* Map Canvas area */}
              <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden bg-[#E5E3DF] flex flex-col justify-between p-6">
                
                {/* Simulated Google Maps layout background */}
                <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#5A2E0C_1px,transparent_1px)] [background-size:16px_16px]" />

                {/* Top browser bar mockup */}
                <div className="relative z-10 bg-white/90 backdrop-blur-md px-4 py-2 rounded-xl text-xs font-bold text-primary flex items-center justify-between shadow-sm max-w-sm">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-accent" />
                    <span>RoyalCafe Connect</span>
                  </div>
                  <span className="text-[10px] text-foreground/50">Tech District Map</span>
                </div>

                {/* Map Pin Card overlay at bottom */}
                <div className="relative z-10 bg-white p-4 rounded-2xl shadow-xl max-w-xs border border-primary/5 text-left animate-fade-in">
                  <div className="flex items-start gap-3">
                    <div className="h-8 w-8 rounded-full bg-accent/10 flex items-center justify-center text-accent shrink-0">
                      <MapPin className="h-4 w-4 stroke-[2.5]" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold font-serif text-primary">
                        RoyalCafe Connect
                      </h4>
                      <p className="text-[11px] text-foreground/70 leading-tight">
                        123 Innovation Way, Tech District
                      </p>
                      <a
                        href="https://maps.google.com"
                        target="_blank"
                        rel="noreferrer"
                        className="inline-block mt-2 text-[10px] font-bold text-accent hover:underline uppercase tracking-wider"
                      >
                        Get Directions →
                      </a>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* Right: Opening Hours & Contact cards (4 cols) */}
          <div className="lg:col-span-4 w-full flex flex-col gap-6">
            
            {/* Opening Hours card */}
            <div className="bg-white p-6 rounded-3xl border border-primary/5 card-shadow flex items-center gap-4 text-left">
              <div className="h-12 w-12 rounded-2xl bg-primary/5 flex items-center justify-center text-primary shrink-0 border border-primary/10">
                <Clock className="h-6 w-6 stroke-[1.5]" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-foreground/45 uppercase tracking-wider block mb-1">
                  Opening Hours
                </span>
                <span className="text-xs text-foreground/60 font-semibold block">
                  Mon – Sun
                </span>
                <span className="text-base font-bold font-serif text-primary">
                  7:00 AM – 8:00 PM
                </span>
              </div>
            </div>

            {/* Get in Touch card */}
            <div className="bg-white p-6 rounded-3xl border border-primary/5 card-shadow flex items-center gap-4 text-left">
              <div className="h-12 w-12 rounded-2xl bg-primary/5 flex items-center justify-center text-primary shrink-0 border border-primary/10">
                <Phone className="h-6 w-6 stroke-[1.5]" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-foreground/45 uppercase tracking-wider block mb-1">
                  Get in Touch
                </span>
                <span className="text-sm font-bold text-primary block">
                  +1 (555) 123-4567
                </span>
                <span className="text-xs text-foreground/70 font-medium block">
                  hello@royalcafe.connect
                </span>
              </div>
            </div>

            {/* Directions Button */}
            <button
              onClick={() => alert("Opening Google Maps Navigation...")}
              className="w-full py-4 px-6 border border-transparent text-sm font-bold rounded-2xl text-white bg-primary hover:bg-primary/95 transition-all shadow-md cursor-pointer hover:scale-[1.02] active:scale-[0.98] inline-flex items-center justify-center gap-2 uppercase tracking-wider"
            >
              <Navigation className="h-4 w-4" />
              <span>Get Directions</span>
            </button>

          </div>

        </div>

        {/* Transport & Nearby info cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          <div className="bg-white p-6 rounded-2xl border border-primary/5 card-shadow">
            <h4 className="text-sm font-bold font-serif text-primary mb-2 flex items-center gap-2">
              <MapPin className="h-4 w-4 text-accent" />
              Nearby Landmarks
            </h4>
            <p className="text-xs text-foreground/70 leading-relaxed font-sans">
              Located right opposite Innovation Park, 2 mins walk from Tech District Plaza.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-primary/5 card-shadow">
            <h4 className="text-sm font-bold font-serif text-primary mb-2 flex items-center gap-2">
              <Car className="h-4 w-4 text-accent" />
              Parking Information
            </h4>
            <p className="text-xs text-foreground/70 leading-relaxed font-sans">
              Dedicated basement parking for customers with complimentary 2-hour parking validations.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-primary/5 card-shadow">
            <h4 className="text-sm font-bold font-serif text-primary mb-2 flex items-center gap-2">
              <Bus className="h-4 w-4 text-accent" />
              Public Transport
            </h4>
            <p className="text-xs text-foreground/70 leading-relaxed font-sans">
              Tech Hub Metro Station (Exit B) is a 3-minute walking distance from our main entrance.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}
