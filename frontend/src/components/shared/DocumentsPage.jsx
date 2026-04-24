import { useRef, useState, useEffect } from "react"
import { documentsApi } from "../../api/documents.api"
import { UploadCloud, FileText, FileImage, File, X, CheckCircle, Clock, XCircle, AlertCircle } from "lucide-react"
import { DOCUMENT_TYPE_LABELS } from "../../constants/enums"

// ── helpers ────────────────────────────────────────────────────────────────
function FileIcon({ mime, size = 15 }) {
  if (mime?.startsWith("image/"))  return <FileImage size={size} style={{ color: "#6D28D9" }} />
  if (mime === "application/pdf")  return <FileText  size={size} style={{ color: "#C2410C" }} />
  return <File size={size} style={{ color: "var(--color-text-muted)" }} />
}

const STATUS_META = {
  VERIFIED: { icon: <CheckCircle size={14} />, color: "#15803D", bg: "#F0FDF4", label: "Verified"  },
  PENDING:  { icon: <Clock       size={14} />, color: "#C2410C", bg: "#FFF7ED", label: "Pending"   },
  REJECTED: { icon: <XCircle     size={14} />, color: "#B91C1C", bg: "#FEF2F2", label: "Rejected"  },
  REQUESTED:{ icon: <AlertCircle size={14} />, color: "#1D4ED8", bg: "#EFF6FF", label: "Requested" },
}

function StatusBadge({ status }) {
  const m = STATUS_META[status]
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: "0.3rem", backgroundColor: m.bg, color: m.color, borderRadius: "999px", padding: "2px 10px", fontSize: "0.72rem", fontWeight: 600, whiteSpace: "nowrap" }}>
      {m.icon}{m.label}
    </span>
  )
}

// ── Upload dropzone ────────────────────────────────────────────────────────
function DropZone({ onFile }) {
  const inputRef        = useRef(null)
  const [dragging, setDragging] = useState(false)

  const accept = (file) => { if (file) onFile(file) }
  const onDrop = (e) => { e.preventDefault(); setDragging(false); accept(e.dataTransfer.files[0]) }

  return (
    <div
      onClick={() => inputRef.current?.click()}
      onDragOver={e => { e.preventDefault(); setDragging(true) }}
      onDragLeave={() => setDragging(false)}
      onDrop={onDrop}
      style={{
        border: `2px dashed ${dragging ? "var(--color-primary)" : "var(--color-border)"}`,
        borderRadius: "10px", padding: "1.5rem 1rem",
        backgroundColor: dragging ? "#FF4F0008" : "var(--color-bg-muted)",
        display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem",
        cursor: "pointer", transition: "border-color 0.15s, background 0.15s", textAlign: "center",
      }}
    >
      <UploadCloud size={26} style={{ color: dragging ? "var(--color-primary)" : "var(--color-text-muted)" }} />
      <p style={{ margin: 0, fontSize: "0.8125rem", fontWeight: 600, color: "var(--color-text)" }}>Click or drag & drop to upload</p>
      <p style={{ margin: 0, fontSize: "0.72rem", color: "var(--color-text-muted)" }}>PDF, JPG, PNG, DOCX — max 10 MB</p>
      <input ref={inputRef} type="file" accept=".pdf,.jpg,.jpeg,.png,.docx,image/*" style={{ display: "none" }} onChange={e => accept(e.target.files[0])} />
    </div>
  )
}

// ── Upload modal ───────────────────────────────────────────────────────────
function UploadModal({ request, onClose, onUploaded }) {
  const [file, setFile]           = useState(null)
  const [uploading, setUploading] = useState(false)
  const [done, setDone]           = useState(false)

  const handleUpload = async () => {
    if (!file) return
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("type", request.type)
      if (request.propertyId)     formData.append("propertyId",     request.propertyId)
      if (request.applicationId)  formData.append("applicationId",  request.applicationId)
      if (request.transactionId)  formData.append("transactionId",  request.transactionId)
      const newDoc = await documentsApi.upload(formData)
      setDone(true)
      setTimeout(() => { onUploaded(request.id, newDoc); onClose() }, 800)
    } catch {
      // error already toasted by axios interceptor
    } finally {
      setUploading(false)
    }
  }

  return (
    <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.5)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }} onClick={onClose}>
      <div style={{ backgroundColor: "#fff", borderRadius: "16px", width: "100%", maxWidth: 440, padding: "1.75rem", position: "relative" }} onClick={e => e.stopPropagation()}>
        <button onClick={onClose} style={{ position: "absolute", top: "1rem", right: "1rem", background: "none", border: "none", cursor: "pointer", color: "var(--color-text-muted)", display: "flex" }}>
          <X size={18} />
        </button>

        <p style={{ margin: "0 0 0.25rem", fontWeight: 700, fontSize: "1.0625rem", color: "var(--color-text)" }}>Upload Document</p>
        <p style={{ margin: "0 0 1.25rem", fontSize: "0.8125rem", color: "var(--color-text-muted)" }}>
          {DOCUMENT_TYPE_LABELS[request.type]} · {request.relatedLabel}
        </p>

        {done ? (
          <div style={{ textAlign: "center", padding: "1rem 0" }}>
            <CheckCircle size={36} style={{ color: "#15803D", marginBottom: "0.75rem" }} />
            <p style={{ margin: 0, fontWeight: 600, color: "var(--color-text)" }}>Uploaded successfully!</p>
          </div>
        ) : (
          <>
            <DropZone onFile={setFile} />
            {file && (
              <div style={{ display: "flex", alignItems: "center", gap: "0.65rem", marginTop: "0.875rem", padding: "0.65rem 0.875rem", backgroundColor: "var(--color-bg-muted)", borderRadius: "8px", border: "1px solid var(--color-border)" }}>
                <FileIcon mime={file.type} size={16} />
                <span style={{ flex: 1, fontSize: "0.8125rem", color: "var(--color-text)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{file.name}</span>
                <span style={{ fontSize: "0.72rem", color: "var(--color-text-muted)", flexShrink: 0 }}>{(file.size / 1024).toFixed(0)} KB</span>
                <button onClick={() => setFile(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--color-text-muted)", display: "flex", flexShrink: 0 }}><X size={14} /></button>
              </div>
            )}
            <button
              onClick={handleUpload}
              disabled={!file || uploading}
              style={{ marginTop: "1.25rem", width: "100%", padding: "0.75rem", borderRadius: "10px", border: "none", backgroundColor: "var(--color-primary)", color: "#fff", fontWeight: 700, fontSize: "0.9rem", cursor: !file || uploading ? "not-allowed" : "pointer", fontFamily: "inherit", opacity: !file || uploading ? 0.6 : 1 }}
            >
              {uploading ? "Uploading…" : "Upload"}
            </button>
          </>
        )}
      </div>
    </div>
  )
}

// ── Main shared component ──────────────────────────────────────────────────
export default function DocumentsPage() {
  const [requests, setRequests]   = useState([])
  const [uploaded, setUploaded]   = useState([])
  const [uploading, setUploading] = useState(null)
  const [tab, setTab]             = useState("REQUESTED")

  useEffect(() => {
    documentsApi.getMy().then(docs => {
      setRequests(docs.filter(d => d.status === "REQUESTED"))
      setUploaded(docs.filter(d => d.status !== "REQUESTED"))
    }).catch(() => {})
  }, [])

  const handleUploaded = (requestId, newDoc) => {
    setRequests(r => r.filter(x => x.id !== requestId))
    setUploaded(u => [newDoc, ...u])
    setUploading(null)
  }

  const pendingCount   = requests.length
  const uploadedCount  = uploaded.length

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>

      {/* Summary strip */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "1rem" }}>
        {[
          { label: "Requested",  value: pendingCount,                                                  color: "#1D4ED8" },
          { label: "Uploaded",   value: uploadedCount,                                                 color: "#15803D" },
          { label: "Verified",   value: uploaded.filter(d => d.status === "VERIFIED").length,          color: "#15803D" },
          { label: "Rejected",   value: uploaded.filter(d => d.status === "REJECTED").length,          color: "#B91C1C" },
        ].map(s => (
          <div key={s.label} style={{ backgroundColor: "var(--color-surface)", borderRadius: "12px", border: "1px solid var(--color-border)", padding: "1rem 1.25rem" }}>
            <p style={{ margin: 0, fontSize: "0.72rem", fontWeight: 600, color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>{s.label}</p>
            <p style={{ margin: "0.3rem 0 0", fontWeight: 800, fontSize: "1.5rem", color: s.color, letterSpacing: "-0.02em" }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: "0.5rem" }}>
        {[["REQUESTED", `Requested (${pendingCount})`], ["UPLOADED", `Uploaded (${uploadedCount})`]].map(([key, label]) => (
          <button key={key} onClick={() => setTab(key)} style={{
            padding: "0.4rem 1.1rem", borderRadius: "999px", border: "1px solid",
            borderColor: tab === key ? "var(--color-primary)" : "var(--color-border)",
            backgroundColor: tab === key ? "var(--color-primary)" : "#fff",
            color: tab === key ? "#fff" : "var(--color-text-muted)",
            fontWeight: 600, fontSize: "0.8rem", cursor: "pointer", fontFamily: "inherit",
          }}>{label}</button>
        ))}
      </div>

      {/* Requested documents */}
      {tab === "REQUESTED" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>
          {requests.length === 0 ? (
            <div style={{ backgroundColor: "var(--color-surface)", borderRadius: "14px", border: "1px solid var(--color-border)", padding: "3rem", textAlign: "center" }}>
              <CheckCircle size={32} style={{ color: "#15803D", marginBottom: "0.75rem" }} />
              <p style={{ margin: 0, fontWeight: 600, color: "var(--color-text)" }}>All documents submitted!</p>
              <p style={{ margin: "0.4rem 0 0", fontSize: "0.875rem", color: "var(--color-text-muted)" }}>No pending document requests.</p>
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
                onClick={() => setUploading(req)}
                style={{ padding: "0.5rem 1.1rem", borderRadius: "8px", border: "none", backgroundColor: "var(--color-primary)", color: "#fff", fontWeight: 600, fontSize: "0.8125rem", cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", gap: "0.4rem", flexShrink: 0 }}
              >
                <UploadCloud size={14} /> Upload
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Uploaded documents */}
      {tab === "UPLOADED" && (
        <div style={{ backgroundColor: "var(--color-surface)", borderRadius: "14px", border: "1px solid var(--color-border)", overflow: "hidden" }}>
          {uploaded.length === 0 ? (
            <div style={{ padding: "3rem", textAlign: "center", color: "var(--color-text-muted)", fontSize: "0.875rem" }}>No documents uploaded yet.</div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.8375rem" }}>
                <thead>
                  <tr style={{ backgroundColor: "var(--color-bg-muted)", borderBottom: "1px solid var(--color-border)" }}>
                    {["Document", "Type", "Related To", "Uploaded", "Status"].map(h => (
                      <th key={h} style={{ padding: "0.65rem 1.25rem", textAlign: "left", fontWeight: 600, fontSize: "0.72rem", color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: "0.04em", whiteSpace: "nowrap" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {uploaded.map((d, i) => (
                    <tr key={d.id} style={{ borderBottom: i < uploaded.length - 1 ? "1px solid var(--color-border)" : "none" }}>
                      <td style={TD}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                          <div style={{ width: 32, height: 32, borderRadius: "7px", backgroundColor: "var(--color-bg-muted)", border: "1px solid var(--color-border)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                            <FileIcon mime={d.mime} size={15} />
                          </div>
                          <span style={{ fontWeight: 500, color: "var(--color-text)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 200 }}>{d.name}</span>
                        </div>
                      </td>
                      <td style={TD}>{DOCUMENT_TYPE_LABELS[d.type] ?? d.type}</td>
                      <td style={TD}>{d.relatedLabel}</td>
                      <td style={{ ...TD, whiteSpace: "nowrap" }}>{d.uploadedAt}</td>
                      <td style={TD}><StatusBadge status={d.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Upload modal */}
      {uploading && <UploadModal request={uploading} onClose={() => setUploading(null)} onUploaded={handleUploaded} />}
    </div>
  )
}

const TD = { padding: "0.75rem 1.25rem", color: "var(--color-text-muted)", verticalAlign: "middle" }
