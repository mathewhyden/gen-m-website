"use client";

import React, { useEffect, useState } from "react";
import { 
  FileEdit, 
  Save, 
  CheckCircle2, 
  Plus, 
  Trash2, 
  Layers, 
  Sparkles,
  X
} from "lucide-react";
import { ServiceItem } from "@/lib/types";

export default function AdminCMSPage() {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState("");

  useEffect(() => {
    fetch("/api/content")
      .then(res => res.json())
      .then(data => {
        if (data.services) setServices(data.services);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleSaveCMS = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ services }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save CMS content");

      setNotification("CMS services and deliverables synchronized successfully!");
    } catch (err: any) {
      alert(err.message || "Failed to update content");
    } finally {
      setSaving(false);
    }
  };

  const handleServiceChange = (index: number, field: keyof ServiceItem, value: any) => {
    const copy = [...services];
    copy[index] = { ...copy[index], [field]: value };
    setServices(copy);
  };

  const handleAddFeature = (serviceIndex: number) => {
    const copy = [...services];
    copy[serviceIndex].features.push("New deliverable");
    setServices(copy);
  };

  const handleRemoveFeature = (serviceIndex: number, featIndex: number) => {
    const copy = [...services];
    copy[serviceIndex].features.splice(featIndex, 1);
    setServices(copy);
  };

  return (
    <div className="flex flex-col gap-8 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-yellow-400 block mb-1">
            Services & Deliverables CMS
          </span>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Services & Copy Editor</h1>
        </div>
        <button
          onClick={handleSaveCMS}
          disabled={saving}
          className="px-6 py-2.5 rounded-full bg-yellow-400 text-black font-bold text-xs uppercase tracking-wider hover:bg-yellow-300 transition-colors flex items-center gap-2 cursor-pointer shadow-sm self-start sm:self-auto disabled:opacity-50"
        >
          <Save className="w-4 h-4 stroke-[2.5]" />
          {saving ? "Publishing Updates..." : "Save & Publish"}
        </button>
      </div>

      {notification && (
        <div className="p-4 rounded-xl bg-yellow-400/10 border border-yellow-400/30 text-yellow-300 text-xs font-mono flex items-center justify-between">
          <span>{notification}</span>
          <button onClick={() => setNotification("")} className="text-yellow-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Services Editor */}
      <section className="flex flex-col gap-6">
        <div className="flex items-center gap-2">
          <Layers className="w-5 h-5 text-yellow-400" />
          <h2 className="text-xl font-bold text-white">Services & Offerings ({services.length})</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {services.map((srv, sIdx) => (
            <div key={srv.id || sIdx} className="p-6 rounded-2xl bg-zinc-950 border border-zinc-800 flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-mono uppercase text-zinc-500">Title</label>
                  <input
                    type="text"
                    value={srv.title}
                    onChange={(e) => handleServiceChange(sIdx, "title", e.target.value)}
                    className="bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-white font-bold focus:outline-none focus:border-yellow-400"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-mono uppercase text-zinc-500">Badge / Tag</label>
                  <input
                    type="text"
                    value={srv.badge || ""}
                    onChange={(e) => handleServiceChange(sIdx, "badge", e.target.value)}
                    className="bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-yellow-400"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-mono uppercase text-zinc-500">Estimate / Pricing (Rupees)</label>
                <input
                  type="text"
                  placeholder="e.g. From ₹25,000"
                  value={srv.priceRange || ""}
                  onChange={(e) => handleServiceChange(sIdx, "priceRange", e.target.value)}
                  className="bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-yellow-400"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-mono uppercase text-zinc-500">Description</label>
                <textarea
                  rows={2}
                  value={srv.description}
                  onChange={(e) => handleServiceChange(sIdx, "description", e.target.value)}
                  className="bg-zinc-900 border border-zinc-800 rounded-lg p-2.5 text-xs text-zinc-300 focus:outline-none focus:border-yellow-400 resize-none"
                />
              </div>

              {/* Deliverables */}
              <div className="flex flex-col gap-2 pt-2 border-t border-zinc-900">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase text-zinc-500">Deliverables</span>
                  <button
                    type="button"
                    onClick={() => handleAddFeature(sIdx)}
                    className="text-[11px] font-mono text-yellow-400 hover:underline flex items-center gap-0.5"
                  >
                    + Add
                  </button>
                </div>
                {srv.features.map((feat, fIdx) => (
                  <div key={fIdx} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={feat}
                      onChange={(e) => {
                        const copy = [...services];
                        copy[sIdx].features[fIdx] = e.target.value;
                        setServices(copy);
                      }}
                      className="bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-1 text-xs text-zinc-300 flex-grow focus:outline-none focus:border-yellow-400"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveFeature(sIdx, fIdx)}
                      className="text-zinc-600 hover:text-red-400 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
