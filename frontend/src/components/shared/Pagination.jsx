import { ChevronLeft, ChevronRight } from "lucide-react"

/**
 * Pagination
 * Props: page (0-based), totalPages, totalElements, pageSize, onPageChange(newPage)
 */
export default function Pagination({ page, totalPages, totalElements, pageSize, onPageChange }) {
  if (totalPages <= 1) return null

  const from  = page * pageSize + 1
  const to    = Math.min((page + 1) * pageSize, totalElements)
  const pages = buildPages(page, totalPages)

  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.5rem", padding: "0.75rem 1rem", borderTop: "1px solid var(--color-border)", fontSize: "0.8125rem", color: "var(--color-text-muted)" }}>
      <span>{from}–{to} of {totalElements}</span>

      <div style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
        <NavBtn onClick={() => onPageChange(page - 1)} disabled={page === 0}>
          <ChevronLeft size={14} />
        </NavBtn>

        {pages.map((p, i) =>
          p === "…" ? (
            <span key={`ellipsis-${i}`} style={{ padding: "0 0.35rem", color: "var(--color-text-subtle)" }}>…</span>
          ) : (
            <PageBtn key={p} active={p === page} onClick={() => onPageChange(p)}>{p + 1}</PageBtn>
          )
        )}

        <NavBtn onClick={() => onPageChange(page + 1)} disabled={page >= totalPages - 1}>
          <ChevronRight size={14} />
        </NavBtn>
      </div>
    </div>
  )
}

function PageBtn({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      style={{ minWidth: 30, height: 30, borderRadius: "6px", border: "1px solid", cursor: "pointer", fontSize: "0.8125rem", fontFamily: "inherit", fontWeight: active ? 600 : 400, backgroundColor: active ? "var(--color-primary)" : "transparent", borderColor: active ? "var(--color-primary)" : "var(--color-border)", color: active ? "#fff" : "var(--color-text-muted)", transition: "all 0.15s" }}
    >
      {children}
    </button>
  )
}

function NavBtn({ onClick, disabled, children }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{ width: 30, height: 30, borderRadius: "6px", border: "1px solid var(--color-border)", background: "none", cursor: disabled ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: disabled ? "var(--color-border)" : "var(--color-text-muted)", transition: "all 0.15s" }}
    >
      {children}
    </button>
  )
}

// builds page number array with ellipsis: [0,1,2,"…",8,9]
function buildPages(current, total) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i)
  const pages = new Set([0, total - 1, current])
  if (current > 1) pages.add(current - 1)
  if (current < total - 2) pages.add(current + 1)
  const sorted = [...pages].sort((a, b) => a - b)
  const result = []
  for (let i = 0; i < sorted.length; i++) {
    if (i > 0 && sorted[i] - sorted[i - 1] > 1) result.push("…")
    result.push(sorted[i])
  }
  return result
}
