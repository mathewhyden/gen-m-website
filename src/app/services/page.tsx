"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Check, ArrowRight, Sparkles } from "lucide-react";
import { ServiceItem } from "@/lib/types";

const serviceImageMap: Record<string, string> = {
  "Brand Identity": "/services/brand-identity.jpg",
  "Branding": "/services/brand-identity.jpg",
  "branding": "/services/brand-identity.jpg",
  "Graphic Design": "/services/graphic-design.jpg",
  "graphic-design": "/services/graphic-design.jpg",
  "Digital Marketing": "/services/digital-marketing.jpg",
  "digital-marketing": "/services/digital-marketing.jpg",
  "AI Agents & Automation": "/services/ai-agents.jpg",
  "AI Agents": "/services/ai-agents.jpg",
  "ai-agents": "/services/ai-agents.jpg",
  "Web Development": "/services/web-development.jpg",
  "web-development": "/services/web-development.jpg",
  "App Development": "/services/app-development.jpg",
  "App Development & CRM": "/services/app-development.jpg",
  "app-development": "/services/app-development.jpg",
};

const defaultServices: ServiceItem[] = [
  {
    id: "branding",
    title: "Brand Identity",
    description: "Distinct visual identity systems, typography pairings, color palettes, and comprehensive brand guidelines that make your business stand out.",
    iconName: "Palette",
    features: ["Brand Guidelines & Systems", "Typography & Color Palette", "Custom Logos & Marks", "Digital & Print Assets"],
    badge: "Core Foundation",
  },
  {
    id: "graphic-design",
    title: "Graphic Design",
    description: "Eye-catching visual designs, pitch decks, social media creatives, banners, and marketing assets tailored to your brand.",
    iconName: "Sparkles",
    features: ["Social Media & Ad Creatives", "Pitch Decks & Presentations", "Packaging & Print Design", "Custom Vector Illustrations"],
    badge: "Creative Craft",
  },
  {
    id: "digital-marketing",
    title: "Digital Marketing",
    description: "Targeted digital marketing campaigns, search engine optimization (SEO), and conversion strategies to grow your online presence.",
    iconName: "TrendingUp",
    features: ["Search Engine Optimization (SEO)", "Social Media Marketing", "Performance Ad Campaigns", "Email Marketing Setup"],
    badge: "Growth",
  },
  {
    id: "ai-agents",
    title: "AI Agents & Automation",
    description: "Smart AI tools, chatbots, and workflow automation to save you time, assist your customers, and streamline daily tasks.",
    iconName: "Brain",
    features: ["Custom AI Chatbots", "Workflow Automation", "Smart Customer Support", "AI-Powered Business Tools"],
    badge: "Next-Gen",
  },
  {
    id: "web-development",
    title: "Web Development",
    description: "Fast, modern, and mobile-friendly websites and web applications built with clean code and high performance.",
    iconName: "Monitor",
    features: ["Custom Modern Web Design", "Fast Loading & Mobile-Ready", "Search Engine Friendly", "Easy Content Management"],
    badge: "Flagship",
  },
  {
    id: "app-development",
    title: "App Development",
    description: "Clean, responsive mobile applications for iOS and Android built for seamless usability and reliable performance.",
    iconName: "Smartphone",
    features: ["iOS & Android Mobile Apps", "User-Friendly Interface", "Fast & Secure Performance", "Ongoing Maintenance & Updates"],
    badge: "Mobile",
  },
];

export default function ServicesPage() {
  const [services, setServices] = useState<ServiceItem[]>(defaultServices);
  const [activeHash, setActiveHash] = useState<string>("");

  useEffect(() => {
    fetch('/api/content')
      .then(res => res.json())
      .then(data => {
        if (data.services && data.services.length > 0) {
          // Normalize names (remove CRM)
          const normalized = data.services.map((s: ServiceItem) => ({
            ...s,
            title: s.title.replace(/ & CRM/gi, ""),
          }));
          setServices(normalized);
        }
      })
      .catch(() => {});

    // Listen to hash changes for smooth scroll & active effect
    const handleHash = () => {
      if (typeof window !== "undefined" && window.location.hash) {
        const hash = window.location.hash.replace("#", "");
        setActiveHash(hash);
        // Timeout to allow the DOM and layout to mount completely, avoiding layout shift flicker
        setTimeout(() => {
          const el = document.getElementById(hash);
          if (el) {
            const yOffset = -120; // Account for sticky navbar
            const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
            window.scrollTo({ top: y, behavior: "smooth" });
          }
        }, 180);
      }
    };

    handleHash();
    window.addEventListener("hashchange", handleHash);
    return () => window.removeEventListener("hashchange", handleHash);
  }, []);

  const getServiceSlug = (title: string, id?: string) => {
    if (id && id.length > 2 && !id.startsWith("srv-")) return id;
    const lower = title.toLowerCase();
    if (lower.includes("brand")) return "branding";
    if (lower.includes("graphic")) return "graphic-design";
    if (lower.includes("market")) return "digital-marketing";
    if (lower.includes("ai")) return "ai-agents";
    if (lower.includes("web")) return "web-development";
    if (lower.includes("app")) return "app-development";
    return title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  };

  return (
    <div className="bg-black min-h-screen text-white font-sans relative flex flex-col w-full selection:bg-yellow-400 selection:text-black">
      <Navbar />

      <main className="flex-grow w-full relative z-10 pt-32 pb-24 px-6 md:px-12 max-w-7xl mx-auto flex flex-col gap-16">
        {/* Header */}
        <section className="flex flex-col items-start max-w-3xl pt-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-semibold uppercase tracking-wider text-yellow-400 mb-6">
            <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
            Our Services
          </div>
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-[1.08] mb-6">
            Designed for <span className="text-yellow-400">Growth, Quality,</span> and Impact.
          </h1>
          <p className="text-base sm:text-lg text-zinc-400 leading-relaxed">
            We deliver every service with clear milestones, high attention to detail, transparent communication, and 100% full ownership.
          </p>
        </section>

        {/* Services List with Images */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const cleanTitle = service.title.replace(/ & CRM/gi, "");
            const imageSrc = serviceImageMap[cleanTitle] || serviceImageMap[service.title] || "https://images.unsplash.com/photo-1547658719-da2b51169166?w=800&auto=format&fit=crop&q=80";
            const slug = getServiceSlug(cleanTitle, service.id);
            const isHighlighted = activeHash === slug || activeHash === service.id;

            return (
              <div 
                key={service.id || index}
                id={slug}
                className={`p-6 sm:p-7 rounded-2xl bg-zinc-950 border transition-all duration-700 ease-out flex flex-col justify-between group scroll-mt-36 ${
                  isHighlighted 
                    ? "border-yellow-400 shadow-[0_0_35px_rgba(250,204,21,0.25)] ring-1 ring-yellow-400" 
                    : "border-zinc-800/80 hover:border-yellow-400/60"
                }`}
              >
                <div>
                  {/* Service Image Header (Replacing Icon) */}
                  <div className="relative w-full h-48 rounded-xl overflow-hidden mb-6 border border-zinc-800/80 bg-zinc-900">
                    <Image
                      src={imageSrc}
                      alt={cleanTitle}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    {service.badge && (
                      <span className="absolute top-3 right-3 text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-black/80 backdrop-blur-md border border-zinc-700 text-yellow-400">
                        {service.badge}
                      </span>
                    )}
                  </div>

                  <h2 className="text-2xl font-bold text-white mb-3 group-hover:text-yellow-400 transition-colors">
                    {cleanTitle}
                  </h2>
                  <p className="text-sm text-zinc-400 leading-relaxed mb-6 font-normal">
                    {service.description}
                  </p>

                  <div className="border-t border-zinc-900 pt-5 mb-6">
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-500 block mb-3">
                      What&apos;s Included:
                    </span>
                    <ul className="flex flex-col gap-2.5">
                      {service.features.map((feat, fIdx) => (
                        <li key={fIdx} className="text-xs text-zinc-300 flex items-center gap-2">
                          <Check className="w-3.5 h-3.5 text-yellow-400 flex-shrink-0" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-4 border-t border-zinc-900 flex items-center justify-between mt-2">
                  <Link
                    href={`/start-project?service=${encodeURIComponent(cleanTitle)}`}
                    className="w-full py-3 px-4 rounded-xl bg-zinc-900 hover:bg-yellow-400 hover:text-black border border-zinc-800 hover:border-yellow-400 text-xs font-bold text-yellow-400 flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    Start Your Own Identity <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </section>
      </main>

      <Footer />
    </div>
  );
}
