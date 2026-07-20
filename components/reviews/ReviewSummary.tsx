"use client";

import { Star, ThumbsUp, Users, Award } from "lucide-react";

export default function ReviewSummary() {
  const distribution = [
    { stars: "5 Stars", percentage: 82 },
    { stars: "4 Stars", percentage: 13 },
    { stars: "3 Stars", percentage: 3 },
    { stars: "2 Stars", percentage: 1 },
    { stars: "1 Star", percentage: 1 },
  ];

  const stats = [
    { value: "2,500+", label: "Happy Customers", icon: Users },
    { value: "98%", label: "Would Recommend", icon: ThumbsUp },
    { value: "95%", label: "Return Visitors", icon: Award },
    { value: "4.9★", label: "Average Rating", icon: Star },
  ];

  return (
    <section className="py-12 bg-background/50 text-foreground text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Dashboard Card */}
        <div className="bg-white rounded-[2.5rem] p-8 sm:p-12 card-shadow border border-primary/5 mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left: Score Breakdown (5 cols) */}
            <div className="lg:col-span-5 border-b lg:border-b-0 lg:border-r border-primary/10 pb-8 lg:pb-0 lg:pr-8 text-center lg:text-left">
              <span className="text-[10px] font-bold text-accent uppercase tracking-widest block mb-2">
                Overall Score
              </span>
              <h2 className="text-5xl sm:text-6xl font-bold font-serif text-primary mb-3">
                4.9 <span className="text-2xl text-foreground/40 font-normal">/ 5</span>
              </h2>

              <div className="flex justify-center lg:justify-start gap-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-accent text-accent" />
                ))}
              </div>

              <span className="text-xs font-semibold text-foreground/60 block">
                Based on <span className="text-primary font-bold">2,547 verified customer reviews</span>
              </span>
            </div>

            {/* Right: Progress Bars (7 cols) */}
            <div className="lg:col-span-7 space-y-3">
              {distribution.map((item, idx) => (
                <div key={idx} className="flex items-center gap-4 text-xs font-bold text-primary">
                  <span className="w-16 text-right shrink-0">{item.stars}</span>
                  <div className="flex-1 h-2.5 bg-[#FAF6F0] rounded-full overflow-hidden border border-primary/5">
                    <div
                      className="h-full bg-accent transition-all duration-500 rounded-full"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                  <span className="w-10 text-foreground/60 text-right shrink-0">
                    {item.percentage}%
                  </span>
                </div>
              ))}
            </div>

          </div>
        </div>

        {/* 4 Statistics Cards Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div
                key={idx}
                className="bg-white p-6 rounded-2xl border border-primary/5 card-shadow text-center flex flex-col items-center justify-center min-h-[120px] card-shadow-hover"
              >
                <Icon className="h-5 w-5 text-accent mb-2 stroke-[1.75]" />
                <span className="text-2xl sm:text-3xl font-bold font-serif text-primary block mb-1">
                  {stat.value}
                </span>
                <span className="text-[10px] font-bold text-foreground/45 uppercase tracking-wider">
                  {stat.label}
                </span>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
