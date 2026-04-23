import { useState, useMemo } from "react"
import { Eye } from "lucide-react"
import DataTable from "../../../components/shared/DataTable"
import { StatCard, Toolbar, FilterGroup, Pill, ClearBtn, Badge, ActionsMenu } from "../../../components/shared/AdminUI"
import DetailsDrawer from "../../../components/shared/DetailsDrawer"
import { fmtCurrency, fmtCurrencyFull, fmtPct, fmtDate } from "../../../utils/formatters"
import { TRANSACTION_STATUS as STATUS_STYLES, AGENT_ROLE_STYLES, PAGE_SIZE } from "../../../constants/enums"
import { useFilterPanel } from "../../../hooks/useFilterPanel"
import { useTableData } from "../../../hooks/useTableData"

const MOCK = [
  { id: 1, propertyId: 101, propertyTitle: "Modern Downtown Apartment", saleAmount: 485000,  commissionRate: 0.03, totalCommission: 14550,  myCommission: 9179,  role: "SELLING", status: "PENDING",   createdAt: "2025-07-10T09:22:00" },
  { id: 2, propertyId: 102, propertyTitle: "Luxury Suburban Villa",     saleAmount: 920000,  commissionRate: 0.03, totalCommission: 27600,  myCommission: 7452,  role: "LISTING", status: "COMPLETED", createdAt: "2025-07-08T14:05:00" },
  { id: 6, propertyId: 106, propertyTitle: "Family House in Suburbs",   saleAmount: 780000,  commissionRate: 0.03, totalCommission: 23400,  myCommission: 6318,  role: "LISTING", status: "COMPLETED", createdAt: "2025-07-09T15:45:00" },
  { id: 8, propertyId: 108, propertyTitle: "Mega Mansion Estate",       saleAmount: 2100000, commissionRate: 0.025,totalCommission: 52500,  myCommission: 14175, role: "LISTING", status: "COMPLETED", createdAt: "2025-07-05T08:00:00" },
  { id: 9, propertyId: 109, propertyTitle: "Starter Home",              saleAmount: 295000,  commissionRate: 0.03, totalCommission: 8850,   myCommission: 2389,  role: "LISTING", status: "PENDING",   createdAt: "2025-07-14T07:55:00" },
]

export default function AgentTransactionsPage() {
  const [data]                 = useState(MOCK)
  const [search, setSearch]    = useState("")
  const [statusFilter, setStatus] = useState("ALL")
  const [selected, setSelected]   = useState(null)
  const { filterRef, filterOpen, setFilterOpen } = useFilterPanel()

  const stats = useMemo(() => ({
    total:     data.length,
    completed: data.filter(t => t.status === "COMPLETED").length,
    pending:   data.filter(t => t.status === "PENDING").length,
    earned:    fmtCurrency(data.filter(t => t.status === "COMPLETED").reduce((s, t) => s + t.myCommission, 0)),
  }), [data])

  const filters = { search, statusFilter }
  const filterFn = (t, { search, statusFilter }) => {
    if (statusFilter !== "ALL" && t.status !== statusFilter) return false
    if (search.trim()) {
      const q = search.toLowerCase()
      if (!t.propertyTitle.toLowerCase().includes(q) && !String(t.id).includes(q)) return false
    }
    return true
  }

  const { filtered, pageRows, sortKey, sortDir, handleSort, page, setPage, totalPages } =
    useTableData(data, filterFn, filters)

  const columns = [
    { key: "propertyTitle", label: "Property",   render: (v) => <span style={{ fontWeight: 500, color: "var(--color-text)" }}>{v}</span> },
    { key: "role",          label: "My Role",    render: (v) => { const r = AGENT_ROLE_STYLES[v]; return <Badge {...r} /> } },
    { key: "saleAmount",    label: "Sale",       render: (v) => <span style={{ fontWeight: 600 }}>{fmtCurrency(v)}</span> },
    { key: "myCommission",  label: "My Commission", render: (v) => <span style={{ fontWeight: 600, color: "#15803D" }}>{fmtCurrency(v)}</span> },
    { key: "status",        label: "Status",     render: (v) => { const s = STATUS_STYLES[v]; return <Badge {...s} /> } },
    { key: "createdAt",     label: "Date",       render: (v) => fmtDate(v) },
    { key: null,            label: "Actions",    render: (_, row) => <ActionsMenu items={[{ label: "View Details", icon: <Eye size={14} />, onClick: () => setSelected(row) }]} /> },
  ]

  const sel  = selected
  const selSt = sel ? STATUS_STYLES[sel.status] : null

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "1rem" }}>
        <StatCard label="Total"     value={stats.total}     color="var(--color-primary)" />
        <StatCard label="Completed" value={stats.completed} color="#15803D" />
        <StatCard label="Pending"   value={stats.pending}   color="#C2410C" />
        <StatCard label="Earned"    value={stats.earned}    color="#15803D" />
      </div>

      <Toolbar search={search} onSearch={setSearch} placeholder="Search property, ID…" filterRef={filterRef} filterOpen={filterOpen} setFilterOpen={setFilterOpen} activeFilters={statusFilter !== "ALL" ? 1 : 0}>
        <FilterGroup label="Status">
          {["ALL","PENDING","COMPLETED","CANCELLED"].map(s => <Pill key={s} active={statusFilter === s} onClick={() => setStatus(s)}>{s === "ALL" ? "All" : STATUS_STYLES[s].label}</Pill>)}
        </FilterGroup>
        {statusFilter !== "ALL" && <ClearBtn onClick={() => setStatus("ALL")} />}
      </Toolbar>

      <DataTable columns={columns} rows={pageRows} total={filtered.length} emptyMsg="No transactions found" sortKey={sortKey} sortDir={sortDir} onSort={handleSort} page={page} totalPages={totalPages} totalElements={filtered.length} pageSize={PAGE_SIZE} onPageChange={setPage} />

      <DetailsDrawer
        open={!!sel} onClose={() => setSelected(null)}
        title={`Transaction #${sel?.id}`} subtitle={sel?.propertyTitle}
        sections={sel ? [
          { heading: "Overview", rows: [
            { label: "Sale Amount",      value: fmtCurrencyFull(sel.saleAmount) },
            { label: "Commission Rate",  value: fmtPct(sel.commissionRate) },
            { label: "Total Commission", value: fmtCurrencyFull(sel.totalCommission) },
            { label: "My Commission",    value: fmtCurrencyFull(sel.myCommission) },
            { label: "My Role",          value: sel.role === "LISTING" ? "Listing Agent" : "Selling Agent" },
            { label: "Status",           value: <Badge bg={selSt.bg} color={selSt.color} label={selSt.label} /> },
            { label: "Date",             value: fmtDate(sel.createdAt) },
          ]},
        ] : []}
      />
    </div>
  )
}
