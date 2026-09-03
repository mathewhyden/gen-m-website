"use client";

import React, { useEffect, useState } from "react";
import { 
  MailCheck, 
  Search, 
  Clock, 
  Send, 
  ShieldCheck, 
  RefreshCw 
} from "lucide-react";
import { EmailLog } from "@/lib/types";

export default function AdminEmailLogsPage() {
  const [logs, setLogs] = useState<EmailLog[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLogs = () => {
    setLoading(true);
    fetch("/api/admin/email-logs")
      .then(res => res.json())
      .then(data => {
        if (data.emailLogs) setLogs(data.emailLogs);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-yellow-400 block mb-1">
            System Telemetry & Notifications
          </span>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Email Dispatch Logs</h1>
        </div>
        <button
          onClick={fetchLogs}
          className="px-4 py-2 rounded-full bg-zinc-900 border border-zinc-700 text-xs font-mono text-zinc-300 hover:text-white hover:border-yellow-400 transition-colors flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} /> Refresh Logs
        </button>
      </div>

      <div className="rounded-3xl bg-zinc-950 border border-zinc-800 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs font-mono text-zinc-500">Reading dispatch buffer...</div>
        ) : logs.length === 0 ? (
          <div className="p-12 text-center text-xs font-mono text-zinc-500">No outgoing notification events logged.</div>
        ) : (
          <div className="divide-y divide-zinc-900">
            {logs.map((log) => (
              <div key={log.id} className="p-6 flex flex-col md:flex-row md:items-start justify-between gap-4 hover:bg-zinc-900/40 transition-colors">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-lg bg-yellow-400/10 border border-yellow-400/20 flex items-center justify-center text-yellow-400 flex-shrink-0 mt-0.5">
                    <MailCheck className="w-4 h-4" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-white">{log.subject}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                        {log.status}
                      </span>
                    </div>
                    <span className="text-xs font-mono text-zinc-400">
                      Recipient: <strong className="text-yellow-400">{log.to}</strong>
                    </span>
                    <p className="text-xs text-zinc-400 leading-relaxed max-w-2xl bg-zinc-900/50 p-3 rounded-xl border border-zinc-800/80 mt-1 font-sans">
                      {log.body}
                    </p>
                  </div>
                </div>

                <span className="text-[11px] font-mono text-zinc-500 whitespace-nowrap">
                  {new Date(log.sentAt).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
