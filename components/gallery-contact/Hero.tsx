"use client";

export default function Hero() {
  const handleScrollTo = (id: string) => {
    const elem = document.getElementById(id);
    if (elem) {
      window.scrollTo({
        top: elem.offsetTop - 80,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="pt-32 pb-10 bg-background text-foreground flex flex-col items-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center animate-fade-in">
        
        {/* Badges row */}
        <div className="flex flex-wrap gap-2 justify-center mb-6">
          {["Modern Workspace", "Premium Coffee", "High-Speed Wi-Fi", "Cozy Ambience"].map((badge, idx) => (
            <span
              key={idx}
              className="inline-flex items-center text-xs font-bold px-3.5 py-1.5 bg-primary/5 border border-primary/10 rounded-full text-primary"
            >
              • {badge}
            </span>
          ))}
        </div>

        {/* Title */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold font-serif text-primary leading-tight max-w-4xl mx-auto mb-6">
          Experience RoyalCafe Connect
        </h1>

        {/* Subtitle */}
        <p className="text-sm sm:text-base md:text-lg text-foreground/80 leading-relaxed max-w-2xl mx-auto mb-10 font-sans">
          Take a closer look at our premium workspace, handcrafted coffee, modern interiors, and welcoming atmosphere. Visit us and discover the perfect place to work, study, and relax.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            onClick={() => handleScrollTo("gallery")}
            className="w-full sm:w-auto px-8 py-3.5 border border-transparent text-sm font-bold rounded-full text-white bg-primary hover:bg-primary/95 transition-all shadow-md hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            Explore Gallery
          </button>
          
          <button
            onClick={() => handleScrollTo("contact-form")}
            className="w-full sm:w-auto px-8 py-3.5 border border-primary/20 text-sm font-bold rounded-full text-primary bg-white hover:bg-foreground/5 transition-all shadow-md hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            Contact Us
          </button>
        </div>

      </div>
    </section>
  );
}
