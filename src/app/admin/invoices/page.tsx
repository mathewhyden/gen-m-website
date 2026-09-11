"use client";

import React, { useEffect, useState, useRef } from "react";
import { 
  Receipt, 
  Plus, 
  Search, 
  Eye,
  Printer,
  Trash2, 
  X,
  Loader2,
  Building2,
  Calendar,
  Sparkles,
  IndianRupee
} from "lucide-react";
import { Invoice } from "@/lib/types";

interface FormLineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number | string;
  amount: number;
}

interface ProjectOption {
  id: string;
  name: string;
  clientName: string;
  clientEmail: string;
  clientCompany?: string;
  amount?: number;
  budget?: string;
}

export default function AdminInvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [projects, setProjects] = useState<ProjectOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [notification, setNotification] = useState("");
  
  // Submission lock to prevent duplicate invoice generation
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isSubmittingRef = useRef(false);

  const createInitialLineItem = (): FormLineItem => ({
    id: `item-${Date.now()}`,
    description: "Full-Stack Web & Digital Engineering Milestone",
    quantity: 1,
    unitPrice: 45000,
    amount: 45000,
  });

  const createInitialInvoiceState = () => ({
    projectId: "",
    projectName: "",
    clientName: "",
    clientEmail: "",
    clientCompany: "",
    clientAddress: "",
    items: [createInitialLineItem()],
    subtotal: 45000,
    tax: 0,
    discount: 0,
    total: 45000 as number | string,
    isCustomTotal: false,
    dueDate: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
    notes: "Payment is due within 14 calendar days via Bank NEFT / IMPS or UPI.",
  });

  const [newInv, setNewInv] = useState(createInitialInvoiceState());

  const fetchInvoices = () => {
    fetch("/api/invoices")
      .then(res => res.json())
      .then(data => {
        if (data.invoices) setInvoices(data.invoices);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  const fetchProjects = () => {
    fetch("/api/projects")
      .then(res => res.json())
      .then(data => {
        if (data.projects) setProjects(data.projects);
      })
      .catch(() => {});
  };

  useEffect(() => {
    fetchInvoices();
    fetchProjects();
  }, []);

  const handleDeleteInvoice = async (id: string, invoiceNumber: string) => {
    if (!confirm(`Are you sure you want to delete invoice ${invoiceNumber}?`)) {
      return;
    }
    try {
      const res = await fetch(`/api/invoices?id=${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setNotification(`Invoice ${invoiceNumber} removed successfully.`);
        fetchInvoices();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Helper to calculate totals from items
  const recalculateFromItems = (
    items: FormLineItem[],
    taxVal: number | string,
    discountVal: number | string,
    isCustomTotal: boolean,
    currentTotal: number | string
  ) => {
    const sub = items.reduce((sum, it) => sum + (Number(it.amount) || 0), 0);
    const taxNum = Number(taxVal) || 0;
    const discNum = Number(discountVal) || 0;
    const computedTotal = Math.max(0, sub + taxNum - discNum);

    return {
      subtotal: sub,
      total: isCustomTotal ? currentTotal : computedTotal,
    };
  };

  // Update item description
  const handleItemDescriptionChange = (index: number, val: string) => {
    setNewInv(prev => {
      const updated = [...prev.items];
      updated[index] = { ...updated[index], description: val };
      return { ...prev, items: updated };
    });
  };

  // Update item quantity
  const handleItemQuantityChange = (index: number, val: string) => {
    const qty = val === "" ? 1 : Math.max(1, parseInt(val, 10) || 1);
    setNewInv(prev => {
      const updated = [...prev.items];
      const unit = Number(updated[index].unitPrice) || 0;
      updated[index] = {
        ...updated[index],
        quantity: qty,
        amount: qty * unit,
      };
      const { subtotal, total } = recalculateFromItems(
        updated,
        prev.tax,
        prev.discount,
        prev.isCustomTotal,
        prev.total
      );
      return { ...prev, items: updated, subtotal, total };
    });
  };

  // Update item unit price directly
  const handleItemUnitPriceChange = (index: number, val: string) => {
    const unitPrice = val === "" ? "" : Number(val);
    setNewInv(prev => {
      const updated = [...prev.items];
      const numericPrice = Number(unitPrice) || 0;
      const qty = updated[index].quantity || 1;
      updated[index] = {
        ...updated[index],
        unitPrice: unitPrice,
        amount: qty * numericPrice,
      };
      const { subtotal, total } = recalculateFromItems(
        updated,
        prev.tax,
        prev.discount,
        prev.isCustomTotal,
        prev.total
      );
      return { ...prev, items: updated, subtotal, total };
    });
  };

  // Add line item
  const handleAddLineItem = () => {
    setNewInv(prev => {
      const newItem: FormLineItem = {
        id: `item-${Date.now()}-${prev.items.length + 1}`,
        description: "Additional Deliverable & Deployment Support",
        quantity: 1,
        unitPrice: 15000,
        amount: 15000,
      };
      const updated = [...prev.items, newItem];
      const { subtotal, total } = recalculateFromItems(
        updated,
        prev.tax,
        prev.discount,
        prev.isCustomTotal,
        prev.total
      );
      return { ...prev, items: updated, subtotal, total };
    });
  };

  // Remove line item
  const handleRemoveLineItem = (index: number) => {
    if (newInv.items.length <= 1) return;
    setNewInv(prev => {
      const updated = prev.items.filter((_, i) => i !== index);
      const { subtotal, total } = recalculateFromItems(
        updated,
        prev.tax,
        prev.discount,
        prev.isCustomTotal,
        prev.total
      );
      return { ...prev, items: updated, subtotal, total };
    });
  };

  // When admin selects an existing project from dropdown
  const handleSelectProject = (projId: string) => {
    if (!projId) {
      setNewInv(prev => ({ ...prev, projectId: "" }));
      return;
    }
    const proj = projects.find(p => p.id === projId);
    if (!proj) return;

    const rawBudget = proj.budget || `₹${proj.amount || 75000}`;
    const parsedAmount = parseInt(rawBudget.replace(/[^0-9]/g, ''), 10) || 75000;

    const populatedItems: FormLineItem[] = [
      {
        id: `item-${Date.now()}`,
        description: `${proj.name} — Full-Stack Deliverable Milestone`,
        quantity: 1,
        unitPrice: parsedAmount,
        amount: parsedAmount,
      }
    ];

    setNewInv(prev => ({
      ...prev,
      projectId: proj.id,
      projectName: proj.name,
      clientName: proj.clientName || prev.clientName,
      clientEmail: proj.clientEmail || prev.clientEmail,
      clientCompany: proj.clientCompany || prev.clientCompany,
      items: populatedItems,
      subtotal: parsedAmount,
      tax: 0,
      discount: 0,
      total: parsedAmount,
      isCustomTotal: false,
    }));
  };

  // Reset total back to calculated item sum
  const handleResetToAutoTotal = () => {
    setNewInv(prev => {
      const sub = prev.items.reduce((s, it) => s + (Number(it.amount) || 0), 0);
      const taxNum = Number(prev.tax) || 0;
      const discNum = Number(prev.discount) || 0;
      const autoTotal = Math.max(0, sub + taxNum - discNum);
      return {
        ...prev,
        isCustomTotal: false,
        total: autoTotal,
      };
    });
  };

  // Handle invoice creation with strict submission guard
  const handleCreateInvoice = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Guard against in-flight double submission (both ref and state)
    if (isSubmittingRef.current || isSubmitting) {
      return;
    }

    if (!newInv.projectName.trim()) {
      alert("Please enter a Project Title.");
      return;
    }
    if (!newInv.clientName.trim() || !newInv.clientEmail.trim()) {
      alert("Client Name and Client Email are required.");
      return;
    }

    const finalTotal = Number(newInv.total);
    if (isNaN(finalTotal) || finalTotal <= 0) {
      alert("Please enter a valid invoice Total Amount greater than ₹0.");
      return;
    }

    // Set submission guard immediately before any async work
    isSubmittingRef.current = true;
    setIsSubmitting(true);

    try {
      const sanitizedItems = newInv.items.map((it, idx) => {
        const qty = Math.max(1, Number(it.quantity) || 1);
        const price = Math.max(0, Number(it.unitPrice) || 0);
        return {
          id: it.id || `it-${Date.now()}-${idx + 1}`,
          description: it.description.trim() || `${newInv.projectName} — Milestone Settlement`,
          quantity: qty,
          unitPrice: price,
          rate: price,
          amount: qty * price,
        };
      });

      const res = await fetch("/api/invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId: newInv.projectId || 'prj-custom',
          projectName: newInv.projectName.trim(),
          clientName: newInv.clientName.trim(),
          clientEmail: newInv.clientEmail.trim(),
          clientCompany: newInv.clientCompany.trim(),
          clientAddress: newInv.clientAddress.trim(),
          items: sanitizedItems,
          subtotal: Number(newInv.subtotal) || finalTotal,
          tax: Number(newInv.tax) || 0,
          discount: Number(newInv.discount) || 0,
          total: finalTotal,
          totalAmount: finalTotal,
          dueDate: newInv.dueDate,
          notes: newInv.notes,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create invoice");

      setShowAddModal(false);
      setNewInv(createInitialInvoiceState());
      setNotification(`Invoice ${data.invoice.invoiceNumber} (₹${finalTotal.toLocaleString('en-IN')}) generated successfully!`);
      fetchInvoices();
    } catch (err: any) {
      alert(err.message || "Failed to generate invoice");
    } finally {
      setIsSubmitting(false);
      isSubmittingRef.current = false;
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
    inv.invoiceNumber?.toLowerCase().includes(search.toLowerCase()) ||
    inv.clientName?.toLowerCase().includes(search.toLowerCase()) ||
    inv.projectName?.toLowerCase().includes(search.toLowerCase())
  );

  const calculatedItemsTotal = Math.max(
    0,
    newInv.items.reduce((acc, it) => acc + (Number(it.amount) || 0), 0) +
    (Number(newInv.tax) || 0) -
    (Number(newInv.discount) || 0)
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
          onClick={() => {
            setNewInv(createInitialInvoiceState());
            setShowAddModal(true);
          }}
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
        ) : invoices.length === 0 ? (
          <div className="p-16 text-center flex flex-col items-center justify-center gap-4">
            <div className="w-16 h-16 rounded-3xl bg-yellow-400/10 border border-yellow-400/20 flex items-center justify-center text-yellow-400 shadow-inner">
              <Receipt className="w-8 h-8" />
            </div>
            <div className="max-w-md flex flex-col gap-1.5">
              <h3 className="text-base font-bold text-white tracking-tight">No Invoices Issued Yet</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Your invoice directory is empty. Generate branded client statements with milestone breakdowns and payment deadlines.
              </p>
            </div>
            <button
              onClick={() => {
                setNewInv(createInitialInvoiceState());
                setShowAddModal(true);
              }}
              className="mt-2 px-5 py-2.5 rounded-full bg-yellow-400 text-black font-bold text-xs uppercase tracking-wider hover:bg-yellow-300 transition-colors flex items-center gap-2 cursor-pointer shadow-sm"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>+ Generate First Invoice</span>
            </button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-xs font-mono text-zinc-500 flex flex-col items-center gap-2">
            <span>No invoices found matching &ldquo;{search}&rdquo;.</span>
            <button
              onClick={() => setSearch("")}
              className="text-xs text-yellow-400 underline hover:text-yellow-300 cursor-pointer"
            >
              Clear search
            </button>
          </div>
        ) : (
          <div className="divide-y divide-zinc-900">
            {filtered.map((inv) => (
              <div key={inv.id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-zinc-900/40 transition-colors">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-3">
                    <span className="text-base font-mono font-bold text-white">{inv.invoiceNumber}</span>
                    <span className={`px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                      (inv.status || "").toUpperCase() === "PAID"
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
                    Issued: {inv.issueDate || (inv.createdAt ? new Date(inv.createdAt).toISOString().split('T')[0] : 'N/A')} | Due: {inv.dueDate} | {inv.items?.[0]?.description || 'Project Deliverable'}
                  </span>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <span className="text-lg font-mono font-bold text-white block">
                      ₹{(inv.totalAmount || inv.total || 0).toLocaleString('en-IN')}
                    </span>
                    <span className="text-[10px] font-mono text-zinc-500">{inv.currency || 'INR'}</span>
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

                  <button
                    onClick={() => setSelectedInvoice(inv)}
                    className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-yellow-400 transition-colors cursor-pointer"
                    title="View & Print Invoice"
                  >
                    <Eye className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleDeleteInvoice(inv.id, inv.invoiceNumber)}
                    className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-600 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                    title="Delete Invoice"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create / Generate Custom Invoice Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="max-w-2xl w-full bg-zinc-950 border border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col gap-6 my-6 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-zinc-800/80 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-yellow-400/10 border border-yellow-400/20 flex items-center justify-center text-yellow-400">
                  <Receipt className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white tracking-tight">Generate Client Invoice</h3>
                  <p className="text-xs text-zinc-400 font-mono">Create an official itemized bill with custom pricing</p>
                </div>
              </div>
              <button
                disabled={isSubmitting}
                onClick={() => setShowAddModal(false)}
                className="p-2 rounded-xl text-zinc-500 hover:text-white hover:bg-zinc-900 transition-colors disabled:opacity-50"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateInvoice} className="flex flex-col gap-5">
              {/* Optional Quick Project Select */}
              {projects.length > 0 && (
                <div className="flex flex-col gap-1 p-3.5 rounded-2xl bg-zinc-900/60 border border-zinc-800/80">
                  <label className="text-[11px] font-mono text-zinc-400 uppercase flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
                    <span>Quick Autofill from Existing Project (Optional)</span>
                  </label>
                  <select
                    disabled={isSubmitting}
                    value={newInv.projectId}
                    onChange={(e) => handleSelectProject(e.target.value)}
                    className="bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2 text-xs text-zinc-200 focus:outline-none focus:border-yellow-400 font-mono disabled:opacity-50"
                  >
                    <option value="">-- Custom / Manual Entry --</option>
                    {projects.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} — {p.clientName} ({p.budget || `₹${(p.amount || 0).toLocaleString('en-IN')}`})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Project & Client Identity Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] font-mono text-zinc-400 uppercase">Project Title *</label>
                  <input
                    type="text"
                    required
                    disabled={isSubmitting}
                    placeholder="e.g. Enterprise E-Commerce Platform"
                    value={newInv.projectName}
                    onChange={(e) => setNewInv({ ...newInv, projectName: e.target.value })}
                    className="bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-yellow-400 disabled:opacity-50"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[11px] font-mono text-zinc-400 uppercase flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5 text-zinc-500" />
                    <span>Client Company (Optional)</span>
                  </label>
                  <input
                    type="text"
                    disabled={isSubmitting}
                    placeholder="e.g. Cosmo Arts Studios"
                    value={newInv.clientCompany}
                    onChange={(e) => setNewInv({ ...newInv, clientCompany: e.target.value })}
                    className="bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-yellow-400 disabled:opacity-50"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[11px] font-mono text-zinc-400 uppercase">Client Name *</label>
                  <input
                    type="text"
                    required
                    disabled={isSubmitting}
                    placeholder="e.g. Sindhuja Ramesh"
                    value={newInv.clientName}
                    onChange={(e) => setNewInv({ ...newInv, clientName: e.target.value })}
                    className="bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-yellow-400 disabled:opacity-50"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[11px] font-mono text-zinc-400 uppercase">Client Email *</label>
                  <input
                    type="email"
                    required
                    disabled={isSubmitting}
                    placeholder="e.g. sindhu@example.com"
                    value={newInv.clientEmail}
                    onChange={(e) => setNewInv({ ...newInv, clientEmail: e.target.value })}
                    className="bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-yellow-400 disabled:opacity-50"
                  />
                </div>
              </div>

              {/* Itemized Deliverables & Custom Line Item Prices */}
              <div className="flex flex-col gap-3 pt-2">
                <div className="flex items-center justify-between border-b border-zinc-800/80 pb-2">
                  <div className="flex flex-col">
                    <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                      Line Items & Custom Item Prices (₹ INR)
                    </span>
                    <span className="text-[11px] text-zinc-400">
                      Type any custom price for each item milestone (e.g. ₹15,000, ₹45,000, ₹1,20,000)
                    </span>
                  </div>
                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={handleAddLineItem}
                    className="px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-700 hover:border-yellow-400/50 text-yellow-400 font-mono text-xs flex items-center gap-1.5 hover:bg-zinc-800 transition-colors cursor-pointer disabled:opacity-50"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Item</span>
                  </button>
                </div>

                <div className="flex flex-col gap-3">
                  {newInv.items.map((item, idx) => (
                    <div
                      key={item.id || idx}
                      className="p-3.5 rounded-2xl bg-zinc-900/80 border border-zinc-800 flex flex-col gap-3 relative"
                    >
                      <div className="flex items-start justify-between gap-3">
                        {/* Description */}
                        <div className="flex-1 flex flex-col gap-1">
                          <label className="text-[10px] font-mono text-zinc-400 uppercase">
                            Item #{idx + 1} Description *
                          </label>
                          <input
                            type="text"
                            required
                            disabled={isSubmitting}
                            placeholder="e.g. UI/UX Design & High-Fidelity Interactive Prototypes"
                            value={item.description}
                            onChange={(e) => handleItemDescriptionChange(idx, e.target.value)}
                            className="bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-yellow-400 disabled:opacity-50"
                          />
                        </div>

                        {/* Delete Item Button */}
                        {newInv.items.length > 1 && (
                          <button
                            type="button"
                            disabled={isSubmitting}
                            onClick={() => handleRemoveLineItem(idx)}
                            className="mt-6 p-2 rounded-xl text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-50 cursor-pointer"
                            title="Remove Line Item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>

                      {/* Quantity, Custom Price, and Line Total */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                        {/* Quantity */}
                        <div className="flex flex-col gap-1">
                          <label className="text-[10px] font-mono text-zinc-400 uppercase">Quantity</label>
                          <input
                            type="number"
                            min="1"
                            step="1"
                            required
                            disabled={isSubmitting}
                            value={item.quantity}
                            onChange={(e) => handleItemQuantityChange(idx, e.target.value)}
                            className="bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-yellow-400 disabled:opacity-50"
                          />
                        </div>

                        {/* Direct Editable Unit Price / Amount in ₹ */}
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center justify-between">
                            <label className="text-[10px] font-mono text-zinc-400 uppercase">
                              Unit Price (₹ INR) *
                            </label>
                            <span className="text-[10px] font-mono text-yellow-400/90 font-bold">
                              ₹{Number(item.unitPrice || 0).toLocaleString('en-IN')}
                            </span>
                          </div>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 font-mono text-xs font-bold">
                              ₹
                            </span>
                            <input
                              type="number"
                              min="0"
                              step="any"
                              required
                              disabled={isSubmitting}
                              placeholder="e.g. 45000"
                              value={item.unitPrice}
                              onChange={(e) => handleItemUnitPriceChange(idx, e.target.value)}
                              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-8 pr-3 py-2 text-xs font-mono font-bold text-white focus:outline-none focus:border-yellow-400 disabled:opacity-50"
                            />
                          </div>
                        </div>

                        {/* Item Total Amount */}
                        <div className="flex flex-col gap-1">
                          <label className="text-[10px] font-mono text-zinc-400 uppercase">Item Amount</label>
                          <div className="bg-zinc-950/60 border border-zinc-800/80 rounded-xl px-3 py-2 text-xs font-mono font-bold text-emerald-400 flex items-center justify-between h-[38px]">
                            <span>₹{((Number(item.quantity) || 1) * (Number(item.unitPrice) || 0)).toLocaleString('en-IN')}</span>
                            <span className="text-[10px] text-zinc-500 uppercase">INR</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total Settlement & Custom Total Amount Input */}
              <div className="flex flex-col gap-3 p-4 rounded-2xl bg-gradient-to-br from-zinc-900 via-zinc-900/80 to-zinc-950 border border-yellow-500/30 shadow-lg">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-800 pb-3">
                  <div className="flex items-center gap-2">
                    <IndianRupee className="w-4 h-4 text-yellow-400" />
                    <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                      Invoice Total Amount Due *
                    </span>
                  </div>
                  {newInv.isCustomTotal && (
                    <button
                      type="button"
                      disabled={isSubmitting}
                      onClick={handleResetToAutoTotal}
                      className="text-[11px] font-mono text-yellow-400 underline hover:text-white cursor-pointer self-start sm:self-auto disabled:opacity-50"
                    >
                      Reset to Items Sum (₹{calculatedItemsTotal.toLocaleString('en-IN')})
                    </button>
                  )}
                </div>

                {/* Direct Custom Price Input for Total Amount */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                  <div className="sm:col-span-8 flex flex-col gap-1">
                    <label className="text-[10px] font-mono text-zinc-400 uppercase">
                      Custom Total Amount (Editable in ₹) *
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-yellow-400 font-mono font-black text-sm">
                        ₹
                      </span>
                      <input
                        type="number"
                        min="1"
                        step="any"
                        required
                        disabled={isSubmitting}
                        placeholder="e.g. 120000"
                        value={newInv.total}
                        onChange={(e) => {
                          setNewInv({
                            ...newInv,
                            total: e.target.value === "" ? "" : Number(e.target.value) as any,
                            isCustomTotal: true,
                          });
                        }}
                        className="w-full bg-zinc-950 border-2 border-yellow-400/60 rounded-xl pl-9 pr-24 py-2.5 text-sm font-mono font-extrabold text-white focus:outline-none focus:border-yellow-400 disabled:opacity-50"
                      />
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 font-mono text-xs font-bold text-yellow-400 bg-yellow-400/10 px-2 py-0.5 rounded border border-yellow-400/20 pointer-events-none">
                        INR
                      </div>
                    </div>
                  </div>

                  {/* Visual Formatted Badge */}
                  <div className="sm:col-span-4 p-3 rounded-xl bg-yellow-400/10 border border-yellow-400/30 flex flex-col items-end justify-center">
                    <span className="text-[10px] font-mono text-zinc-400 uppercase">Formatted Bill Total</span>
                    <span className="text-base font-mono font-black text-yellow-400 truncate max-w-full">
                      ₹{Number(newInv.total || 0).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                <p className="text-[11px] text-zinc-400 leading-relaxed">
                  Type any custom figure (e.g. ₹15,000, ₹45,000, ₹1,20,000). The total automatically reflects in all client preview sheets and PDFs.
                </p>
              </div>

              {/* Due Date & Terms */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] font-mono text-zinc-400 uppercase flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-zinc-500" />
                    <span>Payment Due Date *</span>
                  </label>
                  <input
                    type="date"
                    required
                    disabled={isSubmitting}
                    value={newInv.dueDate}
                    onChange={(e) => setNewInv({ ...newInv, dueDate: e.target.value })}
                    className="bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-yellow-400 font-mono disabled:opacity-50"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[11px] font-mono text-zinc-400 uppercase">Payment Terms / Notes</label>
                  <input
                    type="text"
                    disabled={isSubmitting}
                    placeholder="e.g. Bank NEFT / IMPS or UPI within 14 days"
                    value={newInv.notes}
                    onChange={(e) => setNewInv({ ...newInv, notes: e.target.value })}
                    className="bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-yellow-400 disabled:opacity-50"
                  />
                </div>
              </div>

              {/* Modal Actions with Submission Guard */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-800/80">
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-full text-xs font-mono text-zinc-400 hover:text-white transition-colors disabled:opacity-50 cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`px-6 py-2.5 rounded-full font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer ${
                    isSubmitting
                      ? "bg-yellow-400/50 text-black/60 cursor-not-allowed shadow-none pointer-events-none"
                      : "bg-yellow-400 text-black hover:bg-yellow-300 shadow-md shadow-yellow-400/20 active:scale-95"
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Issuing Invoice...</span>
                    </>
                  ) : (
                    <>
                      <Receipt className="w-3.5 h-3.5" />
                      <span>Issue Invoice (₹{Number(newInv.total || 0).toLocaleString('en-IN')})</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View & Print Invoice Modal */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="max-w-2xl w-full bg-zinc-950 border border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col gap-6 my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-zinc-800/80 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-yellow-400/10 border border-yellow-400/20 flex items-center justify-center text-yellow-400">
                  <Receipt className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Invoice {selectedInvoice.invoiceNumber}</h3>
                  <span className="text-xs text-zinc-400 font-mono">Issued for {selectedInvoice.clientName}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs font-mono text-zinc-300 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" /> Print
                </button>
                <button 
                  onClick={() => setSelectedInvoice(null)} 
                  className="p-1.5 rounded-lg text-zinc-500 hover:text-white hover:bg-zinc-900 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Printable Content */}
            <div className="flex flex-col gap-6 text-sm">
              <div className="grid grid-cols-2 gap-4 p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800/60 text-xs">
                <div>
                  <span className="text-zinc-500 uppercase font-mono block mb-1">Bill To:</span>
                  <p className="text-white font-bold">{selectedInvoice.clientName}</p>
                  <p className="text-zinc-400">{selectedInvoice.clientEmail}</p>
                  {selectedInvoice.clientCompany && <p className="text-zinc-400">{selectedInvoice.clientCompany}</p>}
                </div>
                <div>
                  <span className="text-zinc-500 uppercase font-mono block mb-1">Project & Status:</span>
                  <p className="text-white font-bold">{selectedInvoice.projectName}</p>
                  <p className="text-yellow-400 font-mono font-semibold uppercase">{selectedInvoice.status}</p>
                  <p className="text-zinc-500 font-mono mt-1">Due: {selectedInvoice.dueDate || "Upon Receipt"}</p>
                </div>
              </div>

              {/* Items Table */}
              <div className="border border-zinc-800 rounded-2xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-zinc-900/80 border-b border-zinc-800 text-zinc-400 font-mono uppercase">
                    <tr>
                      <th className="py-3 px-4">Description</th>
                      <th className="py-3 px-4 text-center">Qty</th>
                      <th className="py-3 px-4 text-right">Unit Price</th>
                      <th className="py-3 px-4 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/60">
                    {(selectedInvoice.items || []).map((item, idx) => (
                      <tr key={idx} className="text-zinc-300">
                        <td className="py-3 px-4">{item.description}</td>
                        <td className="py-3 px-4 text-center">{item.quantity}</td>
                        <td className="py-3 px-4 text-right font-mono text-zinc-400">
                          ₹{((item.unitPrice !== undefined ? item.unitPrice : item.rate) || 0).toLocaleString('en-IN')}
                        </td>
                        <td className="py-3 px-4 text-right font-mono font-bold text-white">
                          ₹{(item.amount || 0).toLocaleString('en-IN')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Total Settlement */}
              <div className="flex justify-between items-center p-4 rounded-2xl bg-yellow-400/10 border border-yellow-400/20 font-mono">
                <span className="text-zinc-300 font-bold uppercase text-xs">Total Amount Due</span>
                <span className="text-xl font-black text-yellow-400">
                  ₹{(selectedInvoice.totalAmount || selectedInvoice.total || 0).toLocaleString('en-IN')} INR
                </span>
              </div>

              {selectedInvoice.notes && (
                <div className="p-3.5 rounded-xl bg-zinc-900/40 border border-zinc-800 text-xs text-zinc-400">
                  <strong className="text-zinc-300 block mb-1">Notes & Terms:</strong>
                  {selectedInvoice.notes}
                </div>
              )}
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedInvoice(null)}
                className="px-6 py-2 rounded-full bg-zinc-900 border border-zinc-700 text-xs font-mono text-zinc-300 hover:text-white transition-colors cursor-pointer"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
