"use client";

import { motion } from "framer-motion";

const steps = [
  {
    num: "01",
    title: "Discover & Understand",
    subtitle: "UNDERSTANDING YOUR GOALS",
    description:
      "We start by discussing your vision, understanding your target audience, and planning the best approach for your project.",
  },
  {
    num: "02",
    title: "Design & Plan",
    subtitle: "CREATIVE WIREFRAMES & LAYOUTS",
    description:
      "We create clean visual designs, user interfaces, wireframes, and project roadmaps tailored to your brand.",
  },
  {
    num: "03",
    title: "Build & Develop",
    subtitle: "HIGH-QUALITY DEVELOPMENT",
    description:
      "Our team builds your website, application, or brand assets with high quality, speed, and modern technology.",
  },
  {
    num: "04",
    title: "Launch & Grow",
    subtitle: "TESTING & CONTINUOUS SUPPORT",
    description:
      "We help you launch smoothly, test everything thoroughly, and support you as your business grows.",
  },
];

export default function Approach() {
  return (
    <section id="approach" className="relative py-16 md:py-24 bg-black z-10 px-6 border-t border-zinc-900/60">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="mb-12 md:mb-16 max-w-xl">
          <span className="text-xs font-bold uppercase tracking-widest text-yellow-400">
            Our Process
          </span>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight text-yellow-400 mt-3 leading-tight uppercase">
            How We Work
          </h2>
        </div>

        {/* Timeline Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="bg-zinc-950 border border-zinc-800 p-8 rounded-2xl flex flex-col justify-between hover:border-yellow-400/40 transition-colors"
            >
              <div>
                {/* Step number in bold Yellow */}
                <span className="text-4xl md:text-5xl font-black font-mono text-yellow-400 block mb-4">
                  {step.num}
                </span>

                <span className="text-xs font-mono text-zinc-400 font-bold uppercase tracking-wider block mb-2">
                  {step.subtitle}
                </span>

                {/* H3 Heading */}
                <h3 className="text-2xl font-bold text-white mb-3">
                  {step.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-zinc-300 font-normal leading-relaxed">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
