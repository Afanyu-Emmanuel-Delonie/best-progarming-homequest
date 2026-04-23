import { useState } from "react"
import { Building2, DollarSign, ArrowLeftRight, TrendingUp, ArrowRight } from "lucide-react"
import { fmtCurrency } from "../../../utils/formatters"
import KpiCard from "../../../components/shared/KpiCard"
import { PROPERTY_STATUS, TRANSACTION_STATUS } from "../../../constants/enums"

const KPIS = [
  { label: "My Properties",    value: "4",                    sub: "1 under offer",       up: true,  icon: <Building2 size={18} />,      accent: "#1D4ED8" },
  { label: "Total Value",      value: fmtCurrency(598000000), sub: "portfolio value",     up: true,  icon: <DollarSign size={18} />,     accent: "#15803D" },
  { label: "Transactions",     value: "3",                    sub: "completed sales",     up: true,  icon: <ArrowLeftRight size={18} />, accent: "#FF4F00" },
  { label: "Revenue Earned",   value: fmtCurrency(125000000), sub: "+18% vs last year",   up: true,  icon: <TrendingUp size={18} />,     accent: "#6D28D9" },
]

const PROPERTIES = [
  { id: 1, title: "Modern Apartment in Kiyovu",  city: "Kigali",  price: 85000000,  status: "AVAILABLE",   bids: 3, image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=200&q=70" },
  { id: 2, title: "Family Villa in Nyarutarama", city: "Kigali",  price: 320000000, status: "UNDER_OFFER", bids: 1, image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=200&q=70" },
  { id: 8, title: "Townhouse in Kimironko",      city: "Kigali",  price: 68000000,  status: "AVAILABLE",   bids: 2, image: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=200&q=70" },
  { id: 9, title: "Penthouse in Gisozi",         city: "Kigali",  price: 195000000, status: "SOLD",        bids: 0, image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=200&q=70" },
]

const TRANSACTIONS = [
  { id: 1, property: "Penthouse in Gisozi",         buyer: "Jean Paul H.",  amount: 195000000, status: "COMPLETED", date: "2025-06-10" },
  { id: 2, property: "Studio Apartment in Huye",    buyer: "Amina K.",      amount: 22000000,  status: "COMPLETED", date: "2025-04-22" },
  { id: 3, property: "Family Villa in Nyarutarama", buyer: "David M.",      amount: 310000000, status: "PENDING",   date: "2025-07-08" },
]

const T  = { margin: 0, fontWeight: 700, fontSize: "0.9375rem", color: "var(--color-text)" }
const S  = { margin: "2px 0 0", fontSize: "0.75rem", color: "var(--color-text-muted)" }
const TD = { padding: "0.75rem 1.25rem", color: "var(--color-text-muted)", verticalAlign: "middle" }

export default function OwnerDashboard() {
  const [activeKpi, setActiveKpi] = useState(0)

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>

      {/* KPIs */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
        {KPIS.map((k, i) => (
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
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.8375rem" }}>
              <thead>
                <tr style={{ backgroundColor: "var(--color-bg-muted)", borderBottom: "1px solid var(--color-border)" }}>
                  {["Property", "Buyer", "Amount", "Date", "Status"].map(h => (
                    <th key={h} style={{ padding: "0.65rem 1.25rem", textAlign: "left", fontWeight: 600, fontSize: "0.72rem", color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: "0.04em", whiteSpace: "nowrap" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {TRANSACTIONS.map((t, i) => {
                  const st = TRANSACTION_STATUS[t.status]
                  return (
                    <tr key={t.id} style={{ borderBottom: i < TRANSACTIONS.length - 1 ? "1px solid var(--color-border)" : "none" }}>
                      <td style={TD}><span style={{ fontWeight: 500, color: "var(--color-text)" }}>{t.property}</span></td>
                      <td style={TD}>{t.buyer}</td>
                      <td style={TD}><span style={{ fontWeight: 700, color: "var(--color-text)" }}>{fmtCurrency(t.amount)}</span></td>
                      <td style={{ ...TD, whiteSpace: "nowrap" }}>{t.date}</td>
                      <td style={TD}><span style={{ backgroundColor: st.bg, color: st.color, borderRadius: "999px", padding: "2px 10px", fontSize: "0.72rem", fontWeight: 600 }}>{st.label}</span></td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
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
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {PROPERTIES.map(p => {
              const st = PROPERTY_STATUS[p.status]
              return (
                <div key={p.id} style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <div style={{ width: 44, height: 44, borderRadius: "9px", overflow: "hidden", flexShrink: 0, backgroundColor: "var(--color-bg-muted)" }}>
                    <img src={p.image} alt={p.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ margin: 0, fontWeight: 600, fontSize: "0.8rem", color: "var(--color-text)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.title}</p>
                    <p style={{ margin: "1px 0 0", fontSize: "0.72rem", color: "var(--color-text-muted)" }}>{p.city} · {p.bids} bid{p.bids !== 1 ? "s" : ""}</p>
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
      </div>

      <style>{`.dash-grid { @media (max-width: 700px) { grid-template-columns: 1fr !important; } }`}</style>
    </div>
  )
}
