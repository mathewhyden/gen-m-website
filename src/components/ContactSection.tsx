"use client";

import React, { useState } from "react";
import {
  Mail,
  Phone,
  MapPin,
  ExternalLink,
  Calendar,
  MessageCircle,
  Copy,
  Check,
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

        {/* Contact Information & Map Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Company Details & Quick Actions */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="p-7 md:p-8 rounded-2xl bg-zinc-950 border border-zinc-800 flex flex-col gap-7">
              <h3 className="text-2xl font-bold text-white">Company Contacts</h3>

              {/* Email Item */}
              <div className="flex flex-col gap-3 pb-6 border-b border-zinc-900">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-yellow-400/10 border border-yellow-400/20 flex items-center justify-center text-yellow-400 shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div className="flex-grow min-w-0">
                    <span className="text-xs font-mono uppercase tracking-wider text-zinc-500 block">
                      Email Address
                    </span>
                    <div className="flex items-center gap-2 flex-wrap mt-0.5">
                      <a
                        href="mailto:admin.genm@gmail.com"
                        className="text-base font-semibold text-white hover:text-yellow-400 transition-colors break-all"
                        title="Send email to Gen-M"
                      >
                        admin.genm@gmail.com
                      </a>
                      <button
                        type="button"
                        onClick={handleCopyEmail}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-[11px] font-mono text-zinc-400 hover:text-yellow-400 hover:border-yellow-400 transition-colors cursor-pointer"
                        title="Copy email address"
                      >
                        {copied ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-400" />
                            <span className="text-emerald-400">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Phone 1: +91 87542 54943 with Call & WhatsApp Buttons */}
              <div className="flex flex-col gap-3 pb-6 border-b border-zinc-900">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-yellow-400/10 border border-yellow-400/20 flex items-center justify-center text-yellow-400 shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-mono uppercase tracking-wider text-zinc-500 block">
                      Phone &amp; WhatsApp (Primary)
                    </span>
                    <span className="text-base font-semibold text-white font-mono">
                      +91 87542 54943
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-1">
                  <a
                    href="https://wa.me/918754254943?text=Hi%20Gen-M%20team,%20I'd%20like%20to%20discuss%20a%20project."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2.5 px-3 rounded-xl bg-emerald-950/40 hover:bg-emerald-500 hover:text-black border border-emerald-800/60 text-xs font-bold text-emerald-400 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  >
                    <MessageCircle className="w-4 h-4" />
                    WhatsApp
                  </a>
                  <a
                    href="tel:8754254943"
                    className="py-2.5 px-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-800 text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Phone className="w-3.5 h-3.5 text-yellow-400" />
                    Call Now
                  </a>
                </div>
              </div>

              {/* Phone 2: +91 97868 53498 with Call & WhatsApp Buttons */}
              <div className="flex flex-col gap-3 pb-2">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-yellow-400/10 border border-yellow-400/20 flex items-center justify-center text-yellow-400 shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-mono uppercase tracking-wider text-zinc-500 block">
                      Phone &amp; WhatsApp (Secondary)
                    </span>
                    <span className="text-base font-semibold text-white font-mono">
                      +91 97868 53498
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-1">
                  <a
                    href="https://wa.me/919786853498?text=Hi%20Gen-M%20team,%20I'd%20like%20to%20discuss%20a%20project."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2.5 px-3 rounded-xl bg-emerald-950/40 hover:bg-emerald-500 hover:text-black border border-emerald-800/60 text-xs font-bold text-emerald-400 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  >
                    <MessageCircle className="w-4 h-4" />
                    WhatsApp
                  </a>
                  <a
                    href="tel:9786853498"
                    className="py-2.5 px-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-800 text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Phone className="w-3.5 h-3.5 text-yellow-400" />
                    Call Now
                  </a>
                </div>
              </div>
            </div>

            {/* Quick Action: Schedule Meeting or Start Project */}
            <div className="p-6 rounded-2xl bg-zinc-950 border border-zinc-800 flex flex-col gap-3">
              <span className="text-xs font-bold uppercase tracking-wider text-yellow-400">
                Prefer a Scheduled Consultation?
              </span>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Pick a convenient time for a 1-on-1 discovery meeting with our technical team.
              </p>
              <div className="flex gap-3 pt-2">
                <Link
                  href="/book-consultation"
                  className="w-full py-2.5 px-4 rounded-xl bg-yellow-400 text-black font-bold text-xs uppercase tracking-wider hover:bg-yellow-300 transition-colors flex items-center justify-center gap-1.5"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  Book Consultation
                </Link>
                <Link
                  href="/book-consultation"
                  className="w-full py-2.5 px-4 rounded-xl bg-zinc-900 border border-zinc-700 text-white font-semibold text-xs uppercase tracking-wider hover:border-yellow-400 transition-colors flex items-center justify-center"
                >
                  Start Project
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
                  <h3 className="text-2xl font-bold text-white">Visit Our Studio</h3>
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
                    <span>Gen-M Studio Headquarters</span>
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
