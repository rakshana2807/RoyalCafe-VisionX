"use client";

import { Camera, ThumbsUp, Briefcase, MessageSquare } from "lucide-react";

export default function SocialLinks() {
  const socials = [
    {
      name: "Instagram",
      handle: "@royalcafe.connect",
      stats: "12.5k Followers",
      icon: Camera,
      color: "hover:text-pink-600",
      link: "https://instagram.com",
    },
    {
      name: "Facebook",
      handle: "/royalcafeconnect",
      stats: "8.4k Likes",
      icon: ThumbsUp,
      color: "hover:text-blue-600",
      link: "https://facebook.com",
    },
    {
      name: "LinkedIn",
      handle: "/company/royalcafeconnect",
      stats: "5.2k Members",
      icon: Briefcase,
      color: "hover:text-sky-600",
      link: "https://linkedin.com",
    },
    {
      name: "X (Twitter)",
      handle: "@royalcafeconnect",
      stats: "15.1k Followers",
      icon: MessageSquare,
      color: "hover:text-zinc-900",
      link: "https://twitter.com",
    },
  ];

  return (
    <section className="py-16 bg-background/50 text-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-12 animate-fade-in">
          <h2 className="text-3xl sm:text-4xl font-bold font-serif text-primary mb-4">
            Stay Connected
          </h2>
          <p className="text-base text-foreground/75 font-sans">
            Follow our community feeds for daily specials updates, remote work tips, and community highlights.
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {socials.map((social, idx) => {
            const Icon = social.icon;
            return (
              <div
                key={idx}
                className="bg-white p-6 rounded-3xl border border-primary/5 flex flex-col justify-between items-center text-center card-shadow card-shadow-hover h-full"
              >
                <div>
                  {/* Icon */}
                  <div className={`h-14 w-14 rounded-2xl bg-primary/5 flex items-center justify-center mb-4 border border-primary/10 transition-colors ${social.color}`}>
                    <Icon className="h-6 w-6 stroke-[1.75]" />
                  </div>

                  {/* Title & Stats */}
                  <h3 className="text-lg font-bold font-serif text-primary mb-1">
                    {social.name}
                  </h3>
                  <span className="text-xs font-bold text-accent block mb-1">
                    {social.handle}
                  </span>
                  <span className="text-[10px] text-foreground/50 font-semibold block mb-6 uppercase tracking-wider">
                    {social.stats}
                  </span>
                </div>

                {/* Button */}
                <a
                  href={social.link}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-2.5 px-4 border border-primary/20 text-xs font-bold rounded-full text-primary hover:bg-foreground/5 transition-all shadow-sm cursor-pointer text-center uppercase tracking-wider"
                >
                  Visit Profile
                </a>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
