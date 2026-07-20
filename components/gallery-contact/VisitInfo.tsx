"use client";

import { Clock, MapPin, Phone, Mail, Globe, Car, Wifi, Wind } from "lucide-react";

export default function VisitInfo() {
  return (
    <section className="py-16 bg-background/50 text-foreground text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-12 animate-fade-in">
          <h2 className="text-3xl sm:text-4xl font-bold font-serif text-primary mb-4">
            Visit Information
          </h2>
          <p className="text-base text-foreground/75 font-sans">
            Plan your session. Here is everything you need to know about our location and hours.
          </p>
        </div>

        {/* Two-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          
          {/* LEFT: Opening Hours Card */}
          <div className="bg-white p-8 rounded-3xl border border-primary/5 card-shadow flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="h-10 w-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary border border-primary/10">
                  <Clock className="h-5 w-5 stroke-[1.75]" />
                </div>
                <h3 className="text-xl font-bold font-serif text-primary">
                  Opening Hours
                </h3>
              </div>

              <div className="space-y-4 text-xs sm:text-sm font-semibold">
                <div className="flex justify-between items-center border-b border-primary/5 pb-3">
                  <span className="text-foreground/60">Monday – Friday</span>
                  <span className="text-primary font-bold">8:00 AM – 10:00 PM</span>
                </div>
                <div className="flex justify-between items-center border-b border-primary/5 pb-3">
                  <span className="text-foreground/60">Saturday</span>
                  <span className="text-primary font-bold">8:00 AM – 11:00 PM</span>
                </div>
                <div className="flex justify-between items-center pb-1">
                  <span className="text-foreground/60">Sunday</span>
                  <span className="text-primary font-bold">9:00 AM – 9:00 PM</span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-primary/5">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                Open Today
              </span>
            </div>
          </div>

          {/* RIGHT: Cafe Details Card */}
          <div className="bg-white p-8 rounded-3xl border border-primary/5 card-shadow flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="h-10 w-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary border border-primary/10">
                  <MapPin className="h-5 w-5 stroke-[1.75]" />
                </div>
                <h3 className="text-xl font-bold font-serif text-primary">
                  Café Details
                </h3>
              </div>

              {/* Contact list */}
              <div className="space-y-3.5 text-xs sm:text-sm font-semibold text-foreground/80 mb-6">
                <div className="flex items-center gap-3">
                  <MapPin className="h-4 w-4 text-accent shrink-0" />
                  <span>123 Innovation Way, Tech District, City 10110</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-accent shrink-0" />
                  <span>+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-accent shrink-0" />
                  <span>hello@royalcafe.connect</span>
                </div>
                <div className="flex items-center gap-3">
                  <Globe className="h-4 w-4 text-accent shrink-0" />
                  <span>www.royalcafe.connect</span>
                </div>
              </div>
            </div>

            {/* Badges Row */}
            <div className="pt-4 border-t border-primary/5 flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-primary bg-[#FAF6F0] px-2.5 py-1 rounded-full border border-primary/5">
                <Car className="h-3 w-3 text-accent" />
                Parking Available
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-primary bg-[#FAF6F0] px-2.5 py-1 rounded-full border border-primary/5">
                <Wifi className="h-3 w-3 text-accent" />
                Free Wi-Fi
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-primary bg-[#FAF6F0] px-2.5 py-1 rounded-full border border-primary/5">
                <Wind className="h-3 w-3 text-accent" />
                Air Conditioning
              </span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
