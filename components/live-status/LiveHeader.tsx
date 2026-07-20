"use client";

export default function LiveHeader() {
  return (
    <section className="pt-32 pb-10 bg-background flex flex-col items-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">

        {/* Main Grid: Info on left, Metrics Card on right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">

          {/* Left Info Column (8 cols) */}
          <div className="lg:col-span-8 text-left animate-fade-in">
            {/* Live Indicator Badge */}
            <div className="inline-flex items-center gap-2 mb-4 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-emerald-600">
                Live Workspace Status
              </span>
            </div>

            {/* Title */}
            <h1 className="text-4xl sm:text-5xl md:text-[52px] leading-[1.1] font-bold font-serif text-primary tracking-tight mb-6">
              Amenities & Availability
            </h1>

            {/* Description */}
            <p className="text-base sm:text-lg text-foreground/80 leading-relaxed max-w-2xl font-sans">
              Real-time occupancy tracking and premium workspace amenities. Find your perfect spot for deep focus or collaborative sessions.
            </p>
          </div>

          {/* Right Metrics Card Column (4 cols) */}
          <div className="lg:col-span-4 w-full animate-fade-in delay-150">
            <div className="bg-white rounded-2xl border border-primary/5 p-6 flex items-center justify-between text-center card-shadow max-w-sm ml-auto mr-auto lg:mr-0">

              {/* Left Side: Current Occupancy */}
              <div className="flex-1">
                <span className="text-3xl sm:text-4xl font-bold font-serif text-primary block mb-1">
                  48%
                </span>
                <span className="text-[10px] sm:text-xs font-bold text-foreground/45 uppercase tracking-wider">
                  Current Occupancy
                </span>
              </div>

              {/* Dividing vertical border */}
              <div className="h-10 w-[1px] bg-primary/10 mx-4" />

              {/* Right Side: Seats Available */}
              <div className="flex-1">
                <span className="text-3xl sm:text-4xl font-bold font-serif text-accent block mb-1">
                  78  
                </span>
                <span className="text-[10px] sm:text-xs font-bold text-foreground/45 uppercase tracking-wider">
                  Seats Available
                </span>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
