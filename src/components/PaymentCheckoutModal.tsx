"use client";

import React, { useState, useEffect } from "react";
import { 
  X, 
  QrCode, 
  Building, 
  Copy, 
  Check, 
  ShieldCheck, 
  Lock, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  Printer,
  Zap
} from "lucide-react";
import confetti from "canvas-confetti";

interface PaymentCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultProjectTitle?: string;
  defaultAmount?: number;
  defaultClientName?: string;
  defaultClientEmail?: string;
  onPaymentSuccess?: (payment: any) => void;
}

export default function PaymentCheckoutModal({
  isOpen,
  onClose,
  defaultProjectTitle = "Brand & Web Development Services",
  defaultAmount = 25000,
  defaultClientName = "",
  defaultClientEmail = "",
  onPaymentSuccess,
}: PaymentCheckoutModalProps) {
  const [method, setMethod] = useState<"upi_qr" | "bank">("upi_qr");
  const [clientName, setClientName] = useState(defaultClientName);
  const [clientEmail, setClientEmail] = useState(defaultClientEmail);
  const [clientPhone, setClientPhone] = useState("");
  const [projectTitle, setProjectTitle] = useState(defaultProjectTitle);
  const [totalFee, setTotalFee] = useState<number>(50000);
  const [amountPaid, setAmountPaid] = useState<number>(defaultAmount);
  const [utrNumber, setUtrNumber] = useState("");
  const [notes, setNotes] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [successReceipt, setSuccessReceipt] = useState<any | null>(null);

  // Sync props if modal reopens
  useEffect(() => {
    if (isOpen) {
      if (defaultClientName) setClientName((prev) => prev || defaultClientName);
      if (defaultClientEmail) setClientEmail((prev) => prev || defaultClientEmail);
      if (defaultProjectTitle) {
        setProjectTitle((prev) => prev === "Brand & Web Development Services" ? defaultProjectTitle : prev);
      }
      if (defaultAmount) setAmountPaid(defaultAmount);
      setError(null);
    }
  }, [isOpen, defaultClientName, defaultClientEmail, defaultProjectTitle, defaultAmount]);

  if (!isOpen) return null;

  const balanceDue = Math.max(0, totalFee - amountPaid);
  const isFullPayment = amountPaid >= totalFee || balanceDue === 0;

  const handleCopy = (text: string, fieldId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldId);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#FACC15", "#10B981", "#3B82F6", "#FFFFFF"],
      });
    } catch (e) {
      console.warn("Confetti animation error", e);
    }
  };

  // Direct Submission (0% Commission UPI & Bank Transfer)
  const handleSubmitPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!clientName.trim() || !clientEmail.trim()) {
      setError("Please provide your full name and email address.");
      return;
    }

    if (!utrNumber.trim()) {
      setError("Please provide your 12-digit UPI / Bank UTR Transaction ID to confirm payment.");
      return;
    }

    if (amountPaid <= 0) {
      setError("Please enter a valid payment amount.");
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
          paymentMethod: method === "upi_qr" ? "Direct UPI Transfer (0% Fee)" : "Direct Bank NEFT / IMPS (0% Fee)",
          gateway: "DIRECT_BANK_TRANSFER",
          utrNumber: utrNumber.trim(),
          notes: notes.trim() || `${isFullPayment ? "Full Settlement" : "Milestone Advance"} direct settlement`,
          status: isFullPayment ? "Fully Paid" : "Advance Received",
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to submit payment confirmation");
      }

      setSuccessReceipt(data.payment);
      triggerConfetti();
      if (onPaymentSuccess) onPaymentSuccess(data.payment);
    } catch (err: any) {
      setError(err.message || "Something went wrong while recording payment.");
    } finally {
      setLoading(false);
    }
  };

  // Dynamic UPI String & QR Code Generator
  const primaryUpiId = "8754254943@ybl";
  const secondaryUpiId = "admin.genm@upi";
  const upiUrl = `upi://pay?pa=${primaryUpiId}&pn=Gen-M%20Tech&am=${amountPaid}&cu=INR&tn=${encodeURIComponent(projectTitle || "Project Advance")}`;
  const qrCodeImgUrl = `https://api.qrserver.com/v1/create-qr-code/?size=260x260&margin=10&data=${encodeURIComponent(upiUrl)}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        id="payment-checkout-modal"
        className="relative w-full max-w-2xl bg-zinc-950 border border-zinc-800 rounded-3xl shadow-2xl overflow-hidden my-8"
      >
        {/* Top Header */}
        <div className="p-6 border-b border-zinc-900 flex items-center justify-between bg-zinc-900/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-yellow-400/10 border border-yellow-400/20 flex items-center justify-center text-yellow-400">
              <ShieldCheck className="w-5 h-5 text-yellow-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                  Direct Client Payment Checkout
                </h2>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-mono font-bold">
                  <Zap className="w-3 h-3" />
                  0% Commission
                </span>
              </div>
              <p className="text-xs text-zinc-400 font-normal">
                Direct UPI & Bank Settlement with 100% Zero Intermediary Fees
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800/60 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 max-h-[80vh] overflow-y-auto space-y-6">
          {error && (
            <div className="p-3.5 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center gap-2.5 text-red-400 text-xs font-mono">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {successReceipt ? (
            /* SUCCESS CONFIRMATION RECEIPT */
            <div className="text-center py-6 flex flex-col items-center gap-5">
              <div className="w-16 h-16 rounded-3xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-inner">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-xs font-mono uppercase font-bold text-emerald-400">
                  Payment Submitted Successfully!
                </span>
                <h3 className="text-2xl font-black text-white tracking-tight">
                  ₹{Number(successReceipt.amount || amountPaid).toLocaleString("en-IN")} Received
                </h3>
                <p className="text-xs text-zinc-400 max-w-md mx-auto">
                  Thank you, <strong className="text-white">{successReceipt.clientName || clientName}</strong>! Your payment confirmation and transaction record have been securely logged into our system.
                </p>
              </div>

              {/* Official Receipt Card */}
              <div className="w-full bg-zinc-900/60 border border-zinc-800 rounded-2xl p-5 text-left text-xs font-mono flex flex-col gap-2.5 divide-y divide-zinc-800/80">
                <div className="flex justify-between items-center pb-2">
                  <span className="text-zinc-500 uppercase">Receipt ID:</span>
                  <span className="text-yellow-400 font-bold">{successReceipt.id || `RCP-${Date.now()}`}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-zinc-500 uppercase">Transaction / UTR:</span>
                  <span className="text-white font-bold">{successReceipt.utrNumber || utrNumber}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-zinc-500 uppercase">Project / Service:</span>
                  <span className="text-white font-medium">{successReceipt.projectTitle || projectTitle}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-zinc-500 uppercase">Payment Channel:</span>
                  <span className="text-emerald-400 font-bold">{successReceipt.paymentMethod || "Direct UPI Transfer"}</span>
                </div>
                <div className="flex justify-between items-center pt-2">
                  <span className="text-zinc-500 uppercase">Ledger Status:</span>
                  <span className="text-yellow-400 font-bold">{successReceipt.status || (isFullPayment ? "Fully Paid" : "Advance Received")}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-4 py-2 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Receipt</span>
                </button>
                <button
                  onClick={onClose}
                  className="px-6 py-2 rounded-full bg-yellow-400 text-black font-bold text-xs uppercase tracking-wider hover:bg-yellow-300 transition-colors cursor-pointer"
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            /* PAYMENT FORM & METHOD SELECTION */
            <div className="flex flex-col gap-6">
              {/* Client & Billing Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-mono text-zinc-400 uppercase">Your Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rahul Sharma"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    className="bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-yellow-400 transition-colors placeholder:text-zinc-600"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-mono text-zinc-400 uppercase">Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="client@company.com"
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    className="bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-yellow-400 transition-colors placeholder:text-zinc-600"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-mono text-zinc-400 uppercase">Phone / WhatsApp</label>
                  <input
                    type="text"
                    placeholder="+91 98765 43210"
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    className="bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-yellow-400 transition-colors placeholder:text-zinc-600"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-mono text-zinc-400 uppercase">Project Title / Service *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Brand & Web App Development"
                    value={projectTitle}
                    onChange={(e) => setProjectTitle(e.target.value)}
                    className="bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-yellow-400 transition-colors placeholder:text-zinc-600"
                  />
                </div>

                <div className="flex flex-col gap-1.5 sm:col-span-2">
                  <label className="text-xs font-mono text-zinc-400 uppercase">Payment Notes / Remarks (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. Milestone 1 Sprint Advance / Phase 1 UI Design"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-yellow-400 transition-colors placeholder:text-zinc-600"
                  />
                </div>
              </div>

              {/* Amount Selection & Milestones */}
              <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-mono text-yellow-400 uppercase font-bold">
                    Payment Amount (in ₹) *
                  </label>
                  <span className="text-[11px] font-mono text-zinc-400">
                    INR Indian Rupees
                  </span>
                </div>

                {/* Preset quick buttons */}
                <div className="flex flex-wrap gap-2">
                  {[5000, 10000, 25000, 50000, 100000].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setAmountPaid(preset)}
                      className={`px-3 py-1 rounded-lg text-xs font-mono font-medium transition-colors cursor-pointer ${
                        amountPaid === preset
                          ? "bg-yellow-400 text-black font-bold shadow-sm"
                          : "bg-zinc-800/80 text-zinc-300 hover:text-white hover:bg-zinc-700"
                      }`}
                    >
                      ₹{preset.toLocaleString("en-IN")}
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <span className="text-[10px] font-mono uppercase text-zinc-400 block mb-1">
                      Paying Now (₹)
                    </span>
                    <input
                      type="number"
                      required
                      min="100"
                      step="500"
                      value={amountPaid}
                      onChange={(e) => setAmountPaid(Number(e.target.value))}
                      className="w-full bg-black border border-yellow-400/50 rounded-xl px-3.5 py-2 text-base text-yellow-400 font-mono font-bold focus:outline-none focus:border-yellow-400"
                    />
                  </div>

                  <div>
                    <span className="text-[10px] font-mono uppercase text-zinc-400 block mb-1">
                      Total Project Fee (₹)
                    </span>
                    <input
                      type="number"
                      min={amountPaid}
                      value={totalFee}
                      onChange={(e) => setTotalFee(Number(e.target.value))}
                      className="w-full bg-black border border-zinc-800 rounded-xl px-3.5 py-2 text-base text-white font-mono font-bold focus:outline-none focus:border-zinc-600"
                    />
                  </div>
                </div>

                <div className="flex justify-between items-center pt-2 border-t border-zinc-800 text-xs font-mono">
                  <span className="text-zinc-400">Balance Due After Payment:</span>
                  <span className={`font-bold ${balanceDue === 0 ? "text-emerald-400" : "text-amber-400"}`}>
                    {balanceDue === 0 ? "Full Payment Settlement (₹0 Due)" : `₹${balanceDue.toLocaleString("en-IN")}`}
                  </span>
                </div>
              </div>

              {/* ZERO COMMISSION HIGHLIGHT BANNER */}
              <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2 text-emerald-400 font-bold font-mono">
                  <Zap className="w-4 h-4 flex-shrink-0" />
                  <span>⚡ 0% Transaction Fees • Direct Bank Settlement</span>
                </div>
                <span className="text-[11px] text-zinc-400 font-mono hidden sm:inline">
                  No 2-3% PG deductions
                </span>
              </div>

              {/* PAYMENT METHOD TOGGLE TABS */}
              <div className="flex flex-col gap-3">
                <label className="text-xs font-mono uppercase text-zinc-400 font-semibold">
                  Select Direct Settlement Method
                </label>
                <div className="grid grid-cols-2 gap-2 p-1.5 rounded-2xl bg-zinc-900/80 border border-zinc-800">
                  <button
                    type="button"
                    onClick={() => setMethod("upi_qr")}
                    className={`py-2.5 px-3 rounded-xl text-xs font-bold font-mono flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      method === "upi_qr"
                        ? "bg-yellow-400 text-black shadow-md"
                        : "text-zinc-400 hover:text-white"
                    }`}
                  >
                    <QrCode className="w-4 h-4" />
                    <span>Direct UPI & QR Code</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setMethod("bank")}
                    className={`py-2.5 px-3 rounded-xl text-xs font-bold font-mono flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      method === "bank"
                        ? "bg-yellow-400 text-black shadow-md"
                        : "text-zinc-400 hover:text-white"
                    }`}
                  >
                    <Building className="w-4 h-4" />
                    <span>Bank NEFT / IMPS</span>
                  </button>
                </div>
              </div>

              {/* TAB 1: DYNAMIC UPI QR & OFFICIAL UPI IDs */}
              {method === "upi_qr" && (
                <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800 flex flex-col md:flex-row items-center gap-6">
                  {/* QR Code Container */}
                  <div className="flex flex-col items-center gap-2 flex-shrink-0">
                    <div className="p-3 bg-white rounded-2xl shadow-xl border-4 border-yellow-400/80">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={qrCodeImgUrl}
                        alt="Gen-M Tech Official UPI Payment QR"
                        width={180}
                        height={180}
                        className="rounded-lg object-contain"
                      />
                    </div>
                    <span className="text-[10px] font-mono text-zinc-400 text-center">
                      Scan via GPay • PhonePe • Paytm • BHIM
                    </span>
                  </div>

                  {/* UPI IDs & Instructions */}
                  <div className="flex flex-col gap-3 flex-grow w-full text-xs">
                    <div className="flex items-center gap-2 text-yellow-400 font-bold font-mono">
                      <QrCode className="w-4 h-4" />
                      <span>Official Gen-M Tech UPI IDs</span>
                    </div>

                    {/* Primary UPI ID */}
                    <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-between gap-2">
                      <div className="flex flex-col">
                        <span className="text-[10px] text-zinc-500 font-mono uppercase">Primary UPI ID</span>
                        <span className="font-mono text-sm font-bold text-white">{primaryUpiId}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleCopy(primaryUpiId, "upi_primary")}
                        className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white font-mono text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        {copiedField === "upi_primary" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedField === "upi_primary" ? "Copied!" : "Copy"}</span>
                      </button>
                    </div>

                    {/* Secondary UPI ID */}
                    <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-between gap-2">
                      <div className="flex flex-col">
                        <span className="text-[10px] text-zinc-500 font-mono uppercase">Secondary UPI ID</span>
                        <span className="font-mono text-sm font-bold text-white">{secondaryUpiId}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleCopy(secondaryUpiId, "upi_sec")}
                        className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white font-mono text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        {copiedField === "upi_sec" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedField === "upi_sec" ? "Copied!" : "Copy"}</span>
                      </button>
                    </div>

                    <p className="text-zinc-400 text-[11px] leading-relaxed">
                      💡 Scan the QR above or copy either UPI ID in your preferred payment app to transfer ₹{amountPaid.toLocaleString("en-IN")}.
                    </p>
                  </div>
                </div>
              )}

              {/* TAB 2: BANK NEFT / IMPS */}
              {method === "bank" && (
                <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800 flex flex-col gap-3 text-xs font-mono">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-yellow-400 font-bold">
                      <Building className="w-4 h-4" />
                      <span>Official Corporate Bank Account</span>
                    </div>
                    <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded">
                      Zero Transfer Limits
                    </span>
                  </div>

                  <div className="divide-y divide-zinc-800/80 bg-zinc-950 p-4 rounded-xl border border-zinc-800 flex flex-col gap-2">
                    <div className="flex justify-between items-center py-1">
                      <span className="text-zinc-500">Account Name:</span>
                      <span className="text-white font-bold">Gen-M Tech</span>
                    </div>
                    <div className="flex justify-between items-center py-1">
                      <span className="text-zinc-500">Account Number:</span>
                      <div className="flex items-center gap-2">
                        <span className="text-yellow-400 font-bold">9240 2001 8839 014</span>
                        <button
                          type="button"
                          onClick={() => handleCopy("924020018839014", "acc")}
                          className="p-1 text-zinc-400 hover:text-white"
                          title="Copy Account Number"
                        >
                          {copiedField === "acc" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>
                    <div className="flex justify-between items-center py-1">
                      <span className="text-zinc-500">IFSC Code:</span>
                      <div className="flex items-center gap-2">
                        <span className="text-white font-bold">UTIB0001234</span>
                        <button
                          type="button"
                          onClick={() => handleCopy("UTIB0001234", "ifsc")}
                          className="p-1 text-zinc-400 hover:text-white"
                          title="Copy IFSC"
                        >
                          {copiedField === "ifsc" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>
                    <div className="flex justify-between items-center py-1">
                      <span className="text-zinc-500">Bank & Branch:</span>
                      <span className="text-zinc-300">Axis Bank, Anna Nagar Branch</span>
                    </div>
                    <div className="flex justify-between items-center py-1">
                      <span className="text-zinc-500">Account Type:</span>
                      <span className="text-zinc-300">Current Account</span>
                    </div>
                  </div>
                </div>
              )}

              {/* UTR / TRANSACTION ID SUBMISSION FORM */}
              <form onSubmit={handleSubmitPayment} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-mono text-yellow-400 uppercase font-bold flex items-center justify-between">
                    <span>Payment Reference / 12-Digit UTR Number *</span>
                    <span className="text-[10px] text-zinc-500 font-normal">From your UPI or Bank App</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 412389102938 (UPI Ref) or AXISN192837482"
                    value={utrNumber}
                    onChange={(e) => setUtrNumber(e.target.value)}
                    className="bg-zinc-900 border border-yellow-400/50 rounded-xl px-4 py-3 text-sm text-yellow-400 font-mono font-bold focus:outline-none focus:border-yellow-400 transition-colors placeholder:text-zinc-600"
                  />
                  <span className="text-[10px] text-zinc-500">
                    After making the transfer in your payment app, paste the 12-digit UPI reference or Bank UTR above to generate your instant digital receipt.
                  </span>
                </div>

                {/* Submit Confirmation Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 rounded-full bg-yellow-400 text-black font-extrabold text-xs uppercase tracking-wider hover:bg-yellow-300 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xl hover:shadow-yellow-400/20 disabled:opacity-50"
                >
                  {loading ? "Recording Confirmation..." : `Confirm & Submit Payment Record (₹${amountPaid.toLocaleString("en-IN")})`}
                  <ArrowRight className="w-4 h-4 stroke-[3]" />
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Footer Security Assurance */}
        <div className="p-4 border-t border-zinc-900 bg-zinc-950 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-zinc-500 font-mono">
          <div className="flex items-center gap-2">
            <Lock className="w-3.5 h-3.5 text-emerald-400" />
            <span>256-Bit SSL Encrypted Direct Bank Payments</span>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-zinc-400">
            <span>Official Billing by Gen-M Tech</span>
          </div>
        </div>
      </div>
    </div>
  );
}
