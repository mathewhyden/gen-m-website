"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";

// ============================================================
// 1. KINETIC MASK WIPE (After Effects Essential #1)
// Text reveals from behind a crisp, overflow-hidden clipping line
// ============================================================
export function MaskWipeText({
  text,
  className = "",
  delay = 0,
  duration = 0.75,
  direction = "up",
}: {
  text: string;
  className?: string;
  delay?: number;
  duration?: number;
  direction?: "up" | "down";
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <span className={className}>{text}</span>;
  }

  const yFrom = direction === "up" ? "110%" : "-110%";

  return (
    <span ref={ref} className="inline-block overflow-hidden align-top">
      <motion.span
        initial={{ y: yFrom, opacity: 0 }}
        animate={isInView ? { y: "0%", opacity: 1 } : { y: yFrom, opacity: 0 }}
        transition={{
          duration,
          delay,
          ease: [0.16, 1, 0.3, 1], // Cubic-bezier snap
        }}
        className={`inline-block ${className}`}
      >
        {text}
      </motion.span>
    </span>
  );
}

// ============================================================
// 2. CHARACTER STAGGER POP (After Effects Essential #2)
// Each letter springs in sequentially with bounce physics
// ============================================================
export function CharStaggerPop({
  text,
  className = "",
  stagger = 0.025,
  delay = 0,
}: {
  text: string;
  className?: string;
  stagger?: number;
  delay?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <span className={className}>{text}</span>;
  }

  const chars = text.split("");

  return (
    <span ref={ref} className={`inline-flex flex-wrap ${className}`}>
      {chars.map((char, index) => (
        <motion.span
          key={index}
          initial={{ opacity: 0, y: 16, scale: 0.8 }}
          animate={
            isInView
              ? { opacity: 1, y: 0, scale: 1 }
              : { opacity: 0, y: 16, scale: 0.8 }
          }
          transition={{
            duration: 0.45,
            delay: delay + index * stagger,
            ease: [0.34, 1.56, 0.64, 1], // Spring overshoot
          }}
          className="inline-block whitespace-pre"
        >
          {char}
        </motion.span>
      ))}
    </span>
  );
}

// ============================================================
// 3. WORD BLUR-IN / DISSOLVE (After Effects Essential #3)
// Cinematic de-blur cascade for titles and paragraphs
// ============================================================
export function WordBlurIn({
  text,
  className = "",
  stagger = 0.06,
  delay = 0,
}: {
  text: string;
  className?: string;
  stagger?: number;
  delay?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <span className={className}>{text}</span>;
  }

  const words = text.split(" ");

  return (
    <span ref={ref} className={`inline-flex flex-wrap gap-x-[0.3em] ${className}`}>
      {words.map((word, idx) => (
        <motion.span
          key={idx}
          initial={{ opacity: 0, y: 14, filter: "blur(8px)" }}
          animate={
            isInView
              ? { opacity: 1, y: 0, filter: "blur(0px)" }
              : { opacity: 0, y: 14, filter: "blur(8px)" }
          }
          transition={{
            duration: 0.55,
            delay: delay + idx * stagger,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="inline-block"
        >
          {word}
        </motion.span>
      ))}
    </span>
  );
}

// ============================================================
// 4. SCRAMBLE / MATRIX CYBER DECODER (After Effects Essential #4)
// Characters rapidly cycle through glyphs before locking in
// ============================================================
const GLYPHS = "!<>-_\\/[]{}—=+*^?#________0123456789ABCDEF";

export function ScrambleDecoder({
  text,
  className = "",
  duration = 0.9,
  delay = 0,
}: {
  text: string;
  className?: string;
  duration?: number;
  delay?: number;
}) {
  const [displayText, setDisplayText] = useState("");
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-20px" });

  useEffect(() => {
    if (!isInView) return;

    let frame = 0;
    const totalFrames = Math.round(duration * 60);
    let animationId: number;

    const timeout = setTimeout(() => {
      const update = () => {
        let output = "";
        const progress = frame / totalFrames;

        for (let i = 0; i < text.length; i++) {
          if (text[i] === " ") {
            output += " ";
            continue;
          }
          if (i / text.length < progress) {
            output += text[i];
          } else {
            output += GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
          }
        }

        setDisplayText(output);
        frame++;

        if (frame <= totalFrames) {
          animationId = requestAnimationFrame(update);
        } else {
          setDisplayText(text);
        }
      };

      animationId = requestAnimationFrame(update);
    }, delay * 1000);

    return () => {
      clearTimeout(timeout);
      cancelAnimationFrame(animationId);
    };
  }, [isInView, text, duration, delay]);

  return (
    <span ref={ref} className={className}>
      {displayText || text}
    </span>
  );
}

// ============================================================
// 5. KINETIC TYPEWRITER (After Effects Essential #5)
// Sequential character stream with blinking cursor
// ============================================================
export function KineticTypewriter({
  text,
  className = "",
  speed = 40,
  delay = 0,
}: {
  text: string;
  className?: string;
  speed?: number;
  delay?: number;
}) {
  const [currentText, setCurrentText] = useState("");
  const [showCursor, setShowCursor] = useState(true);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });

  useEffect(() => {
    if (!isInView) return;

    let index = 0;
    let timer: NodeJS.Timeout;

    const startTimeout = setTimeout(() => {
      timer = setInterval(() => {
        if (index < text.length) {
          setCurrentText(text.slice(0, index + 1));
          index++;
        } else {
          clearInterval(timer);
        }
      }, speed);
    }, delay * 1000);

    const cursorInterval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 530);

    return () => {
      clearTimeout(startTimeout);
      clearInterval(timer);
      clearInterval(cursorInterval);
    };
  }, [isInView, text, speed, delay]);

  return (
    <span ref={ref} className={`inline-flex items-baseline ${className}`}>
      <span>{currentText}</span>
      <span
        className={`inline-block w-1.5 h-3.5 bg-yellow-400 ml-1 rounded-sm transition-opacity duration-100 ${
          showCursor ? "opacity-100" : "opacity-0"
        }`}
      />
    </span>
  );
}

// ============================================================
// 6. METALLIC GOLD SHIMMER SWEEP (After Effects Essential #6)
// A radiant gold highlight sweeps across the text continuously
// ============================================================
export function TextShimmer({
  text,
  className = "",
}: {
  text: string;
  className?: string;
}) {
  return (
    <span
      className={`relative inline-block bg-gradient-to-r from-yellow-400 via-amber-200 to-yellow-400 bg-[length:200%_auto] bg-clip-text text-transparent animate-shimmer-sweep ${className}`}
    >
      {text}
    </span>
  );
}

// ============================================================
// 7. 3D FLIP-IN X (After Effects Essential #7)
// Words rotate 90° into view on the 3D X-axis
// ============================================================
export function Flip3DText({
  text,
  className = "",
  delay = 0,
  stagger = 0.08,
}: {
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <span className={className}>{text}</span>;
  }

  const words = text.split(" ");

  return (
    <span
      ref={ref}
      className={`inline-flex flex-wrap gap-x-[0.35em] [perspective:1000px] ${className}`}
    >
      {words.map((word, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, rotateX: 85, y: 15 }}
          animate={
            isInView
              ? { opacity: 1, rotateX: 0, y: 0 }
              : { opacity: 0, rotateX: 85, y: 15 }
          }
          transition={{
            duration: 0.65,
            delay: delay + i * stagger,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="inline-block [transform-origin:50%_100%]"
        >
          {word}
        </motion.span>
      ))}
    </span>
  );
}

// ============================================================
// 8. LETTER-SPACING EXPAND (Tracking Out) (After Effects #8)
// Animates letter-spacing from tight to wide luxury typography
// ============================================================
export function LetterSpacingExpand({
  text,
  className = "",
  delay = 0,
}: {
  text: string;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-30px" });

  return (
    <motion.span
      ref={ref}
      initial={{ letterSpacing: "-0.05em", opacity: 0 }}
      animate={
        isInView
          ? { letterSpacing: "0.18em", opacity: 1 }
          : { letterSpacing: "-0.05em", opacity: 0 }
      }
      transition={{ duration: 0.85, delay, ease: [0.16, 1, 0.3, 1] }}
      className={`inline-block font-mono uppercase ${className}`}
    >
      {text}
    </motion.span>
  );
}

// ============================================================
// 9. KINETIC FLOATING WAVE (After Effects Essential #9)
// Gentle undulating sine-wave motion per letter
// ============================================================
export function KineticWaveText({
  text,
  className = "",
}: {
  text: string;
  className?: string;
}) {
  const chars = text.split("");

  return (
    <span className={`inline-flex ${className}`}>
      {chars.map((char, index) => (
        <motion.span
          key={index}
          animate={{
            y: [0, -4, 0],
          }}
          transition={{
            duration: 2.2,
            repeat: Infinity,
            repeatType: "mirror",
            delay: index * 0.08,
            ease: "easeInOut",
          }}
          className="inline-block whitespace-pre"
        >
          {char}
        </motion.span>
      ))}
    </span>
  );
}

// ============================================================
// 10. METRIC COUNTER ROLL (After Effects Essential #10)
// Smoothly rolls digits into position
// ============================================================
export function CounterRoll({
  target,
  prefix = "",
  suffix = "",
  className = "",
  duration = 1.2,
}: {
  target: number;
  prefix?: string;
  suffix?: string;
  className?: string;
  duration?: number;
}) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });

  useEffect(() => {
    if (!isInView) return;

    const end = target;
    const startTime = performance.now();

    const update = (now: number) => {
      const progress = Math.min((now - startTime) / (duration * 1000), 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * end));

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    };

    requestAnimationFrame(update);
  }, [isInView, target, duration]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {count < 10 && target < 10 ? `0${count}` : count}
      {suffix}
    </span>
  );
}
