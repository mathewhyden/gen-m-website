"use client";

import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/lib/AuthContext";
import { useTheme } from "@/lib/ThemeContext";
import { 
  LayoutDashboard, 
  FolderGit2, 
  Calendar, 
  Inbox, 
  Receipt, 
  CreditCard, 
  FileEdit, 
  MailCheck, 
  LogOut, 
  ExternalLink,
  WalletCards,
  Camera,
  Menu,
  X,
  Sun,
  Moon,
  Users,
  Megaphone
} from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, loading, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!loading && (!user || user.role !== "admin")) {
      if (pathname !== "/admin/login") {
        router.push("/admin/login");
      }
    }
  }, [user, loading, router, pathname]);

  // If on login page, render children without sidebar
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  if (loading || !user || user.role !== "admin") {
    return (
      <div className="bg-black min-h-screen text-white flex flex-col items-center justify-center font-mono text-sm gap-3">
        <div className="w-8 h-8 rounded-full border-2 border-yellow-400 border-t-transparent animate-spin" />
        <span>Authenticating administrator authority...</span>
      </div>
    );
  }

  const navItems = [
    { name: "Overview", href: "/admin", icon: LayoutDashboard },
    { name: "Monthly Expenses", href: "/admin/expenses", icon: WalletCards },
    { name: "Projects", href: "/admin/projects", icon: FolderGit2 },
    { name: "Team Members", href: "/admin/team", icon: Users },
    { name: "Promos & Offers", href: "/admin/promos", icon: Megaphone },
    { name: "Bookings & Inquiries", href: "/admin/bookings", icon: Calendar },
    { name: "Leads & Briefs", href: "/admin/enquiries", icon: Inbox },
    { name: "Invoices", href: "/admin/invoices", icon: Receipt },
    { name: "Payments & Financials", href: "/admin/payments", icon: CreditCard },
    { name: "Services & Pricing Editor", href: "/admin/cms", icon: FileEdit },
    { name: "Email Logs", href: "/admin/email-logs", icon: MailCheck },
  ];

  return (
    <div className="bg-black min-h-screen text-white font-sans flex flex-col md:flex-row selection:bg-yellow-400 selection:text-black">
      {/* Mobile Top Header */}
      <div className="md:hidden border-b border-zinc-800 bg-zinc-950 px-6 py-4 flex items-center justify-between sticky top-0 z-40">
        <Link href="/admin" className="flex items-center gap-1">
          <span className="text-xl font-black text-white">GEN-M</span>
          <span className="text-xs font-mono px-2 py-0.5 rounded bg-yellow-400 text-black font-bold">ADMIN</span>
        </Link>
        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-yellow-400 hover:text-white transition-colors"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
            aria-label="Toggle Theme"
          >
            {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Sidebar Navigation */}
      <aside className={`fixed md:sticky top-0 left-0 h-screen w-64 bg-zinc-950 border-r border-zinc-800/80 p-6 flex flex-col justify-between z-50 transition-transform md:translate-x-0 ${
        mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      }`}>
        <div className="flex flex-col gap-6">
          {/* Logo & Theme Toggle */}
          <div className="flex items-center justify-between">
            <Link href="/admin" className="flex items-center gap-1 group">
              <span className="text-2xl font-black tracking-tight text-white group-hover:text-yellow-400 transition-colors">
                GEN-
              </span>
              <div className="relative h-8 w-auto flex items-center justify-center">
                <Image
                  src="/logo-crisp.png"
                  alt="Gen-M Logo"
                  width={32}
                  height={32}
                  style={{ width: "auto", height: "28px" }}
                  className="object-contain"
                />
              </div>
              <span className="ml-2 px-2 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase tracking-wider bg-yellow-400 text-black">
                Admin
              </span>
            </Link>

            {/* Desktop Theme Switcher */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-yellow-400 hover:bg-zinc-800 transition-all cursor-pointer shadow-sm"
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
              aria-label="Toggle Theme"
            >
              {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-1 overflow-y-auto max-h-[calc(100vh-280px)] pr-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                    isActive
                      ? "bg-yellow-400 text-black shadow-sm font-bold"
                      : "text-zinc-400 hover:text-white hover:bg-zinc-900"
                  }`}
                >
                  <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? "text-black stroke-[2.5]" : "text-zinc-400"}`} />
                  <span className="truncate">{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Profile & External Links */}
        <div className="flex flex-col gap-3 border-t border-zinc-900 pt-4">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between text-xs font-mono text-zinc-400 hover:text-yellow-400 transition-colors px-1"
          >
            <span>Live Website</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800/60 flex items-center justify-between">
            <div className="flex flex-col min-w-0 pr-2">
              <span className="text-xs font-bold text-white truncate">{user.name}</span>
              <span className="text-[10px] font-mono text-zinc-500 truncate">{user.email}</span>
            </div>
            <button
              onClick={() => { logout(); router.push("/admin/login"); }}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-red-400 hover:bg-red-500/10 transition-colors flex-shrink-0 cursor-pointer"
              title="Sign Out of Admin"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto min-h-screen p-6 md:p-10">
        {children}
      </main>
    </div>
  );
}
