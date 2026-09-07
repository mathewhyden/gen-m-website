"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Check, 
  ArrowRight, 
  ChevronLeft, 
  ChevronRight, 
  Layers
} from "lucide-react";
import { ServiceItem } from "@/lib/types";

const serviceImageMap: Record<string, string> = {
  "Brand Identity": "/services/brand-identity.jpg",
  "Branding": "/services/brand-identity.jpg",
  "branding": "/services/brand-identity.jpg",
  "Graphic Design": "/services/graphic-design.jpg",
  "graphic-design": "/services/graphic-design.jpg",
  "Digital Marketing": "/services/digital-marketing.jpg",
  "digital-marketing": "/services/digital-marketing.jpg",
  "AI Agents & Automation": "/services/ai-agents.jpg",
  "AI Agents": "/services/ai-agents.jpg",
  "ai-agents": "/services/ai-agents.jpg",
  "Web Development": "/services/web-development.jpg",
  "web-development": "/services/web-development.jpg",
  "App Development": "/services/app-development.jpg",
  "App Development & CRM": "/services/app-development.jpg",
  "app-development": "/services/app-development.jpg",
};

// Watermark kinetic text map for cinematic Marvel-style background typography
const kineticTextMap: Record<string, string> = {
  "Brand Identity": "IDENTITY",
  "Branding": "BRANDING",
  "Graphic Design": "GRAPHICS",
  "Digital Marketing": "GROWTH",
  "AI Agents & Automation": "AI AGENTS",
  "AI Agents": "AI AGENTS",
  "Web Development": "WEB DEV",
  "App Development": "APP DEV",
};

interface MarvelServiceShowcaseProps {
  services: ServiceItem[];
  onSelectService?: (serviceName: string) => void;
  initialSelectedSlug?: string;
  selectedSlug?: string;
  isStandalonePage?: boolean;
}

export default function MarvelServiceShowcase({
  services,
  onSelectService,
  initialSelectedSlug,
  selectedSlug,
}: MarvelServiceShowcaseProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const railRef = useRef<HTMLDivElement>(null);

  const getServiceSlug = (title: string, id?: string) => {
    if (id && id.length > 2 && !id.startsWith("srv-")) return id;
    const lower = title.toLowerCase();
    if (lower.includes("brand")) return "branding";
    if (lower.includes("graphic")) return "graphic-design";
    if (lower.includes("market")) return "digital-marketing";
    if (lower.includes("ai")) return "ai-agents";
    if (lower.includes("web")) return "web-development";
    if (lower.includes("app")) return "app-development";
    return title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  };

  // Container-only smooth scroll for bottom selector rail (prevents horizontal page shift)
  const scrollRailToCard = useCallback((index: number) => {
    const rail = railRef.current;
    if (!rail) return;
    const cards = rail.querySelectorAll<HTMLButtonElement>(".service-rail-card");
    const card = cards[index];
    if (card) {
      const railRect = rail.getBoundingClientRect();
      const cardRect = card.getBoundingClientRect();
      const cardOffsetLeft = cardRect.left - railRect.left;
      const targetScrollLeft = rail.scrollLeft + cardOffsetLeft - (railRect.width / 2) + (cardRect.width / 2);
      rail.scrollTo({ left: Math.max(0, targetScrollLeft), behavior: "smooth" });
    }
    // Prevent any horizontal window scrolling
    if (typeof window !== "undefined" && window.scrollX !== 0) {
      window.scrollTo({ left: 0, top: window.scrollY });
    }
  }, []);

  // Sync selected slug or hash or initial prop
  useEffect(() => {
    if (!services || services.length === 0) return;

    const findIndexBySlug = (slug: string) => {
      const cleanSlug = slug.toLowerCase().trim();
      const idx = services.findIndex((s) => {
        const cleanTitle = s.title.replace(/ & CRM/gi, "").toLowerCase();
        const currentSlug = getServiceSlug(cleanTitle, s.id).toLowerCase();
        return (
          currentSlug === cleanSlug ||
          s.id.toLowerCase() === cleanSlug ||
          cleanTitle === cleanSlug ||
          cleanTitle.includes(cleanSlug) ||
          cleanSlug.includes(currentSlug)
        );
      });
      return idx >= 0 ? idx : -1;
    };

    if (selectedSlug) {
      const found = findIndexBySlug(selectedSlug);
      if (found !== -1) {
        setActiveIndex(found);
        setTimeout(() => scrollRailToCard(found), 50);
      }
    } else if (initialSelectedSlug) {
      const found = findIndexBySlug(initialSelectedSlug);
      if (found !== -1) {
        setActiveIndex(found);
        setTimeout(() => scrollRailToCard(found), 50);
      }
    }

    const checkHash = () => {
      if (typeof window !== "undefined" && window.location.hash) {
        const hash = window.location.hash.replace("#", "");
        const found = findIndexBySlug(hash);
        if (found !== -1) {
          setActiveIndex(found);
          setTimeout(() => scrollRailToCard(found), 50);
        }
      }
    };

    checkHash();
    window.addEventListener("hashchange", checkHash);

    // Safeguard: lock horizontal page scroll
    const handleScroll = () => {
      if (window.scrollX !== 0) {
        window.scrollTo(0, window.scrollY);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("hashchange", checkHash);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [selectedSlug, initialSelectedSlug, services, scrollRailToCard]);

  const handleSelect = (index: number) => {
    setDirection(index > activeIndex ? 1 : -1);
    setActiveIndex(index);
    // Notify parent if listener exists, but DO NOT trigger page navigation
    if (onSelectService && services[index]) {
      onSelectService(services[index].title);
    }
    scrollRailToCard(index);
  };

  const handlePrev = useCallback(() => {
    setDirection(-1);
    setActiveIndex((prev) => {
      const nextIdx = prev > 0 ? prev - 1 : services.length - 1;
      scrollRailToCard(nextIdx);
      return nextIdx;
    });
  }, [services.length, scrollRailToCard]);

  const handleNext = useCallback(() => {
    setDirection(1);
    setActiveIndex((prev) => {
      const nextIdx = prev < services.length - 1 ? prev + 1 : 0;
      scrollRailToCard(nextIdx);
      return nextIdx;
    });
  }, [services.length, scrollRailToCard]);

  // Keyboard navigation (Arrow keys)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleNext, handlePrev]);

  if (!services || services.length === 0) return null;

  const currentService = services[activeIndex] || services[0];
  const cleanTitle = currentService.title.replace(/ & CRM/gi, "");
  const imageSrc =
    serviceImageMap[cleanTitle] ||
    serviceImageMap[currentService.title] ||
    "/services/web-development.jpg";
  const watermarkText =
    kineticTextMap[cleanTitle] ||
    kineticTextMap[currentService.title] ||
    cleanTitle.split(" ")[0].toUpperCase();

  return (
    <div className="w-full flex flex-col gap-8 relative">
      <div className="relative w-full overflow-hidden rounded-3xl bg-zinc-950 border border-zinc-800/90 shadow-2xl p-6 sm:p-8 md:p-12 transition-all">
        {/* Giant Kinetic Watermark Typography (Sliding & Fading behind stage) */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden flex items-center justify-center select-none z-0">
            <AnimatePresence mode="wait">
              <motion.span
                key={watermarkText}
                initial={{ opacity: 0, x: direction * 120, scale: 0.95 }}
                animate={{ opacity: 0.045, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: -direction * 120, scale: 1.05 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="font-black text-[90px] sm:text-[160px] md:text-[230px] lg:text-[290px] tracking-tighter uppercase whitespace-nowrap text-white"
              >
                {watermarkText}
              </motion.span>
            </AnimatePresence>
          </div>

          {/* Background Ambient Radial Glow */}
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-yellow-500/5 rounded-full blur-3xl pointer-events-none" />

          {/* Main Stage Grid: Left Details & Right Character/Service Visual Stage */}
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center min-h-[520px]">
            {/* LEFT COLUMN: Service Info, Feature List & CTA (6 cols on lg) */}
            <div className="lg:col-span-6 flex flex-col justify-center gap-6 w-full min-w-0">
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={currentService.id || activeIndex}
                  custom={direction}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                  className="flex flex-col gap-5"
                >
                  {/* Top Badge */}
                  {currentService.badge && (
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-yellow-400 text-black shadow-sm">
                        {currentService.badge}
                      </span>
                    </div>
                  )}

                  {/* Service Title */}
                  <h3 className="text-3xl sm:text-4xl md:text-5xl font-black text-white uppercase tracking-tight leading-[1.08]">
                    {cleanTitle}
                  </h3>

                  {/* Description */}
                  <p className="text-base text-zinc-300 leading-relaxed max-w-xl font-normal">
                    {currentService.description}
                  </p>

                  {/* Feature Checklist */}
                  <div className="pt-3 border-t border-zinc-900/90 flex flex-col gap-3">
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-500 block">
                      Deliverables &amp; Capabilities:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {currentService.features.map((feat, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.1 + idx * 0.05, duration: 0.3 }}
                          className="flex items-center gap-2 text-xs sm:text-sm text-zinc-200"
                        >
                          <div className="w-4 h-4 rounded-full bg-yellow-400/10 border border-yellow-400/30 flex items-center justify-center flex-shrink-0">
                            <Check className="w-2.5 h-2.5 text-yellow-400" />
                          </div>
                          <span>{feat}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Action CTA & Navigation Buttons */}
                  <div className="pt-5 flex items-center flex-wrap gap-4">
                    <Link
                      href={`/book-consultation?service=${encodeURIComponent(cleanTitle)}`}
                      className="px-6 py-3.5 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-black font-extrabold text-xs uppercase tracking-wider flex items-center gap-2 transition-all shadow-lg shadow-yellow-400/10 hover:shadow-yellow-400/25 cursor-pointer"
                    >
                      Start Your Project With Us <ArrowRight className="w-4 h-4" />
                    </Link>

                    {/* Left / Right Arrow Controls */}
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handlePrev}
                        aria-label="Previous Service"
                        className="w-11 h-11 rounded-xl bg-zinc-900/90 border border-zinc-800 text-zinc-400 hover:text-white hover:border-yellow-400 hover:bg-zinc-800 flex items-center justify-center transition-all cursor-pointer"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <button
                        type="button"
                        onClick={handleNext}
                        aria-label="Next Service"
                        className="w-11 h-11 rounded-xl bg-zinc-900/90 border border-zinc-800 text-zinc-400 hover:text-white hover:border-yellow-400 hover:bg-zinc-800 flex items-center justify-center transition-all cursor-pointer"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* RIGHT COLUMN: The Featured Visual Stage (Masking & Dynamic Card Pop-Out) */}
            <div className="lg:col-span-6 flex justify-center items-center relative w-full min-w-0">
              <div className="relative w-full max-w-[460px] aspect-[4/5] sm:aspect-[1/1] md:aspect-[4/5]">
                {/* Decorative Frame Behind Card */}
                <div className="absolute -inset-1 rounded-[2.2rem] bg-gradient-to-tr from-yellow-500/20 via-zinc-800/40 to-yellow-500/5 blur-sm" />

                {/* Animated Primary Showcase Card */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentService.id || activeIndex}
                    initial={{ opacity: 0, scale: 0.92, y: 15 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 1.04, y: -15 }}
                    transition={{
                      duration: 0.45,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className="relative w-full h-full rounded-[2rem] overflow-hidden border border-yellow-400/40 shadow-2xl bg-zinc-900 group"
                  >
                    {/* The Hero Visual with Smooth Zoom & Parallax */}
                    <Image
                      src={imageSrc}
                      alt={cleanTitle}
                      fill
                      priority
                      sizes="(max-width: 768px) 100vw, 500px"
                      className="object-cover object-center transform group-hover:scale-105 transition-transform duration-700 ease-out"
                      referrerPolicy="no-referrer"
                    />

                    {/* Gradient Mask (Dark bottom for contrast & Marvel-style cinematic depth) */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

                    {/* Top Floating Badge inside Card */}
                    {currentService.badge && (
                      <div className="absolute top-4 right-4">
                        <span className="text-[10px] font-mono uppercase px-3 py-1.5 rounded-full bg-yellow-400 text-black font-extrabold tracking-wider shadow-md">
                          {currentService.badge}
                        </span>
                      </div>
                    )}

                    {/* Bottom Card Title & Quick Summary */}
                    <div className="absolute bottom-5 left-5 right-5 flex flex-col gap-1">
                      <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-widest">
                        Selected Offering
                      </span>
                      <h4 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight">
                        {cleanTitle}
                      </h4>
                      <p className="text-xs text-zinc-300 line-clamp-2">
                        {currentService.description}
                      </p>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* BOTTOM INTERACTIVE CARD SELECTION RAIL (NextGrafik Marvel Character Cards Strip) */}
          <div className="relative mt-8 pt-6 border-t border-zinc-900 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-yellow-400" />
                Select Any Service Card:
              </span>
              <span className="text-[11px] font-mono text-zinc-500 hidden sm:inline">
                Click a card or use arrow keys ← →
              </span>
            </div>

            {/* Horizontal Scrollable Rail of Service Cards */}
            <div
              ref={railRef}
              className="flex items-center gap-3 overflow-x-auto pb-2 pt-1 scrollbar-none no-scrollbar snap-x"
            >
              {services.map((svc, idx) => {
                const sCleanTitle = svc.title.replace(/ & CRM/gi, "");
                const sImg =
                  serviceImageMap[sCleanTitle] ||
                  serviceImageMap[svc.title] ||
                  "/services/web-development.jpg";
                const isCurrent = idx === activeIndex;
                const sSlug = getServiceSlug(sCleanTitle, svc.id);

                return (
                  <button
                    key={svc.id || idx}
                    id={`rail-btn-${sSlug}`}
                    data-service-slug={sSlug}
                    type="button"
                    onClick={() => handleSelect(idx)}
                    className={`service-rail-card flex-shrink-0 snap-start text-left rounded-2xl p-2.5 transition-all duration-300 ease-out cursor-pointer flex items-center gap-3 w-48 sm:w-56 border scroll-mt-28 ${
                      isCurrent
                        ? "bg-zinc-900 border-yellow-400 shadow-lg shadow-yellow-400/10 ring-1 ring-yellow-400/50 scale-[1.02]"
                        : "bg-zinc-950/80 border-zinc-800/80 hover:border-zinc-700 hover:bg-zinc-900/50 opacity-70 hover:opacity-100"
                    }`}
                  >
                    {/* Thumbnail Image */}
                    <div className="relative w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 bg-zinc-800 border border-zinc-700/60">
                      <Image
                        src={sImg}
                        alt={sCleanTitle}
                        fill
                        sizes="48px"
                        className="object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>

                    {/* Card Label */}
                    <div className="flex flex-col min-w-0">
                      <span className="text-xs font-bold text-white truncate group-hover:text-yellow-400">
                        {sCleanTitle}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }
