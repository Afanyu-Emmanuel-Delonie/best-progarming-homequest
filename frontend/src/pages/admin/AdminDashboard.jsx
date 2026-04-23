import { useState } from "react"
import { Users, Home, FileText, DollarSign, Clock, ArrowRight, Download, UserPlus, X, Plus } from "lucide-react"
import { fmtCurrency } from "../../utils/formatters"
import KpiCard from "../../components/shared/KpiCard"
import { PROPERTY_STATUS, APPLICATION_STATUS, TRANSACTION_STATUS, USER_STATUS } from "../../constants/enums"
import ListingFormModal from "../../components/shared/ListingFormModal"

const MONTHLY = [
  { month: "Feb", revenue: 1820000, applications: 12, transactions: 4 },
  { month: "Mar", revenue: 2450000, applications: 18, transactions: 6 },
  { month: "Apr", revenue: 1980000, applications: 14, transactions: 5 },
  { month: "May", revenue: 3100000, applications: 22, transactions: 8 },
  { month: "Jun", revenue: 2760000, applications: 19, transactions: 7 },
  { month: "Jul", revenue: 4230000, applications: 31, transactions: 11 },
]

const LIVE_ACTIVITY = [
  { id: 1, type: "APPLICATION", action: "New bid submitted",     subject: "Fatima Al-Hassan", time: "2m ago",  status: "PENDING"   },
  { id: 2, type: "TRANSACTION", action: "Transaction completed", subject: "Property #102",    time: "18m ago", status: "COMPLETED" },
  { id: 3, type: "USER",        action: "New agent registered",  subject: "Aisha Malik",      time: "1h ago",  status: "PENDING"   },
  { id: 4, type: "APPLICATION", action: "Bid accepted",          subject: "Marcus Lee",       time: "2h ago",  status: "ACCEPTED"  },
  { id: 5, type: "DOCUMENT",    action: "Document needs review", subject: "Mortgage Approval",time: "3h ago",  status: "PENDING"   },
]

const RECENT_ACTIVITY = [
  { id: 1, type: "APPLICATION", action: "New bid submitted",     subject: "Fatima Al-Hassan", detail: "RWF 2.1M on Mega Mansion",  time: "2m ago",  status: "PENDING"   },
  { id: 2, type: "TRANSACTION", action: "Transaction completed", subject: "Property #102",    detail: "Sale — RWF 920K",           time: "18m ago", status: "COMPLETED" },
  { id: 3, type: "USER",        action: "New agent registered",  subject: "Aisha Malik",      detail: "Pending verification",      time: "1h ago",  status: "PENDING"   },
  { id: 4, type: "APPLICATION", action: "Bid accepted",          subject: "Marcus Lee",       detail: "RWF 920K on Luxury Villa",  time: "2h ago",  status: "ACCEPTED"  },
  { id: 5, type: "DOCUMENT",    action: "Document needs review", subject: "Mortgage Approval",detail: "Uploaded by client-01",     time: "3h ago",  status: "PENDING"   },
  { id: 6, type: "TRANSACTION", action: "Transaction completed", subject: "Property #106",    detail: "Sale — RWF 780K",           time: "5h ago",  status: "COMPLETED" },
  { id: 7, type: "APPLICATION", action: "Bid rejected",          subject: "David Okafor",     detail: "RWF 470K on Downtown Apt",  time: "6h ago",  status: "REJECTED"  },
  { id: 8, type: "USER",        action: "User suspended",        subject: "Andre Dupont",     detail: "Policy violation",          time: "1d ago",  status: "SUSPENDED" },
]

const TOP_PROPERTIES = [
  { id: 108, title: "Mega Mansion Estate",       price: 2100000, status: "SOLD",        city: "Beverly Hills", image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=200&q=70" },
  { id: 104, title: "Penthouse with City Views", price: 1250000, status: "UNDER_OFFER", city: "Miami",         image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=200&q=70" },
  { id: 102, title: "Luxury Suburban Villa",     price: 920000,  status: "SOLD",        city: "Los Angeles",   image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=200&q=70" },
  { id: 106, title: "Family House in Suburbs",   price: 780000,  status: "AVAILABLE",   city: "Phoenix",       image: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=200&q=70" },
]

const STATUS_STYLES = {
  ...PROPERTY_STATUS,
  ...APPLICATION_STATUS,
  ...TRANSACTION_STATUS,
  ...USER_STATUS,
}

const TYPE_META = {
  APPLICATION: { bg: "#FFF7ED", color: "#C2410C", dot: "#C2410C" },
  TRANSACTION: { bg: "#EFF6FF", color: "#1D4ED8", dot: "#1D4ED8" },
  USER:        { bg: "#F5F3FF", color: "#6D28D9", dot: "#6D28D9" },
  DOCUMENT:    { bg: "#F0FDF4", color: "#15803D", dot: "#15803D" },
}

const TYPE_ICON = {
  APPLICATION: <FileText size={13} />,
  TRANSACTION: <DollarSign size={13} />,
  USER:        <Users size={13} />,
  DOCUMENT:    <FileText size={13} />,
}

const KPIS = [
  { label: "Monthly Revenue",   value: fmtCurrency(4230000), sub: "+53.3% vs Jun",          up: true,  icon: <DollarSign size={18} />, accent: "#FF4F00" },
  { label: "Active Properties", value: "10",                 sub: "4 available · 2 offers", up: true,  icon: <Home size={18} />,       accent: "#1D4ED8" },
  { label: "Total Users",       value: "15",                 sub: "5 agents · 4 clients",   up: true,  icon: <Users size={18} />,      accent: "#6D28D9" },
  { label: "Pending Actions",   value: "7",                  sub: "4 bids · 3 documents",   up: false, icon: <Clock size={18} />,      accent: "#C2410C" },
]

export default function AdminDashboard() {
  const [activeKpi, setActiveKpi]     = useState(0)
  const [newAgent, setNewAgent]       = useState(false)
  const [newListing, setNewListing]   = useState(false)
  const [agentForm, setAgentForm]     = useState({ firstName: "", lastName: "", email: "", phone: "", license: "", company: "" })
  const maxRev = Math.max(...MONTHLY.map(m => m.revenue))
  const maxApp = Math.max(...MONTHLY.map(m => m.applications))

  const handleReport = () => {
    const rows = [
      ["Month", "Revenue (RWF)", "Applications", "Transactions"],
      ...MONTHLY.map(m => [m.month, m.revenue, m.applications, m.transactions])
    ]
    const csv  = rows.map(r => r.join(",")).join("\n")
    const blob = new Blob([csv], { type: "text/csv" })
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement("a")
    a.href = url; a.download = "homequest-report.csv"; a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>

      {/* Action bar */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.75rem" }}>
        <div>
          <p style={{ margin: 0, fontWeight: 700, fontSize: "1.25rem", color: "var(--color-text)" }}>Dashboard</p>
          <p style={{ margin: "2px 0 0", fontSize: "0.8rem", color: "var(--color-text-muted)" }}>Welcome back — here's what's happening today.</p>
        </div>
        <div style={{ display: "flex", gap: "0.65rem", flexWrap: "wrap" }}>
          <button onClick={handleReport} style={{ display: "flex", alignItems: "center", gap: "0.45rem", padding: "0.55rem 1.1rem", borderRadius: "9px", border: "1px solid var(--color-border)", backgroundColor: "var(--color-surface)", color: "var(--color-text)", fontWeight: 600, fontSize: "0.8375rem", cursor: "pointer", fontFamily: "inherit" }}>
            <Download size={15} /> Generate Report
          </button>
          <button onClick={() => setNewListing(true)} style={{ display: "flex", alignItems: "center", gap: "0.45rem", padding: "0.55rem 1.1rem", borderRadius: "9px", border: "1px solid var(--color-border)", backgroundColor: "var(--color-surface)", color: "var(--color-text)", fontWeight: 600, fontSize: "0.8375rem", cursor: "pointer", fontFamily: "inherit" }}>
            <Plus size={15} /> New Listing
          </button>
          <button onClick={() => setNewAgent(true)} style={{ display: "flex", alignItems: "center", gap: "0.45rem", padding: "0.55rem 1.1rem", borderRadius: "9px", border: "none", backgroundColor: "var(--color-primary)", color: "#fff", fontWeight: 600, fontSize: "0.8375rem", cursor: "pointer", fontFamily: "inherit" }}>
            <UserPlus size={15} /> New Agent
          </button>
        </div>
      </div>

      {/* KPI row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
        {KPIS.map((k, i) => (
          <KpiCard key={k.label} {...k} active={activeKpi === i} onClick={() => setActiveKpi(i)} />
        ))}
      </div>

      {/* Trend chart + Live feed */}
      <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,300px)", gap: "1rem", alignItems: "start" }} className="dash-grid">

        {/* Activity trend SVG chart */}
        <div style={{ backgroundColor: "var(--color-surface)", borderRadius: "14px", border: "1px solid var(--color-border)", padding: "1.25rem 1.5rem", minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "1.25rem", gap: "0.75rem", flexWrap: "wrap" }}>
            <div>
              <p style={T}>Activity Trend</p>
              <p style={S}>Revenue & applications · last 6 months</p>
            </div>
            <div style={{ display: "flex", gap: "1rem" }}>
              <Leg color="#FF4F00" label="Revenue" />
              <Leg color="#6D28D9" label="Applications" />
            </div>
          </div>

          <svg viewBox="0 0 550 155" style={{ width: "100%", overflow: "hidden" }}>
            <defs>
              <linearGradient id="rg" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#FF4F00" stopOpacity="0.15" />
                <stop offset="100%" stopColor="#FF4F00" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="ag" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6D28D9" stopOpacity="0.1" />
                <stop offset="100%" stopColor="#6D28D9" stopOpacity="0" />
              </linearGradient>
              <clipPath id="chartClip">
                <rect x="0" y="0" width="550" height="155" />
              </clipPath>
            </defs>
            {[0, 0.33, 0.66, 1].map(t => (
              <line key={t} x1="0" y1={110 - t * 95} x2="550" y2={110 - t * 95}
                stroke="var(--color-border)" strokeWidth="1" strokeDasharray="4 4" />
            ))}
            <g clipPath="url(#chartClip)">
              <polygon
                points={[...MONTHLY.map((m, i) => `${20 + i * 102},${110 - (m.revenue / maxRev) * 95}`), `${20 + 5 * 102},110`, `20,110`].join(" ")}
                fill="url(#rg)" />
              <polyline
                points={MONTHLY.map((m, i) => `${20 + i * 102},${110 - (m.revenue / maxRev) * 95}`).join(" ")}
                fill="none" stroke="#FF4F00" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
              <polygon
                points={[...MONTHLY.map((m, i) => `${20 + i * 102},${110 - (m.applications / maxApp) * 95}`), `${20 + 5 * 102},110`, `20,110`].join(" ")}
                fill="url(#ag)" />
              <polyline
                points={MONTHLY.map((m, i) => `${20 + i * 102},${110 - (m.applications / maxApp) * 95}`).join(" ")}
                fill="none" stroke="#6D28D9" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" strokeDasharray="5 3" />
            </g>
            {MONTHLY.map((m, i) => {
              const x    = 20 + i * 102
              const y    = 110 - (m.revenue / maxRev) * 95
              const last = i === MONTHLY.length - 1
              const labelX = last ? Math.min(x, 530) : x
              return (
                <g key={m.month}>
                  <circle cx={x} cy={y} r={last ? 5 : 3.5}
                    fill={last ? "#FF4F00" : "var(--color-surface)"}
                    stroke="#FF4F00" strokeWidth={last ? 0 : 2} />
                  {last && (
                    <text x={labelX} y={y - 10} textAnchor={last ? "end" : "middle"}
                      fontSize="10" fontWeight="700" fill="#FF4F00">
                      {fmtCurrency(m.revenue)}
                    </text>
                  )}
                  <text x={x} y={150} textAnchor="middle" fontSize="11"
                    fill={last ? "#FF4F00" : "var(--color-text-muted)"}
                    fontWeight={last ? "700" : "400"}>{m.month}</text>
                </g>
              )
            })}
          </svg>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "1rem", marginTop: "1.25rem", paddingTop: "1.25rem", borderTop: "1px solid var(--color-border)" }}>
            <CStat label="Peak Revenue" value={fmtCurrency(4230000)} sub="July 2025" />
            <CStat label="6-Month Avg"  value={fmtCurrency(Math.round(MONTHLY.reduce((s,m)=>s+m.revenue,0)/6))} sub="per month" />
            <CStat label="Total Deals"  value={MONTHLY.reduce((s,m)=>s+m.transactions,0)} sub="completed" />
          </div>
        </div>

        {/* Live activity — top 5, no scroll */}
        <div style={{ backgroundColor: "var(--color-surface)", borderRadius: "14px", border: "1px solid var(--color-border)", padding: "1.25rem 1.5rem", minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
            <div>
              <p style={T}>Live Activity</p>
              <p style={S}>Most recent events</p>
            </div>
            <span style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: "#22C55E", boxShadow: "0 0 0 3px #22C55E33", display: "inline-block", flexShrink: 0 }} />
          </div>
          {LIVE_ACTIVITY.map((a, i) => {
            const m  = TYPE_META[a.type]
            const st = STATUS_STYLES[a.status]
            return (
              <div key={a.id} style={{ display: "flex", gap: "0.65rem", padding: "0.7rem 0", borderBottom: i < LIVE_ACTIVITY.length - 1 ? "1px solid var(--color-border)" : "none", alignItems: "center" }}>
                <div style={{ width: 30, height: 30, borderRadius: "8px", backgroundColor: m.bg, color: m.color, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  {TYPE_ICON[a.type]}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ margin: 0, fontSize: "0.8rem", fontWeight: 600, color: "var(--color-text)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{a.subject}</p>
                  <p style={{ margin: "1px 0 0", fontSize: "0.72rem", color: "var(--color-text-muted)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{a.action}</p>
                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 3, flexShrink: 0 }}>
                  <span style={{ fontSize: "0.68rem", color: "var(--color-text-subtle)" }}>{a.time}</span>
                  <span style={{ backgroundColor: st.bg, color: st.color, borderRadius: "999px", padding: "1px 7px", fontSize: "0.65rem", fontWeight: 600 }}>{st.label}</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Recent activity table + right sidebar */}
      <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,300px)", gap: "1rem", alignItems: "start" }} className="dash-grid">

        {/* Recent activity table */}
        <div style={{ backgroundColor: "var(--color-surface)", borderRadius: "14px", border: "1px solid var(--color-border)", overflow: "hidden", minWidth: 0 }}>
          <div style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid var(--color-border)" }}>
            <p style={T}>Recent Activity</p>
            <p style={S}>All events across the platform</p>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.8375rem" }}>
              <thead>
                <tr style={{ backgroundColor: "var(--color-bg-muted)", borderBottom: "1px solid var(--color-border)" }}>
                  {["Type", "Action", "Subject", "Detail", "Time", "Status"].map(h => (
                    <th key={h} style={{ padding: "0.65rem 1.25rem", textAlign: "left", fontWeight: 600, fontSize: "0.72rem", color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: "0.04em", whiteSpace: "nowrap" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {RECENT_ACTIVITY.map((a, i) => {
                  const m  = TYPE_META[a.type]
                  const st = STATUS_STYLES[a.status]
                  return (
                    <tr key={a.id} style={{ borderBottom: i < RECENT_ACTIVITY.length - 1 ? "1px solid var(--color-border)" : "none", backgroundColor: i % 2 !== 0 ? "var(--color-bg-subtle)" : "transparent" }}>
                      <td style={TD}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                          <span style={{ width: 7, height: 7, borderRadius: "50%", backgroundColor: m.dot, flexShrink: 0 }} />
                          <span style={{ fontSize: "0.72rem", fontWeight: 600, color: m.color, whiteSpace: "nowrap" }}>{a.type}</span>
                        </div>
                      </td>
                      <td style={TD}><span style={{ fontWeight: 500, color: "var(--color-text)", whiteSpace: "nowrap" }}>{a.action}</span></td>
                      <td style={{ ...TD, whiteSpace: "nowrap" }}>{a.subject}</td>
                      <td style={{ ...TD, color: "var(--color-text-subtle)", maxWidth: 160, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{a.detail}</td>
                      <td style={{ ...TD, whiteSpace: "nowrap", color: "var(--color-text-subtle)" }}>{a.time}</td>
                      <td style={TD}>
                        <span style={{ backgroundColor: st.bg, color: st.color, borderRadius: "999px", padding: "2px 10px", fontSize: "0.72rem", fontWeight: 600, whiteSpace: "nowrap" }}>{st.label}</span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right sidebar */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem", minWidth: 0 }}>

          {/* Top properties */}
          <div style={{ backgroundColor: "var(--color-surface)", borderRadius: "14px", border: "1px solid var(--color-border)", padding: "1.25rem 1.5rem" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
              <p style={T}>Top Properties</p>
              <a href="/admin/properties" style={{ display: "flex", alignItems: "center", gap: "0.25rem", fontSize: "0.75rem", color: "var(--color-primary)", textDecoration: "none", fontWeight: 600 }}>
                All <ArrowRight size={12} />
              </a>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {TOP_PROPERTIES.map(p => {
                const st = STATUS_STYLES[p.status]
                return (
                  <div key={p.id} style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                    <div style={{ width: 44, height: 44, borderRadius: "9px", overflow: "hidden", flexShrink: 0, backgroundColor: "var(--color-bg-muted)" }}>
                      <img src={p.image} alt={p.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ margin: 0, fontWeight: 600, fontSize: "0.8rem", color: "var(--color-text)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.title}</p>
                      <p style={{ margin: "1px 0 0", fontSize: "0.72rem", color: "var(--color-text-muted)" }}>{p.city}</p>
                    </div>
                    <div style={{ textAlign: "right", flexShrink: 0 }}>
                      <p style={{ margin: 0, fontWeight: 700, fontSize: "0.8rem", color: "var(--color-text)" }}>{fmtCurrency(p.price)}</p>
                      <span style={{ backgroundColor: st.bg, color: st.color, borderRadius: "999px", padding: "1px 7px", fontSize: "0.65rem", fontWeight: 600 }}>{st.label}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Applications breakdown */}
          <div style={{ backgroundColor: "var(--color-surface)", borderRadius: "14px", border: "1px solid var(--color-border)", padding: "1.25rem 1.5rem" }}>
            <p style={{ ...T, marginBottom: "1rem" }}>Applications</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
              <PRow label="Pending"  value={4} total={10} color="#C2410C" />
              <PRow label="Accepted" value={2} total={10} color="#15803D" />
              <PRow label="Rejected" value={2} total={10} color="#B91C1C" />
              <PRow label="Other"    value={2} total={10} color="#9E9E9E" />
            </div>
          </div>

        </div>
      </div>

      {newListing && (
        <ListingFormModal
          onClose={() => setNewListing(false)}
          onSubmit={(data) => {
            console.log("New listing:", data)
            setNewListing(false)
          }}
        />
      )}

      {/* New Agent Modal */}
      {newAgent && (
        <NewAgentModal
          form={agentForm}
          setForm={setAgentForm}
          onClose={() => setNewAgent(false)}
          onSubmit={() => {
            setNewAgent(false)
            setAgentForm({ firstName: "", lastName: "", email: "", phone: "", license: "", company: "" })
          }}
        />
      )}
    </div>
  )
}

// ── Shared styles ──────────────────────────────────────────────────────────
const T  = { margin: 0, fontWeight: 700, fontSize: "0.9375rem", color: "var(--color-text)" }
const S  = { margin: "2px 0 0", fontSize: "0.75rem", color: "var(--color-text-muted)" }
const TD = { padding: "0.75rem 1.25rem", color: "var(--color-text-muted)", verticalAlign: "middle" }

function Leg({ color, label }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
      <span style={{ width: 10, height: 3, borderRadius: 2, backgroundColor: color, display: "inline-block" }} />
      <span style={{ fontSize: "0.75rem", color: "var(--color-text-muted)" }}>{label}</span>
    </div>
  )
}

function CStat({ label, value, sub }) {
  return (
    <div>
      <p style={{ margin: 0, fontSize: "0.68rem", color: "var(--color-text-subtle)", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 600 }}>{label}</p>
      <p style={{ margin: "2px 0 0", fontSize: "1.05rem", fontWeight: 700, color: "var(--color-text)" }}>{value}</p>
      <p style={{ margin: "1px 0 0", fontSize: "0.7rem", color: "var(--color-text-muted)" }}>{sub}</p>
    </div>
  )
}

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
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        style={{ padding: "0.55rem 0.85rem", borderRadius: "8px", border: "1px solid var(--color-border)", backgroundColor: "var(--color-bg-muted)", fontSize: "0.875rem", color: "var(--color-text)", outline: "none", fontFamily: "inherit", width: "100%", boxSizing: "border-box" }}
      />
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
          <button onClick={onClose} style={{ padding: "0.55rem 1.1rem", borderRadius: "9px", border: "1px solid var(--color-border)", background: "none", color: "var(--color-text-muted)", fontWeight: 500, fontSize: "0.8375rem", cursor: "pointer", fontFamily: "inherit" }}>Cancel</button>
          <button onClick={onSubmit} style={{ padding: "0.55rem 1.25rem", borderRadius: "9px", border: "none", backgroundColor: "var(--color-primary)", color: "#fff", fontWeight: 600, fontSize: "0.8375rem", cursor: "pointer", fontFamily: "inherit" }}>Create Agent</button>
        </div>
      </div>
    </>
  )
}
