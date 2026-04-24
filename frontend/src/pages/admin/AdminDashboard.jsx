import { useEffect, useState } from "react"
import { Home, FileText, DollarSign, Clock, ArrowRight, UserPlus, X, Plus, Loader2 } from "lucide-react"
import { fmtCurrency } from "../../utils/formatters"
import KpiCard from "../../components/shared/KpiCard"
import { APPLICATION_STATUS, TRANSACTION_STATUS, PROPERTY_STATUS } from "../../constants/enums"
import ListingFormModal from "../../components/shared/ListingFormModal"
import { propertiesApi } from "../../api/properties.api"
import { applicationsApi } from "../../api/applications.api"
import { transactionsApi } from "../../api/transactions.api"

const STATUS_STYLES = { ...PROPERTY_STATUS, ...APPLICATION_STATUS, ...TRANSACTION_STATUS }

const TYPE_META = {
  PROPERTY:    { bg: "#EFF6FF", color: "#1D4ED8", dot: "#1D4ED8" },
  APPLICATION: { bg: "#FFF7ED", color: "#C2410C", dot: "#C2410C" },
  TRANSACTION: { bg: "#F0FDF4", color: "#15803D", dot: "#15803D" },
}

export default function AdminDashboard() {
  const [properties,   setProperties]   = useState([])
  const [applications, setApplications] = useState([])
  const [transactions, setTransactions] = useState([])
  const [loading,      setLoading]      = useState(true)
  const [activeKpi,    setActiveKpi]    = useState(0)
  const [newListing,   setNewListing]   = useState(false)
  const [newAgent,     setNewAgent]     = useState(false)
  const [agentForm,    setAgentForm]    = useState({ firstName: "", lastName: "", email: "", phone: "", license: "", company: "" })

  useEffect(() => {
    Promise.all([
      propertiesApi.getAll({ page: 0, size: 100 }),
      applicationsApi.getAll({ page: 0, size: 100 }),
      transactionsApi.getAllForAdmin(),
    ]).then(([p, a, t]) => {
      setProperties(p.content   ?? p ?? [])
      setApplications(a.content ?? a ?? [])
      setTransactions(Array.isArray(t) ? t : [])
    }).catch(() => {}).finally(() => setLoading(false))
  }, [])

  // ── Derived KPIs ──────────────────────────────────────────────────────────
  const totalRevenue   = transactions.filter(t => t.status === "COMPLETED").reduce((s, t) => s + Number(t.saleAmount ?? 0), 0)
  const activeProps    = properties.filter(p => p.status !== "INACTIVE").length
  const pendingActions = applications.filter(a => a.status === "PENDING").length
  const completedTx    = transactions.filter(t => t.status === "COMPLETED").length

  const KPIS = [
    { label: "Total Revenue",      value: fmtCurrency(totalRevenue), sub: `${completedTx} completed deals`,    up: true,  icon: <DollarSign size={18} />, accent: "#FF4F00" },
    { label: "Active Properties",  value: String(activeProps),       sub: `${properties.filter(p=>p.status==="AVAILABLE").length} available`, up: true, icon: <Home size={18} />, accent: "#1D4ED8" },
    { label: "Applications",       value: String(applications.length), sub: `${pendingActions} pending review`, up: pendingActions === 0, icon: <FileText size={18} />, accent: "#6D28D9" },
    { label: "Pending Actions",    value: String(pendingActions),    sub: "awaiting review",                   up: false, icon: <Clock size={18} />,      accent: "#C2410C" },
  ]

  // ── Recent activity feed (last 8 across all types) ────────────────────────
  const feed = [
    ...properties.slice(0, 4).map(p => ({
      id:      `p-${p.id}`,
      type:    "PROPERTY",
      action:  "Property listed",
      subject: p.title,
      detail:  `${p.city} · ${fmtCurrency(Number(p.price))}`,
      time:    p.createdAt ? new Date(p.createdAt).toLocaleDateString() : "—",
      status:  p.status,
    })),
    ...applications.slice(0, 4).map(a => ({
      id:      `a-${a.id}`,
      type:    "APPLICATION",
      action:  "Bid submitted",
      subject: a.buyerFullName,
      detail:  `${fmtCurrency(Number(a.offerAmount))} on property #${a.propertyId}`,
      time:    a.createdAt ? new Date(a.createdAt).toLocaleDateString() : "—",
      status:  a.status,
    })),
    ...transactions.slice(0, 4).map(t => ({
      id:      `t-${t.id}`,
      type:    "TRANSACTION",
      action:  "Transaction",
      subject: `Property #${t.propertyId}`,
      detail:  fmtCurrency(Number(t.saleAmount)),
      time:    t.createdAt ? new Date(t.createdAt).toLocaleDateString() : "—",
      status:  t.status,
    })),
  ].slice(0, 8)

  // ── Top properties by price ───────────────────────────────────────────────
  const topProperties = [...properties].sort((a, b) => Number(b.price) - Number(a.price)).slice(0, 4)

  // ── Applications breakdown ────────────────────────────────────────────────
  const appTotal    = applications.length || 1
  const appPending  = applications.filter(a => a.status === "PENDING").length
  const appAccepted = applications.filter(a => a.status === "ACCEPTED").length
  const appRejected = applications.filter(a => a.status === "REJECTED").length
  const appOther    = applications.length - appPending - appAccepted - appRejected

  if (loading) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "60vh", gap: "0.75rem", color: "var(--color-text-muted)" }}>
      <Loader2 size={20} style={{ animation: "spin 1s linear infinite" }} /> Loading dashboard…
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>

      {/* Action bar */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.75rem" }}>
        <div>
          <p style={{ margin: 0, fontWeight: 700, fontSize: "1.25rem", color: "var(--color-text)" }}>Dashboard</p>
          <p style={{ margin: "2px 0 0", fontSize: "0.8rem", color: "var(--color-text-muted)" }}>Welcome back — here's what's happening today.</p>
        </div>
        <div style={{ display: "flex", gap: "0.65rem", flexWrap: "wrap" }}>
          <button onClick={() => setNewListing(true)} style={outlineBtn}>
            <Plus size={15} /> New Listing
          </button>
          <button onClick={() => setNewAgent(true)} style={primaryBtn}>
            <UserPlus size={15} /> New Agent
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
        {KPIS.map((k, i) => (
          <KpiCard key={k.label} {...k} active={activeKpi === i} onClick={() => setActiveKpi(i)} />
        ))}
      </div>

      {/* Recent activity + top properties */}
      <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,300px)", gap: "1rem", alignItems: "start" }} className="dash-grid">

        {/* Activity table */}
        <div style={{ backgroundColor: "var(--color-surface)", borderRadius: "14px", border: "1px solid var(--color-border)", overflow: "hidden" }}>
          <div style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid var(--color-border)" }}>
            <p style={T}>Recent Activity</p>
            <p style={S}>Latest events across the platform</p>
          </div>
          {feed.length === 0 ? (
            <p style={{ padding: "2rem", textAlign: "center", color: "var(--color-text-muted)", fontSize: "0.875rem" }}>No activity yet</p>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.8375rem" }}>
                <thead>
                  <tr style={{ backgroundColor: "var(--color-bg-muted)", borderBottom: "1px solid var(--color-border)" }}>
                    {["Type", "Action", "Subject", "Detail", "Date", "Status"].map(h => (
                      <th key={h} style={{ padding: "0.65rem 1.25rem", textAlign: "left", fontWeight: 600, fontSize: "0.72rem", color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: "0.04em", whiteSpace: "nowrap" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {feed.map((a, i) => {
                    const m  = TYPE_META[a.type]
                    const st = STATUS_STYLES[a.status]
                    return (
                      <tr key={a.id} style={{ borderBottom: i < feed.length - 1 ? "1px solid var(--color-border)" : "none", backgroundColor: i % 2 !== 0 ? "var(--color-bg-subtle)" : "transparent" }}>
                        <td style={TD}>
                          <span style={{ fontSize: "0.72rem", fontWeight: 600, color: m.color, backgroundColor: m.bg, padding: "2px 8px", borderRadius: "999px" }}>{a.type}</span>
                        </td>
                        <td style={TD}><span style={{ fontWeight: 500, color: "var(--color-text)", whiteSpace: "nowrap" }}>{a.action}</span></td>
                        <td style={{ ...TD, whiteSpace: "nowrap" }}>{a.subject}</td>
                        <td style={{ ...TD, color: "var(--color-text-subtle)", maxWidth: 160, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{a.detail}</td>
                        <td style={{ ...TD, whiteSpace: "nowrap", color: "var(--color-text-subtle)" }}>{a.time}</td>
                        <td style={TD}>
                          {st && <span style={{ backgroundColor: st.bg, color: st.color, borderRadius: "999px", padding: "2px 10px", fontSize: "0.72rem", fontWeight: 600, whiteSpace: "nowrap" }}>{st.label}</span>}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Right sidebar */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>

          {/* Top properties */}
          <div style={{ backgroundColor: "var(--color-surface)", borderRadius: "14px", border: "1px solid var(--color-border)", padding: "1.25rem 1.5rem" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
              <p style={T}>Top Properties</p>
              <a href="/admin/properties" style={{ display: "flex", alignItems: "center", gap: "0.25rem", fontSize: "0.75rem", color: "var(--color-primary)", textDecoration: "none", fontWeight: 600 }}>
                All <ArrowRight size={12} />
              </a>
            </div>
            {topProperties.length === 0 ? (
              <p style={{ fontSize: "0.8rem", color: "var(--color-text-muted)" }}>No properties yet</p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {topProperties.map(p => {
                  const st = PROPERTY_STATUS[p.status]
                  return (
                    <div key={p.id} style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                      <div style={{ width: 44, height: 44, borderRadius: "9px", backgroundColor: "var(--color-bg-muted)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.25rem", flexShrink: 0 }}>🏠</div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ margin: 0, fontWeight: 600, fontSize: "0.8rem", color: "var(--color-text)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.title}</p>
                        <p style={{ margin: "1px 0 0", fontSize: "0.72rem", color: "var(--color-text-muted)" }}>{p.city}</p>
                      </div>
                      <div style={{ textAlign: "right", flexShrink: 0 }}>
                        <p style={{ margin: 0, fontWeight: 700, fontSize: "0.8rem", color: "var(--color-text)" }}>{fmtCurrency(Number(p.price))}</p>
                        {st && <span style={{ backgroundColor: st.bg, color: st.color, borderRadius: "999px", padding: "1px 7px", fontSize: "0.65rem", fontWeight: 600 }}>{st.label}</span>}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Applications breakdown */}
          <div style={{ backgroundColor: "var(--color-surface)", borderRadius: "14px", border: "1px solid var(--color-border)", padding: "1.25rem 1.5rem" }}>
            <p style={{ ...T, marginBottom: "1rem" }}>Applications</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
              <PRow label="Pending"  value={appPending}  total={appTotal} color="#C2410C" />
              <PRow label="Accepted" value={appAccepted} total={appTotal} color="#15803D" />
              <PRow label="Rejected" value={appRejected} total={appTotal} color="#B91C1C" />
              <PRow label="Other"    value={appOther}    total={appTotal} color="#9E9E9E" />
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {newListing && (
        <ListingFormModal
          onClose={() => setNewListing(false)}
          onSubmit={(created) => {
            setProperties(prev => [created, ...prev])
            setNewListing(false)
          }}
        />
      )}
      {newAgent && (
        <NewAgentModal form={agentForm} setForm={setAgentForm}
          onClose={() => setNewAgent(false)}
          onSubmit={() => { setNewAgent(false); setAgentForm({ firstName: "", lastName: "", email: "", phone: "", license: "", company: "" }) }}
        />
      )}
    </div>
  )
}

// ── Styles ────────────────────────────────────────────────────────────────
const T  = { margin: 0, fontWeight: 700, fontSize: "0.9375rem", color: "var(--color-text)" }
const S  = { margin: "2px 0 0", fontSize: "0.75rem", color: "var(--color-text-muted)" }
const TD = { padding: "0.75rem 1.25rem", color: "var(--color-text-muted)", verticalAlign: "middle" }

const outlineBtn = { display: "flex", alignItems: "center", gap: "0.45rem", padding: "0.55rem 1.1rem", borderRadius: "9px", border: "1px solid var(--color-border)", backgroundColor: "var(--color-surface)", color: "var(--color-text)", fontWeight: 600, fontSize: "0.8375rem", cursor: "pointer", fontFamily: "inherit" }
const primaryBtn = { display: "flex", alignItems: "center", gap: "0.45rem", padding: "0.55rem 1.1rem", borderRadius: "9px", border: "none", backgroundColor: "var(--color-primary)", color: "#fff", fontWeight: 600, fontSize: "0.8375rem", cursor: "pointer", fontFamily: "inherit" }

function PRow({ label, value, total, color }) {
  const pct = Math.round((value / total) * 100)
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.25rem" }}>
        <span style={{ fontSize: "0.78rem", color: "var(--color-text-muted)", fontWeight: 500 }}>{label}</span>
        <span style={{ fontSize: "0.78rem", fontWeight: 700, color }}>{value} <span style={{ color: "var(--color-text-subtle)", fontWeight: 400 }}>({pct}%)</span></span>
      </div>
      <div style={{ height: 5, backgroundColor: "var(--color-bg-muted)", borderRadius: "999px", overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${pct}%`, backgroundColor: color, borderRadius: "999px" }} />
      </div>
    </div>
  )
}

function Field({ label, value, onChange, placeholder, type = "text" }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
      <label style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: "0.04em" }}>{label}</label>
      <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        style={{ padding: "0.55rem 0.85rem", borderRadius: "8px", border: "1px solid var(--color-border)", backgroundColor: "var(--color-bg-muted)", fontSize: "0.875rem", color: "var(--color-text)", outline: "none", fontFamily: "inherit", width: "100%", boxSizing: "border-box" }} />
    </div>
  )
}

function NewAgentModal({ form, setForm, onClose, onSubmit }) {
  return (
    <>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, backgroundColor: "#00000050", zIndex: 80 }} />
      <div style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: "min(480px, calc(100vw - 2rem))", backgroundColor: "var(--color-surface)", borderRadius: "16px", boxShadow: "0 24px 64px #00000030", zIndex: 90, overflow: "hidden" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1.25rem 1.5rem", borderBottom: "1px solid var(--color-border)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.65rem" }}>
            <div style={{ width: 36, height: 36, borderRadius: "9px", backgroundColor: "#FF4F0015", color: "var(--color-primary)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <UserPlus size={17} />
            </div>
            <div>
              <p style={{ margin: 0, fontWeight: 700, fontSize: "0.9375rem", color: "var(--color-text)" }}>New Agent</p>
              <p style={{ margin: 0, fontSize: "0.75rem", color: "var(--color-text-muted)" }}>Create a new agent account</p>
            </div>
          </div>
          <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: "7px", border: "1px solid var(--color-border)", background: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--color-text-muted)" }}>
            <X size={15} />
          </button>
        </div>
        <div style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
            <Field label="First Name" value={form.firstName} onChange={v => setForm(f => ({ ...f, firstName: v }))} placeholder="Sarah" />
            <Field label="Last Name"  value={form.lastName}  onChange={v => setForm(f => ({ ...f, lastName: v }))}  placeholder="Johnson" />
          </div>
          <Field label="Email" value={form.email} onChange={v => setForm(f => ({ ...f, email: v }))} placeholder="sarah@example.com" type="email" />
          <Field label="Phone" value={form.phone} onChange={v => setForm(f => ({ ...f, phone: v }))} placeholder="+250 7XX XXX XXX" />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
            <Field label="License No." value={form.license} onChange={v => setForm(f => ({ ...f, license: v }))} placeholder="LIC-001" />
            <Field label="Company ID"  value={form.company} onChange={v => setForm(f => ({ ...f, company: v }))} placeholder="1" />
          </div>
        </div>
        <div style={{ display: "flex", gap: "0.65rem", justifyContent: "flex-end", padding: "1rem 1.5rem", borderTop: "1px solid var(--color-border)" }}>
          <button onClick={onClose} style={{ ...outlineBtn }}>Cancel</button>
          <button onClick={onSubmit} style={{ ...primaryBtn }}>Create Agent</button>
        </div>
      </div>
    </>
  )
}
