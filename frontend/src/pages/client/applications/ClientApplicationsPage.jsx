import { useState } from "react"
import { ArrowUpRight } from "lucide-react"
import { fmtCurrency } from "../../../utils/formatters"
import { APPLICATION_STATUS } from "../../../constants/enums"

const ALL = [
  { id: 1, property: "Modern Apartment in Kiyovu",   city: "Kigali",  offer: 85000000,  deposit: 8500000,  funding: "CASH",          status: "PENDING",   closing: "2025-08-15", expiry: "2025-07-25", submitted: "2025-07-10" },
  { id: 2, property: "Family Villa in Nyarutarama",  city: "Kigali",  offer: 310000000, deposit: 31000000, funding: "BANK_MORTGAGE",  status: "ACCEPTED",  closing: "2025-09-01", expiry: "2025-07-30", submitted: "2025-07-05" },
  { id: 3, property: "Townhouse in Kimironko",       city: "Kigali",  offer: 65000000,  deposit: 6500000,  funding: "CASH",          status: "PENDING",   closing: "2025-08-20", expiry: "2025-07-28", submitted: "2025-07-01" },
  { id: 4, property: "Studio Apartment in Huye",     city: "Huye",    offer: 20000000,  deposit: 2000000,  funding: "PAYMENT_PLAN",  status: "REJECTED",  closing: "2025-08-01", expiry: "2025-07-15", submitted: "2025-06-20" },
  { id: 5, property: "Penthouse in Gisozi",          city: "Kigali",  offer: 190000000, deposit: 19000000, funding: "BANK_MORTGAGE",  status: "ACCEPTED",  closing: "2025-09-15", expiry: "2025-08-01", submitted: "2025-06-15" },
  { id: 6, property: "Cozy House in Musanze",        city: "Musanze", offer: 44000000,  deposit: 4400000,  funding: "CASH",          status: "WITHDRAWN", closing: "2025-07-30", expiry: "2025-07-10", submitted: "2025-06-10" },
]

const TABS = ["ALL", "PENDING", "ACCEPTED", "REJECTED", "WITHDRAWN"]
const FUNDING_LABELS = { CASH: "Cash", BANK_MORTGAGE: "Bank Mortgage", PAYMENT_PLAN: "Payment Plan" }

export default function ClientApplicationsPage() {
  const [tab, setTab] = useState("ALL")

  const rows = tab === "ALL" ? ALL : ALL.filter(a => a.status === tab)

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>

      {/* Tabs */}
      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
        {TABS.map(t => {
          const st = t !== "ALL" ? APPLICATION_STATUS[t] : null
          const active = tab === t
          return (
            <button key={t} onClick={() => setTab(t)} style={{
              padding: "0.4rem 1rem", borderRadius: "999px", border: "1px solid",
              borderColor: active ? "var(--color-primary)" : "var(--color-border)",
              backgroundColor: active ? "var(--color-primary)" : "#fff",
              color: active ? "#fff" : "var(--color-text-muted)",
              fontWeight: 600, fontSize: "0.8rem", cursor: "pointer", fontFamily: "inherit",
            }}>
              {t === "ALL" ? "All" : APPLICATION_STATUS[t].label}
              <span style={{ marginLeft: "0.4rem", fontSize: "0.7rem", opacity: 0.8 }}>
                {t === "ALL" ? ALL.length : ALL.filter(a => a.status === t).length}
              </span>
            </button>
          )
        })}
      </div>

      {/* Table */}
      <div style={{ backgroundColor: "var(--color-surface)", borderRadius: "14px", border: "1px solid var(--color-border)", overflow: "hidden" }}>
        {rows.length === 0 ? (
          <div style={{ padding: "3rem", textAlign: "center", color: "var(--color-text-muted)", fontSize: "0.875rem" }}>
            No applications found.
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.8375rem" }}>
              <thead>
                <tr style={{ backgroundColor: "var(--color-bg-muted)", borderBottom: "1px solid var(--color-border)" }}>
                  {["Property", "Offer", "Deposit", "Funding", "Closing Date", "Submitted", "Status", ""].map(h => (
                    <th key={h} style={{ padding: "0.65rem 1.25rem", textAlign: "left", fontWeight: 600, fontSize: "0.72rem", color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: "0.04em", whiteSpace: "nowrap" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((a, i) => {
                  const st = APPLICATION_STATUS[a.status]
                  return (
                    <tr key={a.id} style={{ borderBottom: i < rows.length - 1 ? "1px solid var(--color-border)" : "none" }}>
                      <td style={TD}>
                        <p style={{ margin: 0, fontWeight: 600, color: "var(--color-text)" }}>{a.property}</p>
                        <p style={{ margin: "1px 0 0", fontSize: "0.72rem", color: "var(--color-text-muted)" }}>{a.city}</p>
                      </td>
                      <td style={TD}><span style={{ fontWeight: 700, color: "var(--color-text)" }}>{fmtCurrency(a.offer)}</span></td>
                      <td style={TD}>{fmtCurrency(a.deposit)}</td>
                      <td style={TD}>{FUNDING_LABELS[a.funding]}</td>
                      <td style={{ ...TD, whiteSpace: "nowrap" }}>{a.closing}</td>
                      <td style={{ ...TD, whiteSpace: "nowrap" }}>{a.submitted}</td>
                      <td style={TD}>
                        <span style={{ backgroundColor: st.bg, color: st.color, borderRadius: "999px", padding: "2px 10px", fontSize: "0.72rem", fontWeight: 600, whiteSpace: "nowrap" }}>{st.label}</span>
                      </td>
                      <td style={TD}>
                        <a href={`/properties/${a.id}`} style={{ display: "inline-flex", alignItems: "center", gap: "0.25rem", fontSize: "0.75rem", color: "var(--color-primary)", textDecoration: "none", fontWeight: 600 }}>
                          View <ArrowUpRight size={12} />
                        </a>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

const TD = { padding: "0.75rem 1.25rem", color: "var(--color-text-muted)", verticalAlign: "middle" }
