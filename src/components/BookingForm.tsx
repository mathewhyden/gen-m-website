"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Loader2, CheckCircle2 } from "lucide-react";

export default function BookingForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    service: "Web Development",
    message: "",
  });

  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim()) {
      setErrorMsg("Please enter both your Name and Email so our studio team can reply to you.");
      setStatus("error");
      return;
    }

    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          service: formData.service || "Web Development",
          message: formData.message.trim() || "Inquiry from website home page form.",
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Submission failed");

      setStatus("success");
      setFormData({ name: "", email: "", phone: "", service: "Web Development", message: "" });
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to submit. Please try again.");
      setStatus("error");
    }
  };

  const services = [
    "Web Development",
    "Brand Identity",
    "Graphic Design",
    "AI Agents & Automation",
    "Digital Marketing",
    "App Development",
  ];

  return (
    <section id="booking" className="relative py-16 md:py-24 bg-black z-10 px-6 border-t border-zinc-900/60">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-yellow-400">
            Get In Touch
          </span>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight text-yellow-400 mt-3 leading-tight uppercase">
            Ready to Build With Us?
          </h2>
          <p className="text-zinc-300 font-normal max-w-xl mx-auto mt-4 text-base md:text-lg">
            Send us a message with your requirements and our team will get back to you with a tailored plan.
          </p>
        </div>

        <div className="bg-zinc-950 rounded-3xl p-8 md:p-12 border border-zinc-800 relative overflow-hidden">
          <AnimatePresence mode="wait">
            {status !== "success" ? (
              <form
                onSubmit={handleSubmit}
                className="flex flex-col gap-8 md:gap-10"
              >
                {status === "error" && (
                  <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-mono">
                    {errorMsg}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Name Input */}
                  <div className="flex flex-col gap-2 relative group">
                    <input
                      type="text"
                      required
                      placeholder="Your Full Name *"
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
                      placeholder="Email Address *"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="bg-transparent border-b border-zinc-700 py-3 text-white focus:border-yellow-400 focus:outline-none transition-colors duration-300 placeholder:text-zinc-500 text-sm font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Phone Input */}
                  <div className="flex flex-col gap-2 relative group">
                    <input
                      type="text"
                      placeholder="Phone / WhatsApp Number"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="bg-transparent border-b border-zinc-700 py-3 text-white focus:border-yellow-400 focus:outline-none transition-colors duration-300 placeholder:text-zinc-500 text-sm font-medium"
                    />
                  </div>

                  {/* Service Dropdown */}
                  <div className="flex flex-col gap-2 relative group">
                    <select
                      required
                      value={formData.service}
                      onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                      className="bg-transparent border-b border-zinc-700 py-3 text-white focus:border-yellow-400 focus:outline-none transition-colors duration-300 text-sm appearance-none cursor-pointer font-medium"
                    >
                      {services.map((service, idx) => (
                        <option key={idx} value={service} className="text-white bg-black py-2">
                          {service}
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
                    placeholder="Tell us about your project or what you want to build..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="bg-transparent border-b border-zinc-700 py-3 text-white focus:border-yellow-400 focus:outline-none transition-colors duration-300 placeholder:text-zinc-500 text-sm resize-none font-medium"
                  />
                </div>

                {/* Submit button */}
                <div className="mt-4 flex justify-center">
                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className="px-10 py-4 rounded-full bg-yellow-400 text-black font-bold text-sm tracking-wider uppercase hover:bg-yellow-300 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                  >
                    {status === "loading" ? (
                      <>
                        Submitting...
                        <Loader2 className="w-4 h-4 animate-spin text-black stroke-[2.5]" />
                      </>
                    ) : (
                      <>
                        Send Message
                        <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center text-center py-12 gap-4"
              >
                <div className="w-16 h-16 rounded-full bg-yellow-400 text-black flex items-center justify-center mb-2">
                  <CheckCircle2 className="w-8 h-8 stroke-[2.5]" />
                </div>
                <h3 className="text-2xl font-bold text-white">Message Received!</h3>
                <p className="text-zinc-400 text-sm max-w-md">
                  Thank you for reaching out to Gen-M. Our team will review your message and reply within 24 hours.
                </p>
                <button
                  type="button"
                  onClick={() => setStatus("idle")}
                  className="mt-4 px-6 py-2 rounded-full border border-zinc-800 text-xs font-mono text-yellow-400 hover:bg-zinc-900 transition-colors cursor-pointer"
                >
                  Send Another Message
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
