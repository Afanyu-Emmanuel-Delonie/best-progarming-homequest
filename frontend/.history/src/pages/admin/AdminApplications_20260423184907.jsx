import { useState, useMemo, useRef, useEffect } from "react"
import { CheckCircle, XCircle, RotateCcw, Search, SlidersHorizontal } from "lucide-react"
import DataTable from "../../components/shared/DataTable"
import { StatCard, Toolbar, FilterGroup, Pill, ClearBtn, Badge, ActionBtn } from "../../components/shared/AdminUI"

const MOCK = [
  { id: 1,  propertyId: 101, buyerFullName: "Sarah Johnson",    buyerPhone: "+1 555-0101", offerAmount: 485000,  depositAmount: 48500,  fundingSource: "BANK_MORTGAGE", proposedClosingDate: "2025-09-15", status: "PENDING",   createdAt: "2025-07-10T09:22:00" },
  { id: 2,  propertyId: 102, buyerFullName: "Marcus Lee",       buyerPhone: "+1 555-0202", offerAmount: 920000,  depositAmount: 92000,  fundingSource: "CASH",          proposedClosingDate: "2025-08-30", status: "ACCEPTED",  createdAt: "2025-07-08T14:05:00" },
  { id: 3,  propertyId: 103, buyerFullName: "Priya Patel",      buyerPhone: "+1 555-0303", offerAmount: 310000,  depositAmount: 31000,  fundingSource: "PAYMENT_PLAN",  proposedClosingDate: "2025-10-01", status: "PENDING",   createdAt: "2025-07-11T11:40:00" },
  { id: 4,  propertyId: 101, buyerFullName: "David Okafor",     buyerPhone: "+1 555-0404", offerAmount: 470000,  depositAmount: 47000,  fundingSource: "BANK_MORTGAGE", proposedClosingDate: "2025-09-20", status: "REJECTED",  createdAt: "2025-07-07T08:15:00" },
  { id: 5,  propertyId: 104, buyerFullName: "Emma Wilson",      buyerPhone: "+1 555-0505", offerAmount: 1250000, depositAmount: 125000, fundingSource: "CASH",          proposedClosingDate: "2025-11-01", status: "PENDING",   createdAt: "2025-07-12T16:30:00" },
  { id: 6,  propertyId: 105, buyerFullName: "James Nguyen",     buyerPhone: "+1 555-0606", offerAmount: 560000,  depositAmount: 56000,  fundingSource: "BANK_MORTGAGE", proposedClosingDate: "2025-09-10", status: "WITHDRAWN", createdAt: "2025-07-06T10:00:00" },
  { id: 7,  propertyId: 106, buyerFullName: "Aisha Malik",      buyerPhone: "+1 555-0707", offerAmount: 780000,  depositAmount: 78000,  fundingSource: "PAYMENT_PLAN",  proposedClosingDate: "2025-10-15", status: "PENDING",   createdAt: "2025-07-13T13:20:00" },
  { id: 8,  propertyId: 107, buyerFullName: "Carlos Rivera",    buyerPhone: "+1 555-0808", offerAmount: 430000,  depositAmount: 43000,  fundingSource: "CASH",          proposedClosingDate: "2025-08-25", status: "EXPIRED",   createdAt: "2025-07-01T09:00:00" },
  { id: 9,  propertyId: 108, buyerFullName: "Fatima Al-Hassan", buyerPhone: "+1 555-0909", offerAmount: 2100000, depositAmount: 210000, fundingSource: "CASH",          proposedClosingDate: "2025-12-01", status: "ACCEPTED",  createdAt: "2025-07-09T15:45:00" },
  { id: 10, propertyId: 109, buyerFullName: "Tom Bradley",      buyerPhone: "+1 555-1010", offerAmount: 295000,  depositAmount: 29500,  fundingSource: "BANK_MORTGAGE", proposedClosingDate: "2025-10-20", status: "PENDING",   createdAt: "2025-07-14T07:55:00" },
]

const STATUS_STYLES  = {
  PENDING:   { bg: "#FFF7ED", color: "#C2410C", label: "Pending"   },
  ACCEPTED:  { bg: "#F0FDF4", color: "#15803D", label: "Accepted"  },
  REJECTED:  { bg: "#FEF2F2", color: "#B91C1C", label: "Rejected"  },
  WITHDRAWN: { bg: "#F5F5F5", color: "#525252", label: "Withdrawn" },
  EXPIRED:   { bg: "#FAFAFA", color: "#737373", label: "Expired"   },
}
const FUNDING_LABELS = { CASH: "Cash", BANK_MORTGAGE: "Bank Mortgage", PAYMENT_PLAN: "Payment Plan" }
const fmt     = (n) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n)
const fmtDate = (d) => new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })

export default function AdminApplications() {
  const [data, setData]             = useState(MOCK)
  const [search, setSearch]         = useState("")
  const [statusFilter, setStatus]   = useState("ALL")
  const [fundingFilter, setFunding] = useState("ALL")
  const [sortKey, setSortKey]       = useState("createdAt")
  const [sortDir, setSortDir]       = useState("desc")
  const [filterOpen, setFilterOpen] = useState(false)
  const filterRef = useRef(null)

  useEffect(() => {
    const h = (e) => { if (filterRef.current && !filterRef.current.contains(e.target)) setFilterOpen(false) }
    document.addEventListener("mousedown", h)
    return () => document.removeEventListener("mousedown", h)
  }, [])

  const activeFilters = (statusFilter !== "ALL" ? 1 : 0) + (fundingFilter !== "ALL" ? 1 : 0)

  const stats = useMemo(() => ({
    total: data.length,
    pending:  data.filter(a => a.status === "PENDING").length,
    accepted: data.filter(a => a.status === "ACCEPTED").length,
    rejected: data.filter(a => a.status === "REJECTED").length,
  }), [data])

  const filtered = useMemo(() => {
    let rows = data
    if (statusFilter !== "ALL")  rows = rows.filter(a => a.status === statusFilter)
    if (fundingFilter !== "ALL") rows = rows.filter(a => a.fundingSource === fundingFilter)
    if (search.trim()) {
      const q = search.toLowerCase()
      rows = rows.filter(a => a.buyerFullName.toLowerCase().includes(q) || String(a.propertyId).includes(q) || String(a.id).includes(q))
    }
    return [...rows].sort((a, b) => {
      let av = a[sortKey], bv = b[sortKey]
      if (typeof av === "string") { av = av.toLowerCase(); bv = bv.toLowerCase() }
      return sortDir === "asc" ? (av > bv ? 1 : -1) : (av < bv ? 1 : -1)
    })
  }, [data, search, statusFilter, fundingFilter, sortKey, sortDir])

  const handleSort = (key) => {
    if (sortKey === key) setSortDir(d => d === "asc" ? "desc" : "asc")
    else { setSortKey(key); setSortDir("asc") }
  }

  const updateStatus = (id, status) =>
    setData(prev => prev.map(a => a.id === id ? { ...a, status } : a))

  const columns = [
    { key: "id",                 label: "ID",       render: (v) => `#${v}` },
    { key: "propertyId",         label: "Property", render: (v) => <span style={{ fontWeight: 500, color: "var(--color-primary)" }}>#{v}</span> },
    { key: "buyerFullName",      label: "Buyer",    render: (v, row) => <><p style={{ margin: 0, fontWeight: 500, color: "var(--color-text)" }}>{v}</p><p style={{ margin: 0, fontSize: "0.75rem", color: "var(--color-text-muted)" }}>{row.buyerPhone}</p></> },
    { key: "offerAmount",        label: "Offer",    render: (v) => <span style={{ fontWeight: 600, color: "var(--color-text)" }}>{fmt(v)}</span> },
    { key: "depositAmount",      label: "Deposit",  render: (v) => fmt(v) },
    { key: "fundingSource",      label: "Funding",  render: (v) => FUNDING_LABELS[v] },
    { key: "proposedClosingDate",label: "Closing",  render: (v) => fmtDate(v) },
    { key: "status",             label: "Status",   render: (v) => { const s = STATUS_STYLES[v]; return <Badge {...s} /> } },
    { key: "createdAt",          label: "Submitted",render: (v) => fmtDate(v) },
    { key: null,                 label: "Actions",  render: (_, row) => (
      <div style={{ display: "flex", gap: "0.4rem" }}>
        {row.status === "PENDING" && <>
          <ActionBtn color="#15803D" onClick={() => updateStatus(row.id, "ACCEPTED")} title="Accept"><CheckCircle size={15} /></ActionBtn>
          <ActionBtn color="#B91C1C" onClick={() => updateStatus(row.id, "REJECTED")} title="Reject"><XCircle size={15} /></ActionBtn>
        </>}
        {row.status === "ACCEPTED" && <ActionBtn color="#737373" onClick={() => updateStatus(row.id, "WITHDRAWN")} title="Withdraw"><RotateCcw size={15} /></ActionBtn>}
        {["REJECTED","WITHDRAWN","EXPIRED"].includes(row.status) && <span style={{ fontSize: "0.75rem", color: "var(--color-text-subtle)" }}>—</span>}
      </div>
    )},
  ]

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

      <DataTable columns={columns} rows={filtered} total={data.length} emptyMsg="No applications found" sortKey={sortKey} sortDir={sortDir} onSort={handleSort} />
    </div>
  )
}


