"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowUpRight } from "lucide-react";
import RopeThemeToggle from "./RopeThemeToggle";

export function MagneticButton({
  children,
  className = "",
  onClick,
}: {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const x = clientX - (left + width / 2);
    const y = clientY - (top + height / 2);
    setPosition({ x: x * 0.2, y: y * 0.2 });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative inline-block"
    >
      <motion.button
        onClick={onClick}
        animate={{ x: position.x, y: position.y }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
        className={className}
      >
        {children}
      </motion.button>
    </div>
  );
}

export default function Navbar({ onBookClick }: { onBookClick?: () => void }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const pathname = usePathname();
  const router = useRouter();

  const navLinks = [
    { name: "Home", href: "/", sectionId: "home" },
    { name: "About Us", href: "/about", sectionId: "about" },
    { name: "Our Services", href: "/services", sectionId: "services" },
    { name: "Our Works", href: "/work", sectionId: "work" },
    { name: "Contact Us", href: "/contact", sectionId: "contact" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      if (pathname === "/") {
        const sections = ["contact", "work", "services", "about", "home"];
        for (const sec of sections) {
          const el = document.getElementById(sec);
          if (el) {
            const rect = el.getBoundingClientRect();
            if (rect.top <= 220) {
              setActiveSection(sec);
              break;
            }
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [pathname]);

  const handleNavClick = (e: React.MouseEvent, link: typeof navLinks[0]) => {
    if (pathname === "/") {
      e.preventDefault();
      setIsOpen(false);
      const el = document.getElementById(link.sectionId);
      if (el) {
        const yOffset = -75;
        const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: "smooth" });
      } else if (link.sectionId === "home") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  };

  const handleActionClick = () => {
    router.push("/book-consultation");
  };

  return (
    <>
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-black/90 backdrop-blur-md py-4 border-b border-zinc-800/80"
            : "bg-transparent py-6 border-b border-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            onClick={(e) => {
              if (pathname === "/") {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: "smooth" });
              }
            }}
            className="flex items-center gap-1 group"
          >
            <span className="text-2xl font-black tracking-tight text-white group-hover:text-yellow-400 transition-colors">
              GEN-
            </span>
            <div className="relative h-8 w-auto flex items-center justify-center">
              <Image
                src="/logo-crisp.png"
                alt="Gen-M Logo"
                width={32}
                height={32}
                style={{ width: "auto", height: "30px" }}
                className="object-contain group-hover:scale-110 transition-transform duration-200"
                priority
              />
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const isSectionActive = pathname === "/" ? activeSection === link.sectionId : pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={pathname === "/" ? `#${link.sectionId}` : `/#${link.sectionId}`}
                  onClick={(e) => handleNavClick(e, link)}
                  className={`text-sm font-medium transition-colors duration-200 relative py-1 group ${
                    isSectionActive ? "text-yellow-400 font-semibold" : "text-zinc-300 hover:text-yellow-400"
                  }`}
                >
                  {link.name}
                  <span
                    className={`absolute bottom-0 left-0 h-[2px] bg-yellow-400 transition-all duration-200 ${
                      isSectionActive ? "w-full" : "w-0 group-hover:w-full"
                    }`}
                  />
                </Link>
              );
            })}
          </div>

          {/* Right Area: Action CTA & Theme Pull Rope */}
          <div className="hidden md:flex items-center gap-4">
            <MagneticButton
              onClick={handleActionClick}
              className="bg-yellow-400 text-black px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider hover:bg-yellow-300 transition-all duration-200 flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-95"
            >
              Book Consultation
              <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
            </MagneticButton>

            {/* Pulling the rope animated theme toggle button */}
            <div className="pt-0.5">
              <RopeThemeToggle />
            </div>
          </div>

          {/* Mobile Right Controls: Theme Pull Rope & Menu Toggle */}
          <div className="flex md:hidden items-center gap-3">
            <RopeThemeToggle />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-white hover:text-yellow-400 transition-colors focus:outline-none"
              aria-label="Toggle Menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-black/98 backdrop-blur-2xl flex flex-col justify-center px-8 md:hidden"
          >
            <div className="flex flex-col gap-6 text-left mt-6">
              {navLinks.map((link) => {
                const isSectionActive = pathname === "/" ? activeSection === link.sectionId : pathname === link.href;
                return (
                  <div key={link.name}>
                    <Link
                      href={pathname === "/" ? `#${link.sectionId}` : `/#${link.sectionId}`}
                      onClick={(e) => handleNavClick(e, link)}
                      className={`text-2xl font-bold tracking-tight transition-colors ${
                        isSectionActive ? "text-yellow-400 font-extrabold" : "text-zinc-200 hover:text-yellow-400"
                      }`}
                    >
                      {link.name}
                    </Link>
                  </div>
                );
              })}
              <div className="pt-4 border-t border-zinc-800 flex flex-col gap-3">
                <button
                  onClick={() => {
                    setIsOpen(false);
                    handleActionClick();
                  }}
                  className="text-left text-lg font-medium text-zinc-300 hover:text-yellow-400"
                >
                  Start a Project
                </button>
              </div>
              <div className="mt-4">
                <button
                  onClick={() => {
                    setIsOpen(false);
                    handleActionClick();
                  }}
                  className="w-full text-center py-3.5 bg-yellow-400 text-black font-bold rounded-full hover:bg-yellow-300 transition-colors duration-200 flex items-center justify-center gap-2"
                >
                  Book Consultation
                  <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
