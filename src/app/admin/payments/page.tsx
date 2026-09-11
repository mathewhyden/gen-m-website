"use client";

import React, { useEffect, useState } from "react";
import { 
  Search, 
  Plus, 
  RefreshCw, 
  Copy, 
  Check, 
  X,
  WalletCards,
  Trash2
} from "lucide-react";
import { Payment } from "@/lib/types";

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Modal State for Admin Manual Payment Entry
  const [showAddModal, setShowAddModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [newClientName, setNewClientName] = useState("");
  const [newClientEmail, setNewClientEmail] = useState("");
  const [newClientPhone, setNewClientPhone] = useState("");
  const [newProjectTitle, setNewProjectTitle] = useState("");
  const [newTotalFee, setNewTotalFee] = useState<number | "">("");
  const [newAmountPaid, setNewAmountPaid] = useState<number | "">("");
  const [newPaymentMethod, setNewPaymentMethod] = useState("UPI");
  const [newUtrNumber, setNewUtrNumber] = useState("");
  const [newNotes, setNewNotes] = useState("");
  const [newStatus, setNewStatus] = useState("Advance Received");

  const fetchPayments = () => {
    setLoading(true);
    fetch("/api/payments")
      .then(res => res.json())
      .then(data => {
        if (data.payments) setPayments(data.payments);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDeletePayment = async (id: string, clientName?: string) => {
    if (!confirm(`Are you sure you want to remove the payment entry for ${clientName || "this client"}?`)) {
      return;
    }
    try {
      const res = await fetch(`/api/payments?id=${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        fetchPayments();
      }
    } catch (err) {
      console.error("Failed to delete payment:", err);
    }
  };

  const handleStatusChange = async (id: string, newBadge: string) => {
    try {
      const res = await fetch("/api/payments", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          id, 
          status: newBadge,
          paymentStatusBadge: newBadge 
        }),
      });
      if (res.ok) fetchPayments();
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    const feeNum = Number(newTotalFee);
    const paidNum = Number(newAmountPaid);

    if (isNaN(feeNum) || feeNum <= 0) {
      alert("Please enter a valid total project fee in Rupees (₹)");
      return;
    }
    if (isNaN(paidNum) || paidNum <= 0) {
      alert("Please enter a valid advance or paid amount in Rupees (₹)");
      return;
    }

    setSubmitting(true);

    const balanceDue = Math.max(0, feeNum - paidNum);
    const badge = newStatus || (balanceDue <= 0 ? "Fully Paid" : "Advance Received");

    try {
      const res = await fetch("/api/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientName: newClientName.trim(),
          clientEmail: newClientEmail.trim() || "client@gen-m.com",
          clientPhone: newClientPhone.trim(),
          projectTitle: newProjectTitle.trim() || "Custom Web Development",
          totalFee: feeNum,
          amount: paidNum,
          balanceDue,
          paymentMethod: newPaymentMethod,
          gateway: newPaymentMethod === "UPI" ? "UPI_QR" : "BANK_NEFT",
          utrNumber: newUtrNumber.trim() || `MANUAL-${Date.now()}`,
          notes: newNotes.trim() || "Recorded manually by administrator",
          status: badge,
        }),
      });

      if (res.ok) {
        setShowAddModal(false);
        // Reset form
        setNewClientName("");
        setNewClientEmail("");
        setNewClientPhone("");
        setNewProjectTitle("");
        setNewTotalFee("");
        setNewAmountPaid("");
        setNewUtrNumber("");
        setNewNotes("");
        fetchPayments();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  // Financial Computations
  const totalCollected = payments.reduce((acc, p) => acc + (Number(p.amount) || Number(p.advancePaid) || 0), 0);
  const totalPipeline = payments.reduce((acc, p) => acc + (Number(p.totalFee) || Number(p.amount) || 0), 0);
  const totalDue = payments.reduce((acc, p) => {
    const fee = Number(p.totalFee) || Number(p.amount) || 0;
    const paid = Number(p.amount) || Number(p.advancePaid) || 0;
    return acc + Math.max(0, p.balanceDue !== undefined ? Number(p.balanceDue) : fee - paid);
  }, 0);

  const filtered = payments.filter(p => {
    const term = search.toLowerCase();
    const matchesSearch = 
      (p.clientName && p.clientName.toLowerCase().includes(term)) ||
      (p.payerName && p.payerName.toLowerCase().includes(term)) ||
      (p.projectTitle && p.projectTitle.toLowerCase().includes(term)) ||
      (p.utrNumber && p.utrNumber.toLowerCase().includes(term)) ||
      (p.transactionRef && p.transactionRef.toLowerCase().includes(term)) ||
      (p.transactionId && p.transactionId.toLowerCase().includes(term));

    const pBadge = (p.paymentStatusBadge || p.status || "").toLowerCase();
    const matchesStatus = 
      statusFilter === "ALL" || 
      pBadge === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="flex flex-col gap-8 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-yellow-400 block mb-1">
            Financials & Invoicing Command
          </span>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Payments & Financials</h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchPayments}
            className="p-2.5 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-yellow-400 transition-colors"
            title="Refresh Ledger"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-yellow-400" : ""}`} />
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2.5 rounded-full bg-yellow-400 text-black font-bold text-xs uppercase tracking-wider hover:bg-yellow-300 transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Record Payment / Advance</span>
          </button>
        </div>
      </div>

      {/* Financial Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-6 rounded-3xl bg-zinc-950 border border-zinc-800 flex flex-col gap-1 shadow-sm">
          <span className="text-xs font-mono text-zinc-400 uppercase">Total Collected (Cash Flow)</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl font-black font-mono text-emerald-400">
              ₹{totalCollected.toLocaleString('en-IN')}
            </span>
          </div>
          <span className="text-[11px] font-mono text-zinc-500 mt-1">Advances + Milestone settlements</span>
        </div>

        <div className="p-6 rounded-3xl bg-zinc-950 border border-zinc-800 flex flex-col gap-1 shadow-sm">
          <span className="text-xs font-mono text-amber-400 uppercase">Receivables / Balance Due</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl font-black font-mono text-amber-400">
              ₹{totalDue.toLocaleString('en-IN')}
            </span>
          </div>
          <span className="text-[11px] font-mono text-zinc-500 mt-1">Pending client handover balance</span>
        </div>

        <div className="p-6 rounded-3xl bg-zinc-950 border border-zinc-800 flex flex-col gap-1 shadow-sm">
          <span className="text-xs font-mono text-zinc-400 uppercase">Total Contracted Pipeline</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl font-black font-mono text-white">
              ₹{totalPipeline.toLocaleString('en-IN')}
            </span>
          </div>
          <span className="text-[11px] font-mono text-zinc-500 mt-1">Gross signed project valuation</span>
        </div>

        <div className="p-6 rounded-3xl bg-zinc-950 border border-zinc-800 flex flex-col gap-1 shadow-sm">
          <span className="text-xs font-mono text-blue-400 uppercase">Transactions Count</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl font-black font-mono text-blue-400">
              {payments.length}
            </span>
          </div>
          <span className="text-[11px] font-mono text-zinc-500 mt-1">Synchronized with Firestore</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center">
        <div className="relative max-w-md w-full">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by client, project, UTR, or reference number..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-full py-2.5 pl-10 pr-4 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-yellow-400 transition-colors"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: "ALL", label: "ALL" },
            { id: "advance received", label: "Advance Received" },
            { id: "fully paid", label: "Fully Paid" },
            { id: "payment pending", label: "Payment Pending" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-mono uppercase font-bold transition-colors cursor-pointer whitespace-nowrap ${
                statusFilter.toLowerCase() === tab.id.toLowerCase()
                  ? "bg-yellow-400 text-black shadow-sm"
                  : "bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Transactions List */}
      <div className="rounded-3xl bg-zinc-950 border border-zinc-800 overflow-hidden shadow-sm">
        {loading && payments.length === 0 ? (
          <div className="p-16 text-center text-xs font-mono text-zinc-500 flex flex-col items-center gap-3">
            <RefreshCw className="w-6 h-6 animate-spin text-yellow-400" />
            <span>Fetching payment transactions from Firestore...</span>
          </div>
        ) : payments.length === 0 ? (
          <div className="p-16 text-center flex flex-col items-center justify-center gap-4">
            <div className="w-16 h-16 rounded-3xl bg-yellow-400/10 border border-yellow-400/20 flex items-center justify-center text-yellow-400 shadow-inner">
              <WalletCards className="w-8 h-8" />
            </div>
            <div className="max-w-md flex flex-col gap-1.5">
              <h3 className="text-base font-bold text-white tracking-tight">No Payment Records Yet</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                The payments ledger is currently empty. As clients complete UPI transfers or you log client advance payments, verified transactions will appear here live.
              </p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="mt-2 px-5 py-2.5 rounded-full bg-yellow-400 text-black font-bold text-xs uppercase tracking-wider hover:bg-yellow-300 transition-colors flex items-center gap-2 cursor-pointer shadow-sm"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>+ Record Payment / Advance</span>
            </button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-16 text-center text-xs font-mono text-zinc-500 flex flex-col items-center gap-2">
            <span>No payment records found matching your filters.</span>
            <button
              onClick={() => { setSearch(""); setStatusFilter("ALL"); }}
              className="text-xs text-yellow-400 underline hover:text-yellow-300 cursor-pointer"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="divide-y divide-zinc-900">
            {filtered.map((p) => {
              const client = p.clientName || p.payerName || "Valued Client";
              const project = p.projectTitle || "Enterprise Technology Project";
              const fee = Number(p.totalFee) || Number(p.amount) || 0;
              const paid = Number(p.amount) || Number(p.advancePaid) || 0;
              const balance = p.balanceDue !== undefined ? Number(p.balanceDue) : Math.max(0, fee - paid);
              const utr = p.utrNumber || p.transactionRef || p.transactionId || p.paymentId || "N/A";
              const badge = p.paymentStatusBadge || p.status || (balance <= 0 ? "Fully Paid" : "Advance Received");
              const isFull = badge.toLowerCase().includes("fully") || balance <= 0;
              const isPending = badge.toLowerCase().includes("pending");

              return (
                <div 
                  key={p.id}
                  className="p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-6 hover:bg-zinc-900/40 transition-colors"
                >
                  {/* Left info: Client, Project, UTR */}
                  <div className="flex flex-col gap-2 max-w-2xl">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-base font-bold text-white">{client}</span>
                      <span className="text-zinc-600">•</span>
                      <span className="text-xs font-medium text-yellow-400">{project}</span>
                    </div>

                    <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs font-mono text-zinc-400">
                      <div className="flex items-center gap-1.5">
                        <span className="text-zinc-500">UTR / Ref:</span>
                        <span className="text-yellow-400 font-bold bg-yellow-400/10 px-2 py-0.5 rounded border border-yellow-400/20">
                          {utr}
                        </span>
                        <button
                          onClick={() => handleCopy(utr, p.id)}
                          className="p-1 hover:text-white transition-colors"
                          title="Copy Reference"
                        >
                          {copiedId === p.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-zinc-500" />}
                        </button>
                      </div>

                      <span className="text-zinc-500">Method: <strong className="text-zinc-300">{p.paymentMethod || p.method || "UPI"}</strong></span>
                      <span className="text-zinc-500">{new Date(p.timestamp || p.createdAt).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })}</span>
                    </div>

                    {p.notes && (
                      <p className="text-xs text-zinc-400 italic bg-zinc-900/60 p-2.5 rounded-xl border border-zinc-800/80">
                        &ldquo;{p.notes}&rdquo;
                      </p>
                    )}
                  </div>

                  {/* Financial Breakdown (Fee, Advance, Balance, Status) */}
                  <div className="flex flex-wrap lg:flex-nowrap items-center gap-6 lg:gap-8 flex-shrink-0">
                    {/* Fee & Advance Columns */}
                    <div className="flex items-center gap-6 font-mono text-xs">
                      <div className="flex flex-col">
                        <span className="text-[10px] uppercase text-zinc-500">Total Project Fee</span>
                        <span className="text-sm font-bold text-white">₹{fee.toLocaleString('en-IN')}</span>
                      </div>

                      <div className="flex flex-col">
                        <span className="text-[10px] uppercase text-emerald-400 font-semibold">Advance / Paid</span>
                        <span className="text-sm font-bold text-emerald-400">₹{paid.toLocaleString('en-IN')}</span>
                      </div>

                      <div className="flex flex-col">
                        <span className="text-[10px] uppercase text-amber-400 font-semibold">Balance Due</span>
                        <span className={`text-sm font-bold ${balance <= 0 ? "text-zinc-500" : "text-amber-400"}`}>
                          ₹{balance.toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>

                    {/* Status Badge & Dropdown Selector */}
                    <div className="flex items-center gap-2">
                      <select
                        value={isFull ? "Fully Paid" : isPending ? "Payment Pending" : "Advance Received"}
                        onChange={(e) => handleStatusChange(p.id, e.target.value)}
                        className={`rounded-xl px-3 py-2 text-xs font-mono font-bold uppercase focus:outline-none cursor-pointer transition-colors border ${
                          isFull
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                            : isPending
                              ? "bg-red-500/10 text-red-400 border-red-500/30"
                              : "bg-amber-500/10 text-amber-400 border-amber-500/30"
                        }`}
                      >
                        <option value="Advance Received" className="bg-zinc-900 text-amber-400">Advance Received</option>
                        <option value="Fully Paid" className="bg-zinc-900 text-emerald-400">Fully Paid</option>
                        <option value="Payment Pending" className="bg-zinc-900 text-red-400">Payment Pending</option>
                      </select>

                      <button
                        onClick={() => handleDeletePayment(p.id, client)}
                        className="p-2 rounded-xl text-zinc-600 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                        title="Delete payment record"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal: Record Client Payment / Advance Manually */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6 md:p-8 max-w-xl w-full flex flex-col gap-6 shadow-2xl my-8">
            <div className="flex items-center justify-between border-b border-zinc-900 pb-4">
              <div>
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-yellow-400 block mb-0.5">
                  Direct Ledger Entry
                </span>
                <h3 className="text-xl font-bold text-white">Record Client Payment / Advance</h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-2 rounded-xl bg-zinc-900 text-zinc-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddPayment} className="flex flex-col gap-4 text-xs font-mono">
              <div className="flex flex-col gap-1">
                <label className="text-zinc-400 uppercase">Client Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Client or Company Name"
                  value={newClientName}
                  onChange={(e) => setNewClientName(e.target.value)}
                  className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-yellow-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-zinc-400 uppercase">Client Email</label>
                  <input
                    type="email"
                    placeholder="client@company.com"
                    value={newClientEmail}
                    onChange={(e) => setNewClientEmail(e.target.value)}
                    className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-yellow-400"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-zinc-400 uppercase">Client Phone / WA</label>
                  <input
                    type="text"
                    placeholder="+91 98401 23456"
                    value={newClientPhone}
                    onChange={(e) => setNewClientPhone(e.target.value)}
                    className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-yellow-400"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-zinc-400 uppercase">Project Title</label>
                <input
                  type="text"
                  placeholder="e.g. Full-Stack Web Platform"
                  value={newProjectTitle}
                  onChange={(e) => setNewProjectTitle(e.target.value)}
                  className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-yellow-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-zinc-400 uppercase">Total Project Fee (₹) *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder="e.g. 50000"
                    value={newTotalFee}
                    onChange={(e) => setNewTotalFee(e.target.value === "" ? "" : Number(e.target.value))}
                    className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-yellow-400"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-yellow-400 uppercase font-bold">Advance / Paid (₹) *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder="e.g. 25000"
                    value={newAmountPaid}
                    onChange={(e) => setNewAmountPaid(e.target.value === "" ? "" : Number(e.target.value))}
                    className="bg-zinc-900 border border-yellow-400/60 rounded-xl px-4 py-2.5 text-xs text-yellow-400 font-bold focus:outline-none focus:border-yellow-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-zinc-400 uppercase">Payment Channel</label>
                  <select
                    value={newPaymentMethod}
                    onChange={(e) => setNewPaymentMethod(e.target.value)}
                    className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-yellow-400 cursor-pointer"
                  >
                    <option value="UPI">UPI (GPay / PhonePe / QR)</option>
                    <option value="Bank Transfer">Bank Transfer (NEFT/IMPS)</option>
                    <option value="Card Gateway">Card / Online Gateway</option>
                    <option value="Cash / Offline">Cash / Cheque</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-zinc-400 uppercase">Status Badge</label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-yellow-400 cursor-pointer"
                  >
                    <option value="Advance Received">Advance Received</option>
                    <option value="Fully Paid">Fully Paid</option>
                    <option value="Payment Pending">Payment Pending</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-zinc-400 uppercase">Bank UTR / Transaction Reference *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. UPI-992102938472 or AXISN202409012"
                  value={newUtrNumber}
                  onChange={(e) => setNewUtrNumber(e.target.value)}
                  className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-yellow-400 focus:outline-none focus:border-yellow-400"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-zinc-400 uppercase">Notes / Milestone</label>
                <input
                  type="text"
                  placeholder="e.g. 50% mobilization deposit received"
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-yellow-400"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-900 mt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-5 py-2.5 rounded-full bg-zinc-900 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 rounded-full bg-yellow-400 text-black font-bold hover:bg-yellow-300 transition-colors cursor-pointer disabled:opacity-50"
                >
                  {submitting ? "Saving to Cloud..." : "Record in Cloud Database"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
