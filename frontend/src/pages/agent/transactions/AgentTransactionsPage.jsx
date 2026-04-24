import { useState, useMemo, useEffect } from "react"
import { Eye, Loader2 } from "lucide-react"
import DataTable from "../../../components/shared/DataTable"
import { StatCard, Toolbar, FilterGroup, Pill, ClearBtn, Badge, ActionsMenu } from "../../../components/shared/AdminUI"
import DetailsDrawer from "../../../components/shared/DetailsDrawer"
import { fmtCurrency, fmtCurrencyFull, fmtPct, fmtDate } from "../../../utils/formatters"
import { TRANSACTION_STATUS as STATUS_STYLES, AGENT_ROLE_STYLES, PAGE_SIZE } from "../../../constants/enums"
import { useFilterPanel } from "../../../hooks/useFilterPanel"
import { useTableData } from "../../../hooks/useTableData"
import { transactionsApi } from "../../../api/transactions.api"

export default function AgentTransactionsPage() {
  const [data, setData]           = useState([])
  const [loading, setLoading]     = useState(true)
  const [search, setSearch]       = useState("")
  const [statusFilter, setStatus] = useState("ALL")
  const [selected, setSelected]   = useState(null)
  const { filterRef, filterOpen, setFilterOpen } = useFilterPanel()

  useEffect(() => {
    // Merge listing + selling transactions, deduplicate by id, tag each with role
    Promise.all([
      transactionsApi.getMyListings(),
      transactionsApi.getMySales(),
    ]).then(([listings, sales]) => {
      const tagged = [
        ...(listings ?? []).map(t => ({ ...t, myRole: "LISTING" })),
        ...(sales    ?? []).map(t => ({ ...t, myRole: "SELLING" })),
      ]
      // deduplicate — if same id appears in both, keep SELLING (more specific)
      const map = new Map()
      tagged.forEach(t => {
        if (!map.has(t.id) || t.myRole === "SELLING") map.set(t.id, t)
      })
      setData([...map.values()])
    }).catch(() => {}).finally(() => setLoading(false))
  }, [])

  const stats = useMemo(() => ({
    total:     data.length,
    completed: data.filter(t => t.status === "COMPLETED").length,
    pending:   data.filter(t => t.status === "PENDING").length,
    earned:    fmtCurrency(data.filter(t => t.status === "COMPLETED")
      .reduce((s, t) => s + Number(t.myRole === "LISTING" ? t.listingAgentCommission : t.sellingAgentCommission ?? 0), 0)),
  }), [data])

  const filters = { search, statusFilter }
  const filterFn = (t, { search, statusFilter }) => {
    if (statusFilter !== "ALL" && t.status !== statusFilter) return false
    if (search.trim()) {
      const q = search.toLowerCase()
      if (!String(t.propertyId).includes(q) && !String(t.id).includes(q)) return false
    }
    return true
  }

  const { filtered, pageRows, sortKey, sortDir, handleSort, page, setPage, totalPages } =
    useTableData(data, filterFn, filters)

  const myCommission = (t) =>
    Number(t.myRole === "LISTING" ? t.listingAgentCommission : t.sellingAgentCommission ?? 0)

  const columns = [
    { key: "propertyId",  label: "Property",      render: (v) => <span style={{ fontWeight: 500, color: "var(--color-primary)" }}>#{v}</span> },
    { key: "myRole",      label: "My Role",        render: (v) => { const r = AGENT_ROLE_STYLES[v]; return r ? <Badge {...r} /> : v } },
    { key: "saleAmount",  label: "Sale",           render: (v) => <span style={{ fontWeight: 600 }}>{fmtCurrency(Number(v))}</span> },
    { key: "id",          label: "My Commission",  render: (_, t) => <span style={{ fontWeight: 600, color: "#15803D" }}>{fmtCurrency(myCommission(t))}</span> },
    { key: "status",      label: "Status",         render: (v) => { const s = STATUS_STYLES[v]; return s ? <Badge {...s} /> : v } },
    { key: "createdAt",   label: "Date",           render: (v) => v ? fmtDate(v) : "—" },
    { key: null,          label: "Actions",        render: (_, row) => <ActionsMenu items={[{ label: "View Details", icon: <Eye size={14} />, onClick: () => setSelected(row) }]} /> },
  ]

  const sel   = selected
  const selSt = sel ? STATUS_STYLES[sel.status] : null

  if (loading) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "60vh", gap: "0.75rem", color: "var(--color-text-muted)" }}>
      <Loader2 size={20} style={{ animation: "spin 1s linear infinite" }} /> Loading transactions…
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      <p style={{ margin: 0, fontWeight: 700, fontSize: "1.1rem", color: "var(--color-text)" }}>Transactions</p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "1rem" }}>
        <StatCard label="Total"     value={stats.total}     color="var(--color-primary)" />
        <StatCard label="Completed" value={stats.completed} color="#15803D" />
        <StatCard label="Pending"   value={stats.pending}   color="#C2410C" />
        <StatCard label="Earned"    value={stats.earned}    color="#15803D" />
      </div>

      <Toolbar search={search} onSearch={setSearch} placeholder="Search property ID, txn ID…" filterRef={filterRef} filterOpen={filterOpen} setFilterOpen={setFilterOpen} activeFilters={statusFilter !== "ALL" ? 1 : 0}>
        <FilterGroup label="Status">
          {["ALL","PENDING","COMPLETED","CANCELLED"].map(s => (
            <Pill key={s} active={statusFilter === s} onClick={() => setStatus(s)}>{s === "ALL" ? "All" : STATUS_STYLES[s]?.label ?? s}</Pill>
          ))}
        </FilterGroup>
        {statusFilter !== "ALL" && <ClearBtn onClick={() => setStatus("ALL")} />}
      </Toolbar>

      <DataTable columns={columns} rows={pageRows} total={filtered.length} emptyMsg="No transactions found"
        sortKey={sortKey} sortDir={sortDir} onSort={handleSort}
        page={page} totalPages={totalPages} totalElements={filtered.length} pageSize={PAGE_SIZE} onPageChange={setPage} />

      <DetailsDrawer
        open={!!sel} onClose={() => setSelected(null)}
        title={`Transaction #${sel?.id}`} subtitle={`Property #${sel?.propertyId}`}
        sections={sel ? [
          { heading: "Overview", rows: [
            { label: "Sale Amount",      value: fmtCurrencyFull(Number(sel.saleAmount)) },
            { label: "Commission Rate",  value: sel.commissionRate ? fmtPct(Number(sel.commissionRate)) : "—" },
            { label: "Total Commission", value: fmtCurrencyFull(Number(sel.totalCommission)) },
            { label: "My Commission",    value: fmtCurrencyFull(myCommission(sel)) },
            { label: "My Role",          value: sel.myRole === "LISTING" ? "Listing Agent" : "Selling Agent" },
            { label: "Status",           value: selSt && <Badge bg={selSt.bg} color={selSt.color} label={selSt.label} /> },
            { label: "Date",             value: sel.createdAt ? fmtDate(sel.createdAt) : "—" },
          ]},
        ] : []}
      />
    </div>
  )
}
