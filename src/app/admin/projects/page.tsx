"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  FolderGit2, 
  Plus, 
  Search, 
  ExternalLink, 
  CheckCircle2, 
  Send, 
  Receipt, 
  Trash2, 
  Edit3, 
  X,
  Sparkles,
  AlertCircle
} from "lucide-react";
import { Project, ProjectStatus } from "@/lib/types";

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [notification, setNotification] = useState("");

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
        if (data.projects) setProjects(data.projects);
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

  const handleSendVerification = async (id: string) => {
    try {
      const res = await fetch(`/api/projects/${id}/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "request_review" }),
      });
      const data = await res.json();
      if (res.ok) {
        setNotification(`Verification review invite dispatched to client!`);
        fetchProjects();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleGenerateInvoice = async (project: Project) => {
    try {
      const res = await fetch("/api/invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId: project.id,
          projectName: project.name,
          clientName: project.clientName,
          clientEmail: project.clientEmail,
          clientCompany: project.clientCompany,
          items: [
            {
              description: `${project.name} — Full-Stack Deliverable Milestone`,
              quantity: 1,
              unitPrice: parseInt((project.budget || `₹${project.amount || 75000}`).replace(/[^0-9]/g, '')) || 75000,
              amount: parseInt((project.budget || `₹${project.amount || 75000}`).replace(/[^0-9]/g, '')) || 75000,
            }
          ],
          dueDate: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to generate invoice");

      setNotification(`Invoice ${data.invoice.invoiceNumber} generated!`);
    } catch (err: any) {
      alert(err.message || "Failed to create invoice");
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
            Studio Portfolio & Deliverables
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
                  <div className="relative w-20 h-14 rounded-lg overflow-hidden bg-zinc-900 flex-shrink-0 border border-zinc-800 hidden sm:block">
                    <Image src={proj.coverImage} alt={proj.name} fill className="object-cover" />
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

                  {/* Send for Verification */}
                  <button
                    onClick={() => handleSendVerification(proj.id)}
                    className="px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs font-mono text-zinc-300 hover:text-yellow-400 hover:border-yellow-400/60 transition-colors flex items-center gap-1 cursor-pointer"
                    title="Notify client to review staged deliverable"
                  >
                    <Send className="w-3 h-3" />
                    <span>Send for Review</span>
                  </button>

                  {/* Generate Invoice */}
                  <button
                    onClick={() => handleGenerateInvoice(proj)}
                    className="px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs font-mono text-zinc-300 hover:text-emerald-400 hover:border-emerald-500/60 transition-colors flex items-center gap-1 cursor-pointer"
                    title="Generate billing invoice"
                  >
                    <Receipt className="w-3 h-3" />
                    <span>Bill Invoice</span>
                  </button>

                  {/* View Portal Link */}
                  <Link
                    href={`/client/project/${proj.id}`}
                    target="_blank"
                    className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition-colors"
                    title="Open Client Verification Portal"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>

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
    </div>
  );
}
