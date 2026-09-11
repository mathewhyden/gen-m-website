"use client";

import React, { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { 
  Calendar, 
  CheckCircle2, 
  ArrowRight
} from "lucide-react";

export default function BookConsultationPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    service: "Web Development",
    date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    time: "14:00",
    meetingType: "google_meet" as "google_meet" | "zoom" | "phone",
    budget: "₹35,000 - ₹75,000",
    notes: "",
  });

  const [loading, setLoading] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState<any | null>(null);
  const [error, setError] = useState("");

  const timeSlots = [
    "10:00", "11:30", "14:00", "15:30", "17:00", "18:30"
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to book call");

      setConfirmedBooking(data.booking);
    } catch (err: any) {
      setError(err.message || "Failed to book call. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-black min-h-screen text-white font-sans relative flex flex-col w-full overflow-x-hidden">
      <Navbar />

      <main className="flex-grow w-full relative z-10 pt-32 pb-24 px-6 md:px-12 max-w-4xl mx-auto flex flex-col gap-10">
        {/* Header */}
        <section className="flex flex-col items-center text-center pt-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-semibold uppercase tracking-wider text-yellow-400 mb-4">
            <Calendar className="w-3.5 h-3.5 text-yellow-400" />
            Book a Call
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-3">
            Schedule a Free <span className="text-yellow-400">Consultation</span>
          </h1>
          <p className="text-sm text-zinc-400 max-w-lg">
            Pick a time that works best for you to discuss your project, timeline, and questions with our team.
          </p>
        </section>

        {/* Booking Interface */}
        <div className="p-8 md:p-12 rounded-3xl bg-zinc-950 border border-zinc-800/80">
          {confirmedBooking ? (
            <div className="py-12 text-center flex flex-col items-center gap-6">
              <div className="w-16 h-16 rounded-full bg-yellow-400/10 border border-yellow-400/30 flex items-center justify-center text-yellow-400">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">Booking Confirmed!</h2>
                <p className="text-zinc-400 text-sm max-w-md mx-auto">
                  A calendar invite and meeting details have been sent to <span className="text-white font-semibold">{confirmedBooking.email}</span>.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-zinc-900/80 border border-zinc-800 text-left max-w-md w-full flex flex-col gap-3 text-xs">
                <div className="flex justify-between border-b border-zinc-800 pb-2">
                  <span className="text-zinc-400 font-medium">Date & Time:</span>
                  <span className="text-yellow-400 font-bold">{confirmedBooking.date} at {confirmedBooking.time}</span>
                </div>
                <div className="flex justify-between border-b border-zinc-800 pb-2">
                  <span className="text-zinc-400 font-medium">Platform:</span>
                  <span className="text-white capitalize">{confirmedBooking.meetingType?.replace('_', ' ')}</span>
                </div>
                <div className="flex justify-between border-b border-zinc-800 pb-2">
                  <span className="text-zinc-400 font-medium">Service of Interest:</span>
                  <span className="text-white">{confirmedBooking.service}</span>
                </div>
                <div className="flex justify-between pt-1">
                  <span className="text-zinc-400 font-medium">Meeting Link:</span>
                  <a href={confirmedBooking.meetingLink} target="_blank" rel="noopener noreferrer" className="text-yellow-400 hover:underline">
                    Open Meeting Link ↗
                  </a>
                </div>
              </div>

              <Link
                href="/"
                className="px-6 py-2.5 rounded-full bg-yellow-400 text-black font-bold text-xs uppercase tracking-wider hover:bg-yellow-300 transition-colors"
              >
                Return to Home
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left Column: Date & Slot Selection */}
              <div className="flex flex-col gap-6">
                <div>
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-yellow-400 block mb-1">Step 1</span>
                  <h3 className="text-xl font-bold text-white">Select Date & Time</h3>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs font-mono uppercase tracking-wider text-zinc-400">Preferred Date *</label>
                  <input
                    type="date"
                    required
                    min={new Date().toISOString().split('T')[0]}
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-yellow-400 transition-colors"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs font-mono uppercase tracking-wider text-zinc-400">Time Slot *</label>
                  <div className="grid grid-cols-3 gap-2">
                    {timeSlots.map((slot) => (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setFormData({ ...formData, time: slot })}
                        className={`py-2.5 px-3 rounded-lg border text-xs font-mono font-semibold transition-colors cursor-pointer ${
                          formData.time === slot
                            ? "bg-yellow-400 text-black border-yellow-400 shadow-sm"
                            : "bg-zinc-900 border-zinc-800 text-zinc-300 hover:border-zinc-700"
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs font-mono uppercase tracking-wider text-zinc-400">Meeting Platform</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'google_meet', name: 'Google Meet' },
                      { id: 'zoom', name: 'Zoom' },
                      { id: 'phone', name: 'Phone Call' }
                    ].map((m) => (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setFormData({ ...formData, meetingType: m.id as any })}
                        className={`py-2 px-3 rounded-lg border text-xs font-medium transition-colors cursor-pointer ${
                          formData.meetingType === m.id
                            ? "bg-zinc-800 border-yellow-400 text-yellow-400"
                            : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white"
                        }`}
                      >
                        {m.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column: Contact Details */}
              <div className="flex flex-col gap-6">
                <div>
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-yellow-400 block mb-1">Step 2</span>
                  <h3 className="text-xl font-bold text-white">Your Contact Details</h3>
                </div>

                {error && (
                  <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-mono">
                    {error}
                  </div>
                )}

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-mono uppercase tracking-wider text-zinc-400">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="Alex Morgan"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-yellow-400 transition-colors"
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
                    className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-yellow-400 transition-colors"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-mono uppercase tracking-wider text-zinc-400">Company / Brand</label>
                    <input
                      type="text"
                      placeholder="Your Company"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-yellow-400 transition-colors"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-mono uppercase tracking-wider text-zinc-400">Phone</label>
                    <input
                      type="text"
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-yellow-400 transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-mono uppercase tracking-wider text-zinc-400">Service of Interest</label>
                    <select
                      value={formData.service}
                      onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                      className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-yellow-400 transition-colors"
                    >
                      <option value="Web Development">Web Development</option>
                      <option value="Brand Identity">Brand Identity</option>
                      <option value="AI Agents & Automation">AI Agents & Automation</option>
                      <option value="Graphic Design">Graphic Design</option>
                      <option value="Digital Marketing">Digital Marketing</option>
                      <option value="App Development">App Development</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-mono uppercase tracking-wider text-zinc-400">Estimated Budget</label>
                    <select
                      value={formData.budget}
                      onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                      className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-yellow-400 transition-colors"
                    >
                      <option value="Under ₹25,000">Under ₹25,000</option>
                      <option value="₹25,000 - ₹50,000">₹25,000 - ₹50,000</option>
                      <option value="₹50,000 - ₹1,00,000">₹50,000 - ₹1,00,000</option>
                      <option value="₹1,00,000 - ₹2,50,000">₹1,00,000 - ₹2,50,000</option>
                      <option value="₹2,50,000+ (Enterprise)">₹2,50,000+ (Enterprise)</option>
                    </select>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-mono uppercase tracking-wider text-zinc-400">Project Goals / Message</label>
                  <textarea
                    rows={3}
                    placeholder="Briefly describe what you'd like to build or discuss..."
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-yellow-400 transition-colors placeholder:text-zinc-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-2 py-3.5 rounded-full bg-yellow-400 text-black font-bold text-xs uppercase tracking-wider hover:bg-yellow-300 transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {loading ? "Booking..." : "Confirm Consultation Call"}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
