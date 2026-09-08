"use client";

import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { 
  Mail, 
  Phone, 
  MapPin, 
  ExternalLink, 
  MessageCircle, 
  Copy, 
  Check, 
  ArrowRight
} from "lucide-react";
import Link from "next/link";

export default function ContactPage() {
  const mapLink = "https://maps.app.goo.gl/g1buKqDA5aJZxvA76";
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = (e: React.MouseEvent) => {
    e.preventDefault();
    navigator.clipboard.writeText("admin.genm@gmail.com");
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="bg-black min-h-screen text-white font-sans relative flex flex-col w-full overflow-x-hidden">
      <Navbar />

      <main className="flex-grow w-full relative z-10 pt-32 pb-24 px-6 md:px-12 max-w-7xl mx-auto flex flex-col gap-12">
        {/* Header */}
        <section className="flex flex-col items-start max-w-3xl pt-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-semibold uppercase tracking-wider text-yellow-400 mb-6">
            <MessageCircle className="w-3.5 h-3.5 text-yellow-400" />
            Get in Touch
          </div>
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-[1.1] mb-6">
            Let’s Work <span className="text-yellow-400">Together.</span>
          </h1>
          <p className="text-base sm:text-lg text-zinc-400 leading-relaxed">
            Have a question or looking to start a new project? Reach out to us via direct Gmail redirection, phone, WhatsApp, or visit our office.
          </p>
        </section>

        {/* Contact Information & Map Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Company Details & Quick Actions */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="p-8 rounded-2xl bg-zinc-950 border border-zinc-800 flex flex-col gap-6">
              <h2 className="text-2xl font-bold text-white">Company Contacts</h2>

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
            <div className="p-8 rounded-2xl bg-zinc-950 border border-zinc-800 flex flex-col justify-between h-full gap-6">
              <div className="flex items-start justify-between flex-wrap gap-4">
                <div>
                  <div className="flex items-center gap-2 text-yellow-400 text-xs font-mono font-bold uppercase tracking-wider mb-2">
                    <MapPin className="w-4 h-4 text-yellow-400" />
                    Our Office Location
                  </div>
                  <h2 className="text-2xl font-bold text-white">Visit Gen-M Tech</h2>
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
              <div className="relative w-full min-h-[380px] lg:min-h-[440px] rounded-xl overflow-hidden border border-zinc-800 bg-zinc-900 flex flex-col">
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

              </main>

      <Footer />
    </div>
  );
}
