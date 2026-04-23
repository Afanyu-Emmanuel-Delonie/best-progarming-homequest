import { useState, useMemo, useRef, useEffect } from "react"
import { CheckCircle, XCircle, SlidersHorizontal, Search } from "lucide-react"

const MOCK = [
  { id: 1,  propertyId: 101, listingAgentPublicId: "agent-001", sellingAgentPublicId: "agent-002", ownerPublicId: "owner-01", buyerPublicId: "client-01", companyId: 1, saleAmount: 485000,  commissionRate: 0.03, totalCommission: 14550,  companyCommission: 1455,  listingAgentCommission: 3916,  sellingAgentCommission: 9179,  type: "SALE", status: "PENDING",   createdAt: "2025-07-10T09:22:00" },
  { id: 2,  propertyId: 102, listingAgentPublicId: "agent-001", sellingAgentPublicId: "agent-003", ownerPublicId: "owner-02", buyerPublicId: "client-02", companyId: 1, saleAmount: 920000,  commissionRate: 0.03, totalCommission: 27600,  companyCommission: 2760,  listingAgentCommission: 7452,  sellingAgentCommission: 17388, type: "SALE", status: "COMPLETED", createdAt: "2025-07-08T14:05:00" },
  { id: 3,  propertyId: 103, listingAgentPublicId: "agent-002", sellingAgentPublicId: "agent-002", ownerPublicId: "owner-03", buyerPublicId: "client-03", companyId: 2, saleAmount: 2400,    commissionRate: 0.08, totalCommission: 192,    companyCommission: 19.2,  listingAgentCommission: 51.84, sellingAgentCommission: 120.96,type: "RENT", status: "COMPLETED", createdAt: "2025-07-07T11:00:00" },
  { id: 4,  propertyId: 104, listingAgentPublicId: "agent-003", sellingAgentPublicId: "agent-004", ownerPublicId: "owner-04", buyerPublicId: "client-04", companyId: 1, saleAmount: 1250000, commissionRate: 0.025,totalCommission: 31250,  companyCommission: 3125,  listingAgentCommission: 8437,  sellingAgentCommission: 19688, type: "SALE", status: "PENDING",   createdAt: "2025-07-12T16:30:00" },
  { id: 5,  propertyId: 105, listingAgentPublicId: "agent-004", sellingAgentPublicId: "agent-001", ownerPublicId: "owner-05", buyerPublicId: "client-05", companyId: 2, saleAmount: 560000,  commissionRate: 0.03, totalCommission: 16800,  companyCommission: 1680,  listingAgentCommission: 4536,  sellingAgentCommission: 10584, type: "SALE", status: "CANCELLED", createdAt: "2025-07-06T10:00:00" },
  { id: 6,  propertyId: 106, listingAgentPublicId: "agent-002", sellingAgentPublicId: "agent-003", ownerPublicId: "owner-06", buyerPublicId: "client-06", companyId: 1, saleAmount: 780000,  commissionRate: 0.03, totalCommission: 23400,  companyCommission: 2340,  listingAgentCommission: 6318,  sellingAgentCommission: 14742, type: "SALE", status: "COMPLETED", createdAt: "2025-07-09T15:45:00" },
  { id: 7,  propertyId: 107, listingAgentPublicId: "agent-003", sellingAgentPublicId: "agent-003", ownerPublicId: "owner-07", buyerPublicId: "client-07", companyId: 2, saleAmount: 1800,    commissionRate: 0.08, totalCommission: 144,    companyCommission: 14.4,  listingAgentCommission: 38.88, sellingAgentCommission: 90.72, type: "RENT", status: "PENDING",   createdAt: "2025-07-13T13:20:00" },
  { id: 8,  propertyId: 108, listingAgentPublicId: "agent-001", sellingAgentPublicId: "agent-004", ownerPublicId: "owner-08", buyerPublicId: "client-08", companyId: 1, saleAmount: 2100000, commissionRate: 0.025,totalCommission: 52500,  companyCommission: 5250,  listingAgentCommission: 14175, sellingAgentCommission: 33075, type: "SALE", status: "COMPLETED", createdAt: "2025-07-05T08:00:00" },
  { id: 9,  propertyId: 109, listingAgentPublicId: "agent-004", sellingAgentPublicId: "agent-002", ownerPublicId: "owner-09", buyerPublicId: "client-09", companyId: 2, saleAmount: 295000,  commissionRate: 0.03, totalCommission: 8850,   companyCommission: 885,   listingAgentCommission: 2389,  sellingAgentCommission: 5576,  type: "SALE", status: "PENDING",   createdAt: "2025-07-14T07:55:00" },
  { id: 10, propertyId: 110, listingAgentPublicId: "agent-002", sellingAgentPublicId: "agent-001", ownerPublicId: "owner-10", buyerPublicId: "client-10", companyId: 1, saleAmount: 3200,    commissionRate: 0.08, totalCommission: 256,    companyCommission: 25.6,  listingAgentCommission: 69.12, sellingAgentCommission: 161.28,type: "RENT", status: "CANCELLED", createdAt: "2025-07-03T12:30:00" },
]

const STATUS_STYLES = {
  PENDING:   { bg: "#FFF7ED", color: "#C2410C", label: "Pending"   },
  COMPLETED: { bg: "#F0FDF4", color: "#15803D", label: "Completed" },
  CANCELLED: { bg: "#FEF2F2", color: "#B91C1C", label: "Cancelled" },
}

const fmt     = (n) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n)
const fmtDate = (d) => new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })

export default function AdminTransactions() {
  const [data, setData]             = useState(MOCK)
  const [search, setSearch]         = useState("")
  const [statusFilter, setStatus]   = useState("ALL")
  const [typeFilter, setType]       = useState("ALL")
  const [sortKey, setSortKey]       = useState("createdAt")
  const [sortDir, setSortDir]       = useState("desc")
  const [filterOpen, setFilterOpen] = useState(false)
  const filterRef = useRef(null)

  useEffect(() => {
    const handler = (e) => { if (filterRef.current && !filterRef.current.contains(e.target)) setFilterOpen(false) }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  const activeFilters = (statusFilter !== "ALL" ? 1 : 0) + (typeFilter !== "ALL" ? 1 : 0)

  const stats = useMemo(() => ({
    total:     data.length,
    pending:   data.filter(t => t.status === "PENDING").length,
    completed: data.filter(t => t.status === "COMPLETED").length,
    revenue:   data.filter(t => t.status === "COMPLETED").reduce((s, t) => s + t.saleAmount, 0),
  }), [data])

  const filtered = useMemo(() => {
    let rows = data
    if (statusFilter !== "ALL") rows = rows.filter(t => t.status === statusFilter)
    if (typeFilter !== "ALL")   rows = rows.filter(t => t.type === typeFilter)
    if (search.trim()) {
      const q = search.toLowerCase()
      rows = rows.filter(t => String(t.id).includes(q) || String(t.propertyId).includes(q) || t.buyerPublicId.toLowerCase().includes(q))
    }
    return [...rows].sort((a, b) => {
      let av = a[sortKey], bv = b[sortKey]
      if (typeof av === "string") { av = av.toLowerCase(); bv = bv.toLowerCase() }
      return sortDir === "asc" ? (av > bv ? 1 : -1) : (av < bv ? 1 : -1)
    })
  }, [data, search, statusFilter, typeFilter, sortKey, sortDir])

  const toggleSort = (key) => {
    if (sortKey === key) setSortDir(d => d === "asc" ? "desc" : "asc")
    else { setSortKey(key); setSortDir("asc") }
  }

  const updateStatus = (id, status) =>
    setData(prev => prev.map(t => t.id === id ? { ...t, status } : t))

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>

      {/* Stat cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "1rem" }}>
        {[
          { label: "Total",     value: stats.total,                color: "var(--color-primary)" },
          { label: "Pending",   value: stats.pending,              color: "#C2410C" },
          { label: "Completed", value: stats.completed,            color: "#15803D" },
          { label: "Revenue",   value: fmt(stats.revenue),         color: "var(--color-primary)" },
        ].map(s => (
          <div key={s.label} style={cardStyle}>
            <p style={cardLabelStyle}>{s.label}</p>
            <p style={{ margin: "0.25rem 0 0", fontSize: s.label === "Revenue" ? "1.25rem" : "1.75rem", fontWeight: 700, color: s.color }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div style={{ ...cardStyle, display: "flex", gap: "0.75rem", alignItems: "center", flexWrap: "wrap" }}>
        <div style={searchBoxStyle}>
          <Search size={15} style={{ color: "var(--color-text-muted)", flexShrink: 0 }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search ID, property, buyer…" style={searchInputStyle} />
        </div>

        <div ref={filterRef} style={{ position: "relative" }}>
          <button onClick={() => setFilterOpen(v => !v)} style={{ ...filterBtnStyle, borderColor: activeFilters > 0 ? "var(--color-primary)" : "var(--color-border)", color: activeFilters > 0 ? "var(--color-primary)" : "var(--color-text-muted)" }}>
            <SlidersHorizontal size={15} />
            Filters
            {activeFilters > 0 && <span style={filterBadge}>{activeFilters}</span>}
          </button>

          {filterOpen && (
            <div style={filterPanelStyle}>
              <div>
                <p style={filterGroupLabel}>Status</p>
                <div style={pillGroupStyle}>
                  {["ALL", "PENDING", "COMPLETED", "CANCELLED"].map(s => (
                    <button key={s} onClick={() => setStatus(s)} style={pillStyle(statusFilter === s)}>
                      {s === "ALL" ? "All" : STATUS_STYLES[s].label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p style={filterGroupLabel}>Type</p>
                <div style={pillGroupStyle}>
                  {["ALL", "SALE", "RENT"].map(t => (
                    <button key={t} onClick={() => setType(t)} style={pillStyle(typeFilter === t)}>
                      {t === "ALL" ? "All" : t.charAt(0) + t.slice(1).toLowerCase()}
                    </button>
                  ))}
                </div>
              </div>
              {activeFilters > 0 && (
                <button onClick={() => { setStatus("ALL"); setType("ALL") }} style={clearBtnStyle}>Clear all filters</button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Table */}
      <div style={{ backgroundColor: "var(--color-surface)", borderRadius: "10px", border: "1px solid var(--color-border)", overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.875rem" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--color-border)", backgroundColor: "var(--color-bg-muted)" }}>
                {[
                  { key: "id",           label: "ID"         },
                  { key: "propertyId",   label: "Property"   },
                  { key: "type",         label: "Type"       },
                  { key: "saleAmount",   label: "Amount"     },
                  { key: "totalCommission", label: "Commission" },
                  { key: "companyCommission", label: "Co. Fee" },
                  { key: "listingAgentPublicId", label: "Listing Agent" },
                  { key: "sellingAgentPublicId", label: "Selling Agent" },
                  { key: "status",       label: "Status"     },
                  { key: "createdAt",    label: "Date"       },
                  { key: null,           label: "Actions"    },
                ].map(col => (
                  <th key={col.label} onClick={() => col.key && toggleSort(col.key)} style={thStyle(!!col.key)}>
                    {col.label}{col.key && sortKey === col.key && <span style={{ marginLeft: 4 }}>{sortDir === "asc" ? "↑" : "↓"}</span>}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={11} style={{ padding: "3rem", textAlign: "center", color: "var(--color-text-muted)" }}>No transactions found</td></tr>
              ) : filtered.map((t, i) => {
                const st = STATUS_STYLES[t.status]
                return (
                  <tr key={t.id} style={{ borderBottom: "1px solid var(--color-border)", backgroundColor: i % 2 !== 0 ? "var(--color-bg-subtle)" : "transparent" }}>
                    <td style={tdStyle}>#{t.id}</td>
                    <td style={tdStyle}><span style={{ fontWeight: 500, color: "var(--color-primary)" }}>#{t.propertyId}</span></td>
                    <td style={tdStyle}>
                      <span style={{ backgroundColor: t.type === "SALE" ? "#EFF6FF" : "#F5F3FF", color: t.type === "SALE" ? "#1D4ED8" : "#6D28D9", borderRadius: "999px", padding: "0.2rem 0.65rem", fontSize: "0.75rem", fontWeight: 600 }}>
                        {t.type}
                      </span>
                    </td>
                    <td style={{ ...tdStyle, fontWeight: 600, color: "var(--color-text)" }}>{fmt(t.saleAmount)}</td>
                    <td style={tdStyle}>{fmt(t.totalCommission)}</td>
                    <td style={tdStyle}>{fmt(t.companyCommission)}</td>
                    <td style={{ ...tdStyle, fontSize: "0.8125rem" }}>{t.listingAgentPublicId}</td>
                    <td style={{ ...tdStyle, fontSize: "0.8125rem" }}>{t.sellingAgentPublicId}</td>
                    <td style={tdStyle}>
                      <span style={{ backgroundColor: st.bg, color: st.color, borderRadius: "999px", padding: "0.2rem 0.65rem", fontSize: "0.75rem", fontWeight: 600, whiteSpace: "nowrap" }}>{st.label}</span>
                    </td>
                    <td style={{ ...tdStyle, whiteSpace: "nowrap" }}>{fmtDate(t.createdAt)}</td>
                    <td style={{ ...tdStyle, whiteSpace: "nowrap" }}>
                      {t.status === "PENDING" && (
                        <div style={{ display: "flex", gap: "0.4rem" }}>
                          <button onClick={() => updateStatus(t.id, "COMPLETED")} title="Complete" style={actionBtn("#15803D")}><CheckCircle size={15} /></button>
                          <button onClick={() => updateStatus(t.id, "CANCELLED")} title="Cancel"   style={actionBtn("#B91C1C")}><XCircle size={15} /></button>
                        </div>
                      )}
                      {["COMPLETED", "CANCELLED"].includes(t.status) && (
                        <span style={{ fontSize: "0.75rem", color: "var(--color-text-subtle)" }}>—</span>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        <div style={{ padding: "0.75rem 1rem", borderTop: "1px solid var(--color-border)", fontSize: "0.8125rem", color: "var(--color-text-muted)" }}>
          Showing {filtered.length} of {data.length} transactions
        </div>
      </div>
    </div>
  )
}

const cardStyle        = { backgroundColor: "var(--color-surface)", borderRadius: "10px", padding: "1rem 1.25rem", border: "1px solid var(--color-border)" }
const cardLabelStyle   = { margin: 0, fontSize: "0.75rem", color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }
const searchBoxStyle   = { display: "flex", alignItems: "center", gap: "0.5rem", flex: 1, minWidth: "200px", backgroundColor: "var(--color-bg-muted)", borderRadius: "8px", padding: "0.45rem 0.75rem", border: "1px solid var(--color-border)" }
const searchInputStyle = { border: "none", background: "none", outline: "none", fontSize: "0.875rem", color: "var(--color-text)", width: "100%", fontFamily: "inherit" }
const filterBtnStyle   = { display: "flex", alignItems: "center", gap: "0.4rem", padding: "0.45rem 0.85rem", borderRadius: "8px", border: "1px solid", backgroundColor: "transparent", cursor: "pointer", fontSize: "0.875rem", fontWeight: 500, fontFamily: "inherit", transition: "all 0.15s" }
const filterBadge      = { backgroundColor: "var(--color-primary)", color: "#fff", borderRadius: "999px", fontSize: "11px", padding: "0 6px", fontWeight: 600, lineHeight: "18px" }
const filterPanelStyle = { position: "absolute", top: "calc(100% + 8px)", left: 0, backgroundColor: "var(--color-surface)", border: "1px solid var(--color-border)", borderRadius: "10px", boxShadow: "0 8px 24px #0000001a", zIndex: 50, padding: "1rem", minWidth: "240px", display: "flex", flexDirection: "column", gap: "1rem" }
const filterGroupLabel = { margin: "0 0 0.5rem", fontSize: "0.75rem", fontWeight: 600, color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }
const pillGroupStyle   = { display: "flex", flexWrap: "wrap", gap: "0.35rem" }
const pillStyle = (active) => ({ padding: "0.3rem 0.7rem", borderRadius: "999px", border: "1px solid", fontSize: "0.75rem", fontWeight: 500, cursor: "pointer", fontFamily: "inherit", borderColor: active ? "var(--color-primary)" : "var(--color-border)", backgroundColor: active ? "var(--color-primary)" : "transparent", color: active ? "#fff" : "var(--color-text-muted)", transition: "all 0.15s" })
const clearBtnStyle    = { background: "none", border: "none", cursor: "pointer", fontSize: "0.8125rem", color: "var(--color-primary)", textAlign: "left", padding: 0, fontFamily: "inherit" }
const thStyle = (sortable) => ({ padding: "0.75rem 1rem", textAlign: "left", fontWeight: 600, fontSize: "0.75rem", color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: "0.04em", whiteSpace: "nowrap", cursor: sortable ? "pointer" : "default", userSelect: "none" })
const tdStyle          = { padding: "0.75rem 1rem", color: "var(--color-text-muted)", verticalAlign: "middle" }
const actionBtn = (color) => ({ display: "flex", alignItems: "center", justifyContent: "center", width: "28px", height: "28px", borderRadius: "6px", border: `1px solid ${color}20`, backgroundColor: `${color}10`, color, cursor: "pointer" })
