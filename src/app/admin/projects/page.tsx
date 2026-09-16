"use client";

import React, { useEffect, useState } from "react";
import { 
  FolderGit2, 
  Plus, 
  Search, 
  CheckCircle2, 
  Send, 
  Receipt, 
  Trash2, 
  Edit3, 
  X,
  Sparkles,
  AlertCircle,
  Loader2,
  Mail,
  IndianRupee,
  Calendar,
  Check,
  Copy,
  ExternalLink
} from "lucide-react";
import { Project, ProjectStatus } from "@/lib/types";
import { compressImageToBase64 } from "@/lib/image-compression";

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [notification, setNotification] = useState("");
  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadStatus, setUploadStatus] = useState("");

  // Review Modal State
  const [reviewModalProject, setReviewModalProject] = useState<Project | null>(null);
  const [reviewEmail, setReviewEmail] = useState("");
  const [reviewNote, setReviewNote] = useState("");
  const [sendingReview, setSendingReview] = useState(false);
  const [reviewSuccessInfo, setReviewSuccessInfo] = useState<{ email: string; reviewUrl: string; mailtoUrl: string } | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  // Bill Invoice Modal State (Allows Admin to freely specify & change the invoice amount)
  const [invoiceModalProject, setInvoiceModalProject] = useState<Project | null>(null);
  const [invoiceAmount, setInvoiceAmount] = useState<number | string>("");
  const [invoiceDescription, setInvoiceDescription] = useState("");
  const [invoiceEmail, setInvoiceEmail] = useState("");
  const [invoiceDueDate, setInvoiceDueDate] = useState("");
  const [billingInvoice, setBillingInvoice] = useState(false);

  const handleUploadCover = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingCover(true);
    setUploadStatus("Processing...");
    try {
      // 1. Instant client-side resize & base64 conversion (0ms network overhead)
      const base64Data = await compressImageToBase64(file, {
        maxWidth: 800,
        maxHeight: 800,
        quality: 0.8,
      });

      // 2. Reactive preview & state update immediately
      setNewProject((prev) => ({ ...prev, coverImage: base64Data }));
      setUploadStatus("Ready");
      setNotification("Cover image converted to instant Base64!");
    } catch (err: any) {
      alert(err.message || "Failed to process image");
      setUploadStatus("");
    } finally {
      setUploadingCover(false);
    }
  };

  // Form State for new project
  const [newProject, setNewProject] = useState({
    name: "",
    slug: "",
    clientName: "",
    clientEmail: "",
    clientCompany: "",
    serviceName: "Web Development",
    category: "Web Development",
    description: "",
    budget: "$7,500",
    coverImage: "/graphic-design/graphic-work-1-1.jpg",
    liveUrl: "https://hebeart.com",
    expectedDelivery: "2026-04-30",
    technologies: "Next.js 16, React 19, Tailwind CSS, TypeScript",
  });

  const fetchProjects = () => {
    fetch("/api/projects")
      .then(res => res.json())
      .then(data => {
        if (data.projects && Array.isArray(data.projects)) {
          const seenIds = new Set<string>();
          const seenTitles = new Set<string>();
          const unique: Project[] = [];
          for (const p of data.projects) {
            const idKey = (p.id || "").trim().toLowerCase();
            const titleKey = (p.name || "").trim().toLowerCase().replace(/[^a-z0-9]/g, "");
            if (idKey && seenIds.has(idKey)) continue;
            if (titleKey && seenTitles.has(titleKey)) continue;
            if (idKey) seenIds.add(idKey);
            if (titleKey) seenTitles.add(titleKey);
            unique.push(p);
          }
          setProjects(unique);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newProject,
          technologies: newProject.technologies.split(",").map(s => s.trim()),
          gallery: [newProject.coverImage],
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create project");

      setShowAddModal(false);
      setNotification(`Project "${data.project.name}" commissioned successfully!`);
      fetchProjects();
    } catch (err: any) {
      alert(err.message || "Failed to create project");
    }
  };

  const handleUpdateStatus = async (id: string, status: ProjectStatus) => {
    try {
      const res = await fetch(`/api/projects/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        setNotification(`Project status changed to ${status}`);
        fetchProjects();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Open Review modal with prefilled client email
  const openReviewModal = (project: Project) => {
    setReviewModalProject(project);
    setReviewEmail(project.clientEmail || "");
    setReviewNote("");
    setReviewSuccessInfo(null);
    setCopiedLink(false);
  };

  // Submit Review Dispatch to Client Email
  const handleSendReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewModalProject) return;

    const targetEmail = reviewEmail.trim();
    if (!targetEmail || !targetEmail.includes("@")) {
      alert("Please enter a valid client email address to send the review invite.");
      return;
    }

    setSendingReview(true);
    try {
      const res = await fetch(`/api/projects/${reviewModalProject.id}/review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientEmail: targetEmail,
          note: reviewNote.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to dispatch review invitation");

      setNotification(`✓ Verification review invite successfully sent to ${targetEmail}! Client notified.`);
      setReviewSuccessInfo({
        email: targetEmail,
        reviewUrl: data.reviewUrl || `/work/${reviewModalProject.slug || reviewModalProject.id}`,
        mailtoUrl: data.mailtoUrl || `mailto:${targetEmail}`,
      });
      fetchProjects();
    } catch (err: any) {
      alert(err.message || "Failed to send review invite");
    } finally {
      setSendingReview(false);
    }
  };

  // Open Invoice modal with prefilled customizable amount
  const openInvoiceModal = (project: Project) => {
    setInvoiceModalProject(project);
    const numericBudget = parseInt((project.budget || `₹${project.amount || 75000}`).replace(/[^0-9]/g, '')) || project.amount || 75000;
    setInvoiceAmount(numericBudget);
    setInvoiceEmail(project.clientEmail || "");
    setInvoiceDescription(`${project.name} — Full-Stack Deliverable Milestone`);
    setInvoiceDueDate(new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0]);
  };

  // Submit Invoice Generation with the user-specified custom amount
  const handleCreateInvoiceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!invoiceModalProject) return;

    const numAmount = Number(invoiceAmount);
    if (!numAmount || numAmount <= 0) {
      alert("Please enter a valid invoice amount greater than 0.");
      return;
    }

    const emailToBill = invoiceEmail.trim();
    if (!emailToBill || !emailToBill.includes("@")) {
      alert("Please enter a valid client billing email address.");
      return;
    }

    setBillingInvoice(true);
    try {
      const res = await fetch("/api/invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId: invoiceModalProject.id,
          projectName: invoiceModalProject.name,
          clientName: invoiceModalProject.clientName || invoiceModalProject.clientCompany || "Valued Client",
          clientEmail: emailToBill,
          clientCompany: invoiceModalProject.clientCompany || "",
          items: [
            {
              description: invoiceDescription.trim() || `${invoiceModalProject.name} — Deliverable Milestone`,
              quantity: 1,
              unitPrice: numAmount,
              amount: numAmount,
            }
          ],
          subtotal: numAmount,
          total: numAmount,
          dueDate: invoiceDueDate || new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to generate invoice");

      setNotification(`✓ Invoice ${data.invoice.invoiceNumber} for ₹${numAmount.toLocaleString('en-IN')} generated and dispatched to ${emailToBill}!`);
      setInvoiceModalProject(null);
      fetchProjects();
    } catch (err: any) {
      alert(err.message || "Failed to create invoice");
    } finally {
      setBillingInvoice(false);
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    try {
      const res = await fetch(`/api/projects/${id}`, { method: "DELETE" });
      if (res.ok) {
        setNotification("Project deleted.");
        fetchProjects();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filtered = projects.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.clientName?.toLowerCase().includes(search.toLowerCase()) ||
    p.projectId.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-yellow-400 block mb-1">
            Client Portfolio & Deliverables
          </span>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Project Management</h1>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-5 py-2.5 rounded-full bg-yellow-400 text-black font-bold text-xs uppercase tracking-wider hover:bg-yellow-300 transition-colors flex items-center gap-2 cursor-pointer shadow-sm self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[3]" /> Add New Project
        </button>
      </div>

      {/* Notification Banner */}
      {notification && (
        <div className="p-4 rounded-xl bg-yellow-400/10 border border-yellow-400/30 text-yellow-300 text-xs font-mono flex items-center justify-between">
          <span>{notification}</span>
          <button onClick={() => setNotification("")} className="text-yellow-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Filter by title, client, or ID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-zinc-950 border border-zinc-800 rounded-full py-2 pl-10 pr-4 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-yellow-400"
        />
      </div>

      {/* Projects Table / Cards */}
      <div className="rounded-3xl bg-zinc-950 border border-zinc-800 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs font-mono text-zinc-500">Loading project database...</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-xs font-mono text-zinc-500">No matching projects found.</div>
        ) : (
          <div className="divide-y divide-zinc-900">
            {filtered.map((proj) => (
              <div key={proj.id} className="p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-6 hover:bg-zinc-900/30 transition-colors">
                <div className="flex items-start gap-4">
                  <div className="relative w-20 h-14 rounded-lg overflow-hidden bg-zinc-900 flex-shrink-0 border border-zinc-800 hidden sm:flex items-center justify-center">
                    <img
                      src={proj.coverImage || "/graphic-design/graphic-work-1-1.jpg"}
                      alt={proj.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "/graphic-design/graphic-work-1-1.jpg";
                      }}
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-white">{proj.name}</span>
                      <span className="text-xs font-mono text-zinc-500">({proj.projectId})</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider bg-yellow-400/10 text-yellow-400 border border-yellow-400/20">
                        {proj.status.replace("_", " ")}
                      </span>
                    </div>
                    <span className="text-xs text-zinc-400">
                      Client: <strong className="text-zinc-200">{proj.clientCompany || proj.clientName}</strong> ({proj.clientEmail})
                    </span>
                    <span className="text-[11px] font-mono text-zinc-500">
                      Service: {proj.serviceName} | Budget: {proj.budget || `₹${(proj.amount || 0).toLocaleString('en-IN')}`} | Due: {proj.expectedDelivery}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {/* Status Dropdown */}
                  <select
                    value={proj.status}
                    onChange={(e) => handleUpdateStatus(proj.id, e.target.value as ProjectStatus)}
                    className="bg-zinc-900 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs text-zinc-300 font-mono focus:outline-none focus:border-yellow-400"
                  >
                    <option value="ENQUIRY">ENQUIRY</option>
                    <option value="IN_PROGRESS">IN_PROGRESS</option>
                    <option value="CLIENT_REVIEW">CLIENT_REVIEW</option>
                    <option value="APPROVED">APPROVED</option>
                    <option value="PAID">PAID</option>
                    <option value="COMPLETED">COMPLETED</option>
                  </select>

                  {/* Send for Review / Verification */}
                  <button
                    onClick={() => openReviewModal(proj)}
                    className="px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs font-mono text-zinc-300 hover:text-yellow-400 hover:border-yellow-400/60 transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
                    title={proj.clientEmail ? `Send review invitation to ${proj.clientEmail}` : "Enter client email & send review invite"}
                  >
                    <Send className="w-3 h-3 text-yellow-400" />
                    <span>Send for Review</span>
                  </button>

                  {/* Generate / Bill Invoice */}
                  <button
                    onClick={() => openInvoiceModal(proj)}
                    className="px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs font-mono text-zinc-300 hover:text-emerald-400 hover:border-emerald-500/60 transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
                    title="Specify invoice amount & generate bill invoice"
                  >
                    <Receipt className="w-3 h-3 text-emerald-400" />
                    <span>Bill Invoice</span>
                  </button>

                  {/* Delete */}
                  <button
                    onClick={() => handleDeleteProject(proj.id)}
                    className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-500 hover:text-red-400 transition-colors cursor-pointer"
                    title="Delete Project"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Project Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="max-w-xl w-full bg-zinc-950 border border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col gap-6 my-8">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-white">Add Commissioned Project</h3>
              <button onClick={() => setShowAddModal(false)} className="text-zinc-500 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProject} className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] font-mono text-zinc-400 uppercase">Project Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Apex Luxury Real Estate"
                    value={newProject.name}
                    onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                    className="bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-yellow-400"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] font-mono text-zinc-400 uppercase">Slug / Identifier</label>
                  <input
                    type="text"
                    placeholder="apex-luxury"
                    value={newProject.slug}
                    onChange={(e) => setNewProject({ ...newProject, slug: e.target.value })}
                    className="bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-yellow-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] font-mono text-zinc-400 uppercase">Client Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="Jane Doe"
                    value={newProject.clientName}
                    onChange={(e) => setNewProject({ ...newProject, clientName: e.target.value })}
                    className="bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-yellow-400"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] font-mono text-zinc-400 uppercase">Client Email *</label>
                  <input
                    type="email"
                    required
                    placeholder="jane@client.com"
                    value={newProject.clientEmail}
                    onChange={(e) => setNewProject({ ...newProject, clientEmail: e.target.value })}
                    className="bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-yellow-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] font-mono text-zinc-400 uppercase">Client Entity / Company</label>
                  <input
                    type="text"
                    placeholder="Apex Group"
                    value={newProject.clientCompany}
                    onChange={(e) => setNewProject({ ...newProject, clientCompany: e.target.value })}
                    className="bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-yellow-400"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] font-mono text-zinc-400 uppercase">Service Pillar</label>
                  <select
                    value={newProject.serviceName}
                    onChange={(e) => setNewProject({ ...newProject, serviceName: e.target.value, category: e.target.value })}
                    className="bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-yellow-400"
                  >
                    <option value="Web Development">Web Development</option>
                    <option value="Brand Identity">Brand Identity</option>
                    <option value="AI Agents & Automation">AI Agents & Automation</option>
                    <option value="Graphic Design">Graphic Design</option>
                    <option value="Digital Marketing">Digital Marketing</option>
                    <option value="App Development & CRM">App Development & CRM</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] font-mono text-zinc-400 uppercase">Budget Allocation</label>
                  <input
                    type="text"
                    placeholder="₹75,000"
                    value={newProject.budget}
                    onChange={(e) => setNewProject({ ...newProject, budget: e.target.value })}
                    className="bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-yellow-400"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] font-mono text-zinc-400 uppercase">Staging / Live URL</label>
                  <input
                    type="text"
                    placeholder="https://staging.client.com"
                    value={newProject.liveUrl}
                    onChange={(e) => setNewProject({ ...newProject, liveUrl: e.target.value })}
                    className="bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-yellow-400"
                  />
                </div>
              </div>

              {/* Cover Image Upload */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-mono text-zinc-400 uppercase">Cover Image (Instant Base64 Upload OR URL)</label>
                <div className="flex items-center gap-3 bg-zinc-900/60 border border-zinc-800 p-2.5 rounded-xl">
                  <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-zinc-900 border border-zinc-700 shrink-0 flex items-center justify-center">
                    <img
                      src={newProject.coverImage || "/graphic-design/graphic-work-1-1.jpg"}
                      alt="Cover Preview"
                      className="w-full h-full object-cover rounded-lg"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "/graphic-design/graphic-work-1-1.jpg";
                      }}
                    />
                  </div>
                  <div className="flex-1 flex flex-col gap-1.5">
                    <div className="flex items-center gap-2">
                      <label className="px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white text-[10px] font-mono cursor-pointer border border-zinc-700 transition-colors flex items-center gap-1.5">
                        <Plus className="w-3 h-3 text-yellow-400" />
                        {uploadingCover ? "Processing..." : "Upload Image"}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleUploadCover}
                          disabled={uploadingCover}
                          className="hidden"
                        />
                      </label>
                      {uploadingCover && <Loader2 className="w-3 h-3 animate-spin text-yellow-400" />}
                      {uploadStatus && (
                        <span className="text-[10px] font-mono text-yellow-400/90 truncate max-w-[160px]">
                          {uploadStatus}
                        </span>
                      )}
                    </div>
                    <input
                      type="text"
                      placeholder="Or enter image URL (e.g. /graphic-design/graphic-work-1-1.jpg)"
                      value={newProject.coverImage}
                      onChange={(e) => setNewProject({ ...newProject, coverImage: e.target.value })}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-2.5 py-1 text-[11px] text-zinc-300 font-mono focus:outline-none focus:border-yellow-400"
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-mono text-zinc-400 uppercase">Overview / Description</label>
                <textarea
                  rows={2}
                  placeholder="Architectural overview of this commission..."
                  value={newProject.description}
                  onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                  className="bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-yellow-400 resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-full text-xs font-mono text-zinc-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full bg-yellow-400 text-black font-bold text-xs uppercase tracking-wider hover:bg-yellow-300 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 stroke-[3]" /> Add Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Send Review Modal */}
      {reviewModalProject && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="max-w-md w-full bg-zinc-950 border border-zinc-800 rounded-3xl p-6 sm:p-7 shadow-2xl flex flex-col gap-5 my-8">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-yellow-400/10 border border-yellow-400/25 flex items-center justify-center text-yellow-400 shrink-0">
                  <Send className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white tracking-tight">Send for Client Review</h3>
                  <p className="text-xs text-zinc-400 font-mono">Dispatches verification email to client</p>
                </div>
              </div>
              <button 
                onClick={() => setReviewModalProject(null)} 
                className="text-zinc-500 hover:text-white p-1 rounded-lg hover:bg-zinc-900 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Project Summary Box */}
            <div className="p-3.5 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 flex flex-col gap-1.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white text-sm">{reviewModalProject.name}</span>
                <span className="font-mono text-[10px] text-zinc-500">{reviewModalProject.projectId}</span>
              </div>
              <span className="text-zinc-400">
                Client: <strong className="text-zinc-200">{reviewModalProject.clientCompany || reviewModalProject.clientName}</strong>
              </span>
              <div className="flex items-center gap-2 mt-1 text-[11px] font-mono text-yellow-400/90 bg-yellow-400/5 px-2.5 py-1 rounded-lg border border-yellow-400/10">
                <span>Staging Portal:</span>
                <span className="text-zinc-300 truncate">/work/{reviewModalProject.slug || reviewModalProject.id}</span>
              </div>
            </div>

            {reviewSuccessInfo ? (
              <div className="flex flex-col gap-4 py-2">
                <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Review Invitation Dispatched & Logged</span>
                  </div>
                  <p className="text-xs text-zinc-300">
                    The review notice and project portal instructions have been recorded and emailed to:
                  </p>
                  <span className="font-mono text-xs text-yellow-400 bg-black/40 px-2.5 py-1 rounded border border-yellow-400/20 break-all">
                    {reviewSuccessInfo.email}
                  </span>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-mono text-zinc-400 uppercase">
                    Client Verification Portal URL
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      readOnly
                      value={reviewSuccessInfo.reviewUrl}
                      className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs font-mono text-zinc-300 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(reviewSuccessInfo.reviewUrl);
                        setCopiedLink(true);
                        setTimeout(() => setCopiedLink(false), 2000);
                      }}
                      className="px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs font-mono text-zinc-300 hover:text-yellow-400 hover:border-yellow-400 transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedLink ? "Copied" : "Copy"}</span>
                    </button>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3 pt-3">
                  <a
                    href={reviewSuccessInfo.mailtoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:flex-1 py-2.5 px-4 rounded-full bg-zinc-900 border border-zinc-800 hover:border-yellow-400 text-zinc-200 hover:text-yellow-400 text-xs font-mono font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Open in Email Client</span>
                  </a>
                  <button
                    type="button"
                    onClick={() => setReviewModalProject(null)}
                    className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-yellow-400 text-black font-bold text-xs uppercase tracking-wider hover:bg-yellow-300 transition-colors cursor-pointer"
                  >
                    Done
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSendReviewSubmit} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-mono text-zinc-400 uppercase flex items-center justify-between">
                    <span>Client Email Address *</span>
                    <span className="text-yellow-400 lowercase text-[10px]">Will dispatch invite here</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      placeholder="client@company.com"
                      value={reviewEmail}
                      onChange={(e) => setReviewEmail(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-2.5 pl-10 pr-3.5 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-yellow-400"
                    />
                  </div>
                  {!reviewEmail && (
                    <span className="text-[10px] font-mono text-red-400">Please provide a valid client email</span>
                  )}
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-mono text-zinc-400 uppercase">
                    Custom Admin Note / Message (Optional)
                  </label>
                  <textarea
                    rows={3}
                    placeholder="e.g. Hi team, please verify the staging deployment and submit your feedback."
                    value={reviewNote}
                    onChange={(e) => setReviewNote(e.target.value)}
                    className="bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-yellow-400 resize-none font-sans"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setReviewModalProject(null)}
                    className="px-4 py-2 rounded-full text-xs font-mono text-zinc-400 hover:text-white cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={sendingReview}
                    className="px-5 py-2.5 rounded-full bg-yellow-400 text-black font-bold text-xs uppercase tracking-wider hover:bg-yellow-300 transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {sendingReview ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Sending Email...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>Send Review Invite</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Bill Invoice Modal (Allows Admin to freely set & change amount) */}
      {invoiceModalProject && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="max-w-md w-full bg-zinc-950 border border-zinc-800 rounded-3xl p-6 sm:p-7 shadow-2xl flex flex-col gap-5 my-8">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-emerald-400 shrink-0">
                  <Receipt className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white tracking-tight">Generate & Bill Invoice</h3>
                  <p className="text-xs text-zinc-400 font-mono">Set custom invoice amount for project</p>
                </div>
              </div>
              <button 
                onClick={() => setInvoiceModalProject(null)} 
                className="text-zinc-500 hover:text-white p-1 rounded-lg hover:bg-zinc-900 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Project Details Pill */}
            <div className="p-3.5 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 flex flex-col gap-1 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white">{invoiceModalProject.name}</span>
                <span className="font-mono text-[10px] text-zinc-500">{invoiceModalProject.projectId}</span>
              </div>
              <span className="text-zinc-400">
                Client: <strong className="text-zinc-200">{invoiceModalProject.clientCompany || invoiceModalProject.clientName}</strong>
              </span>
              <span className="text-[11px] font-mono text-zinc-500">
                Budget Allocation: {invoiceModalProject.budget || `₹${(invoiceModalProject.amount || 0).toLocaleString('en-IN')}`}
              </span>
            </div>

            <form onSubmit={handleCreateInvoiceSubmit} className="flex flex-col gap-4">
              {/* Customizable Amount Input */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-mono text-emerald-400 uppercase font-bold flex items-center justify-between">
                  <span>Invoice Amount (₹) *</span>
                  <span className="text-zinc-400 text-[10px] lowercase font-normal">Change amount freely</span>
                </label>
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-emerald-400 font-bold text-sm">
                    ₹
                  </div>
                  <input
                    type="number"
                    min="1"
                    step="1"
                    required
                    placeholder="75000"
                    value={invoiceAmount}
                    onChange={(e) => setInvoiceAmount(e.target.value)}
                    className="w-full bg-zinc-900 border border-emerald-500/40 rounded-xl py-2.5 pl-9 pr-4 text-base font-bold text-white placeholder:text-zinc-600 focus:outline-none focus:border-emerald-400"
                  />
                </div>
                <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400 px-1">
                  <span>Formatted Total:</span>
                  <span className="text-emerald-400 font-bold">
                    ₹{Number(invoiceAmount || 0).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Client Email for Invoice */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-mono text-zinc-400 uppercase">
                  Client Billing Email *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    placeholder="client@company.com"
                    value={invoiceEmail}
                    onChange={(e) => setInvoiceEmail(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-2 pl-10 pr-3.5 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-yellow-400"
                  />
                </div>
              </div>

              {/* Milestone Description */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-mono text-zinc-400 uppercase">
                  Milestone Deliverable Description
                </label>
                <input
                  type="text"
                  required
                  placeholder="Deliverable Milestone & Development"
                  value={invoiceDescription}
                  onChange={(e) => setInvoiceDescription(e.target.value)}
                  className="bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-yellow-400 font-sans"
                />
              </div>

              {/* Due Date */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-mono text-zinc-400 uppercase">
                  Payment Due Date
                </label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="date"
                    required
                    value={invoiceDueDate}
                    onChange={(e) => setInvoiceDueDate(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-2 pl-10 pr-3.5 text-xs text-white focus:outline-none focus:border-yellow-400 font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setInvoiceModalProject(null)}
                  className="px-4 py-2 rounded-full text-xs font-mono text-zinc-400 hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={billingInvoice}
                  className="px-5 py-2.5 rounded-full bg-emerald-500 text-black font-bold text-xs uppercase tracking-wider hover:bg-emerald-400 transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {billingInvoice ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Generating Invoice...</span>
                    </>
                  ) : (
                    <>
                      <Receipt className="w-3.5 h-3.5" />
                      <span>Issue Invoice (₹{Number(invoiceAmount || 0).toLocaleString('en-IN')})</span>
                    </>
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
