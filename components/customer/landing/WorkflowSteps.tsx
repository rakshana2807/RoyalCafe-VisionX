"use client";

import Image from "next/image";

export default function WorkflowSteps() {
  const steps = [
    {
      num: "1",
      title: "Explore",
      description: "Browse our spaces, menu, and check live capacity in real-time.",
    },
    {
      num: "2",
      title: "Choose Your Space",
      description: "Select from hot desks, quiet zones, or meeting rooms that suit your needs.",
    },
    {
      num: "3",
      title: "Book Your Seat",
      description: "Reserve your spot online and receive a confirmation email instantly.",
    },
    {
      num: "4",
      title: "Visit & Enjoy",
      description: "Check in at the counter, grab your coffee, and get in your flow state.",
    },
  ];

  return (
    <section className="py-20 bg-background/50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: App Seating Map Image (5 cols) */}
          <div className="lg:col-span-5 relative w-full aspect-[4/5] rounded-2xl overflow-hidden card-shadow max-w-md mx-auto">
            <Image
              src="/workflow-phone.png"
              alt="Seating map booking app mockup"
              fill
              className="object-cover object-center"
            />
          </div>

          {/* Right Column: Timeline steps (7 cols) */}
          <div className="lg:col-span-7 flex flex-col justify-center pl-0 lg:pl-8">
            <h2 className="text-3xl sm:text-4xl font-bold font-serif text-foreground mb-12 text-left">
              Four Steps to Your Flow State
            </h2>

            {/* Timeline List */}
            <div className="relative pl-8 sm:pl-10 flex flex-col gap-10">
              
              {/* Timeline Connector Line */}
              <div className="absolute left-[17px] sm:left-[21px] top-4 bottom-4 w-[2px] bg-primary/15" />

              {steps.map((step, index) => (
                <div key={index} className="relative group">
                  {/* Circle number indicator */}
                  <div className="absolute -left-[41px] sm:-left-[45px] top-0.5 h-[28px] w-[28px] sm:h-[34px] sm:w-[34px] rounded-full bg-background border-2 border-primary text-primary font-serif font-bold text-xs sm:text-sm flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all duration-300 z-10">
                    {step.num}
                  </div>

                  {/* Title & Description */}
                  <div className="text-left">
                    <h3 className="text-base sm:text-lg font-bold font-serif text-primary mb-1.5">
                      {step.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-foreground/80 leading-relaxed max-w-lg">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
