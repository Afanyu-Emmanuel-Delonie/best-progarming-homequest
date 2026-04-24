import { useEffect, useState } from "react"
import { ArrowUpRight } from "lucide-react"
import { fmtCurrency } from "../../../utils/formatters"
import { APPLICATION_STATUS } from "../../../constants/enums"
import { applicationsApi } from "../../../api/applications.api"

const TABS = ["ALL", "PENDING", "ACCEPTED", "REJECTED", "WITHDRAWN"]
const FUNDING_LABELS = { CASH: "Cash", BANK_MORTGAGE: "Bank Mortgage", PAYMENT_PLAN: "Payment Plan" }
const TD = { padding: "0.75rem 1.25rem", color: "var(--color-text-muted)", verticalAlign: "middle" }

export default function ClientApplicationsPage() {
  const [tab, setTab] = useState("ALL")
  const [all, setAll] = useState([])
  const [loading, setLoading] = useState(true)
  const [withdrawing, setWithdrawing] = useState(null)

  useEffect(() => {
    applicationsApi.getMy()
      .then(res => setAll(res?.content ?? res ?? []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  async function handleWithdraw(id) {
    setWithdrawing(id)
    try {
      await applicationsApi.withdraw(id)
      setAll(prev => prev.map(a => a.id === id ? { ...a, status: "WITHDRAWN" } : a))
    } catch {
      // error already toasted by axios interceptor
    } finally {
      setWithdrawing(null)
    }
  }

  const rows = tab === "ALL" ? all : all.filter(a => a.status === tab)

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>

      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
        {TABS.map(t => {
          const active = tab === t
          return (
            <button key={t} onClick={() => setTab(t)} style={{
              padding: "0.4rem 1rem", borderRadius: "999px", border: "1px solid",
              borderColor: active ? "var(--color-primary)" : "var(--color-border)",
              backgroundColor: active ? "var(--color-primary)" : "#fff",
              color: active ? "#fff" : "var(--color-text-muted)",
              fontWeight: 600, fontSize: "0.8rem", cursor: "pointer", fontFamily: "inherit",
            }}>
              {t === "ALL" ? "All" : APPLICATION_STATUS[t]?.label ?? t}
              <span style={{ marginLeft: "0.4rem", fontSize: "0.7rem", opacity: 0.8 }}>
                {t === "ALL" ? all.length : all.filter(a => a.status === t).length}
              </span>
            </button>
          )
        })}
      </div>

      <div style={{ backgroundColor: "var(--color-surface)", borderRadius: "14px", border: "1px solid var(--color-border)", overflow: "hidden" }}>
        {loading ? (
          <div style={{ padding: "3rem", textAlign: "center", color: "var(--color-text-muted)", fontSize: "0.875rem" }}>Loading…</div>
        ) : rows.length === 0 ? (
          <div style={{ padding: "3rem", textAlign: "center", color: "var(--color-text-muted)", fontSize: "0.875rem" }}>No applications found.</div>
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
                  const st = APPLICATION_STATUS[a.status] ?? { label: a.status, bg: "#eee", color: "#333" }
                  const canWithdraw = a.status === "PENDING"
                  return (
                    <tr key={a.id} style={{ borderBottom: i < rows.length - 1 ? "1px solid var(--color-border)" : "none" }}>
                      <td style={TD}>
                        <p style={{ margin: 0, fontWeight: 600, color: "var(--color-text)" }}>{a.propertyTitle ?? `Property #${a.propertyId}`}</p>
                        {a.city && <p style={{ margin: "1px 0 0", fontSize: "0.72rem", color: "var(--color-text-muted)" }}>{a.city}</p>}
                      </td>
                      <td style={TD}><span style={{ fontWeight: 700, color: "var(--color-text)" }}>{fmtCurrency(a.offerAmount)}</span></td>
                      <td style={TD}>{fmtCurrency(a.depositAmount)}</td>
                      <td style={TD}>{FUNDING_LABELS[a.fundingSource] ?? a.fundingSource}</td>
                      <td style={{ ...TD, whiteSpace: "nowrap" }}>{a.proposedClosingDate ?? "—"}</td>
                      <td style={{ ...TD, whiteSpace: "nowrap" }}>{a.createdAt?.slice(0, 10) ?? "—"}</td>
                      <td style={TD}>
                        <span style={{ backgroundColor: st.bg, color: st.color, borderRadius: "999px", padding: "2px 10px", fontSize: "0.72rem", fontWeight: 600, whiteSpace: "nowrap" }}>{st.label}</span>
                      </td>
                      <td style={TD}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                          <a href={`/properties/${a.propertyId}`} style={{ display: "inline-flex", alignItems: "center", gap: "0.25rem", fontSize: "0.75rem", color: "var(--color-primary)", textDecoration: "none", fontWeight: 600 }}>
                            View <ArrowUpRight size={12} />
                          </a>
                          {canWithdraw && (
                            <button
                              onClick={() => handleWithdraw(a.id)}
                              disabled={withdrawing === a.id}
                              style={{ fontSize: "0.72rem", fontWeight: 600, color: "#C2410C", background: "none", border: "none", cursor: "pointer", padding: 0, fontFamily: "inherit" }}
                            >
                              {withdrawing === a.id ? "…" : "Withdraw"}
                            </button>
                          )}
                        </div>
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
