import { useState, useEffect, useCallback, useRef, createContext, useContext } from "react"
import { CheckCircle, XCircle, Info, AlertTriangle, X } from "lucide-react"

const ToastContext = createContext(null)

const ICONS = {
  success: <CheckCircle   size={18} />,
  error:   <XCircle       size={18} />,
  info:    <Info          size={18} />,
  warning: <AlertTriangle size={18} />,
}

const COLORS = {
  success: { bg: "#F0FDF4", border: "#BBF7D0", icon: "#16A34A", text: "#15803D", bar: "#16A34A" },
  error:   { bg: "#FEF2F2", border: "#FECACA", icon: "#DC2626", text: "#B91C1C", bar: "#DC2626" },
  info:    { bg: "#EFF6FF", border: "#BFDBFE", icon: "#2563EB", text: "#1D4ED8", bar: "#2563EB" },
  warning: { bg: "#FFFBEB", border: "#FDE68A", icon: "#D97706", text: "#B45309", bar: "#D97706" },
}

const DEFAULT_DURATION = 10000

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const add = useCallback((message, type = "info", duration = DEFAULT_DURATION) => {
    const id = Date.now() + Math.random()
    setToasts(t => [...t, { id, message, type, duration, visible: true }])
  }, [])

  const remove = useCallback((id) => {
    setToasts(t => t.map(x => x.id === id ? { ...x, visible: false } : x))
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 400)
  }, [])

  return (
    <ToastContext.Provider value={{
      success: (m, d) => add(m, "success", d),
      error:   (m, d) => add(m, "error",   d),
      info:    (m, d) => add(m, "info",    d),
      warning: (m, d) => add(m, "warning", d),
    }}>
      {children}
      <div style={{ position: "fixed", top: "1.25rem", right: "1.25rem", zIndex: 9999, display: "flex", flexDirection: "column", gap: "0.625rem", pointerEvents: "none" }}>
        {toasts.map(t => <Toast key={t.id} toast={t} onRemove={remove} />)}
      </div>
    </ToastContext.Provider>
  )
}

function Toast({ toast, onRemove }) {
  const c           = COLORS[toast.type]
  const [progress, setProgress] = useState(100)
  const paused      = useRef(false)
  const remaining   = useRef(toast.duration)
  const lastTick    = useRef(null)
  const rafId       = useRef(null)

  // Countdown drives the progress bar and auto-dismiss
  useEffect(() => {
    const tick = (now) => {
      if (!paused.current) {
        const delta = lastTick.current ? now - lastTick.current : 0
        lastTick.current = now
        remaining.current = Math.max(0, remaining.current - delta)
        setProgress((remaining.current / toast.duration) * 100)
        if (remaining.current <= 0) { onRemove(toast.id); return }
      } else {
        lastTick.current = now
      }
      rafId.current = requestAnimationFrame(tick)
    }
    rafId.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafId.current)
  }, [])

  return (
    <div
      onMouseEnter={() => { paused.current = true }}
      onMouseLeave={() => { paused.current = false }}
      style={{
        position: "relative", overflow: "hidden",
        display: "flex", alignItems: "flex-start", gap: "0.75rem",
        backgroundColor: c.bg, border: `1px solid ${c.border}`,
        borderRadius: "12px", padding: "0.875rem 1rem 1.25rem",
        boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
        minWidth: 300, maxWidth: 400, pointerEvents: "all",
        transform: toast.visible ? "translateY(0) scale(1)" : "translateY(-20px) scale(0.95)",
        opacity: toast.visible ? 1 : 0,
        transition: "transform 0.35s cubic-bezier(0.34,1.56,0.64,1), opacity 0.35s ease",
      }}
    >
      <span style={{ color: c.icon, flexShrink: 0, marginTop: "1px" }}>{ICONS[toast.type]}</span>
      <p style={{ margin: 0, flex: 1, fontSize: "0.875rem", fontWeight: 500, color: c.text, lineHeight: 1.55 }}>
        {toast.message}
      </p>
      <button
        onClick={() => onRemove(toast.id)}
        style={{ background: "none", border: "none", cursor: "pointer", color: c.icon, display: "flex", flexShrink: 0, padding: 0, opacity: 0.5 }}
      >
        <X size={14} />
      </button>

      {/* Progress bar */}
      <div style={{
        position: "absolute", bottom: 0, left: 0,
        height: 3, backgroundColor: c.bar, opacity: 0.5,
        width: `${progress}%`,
        transition: "width 0.1s linear",
        borderRadius: "0 0 0 12px",
      }} />
    </div>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error("useToast must be used inside ToastProvider")
  return ctx
}

let _toast = null
export function setToastRef(ref) { _toast = ref }
export const toast = {
  success: (m, d) => _toast?.success(m, d),
  error:   (m, d) => _toast?.error(m, d),
  info:    (m, d) => _toast?.info(m, d),
  warning: (m, d) => _toast?.warning(m, d),
}
