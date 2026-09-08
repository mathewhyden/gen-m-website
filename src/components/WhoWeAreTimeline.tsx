"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";

interface TimelineStep {
  num: string;
  tag: string;
  title: string;
  description: string;
}

const steps: TimelineStep[] = [
  {
    num: "01",
    tag: "01 IDENTITY & ORIGIN",
    title: "Who is Gen-M?",
    description:
      "Gen-M Tech is focused on building high-quality websites, memorable brand identities, and smart AI solutions. We help businesses grow by designing clean user experiences, developing fast modern websites, and setting up practical automation tools.",
  },
  {
    num: "02",
    tag: "02 PROBLEM & IMPACT",
    title: "What Problem Do We Solve?",
    description:
      "Many businesses struggle with outdated designs, slow websites, and manual workflows that hold back their growth. We fix this by providing complete, reliable digital solutions so your brand looks professional and runs smoothly.",
  },
  {
    num: "03",
    tag: "03 METHOD & STANDARD",
    title: "What Is Our Approach?",
    description:
      "We focus on clean visual design, fast reliable development, and clear, ongoing communication with every client. We work directly with founders and teams, offering transparent pricing, regular updates, and ongoing support for your peace of mind.",
  },
];

export default function WhoWeAreTimeline() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: false, amount: 0.2 });

  return (
    <div
      ref={containerRef}
      id="who-we-are-timeline"
      className="relative w-full max-w-4xl mx-auto py-6 select-none"
      aria-label="Who We Are Interactive Timeline"
    >
      {/* 
        Vertical Animated Glowing Line & Waypoint Track
        Pure dark luxury theme, sleek glowing line drawing downwards
        No rectangular boxes, no box borders
      */}
      <div className="relative flex flex-col gap-12 sm:gap-16">
        {/* Background Track Line */}
        <div className="absolute left-6 sm:left-8 top-6 bottom-6 w-[2px] bg-zinc-900" />

        {/* Active Animated Glowing Line drawing downwards */}
        <motion.div
          className="absolute left-6 sm:left-8 top-6 w-[2px] bg-gradient-to-b from-yellow-400 via-amber-300 to-yellow-500 shadow-[0_0_12px_rgba(250,204,21,0.6)] origin-top"
          initial={{ height: "0%" }}
          animate={isInView ? { height: "calc(100% - 48px)" } : { height: "0%" }}
          transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1] }}
        />

        {steps.map((step, idx) => {
          const delayTime = 0.2 + idx * 0.45;

          return (
            <motion.div
              key={step.num}
              id={`timeline-step-${step.num}`}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{
                duration: 0.7,
                delay: delayTime,
                ease: [0.25, 1, 0.35, 1],
              }}
              className="relative flex items-start gap-6 sm:gap-10 group"
            >
              {/* Waypoint Node (01, 02, 03) */}
              <div className="relative z-10 flex items-center justify-center shrink-0">
                {/* Pulsing Outer Glow Ring */}
                <motion.div
                  className="absolute -inset-1.5 rounded-full bg-yellow-400/20 blur-sm"
                  animate={{
                    scale: [1, 1.25, 1],
                    opacity: [0.3, 0.8, 0.3],
                  }}
                  transition={{
                    duration: 2.4,
                    repeat: Infinity,
                    delay: idx * 0.4,
                    ease: "easeInOut",
                  }}
                />

                {/* Circular Waypoint Node */}
                <motion.div
                  className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-black border-2 border-yellow-400 flex items-center justify-center text-white font-mono font-bold text-xs sm:text-sm shadow-[0_0_20px_rgba(250,204,21,0.35)] transition-transform duration-300 group-hover:scale-110"
                  initial={{ scale: 0.7, opacity: 0 }}
                  animate={isInView ? { scale: 1, opacity: 1 } : { scale: 0.7, opacity: 0 }}
                  transition={{
                    duration: 0.5,
                    delay: delayTime,
                    type: "spring",
                    stiffness: 260,
                    damping: 20,
                  }}
                >
                  <span className="text-yellow-400 tracking-wider">{step.num}</span>
                </motion.div>
              </div>

              {/* Synchronized Text Content (No Box Borders, Pure Clean Typography) */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
                transition={{
                  duration: 0.65,
                  delay: delayTime + 0.15,
                  ease: [0.25, 1, 0.35, 1],
                }}
                className="flex flex-col gap-2 pt-1.5 sm:pt-3 max-w-2xl"
              >
                {/* Gold Accent Tag */}
                <span className="text-[11px] font-mono tracking-widest text-yellow-400 uppercase font-semibold">
                  {step.tag}
                </span>

                {/* Crisp White Heading */}
                <h4 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight group-hover:text-yellow-400 transition-colors duration-200">
                  {step.title}
                </h4>

                {/* Narrative Description */}
                <p className="text-sm sm:text-base text-zinc-300 font-normal leading-relaxed">
                  {step.description}
                </p>
              </motion.div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
