"use client";

import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import Work from "@/components/Work";
import GraphicDesign from "@/components/GraphicDesign";
import Approach from "@/components/Approach";
import BookingForm from "@/components/BookingForm";
import Footer from "@/components/Footer";

export default function Home() {
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="bg-black min-h-screen text-white font-sans relative flex flex-col w-full selection:bg-yellow-400 selection:text-black">
      {/* Navigation Layer */}
      <Navbar onBookClick={() => scrollToSection("booking")} />

      {/* Main Pages Flow */}
      <main className="flex-grow w-full relative z-10 flex flex-col">
        <Hero 
          onBookClick={() => scrollToSection("booking")} 
          onWorkClick={() => scrollToSection("services")} 
        />
        
        <Services />
        
        <Work />
        
        <GraphicDesign />
        
        <Approach />
        
        <BookingForm />
      </main>

      {/* Footer Layer */}
      <Footer />
    </div>
  );
}
