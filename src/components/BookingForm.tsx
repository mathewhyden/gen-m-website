"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Check, Loader2 } from "lucide-react";
import { MagneticButton } from "./Navbar";

export default function BookingForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    service: "",
    budget: "",
    message: "",
  });

  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.service) return;

    setStatus("loading");
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setStatus("success");
    setFormData({ name: "", email: "", service: "", budget: "", message: "" });
  };

  const services = [
    "Branding",
    "Graphic Design",
    "Digital Marketing",
    "AI Agents",
    "Web Development",
    "App Development",
  ];

  const budgets = [
    "$10,000 — $25,000",
    "$25,000 — $50,000",
    "$50,000 — $100,000",
    "$100,000+",
  ];

  return (
    <section id="booking" className="relative py-24 md:py-32 bg-black z-10 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-yellow-400">
            Start Your Journey
          </span>
          {/* H2 Heading - MUST BE VIBRANT YELLOW */}
          <h2 className="text-4xl md:text-5xl font-black tracking-tight text-yellow-400 mt-3 leading-tight uppercase">
            Ready to Build a Masterpiece?
          </h2>
          {/* Subtext - CRISP WHITE */}
          <p className="text-white font-normal max-w-xl mx-auto mt-4 text-base md:text-lg">
            Request a private consultation with our directors to align on architectural needs, budget bounds, and scaling goals.
          </p>
        </div>

        <div className="bg-zinc-950 rounded-3xl p-8 md:p-12 border border-zinc-800 relative overflow-hidden">
          <AnimatePresence mode="wait">
            {status !== "success" ? (
              <form
                onSubmit={handleSubmit}
                className="flex flex-col gap-8 md:gap-10"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Name Input */}
                  <div className="flex flex-col gap-2 relative group">
                    <input
                      type="text"
                      required
                      placeholder="Your Name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="bg-transparent border-b border-zinc-700 py-3 text-white focus:border-yellow-400 focus:outline-none transition-colors duration-300 placeholder:text-zinc-500 text-sm font-medium"
                    />
                  </div>

                  {/* Email Input */}
                  <div className="flex flex-col gap-2 relative group">
                    <input
                      type="email"
                      required
                      placeholder="Corporate Email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="bg-transparent border-b border-zinc-700 py-3 text-white focus:border-yellow-400 focus:outline-none transition-colors duration-300 placeholder:text-zinc-500 text-sm font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Service Dropdown */}
                  <div className="flex flex-col gap-2 relative group">
                    <select
                      required
                      value={formData.service}
                      onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                      className="bg-transparent border-b border-zinc-700 py-3 text-white focus:border-yellow-400 focus:outline-none transition-colors duration-300 text-sm appearance-none cursor-pointer font-medium"
                    >
                      <option value="" disabled className="text-zinc-400 bg-black">Select Service Area</option>
                      {services.map((service, idx) => (
                        <option key={idx} value={service} className="text-white bg-black py-2">
                          {service}
                        </option>
                      ))}
                    </select>
                    <span className="absolute right-2 top-4 pointer-events-none text-yellow-400 text-xs">▼</span>
                  </div>

                  {/* Budget Dropdown */}
                  <div className="flex flex-col gap-2 relative group">
                    <select
                      value={formData.budget}
                      onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                      className="bg-transparent border-b border-zinc-700 py-3 text-white focus:border-yellow-400 focus:outline-none transition-colors duration-300 text-sm appearance-none cursor-pointer font-medium"
                    >
                      <option value="" disabled className="text-zinc-400 bg-black">Project Budget Scope</option>
                      {budgets.map((budget, idx) => (
                        <option key={idx} value={budget} className="text-white bg-black py-2">
                          {budget}
                        </option>
                      ))}
                    </select>
                    <span className="absolute right-2 top-4 pointer-events-none text-yellow-400 text-xs">▼</span>
                  </div>
                </div>

                {/* Message input */}
                <div className="flex flex-col gap-2 relative group">
                  <textarea
                    rows={4}
                    placeholder="Tell us about the project parameters, timelines, and goals..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="bg-transparent border-b border-zinc-700 py-3 text-white focus:border-yellow-400 focus:outline-none transition-colors duration-300 placeholder:text-zinc-500 text-sm resize-none font-medium"
                  />
                </div>

                {/* Submit button */}
                <div className="mt-4 flex justify-center">
                  <MagneticButton
                    className="px-10 py-4 rounded-full bg-yellow-400 text-black font-bold text-sm tracking-wider uppercase hover:bg-yellow-300 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                    onClick={() => {}}
                  >
                    {status === "loading" ? (
                      <>
                        Processing Submission
                        <Loader2 className="w-4 h-4 animate-spin text-black stroke-[2.5]" />
                      </>
                    ) : (
                      <>
                        Submit Brief
                        <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                      </>
                    )}
                  </MagneticButton>
                </div>
              </form>
            ) : (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="flex flex-col items-center justify-center text-center py-12 px-6"
              >
                <div className="w-16 h-16 rounded-full bg-yellow-400/20 border border-yellow-400 flex items-center justify-center mb-6">
                  <Check className="w-8 h-8 text-yellow-400 stroke-[3]" />
                </div>
                {/* H3 Heading - MUST BE VIBRANT YELLOW */}
                <h3 className="text-2xl md:text-3xl font-extrabold tracking-tight text-yellow-400 mb-3 uppercase">
                  Brief Successfully Transmitted
                </h3>
                <p className="text-white font-normal max-w-sm text-base leading-relaxed">
                  Encryption lock established. One of our lead digital directors will verify your parameters and establish contact within 24 hours.
                </p>
                <button
                  onClick={() => setStatus("idle")}
                  className="mt-8 text-xs font-bold uppercase tracking-wider text-yellow-400 border-b border-yellow-400/50 hover:border-yellow-400 transition-colors duration-200 pb-1"
                >
                  Submit Another Inquiry
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
