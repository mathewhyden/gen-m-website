"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/lib/AuthContext";
import { Lock, Mail, ArrowRight, ShieldCheck, ArrowLeft, KeyRound } from "lucide-react";

export default function ClientLoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Authentication failed");

      login(data.token, data.user);
      if (data.user.role === "admin") {
        router.push("/admin");
      } else {
        router.push("/client/dashboard");
      }
    } catch (err: any) {
      setError(err.message || "Invalid credentials.");
    } finally {
      setLoading(false);
    }
  };

  const autofillDemoClient = () => {
    setEmail("sindhu@hebeart.com");
    setPassword("client123");
  };

  return (
    <div className="bg-black min-h-screen text-white font-sans flex flex-col justify-between p-6 selection:bg-yellow-400 selection:text-black">
      {/* Top Header */}
      <div className="max-w-7xl mx-auto w-full flex items-center justify-between py-4">
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
              className="object-contain"
            />
          </div>
        </Link>
        <Link
          href="/"
          className="text-xs font-mono uppercase tracking-wider text-zinc-400 hover:text-white flex items-center gap-1 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Studio
        </Link>
      </div>

      {/* Main Login Card */}
      <div className="max-w-md w-full mx-auto my-auto py-8">
        <div className="p-8 md:p-10 rounded-3xl bg-zinc-950 border border-zinc-800/80 shadow-2xl flex flex-col gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-yellow-400/10 border border-yellow-400/20 text-yellow-400 text-xs font-mono font-bold uppercase tracking-wider mb-3">
              <ShieldCheck className="w-3.5 h-3.5" /> Client Portal
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Access Your Project</h1>
            <p className="text-xs text-zinc-400 mt-1.5 leading-relaxed">
              Log in to review milestones, inspect staging previews, approve deliverables, and manage invoices.
            </p>
          </div>

          {/* Quick Demo Autofill Badge */}
          <div className="p-3.5 rounded-xl bg-zinc-900/90 border border-zinc-800 flex items-center justify-between">
            <div className="text-xs">
              <span className="text-zinc-400 font-mono block text-[11px]">Instant Demo Test:</span>
              <span className="text-zinc-200 font-mono text-xs">sindhu@hebeart.com</span>
            </div>
            <button
              type="button"
              onClick={autofillDemoClient}
              className="px-3 py-1.5 rounded-lg bg-yellow-400 text-black text-[11px] font-bold uppercase tracking-wider hover:bg-yellow-300 transition-colors cursor-pointer"
            >
              Fill Credentials
            </button>
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-mono">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-mono uppercase tracking-wider text-zinc-400">Client Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-3 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-yellow-400 transition-colors"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-mono uppercase tracking-wider text-zinc-400">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-3 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-yellow-400 transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3.5 rounded-full bg-yellow-400 text-black font-bold text-xs uppercase tracking-wider hover:bg-yellow-300 transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? "Authenticating..." : "Enter Client Dashboard"}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center py-4 text-xs text-zinc-600 font-mono">
        © {new Date().getFullYear()} GEN-M Studio Security System. All rights reserved.
      </div>
    </div>
  );
}
