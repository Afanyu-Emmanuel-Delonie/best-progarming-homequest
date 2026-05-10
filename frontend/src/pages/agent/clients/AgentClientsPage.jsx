import { useState, useMemo, useEffect } from "react"
import { Eye, FileText, Loader2, X, Plus } from "lucide-react"
import DataTable from "../../../components/shared/DataTable"
import { StatCard, Toolbar, ClearBtn, Badge, ActionsMenu } from "../../../components/shared/AdminUI"
import DetailsDrawer from "../../../components/shared/DetailsDrawer"
import { fmtDate, fmtCurrency } from "../../../utils/formatters"
import { APPLICATION_STATUS, DOCUMENT_TYPE_LABELS, avatarColor, initials, PAGE_SIZE } from "../../../constants/enums"
import { useFilterPanel } from "../../../hooks/useFilterPanel"
import { useTableData } from "../../../hooks/useTableData"
import { clientsApi, usersApi } from "../../../api/users.api"
import { useSelector } from "react-redux"
import { applicationsApi } from "../../../api/applications.api"
import { documentsApi } from "../../../api/documents.api"
import { toast } from "react-toastify"

const inp = { padding: "0.55rem 0.85rem", borderRadius: "8px", border: "1px solid var(--color-border)", backgroundColor: "var(--color-bg-muted)", fontSize: "0.875rem", color: "var(--color-text)", outline: "none", fontFamily: "inherit", width: "100%", boxSizing: "border-box" }
const lbl = { fontSize: "0.72rem", fontWeight: 600, color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: "0.04em", display: "block", marginBottom: "0.3rem" }

function RequestDocModal({ client, applications, onClose, onRequested }) {
  const [form, setForm]   = useState({ type: "ID_DOCUMENT", applicationId: applications[0]?.id ?? "", note: "" })
  const [loading, setLoading] = useState(false)

  const submit = async () => {
    setLoading(true)
    try {
      onRequested({
        id:           Date.now(),
        type:         form.type,
        relatedLabel: form.applicationId
          ? `Application #${form.applicationId} — ${client.firstName} ${client.lastName}`
          : `Client: ${client.firstName} ${client.lastName}`,
        requestedAt:  new Date().toISOString().split("T")[0],
        note:         form.note,
        status:       "REQUESTED",
      })
      toast.success("Document request sent")
      onClose()
    } catch {
      toast.error("Failed to send request")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, backgroundColor: "#00000050", zIndex: 90 }} />
      <div style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: "min(440px, calc(100vw - 2rem))", backgroundColor: "var(--color-surface)", borderRadius: "16px", boxShadow: "0 24px 64px #00000030", zIndex: 100, overflow: "hidden" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1.25rem 1.5rem", borderBottom: "1px solid var(--color-border)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.65rem" }}>
            <div style={{ width: 36, height: 36, borderRadius: "9px", backgroundColor: "#EFF6FF", color: "#1D4ED8", display: "flex", alignItems: "center", justifyContent: "center" }}><FileText size={17} /></div>
            <div>
              <p style={{ margin: 0, fontWeight: 700, fontSize: "0.9375rem", color: "var(--color-text)" }}>Request Document</p>
              <p style={{ margin: 0, fontSize: "0.75rem", color: "var(--color-text-muted)" }}>{client.firstName} {client.lastName}</p>
            </div>
          </div>
          <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: "7px", border: "1px solid var(--color-border)", background: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--color-text-muted)" }}><X size={15} /></button>
        </div>
        <div style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div>
            <label style={lbl}>Document Type</label>
            <select style={inp} value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}>
              {Object.entries(DOCUMENT_TYPE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
          </div>
          {applications.length > 0 && (
            <div>
              <label style={lbl}>Related Application</label>
              <select style={inp} value={form.applicationId} onChange={e => setForm(f => ({ ...f, applicationId: e.target.value }))}>
                <option value="">— None —</option>
                {applications.map(a => (
                  <option key={a.id} value={a.id}>#{a.id} · Property #{a.propertyId} · {fmtCurrency(Number(a.offerAmount))}</option>
                ))}
              </select>
            </div>
          )}
          <div>
            <label style={lbl}>Note <span style={{ fontWeight: 400, textTransform: "none" }}>(optional)</span></label>
            <textarea style={{ ...inp, resize: "vertical", minHeight: 60 }} value={form.note} onChange={e => setForm(f => ({ ...f, note: e.target.value }))} placeholder="e.g. Please upload a clear copy of your national ID." />
          </div>
        </div>
        <div style={{ display: "flex", gap: "0.65rem", justifyContent: "flex-end", padding: "1rem 1.5rem", borderTop: "1px solid var(--color-border)" }}>
          <button onClick={onClose} style={{ padding: "0.55rem 1.1rem", borderRadius: "9px", border: "1px solid var(--color-border)", background: "none", color: "var(--color-text-muted)", fontWeight: 500, fontSize: "0.8375rem", cursor: "pointer", fontFamily: "inherit" }}>Cancel</button>
          <button onClick={submit} disabled={loading} style={{ display: "flex", alignItems: "center", gap: "0.4rem", padding: "0.55rem 1.25rem", borderRadius: "9px", border: "none", backgroundColor: "#1D4ED8", color: "#fff", fontWeight: 600, fontSize: "0.8375rem", cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.75 : 1, fontFamily: "inherit" }}>
            {loading ? <Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} /> : <FileText size={14} />}
            {loading ? "Sending…" : "Send Request"}
          </button>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
      </div>
    </>
  )
}

export default function AgentClientsPage() {
  const [clients, setClients]         = useState([])
  const [loading, setLoading]         = useState(true)
  const [search, setSearch]           = useState("")
  const [selected, setSelected]       = useState(null)
  const [selApps, setSelApps]         = useState([])
  const [selDocs, setSelDocs]         = useState([])
  const [appsLoading, setAppsLoading] = useState(false)
  const [showRequest, setShowRequest] = useState(false)
  const [docRequests, setDocRequests] = useState([])
  const { filterRef, filterOpen, setFilterOpen } = useFilterPanel()

  const authUser = useSelector(s => s.auth.user)

  useEffect(() => {
    // Get agent profile to resolve companyId, then fetch that company's clients
    usersApi.getAgentByPublicId(authUser?.publicId)
      .then(agent => {
        if (!agent?.companyId) return []
        return clientsApi.getByCompany(agent.companyId)
      })
      .then(res => setClients(Array.isArray(res) ? res : res.content ?? []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  // Load applications + documents when a client is selected
  useEffect(() => {
    if (!selected) { setSelApps([]); setSelDocs([]); return }
    setAppsLoading(true)
    Promise.all([
      applicationsApi.getMyListings({ page: 0, size: 100 }),
      documentsApi.getByUploader(selected.userPublicId).catch(() => []),
    ]).then(([appsRes, docs]) => {
      const apps = appsRes.content ?? appsRes ?? []
      setSelApps(apps.filter(a => a.buyerPublicId === selected.userPublicId))
      setSelDocs(Array.isArray(docs) ? docs : [])
    }).catch(() => {}).finally(() => setAppsLoading(false))
  }, [selected])

  const filters = { search }
  const filterFn = (c, { search }) => {
    if (!search.trim()) return true
    const q = search.toLowerCase()
    return `${c.firstName} ${c.lastName}`.toLowerCase().includes(q) || (c.phone ?? "").includes(q)
  }

  const { filtered, pageRows, sortKey, sortDir, handleSort, page, setPage, totalPages } =
    useTableData(clients, filterFn, filters)

  const displayName = (c) => `${c.firstName} ${c.lastName}`

  const pendingRequestsForSelected = useMemo(() =>
    selected ? docRequests.filter(r => r.relatedLabel?.includes(displayName(selected))) : []
  , [docRequests, selected])

  const columns = [
    { key: "firstName", label: "Client", render: (_, c) => (
      <div style={{ display: "flex", alignItems: "center", gap: "0.65rem" }}>
        <div style={{ width: 34, height: 34, borderRadius: "50%", backgroundColor: avatarColor(c.id ?? 0), color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.75rem", fontWeight: 700, flexShrink: 0 }}>
          {initials(c)}
        </div>
        <div>
          <p style={{ margin: 0, fontWeight: 500, color: "var(--color-text)" }}>{displayName(c)}</p>
          <p style={{ margin: 0, fontSize: "0.75rem", color: "var(--color-text-muted)" }}>{c.phone ?? "—"}</p>
        </div>
      </div>
    )},
    { key: "createdAt", label: "Joined", render: (v) => v ? fmtDate(v) : "—" },
    { key: null, label: "Actions", render: (_, c) => (
      <ActionsMenu items={[
        { label: "View Details",     icon: <Eye size={14} />,      onClick: () => { setSelected(c); setShowRequest(false) } },
        { label: "Request Document", icon: <FileText size={14} />, onClick: () => { setSelected(c); setShowRequest(true) }, dividerBefore: true },
      ]} />
    )},
  ]

  if (loading) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "60vh", gap: "0.75rem", color: "var(--color-text-muted)" }}>
      <Loader2 size={20} style={{ animation: "spin 1s linear infinite" }} /> Loading clients…
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>

      <p style={{ margin: 0, fontWeight: 700, fontSize: "1.1rem", color: "var(--color-text)" }}>My Clients</p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "1rem" }}>
        <StatCard label="Total Clients"      value={clients.length}      color="var(--color-primary)" />
        <StatCard label="Doc Requests Sent"  value={docRequests.length}  color="#1D4ED8" />
      </div>

      <Toolbar search={search} onSearch={setSearch} placeholder="Search name, phone…" filterRef={filterRef} filterOpen={filterOpen} setFilterOpen={setFilterOpen} activeFilters={0}>
        {null}
      </Toolbar>

      <DataTable columns={columns} rows={pageRows} total={filtered.length} emptyMsg="No clients found"
        sortKey={sortKey} sortDir={sortDir} onSort={handleSort}
        page={page} totalPages={totalPages} totalElements={filtered.length}
        pageSize={PAGE_SIZE} onPageChange={setPage} />

      {/* Details drawer */}
      <DetailsDrawer
        open={!!selected && !showRequest}
        onClose={() => setSelected(null)}
        title={selected ? displayName(selected) : ""}
        subtitle={selected?.phone ?? ""}
        profile={selected ? [
          { label: "Applications", value: appsLoading ? "…" : String(selApps.length), color: "var(--color-primary)" },
          { label: "Documents",    value: appsLoading ? "…" : String(selDocs.length),  color: "#1D4ED8" },
          { label: "Requests",     value: String(pendingRequestsForSelected.length),    color: "#C2410C" },
        ] : []}
        sections={selected ? [
          { heading: "Profile", rows: [
            { label: "Full Name", value: displayName(selected) },
            { label: "Phone",     value: selected.phone ?? "—" },
            { label: "Joined",    value: selected.createdAt ? fmtDate(selected.createdAt) : "—" },
          ]},
          ...(selApps.length > 0 ? [{
            heading: "Applications",
            rows: selApps.slice(0, 5).map(a => ({
              label: `#${a.id} · Property #${a.propertyId}`,
              value: (() => {
                const s = APPLICATION_STATUS[a.status]
                return s ? <Badge bg={s.bg} color={s.color} label={s.label} /> : a.status
              })(),
            })),
          }] : []),
          ...(selDocs.length > 0 ? [{
            heading: "Documents",
            rows: selDocs.slice(0, 5).map(d => ({
              label: d.name ?? `Doc #${d.id}`,
              value: d.status ?? "—",
            })),
          }] : []),
          ...(pendingRequestsForSelected.length > 0 ? [{
            heading: "Pending Requests",
            rows: pendingRequestsForSelected.map(r => ({
              label: DOCUMENT_TYPE_LABELS[r.type] ?? r.type,
              value: r.requestedAt,
            })),
          }] : []),
        ] : []}
        footer={selected && (
          <button
            onClick={() => setShowRequest(true)}
            style={{ display: "flex", alignItems: "center", gap: "0.4rem", padding: "0.5rem 1rem", borderRadius: "8px", border: "none", backgroundColor: "#1D4ED8", color: "#fff", fontWeight: 600, fontSize: "0.8125rem", cursor: "pointer", fontFamily: "inherit" }}
          >
            <Plus size={14} /> Request Document
          </button>
        )}
      />

      {showRequest && selected && (
        <RequestDocModal
          client={selected}
          applications={selApps}
          onClose={() => setShowRequest(false)}
          onRequested={(req) => {
            setDocRequests(prev => [req, ...prev])
            setShowRequest(false)
          }}
        />
      )}
    </div>
  )
}
