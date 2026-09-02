"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, ExternalLink, Globe } from "lucide-react";
import Image from "next/image";

interface WebProject {
  id: string;
  title: string;
  category: string;
  description: string;
  link: string;
  image: string;
}

const webProjects: WebProject[] = [
  {
    id: "hebe-art",
    title: "Hebe Art Studio",
    category: "Web Development / Art Portfolio",
    description: "Bespoke digital gallery and portfolio platform created for Hebe Art Studio.",
    link: "https://hebeartstudio.netlify.app/portfolio",
    image: "/graphic-design/graphic-work-1-1.jpg",
  },
  {
    id: "cs-marcom",
    title: "CS Marcom",
    category: "Web Development / Marketing Agency",
    description: "Modern corporate website and brand identity platform for CS Marcom.",
    link: "https://csmarcom.pages.dev/",
    image: "/graphic-design/graphic-work-18-1.jpg",
  },
  {
    id: "cosmo-arts",
    title: "Cosmo Arts",
    category: "Web Development / Fine Arts",
    description: "Creative media, visual art studio showcase, and fine arts digital experience.",
    link: "https://cosmoarts.pages.dev/",
    image: "/graphic-design/graphic-work-10-1.jpg",
  },
  {
    id: "gospel-ministry",
    title: "Gospel Ministry Birthday Care",
    category: "Web Development / Community Portal",
    description: "Interactive community engagement and member care portal for Believers Ministry.",
    link: "https://gospel-ministry-believers-birthday-care.ai.studio/",
    image: "/graphic-design/graphic-work-11-1.jpg",
  },
];

export default function Work() {
  return (
    <section id="work" className="relative py-24 md:py-32 bg-black z-10 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 md:mb-20 gap-6">
          <div className="max-w-xl">
            <span className="text-xs font-bold uppercase tracking-widest text-yellow-400 flex items-center gap-2">
              <Globe className="w-4 h-4" /> Live Web Applications
            </span>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight text-yellow-400 mt-3 leading-tight uppercase">
              Web Development Showcase
            </h2>
          </div>
          <p className="text-base md:text-lg text-white max-w-md font-normal leading-relaxed">
            High-performance custom web applications, responsive digital platforms, and Next.js enterprise solutions.
          </p>
        </div>

        {/* Web Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
          {webProjects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="bg-zinc-950 border border-zinc-800 hover:border-yellow-400/50 rounded-2xl p-6 flex flex-col justify-between group transition-all duration-300"
            >
              {/* Image Container */}
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="aspect-[16/10] rounded-xl overflow-hidden bg-black border border-zinc-800 relative group-hover:border-yellow-400/40 transition-colors block"
              >
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {/* Badge */}
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 rounded-full bg-black/80 backdrop-blur-md border border-yellow-400/40 text-yellow-400 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5" /> Live Website
                  </span>
                </div>

                {/* Hover Overlay Button */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <span className="px-5 py-2.5 rounded-full bg-yellow-400 text-black font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg">
                    Visit Live Site <ExternalLink className="w-4 h-4" />
                  </span>
                </div>
              </a>

              {/* Details Footer */}
              <div className="mt-6 flex justify-between items-start gap-4">
                <div>
                  <span className="text-xs font-mono text-yellow-400 font-bold uppercase tracking-wider">
                    {project.category}
                  </span>
                  <h3 className="text-2xl font-bold text-white mt-1 uppercase group-hover:text-yellow-400 transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-sm text-white font-normal mt-2 leading-relaxed">
                    {project.description}
                  </p>
                </div>

                {/* Action Link Button */}
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-yellow-400 text-black flex items-center justify-center hover:bg-yellow-300 transition-colors shrink-0 mt-1"
                  aria-label={`Visit ${project.title}`}
                >
                  <ArrowUpRight className="w-5 h-5 stroke-[2.5]" />
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
