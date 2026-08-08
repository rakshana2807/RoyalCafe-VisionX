"use client";

import Image from "next/image";
import Link from "next/link";
import { Wifi, Volume2, Zap, Clock, Coffee, ShieldCheck } from "lucide-react";

export default function Hero() {
  const suitabilityScores = [
    {
      title: "WI-FI QUALITY",
      value: "98%",
      description: "Gigabit Fiber",
      icon: Wifi,
      bar: (
        <div className="w-full h-1 bg-[#FAF6F0] rounded-full overflow-hidden mt-2">
          <div className="h-full w-[98%] bg-[#5A2E0C]" />
        </div>
      ),
    },
    {
      title: "NOISE LEVEL",
      value: "Low",
      description: "Ambient Lo-Fi",
      icon: Volume2,
      bar: (
        <div className="w-full h-1 bg-[#FAF6F0] rounded-full overflow-hidden mt-2 flex">
          <div className="h-full w-1/3 bg-sky-500" />
          <div className="h-full w-2/3 bg-zinc-200" />
        </div>
      ),
    },
    {
      title: "CHARGING",
      value: "Plentiful",
      description: "At every desk",
      icon: Zap,
      bar: (
        <div className="flex gap-1 justify-center mt-2">
          <Zap className="h-3.5 w-3.5 fill-[#EA5A0C] text-[#EA5A0C]" />
          <Zap className="h-3.5 w-3.5 fill-[#EA5A0C] text-[#EA5A0C]" />
          <Zap className="h-3.5 w-3.5 fill-[#EA5A0C] text-[#EA5A0C]" />
        </div>
      ),
    },
    {
      title: "STAY DURATION",
      value: "2–4h",
      description: "For deep work",
      icon: Clock,
      bar: (
        <div className="inline-flex items-center gap-1 mt-2 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
          <ShieldCheck className="h-3 w-3 text-emerald-600" />
          <span className="text-[9px] font-bold text-emerald-600 uppercase tracking-wider">Optimal</span>
        </div>
      ),
    },
  ];

  return (
    <section className="relative w-full bg-background flex flex-col items-center">
      
      {/* Hero Banner Container */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-8">
        <div className="relative w-full aspect-[21/9] min-h-[360px] sm:min-h-[440px] rounded-[32px] overflow-hidden card-shadow">
          <Image
            src="/work-study-hero.png"
            alt="Work and Study Workspace"
            fill
            priority
            className="object-cover object-center"
          />
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/30 backdrop-blur-[1px]" />
          
          {/* Centered Overlay Card matching Figma */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 sm:p-10 z-10">
            <div className="max-w-2xl bg-white/95 backdrop-blur-md rounded-[28px] p-6 sm:p-10 card-shadow border border-primary/5">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold font-serif text-[#5A2E0C] mb-3 leading-tight">
                Your Ideal Third Space
              </h1>
              <p className="text-xs sm:text-sm text-foreground/75 leading-relaxed font-sans max-w-lg mx-auto mb-6">
                A sanctuary designed for focus and productivity. Experience the perfect blend of artisan coffee and a tech-optimized environment.
              </p>

              {/* Feature Badges */}
              <div className="flex flex-wrap gap-2 justify-center mb-6">
                <span className="inline-flex items-center gap-1.5 text-[11px] font-bold px-3.5 py-1.5 bg-[#FAF6F0] border border-primary/10 rounded-full text-primary/80">
                  <Wifi className="h-3.5 w-3.5 text-accent" /> High-Speed Wi-Fi
                </span>
                <span className="inline-flex items-center gap-1.5 text-[11px] font-bold px-3.5 py-1.5 bg-[#FAF6F0] border border-primary/10 rounded-full text-primary/80">
                  <Volume2 className="h-3.5 w-3.5 text-accent" /> Quiet Environment
                </span>
                <span className="inline-flex items-center gap-1.5 text-[11px] font-bold px-3.5 py-1.5 bg-[#FAF6F0] border border-primary/10 rounded-full text-primary/80">
                  <Zap className="h-3.5 w-3.5 text-accent" /> Power Outlets
                </span>
                <span className="inline-flex items-center gap-1.5 text-[11px] font-bold px-3.5 py-1.5 bg-[#FAF6F0] border border-primary/10 rounded-full text-primary/80">
                  <Coffee className="h-3.5 w-3.5 text-accent" /> Fresh Coffee
                </span>
              </div>

              {/* Buttons matching Figma */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
                <button
                  onClick={() => {
                    const elem = document.getElementById("passes");
                    if (elem) elem.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="w-full sm:w-auto px-8 py-3.5 border border-transparent text-xs font-bold rounded-full text-white bg-[#2A1506] hover:bg-[#2A1506]/90 transition-all shadow-md cursor-pointer uppercase tracking-wider"
                >
                  Explore Spaces
                </button>
                <Link
                  href="/book"
                  className="w-full sm:w-auto px-8 py-3.5 border border-primary/20 text-xs font-bold rounded-full text-primary bg-white hover:bg-foreground/5 transition-all shadow-sm cursor-pointer uppercase tracking-wider text-center"
                >
                  Book Workspace
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Work Suitability Score Grid Section */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-left">
        <div className="mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold font-serif text-[#5A2E0C] mb-1">
            Work Suitability Score
          </h2>
          <p className="text-xs text-foreground/70 font-sans">
            Real-time metrics to help you plan your productive session.
          </p>
        </div>

        {/* 4 columns Suitability Grid matching Figma */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {suitabilityScores.map((score, idx) => {
            const Icon = score.icon;
            return (
              <div
                key={idx}
                className="bg-white p-6 rounded-[24px] border border-primary/5 card-shadow flex flex-col items-center text-center justify-between min-h-[170px]"
              >
                <div className="h-11 w-11 rounded-full bg-[#FAF6F0] flex items-center justify-center mb-3 border border-primary/10 text-primary">
                  <Icon className="h-5 w-5 stroke-[1.75]" />
                </div>

                <div>
                  <span className="text-[10px] font-bold text-foreground/45 uppercase tracking-wider block mb-1">
                    {score.title}
                  </span>
                  <span className="text-2xl font-bold font-serif text-primary block mb-0.5">
                    {score.value}
                  </span>
                  <span className="text-[10px] text-foreground/60 font-semibold">
                    {score.description}
                  </span>
                </div>

                <div className="w-full flex justify-center mt-2">
                  {score.bar}
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </section>
  );
}
