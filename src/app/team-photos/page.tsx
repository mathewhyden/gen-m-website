"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Upload, CheckCircle2, ArrowLeft, RefreshCw } from "lucide-react";

interface MemberUploadSlot {
  id: "mathew" | "sidhu" | "mathew-ai";
  name: string;
  role: string;
  defaultImage: string;
  instruction: string;
}

const slots: MemberUploadSlot[] = [
  {
    id: "mathew",
    name: "MATHEW",
    role: "FRONTEND DEVELOPER",
    defaultImage: "/team/mathew.jpg",
    instruction: "First image uploaded in chat (Suit, sunglasses, stone archway/church background)",
  },
  {
    id: "sidhu",
    name: "SIDHU",
    role: "BACKEND DEVELOPER",
    defaultImage: "/team/sidhu.jpg",
    instruction: "Second image uploaded in chat (Suit, sunglasses, futuristic blue neon arches)",
  },
  {
    id: "mathew-ai",
    name: "MATHEW",
    role: "AI SPECIALIST",
    defaultImage: "/team/mathew-ai.jpg",
    instruction: "AI Specialist portrait",
  },
];

export default function TeamPhotosPage() {
  const [previews, setPreviews] = useState<Record<string, string>>({});
  const [files, setFiles] = useState<Record<string, File>>({});
  const [status, setStatus] = useState<Record<string, "idle" | "uploading" | "success" | "error">>({});
  const [message, setMessage] = useState<string>("");

  const handleFileChange = (id: string, file: File) => {
    setFiles((prev) => ({ ...prev, [id]: file }));
    const objectUrl = URL.createObjectURL(file);
    setPreviews((prev) => ({ ...prev, [id]: objectUrl }));
    setStatus((prev) => ({ ...prev, [id]: "idle" }));
  };

  const handleDrop = (id: string, e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(id, e.dataTransfer.files[0]);
    }
  };

  const handleUploadSingle = async (id: string) => {
    const file = files[id];
    if (!file) return;

    setStatus((prev) => ({ ...prev, [id]: "uploading" }));
    setMessage("");

    const formData = new FormData();
    formData.append("member", id);
    formData.append("file", file);

    try {
      const res = await fetch("/api/team/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setStatus((prev) => ({ ...prev, [id]: "success" }));
        setMessage(`Updated ${id.toUpperCase()}'s photo successfully!`);
      } else {
        setStatus((prev) => ({ ...prev, [id]: "error" }));
        setMessage(data.error || "Upload failed");
      }
    } catch {
      setStatus((prev) => ({ ...prev, [id]: "error" }));
      setMessage("Network error while uploading");
    }
  };

  const handleUploadAll = async () => {
    const toUpload = Object.keys(files);
    if (toUpload.length === 0) {
      setMessage("Please select at least one photo first.");
      return;
    }

    setMessage("Uploading team photos...");
    for (const id of toUpload) {
      await handleUploadSingle(id);
    }
    setMessage("All selected photos have been updated on the website!");
  };

  return (
    <div className="min-h-screen bg-black text-white selection:bg-yellow-400 selection:text-black">
      <Navbar />

      <main className="max-w-5xl mx-auto px-6 pt-32 pb-24">
        {/* Top Header */}
        <div className="flex flex-col gap-3 mb-10">
          <Link
            href="/#team"
            className="inline-flex items-center gap-2 text-xs font-mono text-zinc-400 hover:text-yellow-400 transition-colors uppercase tracking-wider w-fit"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Team Section
          </Link>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Update Team GEN-M Photos
          </h1>
          <p className="text-sm text-zinc-400 max-w-2xl leading-relaxed">
            Upload the actual portraits for Mathew and Sidhu. Selected images will immediately replace the circular portraits in the live interactive Bento Showcase.
          </p>
        </div>

        {/* Global Alert Notification */}
        {message && (
          <div className="mb-8 p-4 rounded-xl bg-yellow-400/10 border border-yellow-400/30 text-yellow-400 text-sm font-medium flex items-center justify-between">
            <span>{message}</span>
            <button
              type="button"
              onClick={() => setMessage("")}
              className="text-xs uppercase font-mono tracking-wider hover:underline"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* 3 Upload Slots Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {slots.map((slot) => {
            const currentPreview = previews[slot.id] || slot.defaultImage;
            const isUploading = status[slot.id] === "uploading";
            const isSuccess = status[slot.id] === "success";

            return (
              <div
                key={slot.id}
                className="p-6 rounded-2xl bg-zinc-950 border border-zinc-800 flex flex-col items-center text-center gap-5 relative hover:border-zinc-700 transition-colors"
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => handleDrop(slot.id, e)}
              >
                {/* Role Header */}
                <div>
                  <h3 className="text-lg font-bold text-white uppercase">{slot.name}</h3>
                  <span className="text-xs font-mono text-yellow-400 tracking-wider font-semibold">
                    {slot.role}
                  </span>
                </div>

                {/* Circular Image Frame Preview */}
                <div className="relative w-44 h-44 rounded-full overflow-hidden border-2 border-yellow-400/80 shadow-[0_10px_25px_rgba(250,204,21,0.15)] bg-zinc-900 group">
                  <Image
                    src={currentPreview}
                    alt={slot.name}
                    fill
                    className="object-cover rounded-full"
                    unoptimized
                  />
                  {/* Overlay drop prompt */}
                  <label
                    htmlFor={`file-input-${slot.id}`}
                    className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1 cursor-pointer text-xs font-semibold text-white p-2"
                  >
                    <Upload className="w-5 h-5 text-yellow-400" />
                    <span>Click or Drop to Change</span>
                  </label>
                </div>

                {/* Hidden File Input */}
                <input
                  id={`file-input-${slot.id}`}
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/jpg"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleFileChange(slot.id, e.target.files[0]);
                    }
                  }}
                />

                {/* Slot Instruction */}
                <p className="text-xs text-zinc-400 leading-snug min-h-[36px]">
                  {slot.instruction}
                </p>

                {/* Action Buttons */}
                <div className="w-full flex flex-col gap-2 pt-2">
                  <label
                    htmlFor={`file-input-${slot.id}`}
                    className="w-full py-2.5 px-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-xs font-bold uppercase tracking-wider text-zinc-200 flex items-center justify-center gap-2 cursor-pointer transition-colors"
                  >
                    <Upload className="w-3.5 h-3.5 text-yellow-400" />
                    Select Photo
                  </label>

                  {files[slot.id] && (
                    <button
                      type="button"
                      onClick={() => handleUploadSingle(slot.id)}
                      disabled={isUploading}
                      className="w-full py-2.5 px-4 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-black text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-colors disabled:opacity-50"
                    >
                      {isUploading ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          Uploading...
                        </>
                      ) : isSuccess ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-black" />
                          Saved to Website!
                        </>
                      ) : (
                        "Apply to Live Site"
                      )}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Mass Action */}
        <div className="p-6 rounded-2xl bg-zinc-950 border border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h4 className="text-base font-bold text-white">Save All Selected Photos</h4>
            <p className="text-xs text-zinc-400">
              Apply new profile photos to the Team GEN-M section instantly without rebuilding.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/#team"
              className="py-3 px-5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs font-bold uppercase tracking-wider text-zinc-300 hover:text-white transition-colors"
            >
              View Live Website
            </Link>
            <button
              type="button"
              onClick={handleUploadAll}
              className="py-3 px-6 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-black text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-yellow-400/20 cursor-pointer transition-all"
            >
              <Upload className="w-4 h-4" />
              Apply All Photos
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
