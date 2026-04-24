import { useState, useMemo, useRef, useEffect } from "react"
import { Download, Trash2, FileText, FileImage, File, X, MoreHorizontal, Eye, ChevronLeft, ChevronRight, Loader2 } from "lucide-react"
import { StatCard, Toolbar, FilterGroup, Pill, ClearBtn, Badge } from "../../components/shared/AdminUI"
import { documentsApi } from "../../api/documents.api"
import { fmtDate } from "../../utils/formatters"

const TYPE_LABELS = {
  CONTRACT:         "Contract",
  TITLE_DEED:       "Title Deed",
  FLOOR_PLAN:       "Floor Plan",
  INSPECTION_REPORT:"Inspection Report",
  OTHER:            "Other",
}

function FileIcon({ mime, size = 16 }) {
  if (mime?.startsWith("image/")) return <FileImage size={size} style={{ color: "#6D28D9" }} />
  if (mime === "application/pdf") return <FileText  size={size} style={{ color: "#C2410C" }} />
  return <File size={size} style={{ color: "var(--color-text-muted)" }} />
}

function ActionsMenu({ doc, onDelete, onViewDetails }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener("mousedown", h)
    return () => document.removeEventListener("mousedown", h)
  }, [])
  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button onClick={() => setOpen(v => !v)} style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 30, height: 30, borderRadius: "6px", border: "1px solid var(--color-border)", background: "none", cursor: "pointer", color: "var(--color-text-muted)" }}>
        <MoreHorizontal size={15} />
      </button>
      {open && (
        <div style={{ position: "absolute", right: 0, top: "calc(100% + 6px)", backgroundColor: "var(--color-surface)", border: "1px solid var(--color-border)", borderRadius: "10px", boxShadow: "0 8px 24px #0000001a", zIndex: 50, minWidth: 160, overflow: "hidden" }}>
          <MenuItem icon={<Eye size={14} />}      label="View Details" onClick={() => { onViewDetails(doc); setOpen(false) }} />
          <div style={{ height: 1, backgroundColor: "var(--color-border)", margin: "0.25rem 0" }} />
          <MenuItem icon={<Trash2 size={14} />}   label="Delete"       color="#B91C1C" onClick={() => { onDelete(doc.id); setOpen(false) }} />
        </div>
      )}
    </div>
  )
}

function MenuItem({ icon, label, color = "var(--color-text)", onClick }) {
  const [hover, setHover] = useState(false)
  return (
    <button onClick={onClick} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{ display: "flex", alignItems: "center", gap: "0.5rem", width: "100%", padding: "0.5rem 0.85rem", border: "none", background: hover ? "var(--color-bg-muted)" : "none", cursor: "pointer", fontSize: "0.8125rem", color, fontFamily: "inherit", textAlign: "left" }}>
      {icon}{label}
    </button>
  )
}

function DetailsDrawer({ doc, onClose, onDelete }) {
  if (!doc) return null
  return (
    <>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, backgroundColor: "#00000040", zIndex: 60 }} />
      <div style={{ position: "fixed", top: 0, right: 0, height: "100vh", width: "min(420px, 100vw)", backgroundColor: "var(--color-surface)", borderLeft: "1px solid var(--color-border)", zIndex: 70, display: "flex", flexDirection: "column", boxShadow: "-8px 0 32px #00000014" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1.25rem 1.5rem", borderBottom: "1px solid var(--color-border)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.65rem" }}>
            <div style={{ width: 36, height: 36, borderRadius: "8px", backgroundColor: "var(--color-bg-muted)", border: "1px solid var(--color-border)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <FileIcon mime="application/pdf" size={18} />
            </div>
            <div>
              <p style={{ margin: 0, fontWeight: 600, fontSize: "0.9375rem", color: "var(--color-text)" }}>{doc.name}</p>
              <p style={{ margin: 0, fontSize: "0.75rem", color: "var(--color-text-muted)" }}>{TYPE_LABELS[doc.type] ?? doc.type}</p>
            </div>
          </div>
          <button onClick={onClose} style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 32, height: 32, borderRadius: "6px", border: "1px solid var(--color-border)", background: "none", cursor: "pointer", color: "var(--color-text-muted)" }}>
            <X size={15} />
          </button>
        </div>
        <div style={{ flex: 1, overflowY: "auto", padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          <div style={{ border: "1px solid var(--color-border)", borderRadius: "8px", overflow: "hidden" }}>
            {[
              { label: "Document ID",  value: `#${doc.id}` },
              { label: "Type",         value: TYPE_LABELS[doc.type] ?? doc.type },
              { label: "Uploaded By",  value: doc.uploadedBy },
              { label: "Property",     value: doc.propertyId ? `#${doc.propertyId}` : "—" },
              { label: "Upload Date",  value: doc.createdAt ? fmtDate(doc.createdAt) : "—" },
              { label: "File URL",     value: <a href={doc.fileUrl} target="_blank" rel="noreferrer" style={{ color: "var(--color-primary)", fontSize: "0.75rem", wordBreak: "break-all" }}>View file</a> },
            ].map((row, i, arr) => (
              <div key={row.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.7rem 1rem", borderBottom: i < arr.length - 1 ? "1px solid var(--color-border)" : "none", backgroundColor: i % 2 === 0 ? "transparent" : "var(--color-bg-subtle)" }}>
                <span style={{ fontSize: "0.8125rem", color: "var(--color-text-muted)" }}>{row.label}</span>
                <span style={{ fontSize: "0.8125rem", fontWeight: 500, color: "var(--color-text)" }}>{row.value}</span>
              </div>
            ))}
          </div>
        </div>
        <div style={{ padding: "1rem 1.5rem", borderTop: "1px solid var(--color-border)", display: "flex", gap: "0.75rem" }}>
          <a href={doc.fileUrl} target="_blank" rel="noreferrer" style={{ display: "flex", alignItems: "center", gap: "0.4rem", padding: "0.5rem 1rem", borderRadius: "8px", fontWeight: 600, fontSize: "0.8125rem", cursor: "pointer", fontFamily: "inherit", backgroundColor: "transparent", color: "#1D4ED8", border: "1px solid #1D4ED820", textDecoration: "none" }}>
            <Download size={14} /> Open File
          </a>
          <button onClick={() => onDelete(doc.id)} style={{ display: "flex", alignItems: "center", gap: "0.4rem", padding: "0.5rem 1rem", borderRadius: "8px", fontWeight: 600, fontSize: "0.8125rem", cursor: "pointer", fontFamily: "inherit", backgroundColor: "transparent", color: "#B91C1C", border: "1px solid #B91C1C20" }}>
            <Trash2 size={14} /> Delete
          </button>
        </div>
      </div>
    </>
  )
}

const PAGE_SIZE = 8

export default function AdminDocuments() {
  const [data, setData]             = useState([])
  const [loading, setLoading]       = useState(true)
  const [search, setSearch]         = useState("")
  const [typeFilter, setType]       = useState("ALL")
  const [sortKey, setSortKey]       = useState("createdAt")
  const [sortDir, setSortDir]       = useState("desc")
  const [filterOpen, setFilterOpen] = useState(false)
  const [selected, setSelected]     = useState(null)
  const [page, setPage]             = useState(0)
  const filterRef = useRef(null)

  useEffect(() => {
    documentsApi.getAll()
      .then(res => setData(Array.isArray(res) ? res : []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    const h = (e) => { if (filterRef.current && !filterRef.current.contains(e.target)) setFilterOpen(false) }
    document.addEventListener("mousedown", h)
    return () => document.removeEventListener("mousedown", h)
  }, [])

  const activeFilters = typeFilter !== "ALL" ? 1 : 0

  const stats = useMemo(() => ({
    total:    data.length,
    contract: data.filter(d => d.type === "CONTRACT").length,
    deed:     data.filter(d => d.type === "TITLE_DEED").length,
    other:    data.filter(d => !["CONTRACT","TITLE_DEED"].includes(d.type)).length,
  }), [data])

  const filtered = useMemo(() => {
    let rows = data
    if (typeFilter !== "ALL") rows = rows.filter(d => d.type === typeFilter)
    if (search.trim()) {
      const q = search.toLowerCase()
      rows = rows.filter(d => (d.name ?? "").toLowerCase().includes(q) || (d.uploadedBy ?? "").toLowerCase().includes(q) || String(d.id).includes(q))
    }
    return [...rows].sort((a, b) => {
      let av = a[sortKey], bv = b[sortKey]
      if (typeof av === "string") { av = av.toLowerCase(); bv = bv.toLowerCase() }
      return sortDir === "asc" ? (av > bv ? 1 : -1) : (av < bv ? 1 : -1)
    })
  }, [data, search, typeFilter, sortKey, sortDir])

  useEffect(() => { setPage(0) }, [search, typeFilter])

  const handleSort = (key) => {
    if (sortKey === key) setSortDir(d => d === "asc" ? "desc" : "asc")
    else { setSortKey(key); setSortDir("asc") }
    setPage(0)
  }

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const pageRows   = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)

  const remove = async (id) => {
    try {
      await documentsApi.remove(id)
      setData(prev => prev.filter(d => d.id !== id))
      setSelected(prev => prev?.id === id ? null : prev)
    } catch {}
  }

  const thStyle = (sortable) => ({ padding: "0.75rem 1rem", textAlign: "left", fontWeight: 600, fontSize: "0.75rem", color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: "0.04em", whiteSpace: "nowrap", cursor: sortable ? "pointer" : "default", userSelect: "none" })
  const tdStyle = { padding: "0.75rem 1rem", color: "var(--color-text-muted)", verticalAlign: "middle" }

  if (loading) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "60vh", gap: "0.75rem", color: "var(--color-text-muted)" }}>
      <Loader2 size={20} style={{ animation: "spin 1s linear infinite" }} /> Loading documents…
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "1rem" }}>
        <StatCard label="Total"     value={stats.total}    color="var(--color-primary)" />
        <StatCard label="Contracts" value={stats.contract} color="#1D4ED8" />
        <StatCard label="Title Deeds" value={stats.deed}   color="#15803D" />
        <StatCard label="Other"     value={stats.other}    color="#6D28D9" />
      </div>

      <Toolbar search={search} onSearch={setSearch} placeholder="Search name, uploader, ID…" filterRef={filterRef} filterOpen={filterOpen} setFilterOpen={setFilterOpen} activeFilters={activeFilters}>
        <FilterGroup label="Document Type">
          {["ALL", ...Object.keys(TYPE_LABELS)].map(t => <Pill key={t} active={typeFilter === t} onClick={() => setType(t)}>{t === "ALL" ? "All" : TYPE_LABELS[t]}</Pill>)}
        </FilterGroup>
        {activeFilters > 0 && <ClearBtn onClick={() => setType("ALL")} />}
      </Toolbar>

      <div style={{ backgroundColor: "var(--color-surface)", borderRadius: "10px", border: "1px solid var(--color-border)", overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.875rem" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--color-border)", backgroundColor: "var(--color-bg-muted)" }}>
                {[
                  { key: "name",      label: "Document" },
                  { key: "type",      label: "Type"     },
                  { key: "uploadedBy",label: "Uploaded By" },
                  { key: "propertyId",label: "Property" },
                  { key: "createdAt", label: "Date"     },
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
                <tr><td colSpan={6} style={{ padding: "3rem", textAlign: "center", color: "var(--color-text-muted)" }}>No documents found</td></tr>
              ) : pageRows.map((doc, i) => (
                <tr key={doc.id} style={{ borderBottom: "1px solid var(--color-border)", backgroundColor: i % 2 !== 0 ? "var(--color-bg-subtle)" : "transparent" }}>
                  <td style={tdStyle}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.65rem" }}>
                      <div style={{ width: 34, height: 34, borderRadius: "8px", backgroundColor: "var(--color-bg-muted)", border: "1px solid var(--color-border)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <FileText size={16} style={{ color: "#C2410C" }} />
                      </div>
                      <p style={{ margin: 0, fontWeight: 500, color: "var(--color-text)", maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{doc.name}</p>
                    </div>
                  </td>
                  <td style={tdStyle}>{TYPE_LABELS[doc.type] ?? doc.type}</td>
                  <td style={{ ...tdStyle, maxWidth: 140, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{doc.uploadedBy}</td>
                  <td style={tdStyle}>{doc.propertyId ? <span style={{ color: "var(--color-primary)", fontWeight: 600 }}>#{doc.propertyId}</span> : "—"}</td>
                  <td style={{ ...tdStyle, whiteSpace: "nowrap" }}>{doc.createdAt ? fmtDate(doc.createdAt) : "—"}</td>
                  <td style={tdStyle}>
                    <ActionsMenu doc={doc} onDelete={remove} onViewDetails={setSelected} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {totalPages > 1 && (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.75rem 1rem", borderTop: "1px solid var(--color-border)", fontSize: "0.8125rem", color: "var(--color-text-muted)" }}>
            <span>{page * PAGE_SIZE + 1}–{Math.min((page + 1) * PAGE_SIZE, filtered.length)} of {filtered.length}</span>
            <div style={{ display: "flex", gap: "0.25rem" }}>
              <button onClick={() => setPage(p => p - 1)} disabled={page === 0} style={{ width: 30, height: 30, borderRadius: "6px", border: "1px solid var(--color-border)", background: "none", cursor: page === 0 ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: page === 0 ? "var(--color-border)" : "var(--color-text-muted)" }}><ChevronLeft size={14} /></button>
              <button onClick={() => setPage(p => p + 1)} disabled={page >= totalPages - 1} style={{ width: 30, height: 30, borderRadius: "6px", border: "1px solid var(--color-border)", background: "none", cursor: page >= totalPages - 1 ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: page >= totalPages - 1 ? "var(--color-border)" : "var(--color-text-muted)" }}><ChevronRight size={14} /></button>
            </div>
          </div>
        )}
      </div>

      <DetailsDrawer doc={selected} onClose={() => setSelected(null)} onDelete={remove} />
    </div>
  )
}
