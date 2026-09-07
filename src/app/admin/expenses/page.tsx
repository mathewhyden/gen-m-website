"use client";

import React, { useState, useEffect } from "react";
import { 
  WalletCards, 
  Plus, 
  Trash2, 
  Calendar, 
  Tag, 
  CreditCard, 
  TrendingDown, 
  Filter, 
  RefreshCw,
  Receipt,
  PieChart,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { Expense } from "@/lib/types";

const CATEGORIES = [
  "Hosting & Servers",
  "Software & Subscriptions",
  "Domains & Licenses",
  "Freelancers & Team",
  "Marketing & Ads",
  "Hardware & Equipment",
  "Office & Utilities",
  "Food & Travel",
  "Other"
];

const PAYMENT_METHODS = [
  "UPI / GPay / PhonePe",
  "Credit Card",
  "Debit Card",
  "Net Banking",
  "Bank Transfer (IMPS/NEFT)",
  "Cash"
];

export default function MonthlyExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  // Form State
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [paymentMethod, setPaymentMethod] = useState(PAYMENT_METHODS[0]);
  const [notes, setNotes] = useState("");

  const fetchExpenses = async () => {
    setIsRefreshing(true);
    try {
      const res = await fetch("/api/admin/expenses");
      const data = await res.json();
      if (data.success && data.expenses) {
        setExpenses(data.expenses);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const handleAddExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    const numAmount = parseFloat(amount);
    if (!title.trim()) {
      setErrorMessage("Please enter an expense title/description");
      return;
    }
    if (isNaN(numAmount) || numAmount <= 0) {
      setErrorMessage("Please enter a valid expense amount in Rupees (₹)");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/expenses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          amount: numAmount,
          category,
          date,
          paymentMethod,
          notes: notes.trim(),
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSuccessMessage("Expense added successfully (செலவு வெற்றிகரமாகச் சேர்க்கப்பட்டது)");
        setTitle("");
        setAmount("");
        setNotes("");
        setShowAddForm(false);
        fetchExpenses();
        setTimeout(() => setSuccessMessage(""), 4000);
      } else {
        setErrorMessage(data.error || "Failed to add expense");
      }
    } catch (err) {
      console.error(err);
      setErrorMessage("Network error occurred while saving expense");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteExpense = async (id: string, expTitle: string) => {
    if (!confirm(`Delete expense "${expTitle}"?`)) return;

    try {
      const res = await fetch(`/api/admin/expenses?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        setExpenses(prev => prev.filter(e => e.id !== id));
      } else {
        alert(data.error || "Failed to delete expense");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to delete expense");
    }
  };

  // Calculations
  const now = new Date();
  const curYear = now.getFullYear();
  const curMonth = now.getMonth();
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const currentMonthLabel = `${monthNames[curMonth]} ${curYear}`;

  const thisMonthExpenses = expenses.filter(e => {
    if (!e.date) return false;
    const d = new Date(e.date);
    return d.getFullYear() === curYear && d.getMonth() === curMonth;
  });

  const totalThisMonth = thisMonthExpenses.reduce((acc, curr) => acc + (curr.amount || 0), 0);
  const totalAllTime = expenses.reduce((acc, curr) => acc + (curr.amount || 0), 0);

  // Category Breakdown for this month
  const categoryMap: Record<string, number> = {};
  thisMonthExpenses.forEach(e => {
    categoryMap[e.category] = (categoryMap[e.category] || 0) + e.amount;
  });

  const filteredExpenses = selectedCategory === "all" 
    ? expenses 
    : expenses.filter(e => e.category === selectedCategory);

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-yellow-400">
              Studio Expense Control
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400">
              ₹ INR Currency
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight mt-1 flex items-center gap-3">
            Monthly Expenses (மாத செலவுகள்)
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Track and manage your real operational expenses, hosting, software, and tools in Indian Rupees.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={() => fetchExpenses()}
            disabled={isRefreshing}
            className="px-3.5 py-2.5 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-mono text-zinc-300 hover:text-yellow-400 hover:border-yellow-400 transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin text-yellow-400" : ""}`} />
            <span>{isRefreshing ? "Syncing..." : "Refresh"}</span>
          </button>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-4 py-2.5 rounded-full bg-yellow-400 text-black font-bold text-xs uppercase tracking-wider hover:bg-yellow-300 transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{showAddForm ? "Close Form" : "Add Expense (செலவைச் சேர்)"}</span>
          </button>
        </div>
      </div>

      {/* Notifications */}
      {successMessage && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}
      {errorMessage && (
        <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl bg-zinc-950 border border-zinc-800 flex flex-col justify-between gap-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider">
              {currentMonthLabel} Expenses
            </span>
            <div className="w-8 h-8 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400">
              <TrendingDown className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="text-3xl font-black font-mono text-white block">
              ₹{totalThisMonth.toLocaleString("en-IN")}
            </span>
            <span className="text-[11px] font-mono text-zinc-500">
              {thisMonthExpenses.length} expense entries this month
            </span>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-zinc-950 border border-zinc-800 flex flex-col justify-between gap-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider">
              All-Time Total Expenses
            </span>
            <div className="w-8 h-8 rounded-lg bg-yellow-400/10 border border-yellow-400/20 flex items-center justify-center text-yellow-400">
              <WalletCards className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="text-3xl font-black font-mono text-yellow-400 block">
              ₹{totalAllTime.toLocaleString("en-IN")}
            </span>
            <span className="text-[11px] font-mono text-zinc-500">
              {expenses.length} lifetime recorded expenses
            </span>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-zinc-950 border border-zinc-800 flex flex-col justify-between gap-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider">
              Top Monthly Category
            </span>
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <PieChart className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="text-xl font-bold text-white block truncate">
              {Object.keys(categoryMap).length > 0 
                ? Object.entries(categoryMap).sort((a, b) => b[1] - a[1])[0][0] 
                : "No expenses yet"}
            </span>
            <span className="text-[11px] font-mono text-zinc-500">
              {Object.keys(categoryMap).length > 0 
                ? `₹${Object.entries(categoryMap).sort((a, b) => b[1] - a[1])[0][1].toLocaleString("en-IN")} spent` 
                : "0 logged"}
            </span>
          </div>
        </div>
      </div>

      {/* Add Expense Form Card */}
      {showAddForm && (
        <form 
          onSubmit={handleAddExpense}
          className="p-6 md:p-8 rounded-3xl bg-zinc-950 border border-yellow-400/30 shadow-2xl flex flex-col gap-6"
        >
          <div className="flex items-center justify-between border-b border-zinc-900 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-yellow-400/10 border border-yellow-400/20 flex items-center justify-center text-yellow-400">
                <Plus className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Record New Studio Expense</h3>
                <p className="text-xs text-zinc-400">Add an expenditure in Rupees (₹) to accurately monitor monthly studio budget.</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="text-xs text-zinc-500 hover:text-white"
            >
              Cancel
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* Title */}
            <div className="flex flex-col gap-1.5 sm:col-span-2">
              <label className="text-xs font-mono text-zinc-300">
                Expense Title / Description *
              </label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="e.g. Vercel Hosting / Domain Renewal / Figma Pro / Office Wi-Fi"
                required
                className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-yellow-400 font-sans"
              />
            </div>

            {/* Amount */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-mono text-zinc-300">
                Amount in Rupees (₹) *
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-mono text-sm text-yellow-400">₹</span>
                <input
                  type="number"
                  min="1"
                  step="1"
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                  placeholder="2500"
                  required
                  className="w-full pl-8 pr-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-yellow-400 font-mono font-bold"
                />
              </div>
            </div>

            {/* Category */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-mono text-zinc-300">Category *</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-sm text-white focus:outline-none focus:border-yellow-400"
              >
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat} className="bg-zinc-950 text-white">
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Date */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-mono text-zinc-300">Date *</label>
              <input
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-sm text-white focus:outline-none focus:border-yellow-400 font-mono"
              />
            </div>

            {/* Payment Method */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-mono text-zinc-300">Payment Method</label>
              <select
                value={paymentMethod}
                onChange={e => setPaymentMethod(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-sm text-white focus:outline-none focus:border-yellow-400"
              >
                {PAYMENT_METHODS.map(pm => (
                  <option key={pm} value={pm} className="bg-zinc-950 text-white">
                    {pm}
                  </option>
                ))}
              </select>
            </div>

            {/* Notes */}
            <div className="flex flex-col gap-1.5 sm:col-span-3">
              <label className="text-xs font-mono text-zinc-300">Notes / Remarks (Optional)</label>
              <input
                type="text"
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="Invoice reference, vendor details, or project attribution..."
                className="w-full px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-yellow-400"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2.5 rounded-full bg-zinc-900 text-xs font-semibold text-zinc-300 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 rounded-full bg-yellow-400 text-black font-bold text-xs uppercase tracking-wider hover:bg-yellow-300 transition-colors cursor-pointer disabled:opacity-50"
            >
              {submitting ? "Saving..." : "Save Expense (சேமி)"}
            </button>
          </div>
        </form>
      )}

      {/* Category Breakdown Progress Bars for This Month */}
      {Object.keys(categoryMap).length > 0 && (
        <div className="p-6 rounded-3xl bg-zinc-950 border border-zinc-800 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold font-mono text-white uppercase tracking-wider flex items-center gap-2">
              <PieChart className="w-4 h-4 text-yellow-400" />
              {currentMonthLabel} Expense Breakdown by Category
            </h3>
            <span className="text-xs font-mono text-zinc-400">
              Total: <strong className="text-white">₹{totalThisMonth.toLocaleString("en-IN")}</strong>
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
            {Object.entries(categoryMap)
              .sort((a, b) => b[1] - a[1])
              .map(([cat, amt]) => {
                const pct = totalThisMonth > 0 ? Math.round((amt / totalThisMonth) * 100) : 0;
                return (
                  <div key={cat} className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800/80 flex flex-col gap-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-zinc-300 font-medium truncate">{cat}</span>
                      <span className="font-mono font-bold text-white">₹{amt.toLocaleString("en-IN")}</span>
                    </div>
                    <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                      <div 
                        className="bg-yellow-400 h-full rounded-full transition-all duration-500" 
                        style={{ width: `${pct}%` }} 
                      />
                    </div>
                    <span className="text-[10px] font-mono text-zinc-500">{pct}% of this month</span>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* Expense Entries Table / List */}
      <div className="p-6 md:p-8 rounded-3xl bg-zinc-950 border border-zinc-800 flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-900 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400">
              <Receipt className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">Recorded Expenses</h2>
              <p className="text-xs text-zinc-400">All saved business expenses ({filteredExpenses.length} entries)</p>
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-zinc-500" />
            <select
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              className="px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs font-mono text-zinc-300 focus:outline-none focus:border-yellow-400"
            >
              <option value="all">All Categories</option>
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <div className="py-12 text-center text-xs font-mono text-zinc-500">
            Loading expense records...
          </div>
        ) : filteredExpenses.length === 0 ? (
          <div className="py-16 text-center flex flex-col items-center justify-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-zinc-900 flex items-center justify-center text-zinc-500">
              <WalletCards className="w-6 h-6" />
            </div>
            <p className="text-sm text-zinc-300 font-medium">No expenses found</p>
            <p className="text-xs text-zinc-500 max-w-sm">
              Your expense register is clean. Click &quot;Add Expense&quot; above to log your cloud subscriptions, software tools, or operational overhead.
            </p>
            <button
              onClick={() => setShowAddForm(true)}
              className="mt-2 px-4 py-2 rounded-full bg-yellow-400 text-black font-bold text-xs uppercase tracking-wider hover:bg-yellow-300 transition-colors"
            >
              Add First Expense
            </button>
          </div>
        ) : (
          <div className="flex flex-col divide-y divide-zinc-900">
            {filteredExpenses.map(exp => (
              <div
                key={exp.id}
                className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group hover:bg-zinc-900/30 px-3 -mx-3 rounded-xl transition-colors"
              >
                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 shrink-0 mt-0.5">
                    <TrendingDown className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      {exp.title}
                    </h4>
                    <div className="flex items-center gap-3 mt-1 flex-wrap text-xs text-zinc-400">
                      <span className="font-mono text-zinc-500 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {exp.date}
                      </span>
                      <span className="inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded-full bg-zinc-900 border border-zinc-800 text-yellow-400">
                        <Tag className="w-2.5 h-2.5" />
                        {exp.category}
                      </span>
                      {exp.paymentMethod && (
                        <span className="text-[11px] font-mono text-zinc-500 flex items-center gap-1">
                          <CreditCard className="w-2.5 h-2.5" />
                          {exp.paymentMethod}
                        </span>
                      )}
                    </div>
                    {exp.notes && (
                      <p className="text-xs text-zinc-500 mt-1 italic">&quot;{exp.notes}&quot;</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-5">
                  <div className="text-right">
                    <span className="text-lg font-mono font-black text-red-400 block">
                      -₹{exp.amount.toLocaleString("en-IN")}
                    </span>
                    <span className="text-[10px] font-mono text-zinc-500">EXPENDITURE</span>
                  </div>

                  <button
                    onClick={() => handleDeleteExpense(exp.id, exp.title)}
                    title="Delete expense"
                    className="p-2 rounded-lg text-zinc-600 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
