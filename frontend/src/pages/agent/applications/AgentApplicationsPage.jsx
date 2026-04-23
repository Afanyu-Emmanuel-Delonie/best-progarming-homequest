import { useState, useMemo } from "react"
import { Eye, CheckCircle, XCircle } from "lucide-react"
import DataTable from "../../../components/shared/DataTable"
import { StatCard, Toolbar, FilterGroup, Pill, ClearBtn, Badge, ActionsMenu } from "../../../components/shared/AdminUI"
import DetailsDrawer, { drawerPrimaryBtn } from "../../../components/shared/DetailsDrawer"
import { fmtCurrency, fmtCurrencyFull, fmtDate } from "../../../utils/formatters"
import { APPLICATION_STATUS as STATUS_STYLES, FUNDING_LABELS, PAGE_SIZE } from "../../../constants/enums"
import { useFilterPanel } from "../../../hooks/useFilterPanel"
import { useTableData } from "../../../hooks/useTableData"

const MOCK = [
  { id: 1,  propertyId: 101, propertyTitle: "Modern Downtown Apartment", buyerFullName: "Marcus Lee",       buyerPhone: "+1 555-0202", offerAmount: 485000,  depositAmount: 48500,  fundingSource: "BANK_MORTGAGE", proposedClosingDate: "2025-09-15", offerExpirationDate: "2025-08-01", status: "PENDING",  createdAt: "2025-07-10T09:22:00" },
  { id: 2,  propertyId: 104, propertyTitle: "Penthouse with City Views",  buyerFullName: "Fatima Al-Hassan",buyerPhone: "+1 555-0909", offerAmount: 1250000, depositAmount: 125000, fundingSource: "CASH",          proposedClosingDate: "2025-11-01", offerExpirationDate: "2025-08-20", status: "PENDING",  createdAt: "2025-07-12T16:30:00" },
  { id: 3,  propertyId: 106, propertyTitle: "Family House in Suburbs",    buyerFullName: "Emma Wilson",     buyerPhone: "+1 555-0505", offerAmount: 780000,  depositAmount: 78000,  fundingSource: "PAYMENT_PLAN",  proposedClosingDate: "2025-10-15", offerExpirationDate: "2025-08-05", status: "ACCEPTED", createdAt: "2025-07-09T15:45:00" },
  { id: 4,  propertyId: 101, propertyTitle: "Modern Downtown Apartment",  buyerFullName: "David Okafor",    buyerPhone: "+1 555-0404", offerAmount: 470000,  depositAmount: 47000,  fundingSource: "BANK_MORTGAGE", proposedClosingDate: "2025-09-20", offerExpirationDate: "2025-07-30", status: "REJECTED", createdAt: "2025-07-07T08:15:00" },
  { id: 5,  propertyId: 109, propertyTitle: "Starter Home",               buyerFullName: "Priya Patel",     buyerPhone: "+1 555-0303", offerAmount: 290000,  depositAmount: 29000,  fundingSource: "BANK_MORTGAGE", proposedClosingDate: "2025-10-01", offerExpirationDate: "2025-08-10", status: "ACCEPTED", createdAt: "2025-07-11T11:40:00" },
]

export default function AgentApplicationsPage() {
  const [data, setData]           = useState(MOCK)
  const [search, setSearch]       = useState("")
  const [statusFilter, setStatus] = useState("ALL")
  const [selected, setSelected]   = useState(null)
  const { filterRef, filterOpen, setFilterOpen } = useFilterPanel()

  const stats = useMemo(() => ({
    total:    data.length,
    pending:  data.filter(a => a.status === "PENDING").length,
    accepted: data.filter(a => a.status === "ACCEPTED").length,
    rejected: data.filter(a => a.status === "REJECTED").length,
  }), [data])

  const filters = { search, statusFilter }
  const filterFn = (a, { search, statusFilter }) => {
    if (statusFilter !== "ALL" && a.status !== statusFilter) return false
    if (search.trim()) {
      const q = search.toLowerCase()
      if (!a.buyerFullName.toLowerCase().includes(q) && !a.propertyTitle.toLowerCase().includes(q)) return false
    }
    return true
  }

  const { filtered, pageRows, sortKey, sortDir, handleSort, page, setPage, totalPages } =
    useTableData(data, filterFn, filters)

  const accept = (id) => { setData(p => p.map(a => a.id === id ? { ...a, status: "ACCEPTED" } : a)); setSelected(s => s?.id === id ? { ...s, status: "ACCEPTED" } : s) }
  const reject = (id) => { setData(p => p.map(a => a.id === id ? { ...a, status: "REJECTED" } : a)); setSelected(s => s?.id === id ? { ...s, status: "REJECTED" } : s) }

  const columns = [
    { key: "propertyTitle", label: "Property", render: (v) => <span style={{ fontWeight: 500, color: "var(--color-text)" }}>{v}</span> },
    { key: "buyerFullName", label: "Buyer",    render: (v, row) => <><p style={{ margin: 0, fontWeight: 500, color: "var(--color-text)" }}>{v}</p><p style={{ margin: 0, fontSize: "0.75rem", color: "var(--color-text-muted)" }}>{row.buyerPhone}</p></> },
    { key: "offerAmount",   label: "Offer",    render: (v) => <span style={{ fontWeight: 600, color: "var(--color-text)" }}>{fmtCurrency(v)}</span> },
    { key: "status",        label: "Status",   render: (v) => { const s = STATUS_STYLES[v]; return <Badge {...s} /> } },
    { key: "createdAt",     label: "Received", render: (v) => fmtDate(v) },
    { key: null,            label: "Actions",  render: (_, row) => (
      <ActionsMenu items={[
        { label: "View Details", icon: <Eye size={14} />, onClick: () => setSelected(row) },
        ...(row.status === "PENDING" ? [
          { label: "Accept", icon: <CheckCircle size={14} />, color: "#15803D", onClick: () => accept(row.id), dividerBefore: true },
          { label: "Reject", icon: <XCircle size={14} />,    color: "#B91C1C", onClick: () => reject(row.id) },
        ] : []),
      ]} />
    )},
  ]

  const sel  = selected
  const selSt = sel ? STATUS_STYLES[sel.status] : null

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "1rem" }}>
        <StatCard label="Total"    value={stats.total}    color="var(--color-primary)" />
        <StatCard label="Pending"  value={stats.pending}  color="#C2410C" />
        <StatCard label="Accepted" value={stats.accepted} color="#15803D" />
        <StatCard label="Rejected" value={stats.rejected} color="#B91C1C" />
      </div>

      <Toolbar search={search} onSearch={setSearch} placeholder="Search buyer, property…" filterRef={filterRef} filterOpen={filterOpen} setFilterOpen={setFilterOpen} activeFilters={statusFilter !== "ALL" ? 1 : 0}>
        <FilterGroup label="Status">
          {["ALL","PENDING","ACCEPTED","REJECTED","WITHDRAWN","EXPIRED"].map(s => <Pill key={s} active={statusFilter === s} onClick={() => setStatus(s)}>{s === "ALL" ? "All" : STATUS_STYLES[s].label}</Pill>)}
        </FilterGroup>
        {statusFilter !== "ALL" && <ClearBtn onClick={() => setStatus("ALL")} />}
      </Toolbar>

      <DataTable columns={columns} rows={pageRows} total={filtered.length} emptyMsg="No applications found" sortKey={sortKey} sortDir={sortDir} onSort={handleSort} page={page} totalPages={totalPages} totalElements={filtered.length} pageSize={PAGE_SIZE} onPageChange={setPage} />

      <DetailsDrawer
        open={!!sel} onClose={() => setSelected(null)}
        title={sel?.buyerFullName} subtitle={`Application #${sel?.id} · ${sel?.propertyTitle}`}
        sections={sel ? [
          { heading: "Offer", rows: [
            { label: "Offer Amount",   value: fmtCurrencyFull(sel.offerAmount) },
            { label: "Deposit",        value: fmtCurrencyFull(sel.depositAmount) },
            { label: "Funding",        value: FUNDING_LABELS[sel.fundingSource] },
            { label: "Status",         value: <Badge bg={selSt.bg} color={selSt.color} label={selSt.label} /> },
          ]},
          { heading: "Dates", rows: [
            { label: "Received",     value: fmtDate(sel.createdAt) },
            { label: "Closing Date", value: fmtDate(sel.proposedClosingDate) },
            { label: "Expires",      value: fmtDate(sel.offerExpirationDate) },
          ]},
          { heading: "Buyer", rows: [
            { label: "Name",  value: sel.buyerFullName },
            { label: "Phone", value: sel.buyerPhone },
          ]},
        ] : []}
        footer={sel?.status === "PENDING" && <>
          <button onClick={() => accept(sel.id)} style={drawerPrimaryBtn("#15803D")}><CheckCircle size={14} /> Accept</button>
          <button onClick={() => reject(sel.id)} style={drawerPrimaryBtn("#B91C1C")}><XCircle size={14} /> Reject</button>
        </>}
      />
    </div>
  )
}
