"use client";

import { ArrowRight, Sparkles } from "lucide-react";
import { MagneticButton } from "./Navbar";
import { ScrollReveal } from "./ScrollReveal";
import {
  MaskWipeText,
  TextShimmer,
  ScrambleDecoder,
  WordBlurIn,
} from "./TextAnimations";

export default function Hero({
  onBookClick,
  onWorkClick,
}: {
  onBookClick: () => void;
  onWorkClick: () => void;
}) {
  return (
    <section className="relative flex flex-col items-center justify-center bg-black px-6 md:px-12 pt-32 pb-16 md:pt-40 md:pb-24 overflow-hidden">
      {/* Main Container */}
      <div className="relative z-10 max-w-5xl mx-auto text-center flex flex-col items-center">
        {/* Tagline Badge with Cyber Matrix Decoder */}
        <ScrollReveal delay={0.05} yOffset={16}>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-zinc-900 border border-yellow-400/40 mb-8">
            <Sparkles className="w-4 h-4 text-yellow-400" />
            <span className="text-xs sm:text-sm font-bold uppercase tracking-widest text-yellow-400">
              <ScrambleDecoder text="WE BUILD. WE DESIGN. WE INNOVATE." delay={0.1} />
            </span>
          </div>
        </ScrollReveal>

        {/* H1 Heading with Kinetic Mask Reveal and Gold Shimmer */}
        <ScrollReveal delay={0.15} yOffset={24}>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-[1.05] uppercase">
            <MaskWipeText text="Digital Excellence" delay={0.15} className="text-white" /> <br />
            <TextShimmer text="For Next-Gen Brands" />
          </h1>
        </ScrollReveal>

        {/* Normal text with Word Blur Dissolve - Center Aligned */}
        <ScrollReveal delay={0.25} yOffset={24}>
          <p className="mt-6 text-base sm:text-lg md:text-xl text-zinc-200 max-w-2xl font-normal leading-relaxed tracking-wide text-center mx-auto flex justify-center">
            <WordBlurIn
              text="Elevating your business through bespoke Branding, creative Graphic Design, Digital Marketing, autonomous AI Agents, high-performance Web Development, and scalable App Development."
              delay={0.25}
              stagger={0.02}
              className="justify-center text-center"
            />
          </p>
        </ScrollReveal>

        {/* CTAs */}
        <ScrollReveal delay={0.35} yOffset={20}>
          <div className="mt-12 flex flex-col sm:flex-row items-center gap-5 justify-center w-full">
            {/* Primary CTA */}
            <MagneticButton
              onClick={onBookClick}
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-yellow-400 text-black font-bold text-sm tracking-wider uppercase hover:bg-yellow-300 transition-colors duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-lg active:scale-95"
            >
              Start a Project
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </MagneticButton>

            {/* Secondary CTA */}
            <MagneticButton
              onClick={onWorkClick}
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-black text-white font-semibold text-sm tracking-wider uppercase border border-zinc-700 hover:border-yellow-400 hover:text-yellow-400 transition-colors duration-200 flex items-center justify-center gap-2 cursor-pointer active:scale-95"
            >
              Explore Services
            </MagneticButton>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
