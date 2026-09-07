"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Send, Check, Mail, Phone, MessageCircle, Lock } from "lucide-react";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const pathname = usePathname();

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    setEmail("");
  };

  const handleScrollTo = (e: React.MouseEvent, id: string) => {
    if (pathname === "/") {
      e.preventDefault();
      const el = document.getElementById(id);
      if (el) {
        const yOffset = -75;
        const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: "smooth" });
      }
    }
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative border-t border-zinc-800/80 bg-black pt-20 pb-12 px-6 z-10">
      <div className="max-w-7xl mx-auto flex flex-col gap-16">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8">
          {/* Logo & Bio */}
          <div className="lg:col-span-2 flex flex-col gap-6 max-w-sm">
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
                />
              </div>
            </Link>
            <p className="text-sm text-zinc-400 font-normal leading-relaxed">
              We design and build modern websites, brand identities, and smart AI solutions to help ambitious businesses stand out and grow.
            </p>
            <div className="flex items-center gap-3 text-xs text-zinc-400">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Available for New Projects</span>
            </div>
          </div>

          {/* Studio Navigation */}
          <div className="flex flex-col gap-4">
            <span className="text-xs font-bold uppercase tracking-wider text-yellow-400">
              Navigation
            </span>
            <ul className="flex flex-col gap-2.5">
              <li>
                <Link
                  href="/#about"
                  onClick={(e) => handleScrollTo(e, "about")}
                  className="text-sm text-zinc-300 hover:text-yellow-400 transition-colors duration-200"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/#services"
                  onClick={(e) => handleScrollTo(e, "services")}
                  className="text-sm text-zinc-300 hover:text-yellow-400 transition-colors duration-200"
                >
                  Our Services
                </Link>
              </li>
              <li>
                <Link
                  href="/#work"
                  onClick={(e) => handleScrollTo(e, "work")}
                  className="text-sm text-zinc-300 hover:text-yellow-400 transition-colors duration-200"
                >
                  Our Works
                </Link>
              </li>
              <li>
                <Link
                  href="/book-consultation"
                  className="text-sm text-zinc-300 hover:text-yellow-400 transition-colors duration-200"
                >
                  Start a Project
                </Link>
              </li>
              <li>
                <Link
                  href="/#contact"
                  onClick={(e) => handleScrollTo(e, "contact")}
                  className="text-sm text-zinc-300 hover:text-yellow-400 transition-colors duration-200"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  href="/book-consultation"
                  className="text-sm text-zinc-300 hover:text-yellow-400 transition-colors duration-200"
                >
                  Book Consultation
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Direct */}
          <div className="flex flex-col gap-4">
            <span className="text-xs font-bold uppercase tracking-wider text-yellow-400">
              Contact Us
            </span>
            <ul className="flex flex-col gap-3 text-sm text-zinc-300">
              <li>
                <a
                  href="https://mail.google.com/mail/?view=cm&fs=1&to=admin.genm@gmail.com&su=Project%20Inquiry%20%7C%20Gen-M%20Studio"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-yellow-400 transition-colors group"
                  title="Compose in Gmail"
                >
                  <Mail className="w-4 h-4 text-yellow-400 group-hover:scale-110 transition-transform" />
                  <span className="break-all">admin.genm@gmail.com</span>
                </a>
              </li>
              <li className="flex flex-col gap-2 pt-1">
                <span className="text-xs text-zinc-500 font-mono uppercase tracking-wider">Phone & WhatsApp</span>
                <div className="flex items-center gap-2">
                  <a
                    href="tel:8754254943"
                    className="flex items-center gap-1.5 hover:text-yellow-400 transition-colors font-mono"
                  >
                    <Phone className="w-3.5 h-3.5 text-yellow-400" />
                    <span>+91 87542 54943</span>
                  </a>
                  <a
                    href="https://wa.me/918754254943"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1 rounded bg-emerald-950/60 border border-emerald-800/40 text-emerald-400 hover:bg-emerald-500 hover:text-black transition-colors"
                    title="WhatsApp +91 87542 54943"
                  >
                    <MessageCircle className="w-3 h-3" />
                  </a>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href="tel:9786853498"
                    className="flex items-center gap-1.5 hover:text-yellow-400 transition-colors font-mono"
                  >
                    <Phone className="w-3.5 h-3.5 text-yellow-400" />
                    <span>+91 97868 53498</span>
                  </a>
                  <a
                    href="https://wa.me/919786853498"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1 rounded bg-emerald-950/60 border border-emerald-800/40 text-emerald-400 hover:bg-emerald-500 hover:text-black transition-colors"
                    title="WhatsApp +91 97868 53498"
                  >
                    <MessageCircle className="w-3 h-3" />
                  </a>
                </div>
              </li>
            </ul>
          </div>

          {/* Newsletter subscription form */}
          <div className="flex flex-col gap-4">
            <span className="text-xs font-bold uppercase tracking-wider text-yellow-400">
              Stay Updated
            </span>
            <p className="text-xs text-zinc-400 font-normal leading-relaxed">
              Get our latest updates, design tips, and technology insights directly in your inbox.
            </p>

            <form onSubmit={handleSubscribe} className="flex relative items-center group">
              <input
                type="email"
                required
                placeholder="Enter your email..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-full py-2.5 pl-4 pr-12 text-xs text-white focus:outline-none focus:border-yellow-400 transition-colors placeholder:text-zinc-600 font-medium"
              />
              <button
                type="submit"
                aria-label="Subscribe"
                className="absolute right-1.5 p-1.5 rounded-full bg-yellow-400 text-black hover:bg-yellow-300 transition-colors cursor-pointer"
              >
                {subscribed ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : <Send className="w-3.5 h-3.5 stroke-[2.5]" />}
              </button>
            </form>
            {subscribed && (
              <span className="text-xs text-yellow-400 font-bold font-mono">
                ✓ Thank you for subscribing!
              </span>
            )}
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-zinc-900 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <span className="text-xs text-zinc-400 font-medium">
              © {currentYear} GEN-M. All rights reserved.
            </span>
            <Link
              href="/admin/login"
              className="text-[11px] text-zinc-600 hover:text-yellow-400 flex items-center gap-1 transition-colors group px-1 py-0.5 rounded"
              title="Admin Portal Access"
            >
              <Lock className="w-2.5 h-2.5 text-zinc-600 group-hover:text-yellow-400 transition-colors" />
              <span>Staff</span>
            </Link>
          </div>
          <div className="flex gap-6 text-xs text-zinc-400 font-medium">
            <span className="hover:text-yellow-400 transition-colors cursor-pointer">
              Privacy Policy
            </span>
            <span className="hover:text-yellow-400 transition-colors cursor-pointer">
              Terms & Conditions
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
