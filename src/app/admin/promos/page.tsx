"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  Megaphone,
  Sparkles,
  Upload,
  CheckCircle2,
  Eye,
  EyeOff,
  Video,
  Image as ImageIcon,
  Loader2,
  Save,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
} from "lucide-react";
import { PromoSettings } from "@/lib/types";

export default function AdminPromosPage() {
  const [promo, setPromo] = useState<PromoSettings>({
    enabled: false,
    title: "Special 50% OFF on Web Development Package!",
    subtitle: "Commission your bespoke enterprise digital platform with Gen-M Tech. Limited onboarding slots available for this quarter.",
    mediaType: "none",
    mediaUrl: "",
    ctaText: "Claim 50% Discount Now",
    ctaLink: "#contact",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingMedia, setUploadingMedia] = useState(false);
  const [notification, setNotification] = useState("");

  const fetchPromo = async () => {
    try {
      const res = await fetch("/api/promos");
      const data = await res.json();
      if (data.promo) {
        setPromo(data.promo);
      }
    } catch (err) {
      console.error("Failed to load promo settings", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPromo();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingMedia(true);
    try {
      const body = new FormData();
      body.append("file", file);
      body.append("folder", "promos");

      const res = await fetch("/api/upload", {
        method: "POST",
        body,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");

      setPromo((prev) => ({
        ...prev,
        mediaType: "image",
        mediaUrl: data.url,
      }));
      setNotification("Offer image uploaded to storage successfully!");
    } catch (err: any) {
      alert(err.message || "Failed to upload image");
    } finally {
      setUploadingMedia(false);
    }
  };

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/promos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(promo),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save promo settings");

      setPromo(data.promo);
      setNotification("Promo settings saved and synced with Firestore settings/promo!");
    } catch (err: any) {
      alert(err.message || "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const handleQuickToggle = async () => {
    const newEnabled = !promo.enabled;
    const updated = { ...promo, enabled: newEnabled };
    setPromo(updated);
    setSaving(true);
    try {
      const res = await fetch("/api/promos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      });
      const data = await res.json();
      if (res.ok && data.promo) {
        setPromo(data.promo);
        setNotification(
          newEnabled
            ? "Promo Banner is now LIVE on website!"
            : "Promo Banner has been DISABLED on live website."
        );
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800/80 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-yellow-400 mb-1">
            <Megaphone className="w-4 h-4" />
            <span>Marketing &amp; Campaign Infrastructure</span>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-white uppercase">
            Announcements &amp; Offers Manager
          </h1>
          <p className="text-sm text-zinc-400 mt-1 max-w-2xl">
            Configure dynamic promotional banners, seasonal discounts, and modal announcements across the live website. Persisted permanently in Firestore `settings/promo`.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setLoading(true);
            fetchPromo();
          }}
          className="px-3.5 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-yellow-400" : ""}`} />
          Refresh Status
        </button>
      </div>

      {/* Notification */}
      {notification && (
        <div className="p-4 rounded-xl bg-yellow-400/10 border border-yellow-400/30 flex items-center justify-between text-yellow-300 text-xs font-mono">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-yellow-400" />
            <span>{notification}</span>
          </div>
          <button
            type="button"
            onClick={() => setNotification("")}
            className="text-zinc-500 hover:text-white"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Master Toggle Bar */}
      <div className={`p-6 rounded-3xl border transition-all duration-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 ${
        promo.enabled
          ? "bg-yellow-400/5 border-yellow-400/40 shadow-xl shadow-yellow-400/5"
          : "bg-zinc-950 border-zinc-850"
      }`}>
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border transition-colors ${
            promo.enabled
              ? "bg-yellow-400 text-black border-yellow-400 shadow-lg shadow-yellow-400/20"
              : "bg-zinc-900 text-zinc-500 border-zinc-800"
          }`}>
            <Megaphone className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono uppercase tracking-widest text-zinc-400">
                Master Banner Switch
              </span>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full uppercase tracking-wider font-bold ${
                promo.enabled
                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                  : "bg-zinc-900 text-zinc-500 border border-zinc-800"
              }`}>
                {promo.enabled ? "Live on Website" : "Disabled / Hidden"}
              </span>
            </div>
            <h3 className="text-xl font-black text-white uppercase mt-0.5">
              {promo.enabled ? "Promo Campaign Active" : "Promo Campaign Inactive"}
            </h3>
            <p className="text-xs text-zinc-400 mt-0.5">
              {promo.enabled
                ? "The luxury promo announcement is currently visible to all visitors on the live website."
                : "The promo banner is completely hidden from the live website with zero layout shift."}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleQuickToggle}
          disabled={saving}
          className={`px-6 py-3 rounded-2xl font-bold text-xs uppercase tracking-wider flex items-center gap-2.5 transition-all cursor-pointer ${
            promo.enabled
              ? "bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30"
              : "bg-yellow-400 hover:bg-yellow-300 text-black shadow-lg shadow-yellow-400/20"
          }`}
        >
          {saving ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : promo.enabled ? (
            <>
              <EyeOff className="w-4 h-4" /> Deactivate Banner
            </>
          ) : (
            <>
              <Eye className="w-4 h-4" /> Activate Banner
            </>
          )}
        </button>
      </div>

      {/* Main Grid: Settings Form & Live Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Form Controls (7 cols) */}
        <div className="lg:col-span-7 bg-zinc-950 border border-zinc-800/80 rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="border-b border-zinc-850 pb-4">
            <span className="text-[10px] font-mono uppercase tracking-widest text-yellow-400">
              Content Architecture
            </span>
            <h2 className="text-xl font-black text-white uppercase tracking-tight">
              Promo Content Configuration
            </h2>
          </div>

          <form onSubmit={handleSave} className="space-y-5">
            {/* Offer Title */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-mono uppercase text-zinc-400 flex items-center justify-between">
                <span>Offer Title / Headline</span>
                <span className="text-[10px] text-zinc-500 font-normal">Commands attention</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Special 50% OFF on Web Development Package!"
                value={promo.title}
                onChange={(e) => setPromo({ ...promo, title: e.target.value })}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-white font-bold focus:outline-none focus:border-yellow-400"
              />
            </div>

            {/* Subtitle / Description */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-mono uppercase text-zinc-400">
                Subtitle / Description Text
              </label>
              <textarea
                rows={3}
                placeholder="Provide details about the promotional campaign, validity, or package scope..."
                value={promo.subtitle}
                onChange={(e) => setPromo({ ...promo, subtitle: e.target.value })}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-xs text-zinc-200 focus:outline-none focus:border-yellow-400 resize-none leading-relaxed"
              />
            </div>

            {/* Media Asset: Radio selection */}
            <div className="space-y-3 pt-1">
              <label className="text-[11px] font-mono uppercase text-zinc-400 block">
                Media Asset Attachment
              </label>

              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setPromo({ ...promo, mediaType: "none" })}
                  className={`p-2.5 rounded-xl border text-xs font-mono flex items-center justify-center gap-1.5 cursor-pointer transition-colors ${
                    promo.mediaType === "none"
                      ? "bg-yellow-400 text-black font-bold border-yellow-400"
                      : "bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-white"
                  }`}
                >
                  No Media
                </button>
                <button
                  type="button"
                  onClick={() => setPromo({ ...promo, mediaType: "image" })}
                  className={`p-2.5 rounded-xl border text-xs font-mono flex items-center justify-center gap-1.5 cursor-pointer transition-colors ${
                    promo.mediaType === "image"
                      ? "bg-yellow-400 text-black font-bold border-yellow-400"
                      : "bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-white"
                  }`}
                >
                  <ImageIcon className="w-3.5 h-3.5" /> Offer Image
                </button>
                <button
                  type="button"
                  onClick={() => setPromo({ ...promo, mediaType: "video" })}
                  className={`p-2.5 rounded-xl border text-xs font-mono flex items-center justify-center gap-1.5 cursor-pointer transition-colors ${
                    promo.mediaType === "video"
                      ? "bg-yellow-400 text-black font-bold border-yellow-400"
                      : "bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-white"
                  }`}
                >
                  <Video className="w-3.5 h-3.5" /> Video Embed
                </button>
              </div>

              {/* Conditional Image Input */}
              {promo.mediaType === "image" && (
                <div className="p-4 rounded-2xl bg-zinc-900/50 border border-zinc-800 space-y-3">
                  <div className="flex items-center gap-3">
                    <label className="px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-[11px] font-mono flex items-center gap-1.5 cursor-pointer border border-zinc-700 transition-colors">
                      <Upload className="w-3 h-3 text-yellow-400" />
                      {uploadingMedia ? "Uploading..." : "Upload Image to Storage"}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        disabled={uploadingMedia}
                        className="hidden"
                      />
                    </label>
                    {uploadingMedia && <Loader2 className="w-3.5 h-3.5 animate-spin text-yellow-400" />}
                  </div>

                  <input
                    type="text"
                    placeholder="Or enter direct Image URL (e.g. /promos/offer.jpg)"
                    value={promo.mediaUrl}
                    onChange={(e) => setPromo({ ...promo, mediaUrl: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-300 font-mono focus:outline-none focus:border-yellow-400"
                  />
                </div>
              )}

              {/* Conditional Video Input */}
              {promo.mediaType === "video" && (
                <div className="p-4 rounded-2xl bg-zinc-900/50 border border-zinc-800 space-y-2">
                  <label className="text-[10px] font-mono uppercase text-zinc-400">
                    Video Embed URL (YouTube embed, Vimeo, or direct MP4)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. https://www.youtube.com/embed/dQw4w9WgXcQ"
                    value={promo.mediaUrl}
                    onChange={(e) => setPromo({ ...promo, mediaUrl: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-300 font-mono focus:outline-none focus:border-yellow-400"
                  />
                </div>
              )}
            </div>

            {/* CTA Configuration */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="space-y-1.5">
                <label className="text-[11px] font-mono uppercase text-zinc-400">
                  CTA Button Label
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Claim 50% Discount Now"
                  value={promo.ctaText}
                  onChange={(e) => setPromo({ ...promo, ctaText: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-white font-bold focus:outline-none focus:border-yellow-400"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-mono uppercase text-zinc-400">
                  Target Action Link
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. #contact or #book"
                  value={promo.ctaLink}
                  onChange={(e) => setPromo({ ...promo, ctaLink: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-yellow-400"
                />
              </div>
            </div>

            {/* Submit Bar */}
            <div className="pt-4 border-t border-zinc-850 flex items-center justify-between">
              <span className="text-[10px] font-mono text-zinc-500 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                Saves to Firestore `settings/promo`
              </span>

              <button
                type="submit"
                disabled={saving || uploadingMedia}
                className="px-6 py-2.5 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-black font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-yellow-400/20 cursor-pointer disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" /> Saving Settings...
                  </>
                ) : (
                  <>
                    <Save className="w-3.5 h-3.5" /> Save Promo Settings
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: Real-Time Live Preview (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-widest text-yellow-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Live Visitor Preview
            </span>
            <span className="text-[10px] font-mono text-zinc-500">
              Interactive Rendering
            </span>
          </div>

          {/* Preview Card */}
          <div className="relative rounded-3xl bg-zinc-950 border border-zinc-800 p-6 overflow-hidden shadow-2xl space-y-5">
            {/* Ambient gold glow */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-yellow-400/10 blur-3xl pointer-events-none rounded-full" />

            {/* Top pill */}
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full bg-yellow-400/10 border border-yellow-400/30 text-yellow-400 text-[10px] font-mono uppercase font-bold tracking-wider">
                Limited Time Announcement
              </span>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                promo.enabled ? "text-emerald-400 bg-emerald-400/10" : "text-zinc-600 bg-zinc-900"
              }`}>
                {promo.enabled ? "ACTIVE" : "PREVIEW ONLY"}
              </span>
            </div>

            {/* Media Asset Preview if any */}
            {promo.mediaType === "image" && promo.mediaUrl && (
              <div className="relative w-full h-44 rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-900">
                <Image
                  src={promo.mediaUrl}
                  alt="Promo Visual"
                  fill
                  className="object-cover"
                />
              </div>
            )}

            {promo.mediaType === "video" && promo.mediaUrl && (
              <div className="relative w-full h-44 rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-900">
                <iframe
                  src={promo.mediaUrl}
                  title="Promo Video"
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            )}

            {/* Title & Subtitle */}
            <div className="space-y-2">
              <h3 className="text-xl font-black text-white uppercase tracking-tight leading-tight">
                {promo.title || "Special 50% OFF on Web Development Package!"}
              </h3>
              <p className="text-xs text-zinc-300 leading-relaxed font-normal">
                {promo.subtitle || "Commission your bespoke enterprise digital platform with Gen-M Tech."}
              </p>
            </div>

            {/* CTA button */}
            <div className="pt-2">
              <a
                href={promo.ctaLink || "#contact"}
                onClick={(e) => e.preventDefault()}
                className="w-full py-3 px-5 rounded-2xl bg-yellow-400 text-black font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-yellow-400/20 hover:bg-yellow-300 transition-colors cursor-pointer"
              >
                <span>{promo.ctaText || "Claim 50% Discount Now"}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>

            <div className="text-center pt-2">
              <span className="text-[10px] font-mono text-zinc-500">
                Action link points to: <span className="text-zinc-300">{promo.ctaLink || "#contact"}</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
