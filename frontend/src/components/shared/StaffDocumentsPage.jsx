import { useRef, useState } from "react"
import { UploadCloud, FileText, FileImage, File, X, CheckCircle, Clock, XCircle, AlertCircle, Download, Plus, MoreHorizontal } from "lucide-react"
import { DOCUMENT_TYPE_LABELS } from "../../constants/enums"

// ── helpers ────────────────────────────────────────────────────────────────
function FileIcon({ mime, size = 15 }) {
  if (mime?.startsWith("image/"))  return <FileImage size={size} style={{ color: "#6D28D9" }} />
  if (mime === "application/pdf")  return <FileText  size={size} style={{ color: "#C2410C" }} />
  return <File size={size} style={{ color: "var(--color-text-muted)" }} />
}

const STATUS_META = {
  VERIFIED:  { icon: <CheckCircle  size={13} />, color: "#15803D", bg: "#F0FDF4", label: "Verified"  },
  PENDING:   { icon: <Clock        size={13} />, color: "#C2410C", bg: "#FFF7ED", label: "Pending"   },
  REJECTED:  { icon: <XCircle      size={13} />, color: "#B91C1C", bg: "#FEF2F2", label: "Rejected"  },
  REQUESTED: { icon: <AlertCircle  size={13} />, color: "#1D4ED8", bg: "#EFF6FF", label: "Requested" },
}

function StatusBadge({ status }) {
  const m = STATUS_META[status] ?? STATUS_META.PENDING
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: "0.3rem", backgroundColor: m.bg, color: m.color, borderRadius: "999px", padding: "2px 10px", fontSize: "0.72rem", fontWeight: 600, whiteSpace: "nowrap" }}>
      {m.icon}{m.label}
    </span>
  )
}

// ── Actions dropdown ───────────────────────────────────────────────────────
function ActionsMenu({ doc, onAccept, onReject, onDownload }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  const close = () => setOpen(false)

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button
        onClick={() => setOpen(v => !v)}
        style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 30, height: 30, borderRadius: "6px", border: "1px solid var(--color-border)", background: "none", cursor: "pointer", color: "var(--color-text-muted)" }}
      >
        <MoreHorizontal size={15} />
      </button>

      {open && (
        <div
          style={{ position: "absolute", right: 0, top: "calc(100% + 6px)", backgroundColor: "var(--color-surface)", border: "1px solid var(--color-border)", borderRadius: "10px", boxShadow: "0 8px 24px #0000001a", zIndex: 50, minWidth: 170, overflow: "hidden" }}
          onMouseLeave={close}
        >
          {doc.status === "PENDING" && <>
            <MenuItem icon={<CheckCircle size={14} />} label="Accept"   color="#15803D" onClick={() => { onAccept(doc.id);   close() }} />
            <MenuItem icon={<XCircle    size={14} />} label="Reject"   color="#B91C1C" onClick={() => { onReject(doc.id);   close() }} />
            <div style={{ height: 1, backgroundColor: "var(--color-border)", margin: "0.25rem 0" }} />
          </>}
          <MenuItem icon={<Download size={14} />} label="Download" color="#1D4ED8" onClick={() => { onDownload(doc); close() }} />
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
      style={{ display: "flex", alignItems: "center", gap: "0.5rem", width: "100%", padding: "0.5rem 0.875rem", border: "none", background: hover ? "var(--color-bg-muted)" : "none", cursor: "pointer", fontSize: "0.8125rem", color, fontFamily: "inherit", textAlign: "left" }}
    >
      {icon}{label}
    </button>
  )
}

// ── Request modal ──────────────────────────────────────────────────────────
function RequestModal({ onClose, onRequested, relatedOptions }) {
  const [form, setForm] = useState({ type: "ID_DOCUMENT", relatedLabel: relatedOptions[0] ?? "", note: "" })

  const submit = () => {
    if (!form.relatedLabel) return
    onRequested({ ...form, id: Date.now(), requestedAt: new Date().toISOString().split("T")[0], status: "REQUESTED" })
    onClose()
  }

  return (
    <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.5)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }} onClick={onClose}>
      <div style={{ backgroundColor: "#fff", borderRadius: "16px", width: "100%", maxWidth: 420, padding: "1.75rem", position: "relative" }} onClick={e => e.stopPropagation()}>
        <button onClick={onClose} style={{ position: "absolute", top: "1rem", right: "1rem", background: "none", border: "none", cursor: "pointer", color: "var(--color-text-muted)", display: "flex" }}><X size={18} /></button>

        <p style={{ margin: "0 0 1.25rem", fontWeight: 700, fontSize: "1.0625rem", color: "var(--color-text)" }}>Request Document</p>

        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div>
            <label style={LBL}>Document Type</label>
            <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))} style={INPUT}>
              {Object.entries(DOCUMENT_TYPE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
          </div>
          <div>
            <label style={LBL}>Related To</label>
            <select value={form.relatedLabel} onChange={e => setForm(f => ({ ...f, relatedLabel: e.target.value }))} style={INPUT}>
              {relatedOptions.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>
          <div>
            <label style={LBL}>Note for uploader <span style={{ fontWeight: 400, textTransform: "none" }}>(optional)</span></label>
            <textarea value={form.note} onChange={e => setForm(f => ({ ...f, note: e.target.value }))} rows={2} placeholder="e.g. Please upload a clear copy…" style={{ ...INPUT, resize: "vertical" }} />
          </div>
        </div>

        <button onClick={submit} style={{ marginTop: "1.25rem", width: "100%", padding: "0.75rem", borderRadius: "10px", border: "none", backgroundColor: "var(--color-primary)", color: "#fff", fontWeight: 700, fontSize: "0.9rem", cursor: "pointer", fontFamily: "inherit" }}>
          Send Request
        </button>
      </div>
    </div>
  )
}

// ── Main component ─────────────────────────────────────────────────────────
export default function StaffDocumentsPage({ documents: initialDocs, requests: initialRequests, relatedOptions, onVerify, onReject }) {
  const [docs, setDocs]           = useState(initialDocs)
  const [requests, setRequests]   = useState(initialRequests)
  const [tab, setTab]             = useState("DOCUMENTS")
  const [showRequest, setShowRequest] = useState(false)
  const [statusFilter, setStatusFilter] = useState("ALL")

  const accept   = (id) => { setDocs(d => d.map(x => x.id === id ? { ...x, status: "VERIFIED" } : x)); onVerify?.(id) }
  const reject   = (id) => { setDocs(d => d.map(x => x.id === id ? { ...x, status: "REJECTED" } : x)); onReject?.(id) }
  const download = (doc) => {
    // In production: trigger real file download via signed URL
    const a = document.createElement("a")
    a.href = "#"; a.download = doc.name; a.click()
  }

  const handleRequested = (req) => setRequests(r => [req, ...r])

  const filtered = statusFilter === "ALL" ? docs : docs.filter(d => d.status === statusFilter)

  const counts = {
    total:     docs.length,
    pending:   docs.filter(d => d.status === "PENDING").length,
    verified:  docs.filter(d => d.status === "VERIFIED").length,
    rejected:  docs.filter(d => d.status === "REJECTED").length,
    requested: requests.length,
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>

      {/* Summary strip */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "1rem" }}>
        {[
          { label: "Total",     value: counts.total,     color: "var(--color-primary)" },
          { label: "Pending",   value: counts.pending,   color: "#C2410C" },
          { label: "Verified",  value: counts.verified,  color: "#15803D" },
          { label: "Rejected",  value: counts.rejected,  color: "#B91C1C" },
          { label: "Requested", value: counts.requested, color: "#1D4ED8" },
        ].map(s => (
          <div key={s.label} style={{ backgroundColor: "var(--color-surface)", borderRadius: "12px", border: "1px solid var(--color-border)", padding: "0.875rem 1.1rem" }}>
            <p style={{ margin: 0, fontSize: "0.72rem", fontWeight: 600, color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>{s.label}</p>
            <p style={{ margin: "0.25rem 0 0", fontWeight: 800, fontSize: "1.375rem", color: s.color, letterSpacing: "-0.02em" }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap" }}>
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
          {["DOCUMENTS", "REQUESTED"].map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              padding: "0.4rem 1.1rem", borderRadius: "999px", border: "1px solid",
              borderColor: tab === t ? "var(--color-primary)" : "var(--color-border)",
              backgroundColor: tab === t ? "var(--color-primary)" : "#fff",
              color: tab === t ? "#fff" : "var(--color-text-muted)",
              fontWeight: 600, fontSize: "0.8rem", cursor: "pointer", fontFamily: "inherit",
            }}>
              {t === "DOCUMENTS" ? `Documents (${counts.total})` : `Requested (${counts.requested})`}
            </button>
          ))}
        </div>
        <button
          onClick={() => setShowRequest(true)}
          style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", padding: "0.5rem 1.1rem", borderRadius: "8px", border: "none", backgroundColor: "var(--color-primary)", color: "#fff", fontWeight: 600, fontSize: "0.8125rem", cursor: "pointer", fontFamily: "inherit" }}
        >
          <Plus size={15} /> Request Document
        </button>
      </div>

      {/* Documents tab */}
      {tab === "DOCUMENTS" && (
        <>
          {/* Status filter */}
          <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
            {["ALL", "PENDING", "VERIFIED", "REJECTED"].map(s => (
              <button key={s} onClick={() => setStatusFilter(s)} style={{
                padding: "0.3rem 0.875rem", borderRadius: "999px", border: "1px solid",
                borderColor: statusFilter === s ? "var(--color-primary)" : "var(--color-border)",
                backgroundColor: statusFilter === s ? "var(--color-primary)" : "#fff",
                color: statusFilter === s ? "#fff" : "var(--color-text-muted)",
                fontWeight: 600, fontSize: "0.75rem", cursor: "pointer", fontFamily: "inherit",
              }}>
                {s === "ALL" ? "All" : STATUS_META[s].label}
              </button>
            ))}
          </div>

          <div style={{ backgroundColor: "var(--color-surface)", borderRadius: "14px", border: "1px solid var(--color-border)", overflow: "hidden" }}>
            {filtered.length === 0 ? (
              <div style={{ padding: "3rem", textAlign: "center", color: "var(--color-text-muted)", fontSize: "0.875rem" }}>No documents found.</div>
            ) : (
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.8375rem" }}>
                  <thead>
                    <tr style={{ backgroundColor: "var(--color-bg-muted)", borderBottom: "1px solid var(--color-border)" }}>
                      {["Document", "Type", "Related To", "Uploaded By", "Date", "Status", ""].map(h => (
                        <th key={h} style={{ padding: "0.65rem 1.25rem", textAlign: "left", fontWeight: 600, fontSize: "0.72rem", color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: "0.04em", whiteSpace: "nowrap" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((d, i) => (
                      <tr key={d.id} style={{ borderBottom: i < filtered.length - 1 ? "1px solid var(--color-border)" : "none" }}>
                        <td style={TD}>
                          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                            <div style={{ width: 32, height: 32, borderRadius: "7px", backgroundColor: "var(--color-bg-muted)", border: "1px solid var(--color-border)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                              <FileIcon mime={d.mime} size={15} />
                            </div>
                            <span style={{ fontWeight: 500, color: "var(--color-text)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 180 }}>{d.name}</span>
                          </div>
                        </td>
                        <td style={TD}>{DOCUMENT_TYPE_LABELS[d.type] ?? d.type}</td>
                        <td style={{ ...TD, maxWidth: 180, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{d.relatedLabel}</td>
                        <td style={TD}>{d.uploadedBy}</td>
                        <td style={{ ...TD, whiteSpace: "nowrap" }}>{d.uploadedAt}</td>
                        <td style={TD}><StatusBadge status={d.status} /></td>
                        <td style={TD}>
                          <ActionsMenu doc={d} onAccept={accept} onReject={reject} onDownload={download} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}

      {/* Requested tab */}
      {tab === "REQUESTED" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>
          {requests.length === 0 ? (
            <div style={{ backgroundColor: "var(--color-surface)", borderRadius: "14px", border: "1px solid var(--color-border)", padding: "3rem", textAlign: "center", color: "var(--color-text-muted)", fontSize: "0.875rem" }}>
              No pending document requests.
            </div>
          ) : requests.map(req => (
            <div key={req.id} style={{ backgroundColor: "var(--color-surface)", borderRadius: "12px", border: "1px solid var(--color-border)", padding: "1.1rem 1.25rem", display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
              <div style={{ width: 38, height: 38, borderRadius: "9px", backgroundColor: "#EFF6FF", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <FileText size={18} style={{ color: "#1D4ED8" }} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ margin: 0, fontWeight: 600, fontSize: "0.9rem", color: "var(--color-text)" }}>{DOCUMENT_TYPE_LABELS[req.type]}</p>
                <p style={{ margin: "2px 0 0", fontSize: "0.78rem", color: "var(--color-text-muted)" }}>{req.relatedLabel} · Requested {req.requestedAt}</p>
                {req.note && <p style={{ margin: "4px 0 0", fontSize: "0.78rem", color: "#C2410C", fontStyle: "italic" }}>"{req.note}"</p>}
              </div>
              <StatusBadge status="REQUESTED" />
              <button
                onClick={() => setRequests(r => r.filter(x => x.id !== req.id))}
                title="Cancel request"
                style={{ display: "flex", alignItems: "center", gap: "0.3rem", padding: "0.45rem 0.875rem", borderRadius: "8px", border: "1px solid var(--color-border)", background: "none", color: "var(--color-text-muted)", fontWeight: 600, fontSize: "0.78rem", cursor: "pointer", fontFamily: "inherit" }}
              >
                <X size={13} /> Cancel
              </button>
            </div>
          ))}
        </div>
      )}

      {showRequest && (
        <RequestModal
          relatedOptions={relatedOptions}
          onClose={() => setShowRequest(false)}
          onRequested={handleRequested}
        />
      )}
    </div>
  )
}

const TD  = { padding: "0.75rem 1.25rem", color: "var(--color-text-muted)", verticalAlign: "middle" }
const LBL = { display: "block", fontSize: "0.72rem", fontWeight: 600, color: "var(--color-text-muted)", marginBottom: "0.3rem", textTransform: "uppercase", letterSpacing: "0.06em" }
const INPUT = { width: "100%", padding: "0.6rem 0.875rem", borderRadius: "8px", border: "1px solid var(--color-border)", fontSize: "0.875rem", fontFamily: "inherit", outline: "none", boxSizing: "border-box", backgroundColor: "#fff" }
