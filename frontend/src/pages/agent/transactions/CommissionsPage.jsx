import { useState, useMemo, useEffect } from "react"
import { Loader2 } from "lucide-react"
import { StatCard, Badge } from "../../../components/shared/AdminUI"
import DataTable from "../../../components/shared/DataTable"
import { fmtCurrency, fmtCurrencyFull, fmtDate } from "../../../utils/formatters"
import { COMMISSION_STATUS, PAGE_SIZE } from "../../../constants/enums"
import { transactionsApi } from "../../../api/transactions.api"

const RECIPIENT_LABELS = {
  LISTING_AGENT: { bg: "#EFF6FF", color: "#1D4ED8", label: "Listing" },
  SELLING_AGENT: { bg: "#F5F3FF", color: "#6D28D9", label: "Selling" },
  COMPANY:       { bg: "#FEF9C3", color: "#92400E", label: "Company" },
}
const roleBadge = (r) => { const s = RECIPIENT_LABELS[r]; return s ? <Badge {...s} /> : r }

export default function CommissionsPage() {
  const [data, setData]     = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage]     = useState(0)

  useEffect(() => {
    transactionsApi.getMyCommissions()
      .then(res => setData(Array.isArray(res) ? res : []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const stats = useMemo(() => ({
    total:   fmtCurrency(data.reduce((s, c) => s + Number(c.amount ?? 0), 0)),
    paid:    fmtCurrency(data.filter(c => c.status === "PAID").reduce((s, c) => s + Number(c.amount ?? 0), 0)),
    pending: fmtCurrency(data.filter(c => c.status === "PENDING").reduce((s, c) => s + Number(c.amount ?? 0), 0)),
    count:   data.length,
  }), [data])

  const totalPages = Math.ceil(data.length / PAGE_SIZE)
  const pageRows   = data.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)

  const columns = [
    { key: "transactionId", label: "Txn",      render: (v) => <span style={{ color: "var(--color-primary)", fontWeight: 600 }}>#{v}</span> },
    { key: "recipientType", label: "Role",      render: (v) => roleBadge(v) },
    { key: "amount",        label: "Amount",    render: (v) => <span style={{ fontWeight: 700, color: "#15803D" }}>{fmtCurrencyFull(Number(v))}</span> },
    { key: "status",        label: "Status",    render: (v) => { const s = COMMISSION_STATUS[v]; return s ? <span style={{ backgroundColor: s.bg, color: s.color, borderRadius: "999px", padding: "2px 10px", fontSize: "0.72rem", fontWeight: 600 }}>{s.label}</span> : v } },
    { key: "paidAt",        label: "Paid On",   render: (v) => <span style={{ color: "var(--color-text-subtle)", whiteSpace: "nowrap" }}>{v ? fmtDate(v) : "—"}</span> },
    { key: "createdAt",     label: "Earned On", render: (v) => v ? fmtDate(v) : "—" },
  ]

  const commissionCard = (c) => {
    const st = COMMISSION_STATUS[c.status] ?? COMMISSION_STATUS.PENDING
    return (
      <div style={{ backgroundColor: "var(--color-surface)", border: "1px solid var(--color-border)", borderRadius: "14px", overflow: "hidden" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.875rem 1rem", borderBottom: "1px solid var(--color-border)", backgroundColor: "var(--color-bg-muted)" }}>
          <div style={{ minWidth: 0 }}>
            <p style={{ margin: 0, fontWeight: 700, fontSize: "0.9375rem", color: "var(--color-text)" }}>Transaction #{c.transactionId}</p>
            <p style={{ margin: "2px 0 0", fontSize: "0.75rem", color: "var(--color-text-muted)" }}>{c.recipientType}</p>
          </div>
          <span style={{ backgroundColor: st.bg, color: st.color, borderRadius: "999px", padding: "3px 10px", fontSize: "0.75rem", fontWeight: 600, flexShrink: 0, marginLeft: "0.75rem" }}>{st.label}</span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0 }}>
          <Cell label="Amount"   value={<span style={{ fontWeight: 700, color: "#15803D", fontSize: "1rem" }}>{fmtCurrencyFull(Number(c.amount))}</span>} border />
          <Cell label="Role"     value={roleBadge(c.recipientType)} />
          <Cell label="Earned"   value={c.createdAt ? fmtDate(c.createdAt) : "—"} border bottom />
          <Cell label="Paid On"  value={c.paidAt    ? fmtDate(c.paidAt)    : "—"} bottom />
        </div>
      </div>
    )
  }

  if (loading) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "60vh", gap: "0.75rem", color: "var(--color-text-muted)" }}>
      <Loader2 size={20} style={{ animation: "spin 1s linear infinite" }} /> Loading commissions…
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      <p style={{ margin: 0, fontWeight: 700, fontSize: "1.1rem", color: "var(--color-text)" }}>Commissions</p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "1rem" }}>
        <StatCard label="Total Earned" value={stats.total}   color="#15803D" />
        <StatCard label="Paid Out"     value={stats.paid}    color="#1D4ED8" />
        <StatCard label="Pending"      value={stats.pending} color="#C2410C" />
        <StatCard label="Records"      value={stats.count}   color="var(--color-primary)" />
      </div>

      <DataTable
        columns={columns} rows={pageRows} total={data.length} emptyMsg="No commission records"
        page={page} totalPages={totalPages} totalElements={data.length}
        pageSize={PAGE_SIZE} onPageChange={setPage} cardRender={commissionCard}
      />
    </div>
  )
}

function Cell({ label, value, border, bottom }) {
  return (
    <div style={{ padding: "0.75rem 1rem", borderRight: border ? "1px solid var(--color-border)" : "none", borderBottom: !bottom ? "1px solid var(--color-border)" : "none" }}>
      <p style={{ margin: "0 0 3px", fontSize: "0.72rem", fontWeight: 600, color: "var(--color-text-subtle)", textTransform: "uppercase", letterSpacing: "0.04em" }}>{label}</p>
      <div style={{ fontSize: "0.875rem", color: "var(--color-text-muted)", fontWeight: 500 }}>{value}</div>
    </div>
  )
}
