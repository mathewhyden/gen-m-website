"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useTheme } from "@/lib/ThemeContext";
import { Sun, Moon } from "lucide-react";

export default function RopeThemeToggle({
  className = "",
}: {
  className?: string;
}) {
  const { theme, toggleTheme } = useTheme();
  const [isPulling, setIsPulling] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  const handlePull = () => {
    if (isPulling) return;
    setIsPulling(true);

    // Trigger toggle right at the pull climax
    setTimeout(() => {
      toggleTheme();
    }, 180);

    setTimeout(() => {
      setIsPulling(false);
    }, 550);
  };

  const isLight = theme === "light";

  return (
    <div
      className={`relative inline-flex flex-col items-center select-none ${className}`}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      {/* Ceiling Mount / Base Bracket */}
      <div className="w-5 h-1.5 rounded-full bg-zinc-600 dark:bg-zinc-700 shadow-sm border border-zinc-500/40 z-10" />

      {/* Interactive Hanging Rope & Bead Assembly */}
      <motion.button
        type="button"
        aria-label={`Switch to ${isLight ? "dark" : "light"} mode`}
        onClick={handlePull}
        animate={
          isPulling
            ? {
                y: [0, 22, -6, 3, 0],
                scaleY: [1, 1.45, 0.9, 1.05, 1],
              }
            : {
                y: 0,
                scaleY: 1,
              }
        }
        transition={{
          duration: 0.55,
          ease: [0.34, 1.56, 0.64, 1],
        }}
        whileHover={{ y: 2 }}
        whileTap={{ y: 16 }}
        className="flex flex-col items-center cursor-pointer outline-none focus:outline-none origin-top group"
      >
        {/* Woven Cord / Rope */}
        <div className="w-[2px] h-7 sm:h-8 bg-gradient-to-b from-zinc-500 via-yellow-500/70 to-yellow-400 dark:from-zinc-600 dark:via-zinc-400 dark:to-yellow-400/80 transition-colors" />

        {/* Rope Pull Bead / Grip Knob */}
        <motion.div
          animate={{
            scale: isPulling ? 0.9 : 1,
            rotate: isPulling ? [0, -8, 8, 0] : 0,
          }}
          className={`w-5 h-6 rounded-full border flex items-center justify-center shadow-md transition-all duration-300 ${
            isLight
              ? "bg-amber-400 border-amber-500 shadow-amber-400/50 text-black"
              : "bg-zinc-900 border-zinc-700 text-yellow-400 shadow-black group-hover:border-yellow-400"
          }`}
        >
          {isLight ? (
            <Sun className="w-3 h-3 text-amber-950 stroke-[2.5]" />
          ) : (
            <Moon className="w-3 h-3 text-yellow-400 stroke-[2.5]" />
          )}
        </motion.div>
      </motion.button>

      {/* Floating Tooltip Indicator */}
      <span
        className={`absolute -bottom-8 whitespace-nowrap text-[10px] font-mono font-semibold px-2 py-0.5 rounded-md pointer-events-none transition-all duration-200 z-50 ${
          showTooltip
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-1"
        } ${
          isLight
            ? "bg-zinc-800 text-white shadow-sm"
            : "bg-zinc-800 text-zinc-200 border border-zinc-700"
        }`}
      >
        {isLight ? "Pull for Dark" : "Pull for Light"}
      </span>
    </div>
  );
}
