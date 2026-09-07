"use client";

import React from "react";
import WhatWeDoMarquee from "./WhatWeDoMarquee";
import InteractiveWhoWeAreCards from "./InteractiveWhoWeAreCards";
import InteractiveHowWeWork from "./InteractiveHowWeWork";
import { ScrollReveal } from "./ScrollReveal";
import { Sparkles } from "lucide-react";
import {
  MaskWipeText,
  TextShimmer,
  WordBlurIn,
  LetterSpacingExpand,
} from "./TextAnimations";

interface AboutSectionProps {
  onContactClick?: () => void;
  onServicesClick?: (serviceId?: string) => void;
}

export default function AboutSection({
  onServicesClick,
}: AboutSectionProps) {
  const handleServiceClick = (serviceId: string) => {
    if (onServicesClick) {
      onServicesClick(serviceId);
    } else {
      const el = document.getElementById("services");
      if (el) {
        const yOffset = -75;
        const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, left: 0, behavior: "smooth" });
      }
    }
  };

  return (
    <section
      id="about"
      className="relative py-20 md:py-28 bg-black z-10 px-6 md:px-12 scroll-mt-20 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto flex flex-col gap-16 md:gap-24">
        {/* 1. Header & Vision Statement - Restored 2-Column Left Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center">
          {/* Left Column: Heading */}
          <div className="lg:col-span-6 flex flex-col items-start">
            <ScrollReveal delay={0.05} yOffset={20}>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-yellow-400/30 bg-yellow-400/10 text-yellow-400 text-xs font-semibold uppercase tracking-wider mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse" />
                <LetterSpacingExpand text="About Gen-M Studio" delay={0.1} />
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.15} yOffset={28}>
              <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white uppercase leading-[1.08]">
                <MaskWipeText text="DESIGNED TO" delay={0.15} /> <br />
                <TextShimmer text="EVOLVE" />
              </h2>
            </ScrollReveal>
          </div>

          {/* Right Column: Narrative Parallel to Heading */}
          <div className="lg:col-span-6 flex flex-col items-start lg:pt-4">
            <ScrollReveal delay={0.25} yOffset={28}>
              <p className="text-lg sm:text-xl text-zinc-300 font-normal leading-relaxed max-w-xl">
                <WordBlurIn
                  text="We are Gen-M — we build modern websites, clean brand identities, and smart digital solutions that help your business grow and stand out."
                  delay={0.2}
                />
              </p>
            </ScrollReveal>
          </div>
        </div>

        {/* 2. Who We Are - Restored Left-Aligned Header */}
        <div className="flex flex-col gap-8 w-full">
          <ScrollReveal delay={0.1} yOffset={20}>
            <div className="flex flex-col items-start gap-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-semibold uppercase tracking-wider text-yellow-400">
                <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
                <LetterSpacingExpand text="Who We Are" delay={0.1} />
              </div>
              <h3 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                <MaskWipeText text="Who We Are" delay={0.15} />
              </h3>
              <p className="text-sm sm:text-base text-zinc-400 max-w-xl">
                An independent studio dedicated to clean design, fast engineering, and dependable long-term collaboration.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.15} yOffset={25}>
            <InteractiveWhoWeAreCards />
          </ScrollReveal>
        </div>

        {/* 3. What We Do - Restored Left-Aligned Header Marquee */}
        <ScrollReveal delay={0.1} yOffset={20}>
          <WhatWeDoMarquee onServiceClick={handleServiceClick} />
        </ScrollReveal>

        {/* 4. How We Work - Restored Left-Aligned Header */}
        <div className="flex flex-col gap-8 w-full">
          <ScrollReveal delay={0.1} yOffset={20}>
            <div className="flex flex-col items-start gap-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-semibold uppercase tracking-wider text-yellow-400">
                <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse" />
                Our 6-Step Methodology
              </div>
              <h3 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                <MaskWipeText text="How We " delay={0.12} />
                <TextShimmer text="Work" />
              </h3>
              <p className="text-sm sm:text-base text-zinc-400 max-w-xl">
                Our clear process ensures smooth communication, fast delivery, and high quality at every stage.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.2} yOffset={25}>
            <InteractiveHowWeWork />
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
