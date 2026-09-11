"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Mail,
  Phone,
  MapPin,
  ExternalLink,
  MessageCircle,
  Copy,
  Check,
  ArrowRight,
  Sparkles,
  Smartphone,
  Bot,
} from "lucide-react";
import Link from "next/link";
import { ScrollReveal } from "./ScrollReveal";
import { MaskWipeText, LetterSpacingExpand, TextShimmer } from "./TextAnimations";

export default function ContactSection() {
  const mapLink = "https://maps.app.goo.gl/g1buKqDA5aJZxvA76";
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = (e: React.MouseEvent) => {
    e.preventDefault();
    navigator.clipboard.writeText("admin.genm@gmail.com");
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <section
      id="contact"
      className="relative py-20 md:py-28 bg-black z-10 px-6 md:px-12 scroll-mt-20"
    >
      <div className="max-w-7xl mx-auto flex flex-col gap-12 md:gap-16">
        {/* Header with Smooth Scroll Reveal - Restored Left-Aligned */}
        <ScrollReveal delay={0.05} yOffset={20}>
          <div className="flex flex-col items-start max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-semibold uppercase tracking-wider text-yellow-400 mb-5">
              <MessageCircle className="w-3.5 h-3.5 text-yellow-400" />
              <LetterSpacingExpand text="Contact &amp; Inquiries" delay={0.1} />
            </div>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight uppercase leading-[1.08] mb-5 text-white">
              <MaskWipeText text="Let’s Work " delay={0.15} />
              <TextShimmer text="Together." />
            </h2>
            <p className="text-base sm:text-lg text-zinc-300 leading-relaxed font-normal">
              Have a question or looking to start a new project? Reach out to us via direct email, phone, WhatsApp, scheduled consultation, or visit our office.
            </p>
          </div>
        </ScrollReveal>

        {/* 3D Tech Character / Mobile Studio Visual Banner */}
        <ScrollReveal delay={0.1} yOffset={25}>
          <div 
            id="contact-visual-banner" 
            className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-zinc-950 via-zinc-900/90 to-zinc-950 border border-yellow-500/25 backdrop-blur-xl shadow-[0_0_60px_-15px_rgba(250,204,21,0.15)] p-6 sm:p-8 lg:p-10"
          >
            {/* Subtle Ambient Gold/Yellow Glows */}
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-yellow-400/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-yellow-500/5 via-transparent to-transparent pointer-events-none" />

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Left Content Column */}
              <div className="lg:col-span-6 flex flex-col gap-5">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-yellow-400/10 border border-yellow-400/30 text-yellow-400 text-xs font-mono font-semibold tracking-wide w-fit">
                  <Sparkles className="w-3.5 h-3.5 text-yellow-400 animate-pulse" />
                  <span>Mobile Studio & 3D Interactive Lab</span>
                </div>

                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight">
                  Emerging Digital Solutions. <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-amber-300 to-yellow-500">
                    Built for the Future.
                  </span>
                </h3>

                <p className="text-sm sm:text-base text-zinc-300 leading-relaxed max-w-xl">
                  From responsive mobile apps and autonomous AI agents to high-conversion brand identity and 3D web experiences, Gen-M Tech engineers digital products that elevate your brand and accelerate real business growth.
                </p>

                {/* Feature Highlights Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-zinc-900/80 border border-zinc-800/90 shadow-sm">
                    <div className="w-9 h-9 rounded-xl bg-yellow-400/10 border border-yellow-400/20 flex items-center justify-center text-yellow-400 shrink-0">
                      <Smartphone className="w-4 h-4" />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-xs font-bold text-white truncate">App & Web Development</span>
                      <span className="text-[11px] text-zinc-400 truncate">Native iOS, Android & Next.js</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-zinc-900/80 border border-zinc-800/90 shadow-sm">
                    <div className="w-9 h-9 rounded-xl bg-yellow-400/10 border border-yellow-400/20 flex items-center justify-center text-yellow-400 shrink-0">
                      <Bot className="w-4 h-4" />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-xs font-bold text-white truncate">AI Agent Workflows</span>
                      <span className="text-[11px] text-zinc-400 truncate">Automation & Custom LLMs</span>
                    </div>
                  </div>
                </div>

                {/* Interactive CTAs */}
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <Link
                    href="/start-project"
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-yellow-400 text-black font-bold text-xs uppercase tracking-wider hover:bg-yellow-300 transition-all shadow-md shadow-yellow-400/20 cursor-pointer"
                  >
                    <span>Start Your Project</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                  <a
                    href="https://wa.me/918754254943?text=Hi%20Gen-M%20Tech%20team,%20I'd%20like%20to%20discuss%20a%20project."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800 font-bold text-xs uppercase tracking-wider transition-all cursor-pointer"
                  >
                    <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Instant WhatsApp Chat</span>
                  </a>
                </div>
              </div>

              {/* Right Visual Image Column with 3D Character Illustration */}
              <div className="lg:col-span-6 w-full">
                <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] lg:aspect-[4/3] rounded-2xl overflow-hidden border border-yellow-400/30 bg-zinc-950 shadow-2xl group">
                  <Image
                    src="/3d-character-emerging-from-smartphone.jpg"
                    alt="3D Tech Character & Mobile Studio - Gen-M Tech"
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
                    className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />

                  {/* Aesthetic Vignette & Gradient Overlays */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-transparent pointer-events-none hidden lg:block" />

                  {/* Floating Top Badge */}
                  <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/70 backdrop-blur-md border border-yellow-400/40 text-yellow-400 font-bold text-[11px] shadow-lg">
                    <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
                    <span>3D Tech Studio</span>
                  </div>

                  {/* Floating Bottom Status Pill */}
                  <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 z-10 flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-black/80 backdrop-blur-md border border-white/10 text-white shadow-lg">
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
                    </span>
                    <div className="flex flex-col">
                      <span className="text-[11px] font-bold text-zinc-100">Live Innovation & Dev Lab</span>
                      <span className="text-[10px] text-zinc-400 font-mono">Madurai • Global Delivery</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* Contact Information & Map Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Company Details & Quick Actions */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="p-7 md:p-8 rounded-2xl bg-zinc-950 border border-zinc-800 flex flex-col gap-6">
              <h3 className="text-2xl font-bold text-white">Company Contacts</h3>

              {/* Row 1: Email */}
              <div className="flex items-center justify-between gap-3 pb-5 border-b border-zinc-900">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-yellow-400/10 border border-yellow-400/20 flex items-center justify-center text-yellow-400 shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <a
                    href="mailto:admin.genm@gmail.com"
                    className="text-sm sm:text-base font-semibold text-white hover:text-yellow-400 transition-colors truncate"
                    title="Send email to Gen-M Tech"
                  >
                    admin.genm@gmail.com
                  </a>
                </div>
                <button
                  type="button"
                  onClick={handleCopyEmail}
                  className="w-9 h-9 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-yellow-400 hover:border-yellow-400 transition-colors shrink-0 cursor-pointer"
                  title="Copy email address"
                  aria-label="Copy email address"
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>

              {/* Row 2: Phone 1 + WhatsApp & Call Buttons (Icons Only) */}
              <div className="flex items-center justify-between gap-3 pb-5 border-b border-zinc-900">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-yellow-400/10 border border-yellow-400/20 flex items-center justify-center text-yellow-400 shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <span className="text-sm sm:text-base font-semibold text-white font-mono truncate">
                    +91 87542 54943
                  </span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <a
                    href="https://wa.me/918754254943?text=Hi%20Gen-M%20Tech%20team,%20I'd%20like%20to%20discuss%20a%20project."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-lg bg-emerald-950/40 hover:bg-emerald-500 hover:text-black border border-emerald-800/60 text-emerald-400 flex items-center justify-center transition-all cursor-pointer shadow-sm"
                    title="WhatsApp"
                    aria-label="WhatsApp"
                  >
                    <MessageCircle className="w-4 h-4" />
                  </a>
                  <a
                    href="tel:8754254943"
                    className="w-9 h-9 rounded-lg bg-zinc-900 hover:bg-yellow-400 hover:text-black text-yellow-400 border border-zinc-800 flex items-center justify-center transition-all cursor-pointer shadow-sm"
                    title="Call Now"
                    aria-label="Call Now"
                  >
                    <Phone className="w-4 h-4" />
                  </a>
                </div>
              </div>

              {/* Row 3: Phone 2 + WhatsApp & Call Buttons (Icons Only) */}
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-yellow-400/10 border border-yellow-400/20 flex items-center justify-center text-yellow-400 shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <span className="text-sm sm:text-base font-semibold text-white font-mono truncate">
                    +91 97868 53498
                  </span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <a
                    href="https://wa.me/919786853498?text=Hi%20Gen-M%20Tech%20team,%20I'd%20like%20to%20discuss%20a%20project."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-lg bg-emerald-950/40 hover:bg-emerald-500 hover:text-black border border-emerald-800/60 text-emerald-400 flex items-center justify-center transition-all cursor-pointer shadow-sm"
                    title="WhatsApp"
                    aria-label="WhatsApp"
                  >
                    <MessageCircle className="w-4 h-4" />
                  </a>
                  <a
                    href="tel:9786853498"
                    className="w-9 h-9 rounded-lg bg-zinc-900 hover:bg-yellow-400 hover:text-black text-yellow-400 border border-zinc-800 flex items-center justify-center transition-all cursor-pointer shadow-sm"
                    title="Call Now"
                    aria-label="Call Now"
                  >
                    <Phone className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>

            {/* Quick Action: Scheduled Consultation -> Start Project only */}
            <div className="p-6 rounded-2xl bg-zinc-950 border border-zinc-800 flex flex-col gap-3">
              <span className="text-xs font-bold uppercase tracking-wider text-yellow-400">
                Prefer a Scheduled Consultation?
              </span>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Pick a convenient time for a 1-on-1 discovery meeting with our technical team.
              </p>
              <div className="pt-2">
                <Link
                  href="/start-project"
                  className="w-full py-3 px-4 rounded-xl bg-yellow-400 text-black font-bold text-xs uppercase tracking-wider hover:bg-yellow-300 transition-colors flex items-center justify-center gap-2 shadow-md shadow-yellow-400/10 cursor-pointer"
                >
                  Start Project
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>

          {/* Google Maps Location Section */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <div className="p-7 md:p-8 rounded-2xl bg-zinc-950 border border-zinc-800 flex flex-col justify-between h-full gap-6">
              <div className="flex items-start justify-between flex-wrap gap-4">
                <div>
                  <div className="flex items-center gap-2 text-yellow-400 text-xs font-mono font-bold uppercase tracking-wider mb-2">
                    <MapPin className="w-4 h-4 text-yellow-400" />
                    Our Office Location
                  </div>
                  <h3 className="text-2xl font-bold text-white">Visit Gen-M Tech</h3>
                  <p className="text-xs text-zinc-400 mt-1">
                    Find our office easily or navigate directly using Google Maps.
                  </p>
                </div>

                <a
                  href={mapLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-yellow-400 text-black font-bold text-xs uppercase tracking-wider hover:bg-yellow-300 transition-all cursor-pointer shadow-sm"
                >
                  <span>Open in Google Maps</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              {/* Map View Frame */}
              <div className="relative w-full min-h-[380px] lg:min-h-[420px] rounded-xl overflow-hidden border border-zinc-800 bg-zinc-900 flex flex-col">
                <iframe
                  title="Gen-M Company Location Map"
                  src="https://maps.google.com/maps?q=9.9252,78.1198&t=&z=14&ie=UTF8&iwloc=&output=embed"
                  width="100%"
                  height="100%"
                  className="w-full flex-grow border-0 min-h-[340px]"
                  loading="lazy"
                  allowFullScreen
                  referrerPolicy="no-referrer-when-downgrade"
                />
                <div className="bg-zinc-900/95 border-t border-zinc-800 p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2 text-zinc-300">
                    <MapPin className="w-4 h-4 text-yellow-400 shrink-0" />
                    <span>Gen-M Tech Headquarters</span>
                  </div>
                  <a
                    href={mapLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-yellow-400 font-bold hover:underline flex items-center gap-1 font-mono"
                  >
                    View Exact Coordinates ↗
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
