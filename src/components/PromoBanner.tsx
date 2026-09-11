"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, ArrowRight } from "lucide-react";
import { PromoSettings } from "@/lib/types";

export default function PromoBanner() {
  const [promo, setPromo] = useState<PromoSettings | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Check if dismissed in this session
    if (typeof window !== "undefined") {
      const isDismissed = sessionStorage.getItem("genm_promo_dismissed");
      if (isDismissed) {
        setDismissed(true);
        return;
      }
    }

    fetch("/api/promos")
      .then((res) => res.json())
      .then((data) => {
        if (data.promo && data.promo.enabled) {
          setPromo(data.promo);
          // Small delay before showing so it smoothly animates in after initial load
          const timer = setTimeout(() => setIsOpen(true), 1200);
          return () => clearTimeout(timer);
        }
      })
      .catch((err) => {
        console.error("Failed to load promo", err);
      });
  }, []);

  const handleDismiss = () => {
    setIsOpen(false);
    setDismissed(true);
    if (typeof window !== "undefined") {
      sessionStorage.setItem("genm_promo_dismissed", "true");
    }
  };

  if (dismissed || !promo || !promo.enabled) {
    return null;
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 30, scale: 0.95 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="fixed bottom-6 right-6 z-50 max-w-md w-[calc(100vw-3rem)] pointer-events-auto"
        >
          <div className="relative rounded-3xl bg-zinc-950/95 backdrop-blur-2xl border border-yellow-400/40 p-6 shadow-2xl shadow-black/80 flex flex-col gap-4 overflow-hidden">
            {/* Ambient gold glow */}
            <div className="absolute -top-16 -right-16 w-36 h-36 bg-yellow-400/20 blur-2xl rounded-full pointer-events-none" />

            {/* Top Bar: Badge & Close Button */}
            <div className="flex items-center justify-between gap-3 relative z-10">
              <span className="px-3 py-1 rounded-full bg-yellow-400/10 border border-yellow-400/40 text-yellow-400 text-[10px] font-mono uppercase font-bold tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-yellow-400" />
                Special Offer
              </span>

              <button
                type="button"
                onClick={handleDismiss}
                className="w-7 h-7 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Close Announcement"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Media Asset if configured */}
            {promo.mediaType === "image" && promo.mediaUrl && (
              <div className="relative w-full h-36 rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-900 shrink-0">
                <Image
                  src={promo.mediaUrl}
                  alt={promo.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 400px"
                />
              </div>
            )}

            {promo.mediaType === "video" && promo.mediaUrl && (
              <div className="relative w-full h-36 rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-900 shrink-0">
                <iframe
                  src={promo.mediaUrl}
                  title="Promotional Video"
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            )}

            {/* Text Content */}
            <div className="space-y-1.5 relative z-10">
              <h3 className="text-base sm:text-lg font-black text-white uppercase tracking-tight leading-snug">
                {promo.title}
              </h3>
              {promo.subtitle && (
                <p className="text-xs text-zinc-300 font-normal leading-relaxed line-clamp-3">
                  {promo.subtitle}
                </p>
              )}
            </div>

            {/* CTA Button */}
            <div className="pt-1 relative z-10">
              <a
                href={promo.ctaLink || "#contact"}
                onClick={() => {
                  handleDismiss();
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-black font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-yellow-400/25 transition-all cursor-pointer"
              >
                <span>{promo.ctaText || "Claim Offer"}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
