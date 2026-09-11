import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PaymentAdvanceSection from "@/components/PaymentAdvanceSection";
import { ShieldCheck, Lock, CheckCircle2 } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Make a Payment / Pay Advance | Gen-M Tech",
  description: "Official Client Payment Portal. Pay your project advance or milestone settlement via UPI QR, Bank Transfer, or Card Gateway.",
};

export default function PayPage() {
  return (
    <div className="bg-black min-h-screen text-white font-sans selection:bg-yellow-400 selection:text-black">
      <Navbar />

      <main className="max-w-6xl mx-auto px-6 py-28 md:py-36 flex flex-col gap-12">
        <div className="text-center max-w-2xl mx-auto flex flex-col items-center">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-yellow-400 mb-3 px-3 py-1 rounded-full bg-yellow-400/10 border border-yellow-400/20">
            Secure Client Checkout
          </span>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white">
            Make a Payment / Pay Advance
          </h1>
          <p className="text-sm md:text-base text-zinc-400 mt-4 leading-relaxed">
            Settle your project mobilization advance or milestone invoice directly via verified UPI, Bank Transfer (NEFT/IMPS), or Cards.
          </p>
        </div>

        {/* The Interactive Payment Section */}
        <PaymentAdvanceSection />

        {/* Trust Badges */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
          <div className="p-6 rounded-2xl bg-zinc-950 border border-zinc-800/80 flex items-start gap-4">
            <div className="p-3 rounded-xl bg-yellow-400/10 text-yellow-400 border border-yellow-400/20">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-white">Verified Business Account</span>
              <span className="text-xs text-zinc-400 mt-1">
                Direct settlement into Gen-M Tech verified business accounts. Zero intermediary risk.
              </span>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-zinc-950 border border-zinc-800/80 flex items-start gap-4">
            <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-white">Automated Tax Invoice</span>
              <span className="text-xs text-zinc-400 mt-1">
                A formal GST-compliant invoice is immediately generated and dispatched upon UTR recording.
              </span>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-zinc-950 border border-zinc-800/80 flex items-start gap-4">
            <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <Lock className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-white">Permanent Ledger Record</span>
              <span className="text-xs text-zinc-400 mt-1">
                Your payment reference is synchronized to our cloud database and visible in your project milestone review.
              </span>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
