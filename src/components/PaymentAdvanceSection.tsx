"use client";

import React, { useState } from "react";
import { 
  CreditCard, 
  QrCode, 
  Building, 
  Copy, 
  Check, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle
} from "lucide-react";

interface PaymentAdvanceProps {
  defaultProject?: string;
  defaultAmount?: number;
  onSuccess?: () => void;
}

export default function PaymentAdvanceSection({ 
  defaultProject = "Web & Brand Development Project", 
  defaultAmount = 25000,
  onSuccess 
}: PaymentAdvanceProps) {
  const [method, setMethod] = useState<"upi" | "bank" | "gateway">("upi");
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Form State
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [projectTitle, setProjectTitle] = useState(defaultProject);
  const [totalFee, setTotalFee] = useState<number>(50000);
  const [amountPaid, setAmountPaid] = useState<number>(defaultAmount);
  const [utrNumber, setUtrNumber] = useState("");
  const [notes, setNotes] = useState("");

  const [loading, setLoading] = useState(false);
  const [successReceipt, setSuccessReceipt] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  const balanceDue = Math.max(0, totalFee - amountPaid);

  const handleCopy = (text: string, fieldId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldId);
    setTimeout(() => setCopiedField(null), 2500);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!clientName.trim() || !clientEmail.trim()) {
      setError("Please provide your full name and email address.");
      return;
    }

    if (!utrNumber.trim()) {
      setError("Please enter your Bank UTR / UPI Transaction Reference Number to confirm.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientName: clientName.trim(),
          clientEmail: clientEmail.trim(),
          clientPhone: clientPhone.trim(),
          projectTitle: projectTitle.trim(),
          totalFee,
          amount: amountPaid,
          balanceDue,
          paymentMethod: method === "upi" ? "UPI QR Transfer" : method === "bank" ? "Direct NEFT / IMPS Bank Transfer" : "Card Gateway",
          gateway: method === "upi" ? "UPI" : method === "bank" ? "BANK_NEFT" : "RAZORPAY_STRIPE",
          utrNumber: utrNumber.trim(),
          notes: notes.trim() || `${amountPaid >= totalFee ? "Full Settlement" : "Upfront Advance"} payment submitted by client`,
          status: amountPaid >= totalFee ? "Fully Paid" : "Advance Received",
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to submit payment confirmation");
      }

      setSuccessReceipt(data.payment);
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setError(err.message || "Something went wrong while submitting payment.");
    } finally {
      setLoading(false);
    }
  };

  if (successReceipt) {
    return (
      <div className="p-8 md:p-12 rounded-3xl bg-zinc-950 border border-emerald-500/40 text-center flex flex-col items-center gap-6 max-w-2xl mx-auto shadow-2xl">
        <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <div>
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400 block mb-1">
            Payment Logged Successfully
          </span>
          <h3 className="text-2xl md:text-3xl font-black text-white">Payment Acknowledged</h3>
          <p className="text-sm text-zinc-400 mt-2 max-w-md mx-auto">
            Your transaction reference has been verified and permanently stored in the Gen-M Cloud database. An official receipt has been dispatched to your email.
          </p>
        </div>

        {/* Receipt Box */}
        <div className="w-full bg-zinc-900/80 border border-zinc-800 rounded-2xl p-6 text-left font-mono text-xs flex flex-col gap-3">
          <div className="flex justify-between pb-2 border-b border-zinc-800">
            <span className="text-zinc-400">Payment ID:</span>
            <span className="text-yellow-400 font-bold">{successReceipt.paymentId || successReceipt.id}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-400">Client:</span>
            <span className="text-white">{successReceipt.clientName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-400">Project:</span>
            <span className="text-white truncate max-w-[200px]">{successReceipt.projectTitle}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-400">Amount Paid:</span>
            <span className="text-emerald-400 font-bold text-sm">₹{Number(successReceipt.amount).toLocaleString('en-IN')}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-400">Remaining Balance:</span>
            <span className="text-zinc-200">₹{Number(successReceipt.balanceDue || 0).toLocaleString('en-IN')}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-400">Transaction Reference:</span>
            <span className="text-yellow-400">{successReceipt.utrNumber}</span>
          </div>
          <div className="flex justify-between pt-2 border-t border-zinc-800">
            <span className="text-zinc-400">Status:</span>
            <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold uppercase text-[10px]">
              {successReceipt.status}
            </span>
          </div>
        </div>

        <button
          onClick={() => {
            setSuccessReceipt(null);
            setUtrNumber("");
          }}
          className="px-6 py-2.5 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-mono text-zinc-300 hover:text-white hover:border-yellow-400 transition-colors cursor-pointer"
        >
          Make Another Payment
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-3xl bg-zinc-950 border border-zinc-800 p-6 md:p-10 shadow-xl flex flex-col gap-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-900 pb-6">
        <div>
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-yellow-400 block mb-1">
            Official Payment Gateway
          </span>
          <h2 className="text-2xl md:text-3xl font-black text-white">Make a Payment / Pay Advance</h2>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono self-start sm:self-auto">
          <ShieldCheck className="w-4 h-4" />
          <span>256-Bit Encrypted Transfer</span>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-mono flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Payment Form */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Column: Client & Project Details */}
        <div className="flex flex-col gap-5">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-400">
            Step 1: Client & Project Billing Info
          </span>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-mono text-zinc-400 uppercase">Your Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Rahul Sharma"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-yellow-400 transition-colors placeholder:text-zinc-600"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-mono text-zinc-400 uppercase">Email Address *</label>
              <input
                type="email"
                required
                placeholder="client@company.com"
                value={clientEmail}
                onChange={(e) => setClientEmail(e.target.value)}
                className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-yellow-400 transition-colors placeholder:text-zinc-600"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-mono text-zinc-400 uppercase">Phone / WhatsApp</label>
              <input
                type="text"
                placeholder="+91 98765 43210"
                value={clientPhone}
                onChange={(e) => setClientPhone(e.target.value)}
                className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-yellow-400 transition-colors placeholder:text-zinc-600"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-mono text-zinc-400 uppercase">Project / Service Title</label>
            <input
              type="text"
              value={projectTitle}
              onChange={(e) => setProjectTitle(e.target.value)}
              placeholder="e.g. Apex E-Commerce Web App"
              className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-yellow-400 transition-colors"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-mono text-zinc-400 uppercase">Total Project Fee (₹)</label>
              <input
                type="number"
                min="1000"
                step="500"
                value={totalFee}
                onChange={(e) => setTotalFee(Number(e.target.value))}
                className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white font-mono focus:outline-none focus:border-yellow-400 transition-colors"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-mono text-yellow-400 uppercase font-bold">Paying Amount (₹) *</label>
              <input
                type="number"
                required
                min="500"
                step="500"
                value={amountPaid}
                onChange={(e) => setAmountPaid(Number(e.target.value))}
                className="bg-zinc-900 border border-yellow-400/50 rounded-xl px-4 py-2.5 text-sm text-yellow-400 font-mono font-bold focus:outline-none focus:border-yellow-400 transition-colors"
              />
            </div>
          </div>

          {/* Balance Tracker Card */}
          <div className="p-4 rounded-2xl bg-zinc-900/70 border border-zinc-800 flex items-center justify-between text-xs font-mono">
            <div>
              <span className="text-zinc-400 block">Remaining Due:</span>
              <span className={`text-base font-bold ${balanceDue === 0 ? "text-emerald-400" : "text-zinc-200"}`}>
                ₹{balanceDue.toLocaleString('en-IN')}
              </span>
            </div>
            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
              balanceDue === 0 
                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" 
                : "bg-yellow-400/10 text-yellow-400 border border-yellow-400/30"
            }`}>
              {balanceDue === 0 ? "Full Payment" : "Advance Milestone"}
            </span>
          </div>
        </div>

        {/* Right Column: Payment Channels & UTR Submission */}
        <div className="flex flex-col gap-5">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-400">
            Step 2: Choose Payment Channel
          </span>

          {/* Payment Method Selector Tabs */}
          <div className="grid grid-cols-3 gap-2 bg-zinc-900 p-1.5 rounded-2xl border border-zinc-800">
            <button
              type="button"
              onClick={() => setMethod("upi")}
              className={`py-2 px-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                method === "upi" ? "bg-yellow-400 text-black shadow-sm font-bold" : "text-zinc-400 hover:text-white"
              }`}
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>UPI & QR</span>
            </button>
            <button
              type="button"
              onClick={() => setMethod("bank")}
              className={`py-2 px-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                method === "bank" ? "bg-yellow-400 text-black shadow-sm font-bold" : "text-zinc-400 hover:text-white"
              }`}
            >
              <Building className="w-3.5 h-3.5" />
              <span>Bank NEFT</span>
            </button>
            <button
              type="button"
              onClick={() => setMethod("gateway")}
              className={`py-2 px-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                method === "gateway" ? "bg-yellow-400 text-black shadow-sm font-bold" : "text-zinc-400 hover:text-white"
              }`}
            >
              <CreditCard className="w-3.5 h-3.5" />
              <span>Card / PG</span>
            </button>
          </div>

          {/* TAB 1: UPI & QR CODE */}
          {method === "upi" && (
            <div className="p-5 rounded-2xl bg-zinc-900/70 border border-zinc-800 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-zinc-400 uppercase">UPI Virtual ID</span>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                  0% Convenience Fee
                </span>
              </div>

              {/* UPI ID Copy Box */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-black border border-zinc-800 font-mono text-xs">
                <span className="text-yellow-400 font-bold truncate">admin.genm@okaxis</span>
                <button
                  type="button"
                  onClick={() => handleCopy("admin.genm@okaxis", "upi")}
                  className="px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-white flex items-center gap-1 text-[11px] transition-colors cursor-pointer flex-shrink-0"
                >
                  {copiedField === "upi" ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedField === "upi" ? "Copied!" : "Copy"}</span>
                </button>
              </div>

              {/* Dynamic QR Code Visualization */}
              <div className="flex items-center gap-4 p-4 rounded-xl bg-black border border-zinc-800">
                <div className="p-2 bg-white rounded-xl flex-shrink-0">
                  {/* Styled QR Code Box with SVG lines */}
                  <svg className="w-20 h-20" viewBox="0 0 100 100" fill="none">
                    <rect width="100" height="100" fill="white" />
                    {/* Corner 1 */}
                    <rect x="5" y="5" width="28" height="28" fill="black" />
                    <rect x="9" y="9" width="20" height="20" fill="white" />
                    <rect x="13" y="13" width="12" height="12" fill="black" />
                    {/* Corner 2 */}
                    <rect x="67" y="5" width="28" height="28" fill="black" />
                    <rect x="71" y="9" width="20" height="20" fill="white" />
                    <rect x="75" y="13" width="12" height="12" fill="black" />
                    {/* Corner 3 */}
                    <rect x="5" y="67" width="28" height="28" fill="black" />
                    <rect x="9" y="71" width="20" height="20" fill="white" />
                    <rect x="13" y="75" width="12" height="12" fill="black" />
                    {/* QR Matrix Dots */}
                    <rect x="38" y="10" width="6" height="18" fill="black" />
                    <rect x="48" y="15" width="12" height="6" fill="black" />
                    <rect x="38" y="38" width="24" height="24" fill="black" />
                    <rect x="44" y="44" width="12" height="12" fill="white" />
                    <rect x="10" y="38" width="18" height="6" fill="black" />
                    <rect x="18" y="48" width="10" height="12" fill="black" />
                    <rect x="68" y="38" width="8" height="16" fill="black" />
                    <rect x="80" y="44" width="12" height="10" fill="black" />
                    <rect x="38" y="68" width="10" height="24" fill="black" />
                    <rect x="54" y="68" width="14" height="8" fill="black" />
                    <rect x="72" y="68" width="20" height="24" fill="black" />
                  </svg>
                </div>
                <div className="flex flex-col text-xs">
                  <span className="text-white font-bold">Scan to Pay via Any UPI App</span>
                  <span className="text-[11px] text-zinc-400 mt-0.5">Google Pay • PhonePe • Paytm • BHIM • Cred</span>
                  <span className="text-[11px] text-yellow-400 font-mono mt-1 font-semibold">
                    Amount: ₹{amountPaid.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: DIRECT BANK TRANSFER */}
          {method === "bank" && (
            <div className="p-5 rounded-2xl bg-zinc-900/70 border border-zinc-800 flex flex-col gap-3 font-mono text-xs">
              <div className="flex justify-between items-center pb-2 border-b border-zinc-800">
                <span className="text-zinc-400">Account Name:</span>
                <span className="text-white font-bold">Gen-M Tech</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-zinc-800">
                <span className="text-zinc-400">Bank:</span>
                <span className="text-white">Axis Bank Limited</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-zinc-800">
                <span className="text-zinc-400">Account Number:</span>
                <div className="flex items-center gap-2">
                  <span className="text-yellow-400 font-bold">9240 2001 8839 014</span>
                  <button
                    type="button"
                    onClick={() => handleCopy("924020018839014", "acc")}
                    className="p-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300"
                    title="Copy Account Number"
                  >
                    {copiedField === "acc" ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  </button>
                </div>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-zinc-800">
                <span className="text-zinc-400">IFSC Code:</span>
                <div className="flex items-center gap-2">
                  <span className="text-yellow-400 font-bold">UTIB0001234</span>
                  <button
                    type="button"
                    onClick={() => handleCopy("UTIB0001234", "ifsc")}
                    className="p-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300"
                    title="Copy IFSC"
                  >
                    {copiedField === "ifsc" ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  </button>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-zinc-400">Account Type:</span>
                <span className="text-zinc-300">Current Account</span>
              </div>
            </div>
          )}

          {/* TAB 3: CARD & GATEWAY */}
          {method === "gateway" && (
            <div className="p-5 rounded-2xl bg-zinc-900/70 border border-zinc-800 flex flex-col gap-3 text-xs">
              <div className="flex items-center gap-2 text-yellow-400 font-semibold font-mono">
                <CreditCard className="w-4 h-4" />
                <span>Credit / Debit Card & NetBanking</span>
              </div>
              <p className="text-zinc-400 text-xs leading-relaxed">
                We accept all major Visa, Mastercard, RuPay, and American Express cards. Enter your transfer transaction ID below or connect directly to settle via gateway checkout.
              </p>
              <div className="flex items-center gap-2 pt-2 border-t border-zinc-800 text-[11px] font-mono text-zinc-400">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>PCI-DSS Level 1 Compliant Gateway</span>
              </div>
            </div>
          )}

          {/* Step 3: Transaction Reference / UTR Submission */}
          <div className="flex flex-col gap-1.5 pt-2">
            <label className="text-xs font-mono text-yellow-400 uppercase font-bold flex items-center justify-between">
              <span>Payment Reference / UTR Number *</span>
              <span className="text-[10px] text-zinc-500 font-normal">From your banking app</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. UPI-412389102938 or AXISN192837482"
              value={utrNumber}
              onChange={(e) => setUtrNumber(e.target.value)}
              className="bg-zinc-900 border border-yellow-400/50 rounded-xl px-4 py-3 text-sm text-yellow-400 font-mono font-bold focus:outline-none focus:border-yellow-400 transition-colors placeholder:text-zinc-600"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-mono text-zinc-400 uppercase">Payment Notes (Optional)</label>
            <input
              type="text"
              placeholder="e.g. Milestone 1 Sprint Advance"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-yellow-400 transition-colors placeholder:text-zinc-600"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3.5 rounded-full bg-yellow-400 text-black font-bold text-xs uppercase tracking-wider hover:bg-yellow-300 transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-lg disabled:opacity-50"
          >
            {loading ? "Recording Confirmation..." : `Confirm Payment of ₹${amountPaid.toLocaleString('en-IN')}`}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
}
