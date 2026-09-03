"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { 
  ArrowRight,
  ArrowUpRight,
  Check,
  X,
  Sparkles,
  Globe
} from "lucide-react";

interface ServiceCardItem {
  id: string;
  title: string;
  description: string;
  tag: string;
  image: string;
  features: string[];
  workLink?: string;
  servicesLink: string;
}

interface ExpandingRect {
  top: number;
  left: number;
  width: number;
  height: number;
}

export default function AboutPage() {
  const router = useRouter();
  const [expandingCard, setExpandingCard] = useState<{
    service: ServiceCardItem;
    rect: ExpandingRect;
  } | null>(null);

  const whoWeAreCards = [
    {
      question: "Who is Gen-M?",
      description: "Gen-M is a modern digital studio focused on building high-quality websites, memorable brand identities, and smart AI solutions.",
      subtext: "We help businesses grow by designing clean user experiences, developing fast modern websites, and setting up practical automation tools."
    },
    {
      question: "What Problem Do We Solve?",
      description: "Many businesses struggle with outdated designs, slow websites, and manual workflows that hold back their growth.",
      subtext: "We fix this by providing complete, reliable digital solutions so your brand looks professional and runs smoothly."
    },
    {
      question: "What Is Our Approach?",
      description: "We focus on clean visual design, fast and reliable development, and clear, ongoing communication with every client.",
      subtext: "From initial concept to launch and long-term support, we build systems designed to help your business stand out."
    }
  ];

  const services: ServiceCardItem[] = [
    {
      id: "branding",
      title: "Brand Identity",
      description: "Distinct visual identities, logos, color palettes, and brand guidelines tailored to make your business memorable.",
      tag: "Identity & Strategy",
      image: "/services/brand-identity.jpg",
      features: [
        "Brand Guidelines & Systems",
        "Typography & Color Palette",
        "Custom Logos & Marks",
        "Digital & Print Assets"
      ],
      workLink: "/work",
      servicesLink: "/services#branding"
    },
    {
      id: "graphic-design",
      title: "Graphic Design",
      description: "Eye-catching marketing visuals, social media designs, pitch decks, and brand collateral crafted with care.",
      tag: "Visual Design",
      image: "/services/graphic-design.jpg",
      features: [
        "Social Media & Ad Creatives",
        "Pitch Decks & Presentations",
        "Packaging & Print Design",
        "Brochures & Event Flyers"
      ],
      workLink: "/work",
      servicesLink: "/services#graphic-design"
    },
    {
      id: "digital-marketing",
      title: "Digital Marketing",
      description: "Targeted digital marketing campaigns, SEO optimization, and social media strategies to reach more customers.",
      tag: "Reach & Growth",
      image: "/services/digital-marketing.jpg",
      features: [
        "Search Engine Optimization (SEO)",
        "Social Media Marketing",
        "Performance Ad Campaigns",
        "Email Marketing Setup"
      ],
      workLink: "/work",
      servicesLink: "/services#digital-marketing"
    },
    {
      id: "ai-agents",
      title: "AI Agents & Automation",
      description: "Smart AI tools, chatbots, and workflow automation to save you time and streamline customer support.",
      tag: "Smart Automation",
      image: "/services/ai-agents.jpg",
      features: [
        "Custom AI Chatbots",
        "Workflow Automation",
        "Smart Customer Support",
        "AI-Powered Business Tools"
      ],
      workLink: "/services#ai-agents",
      servicesLink: "/services#ai-agents"
    },
    {
      id: "web-development",
      title: "Web Development",
      description: "Fast, modern, and mobile-friendly websites and web applications built with clean code and high performance.",
      tag: "Modern Web",
      image: "/services/web-development.jpg",
      features: [
        "Custom Modern Web Design",
        "Fast Loading & Mobile-Ready",
        "Search Engine Friendly",
        "Easy Content Management"
      ],
      workLink: "/work",
      servicesLink: "/services#web-development"
    },
    {
      id: "app-development",
      title: "App Development",
      description: "Smooth mobile applications for iOS and Android built for seamless usability and reliable performance.",
      tag: "Mobile Apps",
      image: "/services/app-development.jpg",
      features: [
        "iOS & Android Mobile Apps",
        "User-Friendly Interface",
        "Fast & Secure Performance",
        "Ongoing Maintenance & Updates"
      ],
      workLink: "/work",
      servicesLink: "/services#app-development"
    }
  ];

  const workflowSteps = [
    "Discover",
    "Plan",
    "Design",
    "Build",
    "Launch",
    "Grow"
  ];

  const handleLearnMoreClick = (svc: ServiceCardItem, e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    const cardEl = e.currentTarget.closest('[data-service-card="true"]') || e.currentTarget;
    const rect = cardEl.getBoundingClientRect();
    
    setExpandingCard({
      service: svc,
      rect: {
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
      }
    });
  };

  const handleNavigateToService = (targetUrl: string) => {
    router.push(targetUrl);
  };

  return (
    <div className="bg-black min-h-screen text-white font-sans relative flex flex-col w-full selection:bg-yellow-400 selection:text-black overflow-x-hidden">
      <Navbar />

      {/* Main Page Container with smooth dim/blur when card is expanding */}
      <motion.main 
        animate={{
          opacity: expandingCard ? 0.2 : 1,
          scale: expandingCard ? 0.98 : 1,
          filter: expandingCard ? "blur(4px)" : "blur(0px)",
        }}
        transition={{
          duration: 0.55,
          ease: [0.22, 1, 0.36, 1], // Smooth cubic-bezier curve
        }}
        className="flex-grow w-full relative z-10 pt-32 pb-24 px-6 md:px-12 max-w-7xl mx-auto flex flex-col gap-20"
      >
        {/* 1. Hero Section */}
        <section className="flex flex-col items-start max-w-4xl pt-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-yellow-400/30 bg-yellow-400/10 text-yellow-400 text-xs font-semibold uppercase tracking-wider mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse" />
            About Gen-M Studio
          </div>
          <h1 className="font-display text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white uppercase leading-[1.12] mb-5">
            DESIGNED TO <span className="text-yellow-400">EVOLVE</span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-zinc-300 font-normal leading-relaxed max-w-2xl mb-8">
            We are <span className="text-white font-semibold">Gen-M</span> — we build modern websites, clean brand identities, and smart digital solutions that help your business grow and stand out.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Link
              href="/start-project"
              className="px-7 py-3 rounded-full bg-yellow-400 text-black font-bold text-xs uppercase tracking-wider hover:bg-yellow-300 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-sm hover:shadow-yellow-400/20 active:scale-95"
            >
              Start a Project
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </Link>
            <Link
              href="/book-consultation"
              className="px-7 py-3 rounded-full bg-zinc-900 border border-zinc-700 hover:border-yellow-400 text-white font-semibold text-xs uppercase tracking-wider transition-all duration-300 flex items-center justify-center cursor-pointer hover:bg-zinc-800 active:scale-95"
            >
              Book Consultation
            </Link>
          </div>
        </section>

        {/* 2. Who We Are */}
        <section className="flex flex-col gap-8 pt-6 border-t border-zinc-900">
          <div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Who We Are
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {whoWeAreCards.map((card, idx) => {
              return (
                <div 
                  key={idx}
                  className="p-7 rounded-2xl bg-zinc-950 border border-zinc-800/90 hover:border-yellow-400/60 transition-all duration-300 ease-out hover:-translate-y-1 flex flex-col justify-between"
                >
                  <div className="flex flex-col gap-3">
                    <h3 className="text-xl font-bold text-white">
                      {card.question}
                    </h3>

                    <p className="text-sm text-zinc-300 font-normal leading-relaxed">
                      {card.description}
                    </p>

                    <p className="text-xs text-zinc-400 leading-relaxed pt-2">
                      {card.subtext}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* 3. What We Do - Expanding Shared-Element Cards */}
        <section className="flex flex-col gap-8 pt-6 border-t border-zinc-900">
          <div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              What We Do
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((svc) => {
              return (
                <div
                  key={svc.id}
                  data-service-card="true"
                  onClick={(e) => handleLearnMoreClick(svc, e)}
                  className="p-7 rounded-2xl bg-zinc-950 border border-zinc-800 hover:border-yellow-400/80 transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-lg hover:shadow-yellow-400/5 flex flex-col justify-between group cursor-pointer"
                >
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-yellow-400 bg-zinc-900 px-2.5 py-1 rounded-full border border-zinc-800">
                        {svc.tag}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-white group-hover:text-yellow-400 transition-colors duration-300 mt-2">
                      {svc.title}
                    </h3>

                    <p className="text-sm text-zinc-400 leading-relaxed font-sans group-hover:text-zinc-300 transition-colors duration-300">
                      {svc.description}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-zinc-900 flex items-center justify-between text-xs font-semibold text-yellow-400 group-hover:text-yellow-300 transition-colors duration-300">
                    <span>Learn More</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1.5 transition-transform duration-300" />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* 4. How We Work */}
        <section className="flex flex-col gap-8 pt-6 border-t border-zinc-900">
          <div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-2">
              How We Work
            </h2>
            <p className="text-sm text-zinc-400 max-w-xl">
              Our clear process ensures smooth communication, fast delivery, and high quality at every stage.
            </p>
          </div>

          {/* 6-Step Flow Banner */}
          <div className="p-6 sm:p-8 rounded-2xl bg-zinc-950 border border-zinc-800/90 shadow-xl overflow-x-auto">
            <div className="flex items-center min-w-[650px] justify-between gap-3">
              {workflowSteps.map((step, idx) => (
                <React.Fragment key={step}>
                  <div className="flex items-center gap-2.5">
                    <span className="w-7 h-7 rounded-full bg-yellow-400/10 border border-yellow-400/30 text-yellow-400 font-mono text-xs font-bold flex items-center justify-center">
                      0{idx + 1}
                    </span>
                    <span className="text-sm sm:text-base font-bold font-mono tracking-wide text-white uppercase">
                      {step}
                    </span>
                  </div>
                  {idx < workflowSteps.length - 1 && (
                    <span className="text-zinc-600 font-mono text-sm font-bold select-none">
                      →
                    </span>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </section>

        {/* 5. CTA Section */}
        <section className="p-8 md:p-12 rounded-3xl bg-zinc-950 border border-zinc-800 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-xl">
            <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2">
              Ready to move your business forward?
            </h3>
            <p className="text-zinc-400 text-sm">
              Contact our team today to get started on your website, branding, or AI solutions.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <Link
              href="/start-project"
              className="px-7 py-3 rounded-full bg-yellow-400 text-black font-bold text-xs uppercase tracking-wider text-center hover:bg-yellow-300 transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              Start a Project
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/book-consultation"
              className="px-7 py-3 rounded-full bg-zinc-900 border border-zinc-700 text-white font-semibold text-xs uppercase tracking-wider text-center hover:border-yellow-400 transition-colors flex items-center justify-center cursor-pointer"
            >
              Book Consultation
            </Link>
          </div>
        </section>
      </motion.main>

      {/* Modern Shared-Element Expanding Card Overlay */}
      <AnimatePresence>
        {expandingCard && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-0 sm:p-4 md:p-6">
            <motion.div
              initial={{
                top: expandingCard.rect.top,
                left: expandingCard.rect.left,
                width: expandingCard.rect.width,
                height: expandingCard.rect.height,
                borderRadius: "1rem", // 16px
                opacity: 0.95,
                position: "fixed",
              }}
              animate={{
                top: 0,
                left: 0,
                width: "100vw",
                height: "100vh",
                borderRadius: "0px",
                opacity: 1,
                position: "fixed",
                transition: {
                  duration: 0.6,
                  ease: [0.22, 1, 0.36, 1], // Exact requested cubic-bezier curve
                },
              }}
              exit={{
                top: expandingCard.rect.top,
                left: expandingCard.rect.left,
                width: expandingCard.rect.width,
                height: expandingCard.rect.height,
                borderRadius: "1rem",
                opacity: 0,
                transition: {
                  duration: 0.45,
                  ease: [0.22, 1, 0.36, 1],
                },
              }}
              className="bg-zinc-950 border border-yellow-400/50 shadow-2xl overflow-y-auto flex flex-col z-50 text-white selection:bg-yellow-400 selection:text-black"
            >
              {/* Header Navigation Bar inside expanded card */}
              <div className="sticky top-0 z-20 bg-zinc-950/90 backdrop-blur-md border-b border-zinc-800/80 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-xl font-black tracking-tight text-white">
                    GEN<span className="text-yellow-400">-M</span>
                  </span>
                  <span className="text-zinc-600 font-mono text-sm">/</span>
                  <span className="text-xs font-mono uppercase tracking-widest text-yellow-400 font-bold">
                    {expandingCard.service.title}
                  </span>
                </div>

                <button
                  onClick={() => setExpandingCard(null)}
                  className="w-9 h-9 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:border-yellow-400 flex items-center justify-center transition-all duration-200 cursor-pointer"
                  title="Close & Return to About"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Expanded Card Content - Smoothly reveals as card expands */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.5,
                  delay: 0.15,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="max-w-5xl mx-auto w-full px-6 sm:px-10 py-10 md:py-14 flex flex-col gap-10 flex-grow"
              >
                {/* Hero Header */}
                <div className="flex flex-col gap-4">
                  <div className="inline-flex items-center gap-2 self-start px-3.5 py-1 rounded-full bg-yellow-400/10 border border-yellow-400/30 text-yellow-400 text-xs font-mono font-bold uppercase tracking-wider">
                    <Sparkles className="w-3.5 h-3.5" />
                    {expandingCard.service.tag}
                  </div>

                  <h2 className="text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tight uppercase leading-tight">
                    {expandingCard.service.title}
                  </h2>

                  <p className="text-base sm:text-xl text-zinc-300 leading-relaxed max-w-3xl font-normal">
                    {expandingCard.service.description}
                  </p>
                </div>

                {/* Hero Visual Preview */}
                <div className="relative aspect-[16/9] md:aspect-[21/9] w-full rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-900 shadow-2xl">
                  <Image
                    src={expandingCard.service.image}
                    alt={expandingCard.service.title}
                    fill
                    priority
                    className="object-cover"
                    sizes="(max-width: 1200px) 100vw, 1200px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/90 via-transparent to-transparent" />
                  <div className="absolute bottom-5 left-6 right-6 flex items-center justify-between">
                    <span className="text-xs font-mono text-yellow-400 font-bold tracking-wider uppercase bg-black/70 px-3 py-1.5 rounded-full border border-yellow-400/20 backdrop-blur-md">
                      Featured Capability
                    </span>
                    <span className="text-xs font-mono text-zinc-400 hidden sm:inline-block">
                      Gen-M Production Standard
                    </span>
                  </div>
                </div>

                {/* Deliverables & Features Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {expandingCard.service.features.map((feature, idx) => (
                    <div
                      key={idx}
                      className="p-5 rounded-xl bg-zinc-900/60 border border-zinc-800/80 flex items-center gap-3.5"
                    >
                      <div className="w-6 h-6 rounded-full bg-yellow-400/20 border border-yellow-400/40 text-yellow-400 flex items-center justify-center shrink-0">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                      <span className="text-sm font-semibold text-zinc-200">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Action Buttons: Seamless navigation to Services / Our Work */}
                <div className="pt-6 border-t border-zinc-900 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      onClick={() => handleNavigateToService(expandingCard.service.servicesLink)}
                      className="px-6 py-3.5 rounded-full bg-yellow-400 text-black font-bold text-xs uppercase tracking-wider hover:bg-yellow-300 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-md active:scale-95"
                    >
                      View on Services Page
                      <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
                    </button>

                    {expandingCard.service.workLink && (
                      <button
                        onClick={() => handleNavigateToService(expandingCard.service.workLink!)}
                        className="px-6 py-3.5 rounded-full bg-zinc-900 border border-zinc-700 hover:border-yellow-400 text-white font-semibold text-xs uppercase tracking-wider hover:bg-zinc-800 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                      >
                        <Globe className="w-3.5 h-3.5 text-yellow-400" />
                        Explore Our Works
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleNavigateToService("/book-consultation")}
                      className="text-xs text-zinc-400 hover:text-yellow-400 underline underline-offset-4 cursor-pointer transition-colors"
                    >
                      Book Free Consultation →
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}

