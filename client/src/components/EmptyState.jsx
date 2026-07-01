import { motion } from "framer-motion";

/**
 * Reusable empty state component with animated icon, title, description, and optional CTA.
 *
 * @param {React.ComponentType} icon — Lucide icon component
 * @param {string} title — Heading text
 * @param {string} description — Supporting text
 * @param {string} iconColor — Tailwind text color class for the icon, default "text-accent"
 * @param {string} iconBg — Tailwind bg color class for the icon container, default "bg-accent/10"
 * @param {React.ReactNode} action — Optional CTA button/element
 */
export default function EmptyState({
  icon: Icon,
  title,
  description,
  iconColor = "text-accent",
  iconBg = "bg-accent/10",
  action,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center py-16 px-6 text-center"
    >
      {/* Animated floating icon */}
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className={`w-16 h-16 rounded-2xl ${iconBg} flex items-center justify-center mb-5 shadow-lg`}
      >
        <Icon className={`w-8 h-8 ${iconColor}`} />
      </motion.div>

      {/* Title */}
      <h3 className="text-lg font-semibold text-text-primary mb-2 tracking-tight">
        {title}
      </h3>

      {/* Description */}
      <p className="text-sm text-text-secondary max-w-xs leading-relaxed">
        {description}
      </p>

      {/* Optional action */}
      {action && <div className="mt-5">{action}</div>}
    </motion.div>
  );
}
