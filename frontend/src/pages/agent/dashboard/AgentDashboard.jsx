import { useState } from "react"
import { Home, DollarSign, ClipboardList, TrendingUp, ArrowRight } from "lucide-react"
import { fmtCurrency } from "../../../utils/formatters"
import KpiCard from "../../../components/shared/KpiCard"
import { APPLICATION_STATUS, PROPERTY_STATUS } from "../../../constants/enums"

const MONTHLY = [
  { month: "Feb", listings: 2, deals: 1, commission: 22000  },
  { month: "Mar", listings: 3, deals: 2, commission: 41500  },
  { month: "Apr", listings: 2, deals: 1, commission: 18000  },
  { month: "May", listings: 4, deals: 3, commission: 67200  },
  { month: "Jun", listings: 3, deals: 2, commission: 48900  },
  { month: "Jul", listings: 5, deals: 4, commission: 97400  },
]

const RECENT_APPS = [
  { id: 1, propertyTitle: "Modern Downtown Apartment", buyer: "Marcus Lee",       offer: 485000,  status: "PENDING",   time: "2h ago"  },
  { id: 2, propertyTitle: "Family House in Suburbs",   buyer: "Emma Wilson",      offer: 780000,  status: "ACCEPTED",  time: "1d ago"  },
  { id: 3, propertyTitle: "Penthouse with City Views", buyer: "Fatima Al-Hassan", offer: 1250000, status: "PENDING",   time: "2d ago"  },
  { id: 4, propertyTitle: "Luxury Suburban Villa",     buyer: "Tom Bradley",      offer: 900000,  status: "REJECTED",  time: "3d ago"  },
  { id: 5, propertyTitle: "Starter Home",              buyer: "Priya Patel",      offer: 290000,  status: "ACCEPTED",  time: "4d ago"  },
]

const TOP_LISTINGS = [
  { id: 101, title: "Modern Downtown Apartment", price: 485000,  status: "AVAILABLE",   city: "New York",     image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=200&q=70", bids: 3 },
  { id: 104, title: "Penthouse with City Views", price: 1250000, status: "UNDER_OFFER", city: "Miami",        image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=200&q=70", bids: 2 },
  { id: 106, title: "Family House in Suburbs",   price: 780000,  status: "AVAILABLE",   city: "Phoenix",      image: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=200&q=70", bids: 1 },
  { id: 109, title: "Starter Home",              price: 295000,  status: "AVAILABLE",   city: "Dallas",       image: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=200&q=70", bids: 1 },
]

const KPIS = [
  { label: "Active Listings",   value: "12", sub: "+2 this month",        up: true,  icon: <Home size={18} />,         accent: "#1D4ED8" },
  { label: "Total Earned",      value: fmtCurrency(184500), sub: "+53% vs last month", up: true,  icon: <DollarSign size={18} />,   accent: "#15803D" },
  { label: "Open Applications", value: "4",  sub: "awaiting your review", up: false, icon: <ClipboardList size={18} />,accent: "#C2410C" },
  { label: "Deals Closed",      value: "9",  sub: "all time",             up: true,  icon: <TrendingUp size={18} />,   accent: "#FF4F00" },
]

const T  = { margin: 0, fontWeight: 700, fontSize: "0.9375rem", color: "var(--color-text)" }
const S  = { margin: "2px 0 0", fontSize: "0.75rem", color: "var(--color-text-muted)" }

export default function AgentDashboard() {
  const [activeKpi, setActiveKpi] = useState(0)
  const maxComm = Math.max(...MONTHLY.map(m => m.commission))

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>

      {/* KPIs */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
        {KPIS.map((k, i) => (
          <KpiCard key={k.label} {...k} active={activeKpi === i} onClick={() => setActiveKpi(i)} />
        ))}
      </div>

      {/* Chart + top listings */}
      <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,300px)", gap: "1rem", alignItems: "start" }} className="dash-grid">

        {/* Commission trend */}
        <div style={{ backgroundColor: "var(--color-surface)", borderRadius: "14px", border: "1px solid var(--color-border)", padding: "1.25rem 1.5rem", minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "1.25rem", gap: "0.75rem", flexWrap: "wrap" }}>
            <div>
              <p style={T}>Commission Trend</p>
              <p style={S}>Monthly earnings · last 6 months</p>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", backgroundColor: "#F0FDF4", color: "#15803D", borderRadius: "999px", padding: "0.3rem 0.75rem", fontSize: "0.75rem", fontWeight: 600 }}>
              <TrendingUp size={13} /> +99% YTD
            </div>
          </div>

          {/* Bar chart */}
          <div style={{ display: "flex", alignItems: "flex-end", gap: "0.5rem", height: 140 }}>
            {MONTHLY.map((m, i) => {
              const last = i === MONTHLY.length - 1
              const pct  = (m.commission / maxComm) * 100
              return (
                <div key={m.month} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "0.4rem", height: "100%" }}>
                  <div style={{ flex: 1, width: "100%", display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
                    {last && <p style={{ margin: "0 0 4px", fontSize: "0.65rem", fontWeight: 700, color: "#15803D", textAlign: "center", whiteSpace: "nowrap" }}>{fmtCurrency(m.commission)}</p>}
                    <div style={{ width: "100%", height: `${pct}%`, minHeight: 6, borderRadius: "6px 6px 0 0", background: last ? "linear-gradient(180deg,#22C55E,#15803D)" : "var(--color-bg-muted)", border: last ? "none" : "1px solid var(--color-border)" }} />
                  </div>
                  <p style={{ margin: 0, fontSize: "0.72rem", color: last ? "#15803D" : "var(--color-text-muted)", fontWeight: last ? 700 : 400 }}>{m.month}</p>
                </div>
              )
            })}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "1rem", marginTop: "1.25rem", paddingTop: "1.25rem", borderTop: "1px solid var(--color-border)" }}>
            {[
              { label: "Best Month",  value: "Jul",                sub: fmtCurrency(97400) },
              { label: "Avg/Month",   value: fmtCurrency(Math.round(MONTHLY.reduce((s,m)=>s+m.commission,0)/6)), sub: "6-month avg" },
              { label: "Total Deals", value: MONTHLY.reduce((s,m)=>s+m.deals,0), sub: "closed" },
            ].map(s => (
              <div key={s.label}>
                <p style={{ margin: 0, fontSize: "0.68rem", color: "var(--color-text-subtle)", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 600 }}>{s.label}</p>
                <p style={{ margin: "2px 0 0", fontSize: "1.05rem", fontWeight: 700, color: "var(--color-text)" }}>{s.value}</p>
                <p style={{ margin: "1px 0 0", fontSize: "0.7rem", color: "var(--color-text-muted)" }}>{s.sub}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Top listings */}
        <div style={{ backgroundColor: "var(--color-surface)", borderRadius: "14px", border: "1px solid var(--color-border)", padding: "1.25rem 1.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
            <p style={T}>My Listings</p>
            <a href="/agent/listings" style={{ display: "flex", alignItems: "center", gap: "0.25rem", fontSize: "0.75rem", color: "var(--color-primary)", textDecoration: "none", fontWeight: 600 }}>
              All <ArrowRight size={12} />
            </a>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {TOP_LISTINGS.map(p => {
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

      {/* Recent applications table */}
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
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.8375rem" }}>
            <thead>
              <tr style={{ backgroundColor: "var(--color-bg-muted)", borderBottom: "1px solid var(--color-border)" }}>
                {["Property", "Buyer", "Offer", "Time", "Status"].map(h => (
                  <th key={h} style={{ padding: "0.65rem 1.25rem", textAlign: "left", fontWeight: 600, fontSize: "0.72rem", color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: "0.04em", whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {RECENT_APPS.map((a, i) => {
                const st = APPLICATION_STATUS[a.status]
                return (
                  <tr key={a.id} style={{ borderBottom: i < RECENT_APPS.length - 1 ? "1px solid var(--color-border)" : "none", backgroundColor: i % 2 !== 0 ? "var(--color-bg-subtle)" : "transparent" }}>
                    <td style={TD}><span style={{ fontWeight: 500, color: "var(--color-text)" }}>{a.propertyTitle}</span></td>
                    <td style={TD}>{a.buyer}</td>
                    <td style={TD}><span style={{ fontWeight: 600, color: "var(--color-text)" }}>{fmtCurrency(a.offer)}</span></td>
                    <td style={{ ...TD, color: "var(--color-text-subtle)", whiteSpace: "nowrap" }}>{a.time}</td>
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

const TD = { padding: "0.75rem 1.25rem", color: "var(--color-text-muted)", verticalAlign: "middle" }
