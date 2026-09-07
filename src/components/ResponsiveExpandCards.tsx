"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ArrowUpRight, Eye, ZoomIn } from "lucide-react";

export interface ExpandCardItem {
  id: string;
  num: string;
  title: string;
  subtitle: string;
  category: string;
  image: string;
  description: string;
  technologies: string[];
  liveUrl?: string;
  badge?: string;
  actionLabel?: string;
}

export const defaultWebExpandCards: ExpandCardItem[] = [
  {
    id: "web-card-1",
    num: "01",
    title: "Hebe Art Studio",
    subtitle: "Digital Art & Gallery",
    category: "Web Development",
    image: "/websites/hebe-art-studio.jpg",
    description:
      "A custom digital gallery and portfolio platform created for contemporary visual art with smooth exhibition curation.",
    technologies: ["Next.js", "Tailwind CSS", "Netlify", "Responsive UI"],
    liveUrl: "https://hebeartstudio.netlify.app/portfolio",
    badge: "Live Website",
  },
  {
    id: "web-card-2",
    num: "02",
    title: "CS Marcom Agency",
    subtitle: "Marketing & Growth",
    category: "Web Development",
    image: "/websites/cs-marcom.jpg",
    description:
      "A high-performance modern agency platform featuring service matrices, case study showcases, and seamless lead capture.",
    technologies: ["React", "Cloudflare Pages", "TypeScript", "Tailwind"],
    liveUrl: "https://csmarcom.pages.dev/",
    badge: "Live Website",
  },
  {
    id: "web-card-3",
    num: "03",
    title: "Cosmo Arts",
    subtitle: "Fine Arts & Showcase",
    category: "Web Development",
    image: "/websites/cosmo-arts.jpg",
    description:
      "Curated fine arts studio digital portfolio experience engineered for modern artists and global collectors.",
    technologies: ["Next.js", "Cloudflare Pages", "Gallery System", "Tailwind"],
    liveUrl: "https://cosmoarts.pages.dev/",
    badge: "Live Website",
  },
  {
    id: "web-card-4",
    num: "04",
    title: "Believers Birthday Care",
    subtitle: "Community Portal",
    category: "Web Application",
    image: "/websites/gospel-care.jpg",
    description:
      "An interactive community portal for celebrating member milestones, automated reminders, and complete member management.",
    technologies: ["Web Portal", "Interactive Calendar", "Full Stack"],
    liveUrl: "https://gospel-ministry-believers-birthday-care.ai.studio/",
    badge: "Web App",
  },
  {
    id: "web-card-5",
    num: "05",
    title: "Modern Web Platform",
    subtitle: "Full-Stack System",
    category: "Web Development",
    image: "/services/web-development.jpg",
    description:
      "Engineered with blazing-fast Next.js server components, SEO architecture, responsive layouts, and modern typography.",
    technologies: ["Next.js 15", "TypeScript", "PostCSS", "Tailwind v4"],
    liveUrl: "https://csmarcom.pages.dev/",
    badge: "Next-Gen Web",
  },
];

export const defaultGraphicExpandCards: ExpandCardItem[] = [
  {
    id: "graphic-card-1",
    num: "01",
    title: "Brand Strategy & Editorial",
    subtitle: "Corporate Publication",
    category: "Brand Systems",
    image: "/graphic-design/graphic-work-18-1.jpg",
    description:
      "Professional corporate editorial publication system with structured grid layouts, typography hierarchies, and luxury finish.",
    technologies: ["Editorial Design", "Brand Guidelines", "Typography"],
    badge: "Brand Identity",
    actionLabel: "View High-Res Design",
  },
  {
    id: "graphic-card-2",
    num: "02",
    title: "Luxury Visual Identity",
    subtitle: "Creative Direction",
    category: "Visual Design",
    image: "/graphic-design/graphic-work-1-1.jpg",
    description:
      "High-contrast brand aesthetic featuring custom geometric emblems, color harmony palettes, and bespoke corporate collateral.",
    technologies: ["Vector Art", "Logo Marks", "Color Theory"],
    badge: "Visual System",
    actionLabel: "View High-Res Design",
  },
  {
    id: "graphic-card-3",
    num: "03",
    title: "Advertising & Campaign Media",
    subtitle: "Social Growth Creatives",
    category: "Marketing Design",
    image: "/graphic-design/graphic-work-2-1.jpg",
    description:
      "Targeted digital advertising creatives and conversion-focused social graphics designed for cross-channel brand impact.",
    technologies: ["Social Media Creatives", "Ad Banners", "Marketing Art"],
    badge: "Marketing",
    actionLabel: "View High-Res Design",
  },
  {
    id: "graphic-card-4",
    num: "04",
    title: "Packaging & Print Collateral",
    subtitle: "Commercial Packaging",
    category: "Print & Packaging",
    image: "/graphic-design/graphic-work-10-1.jpg",
    description:
      "Tactile print packaging designs, merchandise packaging, and unboxing collateral with precision vector cut lines.",
    technologies: ["Packaging Systems", "Print Production", "Merchandise"],
    badge: "Print Media",
    actionLabel: "View High-Res Design",
  },
  {
    id: "graphic-card-5",
    num: "05",
    title: "Executive Deck & Presentation",
    subtitle: "Investor Pitch System",
    category: "Presentation Design",
    image: "/graphic-design/graphic-work-20-1.jpg",
    description:
      "Cinematic pitch deck slides and visual data charts designed to captivate investors and communicate clear business metrics.",
    technologies: ["Keynote / Figma", "Data Visuals", "Deck Strategy"],
    badge: "Pitch Deck",
    actionLabel: "View High-Res Design",
  },
];

// Alias for backward compatibility
export const defaultExpandCards = defaultWebExpandCards;

interface ResponsiveExpandCardsProps {
  cards?: ExpandCardItem[];
  title?: string;
  subtitle?: string;
  onCardClick?: (card: ExpandCardItem) => void;
  onImageZoom?: (imageSrc: string) => void;
  className?: string;
}

export default function ResponsiveExpandCards({
  cards = defaultWebExpandCards,
  onImageZoom,
  className = "",
}: ResponsiveExpandCardsProps) {
  // Default to the first card active so there is always a featured project showing
  const [activeId, setActiveId] = useState<string>(cards[0]?.id || "web-card-1");

  return (
    <div className={`w-full flex flex-col gap-6 select-none ${className}`}>
      {/* Cards Row Container:
          - Desktop (md+): Horizontal row with flex-grow expansion inspired by Bedimcode
          - Mobile (<md): Vertical accordion with height expansion
          - Smooth 600ms transitions with cubic-bezier easing */}
      <div className="w-full flex flex-col md:flex-row gap-3 sm:gap-4 h-[620px] md:h-[480px] lg:h-[520px] overflow-hidden rounded-3xl p-1">
        {cards.map((card) => {
          const isActive = activeId === card.id;

          return (
            <div
              key={card.id}
              id={`expand-card-${card.id}`}
              onClick={() => setActiveId(card.id)}
              onMouseEnter={() => setActiveId(card.id)}
              style={{
                flexGrow: isActive ? 4.5 : 1,
                flexShrink: 1,
                flexBasis: "0%",
              }}
              className={`relative rounded-2xl overflow-hidden cursor-pointer border transition-all duration-600 ease-[cubic-bezier(0.16,1,0.3,1)] group ${
                isActive
                  ? "border-yellow-400/80 shadow-2xl shadow-yellow-400/10 md:flex-[4.5] flex-[4]"
                  : "border-zinc-800/80 hover:border-zinc-700 md:flex-[1] flex-[1] opacity-75 hover:opacity-100"
              }`}
            >
              {/* Background Image with subtle zoom on active/hover */}
              <div className="absolute inset-0 w-full h-full overflow-hidden bg-zinc-950">
                <Image
                  src={card.image}
                  alt={card.title}
                  fill
                  priority={card.id.includes("1")}
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className={`object-cover transition-transform duration-700 ease-out ${
                    isActive ? "scale-105" : "scale-100 group-hover:scale-105"
                  }`}
                />

                {/* Dark Gradient Overlays for contrast & readability */}
                <div
                  className={`absolute inset-0 transition-opacity duration-500 bg-gradient-to-t from-black via-black/50 to-transparent ${
                    isActive ? "opacity-95" : "opacity-80 group-hover:opacity-75"
                  }`}
                />
                <div className="absolute inset-0 bg-black/20" />
              </div>

              {/* Top Bar: Number & Category Badge */}
              <div className="absolute top-3.5 left-3.5 right-3.5 z-10 flex items-center justify-between pointer-events-none">
                <span
                  className={`font-mono text-xs font-bold px-2.5 py-1 rounded-full transition-colors duration-300 border ${
                    isActive
                      ? "bg-yellow-400 text-black border-yellow-400 shadow-md"
                      : "bg-black/75 backdrop-blur-md text-yellow-400 border-zinc-800"
                  }`}
                >
                  {card.num}
                </span>

                {card.badge && (
                  <span
                    className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-full backdrop-blur-md transition-all duration-300 border ${
                      isActive
                        ? "opacity-100 translate-y-0 bg-black/80 text-yellow-400 border-yellow-400/40"
                        : "opacity-0 -translate-y-2 md:opacity-0 bg-black/60 text-zinc-400 border-zinc-800"
                    }`}
                  >
                    {card.badge}
                  </span>
                )}
              </div>

              {/* Collapsed State: Vertical rotated title & number indicator (Visible on desktop when NOT active) */}
              <div
                className={`hidden md:flex absolute inset-x-0 bottom-6 items-center justify-center transition-all duration-500 pointer-events-none ${
                  !isActive
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-4 pointer-events-none"
                }`}
              >
                <div className="flex flex-col items-center gap-3">
                  <span className="[writing-mode:vertical-rl] rotate-180 text-xs font-bold uppercase tracking-widest text-zinc-300 whitespace-nowrap font-mono">
                    {card.title}
                  </span>
                  <div className="w-1.5 h-1.5 rounded-full bg-yellow-400/70" />
                </div>
              </div>

              {/* Collapsed State for Mobile (horizontal title peek when inactive) */}
              <div
                className={`md:hidden absolute inset-x-4 bottom-3 flex items-center justify-between transition-all duration-300 pointer-events-none ${
                  !isActive ? "opacity-100" : "opacity-0 pointer-events-none"
                }`}
              >
                <span className="text-xs font-bold text-zinc-200 truncate pr-2">
                  {card.title}
                </span>
                <span className="text-[10px] font-mono text-yellow-400 uppercase shrink-0">
                  Tap to expand
                </span>
              </div>

              {/* Expanded Content Panel: Slides smoothly up from the bottom with 400-700ms easing */}
              <div
                className={`absolute inset-x-0 bottom-0 p-5 md:p-6 lg:p-7 flex flex-col justify-end z-20 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  isActive
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-8 pointer-events-none"
                }`}
              >
                {/* Category & Subtitle */}
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-yellow-400 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse" />
                    {card.category}
                  </span>
                  <span className="text-zinc-600">•</span>
                  <span className="text-[11px] font-mono text-zinc-400">
                    {card.subtitle}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white tracking-tight mb-2 leading-tight group-hover:text-yellow-400 transition-colors duration-300">
                  {card.title}
                </h3>

                {/* Description */}
                <p className="text-xs sm:text-sm text-zinc-300 font-normal leading-relaxed line-clamp-2 md:line-clamp-3 mb-3.5 max-w-xl">
                  {card.description}
                </p>

                {/* Technology Badges */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {card.technologies.map((tech, tIdx) => (
                    <span
                      key={tIdx}
                      className="px-2.5 py-0.5 rounded-full bg-zinc-900/90 border border-zinc-700/80 text-[10px] font-mono text-zinc-300"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Action Row */}
                <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between gap-3">
                  {card.liveUrl ? (
                    <a
                      href={card.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-400 text-black font-bold text-xs uppercase tracking-wider hover:bg-yellow-300 transition-all duration-300 shadow-lg hover:scale-105 active:scale-95"
                    >
                      <span>Visit Live Website</span>
                      <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
                    </a>
                  ) : onImageZoom ? (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onImageZoom(card.image);
                      }}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-400 text-black font-bold text-xs uppercase tracking-wider hover:bg-yellow-300 transition-all duration-300 shadow-lg hover:scale-105 active:scale-95 cursor-pointer"
                    >
                      <span>{card.actionLabel || "View Full Resolution"}</span>
                      <ZoomIn className="w-3.5 h-3.5 stroke-[2.5]" />
                    </button>
                  ) : (
                    <span className="text-xs text-zinc-400 font-mono">
                      Design Showcase
                    </span>
                  )}

                  <span className="text-[11px] font-mono text-zinc-400 hidden sm:inline-flex items-center gap-1">
                    <Eye className="w-3 h-3 text-yellow-400" />
                    <span>Selected showcase</span>
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Helper indicator below cards */}
      <div className="flex items-center justify-center gap-2 text-xs font-mono text-zinc-500 pt-1">
        <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse" />
        <span className="hidden md:inline">Hover any card to expand details</span>
        <span className="md:hidden">Tap any card to expand</span>
      </div>
    </div>
  );
}
