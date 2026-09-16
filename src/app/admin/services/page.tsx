"use client";

import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Layers,
  Save,
  Plus,
  Trash2,
  Upload,
  ArrowUp,
  ArrowDown,
  ExternalLink,
  CheckCircle2,
  X,
  Sparkles,
  Image as ImageIcon,
  AlertCircle,
  Loader2,
  Eye,
} from "lucide-react";
import { ServiceItem } from "@/lib/types";

export default function AdminServicesPage() {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [uploadingIdx, setUploadingIdx] = useState<number | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // New service modal state
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newCoverImage, setNewCoverImage] = useState("/services/web-development.jpg");
  const [isUploadingNew, setIsUploadingNew] = useState(false);

  const fileInputRefs = useRef<{ [key: number]: HTMLInputElement | null }>({});
  const newFileInputRef = useRef<HTMLInputElement | null>(null);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/services");
      const data = await res.json();
      if (data.services && Array.isArray(data.services)) {
        setServices(data.services);
      } else {
        // Fallback to /api/content
        const fallbackRes = await fetch("/api/content");
        const fallbackData = await fallbackRes.json();
        if (fallbackData.services) {
          setServices(fallbackData.services);
        }
      }
    } catch {
      setNotification({ type: "error", text: "Failed to load services from database." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const showNotice = (text: string, type: "success" | "error" = "success") => {
    setNotification({ type, text });
    setTimeout(() => {
      setNotification(null);
    }, 4500);
  };

  // Handle direct field edit
  const handleFieldChange = (index: number, field: "title" | "description" | "coverImage", value: string) => {
    const updated = [...services];
    updated[index] = {
      ...updated[index],
      [field]: value,
      ...(field === "coverImage" ? { image: value } : {}),
    };
    setServices(updated);
  };

  // Handle file upload for an existing service card
  const handleFileUpload = async (index: number, file: File) => {
    if (!file) return;
    setUploadingIdx(index);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "services");

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || !data.url) {
        throw new Error(data.error || "Image upload failed");
      }

      handleFieldChange(index, "coverImage", data.url);
      showNotice(`Image uploaded successfully (${data.provider === "firebase" ? "Firebase Storage" : "Persistent Base64"})!`);
    } catch (err: any) {
      showNotice(err.message || "Failed to upload image", "error");
    } finally {
      setUploadingIdx(null);
    }
  };

  // Handle file upload for new service form
  const handleNewFileUpload = async (file: File) => {
    if (!file) return;
    setIsUploadingNew(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "services");

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || !data.url) {
        throw new Error(data.error || "Image upload failed");
      }

      setNewCoverImage(data.url);
      showNotice("Cover image uploaded for new service!");
    } catch (err: any) {
      showNotice(err.message || "Failed to upload image", "error");
    } finally {
      setIsUploadingNew(false);
    }
  };

  // Save all changes to Firestore
  const handleSaveAll = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ services }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save services to Firestore");

      if (data.services) {
        setServices(data.services);
      }
      showNotice("Services saved to Firestore! Live website 3D carousel updated.");
    } catch (err: any) {
      showNotice(err.message || "Failed to save services", "error");
    } finally {
      setSaving(false);
    }
  };

  // Add new service
  const handleAddService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      showNotice("Service title is required.", "error");
      return;
    }

    const newServiceObj: ServiceItem = {
      id: `srv-${Date.now()}`,
      title: newTitle.trim().toUpperCase(),
      description: newDescription.trim(),
      coverImage: newCoverImage.trim() || "/services/web-development.jpg",
      image: newCoverImage.trim() || "/services/web-development.jpg",
      slug: newTitle.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    };

    const updatedServices = [...services, newServiceObj];
    setServices(updatedServices);
    setIsAddingNew(false);
    setNewTitle("");
    setNewDescription("");
    setNewCoverImage("/services/web-development.jpg");

    // Automatically persist to Firestore
    setSaving(true);
    try {
      const res = await fetch("/api/services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ services: updatedServices }),
      });
      const data = await res.json();
      if (data.services) setServices(data.services);
      showNotice(`"${newServiceObj.title}" added and published to the live 3D carousel!`);
    } catch (err: any) {
      showNotice("Added locally. Click 'Save & Publish' to ensure database persistence.", "error");
    } finally {
      setSaving(false);
    }
  };

  // Delete service
  const handleDeleteService = async (id: string) => {
    const target = services.find((s) => s.id === id);
    const updatedServices = services.filter((s) => s.id !== id);
    setServices(updatedServices);
    setDeleteConfirmId(null);

    setSaving(true);
    try {
      const res = await fetch("/api/services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ services: updatedServices }),
      });
      const data = await res.json();
      if (data.services) setServices(data.services);
      showNotice(`Service "${target?.title || id}" deleted successfully.`);
    } catch (err: any) {
      showNotice("Deleted locally. Click 'Save & Publish' to persist changes.", "error");
    } finally {
      setSaving(false);
    }
  };

  // Move service up in carousel order
  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const updated = [...services];
    const [moved] = updated.splice(index, 1);
    updated.splice(index - 1, 0, moved);
    setServices(updated);
  };

  // Move service down in carousel order
  const handleMoveDown = (index: number) => {
    if (index === services.length - 1) return;
    const updated = [...services];
    const [moved] = updated.splice(index, 1);
    updated.splice(index + 1, 0, moved);
    setServices(updated);
  };

  return (
    <div className="flex flex-col gap-8 pb-16 max-w-7xl mx-auto w-full">
      {/* Top Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-900 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-yellow-400">
              Live Website Content
            </span>
            <span className="text-zinc-600 text-xs">•</span>
            <span className="text-xs font-mono text-zinc-400">Firestore Real-Time Sync</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight flex items-center gap-3">
            <Layers className="w-8 h-8 text-yellow-400" />
            Services Editor
          </h1>
          <p className="text-sm text-zinc-400 mt-1 max-w-2xl">
            Edit the 3 essential fields that synchronize directly with the Live Website 3D Card Carousel: 
            <strong className="text-white"> Service Title</strong>, 
            <strong className="text-white"> Short Description</strong>, and 
            <strong className="text-white"> Cover Image</strong>.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start md:self-auto">
          <Link
            href="/#services"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2.5 rounded-xl border border-zinc-800 bg-zinc-900/80 hover:bg-zinc-850 text-zinc-300 hover:text-white font-mono text-xs flex items-center gap-1.5 transition-colors"
          >
            <Eye className="w-3.5 h-3.5 text-yellow-400" />
            <span>View 3D Carousel</span>
            <ExternalLink className="w-3 h-3 opacity-60 ml-0.5" />
          </Link>

          <button
            id="admin-add-service-btn"
            onClick={() => setIsAddingNew(true)}
            className="px-4 py-2.5 rounded-xl border border-yellow-400/40 bg-yellow-400/10 hover:bg-yellow-400/20 text-yellow-400 font-bold text-xs uppercase tracking-wider transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Service</span>
          </button>

          <button
            id="admin-save-services-btn"
            onClick={handleSaveAll}
            disabled={saving}
            className="px-6 py-2.5 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-black font-extrabold text-xs uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-yellow-400/10 disabled:opacity-50"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Publishing...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4 stroke-[2.5]" />
                <span>Save &amp; Publish</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Floating Status Notification */}
      {notification && (
        <div
          className={`p-4 rounded-xl text-xs font-mono flex items-center justify-between border transition-all ${
            notification.type === "error"
              ? "bg-red-950/40 border-red-800/60 text-red-300"
              : "bg-yellow-400/10 border-yellow-400/30 text-yellow-300"
          }`}
        >
          <div className="flex items-center gap-2.5">
            {notification.type === "error" ? (
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-yellow-400 shrink-0" />
            )}
            <span>{notification.text}</span>
          </div>
          <button
            onClick={() => setNotification(null)}
            className="text-zinc-400 hover:text-white ml-4"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Loading Skeleton */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <Loader2 className="w-8 h-8 text-yellow-400 animate-spin" />
          <p className="text-xs font-mono text-zinc-500 uppercase tracking-wider">
            Fetching services from Firestore...
          </p>
        </div>
      ) : services.length === 0 ? (
        <div className="p-12 text-center border border-dashed border-zinc-800 rounded-2xl bg-zinc-950 flex flex-col items-center gap-4">
          <Layers className="w-12 h-12 text-zinc-600" />
          <div className="flex flex-col gap-1">
            <h3 className="text-lg font-bold text-white">No services in database</h3>
            <p className="text-xs text-zinc-500">
              Add your first service to show it in the live website carousel.
            </p>
          </div>
          <button
            onClick={() => setIsAddingNew(true)}
            className="px-5 py-2 rounded-xl bg-yellow-400 text-black font-bold text-xs uppercase tracking-wider hover:bg-yellow-300 transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add First Service
          </button>
        </div>
      ) : (
        /* Services Cards Grid */
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between text-xs text-zinc-500 font-mono">
            <span>SHOWING {services.length} ACTIVE SERVICES IN 3D CAROUSEL SEQUENCE</span>
            <span>CLICK &quot;SAVE &amp; PUBLISH&quot; TO UPDATE LIVE WEBSITE</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {services.map((service, index) => {
              const currentImg = service.coverImage || service.image || "/services/web-development.jpg";
              const isUploadingThis = uploadingIdx === index;

              return (
                <div
                  key={service.id || index}
                  id={`admin-service-card-${index}`}
                  className="rounded-2xl bg-zinc-950 border border-zinc-800/90 hover:border-zinc-700 transition-all p-5 flex flex-col justify-between gap-5 relative group"
                >
                  {/* Card Header: Position, Reorder, Delete */}
                  <div className="flex items-center justify-between border-b border-zinc-900 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-yellow-400 px-2 py-0.5 rounded bg-yellow-400/10 border border-yellow-400/20">
                        #{String(index + 1).padStart(2, "0")}
                      </span>
                      <span className="text-[11px] font-mono text-zinc-500 uppercase truncate max-w-[120px]">
                        {service.slug || service.id}
                      </span>
                    </div>

                    {/* Quick Sequence Reordering & Delete */}
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleMoveUp(index)}
                        disabled={index === 0}
                        title="Move Left/Earlier in carousel"
                        className="p-1 text-zinc-500 hover:text-white disabled:opacity-20 hover:bg-zinc-900 rounded transition-colors"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleMoveDown(index)}
                        disabled={index === services.length - 1}
                        title="Move Right/Later in carousel"
                        className="p-1 text-zinc-500 hover:text-white disabled:opacity-20 hover:bg-zinc-900 rounded transition-colors"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                      <div className="w-[1px] h-3 bg-zinc-800 mx-1" />
                      <button
                        type="button"
                        id={`delete-service-${service.id}`}
                        onClick={() => setDeleteConfirmId(service.id)}
                        title="Delete service"
                        className="p-1 text-zinc-500 hover:text-red-400 hover:bg-red-950/30 rounded transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* 1. COVER IMAGE (Visual Preview + Upload + URL) */}
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                        <ImageIcon className="w-3.5 h-3.5 text-yellow-400" />
                        1. Cover Image
                      </label>
                      <span className="text-[10px] font-mono text-zinc-500">
                        Storage or URL
                      </span>
                    </div>

                    {/* Image Preview Box */}
                    <div className="relative w-full h-[180px] rounded-xl overflow-hidden border border-zinc-850 bg-zinc-900 group/img">
                      {currentImg ? (
                        <Image
                          src={currentImg}
                          alt={service.title || "Service cover"}
                          fill
                          unoptimized={currentImg.startsWith("data:") || currentImg.startsWith("http")}
                          className="object-cover"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-zinc-600 gap-2">
                          <ImageIcon className="w-8 h-8" />
                          <span className="text-xs font-mono">No Image Uploaded</span>
                        </div>
                      )}

                      {/* Dark overlay on hover with upload action */}
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/img:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-3">
                        <button
                          type="button"
                          onClick={() => fileInputRefs.current[index]?.click()}
                          disabled={isUploadingThis}
                          className="px-3 py-1.5 rounded-lg bg-yellow-400 text-black font-bold text-xs flex items-center gap-1.5 hover:bg-yellow-300 transition-colors cursor-pointer"
                        >
                          {isUploadingThis ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <Upload className="w-3.5 h-3.5" />
                          )}
                          <span>Upload File</span>
                        </button>
                        <span className="text-[10px] font-mono text-zinc-300">
                          JPG, PNG, WEBP
                        </span>
                      </div>

                      {/* Uploading Spinner Overlay */}
                      {isUploadingThis && (
                        <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center gap-2">
                          <Loader2 className="w-6 h-6 text-yellow-400 animate-spin" />
                          <span className="text-[11px] font-mono text-yellow-400">Uploading...</span>
                        </div>
                      )}
                    </div>

                    {/* Hidden Native File Input */}
                    <input
                      type="file"
                      ref={(el) => {
                        fileInputRefs.current[index] = el;
                      }}
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) handleFileUpload(index, f);
                      }}
                      accept="image/*"
                      className="hidden"
                    />

                    {/* URL text input option */}
                    <div className="flex items-center gap-2 mt-1">
                      <input
                        type="text"
                        value={service.coverImage || service.image || ""}
                        onChange={(e) => handleFieldChange(index, "coverImage", e.target.value)}
                        placeholder="Image URL: /services/web.jpg or https://..."
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs text-zinc-300 font-mono focus:outline-none focus:border-yellow-400/80 transition-colors"
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRefs.current[index]?.click()}
                        title="Upload file from device"
                        className="p-1.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-lg text-zinc-300 hover:text-white transition-colors cursor-pointer shrink-0"
                      >
                        <Upload className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* 2. SERVICE TITLE */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-zinc-400 flex items-center justify-between">
                      <span>2. Service Title</span>
                      <span className="text-[10px] text-zinc-500">UPPERCASE</span>
                    </label>
                    <input
                      type="text"
                      value={service.title}
                      onChange={(e) => handleFieldChange(index, "title", e.target.value)}
                      placeholder="e.g. WEB DEVELOPMENT"
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2 text-sm text-white font-black tracking-tight uppercase focus:outline-none focus:border-yellow-400 transition-colors"
                    />
                  </div>

                  {/* 3. SHORT DESCRIPTION */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-zinc-400 flex items-center justify-between">
                      <span>3. Short Description</span>
                      <span className="text-[10px] text-zinc-500">Live 3D Card Copy</span>
                    </label>
                    <textarea
                      rows={3}
                      value={service.description}
                      onChange={(e) => handleFieldChange(index, "description", e.target.value)}
                      placeholder="Short summary displayed on the card..."
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-xs text-zinc-300 leading-relaxed focus:outline-none focus:border-yellow-400 resize-none transition-colors"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl max-w-md w-full p-6 flex flex-col gap-5 shadow-2xl">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-red-950/60 border border-red-800/80 flex items-center justify-center shrink-0">
                <Trash2 className="w-5 h-5 text-red-400" />
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="text-base font-bold text-white">Delete this service?</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  This will permanently remove the service card from the live website 3D carousel and Firestore database.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 rounded-xl border border-zinc-800 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-mono transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                id="confirm-delete-service-btn"
                onClick={() => handleDeleteService(deleteConfirmId)}
                className="px-5 py-2 rounded-xl bg-red-500 hover:bg-red-400 text-white font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
              >
                Delete Service
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add New Service Modal */}
      {isAddingNew && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-zinc-950 border border-zinc-800 rounded-3xl max-w-lg w-full p-6 sm:p-7 flex flex-col gap-6 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-zinc-900 pb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-yellow-400/10 border border-yellow-400/30 flex items-center justify-center">
                  <Plus className="w-4 h-4 text-yellow-400" />
                </div>
                <h2 className="text-lg font-black text-white uppercase tracking-tight">
                  Add New Service Card
                </h2>
              </div>
              <button
                onClick={() => setIsAddingNew(false)}
                className="text-zinc-500 hover:text-white p-1 rounded-lg hover:bg-zinc-900 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddService} className="flex flex-col gap-5">
              {/* 1. Cover Image */}
              <div className="flex flex-col gap-2">
                <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-zinc-400 flex items-center justify-between">
                  <span>1. Cover Image</span>
                  <span className="text-[10px] text-zinc-500">Upload or URL</span>
                </label>

                <div className="relative w-full h-[160px] rounded-xl overflow-hidden border border-zinc-850 bg-zinc-900 flex items-center justify-center group/preview">
                  {newCoverImage ? (
                    <Image
                      src={newCoverImage}
                      alt="New service preview"
                      fill
                      unoptimized={newCoverImage.startsWith("data:") || newCoverImage.startsWith("http")}
                      className="object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <ImageIcon className="w-8 h-8 text-zinc-600" />
                  )}

                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/preview:opacity-100 transition-opacity flex items-center justify-center">
                    <button
                      type="button"
                      onClick={() => newFileInputRef.current?.click()}
                      className="px-3.5 py-1.5 rounded-lg bg-yellow-400 text-black font-bold text-xs flex items-center gap-1.5 hover:bg-yellow-300 transition-colors cursor-pointer"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      Choose Device File
                    </button>
                  </div>

                  {isUploadingNew && (
                    <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center gap-2">
                      <Loader2 className="w-6 h-6 text-yellow-400 animate-spin" />
                      <span className="text-[11px] font-mono text-yellow-400">Uploading to storage...</span>
                    </div>
                  )}
                </div>

                <input
                  type="file"
                  ref={newFileInputRef}
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) handleNewFileUpload(f);
                  }}
                  accept="image/*"
                  className="hidden"
                />

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={newCoverImage}
                    onChange={(e) => setNewCoverImage(e.target.value)}
                    placeholder="e.g. /services/web-development.jpg or https://..."
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-zinc-300 font-mono focus:outline-none focus:border-yellow-400"
                  />
                  <button
                    type="button"
                    onClick={() => newFileInputRef.current?.click()}
                    className="p-1.5 bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 rounded-lg text-zinc-300 hover:text-white"
                  >
                    <Upload className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* 2. Service Title */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-zinc-400">
                  2. Service Title *
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. 3D MOTION DESIGN"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm text-white font-black uppercase focus:outline-none focus:border-yellow-400 transition-colors"
                />
              </div>

              {/* 3. Short Description */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-zinc-400">
                  3. Short Description
                </label>
                <textarea
                  rows={3}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Concise overview rendered directly in the 3D card carousel..."
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-xs text-zinc-300 leading-relaxed focus:outline-none focus:border-yellow-400 resize-none transition-colors"
                />
              </div>

              {/* Modal Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-900">
                <button
                  type="button"
                  onClick={() => setIsAddingNew(false)}
                  className="px-4 py-2.5 rounded-xl border border-zinc-800 bg-zinc-900 hover:bg-zinc-850 text-zinc-400 hover:text-white font-mono text-xs transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving || isUploadingNew}
                  className="px-6 py-2.5 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-black font-extrabold text-xs uppercase tracking-wider transition-colors cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create &amp; Publish</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
