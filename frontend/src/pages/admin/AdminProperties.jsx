import { useState, useMemo, useRef, useEffect } from "react"
import { SlidersHorizontal, Search, Pencil, Trash2 } from "lucide-react"

const MOCK = [
  { id: 101, title: "Modern Downtown Apartment",  description: "Bright 2BR in city centre", price: 485000,  address: "12 Oak St",      city: "New York",    country: "USA", bedrooms: 2, bathrooms: 1, areaSqm: 85,  type: "APARTMENT", status: "AVAILABLE",   listingAgentPublicId: "agent-001", sellingAgentPublicId: null,        ownerPublicId: "owner-01", buyerPublicId: null,        companyId: 1, createdAt: "2025-06-01T10:00:00", updatedAt: "2025-07-01T10:00:00" },
  { id: 102, title: "Luxury Suburban Villa",      description: "5BR villa with pool",       price: 920000,  address: "45 Maple Ave",   city: "Los Angeles", country: "USA", bedrooms: 5, bathrooms: 4, areaSqm: 420, type: "VILLA",     status: "SOLD",        listingAgentPublicId: "agent-001", sellingAgentPublicId: "agent-003", ownerPublicId: "owner-02", buyerPublicId: "client-02", companyId: 1, createdAt: "2025-05-15T09:00:00", updatedAt: "2025-07-08T14:00:00" },
  { id: 103, title: "Cozy Studio Near Park",      description: "Studio with garden view",   price: 1800,    address: "7 Elm Rd",       city: "Chicago",     country: "USA", bedrooms: 0, bathrooms: 1, areaSqm: 38,  type: "APARTMENT", status: "RENTED",      listingAgentPublicId: "agent-002", sellingAgentPublicId: "agent-002", ownerPublicId: "owner-03", buyerPublicId: "client-03", companyId: 2, createdAt: "2025-06-10T08:00:00", updatedAt: "2025-07-07T11:00:00" },
  { id: 104, title: "Penthouse with City Views",  description: "4BR penthouse, top floor",  price: 1250000, address: "88 Sky Tower",   city: "Miami",       country: "USA", bedrooms: 4, bathrooms: 3, areaSqm: 310, type: "APARTMENT", status: "UNDER_OFFER", listingAgentPublicId: "agent-003", sellingAgentPublicId: "agent-004", ownerPublicId: "owner-04", buyerPublicId: null,        companyId: 1, createdAt: "2025-06-20T12:00:00", updatedAt: "2025-07-12T16:00:00" },
  { id: 105, title: "Commercial Office Space",    description: "Open plan 200sqm office",   price: 560000,  address: "3 Business Park", city: "Houston",    country: "USA", bedrooms: 0, bathrooms: 2, areaSqm: 200, type: "OFFICE",    status: "INACTIVE",    listingAgentPublicId: "agent-004", sellingAgentPublicId: null,        ownerPublicId: "owner-05", buyerPublicId: null,        companyId: 2, createdAt: "2025-04-01T09:00:00", updatedAt: "2025-06-06T10:00:00" },
  { id: 106, title: "Family House in Suburbs",    description: "3BR house with backyard",   price: 780000,  address: "22 Pine Close",  city: "Phoenix",     country: "USA", bedrooms: 3, bathrooms: 2, areaSqm: 195, type: "HOUSE",     status: "AVAILABLE",   listingAgentPublicId: "agent-002", sellingAgentPublicId: null,        ownerPublicId: "owner-06", buyerPublicId: null,        companyId: 1, createdAt: "2025-07-01T07:00:00", updatedAt: "2025-07-09T15:00:00" },
  { id: 107, title: "Beachfront Condo",           description: "2BR condo, ocean views",    price: 2400,    address: "1 Ocean Drive",  city: "Miami",       country: "USA", bedrooms: 2, bathrooms: 2, areaSqm: 110, type: "APARTMENT", status: "RENTED",      listingAgentPublicId: "agent-003", sellingAgentPublicId: "agent-003", ownerPublicId: "owner-07", buyerPublicId: "client-07", companyId: 2, createdAt: "2025-05-20T11:00:00", updatedAt: "2025-07-13T13:00:00" },
  { id: 108, title: "Mega Mansion Estate",        description: "7BR estate with grounds",   price: 2100000, address: "100 Estate Rd",  city: "Beverly Hills",country: "USA", bedrooms: 7, bathrooms: 6, areaSqm: 850, type: "VILLA",     status: "SOLD",        listingAgentPublicId: "agent-001", sellingAgentPublicId: "agent-004", ownerPublicId: "owner-08", buyerPublicId: "client-08", companyId: 1, createdAt: "2025-03-10T10:00:00", updatedAt: "2025-07-05T08:00:00" },
  { id: 109, title: "Starter Home",               description: "2BR starter home",          price: 295000,  address: "5 Birch Lane",   city: "Dallas",      country: "USA", bedrooms: 2, bathrooms: 1, areaSqm: 95,  type: "HOUSE",     status: "AVAILABLE",   listingAgentPublicId: "agent-004", sellingAgentPublicId: null,        ownerPublicId: "owner-09", buyerPublicId: null,        companyId: 2, createdAt: "2025-07-05T09:00:00", updatedAt: "2025-07-14T07:00:00" },
  { id: 110, title: "Retail Unit High Street",    description: "Ground floor retail space", price: 3200,    address: "67 High St",     city: "Chicago",     country: "USA", bedrooms: 0, bathrooms: 1, areaSqm: 75,  type: "COMMERCIAL",status: "UNDER_OFFER", listingAgentPublicId: "agent-002", sellingAgentPublicId: "agent-001", ownerPublicId: "owner-10", buyerPublicId: null,        companyId: 1, createdAt: "2025-06-25T14:00:00", updatedAt: "2025-07-03T12:00:00" },
]

const STATUS_STYLES = {
  AVAILABLE:   { bg: "#F0FDF4", color: "#15803D", label: "Available"   },
  UNDER_OFFER: { bg: "#FFF7ED", color: "#C2410C", label: "Under Offer" },
  SOLD:        { bg: "#EFF6FF", color: "#1D4ED8", label: "Sold"        },
  RENTED:      { bg: "#F5F3FF", color: "#6D28D9", label: "Rented"      },
  INACTIVE:    { bg: "#F5F5F5", color: "#737373", label: "Inactive"    },
}

const TYPE_LABELS = { APARTMENT: "Apartment", HOUSE: "House", VILLA: "Villa", OFFICE: "Office", LAND: "Land", COMMERCIAL: "Commercial" }

const fmt     = (n) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n)
const fmtDate = (d) => new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })

export default function AdminProperties() {
  const [data, setData]             = useState(MOCK)
  const [search, setSearch]         = useState("")
  const [statusFilter, setStatus]   = useState("ALL")
  const [typeFilter, setType]       = useState("ALL")
  const [cityFilter, setCity]       = useState("ALL")
  const [sortKey, setSortKey]       = useState("createdAt")
  const [sortDir, setSortDir]       = useState("desc")
  const [filterOpen, setFilterOpen] = useState(false)
  const filterRef = useRef(null)

  useEffect(() => {
    const handler = (e) => { if (filterRef.current && !filterRef.current.contains(e.target)) setFilterOpen(false) }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  const cities = useMemo(() => ["ALL", ...new Set(data.map(p => p.city))], [data])
  const activeFilters = (statusFilter !== "ALL" ? 1 : 0) + (typeFilter !== "ALL" ? 1 : 0) + (cityFilter !== "ALL" ? 1 : 0)

  const stats = useMemo(() => ({
    total:      data.length,
    available:  data.filter(p => p.status === "AVAILABLE").length,
    sold:       data.filter(p => p.status === "SOLD").length,
    underOffer: data.filter(p => p.status === "UNDER_OFFER").length,
  }), [data])

  const filtered = useMemo(() => {
    let rows = data
    if (statusFilter !== "ALL") rows = rows.filter(p => p.status === statusFilter)
    if (typeFilter !== "ALL")   rows = rows.filter(p => p.type === typeFilter)
    if (cityFilter !== "ALL")   rows = rows.filter(p => p.city === cityFilter)
    if (search.trim()) {
      const q = search.toLowerCase()
      rows = rows.filter(p => p.title.toLowerCase().includes(q) || p.city.toLowerCase().includes(q) || String(p.id).includes(q))
    }
    return [...rows].sort((a, b) => {
      let av = a[sortKey], bv = b[sortKey]
      if (typeof av === "string") { av = av.toLowerCase(); bv = bv.toLowerCase() }
      return sortDir === "asc" ? (av > bv ? 1 : -1) : (av < bv ? 1 : -1)
    })
  }, [data, search, statusFilter, typeFilter, cityFilter, sortKey, sortDir])

  const toggleSort = (key) => {
    if (sortKey === key) setSortDir(d => d === "asc" ? "desc" : "asc")
    else { setSortKey(key); setSortDir("asc") }
  }

  const deleteProperty = (id) => setData(prev => prev.filter(p => p.id !== id))

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>

      {/* Stat cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "1rem" }}>
        {[
          { label: "Total",       value: stats.total,      color: "var(--color-primary)" },
          { label: "Available",   value: stats.available,  color: "#15803D" },
          { label: "Under Offer", value: stats.underOffer, color: "#C2410C" },
          { label: "Sold",        value: stats.sold,       color: "#1D4ED8" },
        ].map(s => (
          <div key={s.label} style={cardStyle}>
            <p style={cardLabelStyle}>{s.label}</p>
            <p style={{ margin: "0.25rem 0 0", fontSize: "1.75rem", fontWeight: 700, color: s.color }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div style={{ ...cardStyle, display: "flex", gap: "0.75rem", alignItems: "center", flexWrap: "wrap" }}>
        <div style={searchBoxStyle}>
          <Search size={15} style={{ color: "var(--color-text-muted)", flexShrink: 0 }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search title, city, ID…" style={searchInputStyle} />
        </div>

        <div ref={filterRef} style={{ position: "relative" }}>
          <button onClick={() => setFilterOpen(v => !v)} style={{ ...filterBtnStyle, borderColor: activeFilters > 0 ? "var(--color-primary)" : "var(--color-border)", color: activeFilters > 0 ? "var(--color-primary)" : "var(--color-text-muted)" }}>
            <SlidersHorizontal size={15} />
            Filters
            {activeFilters > 0 && <span style={filterBadge}>{activeFilters}</span>}
          </button>

          {filterOpen && (
            <div style={filterPanelStyle}>
              <div>
                <p style={filterGroupLabel}>Status</p>
                <div style={pillGroupStyle}>
                  {["ALL", "AVAILABLE", "UNDER_OFFER", "SOLD", "RENTED", "INACTIVE"].map(s => (
                    <button key={s} onClick={() => setStatus(s)} style={pillStyle(statusFilter === s)}>
                      {s === "ALL" ? "All" : STATUS_STYLES[s].label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p style={filterGroupLabel}>Type</p>
                <div style={pillGroupStyle}>
                  {["ALL", "APARTMENT", "HOUSE", "VILLA", "OFFICE", "COMMERCIAL", "LAND"].map(t => (
                    <button key={t} onClick={() => setType(t)} style={pillStyle(typeFilter === t)}>
                      {t === "ALL" ? "All" : TYPE_LABELS[t]}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p style={filterGroupLabel}>City</p>
                <div style={pillGroupStyle}>
                  {cities.map(c => (
                    <button key={c} onClick={() => setCity(c)} style={pillStyle(cityFilter === c)}>
                      {c === "ALL" ? "All" : c}
                    </button>
                  ))}
                </div>
              </div>
              {activeFilters > 0 && (
                <button onClick={() => { setStatus("ALL"); setType("ALL"); setCity("ALL") }} style={clearBtnStyle}>Clear all filters</button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Table */}
      <div style={{ backgroundColor: "var(--color-surface)", borderRadius: "10px", border: "1px solid var(--color-border)", overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.875rem" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--color-border)", backgroundColor: "var(--color-bg-muted)" }}>
                {[
                  { key: "id",      label: "ID"      },
                  { key: "title",   label: "Title"   },
                  { key: "type",    label: "Type"    },
                  { key: "city",    label: "City"    },
                  { key: "price",   label: "Price"   },
                  { key: "bedrooms",label: "Beds"    },
                  { key: "areaSqm", label: "Area"    },
                  { key: "status",  label: "Status"  },
                  { key: "createdAt",label: "Listed" },
                  { key: null,      label: "Actions" },
                ].map(col => (
                  <th key={col.label} onClick={() => col.key && toggleSort(col.key)} style={thStyle(!!col.key)}>
                    {col.label}{col.key && sortKey === col.key && <span style={{ marginLeft: 4 }}>{sortDir === "asc" ? "↑" : "↓"}</span>}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={10} style={{ padding: "3rem", textAlign: "center", color: "var(--color-text-muted)" }}>No properties found</td></tr>
              ) : filtered.map((p, i) => {
                const st = STATUS_STYLES[p.status]
                return (
                  <tr key={p.id} style={{ borderBottom: "1px solid var(--color-border)", backgroundColor: i % 2 !== 0 ? "var(--color-bg-subtle)" : "transparent" }}>
                    <td style={tdStyle}>#{p.id}</td>
                    <td style={tdStyle}>
                      <p style={{ margin: 0, fontWeight: 500, color: "var(--color-text)", maxWidth: "200px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.title}</p>
                      <p style={{ margin: 0, fontSize: "0.75rem", color: "var(--color-text-muted)" }}>{p.address}</p>
                    </td>
                    <td style={tdStyle}>{TYPE_LABELS[p.type]}</td>
                    <td style={tdStyle}>{p.city}</td>
                    <td style={{ ...tdStyle, fontWeight: 600, color: "var(--color-text)" }}>{fmt(p.price)}</td>
                    <td style={tdStyle}>{p.bedrooms > 0 ? p.bedrooms : "—"}</td>
                    <td style={tdStyle}>{p.areaSqm} m²</td>
                    <td style={tdStyle}>
                      <span style={{ backgroundColor: st.bg, color: st.color, borderRadius: "999px", padding: "0.2rem 0.65rem", fontSize: "0.75rem", fontWeight: 600, whiteSpace: "nowrap" }}>{st.label}</span>
                    </td>
                    <td style={{ ...tdStyle, whiteSpace: "nowrap" }}>{fmtDate(p.createdAt)}</td>
                    <td style={{ ...tdStyle, whiteSpace: "nowrap" }}>
                      <div style={{ display: "flex", gap: "0.4rem" }}>
                        <button title="Edit"   style={actionBtn("#C2410C")}><Pencil size={14} /></button>
                        <button title="Delete" onClick={() => deleteProperty(p.id)} style={actionBtn("#B91C1C")}><Trash2 size={14} /></button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        <div style={{ padding: "0.75rem 1rem", borderTop: "1px solid var(--color-border)", fontSize: "0.8125rem", color: "var(--color-text-muted)" }}>
          Showing {filtered.length} of {data.length} properties
        </div>
      </div>
    </div>
  )
}

const cardStyle        = { backgroundColor: "var(--color-surface)", borderRadius: "10px", padding: "1rem 1.25rem", border: "1px solid var(--color-border)" }
const cardLabelStyle   = { margin: 0, fontSize: "0.75rem", color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }
const searchBoxStyle   = { display: "flex", alignItems: "center", gap: "0.5rem", flex: 1, minWidth: "200px", backgroundColor: "var(--color-bg-muted)", borderRadius: "8px", padding: "0.45rem 0.75rem", border: "1px solid var(--color-border)" }
const searchInputStyle = { border: "none", background: "none", outline: "none", fontSize: "0.875rem", color: "var(--color-text)", width: "100%", fontFamily: "inherit" }
const filterBtnStyle   = { display: "flex", alignItems: "center", gap: "0.4rem", padding: "0.45rem 0.85rem", borderRadius: "8px", border: "1px solid", backgroundColor: "transparent", cursor: "pointer", fontSize: "0.875rem", fontWeight: 500, fontFamily: "inherit", transition: "all 0.15s" }
const filterBadge      = { backgroundColor: "var(--color-primary)", color: "#fff", borderRadius: "999px", fontSize: "11px", padding: "0 6px", fontWeight: 600, lineHeight: "18px" }
const filterPanelStyle = { position: "absolute", top: "calc(100% + 8px)", left: 0, backgroundColor: "var(--color-surface)", border: "1px solid var(--color-border)", borderRadius: "10px", boxShadow: "0 8px 24px #0000001a", zIndex: 50, padding: "1rem", minWidth: "280px", display: "flex", flexDirection: "column", gap: "1rem" }
const filterGroupLabel = { margin: "0 0 0.5rem", fontSize: "0.75rem", fontWeight: 600, color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }
const pillGroupStyle   = { display: "flex", flexWrap: "wrap", gap: "0.35rem" }
const pillStyle = (active) => ({ padding: "0.3rem 0.7rem", borderRadius: "999px", border: "1px solid", fontSize: "0.75rem", fontWeight: 500, cursor: "pointer", fontFamily: "inherit", borderColor: active ? "var(--color-primary)" : "var(--color-border)", backgroundColor: active ? "var(--color-primary)" : "transparent", color: active ? "#fff" : "var(--color-text-muted)", transition: "all 0.15s" })
const clearBtnStyle    = { background: "none", border: "none", cursor: "pointer", fontSize: "0.8125rem", color: "var(--color-primary)", textAlign: "left", padding: 0, fontFamily: "inherit" }
const thStyle = (sortable) => ({ padding: "0.75rem 1rem", textAlign: "left", fontWeight: 600, fontSize: "0.75rem", color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: "0.04em", whiteSpace: "nowrap", cursor: sortable ? "pointer" : "default", userSelect: "none" })
const tdStyle          = { padding: "0.75rem 1rem", color: "var(--color-text-muted)", verticalAlign: "middle" }
const actionBtn = (color) => ({ display: "flex", alignItems: "center", justifyContent: "center", width: "28px", height: "28px", borderRadius: "6px", border: `1px solid ${color}20`, backgroundColor: `${color}10`, color, cursor: "pointer" })
