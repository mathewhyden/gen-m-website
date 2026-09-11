"use client";

import React, { useEffect, useState } from "react";
import { 
  Calendar, 
  Search, 
  Video, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  ExternalLink,
  Mail,
  Phone,
  Building,
  MessageCircle,
  DollarSign,
  UserCheck,
  RefreshCw
} from "lucide-react";
import { Booking } from "@/lib/types";

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const fetchBookings = () => {
    setLoading(true);
    fetch("/api/bookings")
      .then(res => res.json())
      .then(data => {
        if (data.bookings) setBookings(data.bookings);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleStatusChange = async (id: string, status: string) => {
    try {
      const res = await fetch("/api/bookings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      if (res.ok) fetchBookings();
    } catch (err) {
      console.error(err);
    }
  };

  const filtered = bookings.filter(b => {
    const matchesSearch = 
      b.name.toLowerCase().includes(search.toLowerCase()) ||
      b.email.toLowerCase().includes(search.toLowerCase()) ||
      (b.company && b.company.toLowerCase().includes(search.toLowerCase())) ||
      b.service.toLowerCase().includes(search.toLowerCase()) ||
      (b.notes && b.notes.toLowerCase().includes(search.toLowerCase()));

    const matchesStatus = 
      statusFilter === "ALL" || 
      b.status?.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  const getCleanPhone = (phone?: string) => {
    if (!phone) return "";
    const clean = phone.replace(/[^0-9]/g, "");
    if (clean.length === 10) return "91" + clean;
    return clean;
  };

  const countNew = bookings.filter(b => b.status?.toLowerCase() === "new").length;
  const countConfirmed = bookings.filter(b => b.status?.toLowerCase() === "confirmed").length;
  const countCompleted = bookings.filter(b => b.status?.toLowerCase() === "completed").length;

  return (
    <div className="flex flex-col gap-8 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-yellow-400 block mb-1">
            Permanent Firestore Storage
          </span>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Bookings & Client Inquiries</h1>
        </div>
        <button
          onClick={fetchBookings}
          className="px-4 py-2 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-mono text-zinc-300 hover:text-white hover:border-yellow-400 transition-colors flex items-center gap-2 self-start sm:self-auto cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-yellow-400" : ""}`} />
          <span>Sync from Cloud</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800 flex flex-col gap-1">
          <span className="text-xs font-mono text-zinc-400 uppercase">Total Leads</span>
          <span className="text-2xl font-black text-white">{bookings.length}</span>
        </div>
        <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800 flex flex-col gap-1">
          <span className="text-xs font-mono text-amber-400 uppercase">New Inquiries</span>
          <span className="text-2xl font-black text-amber-400">{countNew}</span>
        </div>
        <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800 flex flex-col gap-1">
          <span className="text-xs font-mono text-emerald-400 uppercase">Confirmed</span>
          <span className="text-2xl font-black text-emerald-400">{countConfirmed}</span>
        </div>
        <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800 flex flex-col gap-1">
          <span className="text-xs font-mono text-blue-400 uppercase">Completed</span>
          <span className="text-2xl font-black text-blue-400">{countCompleted}</span>
        </div>
      </div>

      {/* Search & Status Filters */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center">
        <div className="relative max-w-md w-full">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search leads by name, email, service, budget..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-full py-2.5 pl-10 pr-4 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-yellow-400 transition-colors"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {["ALL", "new", "confirmed", "completed", "cancelled"].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-full text-xs font-mono uppercase font-bold transition-colors cursor-pointer whitespace-nowrap ${
                statusFilter === st
                  ? "bg-yellow-400 text-black shadow-sm"
                  : "bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white"
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Bookings & Leads List */}
      <div className="rounded-3xl bg-zinc-950 border border-zinc-800 overflow-hidden shadow-sm">
        {loading && bookings.length === 0 ? (
          <div className="p-16 text-center text-xs font-mono text-zinc-500 flex flex-col items-center gap-3">
            <RefreshCw className="w-6 h-6 animate-spin text-yellow-400" />
            <span>Retrieving persistent lead documents from Firestore...</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-16 text-center text-xs font-mono text-zinc-500">
            No booking submissions match the current filter.
          </div>
        ) : (
          <div className="divide-y divide-zinc-900">
            {filtered.map((b) => {
              const cleanPhone = getCleanPhone(b.phone);
              const waText = encodeURIComponent(`Hello ${b.name}, thank you for contacting Gen-M Tech regarding your ${b.service} project! We would love to discuss your requirements.`);
              const waUrl = `https://wa.me/${cleanPhone}?text=${waText}`;

              return (
                <div key={b.id} className="p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-6 hover:bg-zinc-900/40 transition-colors">
                  <div className="flex flex-col gap-2 max-w-3xl">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-base font-bold text-white">{b.name}</span>
                      {b.company && (
                        <span className="text-xs text-yellow-400 font-mono bg-yellow-400/10 px-2 py-0.5 rounded border border-yellow-400/20">
                          @{b.company}
                        </span>
                      )}
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase ${
                        b.status?.toLowerCase() === "confirmed"
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                          : b.status?.toLowerCase() === "completed"
                            ? "bg-blue-500/10 text-blue-400 border border-blue-500/30"
                            : b.status?.toLowerCase() === "cancelled"
                              ? "bg-red-500/10 text-red-400 border border-red-500/30"
                              : "bg-amber-500/10 text-amber-400 border border-amber-500/30"
                      }`}>
                        {b.status || "NEW"}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-zinc-400">
                      <a href={`mailto:${b.email}`} className="flex items-center gap-1.5 hover:text-yellow-400 transition-colors">
                        <Mail className="w-3.5 h-3.5 text-zinc-500" /> {b.email}
                      </a>
                      {b.phone && (
                        <a href={`tel:${b.phone}`} className="flex items-center gap-1.5 hover:text-yellow-400 transition-colors font-mono">
                          <Phone className="w-3.5 h-3.5 text-zinc-500" /> {b.phone}
                        </a>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs font-mono text-zinc-400 mt-1">
                      <span className="text-yellow-400 font-semibold flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" /> {b.date} @ {b.time}
                      </span>
                      <span className="bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800">
                        Service: <strong className="text-zinc-200">{b.service}</strong>
                      </span>
                      {b.budget && (
                        <span className="bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800 text-emerald-400">
                          Budget: {b.budget}
                        </span>
                      )}
                      {b.meetingType && (
                        <span className="capitalize text-zinc-400">
                          Format: {b.meetingType.replace('_', ' ')}
                        </span>
                      )}
                    </div>

                    {(b.notes || (b as any).message) && (
                      <p className="text-xs text-zinc-300 mt-1 italic font-sans bg-zinc-900/60 p-3 rounded-xl border border-zinc-800/80 leading-relaxed">
                        &ldquo;{b.notes || (b as any).message}&rdquo;
                      </p>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap lg:flex-nowrap items-center gap-2.5 flex-shrink-0 pt-2 lg:pt-0">
                    {/* WhatsApp Button */}
                    {cleanPhone ? (
                      <a
                        href={waUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3.5 py-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-semibold hover:bg-emerald-500 hover:text-black transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
                        title="Chat with Lead on WhatsApp"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>WhatsApp</span>
                      </a>
                    ) : null}

                    {/* Call Button */}
                    {b.phone ? (
                      <a
                        href={`tel:${b.phone}`}
                        className="px-3.5 py-2 rounded-xl bg-yellow-400/10 text-yellow-400 border border-yellow-400/30 text-xs font-semibold hover:bg-yellow-400 hover:text-black transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
                        title="Call Lead"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>Call</span>
                      </a>
                    ) : null}

                    {/* Join Meeting Link */}
                    {b.meetingLink && (
                      <a
                        href={b.meetingLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs font-mono text-zinc-300 hover:border-yellow-400 hover:text-yellow-400 transition-colors flex items-center gap-1.5"
                        title="Open Video Call"
                      >
                        <Video className="w-3.5 h-3.5" />
                      </a>
                    )}

                    {/* Status Changer */}
                    <select
                      value={b.status?.toLowerCase()}
                      onChange={(e) => handleStatusChange(b.id, e.target.value)}
                      className="bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-200 font-mono focus:outline-none focus:border-yellow-400 cursor-pointer"
                    >
                      <option value="new">NEW</option>
                      <option value="confirmed">CONFIRMED</option>
                      <option value="completed">COMPLETED</option>
                      <option value="cancelled">CANCELLED</option>
                    </select>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
