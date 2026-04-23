import { useState, useMemo } from "react"
import { useNavigate } from "react-router-dom"
import { Eye, Pencil, Trash2, BedDouble, Bath, Maximize2, Plus } from "lucide-react"
import DataTable from "../../../components/shared/DataTable"
import { StatCard, Toolbar, FilterGroup, Pill, ClearBtn, Badge, ActionsMenu } from "../../../components/shared/AdminUI"
import DetailsDrawer, { drawerOutlineBtn } from "../../../components/shared/DetailsDrawer"
import { fmtCurrency, fmtCurrencyFull, fmtDate } from "../../../utils/formatters"
import { PROPERTY_STATUS as STATUS_STYLES, PROPERTY_TYPE_LABELS as TYPE_LABELS, PAGE_SIZE } from "../../../constants/enums"
import { ROUTES } from "../../../constants/routes"
import { useFilterPanel } from "../../../hooks/useFilterPanel"
import { useTableData } from "../../../hooks/useTableData"

const MOCK = [
  { id: 101, title: "Modern Downtown Apartment", price: 485000,  address: "12 Oak St",       city: "New York",      country: "USA", bedrooms: 2, bathrooms: 1, areaSqm: 85,  type: "APARTMENT",  status: "AVAILABLE",   image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&q=80", bids: 3, createdAt: "2025-06-01T10:00:00" },
  { id: 104, title: "Penthouse with City Views", price: 1250000, address: "88 Sky Tower",    city: "Miami",         country: "USA", bedrooms: 4, bathrooms: 3, areaSqm: 310, type: "APARTMENT",  status: "UNDER_OFFER", image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&q=80", bids: 2, createdAt: "2025-06-20T12:00:00" },
  { id: 106, title: "Family House in Suburbs",   price: 780000,  address: "22 Pine Close",   city: "Phoenix",       country: "USA", bedrooms: 3, bathrooms: 2, areaSqm: 195, type: "HOUSE",      status: "AVAILABLE",   image: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400&q=80", bids: 1, createdAt: "2025-07-01T07:00:00" },
  { id: 108, title: "Mega Mansion Estate",       price: 2100000, address: "100 Estate Rd",   city: "Beverly Hills", country: "USA", bedrooms: 7, bathrooms: 6, areaSqm: 850, type: "VILLA",      status: "SOLD",        image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&q=80", bids: 0, createdAt: "2025-03-10T10:00:00" },
  { id: 109, title: "Starter Home",              price: 295000,  address: "5 Birch Lane",    city: "Dallas",        country: "USA", bedrooms: 2, bathrooms: 1, areaSqm: 95,  type: "HOUSE",      status: "AVAILABLE",   image: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=400&q=80", bids: 1, createdAt: "2025-07-05T09:00:00" },
]

export default function AgentListingsPage() {
  const navigate                  = useNavigate()
  const [data, setData]           = useState(MOCK)
  const [search, setSearch]       = useState("")
  const [statusFilter, setStatus] = useState("ALL")
  const [typeFilter, setType]     = useState("ALL")
  const [selected, setSelected]   = useState(null)
  const { filterRef, filterOpen, setFilterOpen } = useFilterPanel()

  const activeFilters = (statusFilter !== "ALL" ? 1 : 0) + (typeFilter !== "ALL" ? 1 : 0)

  const stats = useMemo(() => ({
    total:      data.length,
    available:  data.filter(p => p.status === "AVAILABLE").length,
    underOffer: data.filter(p => p.status === "UNDER_OFFER").length,
    sold:       data.filter(p => p.status === "SOLD").length,
  }), [data])

  const filters = { search, statusFilter, typeFilter }
  const filterFn = (p, { search, statusFilter, typeFilter }) => {
    if (statusFilter !== "ALL" && p.status !== statusFilter) return false
    if (typeFilter   !== "ALL" && p.type   !== typeFilter)   return false
    if (search.trim()) {
      const q = search.toLowerCase()
      if (!p.title.toLowerCase().includes(q) && !p.city.toLowerCase().includes(q)) return false
    }
    return true
  }

  const { filtered, pageRows, sortKey, sortDir, handleSort, page, setPage, totalPages } =
    useTableData(data, filterFn, filters)

  const propertyCard = (p) => {
    const st = STATUS_STYLES[p.status]
    return (
      <div style={{ backgroundColor: "var(--color-surface)", border: "1px solid var(--color-border)", borderRadius: "14px", overflow: "hidden", boxShadow: "0 2px 8px #0000000d" }}>
        <div style={{ position: "relative", height: 160, backgroundColor: "var(--color-bg-muted)", overflow: "hidden" }}>
          {p.image ? <img src={p.image} alt={p.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2rem" }}>🏠</div>}
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, #00000088 0%, transparent 55%)" }} />
          <p style={{ position: "absolute", bottom: "0.6rem", left: "0.75rem", margin: 0, fontWeight: 800, fontSize: "1.1rem", color: "#fff", textShadow: "0 1px 4px #00000060" }}>{fmtCurrency(p.price)}</p>
          <div style={{ position: "absolute", top: "0.6rem", right: "0.6rem" }}><Badge bg={st.bg} color={st.color} label={st.label} /></div>
          <div style={{ position: "absolute", top: "0.5rem", left: "0.5rem" }}>
            <ActionsMenu items={[
              { label: "View Details", icon: <Eye size={14} />,    onClick: () => setSelected(p) },
              { label: "Edit",         icon: <Pencil size={14} />, onClick: () => {},               dividerBefore: true },
              { label: "Delete",       icon: <Trash2 size={14} />, color: "#B91C1C", onClick: () => setData(d => d.filter(x => x.id !== p.id)), dividerBefore: true },
            ]} />
          </div>
        </div>
        <div style={{ padding: "0.875rem 1rem" }}>
          <p style={{ margin: "0 0 0.2rem", fontWeight: 700, fontSize: "0.9375rem", color: "var(--color-text)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.title}</p>
          <p style={{ margin: "0 0 0.75rem", fontSize: "0.75rem", color: "var(--color-text-muted)" }}>📍 {p.address}, {p.city}</p>
          <div style={{ display: "flex", gap: "1rem", fontSize: "0.8125rem", color: "var(--color-text-muted)" }}>
            {p.bedrooms > 0 && <span style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}><BedDouble size={13} /> {p.bedrooms} bed</span>}
            <span style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}><Bath size={13} /> {p.bathrooms} bath</span>
            <span style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}><Maximize2 size={13} /> {p.areaSqm} m²</span>
          </div>
        </div>
      </div>
    )
  }

  const columns = [
    { key: "title",     label: "Property", render: (v, row) => (
      <div>
        <p style={{ margin: 0, fontWeight: 500, color: "var(--color-text)", maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{v}</p>
        <p style={{ margin: 0, fontSize: "0.75rem", color: "var(--color-text-muted)" }}>{row.city} · {TYPE_LABELS[row.type]}</p>
      </div>
    )},
    { key: "price",     label: "Price",    render: (v) => <span style={{ fontWeight: 600, color: "var(--color-text)" }}>{fmtCurrency(v)}</span> },
    { key: "bids",      label: "Bids",     render: (v) => <span style={{ fontWeight: 600, color: v > 0 ? "var(--color-primary)" : "var(--color-text-muted)" }}>{v}</span> },
    { key: "status",    label: "Status",   render: (v) => { const s = STATUS_STYLES[v]; return <Badge {...s} /> } },
    { key: "createdAt", label: "Listed",   render: (v) => fmtDate(v) },
    { key: null,        label: "Actions",  render: (_, row) => (
      <ActionsMenu items={[
        { label: "View Details", icon: <Eye size={14} />,    onClick: () => setSelected(row) },
        { label: "Edit",         icon: <Pencil size={14} />, onClick: () => {},               dividerBefore: true },
        { label: "Delete",       icon: <Trash2 size={14} />, color: "#B91C1C", onClick: () => setData(d => d.filter(x => x.id !== row.id)), dividerBefore: true },
      ]} />
    )},
  ]

  const sel  = selected
  const selSt = sel ? STATUS_STYLES[sel.status] : null

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>

      {/* Stats + action */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.75rem", flexWrap: "wrap" }}>
          <p style={{ margin: 0, fontWeight: 700, fontSize: "1rem", color: "var(--color-text)" }}>My Listings</p>
          <button onClick={() => navigate(ROUTES.AGENT_LISTING_NEW)} style={{ display: "flex", alignItems: "center", gap: "0.45rem", padding: "0.55rem 1.1rem", borderRadius: "9px", border: "none", backgroundColor: "var(--color-primary)", color: "#fff", fontWeight: 600, fontSize: "0.8375rem", cursor: "pointer", fontFamily: "inherit" }}>
            <Plus size={15} /> New Listing
          </button>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: "0.75rem" }}>
          <StatCard label="Total"       value={stats.total}      color="var(--color-primary)" />
          <StatCard label="Available"   value={stats.available}  color="#15803D" />
          <StatCard label="Under Offer" value={stats.underOffer} color="#C2410C" />
          <StatCard label="Sold"        value={stats.sold}       color="#1D4ED8" />
        </div>
      </div>

      <Toolbar search={search} onSearch={setSearch} placeholder="Search title, city…" filterRef={filterRef} filterOpen={filterOpen} setFilterOpen={setFilterOpen} activeFilters={activeFilters}>
        <FilterGroup label="Status">
          {["ALL","AVAILABLE","UNDER_OFFER","SOLD","RENTED","INACTIVE"].map(s => <Pill key={s} active={statusFilter === s} onClick={() => setStatus(s)}>{s === "ALL" ? "All" : STATUS_STYLES[s].label}</Pill>)}
        </FilterGroup>
        <FilterGroup label="Type">
          {["ALL","APARTMENT","HOUSE","VILLA","OFFICE","COMMERCIAL"].map(t => <Pill key={t} active={typeFilter === t} onClick={() => setType(t)}>{t === "ALL" ? "All" : TYPE_LABELS[t]}</Pill>)}
        </FilterGroup>
        {activeFilters > 0 && <ClearBtn onClick={() => { setStatus("ALL"); setType("ALL") }} />}
      </Toolbar>

      <DataTable columns={columns} rows={pageRows} total={filtered.length} emptyMsg="No listings found" sortKey={sortKey} sortDir={sortDir} onSort={handleSort} cardRender={propertyCard} page={page} totalPages={totalPages} totalElements={filtered.length} pageSize={PAGE_SIZE} onPageChange={setPage} />

      <DetailsDrawer
        open={!!sel} onClose={() => setSelected(null)}
        title={sel?.title} subtitle={sel ? `${sel.address}, ${sel.city}` : ""} hero={sel?.image}
        sections={sel ? [
          { heading: "Property Details", rows: [
            { label: "Type",      value: TYPE_LABELS[sel.type] },
            { label: "Status",    value: <Badge bg={selSt.bg} color={selSt.color} label={selSt.label} /> },
            { label: "Price",     value: fmtCurrencyFull(sel.price) },
            { label: "Bedrooms",  value: sel.bedrooms > 0 ? sel.bedrooms : "N/A" },
            { label: "Bathrooms", value: sel.bathrooms },
            { label: "Area",      value: `${sel.areaSqm} m²` },
            { label: "Bids",      value: sel.bids },
            { label: "Listed",    value: fmtDate(sel.createdAt) },
          ]},
          { heading: "Location", rows: [
            { label: "Address", value: sel.address },
            { label: "City",    value: sel.city },
            { label: "Country", value: sel.country },
          ]},
        ] : []}
        footer={<button style={drawerOutlineBtn("var(--color-primary)")}><Pencil size={14} /> Edit Listing</button>}
      />
    </div>
  )
}
