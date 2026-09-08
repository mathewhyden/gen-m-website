"use client";

import React from "react";

interface WhoWeAreCardData {
  num: string;
  title: string;
  badge: string;
  desc: string;
  subtext: string;
}

const cardsData: WhoWeAreCardData[] = [
  {
    num: "01",
    title: "Who is Gen-M?",
    badge: "Identity & Origin",
    desc: "Gen-M is a modern digital studio focused on building high-quality websites, memorable brand identities, and smart AI solutions.",
    subtext: "We help businesses grow by designing clean user experiences, developing fast modern websites, and setting up practical automation tools.",
  },
  {
    num: "02",
    title: "What Problem Do We Solve?",
    badge: "Problem & Impact",
    desc: "Many businesses struggle with outdated designs, slow websites, and manual workflows that hold back their growth.",
    subtext: "We fix this by providing complete, reliable digital solutions so your brand looks professional and runs smoothly.",
  },
  {
    num: "03",
    title: "What Is Our Approach?",
    badge: "Method & Standard",
    desc: "We focus on clean visual design, fast and reliable development, and clear, ongoing communication with every client.",
    subtext: "We work directly with founders and teams, offering transparent pricing, regular updates, and ongoing support for your peace of mind.",
  },
];

export default function InteractiveWhoWeAreCards() {
  return (
    <div
      className="w-full grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6 items-stretch select-none"
      aria-label="Who We Are Information Cards"
    >
      {cardsData.map((card) => {
        return (
          <div
            key={card.num}
            id={`who-we-are-card-${card.num}`}
            className="group relative rounded-2xl border border-zinc-850 hover:border-zinc-700/90 bg-zinc-950/90 p-7 sm:p-8 flex flex-col justify-between transition-colors duration-300 overflow-hidden"
          >
            {/* Top Subtle Hairline Indicator */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-yellow-400/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <div className="flex flex-col gap-4 w-full">
              {/* Number & Category Header */}
              <div className="flex items-center justify-between pb-2 border-b border-zinc-900/80">
                <span className="font-mono text-xs font-bold text-yellow-400 tracking-wider">
                  {card.num}
                </span>
                <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider">
                  {card.badge}
                </span>
              </div>

              {/* Title */}
              <h4 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white group-hover:text-yellow-400 transition-colors duration-200 leading-snug pt-1">
                {card.title}
              </h4>

              {/* Primary Narrative */}
              <p className="text-sm text-zinc-300 font-normal leading-relaxed">
                {card.desc}
              </p>

              {/* Secondary Detail */}
              <p className="text-xs sm:text-sm text-zinc-400 font-normal leading-relaxed pt-1">
                {card.subtext}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

