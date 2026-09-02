"use client";

import { motion } from "framer-motion";

const steps = [
  {
    num: "01",
    title: "Discover & Align",
    subtitle: "SYSTEM ANALYSIS & AUDITING",
    description:
      "We begin with detailed alignment workshops, auditing current infrastructure, analyzing critical user drop-off points, and identifying automation opportunities.",
  },
  {
    num: "02",
    title: "Architect & Model",
    subtitle: "SYSTEM DESIGN & SCHEMA PLANNING",
    description:
      "We design visual style guidelines, layout database schemas, choose API paradigms, and construct robust machine learning architecture flowcharts.",
  },
  {
    num: "03",
    title: "Engineer & Implement",
    subtitle: "DEVELOPMENT & SYSTEM INTEGRATION",
    description:
      "Our team implements modular full-stack structures, fine-tunes deep learning engines, writes semantic markup, and coordinates high-performance servers.",
  },
  {
    num: "04",
    title: "Optimize & Scale",
    subtitle: "TELEMETRY AUDITING & BOTTLENECK ANALYSIS",
    description:
      "We monitor API performance thresholds, optimize response latency, run programmatic A/B marketing funnels, and scale infrastructure parameters.",
  },
];

export default function Approach() {
  return (
    <section id="approach" className="relative py-24 md:py-32 bg-black z-10 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="mb-16 md:mb-20 max-w-xl">
          <span className="text-xs font-bold uppercase tracking-widest text-yellow-400">
            Our Method
          </span>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight text-yellow-400 mt-3 leading-tight uppercase">
            How We Engineer Excellence
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
              className="bg-zinc-950 border border-zinc-800 p-8 rounded-2xl flex flex-col justify-between"
            >
              <div>
                {/* Step number in bold Yellow */}
                <span className="text-4xl md:text-5xl font-black font-mono text-yellow-400 block mb-4">
                  {step.num}
                </span>

                <span className="text-xs font-mono text-white font-bold uppercase tracking-wider block mb-2">
                  {step.subtitle}
                </span>

                {/* H3 Heading - MUST BE VIBRANT YELLOW */}
                <h3 className="text-2xl font-bold text-yellow-400 mb-3 uppercase">
                  {step.title}
                </h3>

                {/* Description - CRISP WHITE */}
                <p className="text-sm text-white font-normal leading-relaxed">
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
