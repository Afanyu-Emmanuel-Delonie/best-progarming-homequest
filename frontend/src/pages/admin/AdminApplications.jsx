import { useState, useMemo, useRef, useEffect } from "react"
import { CheckCircle, XCircle, RotateCcw, Search, SlidersHorizontal } from "lucide-react"

const MOCK = [
  { id: 1,  propertyId: 101, buyerFullName: "Sarah Johnson",    buyerPhone: "+1 555-0101", offerAmount: 485000,  depositAmount: 48500,  fundingSource: "BANK_MORTGAGE", proposedClosingDate: "2025-09-15", offerExpirationDate: "2025-08-01", status: "PENDING",   reviewedBy: null,        createdAt: "2025-07-10T09:22:00" },
  { id: 2,  propertyId: 102, buyerFullName: "Marcus Lee",       buyerPhone: "+1 555-0202", offerAmount: 920000,  depositAmount: 92000,  fundingSource: "CASH",          proposedClosingDate: "2025-08-30", offerExpirationDate: "2025-07-28", status: "ACCEPTED",  reviewedBy: "agent-001", createdAt: "2025-07-08T14:05:00" },
  { id: 3,  propertyId: 103, buyerFullName: "Priya Patel",      buyerPhone: "+1 555-0303", offerAmount: 310000,  depositAmount: 31000,  fundingSource: "PAYMENT_PLAN",  proposedClosingDate: "2025-10-01", offerExpirationDate: "2025-08-10", status: "PENDING",   reviewedBy: null,        createdAt: "2025-07-11T11:40:00" },
  { id: 4,  propertyId: 101, buyerFullName: "David Okafor",     buyerPhone: "+1 555-0404", offerAmount: 470000,  depositAmount: 47000,  fundingSource: "BANK_MORTGAGE", proposedClosingDate: "2025-09-20", offerExpirationDate: "2025-07-30", status: "REJECTED",  reviewedBy: "agent-001", createdAt: "2025-07-07T08:15:00" },
  { id: 5,  propertyId: 104, buyerFullName: "Emma Wilson",      buyerPhone: "+1 555-0505", offerAmount: 1250000, depositAmount: 125000, fundingSource: "CASH",          proposedClosingDate: "2025-11-01", offerExpirationDate: "2025-08-20", status: "PENDING",   reviewedBy: null,        createdAt: "2025-07-12T16:30:00" },
  { id: 6,  propertyId: 105, buyerFullName: "James Nguyen",     buyerPhone: "+1 555-0606", offerAmount: 560000,  depositAmount: 56000,  fundingSource: "BANK_MORTGAGE", proposedClosingDate: "2025-09-10", offerExpirationDate: "2025-07-25", status: "WITHDRAWN", reviewedBy: null,        createdAt: "2025-07-06T10:00:00" },
  { id: 7,  propertyId: 106, buyerFullName: "Aisha Malik",      buyerPhone: "+1 555-0707", offerAmount: 780000,  depositAmount: 78000,  fundingSource: "PAYMENT_PLAN",  proposedClosingDate: "2025-10-15", offerExpirationDate: "2025-08-05", status: "PENDING",   reviewedBy: null,        createdAt: "2025-07-13T13:20:00" },
  { id: 8,  propertyId: 107, buyerFullName: "Carlos Rivera",    buyerPhone: "+1 555-0808", offerAmount: 430000,  depositAmount: 43000,  fundingSource: "CASH",          proposedClosingDate: "2025-08-25", offerExpirationDate: "2025-07-22", status: "EXPIRED",   reviewedBy: null,        createdAt: "2025-07-01T09:00:00" },
  { id: 9,  propertyId: 108, buyerFullName: "Fatima Al-Hassan", buyerPhone: "+1 555-0909", offerAmount: 2100000, depositAmount: 210000, fundingSource: "CASH",          proposedClosingDate: "2025-12-01", offerExpirationDate: "2025-09-01", status: "ACCEPTED",  reviewedBy: "agent-003", createdAt: "2025-07-09T15:45:00" },
  { id: 10, propertyId: 109, buyerFullName: "Tom Bradley",      buyerPhone: "+1 555-1010", offerAmount: 295000,  depositAmount: 29500,  fundingSource: "BANK_MORTGAGE", proposedClosingDate: "2025-10-20", offerExpirationDate: "2025-08-15", status: "PENDING",   reviewedBy: null,        createdAt: "2025-07-14T07:55:00" },
]

const STATUS_STYLES = {
  PENDING:   { bg: "#FFF7ED", color: "#C2410C", label: "Pending"   },
  ACCEPTED:  { bg: "#F0FDF4", color: "#15803D", label: "Accepted"  },
  REJECTED:  { bg: "#FEF2F2", color: "#B91C1C", label: "Rejected"  },
  WITHDRAWN: { bg: "#F5F5F5", color: "#525252", label: "Withdrawn" },
  EXPIRED:   { bg: "#FAFAFA", color: "#737373", label: "Expired"   },
}

const FUNDING_LABELS = { CASH: "Cash", BANK_MORTGAGE: "Bank Mortgage", PAYMENT_PLAN: "Payment Plan" }

const fmt     = (n) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n)
const fmtDate = (d) => new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })

export default function AdminApplications() {
  const [data, setData]           = useState(MOCK)
  const [search, setSearch]       = useState("")
  const [statusFilter, setStatus] = useState("ALL")
  const [fundingFilter, setFunding] = useState("ALL")
  const [sortKey, setSortKey]     = useState("createdAt")
  const [sortDir, setSortDir]     = useState("desc")
  const [filterOpen, setFilterOpen] = useState(false)
  const filterRef = useRef(null)

  useEffect(() => {
    const handler = (e) => { if (filterRef.current && !filterRef.current.contains(e.target)) setFilterOpen(false) }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  const activeFilters = (statusFilter !== "ALL" ? 1 : 0) + (fundingFilter !== "ALL" ? 1 : 0)

  const stats = useMemo(() => ({
    total:    data.length,
    pending:  data.filter(a => a.status === "PENDING").length,
    accepted: data.filter(a => a.status === "ACCEPTED").length,
    rejected: data.filter(a => a.status === "REJECTED").length,
  }), [data])

  const filtered = useMemo(() => {
    let rows = data
    if (statusFilter !== "ALL")  rows = rows.filter(a => a.status === statusFilter)
    if (fundingFilter !== "ALL") rows = rows.filter(a => a.fundingSource === fundingFilter)
    if (search.trim()) {
      const q = search.toLowerCase()
      rows = rows.filter(a =>
        a.buyerFullName.toLowerCase().includes(q) ||
        String(a.propertyId).includes(q) ||
        String(a.id).includes(q)
      )
    }
    return [...rows].sort((a, b) => {
      let av = a[sortKey], bv = b[sortKey]
      if (typeof av === "string") { av = av.toLowerCase(); bv = bv.toLowerCase() }
      return sortDir === "asc" ? (av > bv ? 1 : -1) : (av < bv ? 1 : -1)
    })
  }, [data, search, statusFilter, fundingFilter, sortKey, sortDir])

  const toggleSort = (key) => {
    if (sortKey === key) setSortDir(d => d === "asc" ? "desc" : "asc")
    else { setSortKey(key); setSortDir("asc") }
  }

  const updateStatus = (id, status) =>
    setData(prev => prev.map(a => a.id === id ? { ...a, status, reviewedBy: status !== "WITHDRAWN" ? "admin" : null } : a))

  const clearFilters = () => { setStatus("ALL"); setFunding("ALL") }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>

      {/* Stat cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "1rem" }}>
        {[
          { label: "Total",    value: stats.total,    color: "var(--color-primary)" },
          { label: "Pending",  value: stats.pending,  color: "#C2410C" },
          { label: "Accepted", value: stats.accepted, color: "#15803D" },
          { label: "Rejected", value: stats.rejected, color: "#B91C1C" },
        ].map(s => (
          <div key={s.label} style={cardStyle}>
            <p style={cardLabelStyle}>{s.label}</p>
            <p style={{ margin: "0.25rem 0 0", fontSize: "1.75rem", fontWeight: 700, color: s.color }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div style={{ ...cardStyle, display: "flex", gap: "0.75rem", alignItems: "center", flexWrap: "wrap" }}>
        <div style={searchBoxStyle}>
          <Search size={15} style={{ color: "var(--color-text-muted)", flexShrink: 0 }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search buyer, property ID…" style={searchInputStyle} />
        </div>

        {/* Filter button */}
        <div ref={filterRef} style={{ position: "relative" }}>
          <button onClick={() => setFilterOpen(v => !v)} style={{ ...filterBtnStyle, borderColor: activeFilters > 0 ? "var(--color-primary)" : "var(--color-border)", color: activeFilters > 0 ? "var(--color-primary)" : "var(--color-text-muted)" }}>
            <SlidersHorizontal size={15} />
            Filters
            {activeFilters > 0 && (
              <span style={{ backgroundColor: "var(--color-primary)", color: "#fff", borderRadius: "999px", fontSize: "11px", padding: "0 6px", fontWeight: 600, lineHeight: "18px" }}>
                {activeFilters}
              </span>
            )}
          </button>

          {filterOpen && (
            <div style={{ position: "absolute", top: "calc(100% + 8px)", left: 0, backgroundColor: "var(--color-surface)", border: "1px solid var(--color-border)", borderRadius: "10px", boxShadow: "0 8px 24px #0000001a", zIndex: 50, padding: "1rem", minWidth: "260px", display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div>
                <p style={filterGroupLabel}>Status</p>
                <div style={pillGroupStyle}>
                  {["ALL", "PENDING", "ACCEPTED", "REJECTED", "WITHDRAWN", "EXPIRED"].map(s => (
                    <button key={s} onClick={() => setStatus(s)} style={pillStyle(statusFilter === s)}>
                      {s === "ALL" ? "All" : STATUS_STYLES[s].label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p style={filterGroupLabel}>Funding Source</p>
                <div style={pillGroupStyle}>
                  {["ALL", "CASH", "BANK_MORTGAGE", "PAYMENT_PLAN"].map(f => (
                    <button key={f} onClick={() => setFunding(f)} style={pillStyle(fundingFilter === f)}>
                      {f === "ALL" ? "All" : FUNDING_LABELS[f]}
                    </button>
                  ))}
                </div>
              </div>
              {activeFilters > 0 && (
                <button onClick={clearFilters} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "0.8125rem", color: "var(--color-primary)", textAlign: "left", padding: 0, fontFamily: "inherit" }}>
                  Clear all filters
                </button>
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
                  { key: "id",                   label: "ID"       },
                  { key: "propertyId",            label: "Property" },
                  { key: "buyerFullName",         label: "Buyer"    },
                  { key: "offerAmount",           label: "Offer"    },
                  { key: "depositAmount",         label: "Deposit"  },
                  { key: "fundingSource",         label: "Funding"  },
                  { key: "proposedClosingDate",   label: "Closing"  },
                  { key: "status",                label: "Status"   },
                  { key: "createdAt",             label: "Submitted"},
                  { key: null,                    label: "Actions"  },
                ].map(col => (
                  <th key={col.label} onClick={() => col.key && toggleSort(col.key)} style={thStyle(!!col.key)}>
                    {col.label}{col.key && sortKey === col.key && <span style={{ marginLeft: 4 }}>{sortDir === "asc" ? "↑" : "↓"}</span>}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={10} style={{ padding: "3rem", textAlign: "center", color: "var(--color-text-muted)" }}>No applications found</td></tr>
              ) : filtered.map((app, i) => {
                const st = STATUS_STYLES[app.status]
                return (
                  <tr key={app.id} style={{ borderBottom: "1px solid var(--color-border)", backgroundColor: i % 2 !== 0 ? "var(--color-bg-subtle)" : "transparent" }}>
                    <td style={tdStyle}>#{app.id}</td>
                    <td style={tdStyle}><span style={{ fontWeight: 500, color: "var(--color-primary)" }}>#{app.propertyId}</span></td>
                    <td style={tdStyle}>
                      <p style={{ margin: 0, fontWeight: 500, color: "var(--color-text)" }}>{app.buyerFullName}</p>
                      <p style={{ margin: 0, fontSize: "0.75rem", color: "var(--color-text-muted)" }}>{app.buyerPhone}</p>
                    </td>
                    <td style={{ ...tdStyle, fontWeight: 600, color: "var(--color-text)" }}>{fmt(app.offerAmount)}</td>
                    <td style={tdStyle}>{fmt(app.depositAmount)}</td>
                    <td style={tdStyle}>{FUNDING_LABELS[app.fundingSource]}</td>
                    <td style={{ ...tdStyle, whiteSpace: "nowrap" }}>{fmtDate(app.proposedClosingDate)}</td>
                    <td style={tdStyle}>
                      <span style={{ backgroundColor: st.bg, color: st.color, borderRadius: "999px", padding: "0.2rem 0.65rem", fontSize: "0.75rem", fontWeight: 600, whiteSpace: "nowrap" }}>{st.label}</span>
                    </td>
                    <td style={{ ...tdStyle, whiteSpace: "nowrap" }}>{fmtDate(app.createdAt)}</td>
                    <td style={{ ...tdStyle, whiteSpace: "nowrap" }}>
                      {app.status === "PENDING" && (
                        <div style={{ display: "flex", gap: "0.4rem" }}>
                          <button onClick={() => updateStatus(app.id, "ACCEPTED")} title="Accept" style={actionBtn("#15803D")}><CheckCircle size={15} /></button>
                          <button onClick={() => updateStatus(app.id, "REJECTED")} title="Reject"  style={actionBtn("#B91C1C")}><XCircle size={15} /></button>
                        </div>
                      )}
                      {app.status === "ACCEPTED" && (
                        <button onClick={() => updateStatus(app.id, "WITHDRAWN")} title="Withdraw" style={actionBtn("#737373")}><RotateCcw size={15} /></button>
                      )}
                      {["REJECTED", "WITHDRAWN", "EXPIRED"].includes(app.status) && (
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
          Showing {filtered.length} of {data.length} applications
        </div>
      </div>
    </div>
  )
}

const cardStyle      = { backgroundColor: "var(--color-surface)", borderRadius: "10px", padding: "1rem 1.25rem", border: "1px solid var(--color-border)" }
const cardLabelStyle = { margin: 0, fontSize: "0.75rem", color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }
const searchBoxStyle = { display: "flex", alignItems: "center", gap: "0.5rem", flex: 1, minWidth: "200px", backgroundColor: "var(--color-bg-muted)", borderRadius: "8px", padding: "0.45rem 0.75rem", border: "1px solid var(--color-border)" }
const searchInputStyle = { border: "none", background: "none", outline: "none", fontSize: "0.875rem", color: "var(--color-text)", width: "100%", fontFamily: "inherit" }
const filterBtnStyle = { display: "flex", alignItems: "center", gap: "0.4rem", padding: "0.45rem 0.85rem", borderRadius: "8px", border: "1px solid", backgroundColor: "transparent", cursor: "pointer", fontSize: "0.875rem", fontWeight: 500, fontFamily: "inherit", transition: "all 0.15s" }
const filterGroupLabel = { margin: "0 0 0.5rem", fontSize: "0.75rem", fontWeight: 600, color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }
const pillGroupStyle = { display: "flex", flexWrap: "wrap", gap: "0.35rem" }
const pillStyle = (active) => ({ padding: "0.3rem 0.7rem", borderRadius: "999px", border: "1px solid", fontSize: "0.75rem", fontWeight: 500, cursor: "pointer", fontFamily: "inherit", borderColor: active ? "var(--color-primary)" : "var(--color-border)", backgroundColor: active ? "var(--color-primary)" : "transparent", color: active ? "#fff" : "var(--color-text-muted)", transition: "all 0.15s" })
const thStyle = (sortable) => ({ padding: "0.75rem 1rem", textAlign: "left", fontWeight: 600, fontSize: "0.75rem", color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: "0.04em", whiteSpace: "nowrap", cursor: sortable ? "pointer" : "default", userSelect: "none" })
const tdStyle = { padding: "0.75rem 1rem", color: "var(--color-text-muted)", verticalAlign: "middle" }
const actionBtn = (color) => ({ display: "flex", alignItems: "center", justifyContent: "center", width: "28px", height: "28px", borderRadius: "6px", border: `1px solid ${color}20`, backgroundColor: `${color}10`, color, cursor: "pointer" })
