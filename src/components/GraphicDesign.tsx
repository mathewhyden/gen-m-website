"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Image as ImageIcon, X, ZoomIn } from "lucide-react";
import Image from "next/image";

const graphicWorks = [
  {
    id: 1,
    title: "Brand Strategy & Corporate Brochure",
    category: "Brochure & Editorial",
    image: "/graphic-design/graphic-work-18-1.jpg",
  },
  {
    id: 2,
    title: "Event & Campaign Promotional Flyer",
    category: "Flyers & Posters",
    image: "/graphic-design/graphic-work-1-1.jpg",
  },
  {
    id: 3,
    title: "Luxury Visual Identity & Art Direction",
    category: "Brand Collateral",
    image: "/graphic-design/graphic-work-10-1.jpg",
  },
  {
    id: 4,
    title: "Social Media Campaign Visuals",
    category: "Digital Marketing Graphics",
    image: "/graphic-design/graphic-work-11-1.jpg",
  },
  {
    id: 5,
    title: "Corporate Identity Layout",
    category: "Brand Collateral",
    image: "/graphic-design/graphic-work-2-1.jpg",
  },
  {
    id: 6,
    title: "Marketing & Promotional Media",
    category: "Advertising Design",
    image: "/graphic-design/graphic-work-4-1.jpg",
  },
];

export default function GraphicDesign() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  return (
    <section id="graphic-design" className="relative py-16 md:py-24 bg-black z-10 px-6 border-t border-zinc-900/60">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 md:mb-16 gap-6">
          <div className="max-w-xl">
            <span className="text-xs font-bold uppercase tracking-widest text-yellow-400 flex items-center gap-2">
              <ImageIcon className="w-4 h-4" /> Creative Visuals
            </span>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight text-yellow-400 mt-3 leading-tight uppercase">
              Graphic Design Showcase
            </h2>
          </div>
          <p className="text-base md:text-lg text-zinc-300 max-w-md font-normal leading-relaxed">
            Take a look at our creative marketing brochures, event flyers, brand identity designs, and social media visuals.
          </p>
        </div>

        {/* Graphic Design Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {graphicWorks.map((work, index) => (
            <motion.div
              key={work.id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
              onClick={() => setSelectedImage(work.image)}
              className="bg-zinc-950 border border-zinc-800 hover:border-yellow-400/60 rounded-2xl p-5 flex flex-col group cursor-pointer transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-lg hover:shadow-yellow-400/5"
            >
              {/* Image Container */}
              <div className="aspect-[4/3] rounded-xl overflow-hidden bg-black border border-zinc-800 relative group-hover:border-yellow-400/40 transition-colors">
                <Image
                  src={work.image}
                  alt={work.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <span className="px-5 py-2.5 rounded-full bg-yellow-400 text-black font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg">
                    Expand Design <ZoomIn className="w-4 h-4" />
                  </span>
                </div>
              </div>

              {/* Title & Metadata */}
              <div className="mt-5 flex flex-col">
                <span className="text-xs font-mono text-yellow-400 font-bold uppercase tracking-wider">
                  {work.category}
                </span>
                <h3 className="text-xl font-bold text-white mt-1 uppercase group-hover:text-yellow-400 transition-colors">
                  {work.title}
                </h3>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal Preview */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 md:p-8 cursor-pointer"
          >
            <div className="relative max-w-5xl max-h-[90vh] w-full h-full flex items-center justify-center">
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-yellow-400 text-black flex items-center justify-center hover:bg-yellow-300 transition-colors shadow-lg"
                aria-label="Close Preview"
              >
                <X className="w-6 h-6 stroke-[2.5]" />
              </button>
              <div className="relative w-full h-full">
                <Image
                  src={selectedImage}
                  alt="Graphic Design Portfolio Preview"
                  fill
                  className="object-contain rounded-xl"
                  priority
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
