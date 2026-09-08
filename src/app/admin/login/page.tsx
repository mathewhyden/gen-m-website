"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/lib/AuthContext";
import { Lock, Mail, ArrowRight, Shield, ArrowLeft } from "lucide-react";

export default function AdminLoginPage() {
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
        body: JSON.stringify({ email: email.trim(), password: password.trim() }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Authentication failed");

      if (data.user.role !== "admin") {
        throw new Error("Access restricted to Gen-M studio administrators.");
      }

      login(data.token, data.user);
      router.push("/admin");
    } catch (err: any) {
      setError(err.message || "Invalid administrative credentials.");
    } finally {
      setLoading(false);
    }
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
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Website
        </Link>
      </div>

      {/* Main Login Card */}
      <div className="max-w-md w-full mx-auto my-auto py-8">
        <div className="p-8 md:p-10 rounded-3xl bg-zinc-950 border border-zinc-800/80 shadow-2xl flex flex-col gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-yellow-400/10 border border-yellow-400/20 text-yellow-400 text-xs font-mono font-bold uppercase tracking-wider mb-3">
              <Shield className="w-3.5 h-3.5" /> Administrative Hub
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Private Admin Access</h1>
            <p className="text-xs text-zinc-400 mt-1.5 leading-relaxed">
              Restricted area. Only authorized Gen-M Tech administrators can access this portal to review enquiries, manage bookings, and view client projects.
            </p>
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-mono">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-mono uppercase tracking-wider text-zinc-400">Admin Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="admin.genm@gmail.com"
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
              {loading ? "Verifying Authority..." : "Enter Admin Dashboard"}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center py-4 text-xs text-zinc-600 font-mono">
        © {new Date().getFullYear()} GEN-M Tech Security System. All rights reserved.
      </div>
    </div>
  );
}
