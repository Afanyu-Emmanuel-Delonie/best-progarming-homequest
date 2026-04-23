import { useState } from "react"
import { fmtCurrencyFull, fmtCurrency } from "../../../utils/formatters"
import { TRANSACTION_STATUS } from "../../../constants/enums"

const ALL = [
  { id: 1, property: "Penthouse in Gisozi",          buyer: "Jean Paul Habimana",  amount: 195000000, commission: 9750000,  type: "SALE", status: "COMPLETED", date: "2025-06-10" },
  { id: 2, property: "Studio Apartment in Huye",     buyer: "Amina Kayitesi",      amount: 22000000,  commission: 1100000,  type: "SALE", status: "COMPLETED", date: "2025-04-22" },
  { id: 3, property: "Family Villa in Nyarutarama",  buyer: "David Mugisha",       amount: 310000000, commission: 15500000, type: "SALE", status: "PENDING",   date: "2025-07-08" },
]

const TABS = ["ALL", "PENDING", "COMPLETED", "CANCELLED"]

export default function OwnerTransactionsPage() {
  const [tab, setTab] = useState("ALL")

  const rows = tab === "ALL" ? ALL : ALL.filter(t => t.status === tab)

  const totalRevenue = ALL.filter(t => t.status === "COMPLETED").reduce((s, t) => s + t.amount, 0)
  const totalComm    = ALL.filter(t => t.status === "COMPLETED").reduce((s, t) => s + t.commission, 0)

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>

      {/* Summary strip */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "1rem" }}>
        {[
          { label: "Total Revenue",    value: fmtCurrency(totalRevenue), sub: "from completed sales" },
          { label: "Commission Paid",  value: fmtCurrency(totalComm),    sub: "agent fees deducted"  },
          { label: "Net Received",     value: fmtCurrency(totalRevenue - totalComm), sub: "after commission" },
        ].map(s => (
          <div key={s.label} style={{ backgroundColor: "var(--color-surface)", borderRadius: "12px", border: "1px solid var(--color-border)", padding: "1rem 1.25rem" }}>
            <p style={{ margin: 0, fontSize: "0.72rem", fontWeight: 600, color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>{s.label}</p>
            <p style={{ margin: "0.3rem 0 0", fontWeight: 800, fontSize: "1.375rem", color: "var(--color-text)", letterSpacing: "-0.02em" }}>{s.value}</p>
            <p style={{ margin: "2px 0 0", fontSize: "0.72rem", color: "var(--color-text-muted)" }}>{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
        {TABS.map(t => {
          const active = tab === t
          const label  = t === "ALL" ? "All" : TRANSACTION_STATUS[t]?.label ?? t
          const count  = t === "ALL" ? ALL.length : ALL.filter(x => x.status === t).length
          return (
            <button key={t} onClick={() => setTab(t)} style={{
              padding: "0.4rem 1rem", borderRadius: "999px", border: "1px solid",
              borderColor: active ? "var(--color-primary)" : "var(--color-border)",
              backgroundColor: active ? "var(--color-primary)" : "#fff",
              color: active ? "#fff" : "var(--color-text-muted)",
              fontWeight: 600, fontSize: "0.8rem", cursor: "pointer", fontFamily: "inherit",
            }}>
              {label} <span style={{ marginLeft: "0.3rem", opacity: 0.8, fontSize: "0.7rem" }}>{count}</span>
            </button>
          )
        })}
      </div>

      {/* Table */}
      <div style={{ backgroundColor: "var(--color-surface)", borderRadius: "14px", border: "1px solid var(--color-border)", overflow: "hidden" }}>
        {rows.length === 0 ? (
          <div style={{ padding: "3rem", textAlign: "center", color: "var(--color-text-muted)", fontSize: "0.875rem" }}>No transactions found.</div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.8375rem" }}>
              <thead>
                <tr style={{ backgroundColor: "var(--color-bg-muted)", borderBottom: "1px solid var(--color-border)" }}>
                  {["Property", "Buyer", "Sale Amount", "Commission", "Net", "Date", "Status"].map(h => (
                    <th key={h} style={{ padding: "0.65rem 1.25rem", textAlign: "left", fontWeight: 600, fontSize: "0.72rem", color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: "0.04em", whiteSpace: "nowrap" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((t, i) => {
                  const st = TRANSACTION_STATUS[t.status]
                  return (
                    <tr key={t.id} style={{ borderBottom: i < rows.length - 1 ? "1px solid var(--color-border)" : "none" }}>
                      <td style={TD}><span style={{ fontWeight: 600, color: "var(--color-text)" }}>{t.property}</span></td>
                      <td style={TD}>{t.buyer}</td>
                      <td style={TD}><span style={{ fontWeight: 700, color: "var(--color-text)" }}>{fmtCurrencyFull(t.amount)}</span></td>
                      <td style={{ ...TD, color: "#C2410C" }}>- {fmtCurrency(t.commission)}</td>
                      <td style={{ ...TD, fontWeight: 700, color: "#15803D" }}>{fmtCurrency(t.amount - t.commission)}</td>
                      <td style={{ ...TD, whiteSpace: "nowrap" }}>{t.date}</td>
                      <td style={TD}><span style={{ backgroundColor: st.bg, color: st.color, borderRadius: "999px", padding: "2px 10px", fontSize: "0.72rem", fontWeight: 600 }}>{st.label}</span></td>
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
