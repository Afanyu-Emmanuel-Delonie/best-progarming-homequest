import { useState, useMemo } from "react"
import { StatCard, Badge } from "../../../components/shared/AdminUI"
import DataTable from "../../../components/shared/DataTable"
import { fmtCurrency, fmtCurrencyFull, fmtDate } from "../../../utils/formatters"
import { COMMISSION_STATUS, AGENT_ROLE_STYLES, PAGE_SIZE } from "../../../constants/enums"

const MOCK = [
  { id: 1, transactionId: 2, propertyTitle: "Luxury Suburban Villa",   amount: 7452,  role: "LISTING", status: "PAID",    paidAt: "2025-07-10T00:00:00", createdAt: "2025-07-08T14:05:00" },
  { id: 2, transactionId: 6, propertyTitle: "Family House in Suburbs", amount: 6318,  role: "LISTING", status: "PAID",    paidAt: "2025-07-11T00:00:00", createdAt: "2025-07-09T15:45:00" },
  { id: 3, transactionId: 8, propertyTitle: "Mega Mansion Estate",     amount: 14175, role: "LISTING", status: "PAID",    paidAt: "2025-07-07T00:00:00", createdAt: "2025-07-05T08:00:00" },
  { id: 4, transactionId: 1, propertyTitle: "Modern Downtown Apt",     amount: 9179,  role: "SELLING", status: "PENDING", paidAt: null,                  createdAt: "2025-07-10T09:22:00" },
  { id: 5, transactionId: 9, propertyTitle: "Starter Home",            amount: 2389,  role: "LISTING", status: "PENDING", paidAt: null,                  createdAt: "2025-07-14T07:55:00" },
]

const roleBadge = (r) => { const s = AGENT_ROLE_STYLES[r]; return <Badge {...s} /> }

export default function CommissionsPage() {
  const [page, setPage] = useState(0)

  const stats = useMemo(() => ({
    total:   fmtCurrency(MOCK.reduce((s, c) => s + c.amount, 0)),
    paid:    fmtCurrency(MOCK.filter(c => c.status === "PAID").reduce((s, c) => s + c.amount, 0)),
    pending: fmtCurrency(MOCK.filter(c => c.status === "PENDING").reduce((s, c) => s + c.amount, 0)),
    count:   MOCK.length,
  }), [])

  const totalPages = Math.ceil(MOCK.length / PAGE_SIZE)
  const pageRows   = MOCK.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)

  const columns = [
    { key: "transactionId", label: "Txn",      render: (v) => <span style={{ color: "var(--color-primary)", fontWeight: 600 }}>#{v}</span> },
    { key: "propertyTitle", label: "Property", render: (v) => <span style={{ fontWeight: 500, color: "var(--color-text)" }}>{v}</span> },
    { key: "role",          label: "Role",     render: (v) => roleBadge(v) },
    { key: "amount",        label: "Amount",   render: (v) => <span style={{ fontWeight: 700, color: "#15803D" }}>{fmtCurrencyFull(v)}</span> },
    { key: "status",        label: "Status",   render: (v) => { const s = COMMISSION_STATUS[v]; return <span style={{ backgroundColor: s.bg, color: s.color, borderRadius: "999px", padding: "2px 10px", fontSize: "0.72rem", fontWeight: 600 }}>{s.label}</span> } },
    { key: "paidAt",        label: "Paid On",  render: (v) => <span style={{ color: "var(--color-text-subtle)", whiteSpace: "nowrap" }}>{v ? fmtDate(v) : "—"}</span> },
  ]

  const commissionCard = (c) => {
    const st = COMMISSION_STATUS[c.status]
    return (
      <div style={{ backgroundColor: "var(--color-surface)", border: "1px solid var(--color-border)", borderRadius: "14px", overflow: "hidden", boxShadow: "0 1px 4px #0000000a" }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.875rem 1rem", borderBottom: "1px solid var(--color-border)", backgroundColor: "var(--color-bg-muted)" }}>
          <div style={{ minWidth: 0 }}>
            <p style={{ margin: 0, fontWeight: 700, fontSize: "0.9375rem", color: "var(--color-text)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.propertyTitle}</p>
            <p style={{ margin: "2px 0 0", fontSize: "0.75rem", color: "var(--color-text-muted)" }}>Transaction #{c.transactionId}</p>
          </div>
          <span style={{ backgroundColor: st.bg, color: st.color, borderRadius: "999px", padding: "3px 10px", fontSize: "0.75rem", fontWeight: 600, flexShrink: 0, marginLeft: "0.75rem" }}>{st.label}</span>
        </div>
        {/* Body */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0 }}>
          <Cell label="Amount"  value={<span style={{ fontWeight: 700, color: "#15803D", fontSize: "1rem" }}>{fmtCurrencyFull(c.amount)}</span>} border />
          <Cell label="Role"    value={roleBadge(c.role)} />
          <Cell label="Earned"  value={fmtDate(c.createdAt)} border bottom />
          <Cell label="Paid On" value={c.paidAt ? fmtDate(c.paidAt) : "—"} bottom />
        </div>
      </div>
    )
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "1rem" }}>
        <StatCard label="Total Earned" value={stats.total}   color="#15803D" />
        <StatCard label="Paid Out"     value={stats.paid}    color="#1D4ED8" />
        <StatCard label="Pending"      value={stats.pending} color="#C2410C" />
        <StatCard label="Records"      value={stats.count}   color="var(--color-primary)" />
      </div>

      <DataTable
        columns={columns}
        rows={pageRows}
        total={MOCK.length}
        emptyMsg="No commission records"
        page={page}
        totalPages={totalPages}
        totalElements={MOCK.length}
        pageSize={PAGE_SIZE}
        onPageChange={setPage}
        cardRender={commissionCard}
      />
    </div>
  )
}

function Cell({ label, value, border, bottom }) {
  return (
    <div style={{
      padding: "0.75rem 1rem",
      borderRight:  border  ? "1px solid var(--color-border)" : "none",
      borderBottom: !bottom ? "1px solid var(--color-border)" : "none",
    }}>
      <p style={{ margin: "0 0 3px", fontSize: "0.72rem", fontWeight: 600, color: "var(--color-text-subtle)", textTransform: "uppercase", letterSpacing: "0.04em" }}>{label}</p>
      <div style={{ fontSize: "0.875rem", color: "var(--color-text-muted)", fontWeight: 500 }}>{value}</div>
    </div>
  )
}
