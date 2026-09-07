"use client";

import React, { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";
import { ServiceItem } from "@/lib/types";
import MarvelServiceShowcase from "./MarvelServiceShowcase";
import { ScrollReveal } from "./ScrollReveal";
import { MaskWipeText, LetterSpacingExpand, TextShimmer } from "./TextAnimations";

const defaultServices: ServiceItem[] = [
  {
    id: "branding",
    title: "Brand Identity",
    description:
      "Distinct visual identity systems, typography pairings, color palettes, and comprehensive brand guidelines that make your business stand out.",
    iconName: "Palette",
    features: [
      "Brand Guidelines & Systems",
      "Typography & Color Palette",
      "Custom Logos & Marks",
      "Digital & Print Assets",
    ],
    badge: "Brand Systems",
  },
  {
    id: "graphic-design",
    title: "Graphic Design",
    description:
      "Eye-catching visual designs, pitch decks, social media creatives, banners, and marketing assets tailored to your brand.",
    iconName: "Sparkles",
    features: [
      "Social Media & Ad Creatives",
      "Pitch Decks & Presentations",
      "Packaging & Print Design",
      "Custom Vector Illustrations",
    ],
    badge: "Visual Design",
  },
  {
    id: "digital-marketing",
    title: "Digital Marketing",
    description:
      "Targeted digital marketing campaigns, search engine optimization (SEO), and conversion strategies to grow your online presence.",
    iconName: "TrendingUp",
    features: [
      "Search Engine Optimization (SEO)",
      "Social Media Marketing",
      "Performance Ad Campaigns",
      "Email Marketing Setup",
    ],
    badge: "Growth",
  },
  {
    id: "ai-agents",
    title: "AI Agents & Automation",
    description:
      "Smart AI tools, chatbots, and workflow automation to save you time, assist your customers, and streamline daily tasks.",
    iconName: "Brain",
    features: [
      "Custom AI Chatbots",
      "Workflow Automation",
      "Smart Customer Support",
      "AI-Powered Business Tools",
    ],
    badge: "Next-Gen",
  },
  {
    id: "web-development",
    title: "Web Development",
    description:
      "Fast, modern, and mobile-friendly websites and web applications built with clean code and high performance.",
    iconName: "Monitor",
    features: [
      "Custom Modern Web Design",
      "Fast Loading & Mobile-Ready",
      "Search Engine Friendly",
      "Easy Content Management",
    ],
    badge: "Flagship",
  },
  {
    id: "app-development",
    title: "App Development",
    description:
      "Clean, responsive mobile applications for iOS and Android built for seamless usability and reliable performance.",
    iconName: "Smartphone",
    features: [
      "iOS & Android Mobile Apps",
      "User-Friendly Interface",
      "Fast & Secure Performance",
      "Ongoing Maintenance & Updates",
    ],
    badge: "Mobile",
  },
];

export default function ServicesSection({
  onSelectService,
  selectedSlug,
}: {
  onSelectService?: (serviceName: string) => void;
  selectedSlug?: string;
}) {
  const [services, setServices] = useState<ServiceItem[]>(defaultServices);

  useEffect(() => {
    fetch("/api/content")
      .then((res) => res.json())
      .then((data) => {
        if (data.services && data.services.length > 0) {
          const normalized = data.services.map((s: ServiceItem) => ({
            ...s,
            title: s.title.replace(/ & CRM/gi, ""),
          }));
          setServices(normalized);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <section id="services" className="relative py-20 md:py-28 bg-black z-10 px-6 md:px-12 scroll-mt-20">
      <div className="max-w-7xl mx-auto flex flex-col gap-10 md:gap-14">
        {/* Section Header - Restored Left-Aligned with Narrative Right */}
        <ScrollReveal delay={0.05} yOffset={20}>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-semibold uppercase tracking-wider text-yellow-400 mb-4">
                <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
                <LetterSpacingExpand text="Our Core Services" delay={0.1} />
              </div>
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-white uppercase leading-[1.08]">
                <MaskWipeText text="Designed For " delay={0.15} />
                <TextShimmer text="Growth &amp; Impact" />
              </h2>
            </div>
            <p className="text-base text-zinc-300 max-w-md font-normal leading-relaxed">
              We deliver every service with clear milestones, high attention to detail, transparent communication, and 100% full ownership.
            </p>
          </div>
        </ScrollReveal>

        {/* Interactive Marvel-Style Character Selection Showcase */}
        <ScrollReveal delay={0.15} yOffset={25}>
          <MarvelServiceShowcase
            services={services}
            onSelectService={onSelectService}
            selectedSlug={selectedSlug}
          />
        </ScrollReveal>
      </div>
    </section>
  );
}
