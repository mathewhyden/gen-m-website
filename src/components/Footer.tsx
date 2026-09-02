"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Send, Check } from "lucide-react";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    setEmail("");
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative border-t border-zinc-800 bg-black pt-20 pb-12 px-6 z-10">
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
            <p className="text-sm text-white font-normal leading-relaxed">
              We design and engineer bespoke software platforms, high-end branding systems, and autonomic intelligence layers. Empowering global brands to lead digital paradigms.
            </p>
          </div>

          {/* Studio Links */}
          <div className="flex flex-col gap-4">
            <span className="text-xs font-bold uppercase tracking-wider text-yellow-400">
              Studio
            </span>
            <ul className="flex flex-col gap-2.5">
              <li>
                <Link href="#services" className="text-sm text-white hover:text-yellow-400 transition-colors duration-200 font-medium">
                  Services
                </Link>
              </li>
              <li>
                <Link href="#work" className="text-sm text-white hover:text-yellow-400 transition-colors duration-200 font-medium">
                  Selected Works
                </Link>
              </li>
              <li>
                <Link href="#approach" className="text-sm text-white hover:text-yellow-400 transition-colors duration-200 font-medium">
                  Our Method
                </Link>
              </li>
            </ul>
          </div>

          {/* Social connections */}
          <div className="flex flex-col gap-4">
            <span className="text-xs font-bold uppercase tracking-wider text-yellow-400">
              Connect
            </span>
            <ul className="flex flex-col gap-2.5">
              <li>
                <a href="https://x.com" target="_blank" rel="noopener noreferrer" className="text-sm text-white hover:text-yellow-400 transition-colors duration-200 font-medium">
                  Twitter / X
                </a>
              </li>
              <li>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-sm text-white hover:text-yellow-400 transition-colors duration-200 font-medium">
                  LinkedIn
                </a>
              </li>
              <li>
                <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-sm text-white hover:text-yellow-400 transition-colors duration-200 font-medium">
                  GitHub
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter subscription form */}
          <div className="flex flex-col gap-4">
            <span className="text-xs font-bold uppercase tracking-wider text-yellow-400">
              Intelligence Briefing
            </span>
            <p className="text-xs text-white font-normal leading-relaxed">
              Receive raw digital insights, product announcements, and structural case studies.
            </p>

            <form onSubmit={handleSubscribe} className="flex relative items-center group">
              <input
                type="email"
                required
                placeholder="Corporate email..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-full py-2.5 pl-4 pr-12 text-xs text-white focus:outline-none focus:border-yellow-400 transition-colors placeholder:text-zinc-500 font-medium"
              />
              <button
                type="submit"
                aria-label="Subscribe"
                className="absolute right-1.5 p-1.5 rounded-full bg-yellow-400 text-black hover:bg-yellow-300 transition-colors"
              >
                {subscribed ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : <Send className="w-3.5 h-3.5 stroke-[2.5]" />}
              </button>
            </form>
            {subscribed && (
              <span className="text-xs text-yellow-400 font-bold font-mono">
                ✓ Subscription secured.
              </span>
            )}
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-zinc-800 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <span className="text-xs text-white font-medium">
            © {currentYear} GEN-M Studio. All rights reserved.
          </span>
          <div className="flex gap-6 text-xs text-white font-medium">
            <Link href="#" className="hover:text-yellow-400 transition-colors">
              Privacy Directive
            </Link>
            <Link href="#" className="hover:text-yellow-400 transition-colors">
              Terms of Engagement
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
