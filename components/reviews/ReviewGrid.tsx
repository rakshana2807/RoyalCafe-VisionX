"use client";

import { useState } from "react";
import { Star, ThumbsUp, Search, CheckCircle2 } from "lucide-react";

interface Review {
  id: string;
  name: string;
  occupation: string;
  rating: number;
  text: string;
  area: string;
  date: string;
  helpfulCount: number;
  initials: string;
  avatarBg: string;
}

export default function ReviewGrid() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRating, setSelectedRating] = useState<number | "All">("All");

  const [reviewsList, setReviewsList] = useState<Review[]>([
    {
      id: "r1",
      name: "David Kim",
      occupation: "Software Engineer",
      rating: 5,
      text: "Gigabit Wi-Fi and ergonomic chairs make this the best remote work cafe in town. The flat white is consistently amazing.",
      area: "Quiet Zone",
      date: "Oct 14, 2023",
      helpfulCount: 24,
      initials: "DK",
      avatarBg: "bg-emerald-100 text-emerald-900",
    },
    {
      id: "r2",
      name: "Ananya Sharma",
      occupation: "Graduate Student",
      rating: 5,
      text: "Prepared for my final thesis here. Quiet study pods with desk power outlets were a lifesaver. Highly recommend the student pass!",
      area: "Focus Pods",
      date: "Oct 10, 2023",
      helpfulCount: 19,
      initials: "AS",
      avatarBg: "bg-purple-100 text-purple-900",
    },
    {
      id: "r3",
      name: "James Wilson",
      occupation: "Product Manager",
      rating: 4,
      text: "Great meeting booth setup. We hosted our sprint review here and the Wi-Fi handled our video stream effortlessly.",
      area: "Meeting Booths",
      date: "Oct 08, 2023",
      helpfulCount: 15,
      initials: "JW",
      avatarBg: "bg-[#FAF6F0] text-primary border border-primary/10",
    },
    {
      id: "r4",
      name: "Sophia Chen",
      occupation: "UX Designer",
      rating: 5,
      text: "The ambient music is soft and never distracting. Pairing a cold brew with sourdough avocado toast makes my mornings super productive.",
      area: "Window Seats",
      date: "Oct 04, 2023",
      helpfulCount: 31,
      initials: "SC",
      avatarBg: "bg-[#FAF6F0] text-primary border border-primary/10",
    },
    {
      id: "r5",
      name: "Rohan Gupta",
      occupation: "Startup Founder",
      rating: 5,
      text: "Desk booking via the live status page is seamless. Never have to worry about finding a seat during peak hours.",
      area: "Open Workspace",
      date: "Sep 30, 2023",
      helpfulCount: 12,
      initials: "RG",
      avatarBg: "bg-[#FAF6F0] text-primary border border-primary/10",
    },
    {
      id: "r6",
      name: "Emily Watson",
      occupation: "Freelance Writer",
      rating: 4,
      text: "Cozy lounge seating and friendly staff. Love coming here to write articles in the afternoon while sipping matcha lattes.",
      area: "Coffee Lounge",
      date: "Sep 25, 2023",
      helpfulCount: 8,
      initials: "EW",
      avatarBg: "bg-[#FAF6F0] text-primary border border-primary/10",
    },
    {
      id: "r7",
      name: "Liam O'Connor",
      occupation: "Data Analyst",
      rating: 5,
      text: "Unlimited coffee refills on the work pass keep my coding sessions energized. Fast speeds and plenty of charging ports.",
      area: "Focus Pods",
      date: "Sep 20, 2023",
      helpfulCount: 27,
      initials: "LO",
      avatarBg: "bg-[#FAF6F0] text-primary border border-primary/10",
    },
    {
      id: "r8",
      name: "Pooja Mehta",
      occupation: "Content Creator",
      rating: 5,
      text: "Instagrammable interiors, incredible coffee art, and silent focus areas. The best community cafe in the tech district!",
      area: "Quiet Zone",
      date: "Sep 15, 2023",
      helpfulCount: 42,
      initials: "PM",
      avatarBg: "bg-[#FAF6F0] text-primary border border-primary/10",
    },
  ]);

  const handleLike = (id: string) => {
    setReviewsList((prev) =>
      prev.map((r) => (r.id === id ? { ...r, helpfulCount: r.helpfulCount + 1 } : r))
    );
  };

  const filteredReviews = reviewsList.filter((rev) => {
    const matchesSearch =
      rev.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rev.occupation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rev.text.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRating =
      selectedRating === "All" ? true : rev.rating === selectedRating;

    return matchesSearch && matchesRating;
  });

  return (
    <section id="reviews-grid" className="py-20 bg-background/50 text-foreground text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-12 animate-fade-in">
          <h2 className="text-3xl sm:text-4xl font-bold font-serif text-primary mb-4">
            Customer Reviews
          </h2>
          <p className="text-base text-foreground/75 font-sans">
            Filter through verified feedback from our community of coworkers, students, and coffee enthusiasts.
          </p>
        </div>

        {/* Search & Rating Filter Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-10">
          
          {/* Search Input */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-foreground/40" />
            <input
              type="text"
              placeholder="Search reviews by name or keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-full border border-primary/10 bg-white text-xs font-sans focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-sm"
            />
          </div>

          {/* Rating Pills */}
          <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-1 scrollbar-hide">
            {(["All", 5, 4] as const).map((star) => (
              <button
                key={star}
                onClick={() => setSelectedRating(star)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  selectedRating === star
                    ? "bg-primary text-white shadow-sm"
                    : "bg-white text-primary hover:bg-[#FAF6F0] border border-primary/5"
                }`}
              >
                {star === "All" ? "All Ratings" : `${star} Stars`}
              </button>
            ))}
          </div>

        </div>

        {/* 8-12 Review Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredReviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-white p-6 rounded-3xl border border-primary/5 flex flex-col justify-between card-shadow card-shadow-hover text-left h-full"
            >
              <div>
                {/* Header: Avatar, Name, Occupation */}
                <div className="flex items-center gap-3 mb-4">
                  <div className={`h-10 w-10 rounded-full flex items-center justify-center font-bold text-xs shadow-sm ${rev.avatarBg}`}>
                    {rev.initials}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold font-serif text-primary flex items-center gap-1">
                      {rev.name}
                      <CheckCircle2 className="h-3 w-3 text-emerald-500 fill-emerald-100" />
                    </h4>
                    <span className="text-[10px] text-foreground/50 font-medium block">
                      {rev.occupation}
                    </span>
                  </div>
                </div>

                {/* Stars & Visited Area */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex gap-0.5">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="h-3 w-3 fill-accent text-accent" />
                    ))}
                  </div>
                  <span className="text-[9px] font-bold text-accent uppercase tracking-wider bg-accent/5 px-2 py-0.5 rounded border border-accent/10">
                    {rev.area}
                  </span>
                </div>

                {/* Review Text */}
                <p className="text-xs text-foreground/80 leading-relaxed font-sans mb-6">
                  &ldquo;{rev.text}&rdquo;
                </p>
              </div>

              {/* Footer: Date & Helpful Like Counter */}
              <div className="pt-3 border-t border-primary/5 flex items-center justify-between text-[10px] font-semibold text-foreground/50">
                <span>{rev.date}</span>
                <button
                  onClick={() => handleLike(rev.id)}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#FAF6F0] text-primary hover:bg-primary hover:text-white transition-colors cursor-pointer border border-primary/5 active:scale-95"
                >
                  <ThumbsUp className="h-3 w-3 stroke-[2]" />
                  <span>Helpful ({rev.helpfulCount})</span>
                </button>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
