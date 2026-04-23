import { useState, useMemo } from "react"
import { CheckCircle, XCircle, Eye, Trash2 } from "lucide-react"
import DataTable from "../../components/shared/DataTable"
import { StatCard, Toolbar, FilterGroup, Pill, ClearBtn, Badge, ActionsMenu } from "../../components/shared/AdminUI"
import DetailsDrawer, { drawerPrimaryBtn, drawerOutlineBtn } from "../../components/shared/DetailsDrawer"
import { fmtCurrency, fmtCurrencyFull, fmtPct, fmtDate } from "../../utils/formatters"
import { TRANSACTION_STATUS as STATUS_STYLES, PAGE_SIZE } from "../../constants/enums"
import { useFilterPanel } from "../../hooks/useFilterPanel"
import { useTableData } from "../../hooks/useTableData"

const MOCK = [
  { id: 1,  propertyId: 101, listingAgentPublicId: "agent-001", sellingAgentPublicId: "agent-002", ownerPublicId: "owner-01", buyerPublicId: "client-01", companyId: 1, saleAmount: 485000,  commissionRate: 0.03, totalCommission: 14550,  companyCommission: 1455,  listingAgentCommission: 3916,  sellingAgentCommission: 9179,  type: "SALE", status: "PENDING",   createdAt: "2025-07-10T09:22:00" },
  { id: 2,  propertyId: 102, listingAgentPublicId: "agent-001", sellingAgentPublicId: "agent-003", ownerPublicId: "owner-02", buyerPublicId: "client-02", companyId: 1, saleAmount: 920000,  commissionRate: 0.03, totalCommission: 27600,  companyCommission: 2760,  listingAgentCommission: 7452,  sellingAgentCommission: 17388, type: "SALE", status: "COMPLETED", createdAt: "2025-07-08T14:05:00" },
  { id: 3,  propertyId: 103, listingAgentPublicId: "agent-002", sellingAgentPublicId: "agent-002", ownerPublicId: "owner-03", buyerPublicId: "client-03", companyId: 2, saleAmount: 2400,    commissionRate: 0.08, totalCommission: 192,    companyCommission: 19,    listingAgentCommission: 52,    sellingAgentCommission: 121,   type: "RENT", status: "COMPLETED", createdAt: "2025-07-07T11:00:00" },
  { id: 4,  propertyId: 104, listingAgentPublicId: "agent-003", sellingAgentPublicId: "agent-004", ownerPublicId: "owner-04", buyerPublicId: "client-04", companyId: 1, saleAmount: 1250000, commissionRate: 0.025,totalCommission: 31250,  companyCommission: 3125,  listingAgentCommission: 8437,  sellingAgentCommission: 19688, type: "SALE", status: "PENDING",   createdAt: "2025-07-12T16:30:00" },
  { id: 5,  propertyId: 105, listingAgentPublicId: "agent-004", sellingAgentPublicId: "agent-001", ownerPublicId: "owner-05", buyerPublicId: "client-05", companyId: 2, saleAmount: 560000,  commissionRate: 0.03, totalCommission: 16800,  companyCommission: 1680,  listingAgentCommission: 4536,  sellingAgentCommission: 10584, type: "SALE", status: "CANCELLED", createdAt: "2025-07-06T10:00:00" },
  { id: 6,  propertyId: 106, listingAgentPublicId: "agent-002", sellingAgentPublicId: "agent-003", ownerPublicId: "owner-06", buyerPublicId: "client-06", companyId: 1, saleAmount: 780000,  commissionRate: 0.03, totalCommission: 23400,  companyCommission: 2340,  listingAgentCommission: 6318,  sellingAgentCommission: 14742, type: "SALE", status: "COMPLETED", createdAt: "2025-07-09T15:45:00" },
  { id: 7,  propertyId: 107, listingAgentPublicId: "agent-003", sellingAgentPublicId: "agent-003", ownerPublicId: "owner-07", buyerPublicId: "client-07", companyId: 2, saleAmount: 1800,    commissionRate: 0.08, totalCommission: 144,    companyCommission: 14,    listingAgentCommission: 39,    sellingAgentCommission: 91,    type: "RENT", status: "PENDING",   createdAt: "2025-07-13T13:20:00" },
  { id: 8,  propertyId: 108, listingAgentPublicId: "agent-001", sellingAgentPublicId: "agent-004", ownerPublicId: "owner-08", buyerPublicId: "client-08", companyId: 1, saleAmount: 2100000, commissionRate: 0.025,totalCommission: 52500,  companyCommission: 5250,  listingAgentCommission: 14175, sellingAgentCommission: 33075, type: "SALE", status: "COMPLETED", createdAt: "2025-07-05T08:00:00" },
  { id: 9,  propertyId: 109, listingAgentPublicId: "agent-004", sellingAgentPublicId: "agent-002", ownerPublicId: "owner-09", buyerPublicId: "client-09", companyId: 2, saleAmount: 295000,  commissionRate: 0.03, totalCommission: 8850,   companyCommission: 885,   listingAgentCommission: 2389,  sellingAgentCommission: 5576,  type: "SALE", status: "PENDING",   createdAt: "2025-07-14T07:55:00" },
  { id: 10, propertyId: 110, listingAgentPublicId: "agent-002", sellingAgentPublicId: "agent-001", ownerPublicId: "owner-10", buyerPublicId: "client-10", companyId: 1, saleAmount: 3200,    commissionRate: 0.08, totalCommission: 256,    companyCommission: 26,    listingAgentCommission: 69,    sellingAgentCommission: 161,   type: "RENT", status: "CANCELLED", createdAt: "2025-07-03T12:30:00" },
]

export default function AdminTransactions() {
  const [data, setData]           = useState(MOCK)
  const [search, setSearch]       = useState("")
  const [statusFilter, setStatus] = useState("ALL")
  const [typeFilter, setType]     = useState("ALL")
  const [selected, setSelected]   = useState(null)
  const { filterRef, filterOpen, setFilterOpen } = useFilterPanel()

  const activeFilters = (statusFilter !== "ALL" ? 1 : 0) + (typeFilter !== "ALL" ? 1 : 0)

  const stats = useMemo(() => ({
    total:     data.length,
    pending:   data.filter(t => t.status === "PENDING").length,
    completed: data.filter(t => t.status === "COMPLETED").length,
    revenue:   fmtCurrency(data.filter(t => t.status === "COMPLETED").reduce((s, t) => s + t.saleAmount, 0)),
  }), [data])

  const filters = { search, statusFilter, typeFilter }
  const filterFn = (t, { search, statusFilter, typeFilter }) => {
    if (statusFilter !== "ALL" && t.status !== statusFilter) return false
    if (typeFilter   !== "ALL" && t.type   !== typeFilter)   return false
    if (search.trim()) {
      const q = search.toLowerCase()
      if (!String(t.id).includes(q) && !String(t.propertyId).includes(q)) return false
    }
    return true
  }

  const { filtered, pageRows, sortKey, sortDir, handleSort, page, setPage, totalPages } =
    useTableData(data, filterFn, filters)

  const complete = (id) => { setData(p => p.map(t => t.id === id ? { ...t, status: "COMPLETED" } : t)); syncSelected(id, "COMPLETED") }
  const cancel   = (id) => { setData(p => p.map(t => t.id === id ? { ...t, status: "CANCELLED" } : t)); syncSelected(id, "CANCELLED") }
  const syncSelected = (id, status) => setSelected(s => s?.id === id ? { ...s, status } : s)

  const columns = [
    { key: "propertyId",  label: "Property",  render: (v) => <span style={{ fontWeight: 600, color: "var(--color-primary)" }}>#{v}</span> },
    { key: "type",        label: "Type",      render: (v) => <Badge bg={v === "SALE" ? "#EFF6FF" : "#F5F3FF"} color={v === "SALE" ? "#1D4ED8" : "#6D28D9"} label={v} /> },
    { key: "saleAmount",  label: "Amount",    render: (v) => <span style={{ fontWeight: 600, color: "var(--color-text)" }}>{fmtCurrency(v)}</span> },
    { key: "totalCommission", label: "Commission", render: (v) => fmtCurrency(v) },
    { key: "status",      label: "Status",    render: (v) => { const s = STATUS_STYLES[v]; return <Badge {...s} /> } },
    { key: "createdAt",   label: "Date",      render: (v) => fmtDate(v) },
    { key: null,          label: "Actions",   render: (_, row) => (
      <ActionsMenu items={[
        { label: "View Details", icon: <Eye size={14} />, onClick: () => setSelected(row) },
        ...(row.status === "PENDING" ? [
          { label: "Complete", icon: <CheckCircle size={14} />, color: "#15803D", onClick: () => complete(row.id), dividerBefore: true },
          { label: "Cancel",   icon: <XCircle size={14} />,    color: "#B91C1C", onClick: () => cancel(row.id)   },
        ] : []),
      ]} />
    )},
  ]

  const sel = selected
  const selSt = sel ? STATUS_STYLES[sel.status] : null

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "1rem" }}>
        <StatCard label="Total"     value={stats.total}     color="var(--color-primary)" />
        <StatCard label="Pending"   value={stats.pending}   color="#C2410C" />
        <StatCard label="Completed" value={stats.completed} color="#15803D" />
        <StatCard label="Revenue"   value={stats.revenue}   color="var(--color-primary)" />
      </div>

      <Toolbar search={search} onSearch={setSearch} placeholder="Search ID, property…" filterRef={filterRef} filterOpen={filterOpen} setFilterOpen={setFilterOpen} activeFilters={activeFilters}>
        <FilterGroup label="Status">
          {["ALL","PENDING","COMPLETED","CANCELLED"].map(s => <Pill key={s} active={statusFilter === s} onClick={() => setStatus(s)}>{s === "ALL" ? "All" : STATUS_STYLES[s].label}</Pill>)}
        </FilterGroup>
        <FilterGroup label="Type">
          {["ALL","SALE","RENT"].map(t => <Pill key={t} active={typeFilter === t} onClick={() => setType(t)}>{t === "ALL" ? "All" : t.charAt(0) + t.slice(1).toLowerCase()}</Pill>)}
        </FilterGroup>
        {activeFilters > 0 && <ClearBtn onClick={() => { setStatus("ALL"); setType("ALL") }} />}
      </Toolbar>

      <DataTable columns={columns} rows={pageRows} total={filtered.length} emptyMsg="No transactions found" sortKey={sortKey} sortDir={sortDir} onSort={handleSort} page={page} totalPages={totalPages} totalElements={filtered.length} pageSize={PAGE_SIZE} onPageChange={setPage} />

      <DetailsDrawer
        open={!!sel}
        onClose={() => setSelected(null)}
        title={`Transaction #${sel?.id}`}
        subtitle={`Property #${sel?.propertyId} · ${sel?.type}`}
        sections={sel ? [
          { heading: "Overview", rows: [
            { label: "Sale Amount",      value: fmtCurrencyFull(sel.saleAmount)      },
            { label: "Commission Rate",  value: fmtPct(sel.commissionRate) },
            { label: "Total Commission", value: fmtCurrencyFull(sel.totalCommission) },
            { label: "Status",           value: <Badge bg={selSt.bg} color={selSt.color} label={selSt.label} /> },
            { label: "Date",             value: fmtDate(sel.createdAt)   },
          ]},
          { heading: "Commission Breakdown", rows: [
            { label: "Company Fee",           value: fmtCurrencyFull(sel.companyCommission)       },
            { label: "Listing Agent",         value: fmtCurrencyFull(sel.listingAgentCommission)  },
            { label: "Selling Agent",         value: fmtCurrencyFull(sel.sellingAgentCommission)  },
          ]},
          { heading: "Parties", rows: [
            { label: "Listing Agent",  value: sel.listingAgentPublicId  },
            { label: "Selling Agent",  value: sel.sellingAgentPublicId  },
            { label: "Owner",          value: sel.ownerPublicId         },
            { label: "Buyer",          value: sel.buyerPublicId         },
            { label: "Company",        value: `#${sel.companyId}`       },
          ]},
        ] : []}
        footer={sel?.status === "PENDING" && <>
          <button onClick={() => complete(sel.id)} style={drawerPrimaryBtn("#15803D")}><CheckCircle size={14} /> Complete</button>
          <button onClick={() => cancel(sel.id)}   style={drawerPrimaryBtn("#B91C1C")}><XCircle size={14} /> Cancel</button>
        </>}
      />
    </div>
  )
}
