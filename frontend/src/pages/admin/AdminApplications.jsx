import { useState, useMemo } from "react"
import { CheckCircle, XCircle, RotateCcw, Eye, Trash2 } from "lucide-react"
import DataTable from "../../components/shared/DataTable"
import { StatCard, Toolbar, FilterGroup, Pill, ClearBtn, Badge, ActionsMenu } from "../../components/shared/AdminUI"
import DetailsDrawer, { drawerPrimaryBtn, drawerOutlineBtn } from "../../components/shared/DetailsDrawer"
import { fmtCurrency, fmtCurrencyFull, fmtDate } from "../../utils/formatters"
import { APPLICATION_STATUS as STATUS_STYLES, FUNDING_LABELS, PAGE_SIZE } from "../../constants/enums"
import { useFilterPanel } from "../../hooks/useFilterPanel"
import { useTableData } from "../../hooks/useTableData"

const MOCK = [
  { id: 1,  propertyId: 101, buyerFullName: "Sarah Johnson",    buyerPhone: "+1 555-0101", offerAmount: 485000,  depositAmount: 48500,  fundingSource: "BANK_MORTGAGE", proposedClosingDate: "2025-09-15", offerExpirationDate: "2025-08-01", status: "PENDING",   createdAt: "2025-07-10T09:22:00" },
  { id: 2,  propertyId: 102, buyerFullName: "Marcus Lee",       buyerPhone: "+1 555-0202", offerAmount: 920000,  depositAmount: 92000,  fundingSource: "CASH",          proposedClosingDate: "2025-08-30", offerExpirationDate: "2025-07-28", status: "ACCEPTED",  createdAt: "2025-07-08T14:05:00" },
  { id: 3,  propertyId: 103, buyerFullName: "Priya Patel",      buyerPhone: "+1 555-0303", offerAmount: 310000,  depositAmount: 31000,  fundingSource: "PAYMENT_PLAN",  proposedClosingDate: "2025-10-01", offerExpirationDate: "2025-08-10", status: "PENDING",   createdAt: "2025-07-11T11:40:00" },
  { id: 4,  propertyId: 101, buyerFullName: "David Okafor",     buyerPhone: "+1 555-0404", offerAmount: 470000,  depositAmount: 47000,  fundingSource: "BANK_MORTGAGE", proposedClosingDate: "2025-09-20", offerExpirationDate: "2025-07-30", status: "REJECTED",  createdAt: "2025-07-07T08:15:00" },
  { id: 5,  propertyId: 104, buyerFullName: "Emma Wilson",      buyerPhone: "+1 555-0505", offerAmount: 1250000, depositAmount: 125000, fundingSource: "CASH",          proposedClosingDate: "2025-11-01", offerExpirationDate: "2025-08-20", status: "PENDING",   createdAt: "2025-07-12T16:30:00" },
  { id: 6,  propertyId: 105, buyerFullName: "James Nguyen",     buyerPhone: "+1 555-0606", offerAmount: 560000,  depositAmount: 56000,  fundingSource: "BANK_MORTGAGE", proposedClosingDate: "2025-09-10", offerExpirationDate: "2025-07-25", status: "WITHDRAWN", createdAt: "2025-07-06T10:00:00" },
  { id: 7,  propertyId: 106, buyerFullName: "Aisha Malik",      buyerPhone: "+1 555-0707", offerAmount: 780000,  depositAmount: 78000,  fundingSource: "PAYMENT_PLAN",  proposedClosingDate: "2025-10-15", offerExpirationDate: "2025-08-05", status: "PENDING",   createdAt: "2025-07-13T13:20:00" },
  { id: 8,  propertyId: 107, buyerFullName: "Carlos Rivera",    buyerPhone: "+1 555-0808", offerAmount: 430000,  depositAmount: 43000,  fundingSource: "CASH",          proposedClosingDate: "2025-08-25", offerExpirationDate: "2025-07-22", status: "EXPIRED",   createdAt: "2025-07-01T09:00:00" },
  { id: 9,  propertyId: 108, buyerFullName: "Fatima Al-Hassan", buyerPhone: "+1 555-0909", offerAmount: 2100000, depositAmount: 210000, fundingSource: "CASH",          proposedClosingDate: "2025-12-01", offerExpirationDate: "2025-09-01", status: "ACCEPTED",  createdAt: "2025-07-09T15:45:00" },
  { id: 10, propertyId: 109, buyerFullName: "Tom Bradley",      buyerPhone: "+1 555-1010", offerAmount: 295000,  depositAmount: 29500,  fundingSource: "BANK_MORTGAGE", proposedClosingDate: "2025-10-20", offerExpirationDate: "2025-08-15", status: "PENDING",   createdAt: "2025-07-14T07:55:00" },
]

export default function AdminApplications() {
  const [data, setData]             = useState(MOCK)
  const [search, setSearch]         = useState("")
  const [statusFilter, setStatus]   = useState("ALL")
  const [fundingFilter, setFunding] = useState("ALL")
  const [selected, setSelected]     = useState(null)
  const { filterRef, filterOpen, setFilterOpen } = useFilterPanel()

  const activeFilters = (statusFilter !== "ALL" ? 1 : 0) + (fundingFilter !== "ALL" ? 1 : 0)

  const stats = useMemo(() => ({
    total:    data.length,
    pending:  data.filter(a => a.status === "PENDING").length,
    accepted: data.filter(a => a.status === "ACCEPTED").length,
    rejected: data.filter(a => a.status === "REJECTED").length,
  }), [data])

  const filters = { search, statusFilter, fundingFilter }
  const filterFn = (a, { search, statusFilter, fundingFilter }) => {
    if (statusFilter  !== "ALL" && a.status        !== statusFilter)  return false
    if (fundingFilter !== "ALL" && a.fundingSource !== fundingFilter) return false
    if (search.trim()) {
      const q = search.toLowerCase()
      if (!a.buyerFullName.toLowerCase().includes(q) && !String(a.propertyId).includes(q) && !String(a.id).includes(q)) return false
    }
    return true
  }

  const { filtered, pageRows, sortKey, sortDir, handleSort, page, setPage, totalPages } =
    useTableData(data, filterFn, filters)

  const accept   = (id) => { setData(p => p.map(a => a.id === id ? { ...a, status: "ACCEPTED"  } : a)); syncSelected(id, "ACCEPTED")  }
  const reject   = (id) => { setData(p => p.map(a => a.id === id ? { ...a, status: "REJECTED"  } : a)); syncSelected(id, "REJECTED")  }
  const withdraw = (id) => { setData(p => p.map(a => a.id === id ? { ...a, status: "WITHDRAWN" } : a)); syncSelected(id, "WITHDRAWN") }
  const remove   = (id) => { setData(p => p.filter(a => a.id !== id)); setSelected(s => s?.id === id ? null : s) }
  const syncSelected = (id, status) => setSelected(s => s?.id === id ? { ...s, status } : s)

  const columns = [
    { key: "buyerFullName", label: "Buyer",     render: (v, row) => <><p style={{ margin: 0, fontWeight: 500, color: "var(--color-text)" }}>{v}</p><p style={{ margin: 0, fontSize: "0.75rem", color: "var(--color-text-muted)" }}>{row.buyerPhone}</p></> },
    { key: "propertyId",   label: "Property",  render: (v) => <span style={{ fontWeight: 500, color: "var(--color-primary)" }}>#{v}</span> },
    { key: "offerAmount",  label: "Offer",     render: (v) => <span style={{ fontWeight: 600, color: "var(--color-text)" }}>{fmtCurrency(v)}</span> },
    { key: "status",       label: "Status",    render: (v) => { const s = STATUS_STYLES[v]; return <Badge {...s} /> } },
    { key: "createdAt",    label: "Submitted", render: (v) => fmtDate(v) },
    { key: null,           label: "Actions",   render: (_, row) => {
      const st = row.status
      return (
        <ActionsMenu items={[
          { label: "View Details", icon: <Eye size={14} />, onClick: () => setSelected(row) },
          ...(st === "PENDING" ? [
            { label: "Accept",   icon: <CheckCircle size={14} />, color: "#15803D", onClick: () => accept(row.id),   dividerBefore: true },
            { label: "Reject",   icon: <XCircle size={14} />,     color: "#B91C1C", onClick: () => reject(row.id)   },
          ] : []),
          ...(st === "ACCEPTED" ? [
            { label: "Withdraw", icon: <RotateCcw size={14} />,   color: "#737373", onClick: () => withdraw(row.id), dividerBefore: true },
          ] : []),
          { label: "Delete", icon: <Trash2 size={14} />, color: "#B91C1C", onClick: () => remove(row.id), dividerBefore: true },
        ]} />
      )
    }},
  ]

  const sel = selected
  const selSt = sel ? STATUS_STYLES[sel.status] : null

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "1rem" }}>
        {[
          { label: "Total",    value: stats.total,    color: "var(--color-primary)" },
          { label: "Pending",  value: stats.pending,  color: "#C2410C" },
          { label: "Accepted", value: stats.accepted, color: "#15803D" },
          { label: "Rejected", value: stats.rejected, color: "#B91C1C" },
        ].map(s => <StatCard key={s.label} {...s} />)}
      </div>

      <Toolbar search={search} onSearch={setSearch} placeholder="Search buyer, property ID…" filterRef={filterRef} filterOpen={filterOpen} setFilterOpen={setFilterOpen} activeFilters={activeFilters}>
        <FilterGroup label="Status">
          {["ALL","PENDING","ACCEPTED","REJECTED","WITHDRAWN","EXPIRED"].map(s => <Pill key={s} active={statusFilter === s} onClick={() => setStatus(s)}>{s === "ALL" ? "All" : STATUS_STYLES[s].label}</Pill>)}
        </FilterGroup>
        <FilterGroup label="Funding Source">
          {["ALL","CASH","BANK_MORTGAGE","PAYMENT_PLAN"].map(f => <Pill key={f} active={fundingFilter === f} onClick={() => setFunding(f)}>{f === "ALL" ? "All" : FUNDING_LABELS[f]}</Pill>)}
        </FilterGroup>
        {activeFilters > 0 && <ClearBtn onClick={() => { setStatus("ALL"); setFunding("ALL") }} />}
      </Toolbar>

      <DataTable columns={columns} rows={pageRows} total={filtered.length} emptyMsg="No applications found" sortKey={sortKey} sortDir={sortDir} onSort={handleSort} page={page} totalPages={totalPages} totalElements={filtered.length} pageSize={PAGE_SIZE} onPageChange={setPage} />

      <DetailsDrawer
        open={!!sel}
        onClose={() => setSelected(null)}
        title={sel?.buyerFullName}
        subtitle={`Application #${sel?.id} · Property #${sel?.propertyId}`}
        sections={sel ? [
          { heading: "Offer", rows: [
            { label: "Offer Amount",   value: fmtCurrencyFull(sel.offerAmount)   },
            { label: "Deposit",        value: fmtCurrencyFull(sel.depositAmount) },
            { label: "Funding Source", value: FUNDING_LABELS[sel.fundingSource] },
            { label: "Status",         value: <Badge bg={selSt.bg} color={selSt.color} label={selSt.label} /> },
          ]},
          { heading: "Dates", rows: [
            { label: "Submitted",       value: fmtDate(sel.createdAt)            },
            { label: "Closing Date",    value: fmtDate(sel.proposedClosingDate)  },
            { label: "Offer Expires",   value: fmtDate(sel.offerExpirationDate)  },
          ]},
          { heading: "Buyer", rows: [
            { label: "Full Name", value: sel.buyerFullName },
            { label: "Phone",     value: sel.buyerPhone    },
          ]},
        ] : []}
        footer={sel && <>
          {sel.status === "PENDING" && <>
            <button onClick={() => accept(sel.id)}   style={drawerPrimaryBtn("#15803D")}><CheckCircle size={14} /> Accept</button>
            <button onClick={() => reject(sel.id)}   style={drawerPrimaryBtn("#B91C1C")}><XCircle size={14} /> Reject</button>
          </>}
          {sel.status === "ACCEPTED" && <button onClick={() => withdraw(sel.id)} style={drawerOutlineBtn("#737373")}><RotateCcw size={14} /> Withdraw</button>}
        </>}
      />
    </div>
  )
}
