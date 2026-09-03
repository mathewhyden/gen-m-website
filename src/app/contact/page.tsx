"use client";

import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { 
  Mail, 
  Phone, 
  MapPin, 
  ExternalLink, 
  Calendar, 
  MessageCircle, 
  Copy, 
  Check, 
  Send,
  CheckCircle2,
  Sparkles
} from "lucide-react";
import Link from "next/link";

export default function ContactPage() {
  const mapLink = "https://maps.app.goo.gl/g1buKqDA5aJZxvA76";
  const [copied, setCopied] = useState(false);

  // Quick message form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "Project Inquiry | Gen-M Studio",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleCopyEmail = (e: React.MouseEvent) => {
    e.preventDefault();
    navigator.clipboard.writeText("admin.genm@gmail.com");
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const getGmailUrl = (subject?: string, message?: string) => {
    const s = subject || formData.subject || "Project Inquiry | Gen-M Studio";
    const b = message || (
      formData.message
        ? `Name: ${formData.name || 'Not provided'}\nEmail: ${formData.email || 'Not provided'}\nPhone: ${formData.phone || 'Not provided'}\n\nMessage:\n${formData.message}`
        : "Hello Gen-M Team,\n\nI would like to discuss a project with you.\n\nBest regards,"
    );
    return `https://mail.google.com/mail/?view=cm&fs=1&to=admin.genm@gmail.com&su=${encodeURIComponent(s)}&body=${encodeURIComponent(b)}`;
  };

  const handleOnlineSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          service: formData.subject || "Contact Form Inquiry",
          message: formData.message || "Quick message from contact page",
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to send message");
      setSubmitted(true);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to send message. Please try again or open Gmail directly.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-black min-h-screen text-white font-sans relative flex flex-col w-full selection:bg-yellow-400 selection:text-black">
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
            <div className="p-8 rounded-2xl bg-zinc-950 border border-zinc-800 flex flex-col gap-7">
              <h2 className="text-2xl font-bold text-white">Company Contacts</h2>

              {/* Email Item with Direct Gmail Redirection and Mail Client Options */}
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
                        href={getGmailUrl()}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-base font-semibold text-white hover:text-yellow-400 transition-colors break-all"
                        title="Click to compose in Gmail"
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

                {/* Direct Redirection Button: Open in Gmail */}
                <div className="mt-2">
                  <a
                    href={getGmailUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 px-4 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-black font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer"
                  >
                    <Mail className="w-4 h-4" />
                    Open in Gmail ↗
                  </a>
                </div>
                <p className="text-[11px] text-zinc-500 leading-tight">
                  Redirects directly to Gmail compose with our email address ready.
                </p>
              </div>

              {/* Phone 1: +91 87542 54943 with Call & WhatsApp Buttons */}
              <div className="flex flex-col gap-3 pb-6 border-b border-zinc-900">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-yellow-400/10 border border-yellow-400/20 flex items-center justify-center text-yellow-400 shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-mono uppercase tracking-wider text-zinc-500 block">
                      Phone & WhatsApp (Primary)
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
                      Phone & WhatsApp (Secondary)
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

            {/* Quick Action: Start Project or Book Call */}
            <div className="p-6 rounded-2xl bg-zinc-950 border border-zinc-800 flex flex-col gap-3">
              <span className="text-xs font-bold uppercase tracking-wider text-yellow-400">
                Prefer a Scheduled Meeting?
              </span>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Pick a convenient time for a 1-on-1 consultation to discuss your vision and roadmap.
              </p>
              <div className="flex gap-3 pt-2">
                <Link
                  href="/book-consultation"
                  className="w-full py-2.5 px-4 rounded-xl bg-yellow-400 text-black font-bold text-xs uppercase tracking-wider hover:bg-yellow-300 transition-colors flex items-center justify-center gap-1.5"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  Book Call
                </Link>
                <Link
                  href="/start-project"
                  className="w-full py-2.5 px-4 rounded-xl bg-zinc-900 border border-zinc-700 text-white font-semibold text-xs uppercase tracking-wider hover:border-yellow-400 transition-colors flex items-center justify-center"
                >
                  Start Project
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
                  <h2 className="text-2xl font-bold text-white">Visit Our Company</h2>
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
                    <span>Gen-M Company Headquarters</span>
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

        {/* Direct Email / Message Form Section */}
        <section className="mt-4 p-8 md:p-10 rounded-3xl bg-zinc-950 border border-zinc-800/80">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-semibold uppercase tracking-wider text-yellow-400 mb-3">
              <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
              Direct Message
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
              Send an Instant Message or Compose via <span className="text-yellow-400">Gmail</span>
            </h2>
            <p className="text-sm text-zinc-400 mb-8">
              Fill out your details below. You can either submit it directly to our team or redirect straight to Gmail with all details pre-filled.
            </p>

            {submitted ? (
              <div className="p-8 rounded-2xl bg-zinc-900/70 border border-yellow-400/30 flex flex-col items-center text-center gap-4">
                <div className="w-14 h-14 rounded-full bg-yellow-400/10 border border-yellow-400/30 flex items-center justify-center text-yellow-400">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-white">Message Received!</h3>
                <p className="text-xs text-zinc-400 max-w-md">
                  Thank you for contacting Gen-M Studio. We have logged your request and our team will get back to you within 24 hours.
                </p>
                <div className="flex flex-wrap gap-3 mt-2">
                  <a
                    href={getGmailUrl(formData.subject, `Hi Gen-M Team,\n\nFollowing up on my message:\nName: ${formData.name}\nEmail: ${formData.email}\nPhone: ${formData.phone}\n\n${formData.message}`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-2.5 rounded-full bg-yellow-400 text-black font-bold text-xs uppercase tracking-wider hover:bg-yellow-300 transition-all flex items-center gap-1.5"
                  >
                    <Mail className="w-4 h-4" />
                    Open Copy in Gmail ↗
                  </a>
                  <button
                    type="button"
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({ name: "", email: "", phone: "", subject: "Project Inquiry | Gen-M Studio", message: "" });
                    }}
                    className="px-5 py-2.5 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-300 text-xs hover:border-yellow-400 transition-colors"
                  >
                    Send Another Message
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleOnlineSubmit} className="flex flex-col gap-5">
                {errorMsg && (
                  <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-mono">
                    {errorMsg}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-mono uppercase tracking-wider text-zinc-400">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Alex Morgan"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-yellow-400 transition-colors"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-mono uppercase tracking-wider text-zinc-400">
                      Your Email *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="alex@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-yellow-400 transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-mono uppercase tracking-wider text-zinc-400">
                      Phone / WhatsApp Number
                    </label>
                    <input
                      type="text"
                      placeholder="+91 87542 54943"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-yellow-400 transition-colors"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-mono uppercase tracking-wider text-zinc-400">
                      Subject
                    </label>
                    <input
                      type="text"
                      placeholder="Website Design / Brand Identity / AI Automation"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-yellow-400 transition-colors"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-mono uppercase tracking-wider text-zinc-400">
                    Your Message / Requirements *
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Tell us about your project, timeline, or any questions you have..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-yellow-400 transition-colors resize-none"
                  />
                </div>

                {/* Dual Action Buttons: Send via Gmail Redirection OR Submit Online */}
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <a
                    href={getGmailUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3.5 rounded-full bg-yellow-400 hover:bg-yellow-300 text-black font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer"
                  >
                    <Mail className="w-4 h-4" />
                    <span>Redirect &amp; Send via Gmail ↗</span>
                  </a>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-6 py-3.5 rounded-full bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 hover:border-yellow-400 text-white font-semibold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
                  >
                    <Send className="w-4 h-4 text-yellow-400" />
                    <span>{submitting ? "Sending..." : "Submit Online Inquiry"}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
