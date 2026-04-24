import { useState, useEffect, useMemo } from "react"
import { Home, DollarSign, ClipboardList, TrendingUp, ArrowRight, Loader2 } from "lucide-react"
import { fmtCurrency } from "../../../utils/formatters"
import KpiCard from "../../../components/shared/KpiCard"
import { APPLICATION_STATUS, PROPERTY_STATUS } from "../../../constants/enums"
import { propertiesApi } from "../../../api/properties.api"
import { applicationsApi } from "../../../api/applications.api"
import { transactionsApi } from "../../../api/transactions.api"

const T = { margin: 0, fontWeight: 700, fontSize: "0.9375rem", color: "var(--color-text)" }
const S = { margin: "2px 0 0", fontSize: "0.75rem", color: "var(--color-text-muted)" }
const TD = { padding: "0.75rem 1.25rem", color: "var(--color-text-muted)", verticalAlign: "middle" }

export default function AgentDashboard() {
  const [listings,     setListings]     = useState([])
  const [applications, setApplications] = useState([])
  const [commissions,  setCommissions]  = useState([])
  const [loading,      setLoading]      = useState(true)
  const [activeKpi,    setActiveKpi]    = useState(0)

  useEffect(() => {
    Promise.all([
      propertiesApi.getMyListings({ page: 0, size: 100 }),
      applicationsApi.getMyListings({ page: 0, size: 100 }),
      transactionsApi.getMyCommissions(),
    ]).then(([listRes, appRes, comms]) => {
      setListings(listRes.content     ?? listRes     ?? [])
      setApplications(appRes.content  ?? appRes      ?? [])
      setCommissions(Array.isArray(comms) ? comms    : [])
    }).catch(() => {}).finally(() => setLoading(false))
  }, [])

  const totalEarned   = useMemo(() => commissions.filter(c => c.status === "PAID").reduce((s, c) => s + Number(c.amount ?? 0), 0), [commissions])
  const activeListings = useMemo(() => listings.filter(p => p.status !== "INACTIVE" && p.status !== "SOLD" && p.status !== "RENTED").length, [listings])
  const pendingApps   = useMemo(() => applications.filter(a => a.status === "PENDING").length, [applications])
  const dealsClosedCount = useMemo(() => commissions.filter(c => c.status === "PAID").length, [commissions])

  const KPIS = [
    { label: "Active Listings",   value: String(activeListings), sub: `${listings.length} total`,          up: true,  icon: <Home size={18} />,         accent: "#1D4ED8" },
    { label: "Total Earned",      value: fmtCurrency(totalEarned), sub: `${dealsClosedCount} paid deals`,  up: true,  icon: <DollarSign size={18} />,   accent: "#15803D" },
    { label: "Open Applications", value: String(pendingApps),    sub: "awaiting your review",              up: false, icon: <ClipboardList size={18} />, accent: "#C2410C" },
    { label: "Deals Closed",      value: String(dealsClosedCount), sub: "all time",                        up: true,  icon: <TrendingUp size={18} />,   accent: "#FF4F00" },
  ]

  const recentApps  = useMemo(() => [...applications].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5), [applications])
  const topListings = useMemo(() => [...listings].sort((a, b) => Number(b.price) - Number(a.price)).slice(0, 4), [listings])

  if (loading) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "60vh", gap: "0.75rem", color: "var(--color-text-muted)" }}>
      <Loader2 size={20} style={{ animation: "spin 1s linear infinite" }} /> Loading dashboard…
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
        {KPIS.map((k, i) => (
          <KpiCard key={k.label} {...k} active={activeKpi === i} onClick={() => setActiveKpi(i)} />
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,300px)", gap: "1rem", alignItems: "start" }} className="dash-grid">

        {/* Recent applications */}
        <div style={{ backgroundColor: "var(--color-surface)", borderRadius: "14px", border: "1px solid var(--color-border)", overflow: "hidden" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1.25rem 1.5rem", borderBottom: "1px solid var(--color-border)" }}>
            <div>
              <p style={T}>Recent Applications</p>
              <p style={S}>Bids on your listings</p>
            </div>
            <a href="/agent/applications" style={{ display: "flex", alignItems: "center", gap: "0.25rem", fontSize: "0.75rem", color: "var(--color-primary)", textDecoration: "none", fontWeight: 600 }}>
              View all <ArrowRight size={12} />
            </a>
          </div>
          {recentApps.length === 0 ? (
            <p style={{ padding: "2rem", textAlign: "center", color: "var(--color-text-muted)", fontSize: "0.875rem" }}>No applications yet</p>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.8375rem" }}>
                <thead>
                  <tr style={{ backgroundColor: "var(--color-bg-muted)", borderBottom: "1px solid var(--color-border)" }}>
                    {["Property", "Buyer", "Offer", "Status"].map(h => (
                      <th key={h} style={{ padding: "0.65rem 1.25rem", textAlign: "left", fontWeight: 600, fontSize: "0.72rem", color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: "0.04em", whiteSpace: "nowrap" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {recentApps.map((a, i) => {
                    const st = APPLICATION_STATUS[a.status]
                    return (
                      <tr key={a.id} style={{ borderBottom: i < recentApps.length - 1 ? "1px solid var(--color-border)" : "none", backgroundColor: i % 2 !== 0 ? "var(--color-bg-subtle)" : "transparent" }}>
                        <td style={TD}><span style={{ fontWeight: 500, color: "var(--color-text)" }}>#{a.propertyId}</span></td>
                        <td style={TD}>{a.buyerFullName}</td>
                        <td style={TD}><span style={{ fontWeight: 600, color: "var(--color-text)" }}>{fmtCurrency(Number(a.offerAmount))}</span></td>
                        <td style={TD}>{st && <span style={{ backgroundColor: st.bg, color: st.color, borderRadius: "999px", padding: "2px 10px", fontSize: "0.72rem", fontWeight: 600, whiteSpace: "nowrap" }}>{st.label}</span>}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Top listings */}
        <div style={{ backgroundColor: "var(--color-surface)", borderRadius: "14px", border: "1px solid var(--color-border)", padding: "1.25rem 1.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
            <p style={T}>My Listings</p>
            <a href="/agent/listings" style={{ display: "flex", alignItems: "center", gap: "0.25rem", fontSize: "0.75rem", color: "var(--color-primary)", textDecoration: "none", fontWeight: 600 }}>
              All <ArrowRight size={12} />
            </a>
          </div>
          {topListings.length === 0 ? (
            <p style={{ fontSize: "0.8rem", color: "var(--color-text-muted)" }}>No listings yet</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {topListings.map(p => {
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
      </div>
    </div>
  )
}
