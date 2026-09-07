"use client";

import React from "react";
import { useRouter } from "next/navigation";
import {
  Code,
  Palette,
  Sparkles,
  Brain,
  TrendingUp,
  Smartphone,
  ArrowUpRight,
} from "lucide-react";

export interface CoreServiceItem {
  id: string;
  slug: string;
  name: string;
  badge: string;
  icon: React.ElementType;
}

// Gen-M's 6 core services
export const coreServices: CoreServiceItem[] = [
  {
    id: "branding",
    slug: "branding",
    name: "Brand Identity",
    badge: "Foundation",
    icon: Palette,
  },
  {
    id: "graphic-design",
    slug: "graphic-design",
    name: "Graphic Design",
    badge: "Design",
    icon: Sparkles,
  },
  {
    id: "digital-marketing",
    slug: "digital-marketing",
    name: "Digital Marketing",
    badge: "Marketing",
    icon: TrendingUp,
  },
  {
    id: "ai-agents",
    slug: "ai-agents",
    name: "AI Agents & Automation",
    badge: "Automation",
    icon: Brain,
  },
  {
    id: "web-development",
    slug: "web-development",
    name: "Web Development",
    badge: "Web",
    icon: Code,
  },
  {
    id: "app-development",
    slug: "app-development",
    name: "App Development",
    badge: "Mobile",
    icon: Smartphone,
  },
];

const coreServicesReversed: CoreServiceItem[] = [...coreServices].reverse();

export default function WhatWeDoMarquee({
  onServiceClick,
}: {
  onServiceClick?: (serviceSlug: string) => void;
}) {
  const router = useRouter();

  const handleItemClick = (e: React.MouseEvent, item: CoreServiceItem) => {
    e.preventDefault();
    if (onServiceClick) {
      onServiceClick(item.slug);
    } else {
      const el = document.getElementById("services");
      if (el) {
        const yOffset = -75;
        const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, left: 0, behavior: "smooth" });
      } else {
        router.push("/services");
      }
    }
  };

  const renderPill = (item: CoreServiceItem, keyPrefix: string, index: number) => {
    const Icon = item.icon;
    return (
      <button
        key={`${keyPrefix}-${item.slug}-${index}`}
        type="button"
        onClick={(e) => handleItemClick(e, item)}
        title={`View ${item.name} Service`}
        className="group relative inline-flex items-center gap-3 px-5 py-3 mx-2 rounded-full bg-zinc-950 border border-zinc-800 hover:border-yellow-400 transition-all duration-300 hover:scale-[1.03] active:scale-95 cursor-pointer shadow-sm hover:shadow-yellow-400/15 select-none shrink-0"
      >
        <span className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-800 group-hover:border-yellow-400/60 group-hover:bg-yellow-400/10 flex items-center justify-center text-yellow-400 transition-colors">
          <Icon className="w-4 h-4" />
        </span>
        <span className="text-sm sm:text-base font-bold uppercase tracking-wider text-white group-hover:text-yellow-400 transition-colors whitespace-nowrap">
          {item.name}
        </span>
        <span className="text-zinc-500 group-hover:text-yellow-400 transition-colors ml-0.5">
          <ArrowUpRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </span>
      </button>
    );
  };

  return (
    <div className="flex flex-col gap-6 w-full py-4">
      {/* Section Header - Restored Left-Aligned */}
      <div className="flex flex-col items-start gap-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-semibold uppercase tracking-wider text-yellow-400">
          <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
          Core Services
        </div>
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between w-full gap-2">
          <h3 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            What We Do
          </h3>
          <span className="text-xs font-mono text-zinc-400">
            Hover to pause • Click to view service
          </span>
        </div>
      </div>

      {/* Marquee Container with smooth edge gradient fades */}
      <div className="relative w-full overflow-hidden py-2 [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
        {/* Row 1: Sliding Left */}
        <div className="animate-marquee-left mb-3 flex items-center hover:[animation-play-state:paused]">
          {coreServices.map((item, idx) => renderPill(item, "r1-a", idx))}
          {coreServices.map((item, idx) => renderPill(item, "r1-b", idx))}
          {coreServices.map((item, idx) => renderPill(item, "r1-c", idx))}
        </div>

        {/* Row 2: Sliding Right */}
        <div className="animate-marquee-right flex items-center hover:[animation-play-state:paused]">
          {coreServicesReversed.map((item, idx) => renderPill(item, "r2-a", idx))}
          {coreServicesReversed.map((item, idx) => renderPill(item, "r2-b", idx))}
          {coreServicesReversed.map((item, idx) => renderPill(item, "r2-c", idx))}
        </div>
      </div>
    </div>
  );
}
