import { Search, SlidersHorizontal, MoreHorizontal } from "lucide-react"
import { useState, useRef, useEffect } from "react"

/**
 * StatCard — simple stat display using the KpiCard inactive design.
 * Props: label, value, color (maps to accent), icon (optional), sub (optional)
 */
export function StatCard({ label, value, color, icon, sub }) {
  const accent = color ?? "var(--color-primary)"
  return (
    <div style={{
      backgroundColor: "var(--color-surface)",
      borderRadius: "14px",
      border: "1px solid var(--color-border)",
      padding: "1.1rem 1.25rem",
      display: "flex", flexDirection: "column", gap: "0.5rem",
      position: "relative", overflow: "hidden",
    }}>
      <div style={{ position: "absolute", top: 0, left: 0, bottom: 0, width: 3, backgroundColor: accent, borderRadius: "14px 0 0 14px" }} />
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <p style={{ margin: 0, fontSize: "0.72rem", fontWeight: 600, color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</p>
        {icon && <div style={{ width: 30, height: 30, borderRadius: "8px", backgroundColor: `${accent}15`, color: accent, display: "flex", alignItems: "center", justifyContent: "center" }}>{icon}</div>}
      </div>
      <p style={{ margin: 0, fontSize: "1.75rem", fontWeight: 800, color: accent, lineHeight: 1 }}>{value}</p>
      {sub && <p style={{ margin: 0, fontSize: "0.72rem", color: "var(--color-text-muted)" }}>{sub}</p>}
    </div>
  )
}

export function Toolbar({ search, onSearch, placeholder, filterRef, filterOpen, setFilterOpen, activeFilters, children }) {
  const btnRef = useRef(null)
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0 })

  const handleToggle = () => {
    if (!filterOpen && btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect()
      const dropW = 300
      const left = Math.min(rect.left, window.innerWidth - dropW - 16)
      setDropdownPos({ top: rect.bottom + 8, left: Math.max(16, left) })
    }
    setFilterOpen(v => !v)
  }

  return (
    <div style={{ backgroundColor: "var(--color-surface)", borderRadius: "10px", border: "1px solid var(--color-border)", padding: "1rem 1.25rem", display: "flex", gap: "0.75rem", alignItems: "center", flexWrap: "wrap", minWidth: 0 }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flex: 1, minWidth: "200px", backgroundColor: "var(--color-bg-muted)", borderRadius: "8px", padding: "0.45rem 0.75rem", border: "1px solid var(--color-border)" }}>
        <Search size={15} style={{ color: "var(--color-text-muted)", flexShrink: 0 }} />
        <input value={search} onChange={e => onSearch(e.target.value)} placeholder={placeholder} style={{ border: "none", background: "none", outline: "none", fontSize: "0.875rem", color: "var(--color-text)", width: "100%", fontFamily: "inherit" }} />
      </div>
      <div ref={filterRef} style={{ position: "relative" }}>
        <button
          ref={btnRef}
          onClick={handleToggle}
          style={{ display: "flex", alignItems: "center", gap: "0.4rem", padding: "0.45rem 0.85rem", borderRadius: "8px", border: "1px solid", backgroundColor: "transparent", cursor: "pointer", fontSize: "0.875rem", fontWeight: 500, fontFamily: "inherit", transition: "all 0.15s", borderColor: activeFilters > 0 ? "var(--color-primary)" : "var(--color-border)", color: activeFilters > 0 ? "var(--color-primary)" : "var(--color-text-muted)" }}
        >
          <SlidersHorizontal size={15} />
          Filters
          {activeFilters > 0 && (
            <span style={{ backgroundColor: "var(--color-primary)", color: "#fff", borderRadius: "999px", fontSize: "11px", padding: "0 6px", fontWeight: 600, lineHeight: "18px" }}>
              {activeFilters}
            </span>
          )}
        </button>
        {filterOpen && (
          <div style={{ position: "fixed", top: dropdownPos.top, left: dropdownPos.left, width: 300, backgroundColor: "var(--color-surface)", border: "1px solid var(--color-border)", borderRadius: "10px", boxShadow: "0 8px 24px #0000001a", zIndex: 9999, padding: "1rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
            {children}
          </div>
        )}
      </div>
    </div>
  )
}

export function FilterGroup({ label, children }) {
  return (
    <div>
      <p style={{ margin: "0 0 0.5rem", fontSize: "0.75rem", fontWeight: 600, color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem" }}>{children}</div>
    </div>
  )
}

export function Pill({ active, onClick, children }) {
  return (
    <button onClick={onClick} style={{ padding: "0.3rem 0.7rem", borderRadius: "999px", border: "1px solid", fontSize: "0.75rem", fontWeight: 500, cursor: "pointer", fontFamily: "inherit", transition: "all 0.15s", borderColor: active ? "var(--color-primary)" : "var(--color-border)", backgroundColor: active ? "var(--color-primary)" : "transparent", color: active ? "#fff" : "var(--color-text-muted)" }}>
      {children}
    </button>
  )
}

export function ClearBtn({ onClick }) {
  return (
    <button onClick={onClick} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "0.8125rem", color: "var(--color-primary)", textAlign: "left", padding: 0, fontFamily: "inherit" }}>
      Clear all filters
    </button>
  )
}

export function Badge({ bg, color, label }) {
  return (
    <span style={{ backgroundColor: bg, color, borderRadius: "999px", padding: "0.2rem 0.65rem", fontSize: "0.75rem", fontWeight: 600, whiteSpace: "nowrap" }}>
      {label}
    </span>
  )
}

export function ActionBtn({ color, onClick, title, children }) {
  return (
    <button onClick={onClick} title={title} style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "28px", height: "28px", borderRadius: "6px", border: `1px solid ${color}20`, backgroundColor: `${color}10`, color, cursor: "pointer" }}>
      {children}
    </button>
  )
}

/**
 * ActionsMenu — ⋯ button that opens a dropdown
 * items: [{ label, icon, color?, onClick, dividerBefore? }]
 */
export function ActionsMenu({ items }) {
  const [open, setOpen] = useState(false)
  const [pos, setPos]   = useState({ top: 0, left: 0 })
  const btnRef = useRef(null)
  const ref    = useRef(null)

  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener("mousedown", h)
    return () => document.removeEventListener("mousedown", h)
  }, [])

  const handleOpen = () => {
    if (!open && btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect()
      const menuW = 180
      const left  = Math.min(rect.right - menuW, window.innerWidth - menuW - 8)
      setPos({ top: rect.bottom + 6, left: Math.max(8, left) })
    }
    setOpen(v => !v)
  }

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button
        ref={btnRef}
        onClick={handleOpen}
        style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "30px", height: "30px", borderRadius: "6px", border: "1px solid var(--color-border)", background: "none", cursor: "pointer", color: "var(--color-text-muted)" }}
      >
        <MoreHorizontal size={15} />
      </button>

      {open && (
        <div style={{ position: "fixed", top: pos.top, left: pos.left, width: 180, backgroundColor: "var(--color-surface)", border: "1px solid var(--color-border)", borderRadius: "10px", boxShadow: "0 8px 24px #0000001a", zIndex: 9999, overflow: "hidden" }}>
          {items.map((item, i) => (
            <div key={i}>
              {item.dividerBefore && <div style={{ height: "1px", backgroundColor: "var(--color-border)", margin: "0.25rem 0" }} />}
              <MenuItem
                icon={item.icon}
                label={item.label}
                color={item.color}
                onClick={() => { item.onClick?.(); setOpen(false) }}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function MenuItem({ icon, label, color = "var(--color-text)", onClick }) {
  const [hover, setHover] = useState(false)
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{ display: "flex", alignItems: "center", gap: "0.5rem", width: "100%", padding: "0.5rem 0.85rem", border: "none", background: hover ? "var(--color-bg-muted)" : "none", cursor: "pointer", fontSize: "0.8125rem", color, fontFamily: "inherit", textAlign: "left" }}
    >
      {icon}{label}
    </button>
  )
}
