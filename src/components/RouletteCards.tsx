"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useTheme } from "@/lib/ThemeContext";

export interface ServiceCardData {
  number: string;
  title: string;
  shortTitle: string;
  category: string;
  description: string;
  image: string;
  slug: string;
  ctaText?: string;
}

// Exactly 5 services as strictly required
export const defaultServices: ServiceCardData[] = [
  {
    number: "01",
    title: "WEB DEVELOPMENT",
    shortTitle: "WEB DEV",
    category: "Core Engineering",
    description:
      "Modern, responsive and high-performance websites built for real businesses and brands.",
    image: "/services/web-development.jpg",
    slug: "web-development",
    ctaText: "EXPLORE SERVICE",
  },
  {
    number: "02",
    title: "BRANDING",
    shortTitle: "BRANDING",
    category: "Brand Identity",
    description:
      "Strategic visual identities that make brands recognizable, memorable and consistent.",
    image: "/services/brand-identity.jpg",
    slug: "branding",
    ctaText: "EXPLORE SERVICE",
  },
  {
    number: "03",
    title: "GRAPHIC DESIGN",
    shortTitle: "GRAPHICS",
    category: "Visual Design",
    description:
      "Creative visual communication, marketing materials, social media designs and digital artwork.",
    image: "/services/graphic-design.jpg",
    slug: "graphic-design",
    ctaText: "EXPLORE SERVICE",
  },
  {
    number: "04",
    title: "DIGITAL MARKETING",
    shortTitle: "MARKETING",
    category: "Growth Strategy",
    description:
      "Creative digital strategies that help brands reach the right audience and grow online.",
    image: "/services/digital-marketing.jpg",
    slug: "digital-marketing",
    ctaText: "EXPLORE SERVICE",
  },
  {
    number: "05",
    title: "AI AGENTS",
    shortTitle: "AI AGENTS",
    category: "Smart Automation",
    description:
      "Intelligent AI-powered agents designed to automate tasks, improve workflows and create smarter digital experiences.",
    image: "/services/ai-agents.jpg",
    slug: "ai-agents",
    ctaText: "EXPLORE SERVICE",
  },
];

// Motion timing constants
const TRANSITION_DURATION = 1.05; // ~1050ms smooth transition
const HOLD_DURATION_MS = 750; // ~750ms hold when settled
const TOTAL_CYCLE_MS = (TRANSITION_DURATION * 1000) + HOLD_DURATION_MS; // ~1800ms total
const CINEMATIC_BEZIER = [0.25, 1, 0.35, 1] as const;

interface RouletteCardsProps {
  services?: ServiceCardData[];
  onSelectService?: (serviceName: string) => void;
  selectedSlug?: string;
  initialSelectedSlug?: string;
}

export default function RouletteCards({
  services = defaultServices,
  onSelectService,
  selectedSlug,
  initialSelectedSlug,
}: RouletteCardsProps) {
  const router = useRouter();
  const { theme } = useTheme();
  const isLight = theme === "light";
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [viewportWidth, setViewportWidth] = useState<number>(1200);

  // Measure container width responsively
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        setViewportWidth(containerRef.current.offsetWidth);
      } else if (typeof window !== "undefined") {
        setViewportWidth(window.innerWidth);
      }
    };

    handleResize();
    const ro = new ResizeObserver(handleResize);
    if (containerRef.current) {
      ro.observe(containerRef.current);
    }
    window.addEventListener("resize", handleResize);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Continuous auto-rotation: CARD 1 -> CARD 2 -> CARD 3 -> CARD 4 -> CARD 5 -> CARD 1...
  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % services.length);
    }, TOTAL_CYCLE_MS);

    return () => clearInterval(timer);
  }, [isPaused, services.length]);

  // Synchronize with external slug if passed from navigation
  useEffect(() => {
    const targetSlug = selectedSlug || initialSelectedSlug;
    if (!targetSlug) return;
    const clean = targetSlug.toLowerCase();
    const foundIdx = services.findIndex((s) =>
      s.slug.toLowerCase().includes(clean)
    );
    if (foundIdx !== -1) {
      setActiveIndex(foundIdx);
    }
  }, [selectedSlug, initialSelectedSlug, services]);

  // Mobile swipe support
  const touchStartX = useRef<number>(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    if (deltaX < -40) {
      setActiveIndex((prev) => (prev + 1) % services.length);
    } else if (deltaX > 40) {
      setActiveIndex((prev) => (prev - 1 + services.length) % services.length);
    }
  };

  // Navigate to contact section
  const handleExplore = (service: ServiceCardData) => {
    if (onSelectService) {
      onSelectService(service.title);
    }
    const contactEl = document.getElementById("contact");
    if (contactEl) {
      const yOffset = -75;
      const y =
        contactEl.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    } else {
      router.push("/#contact");
    }
  };

  // Dynamic 3D roulette coordinate calculation
  // Calculates translateX, translateY, scale, rotate, opacity, and zIndex for exactly 5 cards
  const getCardTransform = useCallback(
    (cardIndex: number) => {
      // Offset relative to the active card (0 = main/front, 1 = right, 2 = far-right/back, 3 = top-back, 4 = left)
      const offset = (cardIndex - activeIndex + services.length) % services.length;

      // Responsive scale multipliers
      const isMobile = viewportWidth < 640;
      const isTablet = viewportWidth >= 640 && viewportWidth < 1024;

      const spreadMultiplier = isMobile ? 0.38 : isTablet ? 0.72 : 1.0;
      const verticalMultiplier = isMobile ? 0.45 : isTablet ? 0.75 : 1.0;

      switch (offset) {
        case 0:
          // MAIN / FRONT CARD: Large, visually dominant, scale 1.0, 0deg, opacity 1.0, highest z-index
          return {
            x: 0,
            y: 0,
            scale: 1.0,
            rotate: 0,
            opacity: 1.0,
            zIndex: 30,
            pointerEvents: "auto" as const,
          };
        case 1:
          // Card 2 (Right side): Slightly smaller, tilted slightly right
          return {
            x: 275 * spreadMultiplier,
            y: 20 * verticalMultiplier,
            scale: isMobile ? 0.82 : 0.88,
            rotate: 4.5,
            opacity: 0.85,
            zIndex: 20,
            pointerEvents: "auto" as const,
          };
        case 2:
          // Card 5 (Far Right / moving toward back): Smaller, more transparent, behind
          return {
            x: 395 * spreadMultiplier,
            y: -26 * verticalMultiplier,
            scale: isMobile ? 0.72 : 0.78,
            rotate: 7.5,
            opacity: isMobile ? 0.25 : 0.45,
            zIndex: 10,
            pointerEvents: "auto" as const,
          };
        case 3:
          // Card 4 (Center-Back / top): Background focal depth, smaller, lowest layer
          return {
            x: -145 * spreadMultiplier,
            y: -48 * verticalMultiplier,
            scale: isMobile ? 0.70 : 0.75,
            rotate: -6,
            opacity: isMobile ? 0.22 : 0.40,
            zIndex: 8,
            pointerEvents: "auto" as const,
          };
        case 4:
          // Card 3 (Left side): Slightly smaller, tilted slightly left, ready to rotate
          return {
            x: -275 * spreadMultiplier,
            y: 18 * verticalMultiplier,
            scale: isMobile ? 0.82 : 0.88,
            rotate: -4.5,
            opacity: 0.85,
            zIndex: 20,
            pointerEvents: "auto" as const,
          };
        default:
          return {
            x: 0,
            y: 0,
            scale: 0.8,
            rotate: 0,
            opacity: 0.5,
            zIndex: 10,
            pointerEvents: "auto" as const,
          };
      }
    },
    [activeIndex, services.length, viewportWidth]
  );

  // Responsive card dimensions
  const cardWidth =
    viewportWidth < 640 ? 290 : viewportWidth < 1024 ? 330 : 385;
  const cardHeight =
    viewportWidth < 640 ? 460 : viewportWidth < 1024 ? 490 : 530;

  const currentService = services[activeIndex];

  return (
    <div
      ref={containerRef}
      id="roulette-cards-showcase"
      className="relative w-full flex flex-col items-center select-none py-6 overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      aria-label="3D Rotating Roulette Card Showcase"
    >
      {/* Top Header Status & Step Indicators */}
      <div className="flex items-center justify-between w-full max-w-5xl px-4 mb-6">
        <div className="flex items-center gap-2 sm:gap-3">
          <span className="font-mono text-xs font-black text-yellow-400 tracking-wider">
            {currentService.number}
          </span>
          <span className="font-mono text-xs text-zinc-600">/ 05</span>
          <span className="text-zinc-700 text-xs">•</span>
          <span className="text-xs font-mono uppercase tracking-wider text-zinc-400">
            {currentService.category}
          </span>
        </div>

        {/* 5-Card Step Indicator Dots */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {services.map((s, idx) => {
            const isCurrent = activeIndex === idx;
            return (
              <button
                key={s.number}
                type="button"
                id={`roulette-step-${s.number}`}
                onClick={() => setActiveIndex(idx)}
                aria-label={`Select service ${s.number}: ${s.title}`}
                className={`h-1.5 rounded-full transition-all duration-500 cursor-pointer ${
                  isCurrent
                    ? "w-8 bg-yellow-400 shadow-[0_0_8px_rgba(250,204,21,0.5)]"
                    : "w-2.5 bg-zinc-800 hover:bg-zinc-600"
                }`}
              />
            );
          })}
        </div>
      </div>

      {/* 3D Roulette Stage Container */}
      <div
        className="relative w-full flex items-center justify-center"
        style={{
          height: `${cardHeight + 40}px`,
          perspective: "1200px",
        }}
      >
        {/* Soft edge blur masks to maintain focus, dynamically adapting to active theme */}
        <div
          className={`carousel-edge-gradient-left pointer-events-none absolute left-0 top-0 bottom-0 w-8 sm:w-20 z-40 transition-colors duration-300 ${
            isLight
              ? "bg-gradient-to-r from-[#f8fafc] via-[#f8fafc]/80 to-transparent"
              : "bg-gradient-to-r from-black via-black/80 to-transparent"
          }`}
          aria-hidden="true"
        />
        <div
          className={`carousel-edge-gradient-right pointer-events-none absolute right-0 top-0 bottom-0 w-8 sm:w-20 z-40 transition-colors duration-300 ${
            isLight
              ? "bg-gradient-to-l from-[#f8fafc] via-[#f8fafc]/80 to-transparent"
              : "bg-gradient-to-l from-black via-black/80 to-transparent"
          }`}
          aria-hidden="true"
        />

        {/* EXACTLY 5 CARDS: Continuously Rotating Around the Central Focal Point */}
        {services.map((service, index) => {
          const transform = getCardTransform(index);
          const isMain = index === activeIndex;

          return (
            <motion.div
              key={service.number}
              id={`roulette-card-${service.number}`}
              onClick={() => {
                if (isMain) {
                  handleExplore(service);
                } else {
                  setActiveIndex(index);
                }
              }}
              animate={{
                x: transform.x,
                y: transform.y,
                scale: transform.scale,
                rotate: transform.rotate,
                opacity: transform.opacity,
                zIndex: transform.zIndex,
              }}
              transition={{
                duration: TRANSITION_DURATION,
                ease: CINEMATIC_BEZIER,
              }}
              style={{
                width: `${cardWidth}px`,
                height: `${cardHeight}px`,
                position: "absolute",
                transformOrigin: "center center",
                willChange: "transform, opacity",
              }}
              className={`rounded-2xl sm:rounded-3xl bg-zinc-950 p-6 sm:p-7 flex flex-col justify-between cursor-pointer overflow-hidden transition-colors duration-500 ${
                isMain
                  ? "border border-yellow-400/60 shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_30px_rgba(250,204,21,0.08)]"
                  : "border border-zinc-850 hover:border-zinc-700 shadow-xl"
              }`}
            >
              {/* Front Card Top Hairline Golden Accent */}
              <div
                className={`absolute top-0 left-0 right-0 h-[1.5px] transition-opacity duration-500 ${
                  isMain
                    ? "bg-gradient-to-r from-transparent via-yellow-400 to-transparent opacity-100"
                    : "opacity-0"
                }`}
              />

              {/* Card Top: Number & Category Badge */}
              <div className="flex items-center justify-between w-full pb-3 border-b border-zinc-900">
                <div className="flex items-center gap-2">
                  <span
                    className={`font-mono text-sm sm:text-base font-black transition-colors duration-300 ${
                      isMain ? "text-yellow-400" : "text-zinc-500"
                    }`}
                  >
                    {service.number}
                  </span>
                  <span className="text-zinc-600 font-mono text-xs">/ 05</span>
                </div>

                <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-wider text-zinc-400 px-2.5 py-0.5 rounded-full border border-zinc-800 bg-zinc-900/60">
                  {service.category}
                </span>
              </div>

              {/* Card Center: Visual Showcase with Aspect Ratio */}
              <div className="relative w-full h-[190px] sm:h-[220px] rounded-xl overflow-hidden border border-zinc-850 bg-zinc-900 my-3 group/img">
                {/* Browser-style minimal dots */}
                <div className="absolute top-2.5 left-3 z-10 flex items-center gap-1.5 opacity-60">
                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-600" />
                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-700" />
                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-700" />
                </div>

                <Image
                  src={service.image}
                  alt={service.title}
                  fill
                  sizes="(max-width: 640px) 280px, 385px"
                  className="object-cover transition-transform duration-700 group-hover/img:scale-105"
                  priority={index === activeIndex}
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-transparent to-transparent pointer-events-none" />
              </div>

              {/* Card Bottom: Typography & Interactive Action */}
              <div className="flex flex-col gap-2 pt-1">
                <h3
                  className={`text-xl sm:text-2xl font-black uppercase tracking-tight leading-tight transition-colors duration-300 ${
                    isMain ? "text-white" : "text-zinc-400"
                  }`}
                >
                  {service.title}
                </h3>

                <p className="text-xs sm:text-sm text-zinc-400 font-normal leading-relaxed line-clamp-2">
                  {service.description}
                </p>

                <div className="pt-2 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleExplore(service);
                    }}
                    className={`inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                      isMain
                        ? "text-yellow-400 hover:text-yellow-300"
                        : "text-zinc-500 hover:text-zinc-300"
                    }`}
                  >
                    <span>{service.ctaText || "Explore Service"}</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                  </button>

                  <span className="text-[10px] font-mono text-zinc-600 uppercase">
                    GEN-M SUITE
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
