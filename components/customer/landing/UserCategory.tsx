"use client";

import { GraduationCap, Briefcase, Users, Heart } from "lucide-react";

export default function UserCategory() {
  const categories = [
    {
      title: "Students",
      description: "Quiet spots with high-speed WiFi, power outlets & student discounts.",
      icon: GraduationCap,
    },
    {
      title: "Remote Workers",
      description: "Dedicated workstations, video call friendly zones & unlimited coffee.",
      icon: Briefcase,
    },
    {
      title: "Freelancers",
      description: "Flexible seating, networking events & a vibrant community vibe.",
      icon: Users,
    },
    {
      title: "Coffee Lovers",
      description: "Cozy lounge area, premium specialty coffee & regular tastings.",
      icon: Heart,
    },
  ];

  return (
    <section id="work-study" className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold font-serif text-foreground mb-4">
            Designed for Your Workflow
          </h2>
          <p className="text-base text-foreground/75">
            Whether you&apos;re hitting a deadline or catching up with friends, we have the perfect corner for you.
          </p>
        </div>

        {/* 4 Columns Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => {
            const Icon = category.icon;
            return (
              <div
                key={index}
                className="bg-white p-8 rounded-2xl border border-primary/5 text-center flex flex-col items-center card-shadow card-shadow-hover"
              >
                {/* Circular Icon Container */}
                <div className="h-16 w-16 rounded-full bg-[#FAF6F0] border border-primary/5 flex items-center justify-center mb-6">
                  <Icon className="h-7 w-7 text-primary stroke-[1.75]" />
                </div>
                
                {/* Title */}
                <h3 className="text-lg font-bold font-serif text-primary mb-3">
                  {category.title}
                </h3>
                
                {/* Description */}
                <p className="text-sm text-foreground/80 leading-relaxed">
                  {category.description}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
