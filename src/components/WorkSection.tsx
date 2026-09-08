"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Globe,
  Image as ImageIcon,
  X,
  Sparkles,
  Layers,
} from "lucide-react";
import { ScrollReveal } from "./ScrollReveal";
import { MaskWipeText, LetterSpacingExpand, TextShimmer } from "./TextAnimations";
import ResponsiveExpandCards, {
  defaultWebExpandCards,
  defaultGraphicExpandCards,
} from "./ResponsiveExpandCards";

export default function WorkSection() {
  const [selectedTab, setSelectedTab] = useState<"all" | "web" | "graphic">("all");
  const [selectedGraphicImage, setSelectedGraphicImage] = useState<string | null>(null);

  return (
    <section id="work" className="relative py-20 md:py-28 bg-black z-10 px-6 md:px-12 scroll-mt-20">
      <div className="max-w-7xl mx-auto flex flex-col gap-14 md:gap-16">
        {/* Section Header - Left-Aligned */}
        <ScrollReveal delay={0.05} yOffset={20}>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div className="max-w-xl">
              <span className="text-xs font-mono uppercase tracking-widest text-yellow-400 flex items-center gap-2 mb-3">
                <Globe className="w-4 h-4 text-yellow-400" />
                <LetterSpacingExpand text="Portfolio & Projects" delay={0.1} />
              </span>
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight uppercase leading-[1.08] text-white">
                <MaskWipeText text="Our " delay={0.1} />
                <TextShimmer text="Works" />
              </h2>
            </div>
            <p className="text-base text-zinc-300 max-w-md font-normal leading-relaxed">
              Explore our live client websites, custom web applications, and creative visual design projects built for high commercial impact.
            </p>
          </div>
        </ScrollReveal>

        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2 pb-2">
          <button
            type="button"
            onClick={() => setSelectedTab("all")}
            className={`px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer flex items-center gap-1.5 ${
              selectedTab === "all"
                ? "bg-yellow-400 text-black shadow-md shadow-yellow-400/20"
                : "bg-zinc-950 text-zinc-400 hover:text-white border border-zinc-800"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            All Work
          </button>
          <button
            type="button"
            onClick={() => setSelectedTab("web")}
            className={`px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer flex items-center gap-1.5 ${
              selectedTab === "web"
                ? "bg-yellow-400 text-black shadow-md shadow-yellow-400/20"
                : "bg-zinc-950 text-zinc-400 hover:text-white border border-zinc-800"
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            Web Development
          </button>
          <button
            type="button"
            onClick={() => setSelectedTab("graphic")}
            className={`px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer flex items-center gap-1.5 ${
              selectedTab === "graphic"
                ? "bg-yellow-400 text-black shadow-md shadow-yellow-400/20"
                : "bg-zinc-950 text-zinc-400 hover:text-white border border-zinc-800"
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            Graphic Design Showcase
          </button>
        </div>

        {/* 1. Web Development Showcase (Animated Expandable Cards) */}
        {(selectedTab === "all" || selectedTab === "web") && (
          <ScrollReveal delay={0.1} yOffset={25}>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-zinc-900 pb-3">
                <div>
                  <span className="text-xs font-mono uppercase tracking-widest text-yellow-400 flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5" />
                    Web Development
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-bold text-white mt-1">
                    Live Websites &amp; Digital Platforms
                  </h3>
                </div>
                <span className="text-xs font-mono text-zinc-500">
                  Hover to expand card • Click for live platform
                </span>
              </div>

              {/* 5-Card Responsive Expandable Web Cards */}
              <ResponsiveExpandCards cards={defaultWebExpandCards} />
            </div>
          </ScrollReveal>
        )}

        {/* 2. Graphic Design Showcase (Animated Expandable Cards) */}
        {(selectedTab === "all" || selectedTab === "graphic") && (
          <ScrollReveal delay={0.15} yOffset={25}>
            <div className="flex flex-col gap-6 pt-4">
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-zinc-900 pb-3">
                <div>
                  <span className="text-xs font-mono uppercase tracking-widest text-yellow-400 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    Visual &amp; Print Systems
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-bold text-white mt-1">
                    Graphic Design Showcase
                  </h3>
                </div>
                <span className="text-xs font-mono text-zinc-500">
                  Hover to expand • Click to inspect high-resolution
                </span>
              </div>

              {/* 5-Card Responsive Expandable Graphic Design Cards */}
              <ResponsiveExpandCards
                cards={defaultGraphicExpandCards}
                onImageZoom={(img) => setSelectedGraphicImage(img)}
              />
            </div>
          </ScrollReveal>
        )}
      </div>

      {/* Lightbox Modal for Graphic Design Zoom */}
      <AnimatePresence>
        {selectedGraphicImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedGraphicImage(null)}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 md:p-8 cursor-pointer"
          >
            <div className="relative max-w-5xl max-h-[90vh] w-full h-full flex items-center justify-center">
              <button
                type="button"
                onClick={() => setSelectedGraphicImage(null)}
                className="absolute top-2 right-2 sm:-top-4 sm:-right-4 z-20 w-10 h-10 rounded-full bg-zinc-900/90 border border-zinc-700 text-white hover:text-yellow-400 flex items-center justify-center transition-colors shadow-2xl cursor-pointer"
                aria-label="Close Lightbox"
              >
                <X className="w-5 h-5" />
              </button>

              <div
                className="relative w-full h-full max-h-[82vh] rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-950"
                onClick={(e) => e.stopPropagation()}
              >
                <Image
                  src={selectedGraphicImage}
                  alt="High-resolution Graphic Design Showcase"
                  fill
                  sizes="100vw"
                  className="object-contain"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
