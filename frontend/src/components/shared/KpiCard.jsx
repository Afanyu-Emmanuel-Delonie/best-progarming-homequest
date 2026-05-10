import { TrendingUp, TrendingDown } from "lucide-react"

/**
 * KpiCard
 * Props: label, value, sub, up, icon, accent, active, onClick
 * - active: shows gradient banner (like the removed hero banner)
 * - inactive: white card with left accent bar
 */
export default function KpiCard({ label, value, sub, up, icon, accent, active, onClick }) {
  if (active) {
    return (
      <div
        onClick={onClick}
        style={{
          background: `linear-gradient(135deg, ${accent} 0%, ${accent}cc 100%)`,
          borderRadius: "14px",
          padding: "1.25rem 1.5rem",
          display: "flex", flexDirection: "column", gap: "0.65rem",
          cursor: onClick ? "pointer" : "default",
          position: "relative", overflow: "hidden",
          boxShadow: `0 8px 24px ${accent}40`,
        }}
      >
        <div style={{ position: "absolute", top: -20, right: -20, width: 100, height: 100, borderRadius: "50%", backgroundColor: "#ffffff12" }} />
        <div style={{ position: "absolute", bottom: -30, right: 30, width: 70, height: 70, borderRadius: "50%", backgroundColor: "#ffffff08" }} />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", position: "relative" }}>
          <p style={{ margin: 0, fontSize: "0.72rem", fontWeight: 600, color: "#ffffffcc", textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</p>
          <div style={{ width: 34, height: 34, borderRadius: "9px", backgroundColor: "#ffffff20", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>{icon}</div>
        </div>
        <p style={{ margin: 0, fontSize: "1.875rem", fontWeight: 800, color: "#fff", lineHeight: 1, position: "relative" }}>{value}</p>
        <div style={{ display: "flex", alignItems: "center", gap: "0.3rem", fontSize: "0.72rem", color: "#ffffffcc", position: "relative" }}>
          {up ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
          <span>{sub}</span>
        </div>
      </div>
    )
  }

  return (
    <div
      onClick={onClick}
      style={{
        backgroundColor: "var(--color-surface)",
        borderRadius: "14px",
        border: "1px solid var(--color-border)",
        padding: "1.25rem 1.5rem",
        display: "flex", flexDirection: "column", gap: "0.65rem",
        cursor: onClick ? "pointer" : "default",
        position: "relative", overflow: "hidden",
      }}
    >
      <div style={{ position: "absolute", top: 0, left: 0, bottom: 0, width: 3, backgroundColor: accent, borderRadius: "14px 0 0 14px" }} />
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <p style={{ margin: 0, fontSize: "0.72rem", fontWeight: 600, color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</p>
        <div style={{ width: 34, height: 34, borderRadius: "9px", backgroundColor: `${accent}15`, color: accent, display: "flex", alignItems: "center", justifyContent: "center" }}>{icon}</div>
      </div>
      <p style={{ margin: 0, fontSize: "1.875rem", fontWeight: 800, color: "var(--color-text)", lineHeight: 1 }}>{value}</p>
      <div style={{ display: "flex", alignItems: "center", gap: "0.3rem", fontSize: "0.72rem", color: up ? "#15803D" : "#C2410C" }}>
        {up ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
        <span>{sub}</span>
      </div>
    </div>
  )
}
