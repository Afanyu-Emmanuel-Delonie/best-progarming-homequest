import { useState, useMemo, useRef, useEffect } from "react"
import { SlidersHorizontal, Search, Download, Trash2, FileText, FileImage, File } from "lucide-react"

const MOCK = [
  { id: 1,  name: "Sale Agreement - 12 Oak St",       type: "CONTRACT",    relatedType: "TRANSACTION", relatedId: 1,   uploaderPublicId: "agent-001", fileSize: "245 KB", mimeType: "application/pdf", status: "VERIFIED",  createdAt: "2025-07-10T09:30:00" },
  { id: 2,  name: "Property Title Deed - 45 Maple",   type: "TITLE_DEED",  relatedType: "PROPERTY",    relatedId: 102, uploaderPublicId: "owner-02",  fileSize: "1.2 MB", mimeType: "application/pdf", status: "VERIFIED",  createdAt: "2025-07-08T14:10:00" },
  { id: 3,  name: "Buyer ID - Priya Patel",           type: "ID_DOCUMENT", relatedType: "APPLICATION", relatedId: 3,   uploaderPublicId: "client-03", fileSize: "890 KB", mimeType: "image/jpeg",      status: "PENDING",   createdAt: "2025-07-11T11:45:00" },
  { id: 4,  name: "Mortgage Approval Letter",         type: "MORTGAGE",    relatedType: "APPLICATION", relatedId: 1,   uploaderPublicId: "client-01", fileSize: "320 KB", mimeType: "application/pdf", status: "PENDING",   createdAt: "2025-07-10T10:00:00" },
  { id: 5,  name: "Inspection Report - Penthouse",    type: "INSPECTION",  relatedType: "PROPERTY",    relatedId: 104, uploaderPublicId: "agent-003", fileSize: "2.4 MB", mimeType: "application/pdf", status: "VERIFIED",  createdAt: "2025-07-12T16:35:00" },
  { id: 6,  name: "Commission Invoice #005",          type: "INVOICE",     relatedType: "TRANSACTION", relatedId: 5,   uploaderPublicId: "agent-004", fileSize: "115 KB", mimeType: "application/pdf", status: "REJECTED",  createdAt: "2025-07-06T10:05:00" },
  { id: 7,  name: "Floor Plan - Family House",        type: "FLOOR_PLAN",  relatedType: "PROPERTY",    relatedId: 106, uploaderPublicId: "agent-002", fileSize: "3.1 MB", mimeType: "image/png",       status: "VERIFIED",  createdAt: "2025-07-09T15:50:00" },
  { id: 8,  name: "Rental Agreement - Beachfront",    type: "CONTRACT",    relatedType: "TRANSACTION", relatedId: 3,   uploaderPublicId: "agent-003", fileSize: "198 KB", mimeType: "application/pdf", status: "VERIFIED",  createdAt: "2025-07-07T11:05:00" },
  { id: 9,  name: "Owner Proof of Ownership",         type: "TITLE_DEED",  relatedType: "PROPERTY",    relatedId: 108, uploaderPublicId: "owner-08",  fileSize: "780 KB", mimeType: "application/pdf", status: "PENDING",   createdAt: "2025-07-05T08:10:00" },
  { id: 10, name: "Buyer Passport - Tom Bradley",     type: "ID_DOCUMENT", relatedType: "APPLICATION", relatedId: 10,  uploaderPublicId: "client-10", fileSize: "650 KB", mimeType: "image/jpeg",      status: "PENDING",   createdAt: "2025-07-14T08:00:00" },
]

const STATUS_STYLES = {
  PENDING:  { bg: "#FFF7ED", color: "#C2410C", label: "Pending"  },
  VERIFIED: { bg: "#F0FDF4", color: "#15803D", label: "Verified" },
  REJECTED: { bg: "#FEF2F2", color: "#B91C1C", label: "Rejected" },
}

const TYPE_LABELS = {
  CONTRACT:    "Contract",
  TITLE_DEED:  "Title Deed",
  ID_DOCUMENT: "ID Document",
  MORTGAGE:    "Mortgage",
  INSPECTION:  "Inspection",
  INVOICE:     "Invoice",
  FLOOR_PLAN:  "Floor Plan",
}

const FileIcon = ({ mime }) => {
  if (mime?.startsWith("image/")) return <FileImage size={16} style={{ color: "#6D28D9" }} />
  if (mime === "application/pdf")  return <FileText  size={16} style={{ color: "#C2410C" }} />
  return <File size={16} style={{ color: "var(--color-text-muted)" }} />
}

const fmtDate = (d) => new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })

export default function AdminDocuments() {
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
    total:    data.length,
    pending:  data.filter(d => d.status === "PENDING").length,
    verified: data.filter(d => d.status === "VERIFIED").length,
    rejected: data.filter(d => d.status === "REJECTED").length,
  }), [data])

  const filtered = useMemo(() => {
    let rows = data
    if (statusFilter !== "ALL") rows = rows.filter(d => d.status === statusFilter)
    if (typeFilter !== "ALL")   rows = rows.filter(d => d.type === typeFilter)
    if (search.trim()) {
      const q = search.toLowerCase()
      rows = rows.filter(d => d.name.toLowerCase().includes(q) || d.uploaderPublicId.toLowerCase().includes(q) || String(d.id).includes(q))
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

  const updateStatus = (id, status) => setData(prev => prev.map(d => d.id === id ? { ...d, status } : d))
  const deleteDoc    = (id)         => setData(prev => prev.filter(d => d.id !== id))

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>

      {/* Stat cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "1rem" }}>
        {[
          { label: "Total",    value: stats.total,    color: "var(--color-primary)" },
          { label: "Pending",  value: stats.pending,  color: "#C2410C" },
          { label: "Verified", value: stats.verified, color: "#15803D" },
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
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search name, uploader, ID…" style={searchInputStyle} />
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
                  {["ALL", "PENDING", "VERIFIED", "REJECTED"].map(s => (
                    <button key={s} onClick={() => setStatus(s)} style={pillStyle(statusFilter === s)}>
                      {s === "ALL" ? "All" : STATUS_STYLES[s].label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p style={filterGroupLabel}>Document Type</p>
                <div style={pillGroupStyle}>
                  {["ALL", ...Object.keys(TYPE_LABELS)].map(t => (
                    <button key={t} onClick={() => setType(t)} style={pillStyle(typeFilter === t)}>
                      {t === "ALL" ? "All" : TYPE_LABELS[t]}
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
                  { key: "id",                label: "ID"       },
                  { key: "name",              label: "Document" },
                  { key: "type",              label: "Type"     },
                  { key: "relatedType",       label: "Related"  },
                  { key: "uploaderPublicId",  label: "Uploader" },
                  { key: "fileSize",          label: "Size"     },
                  { key: "status",            label: "Status"   },
                  { key: "createdAt",         label: "Uploaded" },
                  { key: null,                label: "Actions"  },
                ].map(col => (
                  <th key={col.label} onClick={() => col.key && toggleSort(col.key)} style={thStyle(!!col.key)}>
                    {col.label}{col.key && sortKey === col.key && <span style={{ marginLeft: 4 }}>{sortDir === "asc" ? "↑" : "↓"}</span>}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={9} style={{ padding: "3rem", textAlign: "center", color: "var(--color-text-muted)" }}>No documents found</td></tr>
              ) : filtered.map((doc, i) => {
                const st = STATUS_STYLES[doc.status]
                return (
                  <tr key={doc.id} style={{ borderBottom: "1px solid var(--color-border)", backgroundColor: i % 2 !== 0 ? "var(--color-bg-subtle)" : "transparent" }}>
                    <td style={tdStyle}>#{doc.id}</td>
                    <td style={tdStyle}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <FileIcon mime={doc.mimeType} />
                        <span style={{ fontWeight: 500, color: "var(--color-text)", maxWidth: "220px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{doc.name}</span>
                      </div>
                    </td>
                    <td style={tdStyle}>{TYPE_LABELS[doc.type]}</td>
                    <td style={tdStyle}>
                      <span style={{ fontSize: "0.75rem" }}>
                        <span style={{ fontWeight: 500, color: "var(--color-text)" }}>{doc.relatedType}</span>
                        <span style={{ color: "var(--color-primary)", marginLeft: "4px" }}>#{doc.relatedId}</span>
                      </span>
                    </td>
                    <td style={{ ...tdStyle, fontSize: "0.8125rem" }}>{doc.uploaderPublicId}</td>
                    <td style={tdStyle}>{doc.fileSize}</td>
                    <td style={tdStyle}>
                      <span style={{ backgroundColor: st.bg, color: st.color, borderRadius: "999px", padding: "0.2rem 0.65rem", fontSize: "0.75rem", fontWeight: 600, whiteSpace: "nowrap" }}>{st.label}</span>
                    </td>
                    <td style={{ ...tdStyle, whiteSpace: "nowrap" }}>{fmtDate(doc.createdAt)}</td>
                    <td style={{ ...tdStyle, whiteSpace: "nowrap" }}>
                      <div style={{ display: "flex", gap: "0.4rem" }}>
                        {doc.status === "PENDING" && (
                          <>
                            <button onClick={() => updateStatus(doc.id, "VERIFIED")} title="Verify" style={actionBtn("#15803D")}>✓</button>
                            <button onClick={() => updateStatus(doc.id, "REJECTED")} title="Reject" style={actionBtn("#B91C1C")}>✕</button>
                          </>
                        )}
                        <button title="Download" style={actionBtn("#1D4ED8")}><Download size={13} /></button>
                        <button title="Delete" onClick={() => deleteDoc(doc.id)} style={actionBtn("#B91C1C")}><Trash2 size={13} /></button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        <div style={{ padding: "0.75rem 1rem", borderTop: "1px solid var(--color-border)", fontSize: "0.8125rem", color: "var(--color-text-muted)" }}>
          Showing {filtered.length} of {data.length} documents
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
const filterPanelStyle = { position: "absolute", top: "calc(100% + 8px)", left: 0, backgroundColor: "var(--color-surface)", border: "1px solid var(--color-border)", borderRadius: "10px", boxShadow: "0 8px 24px #0000001a", zIndex: 50, padding: "1rem", minWidth: "280px", display: "flex", flexDirection: "column", gap: "1rem" }
const filterGroupLabel = { margin: "0 0 0.5rem", fontSize: "0.75rem", fontWeight: 600, color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }
const pillGroupStyle   = { display: "flex", flexWrap: "wrap", gap: "0.35rem" }
const pillStyle = (active) => ({ padding: "0.3rem 0.7rem", borderRadius: "999px", border: "1px solid", fontSize: "0.75rem", fontWeight: 500, cursor: "pointer", fontFamily: "inherit", borderColor: active ? "var(--color-primary)" : "var(--color-border)", backgroundColor: active ? "var(--color-primary)" : "transparent", color: active ? "#fff" : "var(--color-text-muted)", transition: "all 0.15s" })
const clearBtnStyle    = { background: "none", border: "none", cursor: "pointer", fontSize: "0.8125rem", color: "var(--color-primary)", textAlign: "left", padding: 0, fontFamily: "inherit" }
const thStyle = (sortable) => ({ padding: "0.75rem 1rem", textAlign: "left", fontWeight: 600, fontSize: "0.75rem", color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: "0.04em", whiteSpace: "nowrap", cursor: sortable ? "pointer" : "default", userSelect: "none" })
const tdStyle          = { padding: "0.75rem 1rem", color: "var(--color-text-muted)", verticalAlign: "middle" }
const actionBtn = (color) => ({ display: "flex", alignItems: "center", justifyContent: "center", width: "28px", height: "28px", borderRadius: "6px", border: `1px solid ${color}20`, backgroundColor: `${color}10`, color, cursor: "pointer", fontSize: "0.8125rem", fontWeight: 700 })
