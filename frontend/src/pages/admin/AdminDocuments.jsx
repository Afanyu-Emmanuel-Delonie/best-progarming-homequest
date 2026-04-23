import { useState, useMemo, useRef, useEffect } from "react"
import { Download, Trash2, FileText, FileImage, File, X, MoreHorizontal, CheckCircle, XCircle, Eye, ChevronLeft, ChevronRight } from "lucide-react"
import { StatCard, Toolbar, FilterGroup, Pill, ClearBtn, Badge } from "../../components/shared/AdminUI"

const MOCK = [
  { id: 1,  name: "Sale Agreement - 12 Oak St",     type: "CONTRACT",    relatedType: "TRANSACTION", relatedId: 1,   uploaderPublicId: "agent-001", fileSize: "245 KB", mimeType: "application/pdf", status: "VERIFIED", createdAt: "2025-07-10T09:30:00" },
  { id: 2,  name: "Property Title Deed - 45 Maple", type: "TITLE_DEED",  relatedType: "PROPERTY",    relatedId: 102, uploaderPublicId: "owner-02",  fileSize: "1.2 MB", mimeType: "application/pdf", status: "VERIFIED", createdAt: "2025-07-08T14:10:00" },
  { id: 3,  name: "Buyer ID - Priya Patel",         type: "ID_DOCUMENT", relatedType: "APPLICATION", relatedId: 3,   uploaderPublicId: "client-03", fileSize: "890 KB", mimeType: "image/jpeg",      status: "PENDING",  createdAt: "2025-07-11T11:45:00" },
  { id: 4,  name: "Mortgage Approval Letter",       type: "MORTGAGE",    relatedType: "APPLICATION", relatedId: 1,   uploaderPublicId: "client-01", fileSize: "320 KB", mimeType: "application/pdf", status: "PENDING",  createdAt: "2025-07-10T10:00:00" },
  { id: 5,  name: "Inspection Report - Penthouse",  type: "INSPECTION",  relatedType: "PROPERTY",    relatedId: 104, uploaderPublicId: "agent-003", fileSize: "2.4 MB", mimeType: "application/pdf", status: "VERIFIED", createdAt: "2025-07-12T16:35:00" },
  { id: 6,  name: "Commission Invoice #005",        type: "INVOICE",     relatedType: "TRANSACTION", relatedId: 5,   uploaderPublicId: "agent-004", fileSize: "115 KB", mimeType: "application/pdf", status: "REJECTED", createdAt: "2025-07-06T10:05:00" },
  { id: 7,  name: "Floor Plan - Family House",      type: "FLOOR_PLAN",  relatedType: "PROPERTY",    relatedId: 106, uploaderPublicId: "agent-002", fileSize: "3.1 MB", mimeType: "image/png",       status: "VERIFIED", createdAt: "2025-07-09T15:50:00" },
  { id: 8,  name: "Rental Agreement - Beachfront",  type: "CONTRACT",    relatedType: "TRANSACTION", relatedId: 3,   uploaderPublicId: "agent-003", fileSize: "198 KB", mimeType: "application/pdf", status: "VERIFIED", createdAt: "2025-07-07T11:05:00" },
  { id: 9,  name: "Owner Proof of Ownership",       type: "TITLE_DEED",  relatedType: "PROPERTY",    relatedId: 108, uploaderPublicId: "owner-08",  fileSize: "780 KB", mimeType: "application/pdf", status: "PENDING",  createdAt: "2025-07-05T08:10:00" },
  { id: 10, name: "Buyer Passport - Tom Bradley",   type: "ID_DOCUMENT", relatedType: "APPLICATION", relatedId: 10,  uploaderPublicId: "client-10", fileSize: "650 KB", mimeType: "image/jpeg",      status: "PENDING",  createdAt: "2025-07-14T08:00:00" },
]

const STATUS_STYLES = {
  PENDING:  { bg: "#FFF7ED", color: "#C2410C", label: "Pending"  },
  VERIFIED: { bg: "#F0FDF4", color: "#15803D", label: "Verified" },
  REJECTED: { bg: "#FEF2F2", color: "#B91C1C", label: "Rejected" },
}
const TYPE_LABELS = {
  CONTRACT: "Contract", TITLE_DEED: "Title Deed", ID_DOCUMENT: "ID Document",
  MORTGAGE: "Mortgage", INSPECTION: "Inspection", INVOICE: "Invoice", FLOOR_PLAN: "Floor Plan",
}

const fmtDate  = (d) => new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
const fmtTime  = (d) => new Date(d).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })

function FileIcon({ mime, size = 16 }) {
  if (mime?.startsWith("image/"))  return <FileImage size={size} style={{ color: "#6D28D9" }} />
  if (mime === "application/pdf")  return <FileText  size={size} style={{ color: "#C2410C" }} />
  return <File size={size} style={{ color: "var(--color-text-muted)" }} />
}

function MimeLabel({ mime }) {
  if (mime?.startsWith("image/"))  return <span style={{ color: "#6D28D9" }}>Image</span>
  if (mime === "application/pdf")  return <span style={{ color: "#C2410C" }}>PDF</span>
  return <span>File</span>
}

// ── Actions dropdown ───────────────────────────────────────────────────────
function ActionsMenu({ doc, onVerify, onReject, onDelete, onViewDetails }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener("mousedown", h)
    return () => document.removeEventListener("mousedown", h)
  }, [])

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button
        onClick={() => setOpen(v => !v)}
        style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "30px", height: "30px", borderRadius: "6px", border: "1px solid var(--color-border)", background: "none", cursor: "pointer", color: "var(--color-text-muted)" }}
      >
        <MoreHorizontal size={15} />
      </button>

      {open && (
        <div style={{ position: "absolute", right: 0, top: "calc(100% + 6px)", backgroundColor: "var(--color-surface)", border: "1px solid var(--color-border)", borderRadius: "10px", boxShadow: "0 8px 24px #0000001a", zIndex: 50, minWidth: "170px", overflow: "hidden" }}>
          {/* View details — always first */}
          <MenuItem icon={<Eye size={14} />} label="View Details" onClick={() => { onViewDetails(doc); setOpen(false) }} />

          <div style={{ height: "1px", backgroundColor: "var(--color-border)", margin: "0.25rem 0" }} />

          {/* Quick actions */}
          {doc.status === "PENDING" && <>
            <MenuItem icon={<CheckCircle size={14} />} label="Verify" color="#15803D" onClick={() => { onVerify(doc.id); setOpen(false) }} />
            <MenuItem icon={<XCircle size={14} />}    label="Reject" color="#B91C1C" onClick={() => { onReject(doc.id); setOpen(false) }} />
          </>}
          <MenuItem icon={<Download size={14} />} label="Download" color="#1D4ED8" onClick={() => setOpen(false)} />

          <div style={{ height: "1px", backgroundColor: "var(--color-border)", margin: "0.25rem 0" }} />

          <MenuItem icon={<Trash2 size={14} />} label="Delete" color="#B91C1C" onClick={() => { onDelete(doc.id); setOpen(false) }} />
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

// ── Details drawer ─────────────────────────────────────────────────────────
function DetailsDrawer({ doc, onClose, onVerify, onReject }) {
  if (!doc) return null
  const st = STATUS_STYLES[doc.status]

  return (
    <>
      {/* Backdrop */}
      <div onClick={onClose} style={{ position: "fixed", inset: 0, backgroundColor: "#00000040", zIndex: 60 }} />

      {/* Panel */}
      <div style={{ position: "fixed", top: 0, right: 0, height: "100vh", width: "min(420px, 100vw)", backgroundColor: "var(--color-surface)", borderLeft: "1px solid var(--color-border)", zIndex: 70, display: "flex", flexDirection: "column", boxShadow: "-8px 0 32px #00000014" }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1.25rem 1.5rem", borderBottom: "1px solid var(--color-border)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.65rem" }}>
            <div style={{ width: "36px", height: "36px", borderRadius: "8px", backgroundColor: "var(--color-bg-muted)", border: "1px solid var(--color-border)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <FileIcon mime={doc.mimeType} size={18} />
            </div>
            <div>
              <p style={{ margin: 0, fontWeight: 600, fontSize: "0.9375rem", color: "var(--color-text)", lineHeight: 1.3 }}>{doc.name}</p>
              <p style={{ margin: 0, fontSize: "0.75rem", color: "var(--color-text-muted)" }}>{TYPE_LABELS[doc.type]}</p>
            </div>
          </div>
          <button onClick={onClose} style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "32px", height: "32px", borderRadius: "6px", border: "1px solid var(--color-border)", background: "none", cursor: "pointer", color: "var(--color-text-muted)", flexShrink: 0 }}>
            <X size={15} />
          </button>
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflowY: "auto", padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1.5rem" }}>

          {/* Status */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.85rem 1rem", backgroundColor: "var(--color-bg-muted)", borderRadius: "8px", border: "1px solid var(--color-border)" }}>
            <span style={{ fontSize: "0.8125rem", fontWeight: 500, color: "var(--color-text)" }}>Status</span>
            <Badge bg={st.bg} color={st.color} label={st.label} />
          </div>

          {/* Details grid */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
            <p style={drawerSectionLabel}>Document Details</p>
            <div style={{ border: "1px solid var(--color-border)", borderRadius: "8px", overflow: "hidden" }}>
              {[
                { label: "Document ID",    value: `#${doc.id}` },
                { label: "File Type",      value: <MimeLabel mime={doc.mimeType} /> },
                { label: "File Size",      value: doc.fileSize },
                { label: "Uploaded By",    value: doc.uploaderPublicId },
                { label: "Upload Date",    value: `${fmtDate(doc.createdAt)} at ${fmtTime(doc.createdAt)}` },
              ].map((row, i, arr) => (
                <div key={row.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.7rem 1rem", borderBottom: i < arr.length - 1 ? "1px solid var(--color-border)" : "none", backgroundColor: i % 2 === 0 ? "transparent" : "var(--color-bg-subtle)" }}>
                  <span style={{ fontSize: "0.8125rem", color: "var(--color-text-muted)" }}>{row.label}</span>
                  <span style={{ fontSize: "0.8125rem", fontWeight: 500, color: "var(--color-text)" }}>{row.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
            <p style={drawerSectionLabel}>Related Entity</p>
            <div style={{ border: "1px solid var(--color-border)", borderRadius: "8px", overflow: "hidden" }}>
              {[
                { label: "Entity Type", value: doc.relatedType },
                { label: "Entity ID",   value: <span style={{ color: "var(--color-primary)", fontWeight: 600 }}>#{doc.relatedId}</span> },
              ].map((row, i, arr) => (
                <div key={row.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.7rem 1rem", borderBottom: i < arr.length - 1 ? "1px solid var(--color-border)" : "none" }}>
                  <span style={{ fontSize: "0.8125rem", color: "var(--color-text-muted)" }}>{row.label}</span>
                  <span style={{ fontSize: "0.8125rem", fontWeight: 500, color: "var(--color-text)" }}>{row.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div style={{ padding: "1rem 1.5rem", borderTop: "1px solid var(--color-border)", display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
          {doc.status === "PENDING" && <>
            <button onClick={() => onVerify(doc.id)} style={{ ...drawerBtn, backgroundColor: "#15803D", color: "#fff", border: "none" }}>
              <CheckCircle size={14} /> Verify
            </button>
            <button onClick={() => onReject(doc.id)} style={{ ...drawerBtn, backgroundColor: "#B91C1C", color: "#fff", border: "none" }}>
              <XCircle size={14} /> Reject
            </button>
          </>}
          <button style={{ ...drawerBtn, backgroundColor: "transparent", color: "#1D4ED8", border: "1px solid #1D4ED820" }}>
            <Download size={14} /> Download
          </button>
        </div>
      </div>
    </>
  )
}

// ── Main page ──────────────────────────────────────────────────────────────
export default function AdminDocuments() {
  const [data, setData]             = useState(MOCK)
  const [search, setSearch]         = useState("")
  const [statusFilter, setStatus]   = useState("ALL")
  const [typeFilter, setType]       = useState("ALL")
  const [sortKey, setSortKey]       = useState("createdAt")
  const [sortDir, setSortDir]       = useState("desc")
  const [filterOpen, setFilterOpen] = useState(false)
  const [selected, setSelected]     = useState(null)   // details drawer
  const [page, setPage]             = useState(0)
  const filterRef = useRef(null)

  useEffect(() => {
    const h = (e) => { if (filterRef.current && !filterRef.current.contains(e.target)) setFilterOpen(false) }
    document.addEventListener("mousedown", h)
    return () => document.removeEventListener("mousedown", h)
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

  const handleSort = (key) => {
    if (sortKey === key) setSortDir(d => d === "asc" ? "desc" : "asc")
    else { setSortKey(key); setSortDir("asc") }
    setPage(0)
  }

  useEffect(() => { setPage(0) }, [search, statusFilter, typeFilter])

  const PAGE_SIZE  = 8
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const pageRows   = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)

  const verify = (id) => {
    setData(prev => prev.map(d => d.id === id ? { ...d, status: "VERIFIED" } : d))
    setSelected(prev => prev?.id === id ? { ...prev, status: "VERIFIED" } : prev)
  }
  const reject = (id) => {
    setData(prev => prev.map(d => d.id === id ? { ...d, status: "REJECTED" } : d))
    setSelected(prev => prev?.id === id ? { ...prev, status: "REJECTED" } : prev)
  }
  const remove = (id) => {
    setData(prev => prev.filter(d => d.id !== id))
    setSelected(prev => prev?.id === id ? null : prev)
  }

  const thStyle = (sortable) => ({ padding: "0.75rem 1rem", textAlign: "left", fontWeight: 600, fontSize: "0.75rem", color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: "0.04em", whiteSpace: "nowrap", cursor: sortable ? "pointer" : "default", userSelect: "none" })
  const tdStyle = { padding: "0.75rem 1rem", color: "var(--color-text-muted)", verticalAlign: "middle" }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>

      {/* Stat cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "1rem" }}>
        <StatCard label="Total"    value={stats.total}    color="var(--color-primary)" />
        <StatCard label="Pending"  value={stats.pending}  color="#C2410C" />
        <StatCard label="Verified" value={stats.verified} color="#15803D" />
        <StatCard label="Rejected" value={stats.rejected} color="#B91C1C" />
      </div>

      {/* Toolbar */}
      <Toolbar search={search} onSearch={setSearch} placeholder="Search name, uploader, ID…" filterRef={filterRef} filterOpen={filterOpen} setFilterOpen={setFilterOpen} activeFilters={activeFilters}>
        <FilterGroup label="Status">
          {["ALL","PENDING","VERIFIED","REJECTED"].map(s => <Pill key={s} active={statusFilter === s} onClick={() => setStatus(s)}>{s === "ALL" ? "All" : STATUS_STYLES[s].label}</Pill>)}
        </FilterGroup>
        <FilterGroup label="Document Type">
          {["ALL",...Object.keys(TYPE_LABELS)].map(t => <Pill key={t} active={typeFilter === t} onClick={() => setType(t)}>{t === "ALL" ? "All" : TYPE_LABELS[t]}</Pill>)}
        </FilterGroup>
        {activeFilters > 0 && <ClearBtn onClick={() => { setStatus("ALL"); setType("ALL") }} />}
      </Toolbar>

      {/* Table — desktop */}
      <div style={{ backgroundColor: "var(--color-surface)", borderRadius: "10px", border: "1px solid var(--color-border)", overflow: "hidden" }} className="docs-table">
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.875rem" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--color-border)", backgroundColor: "var(--color-bg-muted)" }}>
                {[
                  { key: "name",      label: "Document" },
                  { key: "type",      label: "Type"     },
                  { key: "status",    label: "Status"   },
                  { key: "createdAt", label: "Uploaded" },
                  { key: null,        label: "Actions"  },
                ].map(col => (
                  <th key={col.label} onClick={() => col.key && handleSort(col.key)} style={thStyle(!!col.key)}>
                    {col.label}{col.key && sortKey === col.key && <span style={{ marginLeft: 4 }}>{sortDir === "asc" ? "↑" : "↓"}</span>}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {pageRows.length === 0 ? (
                <tr><td colSpan={5} style={{ padding: "3rem", textAlign: "center", color: "var(--color-text-muted)" }}>No documents found</td></tr>
              ) : pageRows.map((doc, i) => {
                const st = STATUS_STYLES[doc.status]
                return (
                  <tr key={doc.id} style={{ borderBottom: "1px solid var(--color-border)", backgroundColor: i % 2 !== 0 ? "var(--color-bg-subtle)" : "transparent" }}>
                    <td style={tdStyle}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.65rem" }}>
                        <div style={{ width: "34px", height: "34px", borderRadius: "8px", backgroundColor: "var(--color-bg-muted)", border: "1px solid var(--color-border)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                          <FileIcon mime={doc.mimeType} size={16} />
                        </div>
                        <div>
                          <p style={{ margin: 0, fontWeight: 500, color: "var(--color-text)", maxWidth: "220px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{doc.name}</p>
                          <p style={{ margin: 0, fontSize: "0.75rem", color: "var(--color-text-muted)" }}>{doc.fileSize} · {doc.uploaderPublicId}</p>
                        </div>
                      </div>
                    </td>
                    <td style={tdStyle}>{TYPE_LABELS[doc.type]}</td>
                    <td style={tdStyle}><Badge bg={st.bg} color={st.color} label={st.label} /></td>
                    <td style={{ ...tdStyle, whiteSpace: "nowrap" }}>{fmtDate(doc.createdAt)}</td>
                    <td style={tdStyle}>
                      <ActionsMenu doc={doc} onVerify={verify} onReject={reject} onDelete={remove} onViewDetails={setSelected} />
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        <DocsPagination page={page} totalPages={totalPages} totalElements={filtered.length} pageSize={PAGE_SIZE} onPageChange={setPage} />
      </div>

      {/* Mobile cards */}
      <div className="docs-cards" style={{ display: "none", flexDirection: "column", gap: "0.75rem" }}>
        {pageRows.length === 0 ? (
          <p style={{ textAlign: "center", color: "var(--color-text-muted)", padding: "2rem 0" }}>No documents found</p>
        ) : pageRows.map(doc => {
          const st = STATUS_STYLES[doc.status]
          return (
            <div key={doc.id} style={{ backgroundColor: "var(--color-surface)", border: "1px solid var(--color-border)", borderRadius: "12px", overflow: "hidden" }}>
              {/* Card top */}
              <div style={{ display: "flex", alignItems: "center", gap: "0.85rem", padding: "1rem", borderBottom: "1px solid var(--color-border)" }}>
                <div style={{ width: "42px", height: "42px", borderRadius: "10px", backgroundColor: "var(--color-bg-muted)", border: "1px solid var(--color-border)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <FileIcon mime={doc.mimeType} size={20} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ margin: 0, fontWeight: 600, fontSize: "0.875rem", color: "var(--color-text)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{doc.name}</p>
                  <p style={{ margin: "2px 0 0", fontSize: "0.75rem", color: "var(--color-text-muted)" }}>{TYPE_LABELS[doc.type]} · {doc.fileSize}</p>
                </div>
                <Badge bg={st.bg} color={st.color} label={st.label} />
              </div>
              {/* Card bottom */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.65rem 1rem" }}>
                <p style={{ margin: 0, fontSize: "0.75rem", color: "var(--color-text-muted)" }}>
                  {doc.uploaderPublicId} · {fmtDate(doc.createdAt)}
                </p>
                <ActionsMenu doc={doc} onVerify={verify} onReject={reject} onDelete={remove} onViewDetails={setSelected} />
              </div>
            </div>
          )
        })}
        <DocsPagination page={page} totalPages={totalPages} totalElements={filtered.length} pageSize={PAGE_SIZE} onPageChange={setPage} />
      </div>

      {/* Details drawer */}
      <DetailsDrawer doc={selected} onClose={() => setSelected(null)} onVerify={verify} onReject={reject} />
    </div>
  )
}

const drawerSectionLabel = { margin: "0 0 0.6rem", fontSize: "0.75rem", fontWeight: 600, color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }
const drawerBtn = { display: "flex", alignItems: "center", gap: "0.4rem", padding: "0.5rem 1rem", borderRadius: "8px", fontWeight: 600, fontSize: "0.8125rem", cursor: "pointer", fontFamily: "inherit" }

function DocsPagination({ page, totalPages, totalElements, pageSize, onPageChange }) {
  if (totalPages <= 1) return (
    <div style={{ padding: "0.75rem 1rem", borderTop: "1px solid var(--color-border)", fontSize: "0.8125rem", color: "var(--color-text-muted)" }}>
      Showing {totalElements} of {totalElements}
    </div>
  )
  const from  = page * pageSize + 1
  const to    = Math.min((page + 1) * pageSize, totalElements)
  const pages = buildPages(page, totalPages)
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.5rem", padding: "0.75rem 1rem", borderTop: "1px solid var(--color-border)", fontSize: "0.8125rem", color: "var(--color-text-muted)" }}>
      <span>{from}–{to} of {totalElements}</span>
      <div style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
        <PgNav onClick={() => onPageChange(page - 1)} disabled={page === 0}><ChevronLeft size={14} /></PgNav>
        {pages.map((p, i) => p === "…"
          ? <span key={`e${i}`} style={{ padding: "0 0.35rem", color: "var(--color-text-subtle)" }}>…</span>
          : <PgBtn key={p} active={p === page} onClick={() => onPageChange(p)}>{p + 1}</PgBtn>
        )}
        <PgNav onClick={() => onPageChange(page + 1)} disabled={page >= totalPages - 1}><ChevronRight size={14} /></PgNav>
      </div>
    </div>
  )
}

function PgBtn({ active, onClick, children }) {
  return <button onClick={onClick} style={{ minWidth: 30, height: 30, borderRadius: "6px", border: "1px solid", cursor: "pointer", fontSize: "0.8125rem", fontFamily: "inherit", fontWeight: active ? 600 : 400, backgroundColor: active ? "var(--color-primary)" : "transparent", borderColor: active ? "var(--color-primary)" : "var(--color-border)", color: active ? "#fff" : "var(--color-text-muted)" }}>{children}</button>
}
function PgNav({ onClick, disabled, children }) {
  return <button onClick={onClick} disabled={disabled} style={{ width: 30, height: 30, borderRadius: "6px", border: "1px solid var(--color-border)", background: "none", cursor: disabled ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: disabled ? "var(--color-border)" : "var(--color-text-muted)" }}>{children}</button>
}
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
