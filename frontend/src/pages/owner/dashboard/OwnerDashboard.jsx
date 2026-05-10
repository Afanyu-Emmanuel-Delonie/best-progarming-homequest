import { useEffect, useState } from "react"
import { Building2, DollarSign, ArrowLeftRight, TrendingUp, ArrowRight } from "lucide-react"
import { fmtCurrency } from "../../../utils/formatters"
import KpiCard from "../../../components/shared/KpiCard"
import { PROPERTY_STATUS, TRANSACTION_STATUS } from "../../../constants/enums"
import { propertiesApi } from "../../../api/properties.api"
import { transactionsApi } from "../../../api/transactions.api"

const T  = { margin: 0, fontWeight: 700, fontSize: "0.9375rem", color: "var(--color-text)" }
const S  = { margin: "2px 0 0", fontSize: "0.75rem", color: "var(--color-text-muted)" }
const TD = { padding: "0.75rem 1.25rem", color: "var(--color-text-muted)", verticalAlign: "middle" }

export default function OwnerDashboard() {
  const [activeKpi, setActiveKpi] = useState(0)
  const [properties, setProperties] = useState([])
  const [transactions, setTransactions] = useState([])

  useEffect(() => {
    propertiesApi.getMyOwned().then(res => setProperties(res.content ?? (Array.isArray(res) ? res : []))).catch(() => {})
    transactionsApi.getMyOwner().then(res => setTransactions(Array.isArray(res) ? res : res.content ?? [])).catch(() => {})
  }, [])

  const totalValue     = properties.reduce((s, p) => s + (p.price ?? 0), 0)
  const underOffer     = properties.filter(p => p.status === "UNDER_OFFER").length
  const completed      = transactions.filter(t => t.status === "COMPLETED")
  const totalRevenue   = completed.reduce((s, t) => s + (t.saleAmount ?? 0), 0)

  const kpis = [
    { label: "My Properties",  value: String(properties.length),  sub: `${underOffer} under offer`,  up: true, icon: <Building2 size={18} />,      accent: "#1D4ED8" },
    { label: "Total Value",    value: fmtCurrency(totalValue),    sub: "portfolio value",             up: true, icon: <DollarSign size={18} />,     accent: "#15803D" },
    { label: "Transactions",   value: String(completed.length),   sub: "completed sales",             up: true, icon: <ArrowLeftRight size={18} />, accent: "#FF4F00" },
    { label: "Revenue Earned", value: fmtCurrency(totalRevenue),  sub: "from completed sales",        up: true, icon: <TrendingUp size={18} />,     accent: "#6D28D9" },
  ]

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
        {kpis.map((k, i) => (
          <KpiCard key={k.label} {...k} active={activeKpi === i} onClick={() => setActiveKpi(i)} />
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,300px)", gap: "1rem", alignItems: "start" }} className="dash-grid">

        {/* Recent transactions */}
        <div style={{ backgroundColor: "var(--color-surface)", borderRadius: "14px", border: "1px solid var(--color-border)", overflow: "hidden" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1.25rem 1.5rem", borderBottom: "1px solid var(--color-border)" }}>
            <div>
              <p style={T}>Recent Transactions</p>
              <p style={S}>Sales on your properties</p>
            </div>
            <a href="/owner/transactions" style={{ display: "flex", alignItems: "center", gap: "0.25rem", fontSize: "0.75rem", color: "var(--color-primary)", textDecoration: "none", fontWeight: 600 }}>
              View all <ArrowRight size={12} />
            </a>
          </div>
          <div style={{ overflowX: "auto" }}>
            {transactions.length === 0 ? (
              <p style={{ padding: "2rem", textAlign: "center", color: "var(--color-text-muted)", fontSize: "0.875rem" }}>No transactions yet.</p>
            ) : (
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.8375rem" }}>
                <thead>
                  <tr style={{ backgroundColor: "var(--color-bg-muted)", borderBottom: "1px solid var(--color-border)" }}>
                    {["Property", "Buyer", "Amount", "Date", "Status"].map(h => (
                      <th key={h} style={{ padding: "0.65rem 1.25rem", textAlign: "left", fontWeight: 600, fontSize: "0.72rem", color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: "0.04em", whiteSpace: "nowrap" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {transactions.slice(0, 5).map((t, i) => {
                    const st = TRANSACTION_STATUS[t.status] ?? { label: t.status, bg: "#eee", color: "#333" }
                    return (
                      <tr key={t.id} style={{ borderBottom: i < Math.min(transactions.length, 5) - 1 ? "1px solid var(--color-border)" : "none" }}>
                        <td style={TD}><span style={{ fontWeight: 500, color: "var(--color-text)" }}>{t.propertyTitle ?? `Property #${t.propertyId}`}</span></td>
                        <td style={TD}>{t.buyerName ?? t.buyerPublicId?.slice(0, 8) ?? "—"}</td>
                        <td style={TD}><span style={{ fontWeight: 700, color: "var(--color-text)" }}>{fmtCurrency(t.saleAmount)}</span></td>
                        <td style={{ ...TD, whiteSpace: "nowrap" }}>{t.createdAt?.slice(0, 10) ?? "—"}</td>
                        <td style={TD}><span style={{ backgroundColor: st.bg, color: st.color, borderRadius: "999px", padding: "2px 10px", fontSize: "0.72rem", fontWeight: 600 }}>{st.label}</span></td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* My properties */}
        <div style={{ backgroundColor: "var(--color-surface)", borderRadius: "14px", border: "1px solid var(--color-border)", padding: "1.25rem 1.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
            <p style={T}>My Properties</p>
            <a href="/owner/properties" style={{ display: "flex", alignItems: "center", gap: "0.25rem", fontSize: "0.75rem", color: "var(--color-primary)", textDecoration: "none", fontWeight: 600 }}>
              All <ArrowRight size={12} />
            </a>
          </div>
          {properties.length === 0 ? (
            <p style={{ textAlign: "center", color: "var(--color-text-muted)", fontSize: "0.875rem" }}>No properties yet.</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {properties.slice(0, 5).map(p => {
                const st = PROPERTY_STATUS[p.status] ?? { label: p.status, bg: "#eee", color: "#333" }
                return (
                  <div key={p.id} style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                    <div style={{ width: 44, height: 44, borderRadius: "9px", overflow: "hidden", flexShrink: 0, backgroundColor: "var(--color-bg-muted)" }}>
                      {p.imageUrl && <img src={p.imageUrl} alt={p.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />}
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
          )}
        </div>
      </div>

      <style>{`.dash-grid { @media (max-width: 700px) { grid-template-columns: 1fr !important; } }`}</style>
    </div>
  )
}
