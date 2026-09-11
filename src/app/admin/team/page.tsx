"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  Users,
  Plus,
  Edit2,
  Trash2,
  Upload,
  CheckCircle2,
  XCircle,
  Eye,
  EyeOff,
  Sparkles,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { TeamMember } from "@/lib/types";

export default function AdminTeamPage() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [notification, setNotification] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    quote: "",
    image: "/team/mathew.jpg",
    order: 1,
    active: true,
  });

  const fetchMembers = async () => {
    try {
      const res = await fetch("/api/team");
      const data = await res.json();
      if (data.members) {
        setMembers(data.members);
      }
    } catch (err) {
      console.error("Failed to load team members", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const openAddModal = () => {
    setEditingMember(null);
    setFormData({
      name: "",
      role: "",
      quote: "",
      image: "/team/mathew.jpg",
      order: members.length + 1,
      active: true,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (member: TeamMember) => {
    setEditingMember(member);
    setFormData({
      name: member.name,
      role: member.role,
      quote: member.quote,
      image: member.image || "/team/mathew.jpg",
      order: member.order ?? 1,
      active: member.active ?? true,
    });
    setIsModalOpen(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const body = new FormData();
      body.append("file", file);
      body.append("folder", "team");

      const res = await fetch("/api/upload", {
        method: "POST",
        body,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Image upload failed");

      setFormData((prev) => ({ ...prev, image: data.url }));
      setNotification("Photo uploaded successfully!");
    } catch (err: any) {
      alert(err.message || "Failed to upload photo");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!formData.name.trim() || !formData.role.trim()) {
      alert("Name and Role are required.");
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingMember) {
        // Update
        const res = await fetch("/api/team", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: editingMember.id,
            ...formData,
            order: Number(formData.order) || 1,
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to update member");
        setNotification(`Updated profile for ${formData.name}`);
      } else {
        // Create
        const res = await fetch("/api/team", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...formData,
            order: Number(formData.order) || 1,
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to add member");
        setNotification(`Added ${formData.name} to team directory`);
      }

      setIsModalOpen(false);
      await fetchMembers();
    } catch (err: any) {
      alert(err.message || "Operation failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to remove ${name} from the team?`)) return;

    try {
      const res = await fetch(`/api/team?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to delete member");
      }
      setNotification(`Removed ${name} from team`);
      await fetchMembers();
    } catch (err: any) {
      alert(err.message || "Failed to delete member");
    }
  };

  const handleToggleActive = async (member: TeamMember) => {
    try {
      const res = await fetch("/api/team", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: member.id,
          active: !member.active,
        }),
      });
      if (res.ok) {
        setNotification(
          `${member.name} is now ${!member.active ? "visible" : "hidden"} on website`
        );
        fetchMembers();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800/80 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-yellow-400 mb-1">
            <Users className="w-4 h-4" />
            <span>Personnel &amp; Engineering Roster</span>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-white uppercase">
            Team Members Manager
          </h1>
          <p className="text-sm text-zinc-400 mt-1 max-w-2xl">
            Configure developer profiles, executive biographies, profile photos, and live portfolio presentation. Persisted permanently in Firestore.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              setRefreshing(true);
              fetchMembers();
            }}
            disabled={refreshing}
            className="px-3.5 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:border-zinc-700 text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin text-yellow-400" : ""}`} />
            Refresh
          </button>
          <button
            type="button"
            onClick={openAddModal}
            className="px-4 py-2.5 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-black font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-yellow-400/20 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Add Team Member
          </button>
        </div>
      </div>

      {/* Notification Banner */}
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

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-zinc-950/80 border border-zinc-800/80">
          <span className="text-[11px] font-mono uppercase tracking-widest text-zinc-500">Total Team Members</span>
          <p className="text-2xl font-black text-white mt-1">{members.length}</p>
        </div>
        <div className="p-4 rounded-2xl bg-zinc-950/80 border border-zinc-800/80">
          <span className="text-[11px] font-mono uppercase tracking-widest text-emerald-400/80">Active on Live Website</span>
          <p className="text-2xl font-black text-emerald-400 mt-1">
            {members.filter((m) => m.active).length}
          </p>
        </div>
        <div className="p-4 rounded-2xl bg-zinc-950/80 border border-zinc-800/80">
          <span className="text-[11px] font-mono uppercase tracking-widest text-yellow-400/80">Storage Status</span>
          <p className="text-sm font-mono text-zinc-300 mt-2 flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
            Synced with Firestore `team`
          </p>
        </div>
      </div>

      {/* Members Grid */}
      {loading ? (
        <div className="py-24 text-center">
          <Loader2 className="w-8 h-8 text-yellow-400 animate-spin mx-auto mb-3" />
          <p className="text-xs font-mono text-zinc-500 uppercase tracking-widest">
            Loading team roster...
          </p>
        </div>
      ) : members.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-zinc-950/40 border border-zinc-800/80">
          <Users className="w-12 h-12 text-zinc-700 mx-auto mb-3" />
          <h3 className="text-base font-bold text-white uppercase">No Team Members Found</h3>
          <p className="text-xs text-zinc-500 mt-1 mb-6 max-w-sm mx-auto">
            Get started by adding your developers, founders, and engineers to display on the live site.
          </p>
          <button
            type="button"
            onClick={openAddModal}
            className="px-4 py-2 rounded-xl bg-yellow-400 text-black font-bold text-xs uppercase tracking-wider inline-flex items-center gap-2"
          >
            <Plus className="w-3.5 h-3.5" />
            Add First Member
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {members.map((member) => (
            <div
              key={member.id}
              className={`relative group rounded-2xl bg-zinc-950 border transition-all duration-300 p-5 flex flex-col justify-between gap-5 ${
                member.active
                  ? "border-zinc-800/90 hover:border-yellow-400/40 shadow-lg hover:shadow-yellow-400/5"
                  : "border-zinc-900/90 opacity-60"
              }`}
            >
              <div>
                {/* Card Top: Photo + Badges */}
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="relative w-16 h-16 rounded-2xl overflow-hidden border border-zinc-700/80 bg-zinc-900 shrink-0">
                    <Image
                      src={member.image || "/team/mathew.jpg"}
                      alt={member.name}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  </div>

                  <div className="flex flex-col items-end gap-1.5">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400">
                      Order: #{member.order ?? 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleToggleActive(member)}
                      className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full flex items-center gap-1 transition-colors cursor-pointer ${
                        member.active
                          ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-400"
                          : "bg-zinc-900 border border-zinc-800 text-zinc-500"
                      }`}
                      title="Click to toggle visibility on website"
                    >
                      {member.active ? (
                        <>
                          <Eye className="w-3 h-3" /> Visible
                        </>
                      ) : (
                        <>
                          <EyeOff className="w-3 h-3" /> Hidden
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Name & Role */}
                <div>
                  <h3 className="text-lg font-black text-white uppercase tracking-tight">
                    {member.name}
                  </h3>
                  <span className="text-[11px] font-mono uppercase tracking-wider text-yellow-400 font-semibold block mt-0.5">
                    {member.role}
                  </span>
                </div>

                {/* Bio / Quote */}
                {member.quote && (
                  <p className="text-xs text-zinc-400 italic mt-3 line-clamp-3 bg-zinc-900/40 p-3 rounded-xl border border-zinc-850">
                    &ldquo;{member.quote}&rdquo;
                  </p>
                )}
              </div>

              {/* Bottom Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-zinc-900/80">
                <span className="text-[10px] font-mono text-zinc-600 truncate max-w-[120px]">
                  ID: {member.id}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => openEditModal(member)}
                    className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-yellow-400 border border-zinc-800 transition-colors cursor-pointer"
                    title="Edit Member"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(member.id, member.name)}
                    className="p-2 rounded-xl bg-zinc-900 hover:bg-red-500/20 text-zinc-300 hover:text-red-400 border border-zinc-800 hover:border-red-500/30 transition-colors cursor-pointer"
                    title="Delete Member"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="relative w-full max-w-lg bg-zinc-950 border border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 my-8">
            <div className="flex items-center justify-between border-b border-zinc-850 pb-4">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-yellow-400">
                  {editingMember ? "Modify Profile" : "New Team Entry"}
                </span>
                <h2 className="text-xl font-black text-white uppercase tracking-tight">
                  {editingMember ? `Edit ${editingMember.name}` : "Add Team Member"}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white flex items-center justify-center cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name */}
              <div className="space-y-1">
                <label className="text-[11px] font-mono uppercase text-zinc-400">
                  Full Name <span className="text-yellow-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. MATHEW, SIDHU"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-white uppercase font-bold focus:outline-none focus:border-yellow-400"
                />
              </div>

              {/* Role */}
              <div className="space-y-1">
                <label className="text-[11px] font-mono uppercase text-zinc-400">
                  Role / Title <span className="text-yellow-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. FRONTEND DEVELOPER, BACKEND & AI ENGINEER"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-white uppercase font-semibold focus:outline-none focus:border-yellow-400"
                />
              </div>

              {/* Bio / Quote */}
              <div className="space-y-1">
                <label className="text-[11px] font-mono uppercase text-zinc-400">
                  Quote / Short Bio
                </label>
                <textarea
                  rows={3}
                  placeholder="e.g. Crafting clean, responsive interfaces that feel effortless to use."
                  value={formData.quote}
                  onChange={(e) => setFormData({ ...formData, quote: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-xs text-zinc-200 focus:outline-none focus:border-yellow-400 resize-none"
                />
              </div>

              {/* Photo Upload & URL */}
              <div className="space-y-2">
                <label className="text-[11px] font-mono uppercase text-zinc-400">
                  Profile Photo (File Upload to Firebase Storage OR Image URL)
                </label>
                
                <div className="flex items-center gap-4 bg-zinc-900/60 border border-zinc-800 p-3 rounded-2xl">
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-zinc-900 border border-zinc-700 shrink-0">
                    <Image
                      src={formData.image || "/team/mathew.jpg"}
                      alt="Preview"
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <label className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white text-[11px] font-mono flex items-center gap-1.5 cursor-pointer transition-colors border border-zinc-700">
                        <Upload className="w-3 h-3 text-yellow-400" />
                        {uploadingImage ? "Uploading..." : "Upload File"}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileUpload}
                          disabled={uploadingImage}
                          className="hidden"
                        />
                      </label>
                      {uploadingImage && <Loader2 className="w-3.5 h-3.5 animate-spin text-yellow-400" />}
                    </div>

                    <input
                      type="text"
                      placeholder="Or paste direct image URL (e.g. /team/mathew.jpg)"
                      value={formData.image}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-2.5 py-1 text-[11px] text-zinc-300 font-mono focus:outline-none focus:border-yellow-400"
                    />
                  </div>
                </div>
              </div>

              {/* Order and Active Status */}
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="space-y-1">
                  <label className="text-[11px] font-mono uppercase text-zinc-400">
                    Display Order
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 1 })}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2 text-xs text-white font-mono focus:outline-none focus:border-yellow-400"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-mono uppercase text-zinc-400">
                    Active Status
                  </label>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, active: !formData.active })}
                    className={`w-full py-2 px-3 rounded-xl border text-xs font-mono flex items-center justify-center gap-2 cursor-pointer transition-colors ${
                      formData.active
                        ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-400 font-bold"
                        : "bg-zinc-900 border-zinc-800 text-zinc-500"
                    }`}
                  >
                    {formData.active ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" /> Show on Website
                      </>
                    ) : (
                      <>
                        <XCircle className="w-3.5 h-3.5" /> Hidden (Draft)
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-850">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-zinc-900 text-zinc-400 hover:text-white text-xs font-mono cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || uploadingImage}
                  className="px-5 py-2 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-black font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-yellow-400/20 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" /> Saving...
                    </>
                  ) : editingMember ? (
                    "Update Member"
                  ) : (
                    "Add Member"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
