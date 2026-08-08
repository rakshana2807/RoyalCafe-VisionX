"use client";

import { Sun, GraduationCap, Laptop, Users, Moon } from "lucide-react";

export default function DailySchedule() {
  const schedule = [
    {
      time: "8 AM",
      title: "Best for Morning Productivity",
      description: "Grab a fresh flat white and lock in your first deep work block. The space is calm, quiet, and filled with natural morning light.",
      icon: Sun,
    },
    {
      time: "11 AM",
      title: "Study Sessions",
      description: "Perfect time for students and academics. Grab a window seat or a quiet study zone desk with stable power outlets.",
      icon: GraduationCap,
    },
    {
      time: "2 PM",
      title: "Remote Work Hours",
      description: "The remote work crowd peaks. Collaborate in our meeting booths, attend video calls in focus pods, and refresh with iced coffee.",
      icon: Laptop,
    },
    {
      time: "5 PM",
      title: "Networking & Coffee",
      description: "Wind down in the social lounge. Perfect for casual meetings, networking catch-ups, and brainstorming team ideas.",
      icon: Users,
    },
    {
      time: "8 PM",
      title: "Quiet Focus Time",
      description: "Final study blocks and late-night coding. Grab a quiet cabin seat with lo-fi ambient tracks playing softly in the background.",
      icon: Moon,
    },
  ];

  return (
    <section className="py-20 bg-background/50 text-foreground overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16 animate-fade-in">
          <h2 className="text-3xl sm:text-4xl font-bold font-serif text-primary mb-4">
            Daily Workspace Vibe
          </h2>
          <p className="text-base text-foreground/75 font-sans">
            How the environment transitions throughout the day to support different workflows.
          </p>
        </div>

        {/* Timeline (Connected Dots) */}
        <div className="relative pl-8 sm:pl-10 flex flex-col gap-12 max-w-3xl mx-auto">
          {/* Vertical line connector */}
          <div className="absolute left-[17px] sm:left-[21px] top-4 bottom-4 w-[2px] bg-primary/15" />

          {schedule.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="relative group text-left">
                {/* Circle Number/Badge */}
                <div className="absolute -left-[41px] sm:-left-[45px] top-0.5 h-[28px] w-[28px] sm:h-[34px] sm:w-[34px] rounded-full bg-white border-2 border-primary text-primary font-serif font-bold text-[9px] sm:text-xs flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all duration-300 z-10 shadow-sm">
                  <Icon className="h-3.5 w-3.5" />
                </div>

                {/* Content */}
                <div className="bg-white p-6 rounded-2xl border border-primary/5 card-shadow shadow-sm group-hover:translate-x-1 transition-transform">
                  <span className="text-[10px] font-bold text-accent uppercase tracking-widest block mb-1">
                    {item.time}
                  </span>
                  <h3 className="text-lg font-bold font-serif text-primary mb-2">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-foreground/80 leading-relaxed font-sans">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
