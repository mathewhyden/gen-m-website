"use client";

import React, { useEffect, useState } from "react";
import { 
  Inbox, 
  Search, 
  Mail, 
  Phone, 
  Building2, 
  ArrowUpRight, 
  CheckCircle2, 
  Archive,
  Clock
} from "lucide-react";
import { Enquiry } from "@/lib/types";

export default function AdminEnquiriesPage() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchEnquiries = () => {
    fetch("/api/admin/enquiries")
      .then(res => res.json())
      .then(data => {
        if (data.enquiries) setEnquiries(data.enquiries);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const handleStatusChange = async (id: string, status: string) => {
    try {
      const res = await fetch("/api/admin/enquiries", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      if (res.ok) fetchEnquiries();
    } catch (err) {
      console.error(err);
    }
  };

  const filtered = enquiries.filter(e =>
    e.name.toLowerCase().includes(search.toLowerCase()) ||
    e.email.toLowerCase().includes(search.toLowerCase()) ||
    e.company?.toLowerCase().includes(search.toLowerCase()) ||
    e.service.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-8">
      <div>
        <span className="text-xs font-mono font-bold uppercase tracking-wider text-yellow-400 block mb-1">
          Inbound Growth & Leads
        </span>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Project Briefs & Inquiries</h1>
      </div>

      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Filter briefs by name, brand, or service..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-zinc-950 border border-zinc-800 rounded-full py-2 pl-10 pr-4 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-yellow-400"
        />
      </div>

      <div className="rounded-3xl bg-zinc-950 border border-zinc-800 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs font-mono text-zinc-500">Loading briefs...</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-xs font-mono text-zinc-500">No project briefs logged.</div>
        ) : (
          <div className="divide-y divide-zinc-900">
            {filtered.map((enq) => (
              <div key={enq.id} className="p-6 flex flex-col md:flex-row md:items-start justify-between gap-6 hover:bg-zinc-900/40 transition-colors">
                <div className="flex flex-col gap-2 max-w-2xl">
                  <div className="flex items-center gap-3">
                    <span className="text-base font-bold text-white">{enq.name}</span>
                    {enq.company && <span className="text-xs font-mono text-yellow-400">@{enq.company}</span>}
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-zinc-900 border border-zinc-800 text-zinc-300">
                      {enq.status}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-400">
                    <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5 text-zinc-500" /> {enq.email}</span>
                    {enq.phone && <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5 text-zinc-500" /> {enq.phone}</span>}
                    <span className="text-zinc-500 font-mono">Pillar: <strong className="text-zinc-300">{enq.service}</strong></span>
                    <span className="text-zinc-500 font-mono">Budget: <strong className="text-zinc-300">{enq.budget}</strong></span>
                    {enq.timeline && <span className="text-zinc-500 font-mono">Timeline: <strong className="text-zinc-300">{enq.timeline}</strong></span>}
                  </div>

                  <div className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800 text-xs text-zinc-300 leading-relaxed font-sans">
                    {enq.message}
                  </div>
                  <span className="text-[10px] font-mono text-zinc-600">Submitted on: {new Date(enq.createdAt).toLocaleString()}</span>
                </div>

                <div className="flex items-center gap-3">
                  <select
                    value={enq.status}
                    onChange={(e) => handleStatusChange(enq.id, e.target.value)}
                    className="bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-300 font-mono focus:outline-none focus:border-yellow-400"
                  >
                    <option value="NEW">NEW</option>
                    <option value="CONTACTED">CONTACTED</option>
                    <option value="CONVERTED">CONVERTED</option>
                    <option value="ARCHIVED">ARCHIVED</option>
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
