"use client";

import React, { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Sparkles } from "lucide-react";
import { ServiceItem } from "@/lib/types";
import MarvelServiceShowcase from "@/components/MarvelServiceShowcase";
import WhatWeDoMarquee from "@/components/WhatWeDoMarquee";
import { ScrollReveal } from "@/components/ScrollReveal";

const defaultServices: ServiceItem[] = [
  {
    id: "branding",
    title: "Brand Identity",
    description: "Distinct visual identity systems, typography pairings, color palettes, and comprehensive brand guidelines that make your business stand out.",
    iconName: "Palette",
    features: ["Brand Guidelines & Systems", "Typography & Color Palette", "Custom Logos & Marks", "Digital & Print Assets"],
    badge: "Brand Systems",
  },
  {
    id: "graphic-design",
    title: "Graphic Design",
    description: "Eye-catching visual designs, pitch decks, social media creatives, banners, and marketing assets tailored to your brand.",
    iconName: "Sparkles",
    features: ["Social Media & Ad Creatives", "Pitch Decks & Presentations", "Packaging & Print Design", "Custom Vector Illustrations"],
    badge: "Visual Design",
  },
  {
    id: "digital-marketing",
    title: "Digital Marketing",
    description: "Targeted digital marketing campaigns, search engine optimization (SEO), and conversion strategies to grow your online presence.",
    iconName: "TrendingUp",
    features: ["Search Engine Optimization (SEO)", "Social Media Marketing", "Performance Ad Campaigns", "Email Marketing Setup"],
    badge: "Marketing & Growth",
  },
  {
    id: "ai-agents",
    title: "AI Agents & Automation",
    description: "Smart AI tools, chatbots, and workflow automation to save you time, assist your customers, and streamline daily tasks.",
    iconName: "Brain",
    features: ["Custom AI Chatbots", "Workflow Automation", "Smart Customer Support", "AI-Powered Business Tools"],
    badge: "Smart Automation",
  },
  {
    id: "web-development",
    title: "Web Development",
    description: "Fast, modern, and mobile-friendly websites and web applications built with clean code and high performance.",
    iconName: "Monitor",
    features: ["Custom Modern Web Design", "Fast Loading & Mobile-Ready", "Search Engine Friendly", "Easy Content Management"],
    badge: "Web Applications",
  },
  {
    id: "app-development",
    title: "App Development",
    description: "Clean, responsive mobile applications for iOS and Android built for seamless usability and reliable performance.",
    iconName: "Smartphone",
    features: ["iOS & Android Mobile Apps", "User-Friendly Interface", "Fast & Secure Performance", "Ongoing Maintenance & Updates"],
    badge: "Mobile Apps",
  },
];

export default function ServicesPage() {
  const [services, setServices] = useState<ServiceItem[]>(defaultServices);
  const [activeHash, setActiveHash] = useState<string>("");

  useEffect(() => {
    fetch("/api/content")
      .then((res) => res.json())
      .then((data) => {
        if (data.services && data.services.length > 0) {
          // Normalize titles and remove buzzwords (craft, high roi)
          const normalized = data.services.map((s: ServiceItem) => {
            let badge = (s.badge || "").trim();
            badge = badge
              .replace(/creative craft/gi, "Visual Design")
              .replace(/craft/gi, "Design")
              .replace(/high roi/gi, "Marketing & Growth")
              .replace(/core foundation/gi, "Brand Systems")
              .trim();

            return {
              ...s,
              title: s.title.replace(/ & CRM/gi, ""),
              badge,
            };
          });
          setServices(normalized);
        }
      })
      .catch(() => {});

    // Listen to hash changes for smooth scroll & active effect
    const handleHash = () => {
      if (typeof window !== "undefined" && window.location.hash) {
        const hash = window.location.hash.replace("#", "");
        setActiveHash(hash);
        setTimeout(() => {
          const el = document.getElementById(hash);
          if (el) {
            const yOffset = -120;
            const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
            window.scrollTo({ top: y, left: 0, behavior: "smooth" });
          }
        }, 180);
      }
    };

    handleHash();
    window.addEventListener("hashchange", handleHash);
    return () => window.removeEventListener("hashchange", handleHash);
  }, []);

  return (
    <div className="bg-black min-h-screen text-white font-sans relative flex flex-col w-full overflow-x-hidden">
      <Navbar />

      <main className="flex-grow w-full relative z-10 pt-32 pb-24 px-6 md:px-12 max-w-7xl mx-auto flex flex-col gap-16">
        {/* Header with Smooth Scroll Reveal */}
        <section className="flex flex-col items-start max-w-3xl pt-8">
          <ScrollReveal delay={0.05} yOffset={20}>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-semibold uppercase tracking-wider text-yellow-400 mb-6">
              <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
              Our Services
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.15} yOffset={25}>
            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-[1.08] mb-6">
              Designed for <span className="text-yellow-400">Growth, Quality,</span> and Impact.
            </h1>
          </ScrollReveal>

          <ScrollReveal delay={0.25} yOffset={20}>
            <p className="text-base sm:text-lg text-zinc-400 leading-relaxed">
              We deliver every service with clear milestones, high attention to detail, transparent communication, and 100% full ownership.
            </p>
          </ScrollReveal>
        </section>

        {/* Interactive Marvel Character Selection Showcase */}
        <section className="w-full">
          <ScrollReveal delay={0.1} yOffset={25}>
            <MarvelServiceShowcase
              services={services}
              initialSelectedSlug={activeHash}
              isStandalonePage={true}
            />
          </ScrollReveal>
        </section>

        {/* What We Do Marquee */}
        <section className="w-full pt-6">
          <ScrollReveal delay={0.1} yOffset={20}>
            <WhatWeDoMarquee />
          </ScrollReveal>
        </section>
      </main>

      <Footer />
    </div>
  );
}
