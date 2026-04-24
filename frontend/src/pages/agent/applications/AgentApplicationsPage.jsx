import { useState, useMemo, useEffect } from "react"
import { Eye, CheckCircle, XCircle, Loader2 } from "lucide-react"
import DataTable from "../../../components/shared/DataTable"
import { StatCard, Toolbar, FilterGroup, Pill, ClearBtn, Badge, ActionsMenu } from "../../../components/shared/AdminUI"
import DetailsDrawer, { drawerPrimaryBtn } from "../../../components/shared/DetailsDrawer"
import { fmtCurrency, fmtCurrencyFull, fmtDate } from "../../../utils/formatters"
import { APPLICATION_STATUS as STATUS_STYLES, FUNDING_LABELS, PAGE_SIZE } from "../../../constants/enums"
import { useFilterPanel } from "../../../hooks/useFilterPanel"
import { useTableData } from "../../../hooks/useTableData"
import { applicationsApi } from "../../../api/applications.api"
import { toast } from "react-toastify"

export default function AgentApplicationsPage() {
  const [data, setData]           = useState([])
  const [loading, setLoading]     = useState(true)
  const [search, setSearch]       = useState("")
  const [statusFilter, setStatus] = useState("ALL")
  const [selected, setSelected]   = useState(null)
  const { filterRef, filterOpen, setFilterOpen } = useFilterPanel()

  useEffect(() => {
    applicationsApi.getMyListings({ page: 0, size: 100 })
      .then(res => setData(res.content ?? res ?? []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

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
      if (!(a.buyerFullName ?? "").toLowerCase().includes(q) && !String(a.propertyId).includes(q)) return false
    }
    return true
  }

  const { filtered, pageRows, sortKey, sortDir, handleSort, page, setPage, totalPages } =
    useTableData(data, filterFn, filters)

  const syncSelected = (id, status) => setSelected(s => s?.id === id ? { ...s, status } : s)

  const accept = async (id) => {
    try {
      await applicationsApi.accept(id)
      setData(p => p.map(a => a.id === id ? { ...a, status: "ACCEPTED" } : a))
      syncSelected(id, "ACCEPTED")
      toast.success("Application accepted")
    } catch {}
  }

  const reject = async (id) => {
    try {
      await applicationsApi.reject(id)
      setData(p => p.map(a => a.id === id ? { ...a, status: "REJECTED" } : a))
      syncSelected(id, "REJECTED")
      toast.success("Application rejected")
    } catch {}
  }

  const columns = [
    { key: "propertyId",    label: "Property", render: (v) => <span style={{ fontWeight: 500, color: "var(--color-primary)" }}>#{v}</span> },
    { key: "buyerFullName", label: "Buyer",    render: (v, row) => <><p style={{ margin: 0, fontWeight: 500, color: "var(--color-text)" }}>{v}</p><p style={{ margin: 0, fontSize: "0.75rem", color: "var(--color-text-muted)" }}>{row.buyerPhone}</p></> },
    { key: "offerAmount",   label: "Offer",    render: (v) => <span style={{ fontWeight: 600, color: "var(--color-text)" }}>{fmtCurrency(Number(v))}</span> },
    { key: "status",        label: "Status",   render: (v) => { const s = STATUS_STYLES[v]; return s ? <Badge {...s} /> : v } },
    { key: "createdAt",     label: "Received", render: (v) => v ? fmtDate(v) : "—" },
    { key: null, label: "Actions", render: (_, row) => (
      <ActionsMenu items={[
        { label: "View Details", icon: <Eye size={14} />, onClick: () => setSelected(row) },
        ...(row.status === "PENDING" ? [
          { label: "Accept", icon: <CheckCircle size={14} />, color: "#15803D", onClick: () => accept(row.id), dividerBefore: true },
          { label: "Reject", icon: <XCircle size={14} />,    color: "#B91C1C", onClick: () => reject(row.id) },
        ] : []),
      ]} />
    )},
  ]

  const sel   = selected
  const selSt = sel ? STATUS_STYLES[sel.status] : null

  if (loading) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "60vh", gap: "0.75rem", color: "var(--color-text-muted)" }}>
      <Loader2 size={20} style={{ animation: "spin 1s linear infinite" }} /> Loading applications…
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      <p style={{ margin: 0, fontWeight: 700, fontSize: "1.1rem", color: "var(--color-text)" }}>Applications</p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "1rem" }}>
        <StatCard label="Total"    value={stats.total}    color="var(--color-primary)" />
        <StatCard label="Pending"  value={stats.pending}  color="#C2410C" />
        <StatCard label="Accepted" value={stats.accepted} color="#15803D" />
        <StatCard label="Rejected" value={stats.rejected} color="#B91C1C" />
      </div>

      <Toolbar search={search} onSearch={setSearch} placeholder="Search buyer, property ID…" filterRef={filterRef} filterOpen={filterOpen} setFilterOpen={setFilterOpen} activeFilters={statusFilter !== "ALL" ? 1 : 0}>
        <FilterGroup label="Status">
          {["ALL","PENDING","ACCEPTED","REJECTED","WITHDRAWN","EXPIRED"].map(s => (
            <Pill key={s} active={statusFilter === s} onClick={() => setStatus(s)}>{s === "ALL" ? "All" : STATUS_STYLES[s]?.label ?? s}</Pill>
          ))}
        </FilterGroup>
        {statusFilter !== "ALL" && <ClearBtn onClick={() => setStatus("ALL")} />}
      </Toolbar>

      <DataTable columns={columns} rows={pageRows} total={filtered.length} emptyMsg="No applications found"
        sortKey={sortKey} sortDir={sortDir} onSort={handleSort}
        page={page} totalPages={totalPages} totalElements={filtered.length} pageSize={PAGE_SIZE} onPageChange={setPage} />

      <DetailsDrawer
        open={!!sel} onClose={() => setSelected(null)}
        title={sel?.buyerFullName}
        subtitle={`Application #${sel?.id} · Property #${sel?.propertyId}`}
        sections={sel ? [
          { heading: "Offer", rows: [
            { label: "Offer Amount",   value: fmtCurrencyFull(Number(sel.offerAmount)) },
            { label: "Deposit",        value: fmtCurrencyFull(Number(sel.depositAmount)) },
            { label: "Funding",        value: FUNDING_LABELS[sel.fundingSource] ?? sel.fundingSource },
            { label: "Status",         value: selSt && <Badge bg={selSt.bg} color={selSt.color} label={selSt.label} /> },
          ]},
          { heading: "Dates", rows: [
            { label: "Received",     value: sel.createdAt           ? fmtDate(sel.createdAt)           : "—" },
            { label: "Closing Date", value: sel.proposedClosingDate ? fmtDate(sel.proposedClosingDate) : "—" },
            { label: "Expires",      value: sel.offerExpirationDate ? fmtDate(sel.offerExpirationDate) : "—" },
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
