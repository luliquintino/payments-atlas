"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

/* ── Types ────────────────────────────────────────────── */
type ToastType = "success" | "error" | "info";

interface ToastItem {
  id: number;
  message: string;
  type: ToastType;
  exiting: boolean;
}

interface ToastContextValue {
  showToast: (message: string, type?: ToastType) => void;
}

/* ── Context ──────────────────────────────────────────── */
const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside <ToastProvider>");
  return ctx;
}

/* ── Icon per variant ─────────────────────────────────── */
function ToastIcon({ type }: { type: ToastType }) {
  if (type === "success")
    return (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path
          d="M7 10l2 2 4-4"
          stroke="var(--success)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="10" cy="10" r="8" stroke="var(--success)" strokeWidth="1.5" />
      </svg>
    );
  if (type === "error")
    return (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <circle cx="10" cy="10" r="8" stroke="var(--error)" strokeWidth="1.5" />
        <path
          d="M10 7v4m0 2h.01"
          stroke="var(--error)"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    );
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="8" stroke="var(--primary)" strokeWidth="1.5" />
      <path
        d="M10 9v4m0-6h.01"
        stroke="var(--primary)"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

/* ── Border colour per variant ────────────────────────── */
function borderColor(type: ToastType): string {
  if (type === "success") return "var(--success)";
  if (type === "error") return "var(--error)";
  return "var(--primary)";
}

/* ── Provider ─────────────────────────────────────────── */
export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const idRef = useRef(0);

  const showToast = useCallback((message: string, type: ToastType = "info") => {
    const id = ++idRef.current;
    setToasts((prev) => [...prev, { id, message, type, exiting: false }]);
  }, []);

  /* Auto-dismiss after 3 s */
  const dismiss = useCallback((id: number) => {
    setToasts((prev) =>
      prev.map((t) => (t.id === id ? { ...t, exiting: true } : t))
    );
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 300);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {/* Toast container */}
      <div
        style={{
          position: "fixed",
          bottom: 24,
          right: 24,
          zIndex: 9999,
          display: "flex",
          flexDirection: "column-reverse",
          gap: 8,
          pointerEvents: "none",
        }}
      >
        {toasts.map((t) => (
          <ToastCard key={t.id} toast={t} onDismiss={dismiss} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

/* ── Single toast card ────────────────────────────────── */
function ToastCard({
  toast,
  onDismiss,
}: {
  toast: ToastItem;
  onDismiss: (id: number) => void;
}) {
  useEffect(() => {
    const timer = setTimeout(() => onDismiss(toast.id), 3000);
    return () => clearTimeout(timer);
  }, [toast.id, onDismiss]);

  return (
    <div
      className={toast.exiting ? "toast-exit" : "toast-enter"}
      style={{
        pointerEvents: "auto",
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "12px 16px",
        background: "var(--surface)",
        borderRadius: 10,
        borderLeft: `4px solid ${borderColor(toast.type)}`,
        boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
        minWidth: 260,
        maxWidth: 380,
        fontSize: "0.875rem",
        color: "var(--foreground)",
      }}
    >
      <ToastIcon type={toast.type} />
      <span style={{ flex: 1 }}>{toast.message}</span>
    </div>
  );
}
