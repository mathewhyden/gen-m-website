"use client";

import React, { useEffect, useState } from "react";
import { 
  CreditCard, 
  Search, 
  CheckCircle2, 
  DollarSign, 
  ArrowUpRight,
  ShieldCheck,
  Building,
  Smartphone
} from "lucide-react";
import { PaymentRecord } from "@/lib/types";

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/payments")
      .then(res => res.json())
      .then(data => {
        if (data.payments) setPayments(data.payments);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const totalCleared = payments
    .filter(p => p.status === "SUCCESS")
    .reduce((acc, p) => acc + p.amount, 0);

  return (
    <div className="flex flex-col gap-8">
      <div>
        <span className="text-xs font-mono font-bold uppercase tracking-wider text-yellow-400 block mb-1">
          Settlements & Gateway Vault
        </span>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Payment Ledger & Receipts</h1>
      </div>

      {/* Summary Banner */}
      <div className="p-6 md:p-8 rounded-3xl bg-zinc-950 border border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono text-zinc-400 uppercase">Total Settled Balance</span>
          <h2 className="text-3xl font-black font-mono text-emerald-400 mt-1">
            ${totalCleared.toLocaleString()} USD
          </h2>
          <span className="text-xs text-zinc-500 font-mono">{payments.length} Verified Gateway Transactions</span>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-900 border border-zinc-800 text-xs text-zinc-300 font-mono">
          <ShieldCheck className="w-4 h-4 text-yellow-400" />
          <span>Automated 256-bit Settlement Protocol</span>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="rounded-3xl bg-zinc-950 border border-zinc-800 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs font-mono text-zinc-500">Retrieving payment ledger...</div>
        ) : payments.length === 0 ? (
          <div className="p-12 text-center text-xs font-mono text-zinc-500">No payment transactions found.</div>
        ) : (
          <div className="divide-y divide-zinc-900">
            {payments.map((p) => (
              <div key={p.id} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-zinc-900/40 transition-colors">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 flex-shrink-0">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-mono font-bold text-white">{p.transactionId}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                        {p.status}
                      </span>
                    </div>
                    <span className="text-xs text-zinc-300">
                      Payer: <strong className="text-white">{p.payerName}</strong> ({p.payerEmail})
                    </span>
                    <span className="text-[11px] font-mono text-zinc-500">
                      Gateway: <strong className="text-zinc-400">{p.gateway}</strong> ({(p.paymentMethod || p.method || 'card').replace('_', ' ')}) | Date: {new Date(p.timestamp || p.createdAt).toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xl font-mono font-bold text-emerald-400 block">
                    +${p.amount.toLocaleString()}
                  </span>
                  <span className="text-[10px] font-mono text-zinc-500">{p.currency} CLEARED</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
