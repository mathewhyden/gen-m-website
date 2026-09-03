"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/lib/AuthContext";
import { Project, Invoice } from "@/lib/types";
import { 
  LogOut, 
  FolderGit2, 
  Receipt, 
  ArrowUpRight, 
  CheckCircle2, 
  Clock, 
  CreditCard, 
  Sparkles,
  Layers,
  FileText
} from "lucide-react";

export default function ClientDashboardPage() {
  const router = useRouter();
  const { user, loading: authLoading, logout } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/client/login");
      return;
    }

    if (user) {
      Promise.all([
        fetch("/api/projects").then(res => res.json()),
        fetch("/api/invoices").then(res => res.json()),
      ]).then(([projData, invData]) => {
        if (projData.projects) {
          // If logged in as client, filter to client's projects or show all assigned
          const userProjs = projData.projects.filter(
            (p: Project) => p.clientEmail?.toLowerCase() === user.email.toLowerCase() || p.clientName?.toLowerCase().includes(user.name.toLowerCase())
          );
          setProjects(userProjs.length > 0 ? userProjs : projData.projects.slice(0, 2));
        }

        if (invData.invoices) {
          const userInvs = invData.invoices.filter(
            (inv: Invoice) => inv.clientEmail?.toLowerCase() === user.email.toLowerCase()
          );
          setInvoices(userInvs.length > 0 ? userInvs : invData.invoices.slice(0, 2));
        }
        setLoading(false);
      }).catch(() => setLoading(false));
    }
  }, [user, authLoading, router]);

  if (authLoading || loading) {
    return (
      <div className="bg-black min-h-screen text-white flex items-center justify-center font-mono text-sm">
        Initializing Client Portal...
      </div>
    );
  }

  const statusColor: Record<string, string> = {
    ENQUIRY: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    IN_PROGRESS: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    CLIENT_REVIEW: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    APPROVED: "bg-yellow-400/10 text-yellow-400 border-yellow-400/30",
    PAID: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    COMPLETED: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  };

  return (
    <div className="bg-black min-h-screen text-white font-sans flex flex-col selection:bg-yellow-400 selection:text-black">
      {/* Top Bar */}
      <header className="border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-1 group">
            <span className="text-2xl font-black tracking-tight text-white group-hover:text-yellow-400 transition-colors">
              GEN-
            </span>
            <div className="relative h-8 w-auto flex items-center justify-center">
              <Image
                src="/logo-crisp.png"
                alt="Gen-M Logo"
                width={32}
                height={32}
                style={{ width: "auto", height: "30px" }}
                className="object-contain"
              />
            </div>
            <span className="ml-3 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-yellow-400 text-black">
              Client Portal
            </span>
          </Link>

          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <span className="text-xs font-bold text-white block">{user?.name}</span>
              <span className="text-[11px] font-mono text-zinc-500">{user?.email}</span>
            </div>
            <button
              onClick={() => { logout(); router.push("/"); }}
              className="p-2 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 transition-colors cursor-pointer"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-10 w-full flex flex-col gap-10">
        {/* Welcome Section */}
        <section className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-8 rounded-3xl bg-zinc-950 border border-zinc-800">
          <div>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-yellow-400 block mb-1">
              Active Dashboard
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Welcome, {user?.name}
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 mt-1">
              Review live staging platforms, approve completed milestones, and track invoice payments.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/start-project"
              className="px-5 py-2.5 rounded-full bg-yellow-400 text-black font-bold text-xs uppercase tracking-wider hover:bg-yellow-300 transition-colors flex items-center gap-1.5"
            >
              Commission New Phase <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </section>

        {/* Active Projects Grid */}
        <section className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FolderGit2 className="w-5 h-5 text-yellow-400" />
              <h2 className="text-xl font-bold text-white">Your Commissioned Projects</h2>
            </div>
            <span className="text-xs font-mono text-zinc-500">{projects.length} Active Platform(s)</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.map((proj) => (
              <div
                key={proj.id}
                className="p-6 md:p-8 rounded-2xl bg-zinc-950 border border-zinc-800/80 hover:border-yellow-400/50 transition-all flex flex-col justify-between gap-6"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <span className="text-xs font-mono text-zinc-500">{proj.projectId}</span>
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider border ${statusColor[proj.status] || "bg-zinc-900 text-zinc-300"}`}>
                      {proj.status.replace("_", " ")}
                    </span>
                  </div>

                  <h3 className="text-2xl font-bold text-white mb-2">{proj.name}</h3>
                  <p className="text-xs text-zinc-400 leading-relaxed mb-4">{proj.description}</p>

                  <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800/60 flex flex-col gap-2.5">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-zinc-500">Service:</span>
                      <span className="text-zinc-200">{proj.serviceName}</span>
                    </div>
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-zinc-500">Expected Launch:</span>
                      <span className="text-zinc-200">{proj.expectedDelivery}</span>
                    </div>
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-zinc-500">Milestones Completed:</span>
                      <span className="text-yellow-400 font-bold">
                        {proj.milestones?.filter(m => m.status === 'COMPLETED').length || 0} / {proj.milestones?.length || 0}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-zinc-900">
                  <Link
                    href={`/client/project/${proj.id}`}
                    className="px-4 py-2 rounded-full bg-yellow-400 text-black font-bold text-xs uppercase tracking-wider hover:bg-yellow-300 transition-colors flex items-center gap-1.5"
                  >
                    Open Verification Portal <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                  {proj.liveUrl && (
                    <a
                      href={proj.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-zinc-400 hover:text-white transition-colors"
                    >
                      Staging URL ↗
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Invoices & Settlements */}
        <section className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Receipt className="w-5 h-5 text-yellow-400" />
              <h2 className="text-xl font-bold text-white">Invoices & Milestone Settlements</h2>
            </div>
          </div>

          <div className="rounded-2xl bg-zinc-950 border border-zinc-800 overflow-hidden">
            {invoices.length === 0 ? (
              <div className="p-8 text-center text-xs text-zinc-500 font-mono">
                No invoices issued at this time.
              </div>
            ) : (
              <div className="divide-y divide-zinc-900">
                {invoices.map((inv) => (
                  <div
                    key={inv.id}
                    className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-zinc-900/40 transition-colors"
                  >
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-mono font-bold text-white">{inv.invoiceNumber}</span>
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider border ${
                          inv.status === "PAID"
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                            : "bg-amber-500/10 text-amber-400 border-amber-500/30"
                        }`}>
                          {inv.status}
                        </span>
                      </div>
                      <span className="text-xs text-zinc-400">{inv.projectName} — {inv.items[0]?.description}</span>
                      <span className="text-[11px] font-mono text-zinc-500">Issued: {inv.issueDate} | Due: {inv.dueDate}</span>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <span className="text-lg font-mono font-bold text-white block">
                          ${(inv.totalAmount || inv.total || 0).toLocaleString()}
                        </span>
                        <span className="text-[10px] font-mono text-zinc-500">USD ({inv.currency})</span>
                      </div>

                      <Link
                        href={`/client/invoice/${inv.id}`}
                        className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-1.5 ${
                          inv.status === "PAID"
                            ? "bg-zinc-900 border border-zinc-700 text-zinc-300 hover:border-yellow-400 hover:text-white"
                            : "bg-yellow-400 text-black hover:bg-yellow-300"
                        }`}
                      >
                        {inv.status === "PAID" ? "View Receipt" : "Review & Pay"}
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
