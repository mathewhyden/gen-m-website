"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import AboutSection from "@/components/AboutSection";
import ServicesSection from "@/components/ServicesSection";
import WorkSection from "@/components/WorkSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

export default function Home() {
  const router = useRouter();
  const [selectedServiceSlug, setSelectedServiceSlug] = useState<string | undefined>(undefined);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const yOffset = -75;
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, left: 0, behavior: "smooth" });
    }
  };

  const handleSelectServiceCard = (slugOrId: string) => {
    setSelectedServiceSlug(slugOrId);
    scrollToSection("services");
  };

  return (
    <div className="bg-black min-h-screen text-white font-sans relative flex flex-col w-full overflow-x-hidden">
      {/* Top Floating Navbar with in-page anchor tracking */}
      <Navbar onBookClick={() => router.push("/book-consultation")} />

      {/* Main Single-Page Scroll Experience */}
      <main className="flex-grow w-full relative z-10 flex flex-col">
        {/* 1. Hero Section */}
        <div id="home">
          <Hero
            onBookClick={() => router.push("/book-consultation")}
            onWorkClick={() => scrollToSection("services")}
          />
        </div>

        {/* 2. About Section: Who We Are, What We Do & 6-Step Workflow */}
        <AboutSection
          onContactClick={() => scrollToSection("contact")}
          onServicesClick={(serviceId) => {
            if (serviceId) {
              handleSelectServiceCard(serviceId);
            } else {
              scrollToSection("services");
            }
          }}
        />

        {/* 3. Our Services Section: 6 Complete Services & What's Included */}
        <ServicesSection
          selectedSlug={selectedServiceSlug}
        />

        {/* 4. Our Works Section: Portfolio with Tabs, Live Websites & Graphic Design Modal */}
        <WorkSection />

        {/* 5. Contact Us Section: Company Info, WhatsApp, Maps & Direct Links */}
        <ContactSection />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
