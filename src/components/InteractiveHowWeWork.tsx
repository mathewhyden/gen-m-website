"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";

export interface WorkflowSlide {
  num: string;
  name: string;
  subtitle: string;
  tagline: string;
  desc: string;
  timeline: string;
  keyHighlight: string;
}

export const workflowSlides: WorkflowSlide[] = [
  {
    num: "01",
    name: "Discover",
    subtitle: "Understanding Your Vision",
    tagline: "Getting to know your business",
    desc: "We start by learning about your business, your goals, and your audience. We understand what you need so we can create a clear, simple plan before any design or code begins.",
    timeline: "Days 1–3",
    keyHighlight: "Clear Plan & Direction",
  },
  {
    num: "02",
    name: "Plan",
    subtitle: "Structure & Strategy",
    tagline: "Organizing pages and content",
    desc: "We organize your website structure and map out each page so your visitors can easily find what they are looking for and take action.",
    timeline: "Days 4–7",
    keyHighlight: "Simple, Easy Navigation",
  },
  {
    num: "03",
    name: "Design",
    subtitle: "Visual Look & Feel",
    tagline: "Modern, clean, and memorable",
    desc: "We create a custom, polished look for your brand. You will see interactive previews so you know exactly how the site looks and feels before we build it.",
    timeline: "Days 8–14",
    keyHighlight: "Custom Visual Design",
  },
  {
    num: "04",
    name: "Build",
    subtitle: "Development & Features",
    tagline: "Fast and reliable engineering",
    desc: "We turn the approved designs into a fast, mobile-friendly website. Everything is built to load quickly, look great on phones and computers, and work smoothly.",
    timeline: "Days 15–24",
    keyHighlight: "Fast & Mobile Friendly",
  },
  {
    num: "05",
    name: "Launch",
    subtitle: "Final Checks & Going Live",
    tagline: "Ready for your customers",
    desc: "We thoroughly test every page, button, and form across all devices and browsers, set up search basics, and launch your site smoothly with zero downtime.",
    timeline: "Days 25–28",
    keyHighlight: "Smooth & Safe Launch",
  },
  {
    num: "06",
    name: "Grow",
    subtitle: "Support & Ongoing Care",
    tagline: "Here for the long run",
    desc: "We stay by your side after launch. Whenever you need updates, new pages, or help with questions, our team is always ready to support your business.",
    timeline: "Ongoing",
    keyHighlight: "Reliable Ongoing Support",
  },
];

const SLIDE_DURATION = 5500; // 5.5 seconds per slide

export default function InteractiveHowWeWork() {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [direction, setDirection] = useState(1); // 1 = next (slide left), -1 = prev (slide right)
  const [progress, setProgress] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartXRef = useRef<number | null>(null);

  const totalSlides = workflowSlides.length;
  const currentSlide = workflowSlides[currentSlideIndex];
  const nextSlideIndex = (currentSlideIndex + 1) % totalSlides;
  const nextSlideData = workflowSlides[nextSlideIndex];

  // Go to next slide
  const handleNext = useCallback(() => {
    setDirection(1);
    setCurrentSlideIndex((prev) => (prev + 1) % totalSlides);
    setProgress(0);
  }, [totalSlides]);

  // Go to previous slide
  const handlePrev = useCallback(() => {
    setDirection(-1);
    setCurrentSlideIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
    setProgress(0);
  }, [totalSlides]);

  // Go to specific slide
  const handleGoTo = (index: number) => {
    if (index === currentSlideIndex) return;
    setDirection(index > currentSlideIndex ? 1 : -1);
    setCurrentSlideIndex(index);
    setProgress(0);
  };

  // Default auto-play slideshow timer - always plays automatically
  useEffect(() => {
    const intervalTime = 50; // Update progress bar every 50ms
    const stepIncrement = (intervalTime / SLIDE_DURATION) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          handleNext();
          return 0;
        }
        return prev + stepIncrement;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [handleNext]);

  // Touch gesture support for mobile swiping
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartXRef.current - touchEndX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
    touchStartXRef.current = null;
  };

  // Framer Motion slide variants for smooth horizontal slideshow transitions
  const slideVariants: Variants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 80 : -80,
      opacity: 0,
      scale: 0.98,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        x: { type: "spring" as const, stiffness: 300, damping: 30 },
        opacity: { duration: 0.35 },
        scale: { duration: 0.35 },
      },
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -80 : 80,
      opacity: 0,
      scale: 0.98,
      transition: {
        x: { type: "spring" as const, stiffness: 300, damping: 30 },
        opacity: { duration: 0.25 },
        scale: { duration: 0.25 },
      },
    }),
  };

  return (
    <div
      ref={containerRef}
      className="w-full flex flex-col gap-6 select-none"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      aria-roledescription="carousel"
      aria-label="How We Work Slideshow"
    >
      {/* Top Slide Navigation Bar / Tabs with Active Progress Indicator - Clean & Icon-Free */}
      <div className="w-full bg-zinc-950 border border-zinc-800/90 rounded-2xl p-2.5 sm:p-4 shadow-xl overflow-hidden">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-2.5">
          {workflowSlides.map((step, idx) => {
            const isActive = currentSlideIndex === idx;
            const isPast = idx < currentSlideIndex;

            return (
              <button
                key={step.num}
                type="button"
                onClick={() => handleGoTo(idx)}
                className={`relative flex flex-col items-start p-2.5 sm:p-3 rounded-xl border text-left transition-all duration-300 cursor-pointer overflow-hidden ${
                  isActive
                    ? "bg-zinc-900 border-yellow-400/80 shadow-md shadow-yellow-400/10"
                    : isPast
                    ? "bg-zinc-950/80 border-zinc-800/70 hover:border-zinc-700"
                    : "bg-zinc-950/40 border-zinc-900 hover:border-zinc-800"
                }`}
              >
                {/* Active Slide Progress Line at Top */}
                {isActive && (
                  <div className="absolute top-0 left-0 right-0 h-1 bg-zinc-800">
                    <motion.div
                      className="h-full bg-yellow-400 shadow-[0_0_8px_#facc15]"
                      style={{ width: `${progress}%` }}
                      transition={{ ease: "linear" }}
                    />
                  </div>
                )}

                {/* Step Number */}
                <div className="flex items-center justify-between w-full mb-1.5 pt-0.5">
                  <span
                    className={`font-mono text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded transition-colors ${
                      isActive
                        ? "bg-yellow-400 text-black font-black"
                        : isPast
                        ? "bg-yellow-400/15 text-yellow-400"
                        : "bg-zinc-900 text-zinc-500"
                    }`}
                  >
                    {step.num}
                  </span>
                </div>

                {/* Step Title & Timeline */}
                <span
                  className={`text-xs sm:text-sm font-bold tracking-wide uppercase transition-colors truncate w-full ${
                    isActive ? "text-white" : "text-zinc-400"
                  }`}
                >
                  {step.name}
                </span>
                <span className="text-[10px] font-mono text-zinc-500 truncate w-full">
                  {step.timeline}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Slideshow Viewport - Clean, Spacious, and Icon-Free */}
      <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-zinc-950 border border-zinc-800 shadow-2xl min-h-[380px] md:min-h-[340px] flex flex-col justify-between">
        {/* Subtle background glow effect */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-400/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-zinc-800/20 rounded-full blur-3xl pointer-events-none" />

        {/* Animated Slide Content */}
        <div className="relative z-10 p-6 sm:p-10 md:p-12 flex-1 flex flex-col justify-center">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentSlide.num}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="flex flex-col gap-5 max-w-3xl"
            >
              {/* Meta Badges */}
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="px-3 py-1 rounded-full bg-yellow-400/10 border border-yellow-400/30 text-yellow-400 text-xs font-mono font-bold flex items-center gap-1.5 shadow-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse" />
                  Step {currentSlide.num} of 06
                </span>

                <span className="px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-300 text-xs font-mono">
                  Timeline: {currentSlide.timeline}
                </span>

                <span className="px-3 py-1 rounded-full bg-zinc-900/80 border border-zinc-800/80 text-yellow-400/90 text-xs font-mono hidden sm:inline-flex">
                  {currentSlide.keyHighlight}
                </span>
              </div>

              {/* Slide Title - Clean Typography, No Icons */}
              <div className="flex flex-col gap-1.5 mt-1">
                <span className="text-xs sm:text-sm font-mono uppercase tracking-widest text-yellow-400 font-bold block">
                  {currentSlide.tagline}
                </span>
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight">
                  {currentSlide.name} —{" "}
                  <span className="text-yellow-400 font-extrabold">
                    {currentSlide.subtitle}
                  </span>
                </h3>
              </div>

              {/* Easy-To-Understand Narrative Description */}
              <p className="text-base sm:text-lg text-zinc-300 leading-relaxed font-normal max-w-2xl">
                {currentSlide.desc}
              </p>

              {/* Next Slide Teaser Button */}
              <div className="pt-2 flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleNext}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-900 border border-zinc-800 hover:border-yellow-400/60 text-xs font-bold uppercase tracking-wider text-zinc-300 hover:text-white transition-all cursor-pointer group"
                >
                  <span>Next Step:</span>
                  <span className="text-yellow-400">{nextSlideData.name}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-yellow-400 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Bottom Slideshow Navigation Controls & Progress Dots (No Play/Pause Button) */}
        <div className="relative z-10 px-6 sm:px-8 py-4 border-t border-zinc-900 bg-black/80 backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Step Indicator & Quick Dots */}
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono font-bold text-white tracking-widest uppercase">
              Step <span className="text-yellow-400">{currentSlide.num}</span> / 06
            </span>

            <div className="flex items-center gap-1.5 ml-2">
              {workflowSlides.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleGoTo(i)}
                  className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                    i === currentSlideIndex
                      ? "w-8 bg-yellow-400 shadow-[0_0_6px_#facc15]"
                      : "w-2 bg-zinc-800 hover:bg-zinc-600"
                  }`}
                  aria-label={`Go to step ${i + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Clean Prev / Next Navigation Arrows (Play/Pause button removed) */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Previous Step"
              className="w-9 h-9 rounded-full bg-zinc-900 hover:bg-yellow-400 hover:text-black text-zinc-300 border border-zinc-800 flex items-center justify-center transition-all duration-200 cursor-pointer active:scale-95 shadow-sm"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={handleNext}
              aria-label="Next Step"
              className="w-9 h-9 rounded-full bg-zinc-900 hover:bg-yellow-400 hover:text-black text-zinc-300 border border-zinc-800 flex items-center justify-center transition-all duration-200 cursor-pointer active:scale-95 shadow-sm"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
