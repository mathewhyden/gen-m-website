"use client";

import { motion } from "framer-motion";
import { 
  Palette, 
  Paintbrush, 
  Megaphone, 
  Brain, 
  Monitor, 
  Smartphone,
  CheckCircle2 
} from "lucide-react";

const services = [
  {
    icon: Palette,
    title: "Branding",
    description:
      "Crafting distinctive visual identities, luxury brand strategies, design systems, and collateral materials that command prestige.",
    features: ["Visual Identity Systems", "Brand Strategy & Guidelines", "Typography & Color Theory", "Brand Assets & Collateral"],
  },
  {
    icon: Paintbrush,
    title: "Graphic Design",
    description:
      "Creating high-impact visual artwork, marketing graphics, editorial layouts, and creative digital media tailored to your brand.",
    features: ["Creative Art Direction", "Social Media & Marketing Graphics", "Print & Presentation Design", "Custom Vector Illustration"],
  },
  {
    icon: Megaphone,
    title: "Digital Marketing",
    description:
      "Data-driven growth strategies, SEO frameworks, performance marketing, high-converting ad copy, and campaign analytics.",
    features: ["Conversion Rate Optimization", "SEO & Content Architecture", "Social Media Campaigns", "Performance Telemetry"],
  },
  {
    icon: Brain,
    title: "AI Agents",
    description:
      "Engineering autonomous cognitive workflows, custom LLM orchestration, and intelligent AI tools to automate complex operations.",
    features: ["Cognitive Automation", "Custom LLM Fine-Tuning", "RAG & Knowledge Bases", "Predictive Business Analytics"],
  },
  {
    icon: Monitor,
    title: "Web Development",
    description:
      "Architecting high-performance websites, modern Next.js platforms, fast web applications, and serverless web infrastructure.",
    features: ["Full-Stack Next.js & React", "High-Speed Performance SEO", "Serverless API Integration", "Responsive Mobile-First UI"],
  },
  {
    icon: Smartphone,
    title: "App Development",
    description:
      "Building seamless native and cross-platform mobile applications for iOS and Android with sleek UI and powerful backend integration.",
    features: ["iOS & Android App Engineering", "Cross-Platform Mobile Apps", "Intuitive UX/UI Workflows", "API & Database Sync"],
  },
];

export default function Services() {
  return (
    <section id="services" className="relative py-24 md:py-32 bg-black z-10 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 md:mb-20 gap-6">
          <div className="max-w-xl">
            <span className="text-xs font-bold uppercase tracking-widest text-yellow-400">
              Our Core Services
            </span>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight text-yellow-400 mt-3 leading-tight uppercase">
              WE BUILD. WE DESIGN. WE INNOVATE.
            </h2>
          </div>
          <p className="text-base md:text-lg text-white max-w-md font-normal leading-relaxed">
            Delivering high-end digital solutions tailored to elevate your business. From brand design to intelligent app development.
          </p>
        </div>

        {/* Services Grid (3 Columns x 2 Rows) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                className="bg-zinc-950 border border-zinc-800 hover:border-yellow-400/50 rounded-2xl p-8 flex flex-col justify-between group transition-colors duration-300"
              >
                <div>
                  {/* Icon Frame */}
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-black border border-yellow-400/30 group-hover:border-yellow-400 group-hover:bg-yellow-400/10 transition-colors">
                    <Icon className="w-6 h-6 text-yellow-400" />
                  </div>

                  {/* H3 Heading - Vibrant Yellow */}
                  <h3 className="text-2xl font-bold tracking-tight text-yellow-400 mt-6 mb-3 uppercase">
                    {service.title}
                  </h3>
                  
                  {/* Body text - Crisp White */}
                  <p className="text-sm text-white font-normal leading-relaxed mb-6">
                    {service.description}
                  </p>
                </div>

                {/* Feature Bullet points */}
                <div className="border-t border-zinc-800 pt-6 mt-auto">
                  <ul className="flex flex-col gap-2.5">
                    {service.features.map((feature, fIdx) => (
                      <li key={fIdx} className="flex items-center gap-2.5 text-xs text-white font-medium">
                        <CheckCircle2 className="w-4 h-4 text-yellow-400 shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
