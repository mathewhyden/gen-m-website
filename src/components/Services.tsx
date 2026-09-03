"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, ArrowRight } from "lucide-react";

const services = [
  {
    slug: "branding",
    image: "/services/brand-identity.jpg",
    title: "Brand Identity",
    description:
      "Crafting distinctive visual identities, logos, color palettes, and brand guidelines that make your business memorable.",
    features: ["Visual Identity Systems", "Brand Strategy & Guidelines", "Logo & Typography Design", "Brand Assets & Collateral"],
  },
  {
    slug: "graphic-design",
    image: "/services/graphic-design.jpg",
    title: "Graphic Design",
    description:
      "Creating eye-catching marketing graphics, social media posts, pitch decks, and visual content tailored to your brand.",
    features: ["Social Media Creatives", "Pitch Decks & Presentations", "Print & Packaging Design", "Custom Vector Graphics"],
  },
  {
    slug: "digital-marketing",
    image: "/services/digital-marketing.jpg",
    title: "Digital Marketing",
    description:
      "Targeted digital marketing campaigns, SEO optimization, and social media strategies to reach more customers.",
    features: ["Search Engine Optimization (SEO)", "Social Media Marketing", "Performance Ad Campaigns", "Audience Growth Strategies"],
  },
  {
    slug: "ai-agents",
    image: "/services/ai-agents.jpg",
    title: "AI Agents & Automation",
    description:
      "Smart AI tools, chatbots, and workflow automation to save your team time and improve customer service.",
    features: ["Custom AI Chatbots", "Workflow Automation", "Smart Lead Handling", "AI Business Integration"],
  },
  {
    slug: "web-development",
    image: "/services/web-development.jpg",
    title: "Web Development",
    description:
      "Fast, responsive, and modern websites and web applications designed for seamless user experience on all devices.",
    features: ["Modern Responsive Websites", "Fast Page Loading Speeds", "Mobile-Friendly Design", "Custom Web Applications"],
  },
  {
    slug: "app-development",
    image: "/services/app-development.jpg",
    title: "App Development",
    description:
      "Smooth mobile applications for iOS and Android with clean interfaces and reliable performance.",
    features: ["iOS & Android Mobile Apps", "Clean User Interface (UI)", "Smooth Performance", "Reliable Backend Sync"],
  },
];

export default function Services() {
  return (
    <section id="services" className="relative py-16 md:py-24 bg-black z-10 px-6 border-t border-zinc-900/60">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 md:mb-16 gap-6">
          <div className="max-w-xl">
            <span className="text-xs font-bold uppercase tracking-widest text-yellow-400">
              Our Core Services
            </span>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight text-yellow-400 mt-3 leading-tight uppercase">
              What We Do
            </h2>
          </div>
          <p className="text-base text-zinc-300 max-w-md font-normal leading-relaxed">
            Delivering modern digital solutions tailored to help your business stand out and grow.
          </p>
        </div>

        {/* Services Grid with Images */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => {
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                className="bg-zinc-950 border border-zinc-800 hover:border-yellow-400/50 rounded-2xl p-6 flex flex-col justify-between group transition-all duration-300"
              >
                <div>
                  {/* Service Image Header */}
                  <div className="relative w-full h-44 rounded-xl overflow-hidden mb-6 border border-zinc-800/80 bg-zinc-900">
                    <Image
                      src={service.image}
                      alt={service.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  </div>

                  {/* Heading */}
                  <h3 className="text-2xl font-bold tracking-tight text-yellow-400 mb-3">
                    {service.title}
                  </h3>
                  
                  {/* Body text */}
                  <p className="text-sm text-zinc-300 font-normal leading-relaxed mb-6">
                    {service.description}
                  </p>
                </div>

                {/* Feature Bullet points & Link */}
                <div className="border-t border-zinc-900 pt-5 mt-auto flex flex-col gap-4">
                  <ul className="flex flex-col gap-2">
                    {service.features.map((feature, fIdx) => (
                      <li key={fIdx} className="flex items-center gap-2 text-xs text-zinc-300 font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5 text-yellow-400 shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Link
                    href={`/services#${service.slug}`}
                    className="mt-2 text-xs font-bold text-yellow-400 hover:text-white flex items-center gap-1.5 transition-colors group/link"
                  >
                    <span>View Service Details</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
