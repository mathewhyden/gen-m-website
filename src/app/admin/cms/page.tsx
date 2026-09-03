"use client";

import React, { useEffect, useState } from "react";
import { 
  FileEdit, 
  Save, 
  CheckCircle2, 
  Plus, 
  Trash2, 
  Layers, 
  Quote, 
  Sparkles,
  X
} from "lucide-react";
import { ServiceItem, Testimonial } from "@/lib/types";

export default function AdminCMSPage() {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState("");

  useEffect(() => {
    fetch("/api/content")
      .then(res => res.json())
      .then(data => {
        if (data.services) setServices(data.services);
        if (data.testimonials) setTestimonials(data.testimonials);
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
        body: JSON.stringify({ services, testimonials }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save CMS content");

      setNotification("CMS content synchronized and updated successfully!");
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

  const handleTestimonialChange = (index: number, field: keyof Testimonial, value: any) => {
    const copy = [...testimonials];
    copy[index] = { ...copy[index], [field]: value };
    setTestimonials(copy);
  };

  const handleAddTestimonial = () => {
    setTestimonials([
      ...testimonials,
      {
        id: `test-${Date.now()}`,
        name: "New Client",
        role: "Chief Executive Officer",
        company: "Brand Co",
        quote: "Gen-M delivered an extraordinary digital platform that surpassed all benchmarks.",
        rating: 5,
      }
    ]);
  };

  const handleRemoveTestimonial = (index: number) => {
    const copy = [...testimonials];
    copy.splice(index, 1);
    setTestimonials(copy);
  };

  return (
    <div className="flex flex-col gap-8 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-yellow-400 block mb-1">
            Studio Content Management System
          </span>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">CMS & Copy Editor</h1>
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
          <h2 className="text-xl font-bold text-white">Services & Pricing Architecture ({services.length})</h2>
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
                <label className="text-[10px] font-mono uppercase text-zinc-500">Price Guide</label>
                <input
                  type="text"
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

      {/* Testimonials Editor */}
      <section className="flex flex-col gap-6 pt-6 border-t border-zinc-900">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Quote className="w-5 h-5 text-yellow-400" />
            <h2 className="text-xl font-bold text-white">Client Testimonials ({testimonials.length})</h2>
          </div>
          <button
            type="button"
            onClick={handleAddTestimonial}
            className="px-4 py-1.5 rounded-full bg-zinc-900 border border-zinc-700 text-xs font-mono text-yellow-400 hover:border-yellow-400 transition-colors"
          >
            + Add Testimonial
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {testimonials.map((t, tIdx) => (
            <div key={t.id || tIdx} className="p-6 rounded-2xl bg-zinc-950 border border-zinc-800 flex flex-col gap-4">
              <div className="flex justify-between items-start">
                <div className="grid grid-cols-3 gap-2 flex-grow">
                  <input
                    type="text"
                    placeholder="Name"
                    value={t.name}
                    onChange={(e) => handleTestimonialChange(tIdx, "name", e.target.value)}
                    className="bg-zinc-900 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs text-white font-bold"
                  />
                  <input
                    type="text"
                    placeholder="Role"
                    value={t.role}
                    onChange={(e) => handleTestimonialChange(tIdx, "role", e.target.value)}
                    className="bg-zinc-900 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs text-zinc-300"
                  />
                  <input
                    type="text"
                    placeholder="Company"
                    value={t.company}
                    onChange={(e) => handleTestimonialChange(tIdx, "company", e.target.value)}
                    className="bg-zinc-900 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs text-zinc-300"
                  />
                </div>
                <button
                  onClick={() => handleRemoveTestimonial(tIdx)}
                  className="p-1.5 text-zinc-600 hover:text-red-400 ml-2"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <textarea
                rows={3}
                placeholder="Client quote..."
                value={t.quote}
                onChange={(e) => handleTestimonialChange(tIdx, "quote", e.target.value)}
                className="bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-xs text-zinc-300 focus:outline-none focus:border-yellow-400 resize-none"
              />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
