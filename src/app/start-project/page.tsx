"use client";

import React, { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { 
  Sparkles, 
  Check, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  Code2, 
  Palette, 
  Bot, 
  TrendingUp, 
  Smartphone,
  PenTool,
  Send,
  Mail
} from "lucide-react";

export default function StartProjectPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    services: [] as string[],
    name: "",
    email: "",
    company: "",
    phone: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const serviceOptions = [
    { title: "Web Development", desc: "Websites, web applications & landing pages", icon: Code2 },
    { title: "Brand Identity", desc: "Logos, visual identity & brand guidelines", icon: Palette },
    { title: "AI Agents & Automation", desc: "Smart AI tools, chatbots & workflow automation", icon: Bot },
    { title: "Graphic Design", desc: "Marketing visuals, social media designs & banners", icon: PenTool },
    { title: "App Development", desc: "Mobile applications for iOS and Android", icon: Smartphone },
    { title: "Digital Marketing", desc: "SEO, social media marketing & online campaigns", icon: TrendingUp },
  ];

  const toggleService = (srv: string) => {
    if (formData.services.includes(srv)) {
      setFormData({ ...formData, services: formData.services.filter(s => s !== srv) });
    } else {
      setFormData({ ...formData, services: [...formData.services, srv] });
    }
  };

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          company: formData.company,
          service: formData.services.join(", ") || "Custom Project",
          message: formData.message || "Project initialized through Gen-M website.",
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Submission failed");
      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-black min-h-screen text-white font-sans relative flex flex-col w-full selection:bg-yellow-400 selection:text-black">
      <Navbar />

      <main className="flex-grow w-full relative z-10 pt-32 pb-24 px-6 md:px-12 max-w-4xl mx-auto flex flex-col gap-10">
        {/* Top Indicator */}
        <div className="flex flex-col items-center text-center pt-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-semibold uppercase tracking-wider text-yellow-400 mb-4">
            <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
            Start a Project
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-3">
            Start Your Own <span className="text-yellow-400">Identity</span>
          </h1>
          <p className="text-sm text-zinc-400 max-w-lg">
            Choose the services you need and tell us about your project in 2 simple steps.
          </p>

          {/* 2-Step Progress Indicator */}
          {!submitted && (
            <div className="flex items-center gap-3 mt-8">
              {[1, 2].map((s) => (
                <div key={s} className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-mono text-xs font-bold transition-colors ${
                    step === s 
                      ? "bg-yellow-400 text-black" 
                      : step > s 
                        ? "bg-zinc-800 text-yellow-400 border border-yellow-400/40" 
                        : "bg-zinc-900 text-zinc-500 border border-zinc-800"
                  }`}>
                    {step > s ? "✓" : s}
                  </div>
                  {s < 2 && <div className={`w-16 h-0.5 ${step > s ? "bg-yellow-400/60" : "bg-zinc-800"}`} />}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Form Container */}
        <div className="p-8 md:p-12 rounded-3xl bg-zinc-950 border border-zinc-800/80">
          {submitted ? (
            <div className="py-12 text-center flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-yellow-400/10 border border-yellow-400/30 flex items-center justify-center text-yellow-400">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <h2 className="text-3xl font-bold text-white">Project Request Received!</h2>
              <p className="text-zinc-400 text-sm max-w-md leading-relaxed">
                Thank you for reaching out to Gen-M. We have received your project details and our team will get in touch with you shortly.
              </p>
              <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-3 mt-6">
                <a
                  href={`https://mail.google.com/mail/?view=cm&fs=1&to=admin.genm@gmail.com&su=${encodeURIComponent(`Project Request: ${formData.services.join(', ') || 'New Project'}`)}&body=${encodeURIComponent(`Hello Gen-M Team,\n\nHere are my project details:\nName: ${formData.name}\nEmail: ${formData.email}\nPhone: ${formData.phone || 'Not provided'}\nCompany: ${formData.company || 'Not provided'}\nServices: ${formData.services.join(', ')}\n\nProject Brief:\n${formData.message}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 rounded-full bg-yellow-400 text-black font-bold text-xs uppercase tracking-wider hover:bg-yellow-300 transition-all flex items-center gap-1.5 shadow-sm"
                >
                  <Mail className="w-3.5 h-3.5" />
                  Send Copy via Gmail ↗
                </a>
                <Link
                  href="/book-consultation"
                  className="px-5 py-2.5 rounded-full bg-zinc-900 border border-yellow-400/50 hover:border-yellow-400 text-yellow-400 text-xs font-bold uppercase tracking-wider transition-colors"
                >
                  Book Consultation Call →
                </Link>
                <Link
                  href="/"
                  className="px-5 py-2.5 rounded-full bg-zinc-900 border border-zinc-750 text-xs font-mono text-zinc-300 hover:text-white transition-colors"
                >
                  Return to Home
                </Link>
              </div>
            </div>
          ) : (
            <div>
              {/* Step 1: Select Services */}
              {step === 1 && (
                <div className="flex flex-col gap-6">
                  <div>
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-yellow-400 block mb-1">Step 1 of 2</span>
                    <h2 className="text-2xl font-bold text-white">Select Services</h2>
                    <p className="text-xs text-zinc-400">Choose the services you need for your project.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {serviceOptions.map((opt) => {
                      const Icon = opt.icon;
                      const isSelected = formData.services.includes(opt.title);
                      return (
                        <div
                          key={opt.title}
                          onClick={() => toggleService(opt.title)}
                          className={`p-5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between gap-3 ${
                            isSelected
                              ? "bg-zinc-900 border-yellow-400 shadow-[0_0_15px_rgba(255,215,0,0.1)]"
                              : "bg-zinc-950 border-zinc-800 hover:border-zinc-700"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-yellow-400">
                              <Icon className="w-4 h-4" />
                            </div>
                            <div className={`w-5 h-5 rounded-md border flex items-center justify-center ${
                              isSelected ? "bg-yellow-400 border-yellow-400 text-black" : "border-zinc-700 bg-zinc-900"
                            }`}>
                              {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                            </div>
                          </div>
                          <div>
                            <h3 className="text-sm font-bold text-white">{opt.title}</h3>
                            <p className="text-xs text-zinc-400 mt-1">{opt.desc}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex justify-end pt-4">
                    <button
                      onClick={() => setStep(2)}
                      disabled={formData.services.length === 0}
                      className="px-6 py-3 rounded-full bg-yellow-400 text-black font-bold text-xs uppercase tracking-wider hover:bg-yellow-300 transition-colors flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                    >
                      Next: Your Details <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Step 2: Your Details & Submit */}
              {step === 2 && (
                <form onSubmit={handleFinalSubmit} className="flex flex-col gap-6">
                  <div>
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-yellow-400 block mb-1">Step 2 of 2</span>
                    <h2 className="text-2xl font-bold text-white">Your Details</h2>
                    <p className="text-xs text-zinc-400">Tell us about yourself and your project so our team can get in touch.</p>
                  </div>

                  {error && (
                    <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-mono">
                      {error}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-mono uppercase tracking-wider text-zinc-400">Full Name *</label>
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
                      <label className="text-xs font-mono uppercase tracking-wider text-zinc-400">Email Address *</label>
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
                      <label className="text-xs font-mono uppercase tracking-wider text-zinc-400">Company / Brand Name</label>
                      <input
                        type="text"
                        placeholder="Your Company Name"
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-yellow-400 transition-colors"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-mono uppercase tracking-wider text-zinc-400">Phone / WhatsApp</label>
                      <input
                        type="text"
                        placeholder="+91 98765 43210"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-yellow-400 transition-colors"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-mono uppercase tracking-wider text-zinc-400">Project Details & Requirements</label>
                    <textarea
                      rows={4}
                      placeholder="Tell us about your project, goals, or any specific requirements..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="bg-zinc-900 border border-zinc-800 rounded-xl p-3.5 text-sm text-white focus:outline-none focus:border-yellow-400 transition-colors resize-none"
                    />
                  </div>

                  {/* Selected Services Summary */}
                  <div className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800 text-xs font-mono flex flex-col gap-1.5">
                    <span className="text-yellow-400 font-bold uppercase">Selected Services:</span>
                    <span className="text-zinc-300 font-sans">{formData.services.join(", ") || "None selected"}</span>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="px-5 py-2.5 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-mono text-zinc-400 hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" /> Back
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-7 py-3 rounded-full bg-yellow-400 text-black font-bold text-xs uppercase tracking-wider hover:bg-yellow-300 transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      {loading ? "Submitting..." : "Start Your Project"}
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
