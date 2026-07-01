import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Database, CheckCircle2, AlertCircle, Loader2, ChevronDown, X } from "lucide-react";
import { aiAPI } from "../api";

/**
 * RAGStatusBadge — Live indicator showing the RAG knowledge base status.
 * Polls /api/ai/rag-status on mount and displays:
 *  - 🟢 Green  → initialized & ready
 *  - 🟡 Amber  → initializing (loading)
 *  - 🔴 Red    → error / not initialized
 *
 * @param {boolean} showDetails — If true, shows an expanded detail panel on click
 */
export default function RAGStatusBadge({ showDetails = true }) {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);

  const fetchStatus = async () => {
    try {
      const res = await aiAPI.getRAGStatus();
      setStatus(res.data.data);
    } catch {
      setStatus({ initialized: false, initializing: false, error: "Could not reach server" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
    // Poll every 8s while initializing
    const interval = setInterval(() => {
      if (status?.initializing) fetchStatus();
    }, 8000);
    return () => clearInterval(interval);
  }, [status?.initializing]);

  // ── Derived state ──────────────────────────────────────────
  const isReady = status?.initialized && !status?.error;
  const isInit = status?.initializing;
  const hasError = !!status?.error;

  const dotColor = loading || isInit
    ? "bg-amber-400"
    : isReady
      ? "bg-emerald-400"
      : "bg-red-400";

  const badgeText = loading
    ? "Checking..."
    : isInit
      ? "Initializing..."
      : isReady
        ? `Ready · ${status.knowledgeFiles} topics`
        : "Not Ready";

  const badgeBg = loading || isInit
    ? "bg-amber-400/10 border-amber-400/20 text-amber-400"
    : isReady
      ? "bg-emerald-400/10 border-emerald-400/20 text-emerald-400"
      : "bg-red-400/10 border-red-400/20 text-red-400";

  return (
    <div className="relative">
      {/* Badge trigger */}
      <button
        onClick={() => showDetails && setExpanded((e) => !e)}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${badgeBg} ${showDetails ? "cursor-pointer hover:opacity-80" : "cursor-default"}`}
        title="RAG Knowledge Base Status"
      >
        {/* Animated status dot */}
        <span className="relative flex h-2 w-2 shrink-0">
          {(loading || isInit) && (
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${dotColor} opacity-75`} />
          )}
          <span className={`relative inline-flex rounded-full h-2 w-2 ${dotColor}`} />
        </span>

        <Database className="w-3 h-3" />
        <span>RAG · {badgeText}</span>

        {showDetails && (
          <ChevronDown
            className={`w-3 h-3 transition-transform ${expanded ? "rotate-180" : ""}`}
          />
        )}
      </button>

      {/* Expanded detail panel */}
      <AnimatePresence>
        {expanded && showDetails && status && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ duration: 0.18 }}
            className="absolute right-0 top-full mt-2 z-50 w-72 glass-card p-4 shadow-xl shadow-black/30"
            style={{ border: "1px solid rgba(255,255,255,0.1)" }}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-text-muted" />
                <span className="text-xs font-semibold text-text-primary uppercase tracking-wider">
                  RAG Knowledge Base
                </span>
              </div>
              <button
                onClick={() => setExpanded(false)}
                className="w-5 h-5 flex items-center justify-center rounded text-text-muted hover:text-text-primary transition-colors cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Status rows */}
            <div className="space-y-2.5">
              <StatusRow
                label="Status"
                value={
                  isReady ? "Initialized & Ready" :
                  isInit ? "Initializing..." :
                  hasError ? "Error" : "Not Initialized"
                }
                icon={
                  isReady ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> :
                  isInit ? <Loader2 className="w-3.5 h-3.5 text-amber-400 animate-spin" /> :
                  <AlertCircle className="w-3.5 h-3.5 text-red-400" />
                }
              />
              <StatusRow label="Chunks Embedded" value={status.documentCount ?? 0} />
              <StatusRow label="Knowledge Files" value={`${status.knowledgeFiles ?? 0} topics`} />

              {/* Topic pills */}
              {status.topicNames && status.topicNames.length > 0 && (
                <div>
                  <p className="text-[10px] text-text-muted uppercase tracking-wider mb-1.5">Topics</p>
                  <div className="flex flex-wrap gap-1">
                    {status.topicNames.map((t) => (
                      <span
                        key={t}
                        className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-white/5 text-text-secondary border border-white/8 capitalize"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Error message */}
              {hasError && (
                <div className="p-2.5 rounded-lg bg-red-400/10 border border-red-400/20">
                  <p className="text-[11px] text-red-400 leading-relaxed">{status.error}</p>
                </div>
              )}
            </div>

            {/* Refresh button */}
            <button
              onClick={() => { setLoading(true); fetchStatus(); }}
              className="mt-3 w-full text-[11px] text-text-muted hover:text-text-secondary transition-colors flex items-center justify-center gap-1.5 py-1 cursor-pointer"
            >
              <Loader2 className="w-3 h-3" />
              Refresh status
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function StatusRow({ label, value, icon }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[11px] text-text-muted">{label}</span>
      <div className="flex items-center gap-1.5">
        {icon}
        <span className="text-[11px] font-medium text-text-secondary">{value}</span>
      </div>
    </div>
  );
}
