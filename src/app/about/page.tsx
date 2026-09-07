"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatWeDoMarquee from "@/components/WhatWeDoMarquee";
import InteractiveWhoWeAreCards from "@/components/InteractiveWhoWeAreCards";
import { ScrollReveal, ScrollStagger, ScrollStaggerItem } from "@/components/ScrollReveal";
import {
  MaskWipeText,
  TextShimmer,
  WordBlurIn,
  LetterSpacingExpand,
} from "@/components/TextAnimations";
import { 
  ArrowRight,
  ArrowUpRight,
  Sparkles,
} from "lucide-react";

export default function AboutPage() {
  const router = useRouter();

  const workflowSteps = [
    "Discover",
    "Plan",
    "Design",
    "Build",
    "Launch",
    "Grow"
  ];

  return (
    <div className="bg-black min-h-screen text-white font-sans relative flex flex-col w-full overflow-x-hidden">
      <Navbar />

      <main className="flex-grow w-full relative z-10 pt-32 pb-24 px-6 md:px-12 max-w-7xl mx-auto flex flex-col gap-20">
        {/* 1. Hero Section - Smooth Scroll Reveal */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center pt-6">
          <div className="lg:col-span-6 flex flex-col items-start">
            <ScrollReveal delay={0.05} yOffset={20}>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-yellow-400/30 bg-yellow-400/10 text-yellow-400 text-xs font-semibold uppercase tracking-wider mb-5">
                <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse" />
                <LetterSpacingExpand text="About Gen-M Studio" delay={0.1} />
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.15} yOffset={25}>
              <h1 className="font-display text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white uppercase leading-[1.12]">
                <MaskWipeText text="DESIGNED TO" delay={0.15} /> <br />
                <TextShimmer text="STAND OUT" /> &amp; DELIVER.
              </h1>
            </ScrollReveal>

            <ScrollReveal delay={0.25} yOffset={25}>
              <p className="text-base sm:text-lg text-zinc-300 font-normal leading-relaxed mt-5 max-w-xl">
                <WordBlurIn
                  text="Gen-M is an independent creative and technology studio. We partner with founders, businesses, and forward-thinking teams to engineer distinctive brand identities, lightning-fast web applications, and autonomous digital systems."
                  delay={0.25}
                />
              </p>
            </ScrollReveal>

            <ScrollReveal delay={0.35} yOffset={25}>
              <div className="flex flex-wrap items-center gap-4 mt-8">
                <Link
                  href="/book-consultation"
                  className="px-8 py-3.5 rounded-full bg-yellow-400 text-black font-bold text-xs uppercase tracking-wider hover:bg-yellow-300 transition-all duration-200 flex items-center gap-2 shadow-lg shadow-yellow-400/15 cursor-pointer"
                >
                  Book a Consultation
                  <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
                </Link>
                <Link
                  href="/work"
                  className="px-8 py-3.5 rounded-full bg-zinc-900 border border-zinc-700 text-zinc-200 font-semibold text-xs uppercase tracking-wider hover:border-yellow-400 hover:text-white transition-all duration-200 cursor-pointer"
                >
                  View Our Work
                </Link>
              </div>
            </ScrollReveal>
          </div>

          <ScrollReveal delay={0.2} yOffset={30} className="lg:col-span-6 relative aspect-square sm:aspect-[4/3] lg:aspect-[5/4] rounded-3xl overflow-hidden border border-zinc-800 bg-zinc-900 shadow-2xl">
            <Image
              src="/services/web-development.jpg"
              alt="Gen-M Studio Craft"
              fill
              priority
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 600px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-black/70 backdrop-blur-md border border-white/10 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-yellow-400 block font-bold">Studio Standard</span>
                <span className="text-sm font-bold text-white">Pixel-level rigor &amp; pure performance</span>
              </div>
              <span className="text-xs font-mono text-zinc-400">Est. 2024</span>
            </div>
          </ScrollReveal>
        </section>

        {/* 2. Who We Are - 3-Card Grid with Scroll Reveal */}
        <section className="flex flex-col gap-8 pt-6">
          <ScrollReveal delay={0.1} yOffset={20}>
            <div className="flex flex-col items-start gap-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-semibold uppercase tracking-wider text-yellow-400">
                <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
                <LetterSpacingExpand text="Who We Are" delay={0.1} />
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                <MaskWipeText text="Who We Are" delay={0.15} />
              </h2>
              <p className="text-base text-zinc-400 max-w-xl font-normal leading-relaxed">
                An independent studio dedicated to clean design, fast engineering, and dependable long-term collaboration.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.2} yOffset={25}>
            <InteractiveWhoWeAreCards />
          </ScrollReveal>
        </section>

        {/* 3. What We Do - Clean Restored Marquee */}
        <section className="flex flex-col gap-8 pt-6">
          <ScrollReveal delay={0.1} yOffset={20}>
            <WhatWeDoMarquee onServiceClick={(id) => router.push(`/book-consultation?service=${encodeURIComponent(id)}`)} />
          </ScrollReveal>
        </section>

        {/* 4. How We Work - Scroll Reveal */}
        <section className="flex flex-col gap-8 pt-6">
          <ScrollReveal delay={0.1} yOffset={20}>
            <div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-2">
                How We Work
              </h2>
              <p className="text-base text-zinc-400 max-w-xl font-normal leading-relaxed">
                A structured 6-step cycle built to eliminate guesswork and deliver on schedule.
              </p>
            </div>
          </ScrollReveal>

          <ScrollStagger staggerDelay={0.08} className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            {workflowSteps.map((step, idx) => (
              <ScrollStaggerItem key={idx} yOffset={20}>
                <div className="p-4 sm:p-5 rounded-xl bg-zinc-950 border border-zinc-800 flex flex-col justify-between gap-3 text-center items-center hover:border-yellow-400/60 transition-colors h-full">
                  <span className="text-xs font-mono text-yellow-400 font-bold">
                    0{idx + 1}
                  </span>
                  <span className="text-sm sm:text-base font-bold text-white tracking-tight">
                    {step}
                  </span>
                </div>
              </ScrollStaggerItem>
            ))}
          </ScrollStagger>
        </section>

        {/* 5. CTA Footer Block */}
        <ScrollReveal delay={0.1} yOffset={25}>
          <section className="p-8 sm:p-12 rounded-3xl bg-gradient-to-b from-zinc-900 to-zinc-950 border border-zinc-800 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="max-w-xl">
              <span className="text-xs font-mono text-yellow-400 uppercase tracking-widest block mb-2 font-bold">
                Ready to Build?
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Let&apos;s turn your vision into an impactful reality.
              </h2>
              <p className="text-sm text-zinc-400 mt-2">
                Transparent quotes, direct communication with creators, and zero hidden fees.
              </p>
            </div>
            <Link
              href="/start-project"
              className="px-8 py-4 rounded-full bg-yellow-400 text-black font-bold text-xs uppercase tracking-wider hover:bg-yellow-300 transition-all flex items-center gap-2 shrink-0 cursor-pointer shadow-lg shadow-yellow-400/20"
            >
              Start a Project
              <ArrowRight className="w-4 h-4" />
            </Link>
          </section>
        </ScrollReveal>
      </main>

      <Footer />
    </div>
  );
}
