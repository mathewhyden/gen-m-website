"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { 
  Receipt, 
  Plus, 
  Search, 
  ExternalLink, 
  CheckCircle2, 
  Clock, 
  Trash2, 
  X,
  CreditCard
} from "lucide-react";
import { Invoice } from "@/lib/types";

export default function AdminInvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [notification, setNotification] = useState("");

  const [newInv, setNewInv] = useState({
    projectId: "proj-1",
    projectName: "Apex Real Estate Platform",
    clientName: "Sindhu",
    clientEmail: "sindhu@hebeart.com",
    clientCompany: "Apex Group",
    description: "Phase 1 - Frontend Architecture & Design Milestone",
    amount: 5000,
    dueDate: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
  });

  const fetchInvoices = () => {
    fetch("/api/invoices")
      .then(res => res.json())
      .then(data => {
        if (data.invoices) setInvoices(data.invoices);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const handleCreateInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId: newInv.projectId,
          projectName: newInv.projectName,
          clientName: newInv.clientName,
          clientEmail: newInv.clientEmail,
          clientCompany: newInv.clientCompany,
          items: [
            {
              description: newInv.description,
              quantity: 1,
              unitPrice: Number(newInv.amount),
              amount: Number(newInv.amount),
            }
          ],
          dueDate: newInv.dueDate,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create invoice");

      setShowAddModal(false);
      setNotification(`Invoice ${data.invoice.invoiceNumber} generated!`);
      fetchInvoices();
    } catch (err: any) {
      alert(err.message || "Failed to generate invoice");
    }
  };

  const handleStatusChange = async (id: string, status: string) => {
    try {
      const res = await fetch(`/api/invoices/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        setNotification(`Invoice status updated to ${status}`);
        fetchInvoices();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filtered = invoices.filter(inv =>
    inv.invoiceNumber.toLowerCase().includes(search.toLowerCase()) ||
    inv.clientName?.toLowerCase().includes(search.toLowerCase()) ||
    inv.projectName?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-yellow-400 block mb-1">
            Financial Clearing & Invoicing
          </span>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Invoices & Billing</h1>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-5 py-2.5 rounded-full bg-yellow-400 text-black font-bold text-xs uppercase tracking-wider hover:bg-yellow-300 transition-colors flex items-center gap-2 cursor-pointer shadow-sm self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[3]" /> Generate Invoice
        </button>
      </div>

      {notification && (
        <div className="p-4 rounded-xl bg-yellow-400/10 border border-yellow-400/30 text-yellow-300 text-xs font-mono flex items-center justify-between">
          <span>{notification}</span>
          <button onClick={() => setNotification("")} className="text-yellow-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search by invoice number or client..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-zinc-950 border border-zinc-800 rounded-full py-2 pl-10 pr-4 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-yellow-400"
        />
      </div>

      <div className="rounded-3xl bg-zinc-950 border border-zinc-800 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs font-mono text-zinc-500">Loading invoice statements...</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-xs font-mono text-zinc-500">No invoices issued.</div>
        ) : (
          <div className="divide-y divide-zinc-900">
            {filtered.map((inv) => (
              <div key={inv.id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-zinc-900/40 transition-colors">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-3">
                    <span className="text-base font-mono font-bold text-white">{inv.invoiceNumber}</span>
                    <span className={`px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                      inv.status === "PAID"
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                        : "bg-amber-500/10 text-amber-400 border border-amber-500/30"
                    }`}>
                      {inv.status}
                    </span>
                  </div>
                  <span className="text-xs text-zinc-300">
                    {inv.projectName} — <strong className="text-white">{inv.clientCompany || inv.clientName}</strong> ({inv.clientEmail})
                  </span>
                  <span className="text-[11px] font-mono text-zinc-500">
                    Issued: {inv.issueDate} | Due: {inv.dueDate} | {inv.items[0]?.description}
                  </span>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <span className="text-lg font-mono font-bold text-white block">
                      ${(inv.totalAmount || inv.total || 0).toLocaleString()}
                    </span>
                    <span className="text-[10px] font-mono text-zinc-500">{inv.currency}</span>
                  </div>

                  <select
                    value={inv.status}
                    onChange={(e) => handleStatusChange(inv.id, e.target.value)}
                    className="bg-zinc-900 border border-zinc-800 rounded-lg px-2.5 py-2 text-xs text-zinc-300 font-mono focus:outline-none focus:border-yellow-400"
                  >
                    <option value="DRAFT">DRAFT</option>
                    <option value="SENT">SENT</option>
                    <option value="PAID">PAID</option>
                    <option value="CANCELLED">CANCELLED</option>
                  </select>

                  <Link
                    href={`/client/invoice/${inv.id}`}
                    target="_blank"
                    className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-yellow-400 transition-colors"
                    title="Open Invoice View"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Custom Invoice Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-lg w-full bg-zinc-950 border border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-white">Generate Client Invoice</h3>
              <button onClick={() => setShowAddModal(false)} className="text-zinc-500 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateInvoice} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-mono text-zinc-400 uppercase">Project Title *</label>
                <input
                  type="text"
                  required
                  value={newInv.projectName}
                  onChange={(e) => setNewInv({ ...newInv, projectName: e.target.value })}
                  className="bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-yellow-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] font-mono text-zinc-400 uppercase">Client Name *</label>
                  <input
                    type="text"
                    required
                    value={newInv.clientName}
                    onChange={(e) => setNewInv({ ...newInv, clientName: e.target.value })}
                    className="bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-yellow-400"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] font-mono text-zinc-400 uppercase">Client Email *</label>
                  <input
                    type="email"
                    required
                    value={newInv.clientEmail}
                    onChange={(e) => setNewInv({ ...newInv, clientEmail: e.target.value })}
                    className="bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-yellow-400"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-mono text-zinc-400 uppercase">Line Item Description *</label>
                <input
                  type="text"
                  required
                  value={newInv.description}
                  onChange={(e) => setNewInv({ ...newInv, description: e.target.value })}
                  className="bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-yellow-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] font-mono text-zinc-400 uppercase">Amount (USD) *</label>
                  <input
                    type="number"
                    required
                    value={newInv.amount}
                    onChange={(e) => setNewInv({ ...newInv, amount: Number(e.target.value) })}
                    className="bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-yellow-400"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] font-mono text-zinc-400 uppercase">Due Date *</label>
                  <input
                    type="date"
                    required
                    value={newInv.dueDate}
                    onChange={(e) => setNewInv({ ...newInv, dueDate: e.target.value })}
                    className="bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-yellow-400"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-full text-xs font-mono text-zinc-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full bg-yellow-400 text-black font-bold text-xs uppercase tracking-wider hover:bg-yellow-300 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Receipt className="w-3.5 h-3.5" /> Issue Invoice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
