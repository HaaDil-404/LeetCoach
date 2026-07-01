import { createContext, useContext, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, Info, X } from "lucide-react";

const ToastContext = createContext(null);

let toastId = 0;

const icons = {
  success: CheckCircle2,
  error: XCircle,
  info: Info,
};

const colors = {
  success: {
    bg: "bg-easy/10",
    border: "border-easy/30",
    text: "text-easy",
    bar: "bg-easy",
  },
  error: {
    bg: "bg-hard/10",
    border: "border-hard/30",
    text: "text-hard",
    bar: "bg-hard",
  },
  info: {
    bg: "bg-accent/10",
    border: "border-accent/30",
    text: "text-accent",
    bar: "bg-accent",
  },
};

function Toast({ id, message, type = "info", onClose }) {
  const Icon = icons[type];
  const c = colors[type];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 80, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 80, scale: 0.9 }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      className={`relative flex items-start gap-3 px-4 py-3.5 rounded-xl border ${c.bg} ${c.border} backdrop-blur-xl shadow-lg shadow-black/20 max-w-sm overflow-hidden`}
    >
      <Icon className={`w-5 h-5 ${c.text} shrink-0 mt-0.5`} />
      <p className="text-sm text-text-primary leading-relaxed flex-1 pr-2">
        {message}
      </p>
      <button
        onClick={() => onClose(id)}
        className="shrink-0 w-6 h-6 rounded-md flex items-center justify-center text-text-muted hover:text-text-primary hover:bg-white/5 transition-colors cursor-pointer"
      >
        <X className="w-3.5 h-3.5" />
      </button>

      {/* Progress bar */}
      <motion.div
        className={`absolute bottom-0 left-0 h-0.5 ${c.bar}`}
        initial={{ width: "100%" }}
        animate={{ width: "0%" }}
        transition={{ duration: 4, ease: "linear" }}
      />
    </motion.div>
  );
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = "info") => {
    const id = ++toastId;
    setToasts((prev) => [...prev, { id, message, type }]);

    // Auto-dismiss after 4 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);

    return id;
  }, []);

  const dismissToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast, dismissToast }}>
      {children}

      {/* Toast container — fixed in bottom-right */}
      <div className="fixed bottom-6 right-6 z-[100] flex flex-col-reverse gap-3 pointer-events-none">
        <AnimatePresence mode="popLayout">
          {toasts.map((toast) => (
            <div key={toast.id} className="pointer-events-auto">
              <Toast
                id={toast.id}
                message={toast.message}
                type={toast.type}
                onClose={dismissToast}
              />
            </div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
