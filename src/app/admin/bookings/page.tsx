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
  Building
} from "lucide-react";
import { Booking } from "@/lib/types";

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchBookings = () => {
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

  const filtered = bookings.filter(b => 
    b.name.toLowerCase().includes(search.toLowerCase()) ||
    b.email.toLowerCase().includes(search.toLowerCase()) ||
    b.service.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-8">
      <div>
        <span className="text-xs font-mono font-bold uppercase tracking-wider text-yellow-400 block mb-1">
          Calendar & Alignment
        </span>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Discovery Consultations</h1>
      </div>

      {/* Search Filter */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Filter bookings by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-zinc-950 border border-zinc-800 rounded-full py-2 pl-10 pr-4 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-yellow-400"
        />
      </div>

      {/* Bookings List */}
      <div className="rounded-3xl bg-zinc-950 border border-zinc-800 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs font-mono text-zinc-500">Loading consultation schedule...</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-xs font-mono text-zinc-500">No bookings logged.</div>
        ) : (
          <div className="divide-y divide-zinc-900">
            {filtered.map((b) => (
              <div key={b.id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-zinc-900/40 transition-colors">
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-base font-bold text-white">{b.name}</span>
                    {b.company && <span className="text-xs text-zinc-400 font-mono">({b.company})</span>}
                    <span className={`px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                      b.status?.toLowerCase() === "confirmed"
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                        : b.status?.toLowerCase() === "completed"
                          ? "bg-blue-500/10 text-blue-400 border border-blue-500/30"
                          : b.status?.toLowerCase() === "cancelled"
                            ? "bg-red-500/10 text-red-400 border border-red-500/30"
                            : "bg-amber-500/10 text-amber-400 border border-amber-500/30"
                    }`}>
                      {b.status}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-400">
                    <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5 text-zinc-500" /> {b.email}</span>
                    {b.phone && (
                      <a href={`tel:${b.phone}`} className="flex items-center gap-1 text-yellow-400 hover:underline">
                        <Phone className="w-3.5 h-3.5" /> {b.phone}
                      </a>
                    )}
                  </div>

                  <div className="flex items-center gap-4 text-xs font-mono text-zinc-500 mt-1">
                    <span className="text-yellow-400 font-bold">📅 {b.date} @ {b.time} UTC</span>
                    <span>Pillar: {b.service}</span>
                    <span className="capitalize">Type: {b.meetingType.replace('_', ' ')}</span>
                  </div>

                  {b.notes && (
                    <p className="text-xs text-zinc-400 mt-1 italic font-sans bg-zinc-900/60 p-2.5 rounded-lg border border-zinc-800/80">
                      &ldquo;{b.notes}&rdquo;
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <a
                    href={b.meetingLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-full bg-zinc-900 border border-zinc-700 text-xs font-mono text-zinc-200 hover:border-yellow-400 hover:text-yellow-400 transition-colors flex items-center gap-1.5"
                  >
                    <Video className="w-3.5 h-3.5" />
                    <span>Join Call</span>
                  </a>

                  <select
                    value={b.status?.toLowerCase()}
                    onChange={(e) => handleStatusChange(b.id, e.target.value)}
                    className="bg-zinc-900 border border-zinc-800 rounded-lg px-2.5 py-2 text-xs text-zinc-300 font-mono focus:outline-none focus:border-yellow-400"
                  >
                    <option value="new">NEW</option>
                    <option value="confirmed">CONFIRMED</option>
                    <option value="completed">COMPLETED</option>
                    <option value="cancelled">CANCELLED</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
