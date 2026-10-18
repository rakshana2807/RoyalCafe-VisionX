"use client";

export default function LiveHeader() {
  return (
    <section className="bg-background flex flex-col items-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">

        <div className="text-center py-6 animate-fade-in">
          <div className="inline-flex items-center justify-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Live Now</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold font-serif text-primary mb-5 leading-tight">
            Live Cafe Availability
          </h1>
          
          <p className="text-base sm:text-lg text-primary/80 font-medium max-w-2xl mx-auto">
            Find your perfect seat and see what&apos;s available right now.
          </p>
        </div>

      </div>
    </section>
  );
}
