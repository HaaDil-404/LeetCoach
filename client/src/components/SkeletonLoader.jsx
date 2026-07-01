import { motion } from "framer-motion";

/**
 * Single skeleton line with shimmer animation.
 * @param {string} width — Tailwind width class, e.g. "w-3/4", "w-full", "w-1/2"
 * @param {string} height — Tailwind height class, default "h-4"
 */
export function SkeletonLine({ width = "w-full", height = "h-4", className = "" }) {
  return (
    <div
      className={`${width} ${height} rounded-lg bg-white/5 animate-shimmer ${className}`}
    />
  );
}

/**
 * Skeleton paragraph — multiple shimmer lines simulating text.
 * @param {number} lines — Number of lines to render
 */
export function SkeletonParagraph({ lines = 4, className = "" }) {
  const widths = ["w-full", "w-11/12", "w-4/5", "w-3/4", "w-5/6", "w-2/3"];

  return (
    <div className={`space-y-3 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: i * 0.08 }}
        >
          <SkeletonLine width={widths[i % widths.length]} />
        </motion.div>
      ))}
    </div>
  );
}

/**
 * Card-shaped skeleton with header and body.
 */
export function SkeletonCard({ className = "" }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`glass-card p-6 space-y-4 ${className}`}
    >
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-white/5 animate-shimmer shrink-0" />
        <div className="flex-1 space-y-2">
          <SkeletonLine width="w-1/3" height="h-5" />
          <SkeletonLine width="w-1/2" height="h-3" />
        </div>
      </div>

      {/* Body */}
      <SkeletonParagraph lines={3} />

      {/* Footer */}
      <div className="flex gap-2 pt-2">
        <SkeletonLine width="w-20" height="h-8" />
        <SkeletonLine width="w-24" height="h-8" />
      </div>
    </motion.div>
  );
}

/**
 * AI response skeleton — mimics the shape of an AI-generated answer.
 */
export function SkeletonAIResponse() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-6 space-y-5"
    >
      {/* Title */}
      <SkeletonLine width="w-2/5" height="h-6" />

      {/* Paragraph 1 */}
      <SkeletonParagraph lines={3} />

      {/* Code block placeholder */}
      <div className="rounded-xl bg-bg-input border border-border p-4 space-y-2">
        <SkeletonLine width="w-1/4" height="h-3" />
        <SkeletonLine width="w-3/4" height="h-3" />
        <SkeletonLine width="w-1/2" height="h-3" />
        <SkeletonLine width="w-5/6" height="h-3" />
      </div>

      {/* Paragraph 2 */}
      <SkeletonParagraph lines={2} />

      {/* Tags / sources */}
      <div className="flex gap-2 pt-1">
        <SkeletonLine width="w-16" height="h-6" />
        <SkeletonLine width="w-20" height="h-6" />
        <SkeletonLine width="w-14" height="h-6" />
      </div>
    </motion.div>
  );
}

/**
 * Knowledge / RAG result skeleton — mimics the sources row + answer card layout.
 */
export function SkeletonKnowledgeResult() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      {/* Sources row */}
      <div className="flex items-center gap-2">
        <SkeletonLine width="w-3" height="h-3" className="rounded-full shrink-0" />
        <SkeletonLine width="w-12" height="h-4" />
        <SkeletonLine width="w-20" height="h-5" />
        <SkeletonLine width="w-24" height="h-5" />
        <SkeletonLine width="w-16" height="h-5" />
      </div>

      {/* Answer card */}
      <div className="glass-card p-6 space-y-5 border-l-2 border-[#a78bfa]/20">
        {/* Badge row */}
        <div className="flex items-center gap-2">
          <SkeletonLine width="w-7" height="h-7" className="rounded-lg shrink-0" />
          <SkeletonLine width="w-28" height="h-4" />
        </div>

        {/* Paragraph */}
        <SkeletonParagraph lines={3} />

        {/* Code block */}
        <div className="rounded-xl bg-bg-input border border-border p-4 space-y-2">
          <SkeletonLine width="w-1/4" height="h-3" />
          <SkeletonLine width="w-2/3" height="h-3" />
          <SkeletonLine width="w-1/2" height="h-3" />
          <SkeletonLine width="w-3/4" height="h-3" />
        </div>

        {/* Follow-up paragraph */}
        <SkeletonParagraph lines={2} />
      </div>
    </motion.div>
  );
}
