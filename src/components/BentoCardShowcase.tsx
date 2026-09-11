"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

export interface DeveloperMember {
  num: string;
  name: string;
  role: string;
  quote: string;
  image: string;
}

// Exactly 3 Developers:
// 1. MATHEW - FRONTEND DEVELOPER
// 2. SIDHU - BACKEND DEVELOPER
// 3. MATHEW - AI SPECIALIST
export const teamData: DeveloperMember[] = [
  {
    num: "01",
    name: "MATHEW",
    role: "FRONTEND DEVELOPER",
    quote: "Crafting clean, responsive interfaces that feel effortless to use.",
    image: "/team/mathew.jpg",
  },
  {
    num: "02",
    name: "SIDHU",
    role: "BACKEND DEVELOPER",
    quote: "Building stable, reliable foundations behind every experience.",
    image: "/team/sidhu.jpg",
  },
  {
    num: "03",
    name: "MATHEW",
    role: "AI SPECIALIST",
    quote: "Making complex intelligence feel simple, intuitive, and practical.",
    image: "/team/mathew-ai.jpg",
  },
];

// Motion Timing:
// Shuffle transition: 1000ms
// Hold after shuffle: 1400ms
// Total cycle per shuffle: 2400ms
const SHUFFLE_DURATION = 1.0;
const HOLD_DURATION_MS = 1400;
const TOTAL_CYCLE_MS = SHUFFLE_DURATION * 1000 + HOLD_DURATION_MS;
const CINEMATIC_BEZIER = [0.25, 1, 0.35, 1] as const;

export default function BentoCardShowcase() {
  const [members, setMembers] = useState<DeveloperMember[]>(teamData);
  const [step, setStep] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [containerWidth, setContainerWidth] = useState<number>(1000);
  const containerRef = useRef<HTMLDivElement>(null);
  const pauseTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch dynamic team members from Firestore / API
  useEffect(() => {
    fetch("/api/team")
      .then((res) => res.json())
      .then((data) => {
        if (data.members && Array.isArray(data.members)) {
          const activeOnly = data.members.filter((m: any) => m.active !== false);
          if (activeOnly.length > 0) {
            const formatted: DeveloperMember[] = activeOnly.map((m: any, idx: number) => ({
              num: String(idx + 1).padStart(2, "0"),
              name: m.name,
              role: m.role,
              quote: m.quote,
              image: m.image || "/team/mathew.jpg",
            }));
            setMembers(formatted);
          }
        }
      })
      .catch((err) => {
        console.warn("Failed to fetch dynamic team members", err);
      });
  }, []);

  // Measure container dimensions for responsive layout
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
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

  // Continuous auto-shuffle loop
  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      setStep((prev) => prev + 1);
    }, TOTAL_CYCLE_MS);

    return () => clearInterval(timer);
  }, [isPaused]);

  // Pause on hover
  const handleMouseEnter = () => {
    setIsPaused(true);
    if (pauseTimerRef.current) {
      clearTimeout(pauseTimerRef.current);
    }
  };

  const handleMouseLeave = () => {
    if (pauseTimerRef.current) {
      clearTimeout(pauseTimerRef.current);
    }
    pauseTimerRef.current = setTimeout(() => {
      setIsPaused(false);
    }, 1400);
  };

  useEffect(() => {
    return () => {
      if (pauseTimerRef.current) {
        clearTimeout(pauseTimerRef.current);
      }
    };
  }, []);

  // Direct card selection to make that card featured (Pos A)
  const numMembers = Math.max(1, members.length);
  const selectFeaturedCard = useCallback((cardIndex: number) => {
    setStep((currentStep) => {
      const currentFeatured = currentStep % numMembers;
      if (currentFeatured === cardIndex) return currentStep;
      const diff = (cardIndex - currentFeatured + numMembers) % numMembers;
      return currentStep + diff;
    });
  }, [numMembers]);

  const isMobile = containerWidth < 768;
  const containerHeight = isMobile ? 420 : 410;

  // Geometry for each of the 3 Circular Positions (Strictly Circles, Zero Rectangles)
  const getPositionGeometry = useCallback(
    (positionType: 0 | 1 | 2) => {
      if (isMobile) {
        // Mobile geometry: Large circle on top, two smaller circles below
        const largeSize = Math.min(230, Math.floor(containerWidth * 0.62));
        const smallSize = Math.floor(largeSize * 0.52);
        const gap = 16;
        const totalSmallW = smallSize * 2 + gap;
        const smallStartX = Math.max(0, Math.floor((containerWidth - totalSmallW) / 2));

        if (positionType === 0) {
          // Pos A: Large Featured Circle (Top)
          return {
            x: Math.floor((containerWidth - largeSize) / 2),
            y: 10,
            size: largeSize,
            zIndex: 30,
            isFeatured: true,
          };
        } else if (positionType === 1) {
          // Pos B: Small Circle (Bottom Left)
          return {
            x: smallStartX,
            y: largeSize + 30,
            size: smallSize,
            zIndex: 20,
            isFeatured: false,
          };
        } else {
          // Pos C: Small Circle (Bottom Right)
          return {
            x: smallStartX + smallSize + gap,
            y: largeSize + 30,
            size: smallSize,
            zIndex: 10,
            isFeatured: false,
          };
        }
      } else {
        // Desktop / Tablet geometry: Large circle on left, two small circles on right
        const largeSize = Math.min(340, Math.floor(containerHeight * 0.85));
        const smallSize = Math.floor(largeSize * 0.52);
        const gap = 36;
        const totalW = largeSize + gap + smallSize;
        const startX = Math.max(0, Math.floor((containerWidth - totalW) / 2));

        if (positionType === 0) {
          // Pos A: Large Featured Circle (Left)
          return {
            x: startX,
            y: Math.floor((containerHeight - largeSize) / 2),
            size: largeSize,
            zIndex: 30,
            isFeatured: true,
          };
        } else if (positionType === 1) {
          // Pos B: Small Top Circle (Right)
          const smallStackH = smallSize * 2 + 20;
          const startY = Math.floor((containerHeight - smallStackH) / 2);
          return {
            x: startX + largeSize + gap,
            y: startY,
            size: smallSize,
            zIndex: 20,
            isFeatured: false,
          };
        } else {
          // Pos C: Small Bottom Circle (Right)
          const smallStackH = smallSize * 2 + 20;
          const startY = Math.floor((containerHeight - smallStackH) / 2);
          return {
            x: startX + largeSize + gap,
            y: startY + smallSize + 20,
            size: smallSize,
            zIndex: 10,
            isFeatured: false,
          };
        }
      }
    },
    [containerWidth, containerHeight, isMobile]
  );

  const currentFeaturedCardIndex = step % numMembers;
  const currentFeaturedMember = members[currentFeaturedCardIndex] || members[0] || teamData[0];

  return (
    <div
      id="team-genm-circular-showcase"
      className="w-full flex flex-col gap-6 select-none"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      aria-label="Team Gen-M Circular Showcase"
    >
      {/* Short creative wording placed OUTSIDE the circular animation */}
      <div className="flex items-center justify-center gap-3 text-[11px] font-mono tracking-widest text-zinc-500 uppercase">
        <span>DESIGN</span>
        <span className="text-yellow-400/60">&bull;</span>
        <span>DEVELOPMENT</span>
        <span className="text-yellow-400/60">&bull;</span>
        <span>INTELLIGENCE</span>
      </div>

      {/* 
        Circular Animation Canvas
        STRICT REQUIREMENT: 
        - Absolutely NO outer rectangular frame
        - NO inner rectangular frame
        - NO rectangular border boxes
        - Perfect circles only (border-radius: 50%)
        - ZERO text inside the circles
      */}
      <div
        ref={containerRef}
        className="relative w-full overflow-hidden"
        style={{ height: `${containerHeight}px` }}
      >
        {members.slice(0, 3).map((member, cardIndex) => {
          const posType = ((cardIndex - (step % 3) + 3) % 3) as 0 | 1 | 2;
          const pos = getPositionGeometry(posType);
          const isFeatured = pos.isFeatured;

          return (
            <motion.div
              key={member.num}
              id={`team-circle-${member.num}`}
              onClick={() => selectFeaturedCard(cardIndex)}
              animate={{
                x: pos.x,
                y: pos.y,
                width: pos.size,
                height: pos.size,
                zIndex: pos.zIndex,
              }}
              transition={{
                duration: SHUFFLE_DURATION,
                ease: CINEMATIC_BEZIER,
              }}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                borderRadius: "50%",
                willChange: "transform, width, height",
              }}
              className={`aspect-square rounded-full overflow-hidden cursor-pointer transition-shadow duration-500 ${
                isFeatured
                  ? "border-2 border-yellow-400/90 shadow-[0_15px_40px_rgba(250,204,21,0.18),0_5px_15px_rgba(0,0,0,0.8)]"
                  : "border border-zinc-800/80 hover:border-zinc-700 shadow-md shadow-black/60"
              }`}
            >
              {/* Image filling circular frame cleanly with object-fit: cover, NO TEXT inside */}
              <Image
                src={member.image}
                alt={member.name}
                fill
                sizes="(max-width: 768px) 65vw, 360px"
                className="object-cover rounded-full pointer-events-none"
                referrerPolicy="no-referrer"
                unoptimized
                priority
              />
            </motion.div>
          );
        })}
      </div>

      {/* 
        Member Information & Details — Strictly OUTSIDE the circles 
        Displays Name, Role, and 1-Line Quote with ZERO icons
        (No Age numbers, No bullet dots)
      */}
      <div className="flex flex-col items-center text-center max-w-lg mx-auto px-4">
        {/* Name */}
        <h4 className="text-2xl sm:text-3xl font-bold uppercase tracking-tight text-white mb-1">
          {currentFeaturedMember.name}
        </h4>

        {/* Role */}
        <p className="text-xs sm:text-sm font-mono text-yellow-400 tracking-wider mb-2 uppercase font-semibold">
          {currentFeaturedMember.role}
        </p>

        {/* 1-Line Simple Quote */}
        <p className="text-xs sm:text-sm text-zinc-300 italic leading-relaxed max-w-md">
          &ldquo;{currentFeaturedMember.quote}&rdquo;
        </p>
      </div>

      {/* Minimalist Selection Controls — OUTSIDE the circles, No icons */}
      <div className="flex items-center justify-center gap-2 pt-1 flex-wrap">
        {members.map((d, idx) => {
          const isCurrent = currentFeaturedCardIndex === idx;
          return (
            <button
              key={d.num || idx}
              type="button"
              id={`team-step-${d.num || idx}`}
              onClick={() => selectFeaturedCard(idx)}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full transition-all duration-300 font-mono text-xs border cursor-pointer ${
                isCurrent
                  ? "bg-yellow-400 text-black border-yellow-400 font-bold shadow-md shadow-yellow-400/20"
                  : "bg-zinc-900/90 text-zinc-400 border-zinc-800 hover:border-zinc-700 hover:text-zinc-200"
              }`}
            >
              <span className="font-bold">{d.num || String(idx + 1).padStart(2, "0")}</span>
              <span className="font-sans font-medium text-[11px]">{d.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
