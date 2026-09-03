"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Invoice } from "@/lib/types";
import { 
  ArrowLeft, 
  Printer, 
  CheckCircle2, 
  CreditCard, 
  ShieldCheck, 
  QrCode, 
  Lock, 
  X, 
  Building,
  Smartphone,
  Sparkles
} from "lucide-react";

export default function InvoiceViewPage() {
  const params = useParams();
  const router = useRouter();
  const invoiceId = params?.id as string;

  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"card" | "upi" | "bank">("card");
  const [paying, setPaying] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // Form states for card simulation
  const [cardNumber, setCardNumber] = useState("4242 •••• •••• 4242");
  const [cardExpiry, setCardExpiry] = useState("12/28");
  const [cardCvc, setCardCvc] = useState("888");
  const [upiId, setUpiId] = useState("sindhu@okaxis");

  useEffect(() => {
    if (!invoiceId) return;
    fetch(`/api/invoices/${invoiceId}`)
      .then(res => res.json())
      .then(data => {
        if (data.invoice) setInvoice(data.invoice);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [invoiceId]);

  const handleProcessPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setPaying(true);

    try {
      const res = await fetch(`/api/invoices/${invoiceId}/pay`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paymentMethod: paymentMethod === "card" ? "credit_card" : paymentMethod === "upi" ? "upi" : "bank_transfer",
          payerEmail: invoice?.clientEmail,
          payerName: invoice?.clientName,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Payment failed");

      setInvoice(data.invoice);
      setPaymentSuccess(true);
      setTimeout(() => {
        setShowPaymentModal(false);
      }, 1800);
    } catch (err: any) {
      alert(err.message || "Payment processing failed");
    } finally {
      setPaying(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-black min-h-screen text-white flex items-center justify-center font-mono text-sm">
        Generating invoice document...
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="bg-black min-h-screen text-white flex flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold">Invoice Not Found</h1>
        <Link href="/client/dashboard" className="text-yellow-400 text-sm">
          Return to Client Portal
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-black min-h-screen text-white font-sans flex flex-col py-8 px-4 sm:px-6 selection:bg-yellow-400 selection:text-black">
      {/* Action Navigation */}
      <div className="max-w-4xl mx-auto w-full flex items-center justify-between mb-6 print:hidden">
        <Link
          href="/client/dashboard"
          className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-zinc-400 hover:text-yellow-400 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
        </Link>

        <div className="flex items-center gap-3">
          <button
            onClick={() => window.print()}
            className="px-4 py-2 rounded-full bg-zinc-900 border border-zinc-700 text-xs font-mono text-zinc-300 hover:text-white hover:border-yellow-400 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" /> Print / Save PDF
          </button>

          {invoice.status !== "PAID" && (
            <button
              onClick={() => setShowPaymentModal(true)}
              className="px-6 py-2 rounded-full bg-yellow-400 text-black font-bold text-xs uppercase tracking-wider hover:bg-yellow-300 transition-colors flex items-center gap-1.5 cursor-pointer shadow-lg shadow-yellow-400/10"
            >
              <CreditCard className="w-3.5 h-3.5 stroke-[2.5]" />
              Pay Now (${(invoice.totalAmount || invoice.total || 0).toLocaleString()})
            </button>
          )}
        </div>
      </div>

      {/* Invoice Printable Sheet */}
      <div className="max-w-4xl mx-auto w-full bg-zinc-950 border border-zinc-800 rounded-3xl p-8 sm:p-12 shadow-2xl flex flex-col gap-10 print:border-none print:bg-white print:text-black">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 border-b border-zinc-900 pb-8 print:border-gray-200">
          <div>
            <div className="flex items-center gap-1 mb-2">
              <span className="text-2xl font-black tracking-tight text-white print:text-black">
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
            </div>
            <p className="text-xs text-zinc-400 print:text-gray-600 font-mono">
              GEN-M Digital Product Studio & AI Agency<br />
              Enterprise ID: GM-CORP-2026<br />
              billing@gen-m.com
            </p>
          </div>

          <div className="sm:text-right">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-yellow-400 print:text-black block mb-1">
              INVOICE STATEMENT
            </span>
            <h2 className="text-2xl font-mono font-black text-white print:text-black mb-2">
              {invoice.invoiceNumber}
            </h2>
            <div className="inline-block">
              <span className={`px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider border ${
                invoice.status === "PAID"
                  ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30 print:border-emerald-600 print:text-emerald-700"
                  : "bg-amber-500/10 text-amber-400 border-amber-500/30 print:border-amber-600 print:text-amber-700"
              }`}>
                STATUS: {invoice.status}
              </span>
            </div>
          </div>
        </div>

        {/* Client & Date Details */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 text-xs font-mono">
          <div>
            <span className="text-zinc-500 print:text-gray-500 uppercase block mb-1">Billed To</span>
            <span className="text-white print:text-black font-bold block">{invoice.clientCompany || invoice.clientName}</span>
            <span className="text-zinc-400 print:text-gray-600">{invoice.clientName}</span>
            <span className="text-zinc-400 print:text-gray-600 block">{invoice.clientEmail}</span>
          </div>

          <div>
            <span className="text-zinc-500 print:text-gray-500 uppercase block mb-1">Project Milestone</span>
            <span className="text-white print:text-black font-bold block">{invoice.projectName}</span>
            <span className="text-zinc-400 print:text-gray-600">ID: {invoice.projectId}</span>
          </div>

          <div>
            <span className="text-zinc-500 print:text-gray-500 uppercase block mb-1">Dates</span>
            <span className="text-zinc-300 print:text-gray-700 block">Issue: {invoice.issueDate}</span>
            <span className="text-yellow-400 print:text-black font-bold block">Due: {invoice.dueDate}</span>
          </div>
        </div>

        {/* Itemized Table */}
        <div className="border border-zinc-900 print:border-gray-300 rounded-2xl overflow-hidden">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-zinc-900/60 print:bg-gray-100 text-zinc-400 print:text-gray-700 border-b border-zinc-900 print:border-gray-300">
              <tr>
                <th className="p-4 uppercase tracking-wider">Description</th>
                <th className="p-4 uppercase tracking-wider text-center">Qty</th>
                <th className="p-4 uppercase tracking-wider text-right">Unit Price</th>
                <th className="p-4 uppercase tracking-wider text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-900 print:divide-gray-200">
              {invoice.items.map((item, idx) => (
                <tr key={idx} className="text-zinc-200 print:text-black">
                  <td className="p-4 font-sans font-medium">{item.description}</td>
                  <td className="p-4 text-center">{item.quantity}</td>
                  <td className="p-4 text-right">${(item.unitPrice || item.rate || 0).toLocaleString()}</td>
                  <td className="p-4 text-right font-bold">${item.amount.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Total Summary */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 border-t border-zinc-900 print:border-gray-200 pt-6">
          <div className="text-xs text-zinc-500 print:text-gray-600 max-w-sm">
            <span className="font-bold text-zinc-300 print:text-black block mb-1 font-mono">Payment Terms</span>
            Direct settlement via integrated checkout. All intellectual property transfers immediately upon invoice clearance.
          </div>

          <div className="w-full sm:w-64 flex flex-col gap-2 font-mono text-xs">
            <div className="flex justify-between text-zinc-400 print:text-gray-600">
              <span>Subtotal:</span>
              <span>${invoice.subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-zinc-400 print:text-gray-600">
              <span>Tax / VAT (0%):</span>
              <span>$0.00</span>
            </div>
            <div className="flex justify-between text-base font-bold text-white print:text-black pt-2 border-t border-zinc-800 print:border-gray-300">
              <span className="text-yellow-400 print:text-black">Total Due:</span>
              <span>${(invoice.totalAmount || invoice.total || 0).toLocaleString()} {invoice.currency}</span>
            </div>
          </div>
        </div>

        {/* Paid Stamp */}
        {invoice.status === "PAID" && (
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>Paid in full on {invoice.paidAt || invoice.issueDate || new Date().toISOString().split('T')[0]}. Receipt generated.</span>
            </div>
            <span className="font-bold">TXN: GM-PAY-{invoice.id.slice(-6).toUpperCase()}</span>
          </div>
        )}
      </div>

      {/* Payment Gateway Modal (Razorpay / Stripe simulation) */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-zinc-950 border border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-yellow-400" />
                <h3 className="text-lg font-bold text-white">Secure Payment Portal</h3>
              </div>
              <button onClick={() => setShowPaymentModal(false)} className="text-zinc-500 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {paymentSuccess ? (
              <div className="py-8 text-center flex flex-col items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="text-xl font-bold text-white">Payment Authorized!</h4>
                <p className="text-xs text-zinc-400 font-mono">
                  ${(invoice.totalAmount || invoice.total || 0).toLocaleString()} USD processed successfully.
                </p>
              </div>
            ) : (
              <form onSubmit={handleProcessPayment} className="flex flex-col gap-5">
                {/* Method selector */}
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("card")}
                    className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 text-xs font-semibold transition-colors ${
                      paymentMethod === "card"
                        ? "bg-zinc-900 border-yellow-400 text-yellow-400"
                        : "bg-zinc-950 border-zinc-800 text-zinc-400"
                    }`}
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>Card</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod("upi")}
                    className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 text-xs font-semibold transition-colors ${
                      paymentMethod === "upi"
                        ? "bg-zinc-900 border-yellow-400 text-yellow-400"
                        : "bg-zinc-950 border-zinc-800 text-zinc-400"
                    }`}
                  >
                    <Smartphone className="w-4 h-4" />
                    <span>UPI / QR</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod("bank")}
                    className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 text-xs font-semibold transition-colors ${
                      paymentMethod === "bank"
                        ? "bg-zinc-900 border-yellow-400 text-yellow-400"
                        : "bg-zinc-950 border-zinc-800 text-zinc-400"
                    }`}
                  >
                    <Building className="w-4 h-4" />
                    <span>Wire</span>
                  </button>
                </div>

                {/* Form fields depending on method */}
                {paymentMethod === "card" && (
                  <div className="flex flex-col gap-3">
                    <div className="flex flex-col gap-1">
                      <label className="text-[11px] font-mono text-zinc-400 uppercase">Card Number</label>
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs font-mono text-white focus:outline-none focus:border-yellow-400"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex flex-col gap-1">
                        <label className="text-[11px] font-mono text-zinc-400 uppercase">Expiry (MM/YY)</label>
                        <input
                          type="text"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs font-mono text-white focus:outline-none focus:border-yellow-400"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-[11px] font-mono text-zinc-400 uppercase">CVC</label>
                        <input
                          type="password"
                          value={cardCvc}
                          onChange={(e) => setCardCvc(e.target.value)}
                          className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs font-mono text-white focus:outline-none focus:border-yellow-400"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === "upi" && (
                  <div className="flex flex-col gap-3">
                    <div className="flex flex-col gap-1">
                      <label className="text-[11px] font-mono text-zinc-400 uppercase">UPI ID / VPA</label>
                      <input
                        type="text"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        placeholder="user@upi"
                        className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs font-mono text-white focus:outline-none focus:border-yellow-400"
                      />
                    </div>
                    <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-between text-xs font-mono text-zinc-400">
                      <QrCode className="w-5 h-5 text-yellow-400" />
                      <span>Instant UPI Collect Request</span>
                    </div>
                  </div>
                )}

                {paymentMethod === "bank" && (
                  <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 text-xs font-mono flex flex-col gap-1.5 text-zinc-300">
                    <span className="text-yellow-400 font-bold">Gen-M Agency Vault:</span>
                    <span>Bank: Silicon Valley Bank / Axis Intl</span>
                    <span>Account: 9948 2001 8839 01</span>
                    <span>Routing / Swift: GENMUS66XXX</span>
                  </div>
                )}

                <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800/60 flex items-center justify-between text-xs font-mono">
                  <span className="text-zinc-400">Total Settlement:</span>
                  <span className="text-yellow-400 font-bold">${(invoice.totalAmount || invoice.total || 0).toLocaleString()} USD</span>
                </div>

                <button
                  type="submit"
                  disabled={paying}
                  className="w-full py-3 rounded-full bg-yellow-400 text-black font-bold text-xs uppercase tracking-wider hover:bg-yellow-300 transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Lock className="w-3.5 h-3.5 stroke-[2.5]" />
                  {paying ? "Processing Transaction..." : `Authorize $${(invoice.totalAmount || invoice.total || 0).toLocaleString()}`}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
