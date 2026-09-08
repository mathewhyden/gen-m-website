"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { 
  FolderGit2, 
  Calendar, 
  Inbox, 
  ArrowUpRight, 
  Clock, 
  Phone, 
  Mail, 
  Video, 
  Building, 
  ExternalLink,
  RefreshCw,
  MessageSquare,
  TrendingUp,
  Wallet,
  Receipt,
  ShieldCheck
} from "lucide-react";
import { AdminStats, Project, Booking, Enquiry, Payment } from "@/lib/types";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [inquiries, setInquiries] = useState<Enquiry[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState<string>("");

  const refreshData = async () => {
    setIsRefreshing(true);
    try {
      const [statsRes, projRes, bookRes, enqRes, payRes] = await Promise.all([
        fetch("/api/admin/stats").then(r => r.json()),
        fetch("/api/projects").then(r => r.json()),
        fetch("/api/bookings").then(r => r.json()),
        fetch("/api/admin/enquiries").then(r => r.json()),
        fetch("/api/admin/payments").then(r => r.json()),
      ]);
      if (statsRes.stats) setStats(statsRes.stats);
      if (projRes.projects) setProjects(projRes.projects);
      if (bookRes.bookings) setBookings(bookRes.bookings);
      if (enqRes.enquiries) setInquiries(enqRes.enquiries);
      if (payRes.payments) setPayments(payRes.payments);
      setLastRefreshed(new Date().toLocaleTimeString());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    refreshData();
    // Auto-poll every 3 seconds so incoming messages from website appear in real-time
    const interval = setInterval(() => {
      refreshData();
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleBookingStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch("/api/bookings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });
      if (res.ok) {
        setBookings(prev => prev.map(b => b.id === id ? { ...b, status: newStatus as any } : b));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleEnquiryStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch("/api/admin/enquiries", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });
      if (res.ok) {
        setInquiries(prev => prev.map(e => e.id === id ? { ...e, status: newStatus as any } : e));
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center font-mono text-xs text-zinc-500">
        Aggregating system telemetry and bookings...
      </div>
    );
  }

  const statCards = [
    {
      title: "This Month Profit",
      value: `₹${(stats?.monthlyProfit || 0).toLocaleString('en-IN')}`,
      sub: `${stats?.currentMonthName || 'This Month'} (Net Profit: Revenue - Expenses)`,
      icon: TrendingUp,
      color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    },
    {
      title: "This Month Revenue",
      value: `₹${(stats?.monthlyRevenue || 0).toLocaleString('en-IN')}`,
      sub: `All-time Cleared: ₹${(stats?.totalRevenue || 0).toLocaleString('en-IN')}`,
      icon: Wallet,
      color: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20",
    },
    {
      title: "This Month Expenses",
      value: `₹${(stats?.monthlyExpenses || 0).toLocaleString('en-IN')}`,
      sub: `Lifetime: ₹${(stats?.totalExpenses || 0).toLocaleString('en-IN')}`,
      icon: Receipt,
      color: "text-red-400 bg-red-500/10 border-red-500/20",
    },
    {
      title: "Active Projects",
      value: stats?.activeProjects || 0,
      sub: `${projects.filter(p => p.status === 'COMPLETED').length} Delivered Projects`,
      icon: FolderGit2,
      color: "text-blue-400 bg-blue-500/10 border-blue-500/20",
    },
  ];

  return (
    <div className="flex flex-col gap-10">
      {/* Header & Quick Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-yellow-400 block mb-1">
            Gen-M Tech Admin Control
          </span>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Executive Dashboard</h1>
          <div className="flex items-center gap-3 mt-1.5 flex-wrap">
            <p className="text-xs text-zinc-400">Logged in as admin.genm@gmail.com</p>
            <span className="text-zinc-700">•</span>
            <span className="inline-flex items-center gap-1.5 text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Live Synced {lastRefreshed && `(${lastRefreshed})`}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={() => refreshData()}
            disabled={isRefreshing}
            className="px-3.5 py-2 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-mono text-zinc-300 hover:text-yellow-400 hover:border-yellow-400 transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-50"
            title="Refresh now"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin text-yellow-400" : ""}`} />
            <span>{isRefreshing ? "Syncing..." : "Refresh"}</span>
          </button>
          <Link
            href="/admin/bookings"
            className="px-4 py-2.5 rounded-full bg-yellow-400 text-black font-bold text-xs uppercase tracking-wider hover:bg-yellow-300 transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <Calendar className="w-4 h-4" /> Bookings ({bookings.length})
          </Link>
          <Link
            href="/admin/enquiries"
            className="px-4 py-2.5 rounded-full bg-zinc-900 border border-zinc-700 text-xs font-semibold text-white hover:border-yellow-400 transition-colors flex items-center gap-1.5"
          >
            <Inbox className="w-4 h-4 text-yellow-400" />
            <span>Messages & Leads ({inquiries.length})</span>
          </Link>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <div
              key={i}
              className="p-6 rounded-2xl bg-zinc-950 border border-zinc-800/80 flex flex-col justify-between gap-4"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider">{card.title}</span>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center border ${card.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div>
                <span className="text-3xl font-black font-mono text-white block">{card.value}</span>
                <span className="text-[11px] font-mono text-zinc-500">{card.sub}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* HIGHLIGHTED SECTION: This Month Profit & Financial Performance in Rupees (₹) */}
      <div className="p-6 md:p-8 rounded-3xl bg-zinc-950 border border-emerald-500/30 shadow-2xl relative overflow-hidden flex flex-col gap-6">
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-900 pb-5">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-inner">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                  {stats?.currentMonthName || "This Month"} Financials (₹ INR)
                </span>
              </div>
              <h2 className="text-2xl font-black text-white tracking-tight mt-1">
                Company Profit & Revenue Breakdown
              </h2>
              <p className="text-xs text-zinc-400 mt-0.5">
                Calculated in Indian Rupees (₹) based on verified client invoices, collections, and recorded monthly expenses.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <Link
              href="/admin/expenses"
              className="px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/30 text-xs font-mono text-red-400 hover:bg-red-500/20 transition-colors flex items-center gap-1.5"
            >
              <Receipt className="w-3.5 h-3.5" /> Manage Expenses
            </Link>
            <Link
              href="/admin/invoices"
              className="px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs font-mono text-zinc-300 hover:text-yellow-400 hover:border-yellow-400 transition-colors flex items-center gap-1.5"
            >
              <Receipt className="w-3.5 h-3.5" /> Invoices
            </Link>
            <Link
              href="/admin/payments"
              className="px-4 py-2 rounded-xl bg-emerald-400 text-black font-bold text-xs uppercase tracking-wider hover:bg-emerald-300 transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <Wallet className="w-3.5 h-3.5" /> All Payments (₹)
            </Link>
          </div>
        </div>

        {/* 3 Metric Cards for Profit, Gross, and Costs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="p-5 rounded-2xl bg-zinc-900/70 border border-emerald-500/30 flex flex-col justify-between gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-emerald-400 font-bold uppercase tracking-wider">
                This Month Net Profit
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30">
                {stats?.profitMarginPercent || 0}% Net Margin
              </span>
            </div>
            <div>
              <span className="text-3xl sm:text-4xl font-black font-mono text-emerald-400 block tracking-tight">
                ₹{(stats?.monthlyProfit || 0).toLocaleString('en-IN')}
              </span>
              <p className="text-[11px] text-zinc-400 mt-1.5">
                Real company earnings: Revenue (₹{(stats?.monthlyRevenue || 0).toLocaleString('en-IN')}) minus Monthly Expenses (₹{(stats?.monthlyExpenses || 0).toLocaleString('en-IN')}).
              </p>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-zinc-900/50 border border-zinc-800 flex flex-col justify-between gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-yellow-400 font-bold uppercase tracking-wider">
                Gross Cleared Collections
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-yellow-400/10 text-yellow-400 font-semibold border border-yellow-400/20">
                This Month
              </span>
            </div>
            <div>
              <span className="text-3xl sm:text-4xl font-black font-mono text-white block tracking-tight">
                ₹{(stats?.monthlyRevenue || 0).toLocaleString('en-IN')}
              </span>
              <p className="text-[11px] text-zinc-400 mt-1.5">
                Total milestone collections cleared this calendar month. All-time revenue: <strong className="text-zinc-200">₹{(stats?.totalRevenue || 0).toLocaleString('en-IN')}</strong>
              </p>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-zinc-900/50 border border-zinc-800 flex flex-col justify-between gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-red-400 font-bold uppercase tracking-wider">
                Monthly Expenses
              </span>
              <Link 
                href="/admin/expenses" 
                className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-red-500/10 text-red-400 font-semibold border border-red-500/20 hover:bg-red-500/20 transition-colors flex items-center gap-1"
              >
                + Add / View <ArrowUpRight className="w-2.5 h-2.5" />
              </Link>
            </div>
            <div>
              <span className="text-3xl sm:text-4xl font-black font-mono text-red-400 block tracking-tight">
                ₹{(stats?.monthlyExpenses || 0).toLocaleString('en-IN')}
              </span>
              <p className="text-[11px] text-zinc-400 mt-1.5">
                Hosting, software licenses, domain renewals, and operational expenses. Lifetime: <strong className="text-zinc-300">₹{(stats?.totalExpenses || 0).toLocaleString('en-IN')}</strong>
              </p>
            </div>
          </div>
        </div>

        {/* Recent Cleared Client Transactions in Rupees */}
        {payments.length > 0 && (
          <div className="pt-3 border-t border-zinc-900/90 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Recent Verified Payments Received in Rupees (₹)
              </span>
              <span className="text-[11px] font-mono text-zinc-500">
                {payments.filter(p => p.status === 'success').length} verified transactions
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {payments.slice(0, 3).map((pmt) => (
                <div
                  key={pmt.id}
                  className="p-3.5 rounded-xl bg-zinc-900/40 border border-zinc-800/80 flex items-center justify-between hover:border-zinc-700 transition-colors"
                >
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs font-bold text-white truncate">
                      {pmt.payerName || pmt.clientName}
                    </span>
                    <span className="text-[10px] font-mono text-zinc-500">
                      {pmt.paymentMethod || pmt.method?.toUpperCase() || "UPI / NETBANKING"} • {pmt.invoiceNumber}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-mono font-extrabold text-emerald-400 block">
                      +₹{pmt.amount.toLocaleString('en-IN')}
                    </span>
                    <span className="text-[9px] font-mono text-emerald-500/80">CLEARED</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* PROMINENT SECTION 1: Client Bookings & Discovery Consultations */}
      <div className="p-6 md:p-8 rounded-3xl bg-zinc-950 border border-zinc-800 flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-900 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-yellow-400/10 border border-yellow-400/20 flex items-center justify-center text-yellow-400">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                Consultation Bookings
                <span className="px-2.5 py-0.5 rounded-full text-xs font-mono bg-yellow-400/10 text-yellow-400 border border-yellow-400/30">
                  {bookings.length} Booked
                </span>
              </h2>
              <p className="text-xs text-zinc-400">Clients who scheduled a consultation meeting via the Book Consultation flow.</p>
            </div>
          </div>
          <Link href="/admin/bookings" className="text-xs font-mono text-yellow-400 hover:underline flex items-center gap-1">
            Open Full Calendar ({bookings.length}) <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {bookings.length === 0 ? (
          <div className="py-12 text-center text-zinc-500 font-mono text-xs">
            No consultations booked yet. New bookings submitted on the site will appear here instantly.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {bookings.map((b) => (
              <div
                key={b.id}
                className="p-5 rounded-2xl bg-zinc-900/70 border border-zinc-800 hover:border-zinc-700 transition-all flex flex-col justify-between gap-4"
              >
                <div className="flex flex-col gap-3">
                  {/* Top Bar: Name, Company, Status */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <span className="text-base font-bold text-white">{b.name}</span>
                        {b.company && (
                          <span className="text-xs font-mono text-zinc-400 flex items-center gap-1">
                            <Building className="w-3 h-3 text-zinc-500" /> {b.company}
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-yellow-400 font-medium">{b.service}</span>
                    </div>

                    <select
                      value={b.status}
                      onChange={(e) => handleBookingStatus(b.id, e.target.value)}
                      className={`text-[10px] font-mono font-bold uppercase rounded-lg px-2.5 py-1 border transition-colors focus:outline-none ${
                        b.status === "confirmed"
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                          : b.status === "completed"
                            ? "bg-blue-500/10 text-blue-400 border-blue-500/30"
                            : "bg-amber-500/10 text-amber-400 border-amber-500/30"
                      }`}
                    >
                      <option value="new">NEW</option>
                      <option value="confirmed">CONFIRMED</option>
                      <option value="completed">COMPLETED</option>
                      <option value="cancelled">CANCELLED</option>
                    </select>
                  </div>

                  {/* Date & Time Highlight */}
                  <div className="p-2.5 rounded-xl bg-black/60 border border-zinc-800/80 flex items-center justify-between text-xs font-mono">
                    <span className="text-yellow-400 font-bold flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" /> {b.date}
                    </span>
                    <span className="text-zinc-300 font-semibold flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-zinc-500" /> {b.time} UTC
                    </span>
                  </div>

                  {/* Contact Info */}
                  <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-300">
                    <span className="flex items-center gap-1.5 bg-zinc-950 px-2.5 py-1 rounded-lg border border-zinc-800">
                      <Mail className="w-3.5 h-3.5 text-yellow-400" />
                      <span className="break-all">{b.email}</span>
                    </span>
                    {b.phone && (
                      <a
                        href={`tel:${b.phone}`}
                        className="flex items-center gap-1.5 bg-zinc-950 hover:bg-zinc-800 px-2.5 py-1 rounded-lg border border-zinc-800 text-yellow-400 transition-colors"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>{b.phone}</span>
                      </a>
                    )}
                  </div>

                  {/* Notes / Message */}
                  {b.notes && (
                    <div className="p-3 rounded-xl bg-black/40 border border-zinc-800/60 text-xs text-zinc-400 italic">
                      &ldquo;{b.notes}&rdquo;
                    </div>
                  )}
                </div>

                {/* Footer Meeting Action */}
                <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between">
                  <span className="text-[11px] font-mono text-zinc-500 capitalize">
                    Platform: {b.meetingType ? b.meetingType.replace('_', ' ') : 'Google Meet'}
                  </span>
                  {b.meetingLink && (
                    <a
                      href={b.meetingLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-yellow-400 hover:text-black text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
                    >
                      <Video className="w-3.5 h-3.5" />
                      <span>Join Meeting</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* PROMINENT SECTION 2: Inbound Leads & Contact Enquiries */}
      <div className="p-6 md:p-8 rounded-3xl bg-zinc-950 border border-zinc-800 flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-900 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-yellow-400/10 border border-yellow-400/20 flex items-center justify-center text-yellow-400">
              <Inbox className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                Inbound Project Enquiries & Messages
                <span className="px-2.5 py-0.5 rounded-full text-xs font-mono bg-yellow-400/10 text-yellow-400 border border-yellow-400/30">
                  {inquiries.length} Enquiries
                </span>
              </h2>
              <p className="text-xs text-zinc-400">Form submissions from the Website Home, Contact, and Start Project pages.</p>
            </div>
          </div>
          <Link href="/admin/enquiries" className="text-xs font-mono text-yellow-400 hover:underline flex items-center gap-1">
            View All Enquiries ({inquiries.length}) <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {inquiries.length === 0 ? (
          <div className="py-12 text-center text-zinc-500 font-mono text-xs">
            No inbound enquiries logged yet.
          </div>
        ) : (
          <div className="divide-y divide-zinc-900">
            {inquiries.slice(0, 5).map((enq) => (
              <div key={enq.id} className="py-5 first:pt-0 last:pb-0 flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="flex flex-col gap-2 max-w-3xl">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-base font-bold text-white">{enq.name}</span>
                    {enq.company && (
                      <span className="text-xs font-mono text-yellow-400">@{enq.company}</span>
                    )}
                    <span className="text-zinc-600">•</span>
                    <span className="text-xs text-zinc-400 font-medium">{enq.service}</span>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-400">
                    <span className="flex items-center gap-1">
                      <Mail className="w-3.5 h-3.5 text-zinc-500" /> {enq.email}
                    </span>
                    {enq.phone && (
                      <a href={`tel:${enq.phone}`} className="flex items-center gap-1 text-yellow-400 hover:underline">
                        <Phone className="w-3.5 h-3.5" /> {enq.phone}
                      </a>
                    )}
                    {enq.timeline && (
                      <span className="text-zinc-500 font-mono">
                        Timeline: <strong className="text-zinc-300">{enq.timeline}</strong>
                      </span>
                    )}
                  </div>

                  {enq.message && (
                    <div className="p-3.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-200 leading-relaxed font-sans shadow-inner">
                      <div className="flex items-center gap-1.5 text-[11px] font-mono uppercase text-yellow-400 font-bold mb-1.5">
                        <MessageSquare className="w-3.5 h-3.5 text-yellow-400" />
                        <span>Client Message / Requirements:</span>
                      </div>
                      <p className="text-zinc-300 whitespace-pre-wrap">{enq.message}</p>
                    </div>
                  )}
                  {enq.createdAt && (
                    <span className="text-[10px] font-mono text-zinc-500">
                      Received: {new Date(enq.createdAt).toLocaleString()}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3 self-start">
                  <select
                    value={enq.status}
                    onChange={(e) => handleEnquiryStatus(enq.id, e.target.value)}
                    className="bg-zinc-900 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs text-zinc-300 font-mono focus:outline-none focus:border-yellow-400"
                  >
                    <option value="new">NEW</option>
                    <option value="contacted">CONTACTED</option>
                    <option value="converted">CONVERTED</option>
                    <option value="archived">ARCHIVED</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Main Two-Column Layout for Projects & Shortcuts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Recent Projects */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="p-6 md:p-8 rounded-3xl bg-zinc-950 border border-zinc-800 flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FolderGit2 className="w-5 h-5 text-yellow-400" />
                <h3 className="text-lg font-bold text-white">Active Projects in Delivery</h3>
              </div>
              <Link href="/admin/projects" className="text-xs font-mono text-yellow-400 hover:underline">
                View All ({projects.length}) →
              </Link>
            </div>

            <div className="divide-y divide-zinc-900">
              {projects.slice(0, 4).map((p) => (
                <div key={p.id} className="py-4 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-white">{p.name}</span>
                      <span className="text-[10px] font-mono text-zinc-500">({p.projectId})</span>
                    </div>
                    <span className="text-xs text-zinc-400">{p.clientCompany || p.clientName} • {p.serviceName}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-zinc-900 border border-zinc-700 text-yellow-400">
                      {p.status}
                    </span>
                    <Link
                      href="/admin/projects"
                      className="p-1.5 rounded-lg text-zinc-400 hover:text-white transition-colors"
                    >
                      <ArrowUpRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Quick Management Shortcuts */}
        <div className="flex flex-col gap-6">
          <div className="p-6 rounded-3xl bg-zinc-950 border border-zinc-800 flex flex-col gap-4">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-500">Quick Actions</span>
            <div className="flex flex-col gap-2">
              <Link
                href="/admin/projects"
                className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-yellow-400/60 text-xs font-semibold text-zinc-200 transition-colors flex items-center justify-between"
              >
                <span>Add / Manage Client Projects</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-yellow-400" />
              </Link>
              <Link
                href="/admin/invoices"
                className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-yellow-400/60 text-xs font-semibold text-zinc-200 transition-colors flex items-center justify-between"
              >
                <span>Create & Dispatch Invoices</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-yellow-400" />
              </Link>
              <Link
                href="/admin/cms"
                className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-yellow-400/60 text-xs font-semibold text-zinc-200 transition-colors flex items-center justify-between"
              >
                <span>Edit CMS Services & Deliverables</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-yellow-400" />
              </Link>
              <Link
                href="/admin/email-logs"
                className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-yellow-400/60 text-xs font-semibold text-zinc-200 transition-colors flex items-center justify-between"
              >
                <span>Audit Email Dispatch Logs</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-yellow-400" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
