"use client";

import React, { useState, useRef } from "react";
import { Sparkles, Zap, Shield, ArrowRight } from "lucide-react";
import { CounterRoll } from "./TextAnimations";

interface WhoWeAreCardData {
  num: string;
  title: string;
  badge: string;
  icon: React.ElementType;
  desc: string;
  subtext: string;
  highlights: string[];
  stats: string;
  statsLabel: string;
}

const cardsData: WhoWeAreCardData[] = [
  {
    num: "01",
    title: "Who is Gen-M?",
    badge: "Identity & Origin",
    icon: Sparkles,
    desc: "Gen-M is a modern digital studio focused on building high-quality websites, memorable brand identities, and smart AI solutions.",
    subtext: "We help businesses grow by designing clean user experiences, developing fast modern websites, and setting up practical automation tools.",
    highlights: [
      "Direct communication with senior product creators",
      "Zero junior hand-offs or outsourced agency bloat",
      "End-to-end: brand design, production code, and AI deployment",
    ],
    stats: "100%",
    statsLabel: "Direct Founder Access",
  },
  {
    num: "02",
    title: "What Problem Do We Solve?",
    badge: "Problem & Impact",
    icon: Zap,
    desc: "Many businesses struggle with outdated designs, slow websites, and manual workflows that hold back their growth.",
    subtext: "We fix this by providing complete, reliable digital solutions so your brand looks professional and runs smoothly.",
    highlights: [
      "Sub-second Next.js page speeds built to convert visitors",
      "Intentional design with zero unnecessary clutter",
      "Practical AI automation to streamline daily operations",
    ],
    stats: "< 1s",
    statsLabel: "Target Page Load Speeds",
  },
  {
    num: "03",
    title: "What Is Our Approach?",
    badge: "Method & Standard",
    icon: Shield,
    desc: "We focus on clean visual design, fast and reliable development, and clear, ongoing communication with every client.",
    subtext: "We work directly with founders and teams, offering transparent pricing, regular updates, and ongoing support for your peace of mind.",
    highlights: [
      "Clear deliverables with every scheduled milestone",
      "Direct accountability with senior designers and engineers",
      "100% code ownership with clean, open repositories",
    ],
    stats: "100%",
    statsLabel: "Client Code Ownership",
  },
];

export default function InteractiveWhoWeAreCards() {
  // Middle card (index 1) is active initially as requested
  const [activeCardIndex, setActiveCardIndex] = useState<number>(1);
  const [mousePos, setMousePos] = useState<{ [key: string]: { x: number; y: number } }>({});

  const touchStartXRef = useRef<number | null>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>, cardNum: string) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos((prev) => ({
      ...prev,
      [cardNum]: {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      },
    }));
  };

  // Touch gesture support for mobile swiping
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartXRef.current - touchEndX;
    if (Math.abs(diff) > 45) {
      if (diff > 0) {
        // swipe left -> next card
        setActiveCardIndex((prev) => Math.min(prev + 1, cardsData.length - 1));
      } else {
        // swipe right -> prev card
        setActiveCardIndex((prev) => Math.max(prev - 1, 0));
      }
    }
    touchStartXRef.current = null;
  };

  return (
    <div
      className="w-full flex flex-col md:flex-row gap-4 sm:gap-6 lg:gap-8 items-stretch select-none overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      aria-label="Interactive Who We Are Slider"
    >
      {cardsData.map((card, idx) => {
        const Icon = card.icon;
        const isSelected = activeCardIndex === idx;
        const pos = mousePos[card.num] || { x: 150, y: 150 };

        return (
          <div
            key={card.num}
            id={`who-we-are-card-${card.num}`}
            onClick={() => setActiveCardIndex(idx)}
            onMouseMove={(e) => handleMouseMove(e, card.num)}
            onMouseEnter={() => setActiveCardIndex(idx)}
            style={{
              // Horizontal slider flex-grow expansion: active card expands smoothly to flex 2.4, others contract to flex 1
              flexGrow: isSelected ? 2.4 : 1,
              flexShrink: 1,
              flexBasis: "0%",
            }}
            className={`group relative rounded-2xl border cursor-pointer overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] flex flex-col justify-between ${
              isSelected
                ? "bg-zinc-950 border-yellow-400 shadow-2xl shadow-yellow-400/10 md:scale-[1.01] p-6 sm:p-8 md:p-9"
                : "bg-zinc-950/70 border-zinc-850 hover:border-zinc-700 shadow-xl p-5 sm:p-6 md:p-7 md:opacity-90"
            }`}
          >
            {/* Dynamic Spotlight Glow tracking mouse cursor */}
            <div
              className="pointer-events-none absolute -inset-px opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"
              style={{
                background: `radial-gradient(360px circle at ${pos.x}px ${pos.y}px, rgba(250, 204, 21, 0.12), transparent 70%)`,
              }}
            />

            {/* Subtle top indicator bar on active card */}
            <div
              className={`absolute top-0 left-0 right-0 h-1 transition-all duration-700 ${
                isSelected ? "bg-yellow-400 shadow-[0_0_8px_#facc15]" : "bg-transparent"
              }`}
            />

            <div className="relative z-10 flex flex-col gap-4 sm:gap-5 w-full">
              {/* Top Meta Header */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span
                    className={`font-mono text-xs font-bold px-3 py-1 rounded-full transition-all duration-500 border ${
                      isSelected
                        ? "bg-yellow-400 text-black border-yellow-400 shadow-md"
                        : "bg-yellow-400/10 text-yellow-400 border-yellow-400/20"
                    }`}
                  >
                    <CounterRoll target={parseInt(card.num, 10)} prefix="" duration={0.8} />
                  </span>

                  {/* Active Featured Badge */}
                  {isSelected && (
                    <span className="hidden lg:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-zinc-900 border border-zinc-800 text-[10px] font-mono text-yellow-400 uppercase tracking-wider animate-fadeIn">
                      <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse" />
                      Featured
                    </span>
                  )}
                </div>

                <div
                  className={`w-10 h-10 rounded-xl border flex items-center justify-center transition-all duration-500 shrink-0 ${
                    isSelected
                      ? "bg-yellow-400/20 border-yellow-400/60 text-yellow-400 scale-110 shadow-lg shadow-yellow-400/10"
                      : "bg-zinc-900 border-zinc-800 text-zinc-400 group-hover:text-yellow-400 group-hover:border-zinc-700"
                  }`}
                >
                  <Icon className="w-4 h-4 transition-transform group-hover:scale-110" />
                </div>
              </div>

              {/* Badge */}
              <span className="text-[11px] font-mono text-yellow-400 font-bold uppercase tracking-wider transition-colors">
                {card.badge}
              </span>

              {/* Title with smooth scaling & emphasis */}
              <h4
                className={`font-extrabold tracking-tight transition-all duration-500 leading-tight ${
                  isSelected
                    ? "text-2xl sm:text-3xl lg:text-3xl text-white group-hover:text-yellow-400"
                    : "text-lg sm:text-xl lg:text-2xl text-zinc-200 group-hover:text-white"
                }`}
              >
                {card.title}
              </h4>

              {/* Description */}
              <p
                className={`transition-all duration-500 leading-relaxed font-normal ${
                  isSelected
                    ? "text-sm sm:text-base text-zinc-200"
                    : "text-xs sm:text-sm text-zinc-400 line-clamp-3 md:line-clamp-4"
                }`}
              >
                {card.desc}
              </p>

              {/* Subtext - smooth fade & expand */}
              <p
                className={`transition-all duration-500 leading-relaxed ${
                  isSelected
                    ? "text-xs sm:text-sm text-zinc-400 opacity-100 max-h-40"
                    : "text-xs text-zinc-500 opacity-80 md:opacity-90 max-h-24 overflow-hidden"
                }`}
              >
                {card.subtext}
              </p>
            </div>

            {/* Bottom active status / click prompt */}
            <div className="relative z-10 pt-4 mt-2 border-t border-zinc-900/80 flex items-center justify-between text-xs">
              <span
                className={`font-mono transition-colors duration-500 ${
                  isSelected ? "text-yellow-400 font-semibold" : "text-zinc-500 group-hover:text-zinc-400"
                }`}
              >
                {isSelected ? "Active Focus" : "Click / Hover to Expand"}
              </span>

              <ArrowRight
                className={`w-3.5 h-3.5 transition-all duration-500 ${
                  isSelected
                    ? "text-yellow-400 translate-x-0 opacity-100"
                    : "text-zinc-600 -translate-x-1 opacity-60 group-hover:translate-x-0 group-hover:opacity-100 group-hover:text-zinc-300"
                }`}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
