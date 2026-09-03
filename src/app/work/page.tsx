"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Project } from "@/lib/types";
import { 
  Globe, 
  ExternalLink, 
  ArrowUpRight, 
  Search, 
  FolderGit2,
  Image as ImageIcon,
  ZoomIn,
  X
} from "lucide-react";

interface GraphicWork {
  id: number;
  title: string;
  category: string;
  image: string;
  description?: string;
}

const graphicDesignItems: GraphicWork[] = [
  {
    id: 1,
    title: "Brand Strategy & Corporate Brochure",
    category: "Brochure & Editorial",
    image: "/graphic-design/graphic-work-18-1.jpg",
    description: "Professional multi-page business brochure and marketing overview."
  },
  {
    id: 2,
    title: "Event & Campaign Promotional Flyer",
    category: "Flyers & Posters",
    image: "/graphic-design/graphic-work-1-1.jpg",
    description: "Creative promotional poster for community campaigns and special events."
  },
  {
    id: 3,
    title: "Luxury Visual Identity & Art Direction",
    category: "Brand Collateral",
    image: "/graphic-design/graphic-work-10-1.jpg",
    description: "High-contrast visual design system and creative layout identity."
  },
  {
    id: 4,
    title: "Social Media Campaign Visuals",
    category: "Digital Marketing Graphics",
    image: "/graphic-design/graphic-work-11-1.jpg",
    description: "Engaging social media post designs crafted for audience reach."
  },
  {
    id: 5,
    title: "Corporate Identity Layout",
    category: "Brand Collateral",
    image: "/graphic-design/graphic-work-2-1.jpg",
    description: "Clean stationery, corporate cards, and brand presentation graphics."
  },
  {
    id: 6,
    title: "Marketing & Promotional Media",
    category: "Advertising Design",
    image: "/graphic-design/graphic-work-4-1.jpg",
    description: "Digital banners, advertising posters, and brand marketing creatives."
  },
];

export default function OurWorkPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedTab, setSelectedTab] = useState<"all" | "web" | "graphic">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedGraphicImage, setSelectedGraphicImage] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/projects')
      .then(res => res.json())
      .then(data => {
        if (data.projects) {
          setProjects(data.projects);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filteredWebProjects = React.useMemo(() => {
    let result = projects;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        p => p.name.toLowerCase().includes(q) ||
             p.description.toLowerCase().includes(q) ||
             p.technologies.some(t => t.toLowerCase().includes(q))
      );
    }
    return result;
  }, [searchQuery, projects]);

  const filteredGraphicWorks = React.useMemo(() => {
    let result = graphicDesignItems;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        g => g.title.toLowerCase().includes(q) ||
             g.category.toLowerCase().includes(q)
      );
    }
    return result;
  }, [searchQuery]);

  return (
    <div className="bg-black min-h-screen text-white font-sans relative flex flex-col w-full selection:bg-yellow-400 selection:text-black">
      <Navbar />

      <main className="flex-grow w-full relative z-10 pt-32 pb-24 px-6 md:px-12 max-w-7xl mx-auto flex flex-col gap-12">
        {/* Header */}
        <section className="flex flex-col items-start max-w-3xl pt-8">
          <span className="text-xs font-mono uppercase tracking-widest text-yellow-400 mb-2">
            Portfolio & Projects
          </span>
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight uppercase leading-[1.08] mb-4 text-white">
            Our <span className="text-yellow-400">Work</span>
          </h1>
          <p className="text-base sm:text-lg text-zinc-300 leading-relaxed font-normal">
            Browse our client websites, custom web applications, and creative graphic design projects.
          </p>
        </section>

        {/* Filter Tabs & Search */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 border-b border-zinc-900 pb-6">
          {/* Main Category Tabs */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setSelectedTab("all")}
              className={`px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                selectedTab === "all"
                  ? "bg-yellow-400 text-black shadow-sm"
                  : "bg-zinc-950 text-zinc-400 hover:text-white border border-zinc-800"
              }`}
            >
              All Work
            </button>
            <button
              onClick={() => setSelectedTab("web")}
              className={`px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer flex items-center gap-1.5 ${
                selectedTab === "web"
                  ? "bg-yellow-400 text-black shadow-sm"
                  : "bg-zinc-950 text-zinc-400 hover:text-white border border-zinc-800"
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              Web Development ({filteredWebProjects.length})
            </button>
            <button
              onClick={() => setSelectedTab("graphic")}
              className={`px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer flex items-center gap-1.5 ${
                selectedTab === "graphic"
                  ? "bg-yellow-400 text-black shadow-sm"
                  : "bg-zinc-950 text-zinc-400 hover:text-white border border-zinc-800"
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5" />
              Graphic Design ({filteredGraphicWorks.length})
            </button>
          </div>

          {/* Search Box */}
          <div className="relative min-w-[260px]">
            <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search projects or designs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-full py-2.5 pl-10 pr-4 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-yellow-400 transition-colors"
            />
          </div>
        </div>

        {/* Section 1: Web Development Projects */}
        {(selectedTab === "all" || selectedTab === "web") && (
          <section className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-yellow-400">
                  Web Development
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold text-white mt-1">
                  Live Websites & Platforms
                </h2>
              </div>
            </div>

            {loading ? (
              <div className="py-16 text-center text-zinc-500 font-mono text-sm">
                Loading projects...
              </div>
            ) : filteredWebProjects.length === 0 ? (
              <div className="py-12 text-center flex flex-col items-center gap-3">
                <FolderGit2 className="w-10 h-10 text-zinc-700" />
                <p className="text-zinc-400 text-sm">No website projects match your search.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {filteredWebProjects.map((project) => (
                  <div
                    key={project.id}
                    className="group flex flex-col rounded-2xl bg-zinc-950 border border-zinc-800 hover:border-yellow-400/60 overflow-hidden transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-xl hover:shadow-yellow-400/5"
                  >
                    {/* Image Container with link */}
                    <a
                      href={project.liveUrl || "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="relative aspect-video w-full overflow-hidden bg-zinc-900 block"
                    >
                      <Image
                        src={project.coverImage}
                        alt={project.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent opacity-80" />
                      
                      <div className="absolute top-4 left-4">
                        <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-black/80 backdrop-blur-md text-yellow-400 border border-yellow-400/30">
                          {project.category || "Web Development"}
                        </span>
                      </div>

                      {project.liveUrl && (
                        <div className="absolute top-4 right-4 p-2 rounded-full bg-black/80 backdrop-blur-md text-zinc-300 group-hover:text-yellow-400 border border-zinc-700 group-hover:border-yellow-400 transition-colors">
                          <ExternalLink className="w-4 h-4" />
                        </div>
                      )}

                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <span className="px-4 py-2 rounded-full bg-yellow-400 text-black font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-md">
                          Open Live Website <ExternalLink className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </a>

                    {/* Content Details */}
                    <div className="p-6 md:p-7 flex flex-col justify-between flex-grow gap-5">
                      <div>
                        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-yellow-400 transition-colors duration-300">
                          {project.name}
                        </h3>
                        <p className="text-sm text-zinc-300 leading-relaxed font-normal">
                          {project.description}
                        </p>
                      </div>

                      <div className="flex flex-col gap-4">
                        <div className="flex flex-wrap gap-2">
                          {project.technologies.slice(0, 4).map((tech, idx) => (
                            <span
                              key={idx}
                              className="px-2.5 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-[11px] text-zinc-400 font-mono"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>

                        <div className="pt-4 border-t border-zinc-900 flex items-center justify-between">
                          {project.liveUrl ? (
                            <a
                              href={project.liveUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs font-bold uppercase tracking-wider text-yellow-400 hover:text-yellow-300 flex items-center gap-1.5 transition-colors duration-300"
                            >
                              Visit Website <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
                            </a>
                          ) : (
                            <span className="text-xs text-zinc-500">Live preview</span>
                          )}

                          <span className="text-xs text-zinc-500 font-mono">
                            {project.status === "COMPLETED" ? "Live & Active" : "In Progress"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* Section 2: Graphic Design Showcase */}
        {(selectedTab === "all" || selectedTab === "graphic") && (
          <section className="flex flex-col gap-6 pt-8 border-t border-zinc-900">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-yellow-400">
                Visual & Print
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mt-1">
                Graphic Design Showcase
              </h2>
              <p className="text-sm text-zinc-400 mt-1">
                Click any design to expand and view in full size.
              </p>
            </div>

            {filteredGraphicWorks.length === 0 ? (
              <div className="py-12 text-center flex flex-col items-center gap-3">
                <ImageIcon className="w-10 h-10 text-zinc-700" />
                <p className="text-zinc-400 text-sm">No graphic design works match your search.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredGraphicWorks.map((work) => (
                  <div
                    key={work.id}
                    onClick={() => setSelectedGraphicImage(work.image)}
                    className="group bg-zinc-950 border border-zinc-800 hover:border-yellow-400/60 rounded-2xl p-5 flex flex-col cursor-pointer transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-lg hover:shadow-yellow-400/5"
                  >
                    <div className="aspect-[4/3] rounded-xl overflow-hidden bg-black border border-zinc-800 relative group-hover:border-yellow-400/40 transition-colors">
                      <Image
                        src={work.image}
                        alt={work.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <span className="px-4 py-2 rounded-full bg-yellow-400 text-black font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-lg">
                          View Full Size <ZoomIn className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 flex flex-col gap-1">
                      <span className="text-[11px] font-mono text-yellow-400 font-bold uppercase tracking-wider">
                        {work.category}
                      </span>
                      <h3 className="text-base font-bold text-white group-hover:text-yellow-400 transition-colors duration-300">
                        {work.title}
                      </h3>
                      {work.description && (
                        <p className="text-xs text-zinc-400 mt-0.5">
                          {work.description}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}
      </main>

      {/* Lightbox Modal for Graphic Design */}
      <AnimatePresence>
        {selectedGraphicImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedGraphicImage(null)}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 md:p-8 cursor-pointer"
          >
            <div className="relative max-w-5xl max-h-[90vh] w-full h-full flex items-center justify-center">
              <button
                onClick={() => setSelectedGraphicImage(null)}
                className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-yellow-400 text-black flex items-center justify-center hover:bg-yellow-300 transition-colors shadow-lg cursor-pointer"
                aria-label="Close Preview"
              >
                <X className="w-6 h-6 stroke-[2.5]" />
              </button>
              <div className="relative w-full h-full">
                <Image
                  src={selectedGraphicImage}
                  alt="Graphic Design Full Preview"
                  fill
                  className="object-contain rounded-xl"
                  priority
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}
