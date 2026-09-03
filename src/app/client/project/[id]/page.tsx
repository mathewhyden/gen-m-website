"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/lib/AuthContext";
import { Project } from "@/lib/types";
import { 
  ArrowLeft, 
  CheckCircle2, 
  ExternalLink, 
  MessageSquare, 
  ShieldCheck, 
  Sparkles, 
  Clock, 
  AlertCircle,
  Receipt,
  FileCheck2,
  Send,
  X
} from "lucide-react";

export default function ClientProjectViewPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params?.id as string;
  const { user } = useAuth();

  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [approving, setApproving] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackNote, setFeedbackNote] = useState("");
  const [submittingFeedback, setSubmittingFeedback] = useState(false);
  const [notification, setNotification] = useState("");

  useEffect(() => {
    if (!projectId) return;
    fetch(`/api/projects/${projectId}`)
      .then(res => res.json())
      .then(data => {
        if (data.project) setProject(data.project);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [projectId]);

  const handleApproveProject = async () => {
    if (!confirm("Are you ready to officially approve this milestone and commission release? This will update the project status to APPROVED and prepare the invoice.")) return;
    setApproving(true);

    try {
      const res = await fetch(`/api/projects/${projectId}/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "approve",
          approvedBy: user?.name || "Client Verified",
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Approval failed");

      setProject(data.project);
      setNotification("🎉 Project successfully approved! Our engineering team has been notified, and invoice settlement is unlocked.");
    } catch (err: any) {
      alert(err.message || "Failed to approve project");
    } finally {
      setApproving(false);
    }
  };

  const handleRequestChanges = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackNote.trim()) return;
    setSubmittingFeedback(true);

    try {
      const res = await fetch(`/api/projects/${projectId}/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "reject",
          note: feedbackNote,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to submit change request");

      setProject(data.project);
      setShowFeedbackModal(false);
      setFeedbackNote("");
      setNotification("Feedback submitted to engineering team. Status updated to Client Review.");
    } catch (err: any) {
      alert(err.message || "Failed to submit change request");
    } finally {
      setSubmittingFeedback(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-black min-h-screen text-white flex items-center justify-center font-mono text-sm">
        Loading project verification portal...
      </div>
    );
  }

  if (!project) {
    return (
      <div className="bg-black min-h-screen text-white flex flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold">Project Not Found</h1>
        <Link href="/client/dashboard" className="text-yellow-400 text-sm">
          Return to Dashboard
        </Link>
      </div>
    );
  }

  const isApproved = project.status === "APPROVED" || project.status === "PAID" || project.status === "COMPLETED";

  return (
    <div className="bg-black min-h-screen text-white font-sans flex flex-col selection:bg-yellow-400 selection:text-black">
      {/* Top Bar */}
      <header className="border-b border-zinc-800 bg-zinc-950 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/client/dashboard"
              className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <span className="text-xs font-mono text-zinc-500 block">Project Verification Hub</span>
              <h1 className="text-base font-bold text-white">{project.name}</h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className={`px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider border ${
              isApproved
                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                : "bg-purple-500/10 text-purple-400 border-purple-500/30"
            }`}>
              {project.status.replace("_", " ")}
            </span>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-6 py-8 w-full flex flex-col gap-8">
        {/* Notification Banner */}
        {notification && (
          <div className="p-4 rounded-xl bg-yellow-400/10 border border-yellow-400/30 text-yellow-300 text-xs font-mono flex items-center justify-between">
            <span>{notification}</span>
            <button onClick={() => setNotification("")} className="text-yellow-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Top Action Bar */}
        <section className="p-6 md:p-8 rounded-3xl bg-zinc-950 border border-zinc-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-yellow-400 text-xs font-mono font-bold uppercase tracking-wider mb-2">
              <ShieldCheck className="w-4 h-4" /> Verification & Approval Gate
            </div>
            <h2 className="text-2xl font-bold text-white mb-1">Deliverable Review Stage</h2>
            <p className="text-xs text-zinc-400 max-w-xl">
              Inspect the live staging environment below. Once satisfied with the milestone deliverables, click Approve Project to sign off on this build.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 rounded-full bg-zinc-900 border border-zinc-700 text-xs font-bold text-white hover:border-yellow-400 transition-colors flex items-center gap-2"
              >
                Launch Staging Site <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}

            {!isApproved ? (
              <>
                <button
                  onClick={() => setShowFeedbackModal(true)}
                  className="px-5 py-2.5 rounded-full bg-zinc-900 border border-zinc-700 text-xs font-bold text-zinc-300 hover:text-white hover:border-zinc-500 transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-yellow-400" />
                  Request Changes
                </button>

                <button
                  onClick={handleApproveProject}
                  disabled={approving}
                  className="px-6 py-2.5 rounded-full bg-yellow-400 text-black font-bold text-xs uppercase tracking-wider hover:bg-yellow-300 transition-all flex items-center gap-2 shadow-lg shadow-yellow-400/10 cursor-pointer disabled:opacity-50"
                >
                  <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
                  {approving ? "Verifying..." : "Approve Project"}
                </button>
              </>
            ) : (
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold">
                <CheckCircle2 className="w-4 h-4" />
                <span>Deliverable Formally Approved</span>
              </div>
            )}
          </div>
        </section>

        {/* Milestone Tracker */}
        <section className="p-6 md:p-8 rounded-3xl bg-zinc-950 border border-zinc-800 flex flex-col gap-6">
          <div>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-yellow-400 block mb-1">
              Live Progress Matrix
            </span>
            <h3 className="text-lg font-bold text-white">Milestone Status</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {project.milestones && project.milestones.map((milestone, idx) => (
              <div
                key={milestone.id || idx}
                className={`p-5 rounded-2xl border flex flex-col justify-between gap-3 ${
                  milestone.status === "COMPLETED"
                    ? "bg-zinc-900/90 border-emerald-500/40"
                    : milestone.status === "IN_PROGRESS"
                      ? "bg-zinc-900/90 border-yellow-400/40"
                      : "bg-zinc-950 border-zinc-800 opacity-60"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-zinc-500">Stage 0{idx + 1}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                    milestone.status === "COMPLETED"
                      ? "bg-emerald-500/10 text-emerald-400"
                      : milestone.status === "IN_PROGRESS"
                        ? "bg-yellow-400/10 text-yellow-400"
                        : "bg-zinc-800 text-zinc-400"
                  }`}>
                    {milestone.status}
                  </span>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">{milestone.title}</h4>
                  <p className="text-xs text-zinc-400 mt-1 leading-relaxed">{milestone.description}</p>
                </div>
                {milestone.dueDate && (
                  <span className="text-[11px] font-mono text-zinc-500 pt-2 border-t border-zinc-800/60">
                    Due: {milestone.dueDate}
                  </span>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Live Staging Preview Display */}
        <section className="p-6 md:p-8 rounded-3xl bg-zinc-950 border border-zinc-800 flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-yellow-400 block mb-1">
                Visual Inspection
              </span>
              <h3 className="text-lg font-bold text-white">Staging Environment Output</h3>
            </div>
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-mono text-yellow-400 hover:underline flex items-center gap-1"
              >
                Open in new tab ↗
              </a>
            )}
          </div>

          <div className="relative aspect-video w-full rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-900">
            <Image
              src={project.coverImage}
              alt={project.name}
              fill
              className="object-cover"
            />
          </div>
        </section>
      </main>

      {/* Change Request / Feedback Modal */}
      {showFeedbackModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-6">
          <div className="max-w-lg w-full p-6 md:p-8 rounded-3xl bg-zinc-950 border border-zinc-800 shadow-2xl flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-white">Request Milestone Changes</h3>
              <button onClick={() => setShowFeedbackModal(false)} className="text-zinc-500 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRequestChanges} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-mono uppercase tracking-wider text-zinc-400">
                  Revision Notes & Adjustments *
                </label>
                <textarea
                  required
                  rows={5}
                  placeholder="Detail the specific UI elements, copy adjustments, or behavioral revisions required..."
                  value={feedbackNote}
                  onChange={(e) => setFeedbackNote(e.target.value)}
                  className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-sm text-white focus:outline-none focus:border-yellow-400 transition-colors resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowFeedbackModal(false)}
                  className="px-4 py-2 rounded-full text-xs font-mono text-zinc-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingFeedback}
                  className="px-6 py-2.5 rounded-full bg-yellow-400 text-black font-bold text-xs uppercase tracking-wider hover:bg-yellow-300 transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  {submittingFeedback ? "Dispatching..." : "Submit Revision"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
