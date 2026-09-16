"use client";

import React from "react";
import WhatWeDoMarquee from "./WhatWeDoMarquee";
import WhoWeAreTimeline from "./WhoWeAreTimeline";
import TeamGenM from "./TeamGenM";
import { ScrollReveal } from "./ScrollReveal";
import {
  MaskWipeText,
  TextShimmer,
  WordBlurIn,
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
            <ScrollReveal delay={0.1} yOffset={24}>
              <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white uppercase leading-[1.08]">
                <MaskWipeText text="DESIGNED TO" delay={0.15} /> <br />
                <TextShimmer text="EVOLVE" />
              </h2>
            </ScrollReveal>
          </div>

          {/* Right Column: Narrative Parallel to Heading */}
          <div className="lg:col-span-6 flex flex-col items-start lg:pt-4">
            <ScrollReveal delay={0.2} yOffset={24}>
              <p className="text-lg sm:text-xl text-zinc-300 font-normal leading-relaxed max-w-xl">
                <WordBlurIn
                  text="We are Gen-M Tech — we build modern websites, clean brand identities, and smart digital solutions that help your business grow and stand out."
                  delay={0.2}
                />
              </p>
            </ScrollReveal>
          </div>
        </div>

        {/* 2. Who We Are */}
        <div className="flex flex-col gap-8 w-full">
          <ScrollReveal delay={0.1} yOffset={20}>
            <div className="flex flex-col items-start gap-2">
              <h3 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                <MaskWipeText text="Who We Are" delay={0.15} />
              </h3>
              <p className="text-sm sm:text-base text-zinc-400 max-w-xl">
                Gen-M Tech is dedicated to clean design, fast engineering, and dependable long-term collaboration.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.15} yOffset={25}>
            <WhoWeAreTimeline />
          </ScrollReveal>
        </div>

        {/* 3. What We Do - Restored Left-Aligned Header Marquee */}
        <ScrollReveal delay={0.1} yOffset={20}>
          <WhatWeDoMarquee onServiceClick={handleServiceClick} />
        </ScrollReveal>

        {/* 4. Team Gen-M */}
        <div id="team" className="flex flex-col gap-8 w-full scroll-mt-24">
          <ScrollReveal delay={0.1} yOffset={20}>
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 w-full">
              <div className="flex flex-col items-start gap-2">
                <h3 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight inline-flex items-baseline gap-2">
                  <span>Team</span>
                  <span className="tracking-tight uppercase">
                    GEN-<span className="text-yellow-400 italic">M</span>
                  </span>
                </h3>
                <p className="text-sm sm:text-base text-zinc-400 max-w-xl">
                  The developers and engineers building high-performance websites, scalable systems, and intelligent digital experiences.
                </p>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.2} yOffset={25}>
            <TeamGenM />
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
