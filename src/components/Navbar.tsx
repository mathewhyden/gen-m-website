"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowUpRight } from "lucide-react";

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

export default function Navbar({ onBookClick }: { onBookClick: () => void }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Services", href: "#services" },
    { name: "Work", href: "#work" },
    { name: "Approach", href: "#approach" },
  ];

  return (
    <>
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-black/90 backdrop-blur-md py-4 border-b border-zinc-800"
            : "bg-transparent py-6 border-b border-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-1 group">
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
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-sm font-medium text-zinc-300 hover:text-yellow-400 transition-colors duration-200 relative py-1 group"
              >
                {link.name}
                <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-yellow-400 group-hover:w-full transition-all duration-200" />
              </Link>
            ))}
          </div>

          {/* CTA / Yellow Button */}
          <div className="hidden md:block">
            <MagneticButton
              onClick={onBookClick}
              className="bg-yellow-400 text-black px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider hover:bg-yellow-300 transition-all duration-200 flex items-center gap-2 cursor-pointer shadow-sm active:scale-95"
            >
              Book Consultation
              <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
            </MagneticButton>
          </div>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-white hover:text-yellow-400 transition-colors focus:outline-none"
            aria-label="Toggle Menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
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
            className="fixed inset-0 z-40 bg-black/95 backdrop-blur-xl flex flex-col justify-center px-8 md:hidden"
          >
            <div className="flex flex-col gap-8 text-left mt-8">
              {navLinks.map((link) => (
                <div key={link.name}>
                  <Link
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="text-3xl font-bold tracking-tight text-yellow-400 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </div>
              ))}
              <div className="mt-4">
                <button
                  onClick={() => {
                    setIsOpen(false);
                    onBookClick();
                  }}
                  className="w-full text-center py-4 bg-yellow-400 text-black font-bold rounded-full hover:bg-yellow-300 transition-colors duration-200 flex items-center justify-center gap-2"
                >
                  Book Consultation
                  <ArrowUpRight className="w-5 h-5 stroke-[2.5]" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
