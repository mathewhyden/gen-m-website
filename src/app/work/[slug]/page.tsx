"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Project } from "@/lib/types";
import { 
  ArrowLeft, 
  ExternalLink, 
  Calendar, 
  CheckCircle2, 
  Layers, 
  ShieldCheck, 
  Sparkles,
  ArrowRight,
  UserCheck
} from "lucide-react";

export default function CaseStudyPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    fetch(`/api/projects/${slug}`)
      .then(res => res.json())
      .then(data => {
        if (data.project) setProject(data.project);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="bg-black min-h-screen text-white flex items-center justify-center font-mono text-sm">
        Loading case study...
      </div>
    );
  }

  if (!project) {
    return (
      <div className="bg-black min-h-screen text-white flex flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold">Project Not Found</h1>
        <Link href="/work" className="text-yellow-400 text-sm flex items-center gap-1">
          <ArrowLeft className="w-4 h-4" /> Back to all projects
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-black min-h-screen text-white font-sans relative flex flex-col w-full selection:bg-yellow-400 selection:text-black">
      <Navbar />

      <main className="flex-grow w-full relative z-10 pt-32 pb-24 px-6 md:px-12 max-w-6xl mx-auto flex flex-col gap-16">
        {/* Back navigation */}
        <div>
          <Link
            href="/work"
            className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-zinc-400 hover:text-yellow-400 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Portfolio
          </Link>
        </div>

        {/* Hero Header */}
        <section className="flex flex-col gap-6">
          <div className="flex flex-wrap items-center gap-3">
            <span className="px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-yellow-400/10 text-yellow-400 border border-yellow-400/20">
              {project.category || project.serviceName}
            </span>
            <span className="text-xs font-mono text-zinc-500">
              Project ID: {project.projectId}
            </span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
            {project.name}
          </h1>

          <p className="text-lg md:text-xl text-zinc-300 max-w-3xl leading-relaxed">
            {project.longDescription || project.description}
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-6 rounded-2xl bg-zinc-950 border border-zinc-900 mt-2">
            <div>
              <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-500 block mb-1">Client Partner</span>
              <span className="text-sm font-bold text-white">{project.clientCompany || project.clientName}</span>
            </div>
            <div>
              <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-500 block mb-1">Service Matrix</span>
              <span className="text-sm font-bold text-white">{project.serviceName}</span>
            </div>
            <div>
              <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-500 block mb-1">Timeline</span>
              <span className="text-sm font-bold text-white">{project.startDate} — {project.expectedDelivery}</span>
            </div>
            <div>
              <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-500 block mb-1">Status</span>
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-yellow-400 font-mono">
                <CheckCircle2 className="w-3.5 h-3.5" /> {project.status}
              </span>
            </div>
          </div>
        </section>

        {/* Featured Cover / Live Demo */}
        <section className="relative aspect-video w-full rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-900 group">
          <Image
            src={project.coverImage}
            alt={project.name}
            fill
            className="object-cover"
            priority
          />
          {project.liveUrl && (
            <div className="absolute bottom-6 right-6 z-20">
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 rounded-full bg-yellow-400 text-black font-bold text-xs uppercase tracking-wider hover:bg-yellow-300 transition-all flex items-center gap-2 shadow-lg"
              >
                Visit Live Site <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          )}
        </section>

        {/* Architecture & Tech Stack */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 flex flex-col gap-6">
            <h2 className="text-2xl font-bold text-white">Engineering Overview & Architecture</h2>
            <p className="text-zinc-400 leading-relaxed text-sm md:text-base">
              The project was built to solve complex customer discovery and performance requirements. Utilizing zero-runtime overhead styling, lightning-fast edge routing, and responsive micro-interactions, the platform achieves sub-second initial contentful paint benchmarks.
            </p>

            {project.gallery && project.gallery.length > 1 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                {project.gallery.slice(1).map((img, idx) => (
                  <div key={idx} className="relative aspect-video rounded-xl overflow-hidden border border-zinc-900 bg-zinc-950">
                    <Image src={img} alt={`Gallery ${idx}`} fill className="object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-6 p-6 rounded-2xl bg-zinc-950 border border-zinc-900 h-fit">
            <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-yellow-400">
              Technology Stack
            </h3>
            <div className="flex flex-wrap gap-2">
              {project.technologies.map((t, idx) => (
                <span key={idx} className="px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs font-mono text-zinc-300">
                  {t}
                </span>
              ))}
            </div>

            <div className="pt-6 border-t border-zinc-900 flex flex-col gap-3">
              <span className="text-xs font-mono text-zinc-500 uppercase">Verification & Quality</span>
              <div className="flex items-center gap-2 text-xs text-zinc-300">
                <ShieldCheck className="w-4 h-4 text-yellow-400" />
                <span>100% Client Approved via Gen-M Portal</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-zinc-300">
                <Sparkles className="w-4 h-4 text-yellow-400" />
                <span>Engineered by Gen-M Product Team</span>
              </div>
            </div>
          </div>
        </section>

        {/* Milestones Achieved */}
        {project.milestones && project.milestones.length > 0 && (
          <section className="flex flex-col gap-6 pt-6 border-t border-zinc-900">
            <h2 className="text-2xl font-bold text-white">Project Milestones</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {project.milestones.map((m, idx) => (
                <div key={m.id || idx} className="p-5 rounded-xl bg-zinc-950 border border-zinc-900 flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-yellow-400 font-bold">Phase {idx + 1}</span>
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {m.status}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-white">{m.title}</h4>
                  <p className="text-xs text-zinc-400 leading-relaxed">{m.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Bottom CTA */}
        <section className="p-8 md:p-12 rounded-3xl bg-zinc-950 border border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-2xl font-bold text-white mb-1">Commission a similar platform</h3>
            <p className="text-sm text-zinc-400">Initiate your requirements or schedule a consultation with our team.</p>
          </div>
          <Link
            href={`/start-project?service=${encodeURIComponent(project.serviceName)}`}
            className="px-6 py-3 rounded-full bg-yellow-400 text-black font-bold text-xs uppercase tracking-wider hover:bg-yellow-300 transition-colors flex items-center gap-2 flex-shrink-0"
          >
            Start Your Project <ArrowRight className="w-4 h-4" />
          </Link>
        </section>
      </main>

      <Footer />
    </div>
  );
}
