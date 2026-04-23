import { useState } from "react"
import { ClipboardList, Clock, CheckCircle, XCircle, ArrowRight, Search } from "lucide-react"
import { fmtCurrency } from "../../../utils/formatters"
import KpiCard from "../../../components/shared/KpiCard"
import { APPLICATION_STATUS } from "../../../constants/enums"

const KPIS = [
  { label: "Total Applications", value: "6",              sub: "+2 this month",      up: true,  icon: <ClipboardList size={18} />, accent: "#1D4ED8" },
  { label: "Pending Review",     value: "2",              sub: "awaiting response",  up: false, icon: <Clock size={18} />,         accent: "#C2410C" },
  { label: "Accepted",           value: "3",              sub: "all time",           up: true,  icon: <CheckCircle size={18} />,   accent: "#15803D" },
  { label: "Total Bid Value",    value: fmtCurrency(395000000), sub: "across all bids", up: true, icon: <XCircle size={18} />,   accent: "#FF4F00" },
]

const APPLICATIONS = [
  { id: 1, property: "Modern Apartment in Kiyovu",  offer: 85000000,  deposit: 8500000,  status: "PENDING",   date: "2025-07-10" },
  { id: 2, property: "Family Villa in Nyarutarama", offer: 310000000, deposit: 31000000, status: "ACCEPTED",  date: "2025-07-05" },
  { id: 3, property: "Townhouse in Kimironko",      offer: 65000000,  deposit: 6500000,  status: "PENDING",   date: "2025-07-01" },
  { id: 4, property: "Studio Apartment in Huye",    offer: 20000000,  deposit: 2000000,  status: "REJECTED",  date: "2025-06-20" },
  { id: 5, property: "Penthouse in Gisozi",         offer: 190000000, deposit: 19000000, status: "ACCEPTED",  date: "2025-06-15" },
  { id: 6, property: "Cozy House in Musanze",       offer: 44000000,  deposit: 4400000,  status: "WITHDRAWN", date: "2025-06-10" },
]

const T = { margin: 0, fontWeight: 700, fontSize: "0.9375rem", color: "var(--color-text)" }
const S = { margin: "2px 0 0", fontSize: "0.75rem", color: "var(--color-text-muted)" }
const TD = { padding: "0.75rem 1.25rem", color: "var(--color-text-muted)", verticalAlign: "middle" }

export default function ClientDashboard() {
  const [activeKpi, setActiveKpi] = useState(0)

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>

      {/* KPIs */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
        {KPIS.map((k, i) => (
          <KpiCard key={k.label} {...k} active={activeKpi === i} onClick={() => setActiveKpi(i)} />
        ))}
      </div>

      {/* Quick actions */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
        <a href="/properties" style={quickCard("#1D4ED8")}>
          <Search size={20} />
          <div>
            <p style={{ margin: 0, fontWeight: 700, fontSize: "0.9rem", color: "#fff" }}>Browse Properties</p>
            <p style={{ margin: "2px 0 0", fontSize: "0.75rem", color: "#ffffffcc" }}>Find your next home</p>
          </div>
          <ArrowRight size={16} style={{ marginLeft: "auto", color: "#ffffffcc" }} />
        </a>
        <a href="/client/applications" style={quickCard("#15803D")}>
          <ClipboardList size={20} />
          <div>
            <p style={{ margin: 0, fontWeight: 700, fontSize: "0.9rem", color: "#fff" }}>My Applications</p>
            <p style={{ margin: "2px 0 0", fontSize: "0.75rem", color: "#ffffffcc" }}>Track your bids</p>
          </div>
          <ArrowRight size={16} style={{ marginLeft: "auto", color: "#ffffffcc" }} />
        </a>
      </div>

      {/* Recent applications */}
      <div style={{ backgroundColor: "var(--color-surface)", borderRadius: "14px", border: "1px solid var(--color-border)", overflow: "hidden" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1.25rem 1.5rem", borderBottom: "1px solid var(--color-border)" }}>
          <div>
            <p style={T}>Recent Applications</p>
            <p style={S}>Your latest property bids</p>
          </div>
          <a href="/client/applications" style={{ display: "flex", alignItems: "center", gap: "0.25rem", fontSize: "0.75rem", color: "var(--color-primary)", textDecoration: "none", fontWeight: 600 }}>
            View all <ArrowRight size={12} />
          </a>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.8375rem" }}>
            <thead>
              <tr style={{ backgroundColor: "var(--color-bg-muted)", borderBottom: "1px solid var(--color-border)" }}>
                {["Property", "Offer", "Deposit", "Date", "Status"].map(h => (
                  <th key={h} style={{ padding: "0.65rem 1.25rem", textAlign: "left", fontWeight: 600, fontSize: "0.72rem", color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: "0.04em", whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {APPLICATIONS.map((a, i) => {
                const st = APPLICATION_STATUS[a.status]
                return (
                  <tr key={a.id} style={{ borderBottom: i < APPLICATIONS.length - 1 ? "1px solid var(--color-border)" : "none" }}>
                    <td style={TD}><span style={{ fontWeight: 500, color: "var(--color-text)" }}>{a.property}</span></td>
                    <td style={TD}><span style={{ fontWeight: 600, color: "var(--color-text)" }}>{fmtCurrency(a.offer)}</span></td>
                    <td style={TD}>{fmtCurrency(a.deposit)}</td>
                    <td style={{ ...TD, whiteSpace: "nowrap" }}>{a.date}</td>
                    <td style={TD}><span style={{ backgroundColor: st.bg, color: st.color, borderRadius: "999px", padding: "2px 10px", fontSize: "0.72rem", fontWeight: 600, whiteSpace: "nowrap" }}>{st.label}</span></td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

const quickCard = (bg) => ({
  display: "flex", alignItems: "center", gap: "0.875rem",
  padding: "1.1rem 1.25rem", borderRadius: "14px",
  background: `linear-gradient(135deg, ${bg} 0%, ${bg}cc 100%)`,
  color: "#fff", textDecoration: "none",
  boxShadow: `0 4px 16px ${bg}40`,
})
