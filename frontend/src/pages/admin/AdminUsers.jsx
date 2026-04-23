import { useState, useMemo, useRef, useEffect } from "react"
import { Search, SlidersHorizontal, ShieldCheck, ShieldOff, Trash2 } from "lucide-react"

// ── mock data — union of all user types from backend DTOs ─────────────────
const MOCK = [
  { id: 1,  publicId: "usr-001", firstName: "Sarah",   lastName: "Johnson",  email: "sarah.j@email.com",    phone: "+1 555-0101", role: "ROLE_AGENT",         status: "ACTIVE",     licenseNumber: "LIC-001", companyId: 1,    nationalId: null,       createdAt: "2025-01-15T09:00:00" },
  { id: 2,  publicId: "usr-002", firstName: "Marcus",  lastName: "Lee",      email: "marcus.l@email.com",   phone: "+1 555-0202", role: "ROLE_CLIENT",        status: "ACTIVE",     licenseNumber: null,      companyId: null, nationalId: null,       createdAt: "2025-02-20T10:00:00" },
  { id: 3,  publicId: "usr-003", firstName: "Priya",   lastName: "Patel",    email: "priya.p@email.com",    phone: "+1 555-0303", role: "ROLE_OWNER",         status: "ACTIVE",     licenseNumber: null,      companyId: null, nationalId: "NID-003",  createdAt: "2025-03-05T11:00:00" },
  { id: 4,  publicId: "usr-004", firstName: "David",   lastName: "Okafor",   email: "david.o@email.com",    phone: "+1 555-0404", role: "ROLE_AGENT",         status: "SUSPENDED",  licenseNumber: "LIC-004", companyId: 1,    nationalId: null,       createdAt: "2025-01-28T08:00:00" },
  { id: 5,  publicId: "usr-005", firstName: "Emma",    lastName: "Wilson",   email: "emma.w@email.com",     phone: "+1 555-0505", role: "ROLE_COMPANY_ADMIN", status: "ACTIVE",     licenseNumber: "LIC-005", companyId: 2,    nationalId: null,       createdAt: "2024-12-01T09:00:00" },
  { id: 6,  publicId: "usr-006", firstName: "James",   lastName: "Nguyen",   email: "james.n@email.com",    phone: "+1 555-0606", role: "ROLE_CLIENT",        status: "ACTIVE",     licenseNumber: null,      companyId: null, nationalId: null,       createdAt: "2025-04-10T14:00:00" },
  { id: 7,  publicId: "usr-007", firstName: "Aisha",   lastName: "Malik",    email: "aisha.m@email.com",    phone: "+1 555-0707", role: "ROLE_AGENT",         status: "PENDING",    licenseNumber: "LIC-007", companyId: 2,    nationalId: null,       createdAt: "2025-07-01T10:00:00" },
  { id: 8,  publicId: "usr-008", firstName: "Carlos",  lastName: "Rivera",   email: "carlos.r@email.com",   phone: "+1 555-0808", role: "ROLE_OWNER",         status: "ACTIVE",     licenseNumber: null,      companyId: null, nationalId: "NID-008",  createdAt: "2025-05-18T09:00:00" },
  { id: 9,  publicId: "usr-009", firstName: "Fatima",  lastName: "Al-Hassan",email: "fatima.a@email.com",   phone: "+1 555-0909", role: "ROLE_MANAGER",       status: "ACTIVE",     licenseNumber: "LIC-009", companyId: 1,    nationalId: null,       createdAt: "2025-02-14T11:00:00" },
  { id: 10, publicId: "usr-010", firstName: "Tom",     lastName: "Bradley",  email: "tom.b@email.com",      phone: "+1 555-1010", role: "ROLE_CLIENT",        status: "ACTIVE",     licenseNumber: null,      companyId: null, nationalId: null,       createdAt: "2025-06-22T08:00:00" },
  { id: 11, publicId: "usr-011", firstName: "Nina",    lastName: "Rossi",    email: "nina.r@email.com",     phone: "+1 555-1111", role: "ROLE_AGENT",         status: "ACTIVE",     licenseNumber: "LIC-011", companyId: 2,    nationalId: null,       createdAt: "2025-03-30T13:00:00" },
  { id: 12, publicId: "usr-012", firstName: "Omar",    lastName: "Hassan",   email: "omar.h@email.com",     phone: "+1 555-1212", role: "ROLE_OWNER",         status: "ACTIVE",     licenseNumber: null,      companyId: null, nationalId: "NID-012",  createdAt: "2025-04-05T10:00:00" },
  { id: 13, publicId: "usr-013", firstName: "Lily",    lastName: "Chen",     email: "lily.c@email.com",     phone: "+1 555-1313", role: "ROLE_COMPANY_ADMIN", status: "ACTIVE",     licenseNumber: "LIC-013", companyId: 1,    nationalId: null,       createdAt: "2024-11-20T09:00:00" },
  { id: 14, publicId: "usr-014", firstName: "Andre",   lastName: "Dupont",   email: "andre.d@email.com",    phone: "+1 555-1414", role: "ROLE_CLIENT",        status: "SUSPENDED",  licenseNumber: null,      companyId: null, nationalId: null,       createdAt: "2025-05-01T12:00:00" },
  { id: 15, publicId: "usr-015", firstName: "Zara",    lastName: "Khan",     email: "zara.k@email.com",     phone: "+1 555-1515", role: "ROLE_AGENT",         status: "ACTIVE",     licenseNumber: "LIC-015", companyId: 2,    nationalId: null,       createdAt: "2025-06-10T08:00:00" },
]

const ROLES = ["ROLE_AGENT", "ROLE_CLIENT", "ROLE_OWNER", "ROLE_COMPANY_ADMIN", "ROLE_MANAGER"]

const ROLE_STYLES = {
  ROLE_AGENT:         { bg: "#EFF6FF", color: "#1D4ED8", label: "Agent"         },
  ROLE_CLIENT:        { bg: "#F5F3FF", color: "#6D28D9", label: "Client"        },
  ROLE_OWNER:         { bg: "#FFF7ED", color: "#C2410C", label: "Owner"         },
  ROLE_COMPANY_ADMIN: { bg: "#F0FDF4", color: "#15803D", label: "Company Admin" },
  ROLE_MANAGER:       { bg: "#FEF9C3", color: "#92400E", label: "Manager"       },
}

const STATUS_STYLES = {
  ACTIVE:    { bg: "#F0FDF4", color: "#15803D", label: "Active"    },
  PENDING:   { bg: "#FFF7ED", color: "#C2410C", label: "Pending"   },
  SUSPENDED: { bg: "#FEF2F2", color: "#B91C1C", label: "Suspended" },
}

const ROLE_TABS = [
  { key: "ALL",               label: "All"           },
  { key: "ROLE_AGENT",        label: "Agents"        },
  { key: "ROLE_CLIENT",       label: "Clients"       },
  { key: "ROLE_OWNER",        label: "Owners"        },
  { key: "ROLE_COMPANY_ADMIN",label: "Company Admins"},
  { key: "ROLE_MANAGER",      label: "Managers"      },
]

const fmtDate = (d) => new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })

const initials = (u) => `${u.firstName[0]}${u.lastName[0]}`.toUpperCase()

const AVATAR_COLORS = ["#FF4F00", "#1D4ED8", "#15803D", "#6D28D9", "#C2410C", "#0891B2"]
const avatarColor = (id) => AVATAR_COLORS[id % AVATAR_COLORS.length]

export default function AdminUsers() {
  const [data, setData]             = useState(MOCK)
  const [roleTab, setRoleTab]       = useState("ALL")
  const [search, setSearch]         = useState("")
  const [statusFilter, setStatus]   = useState("ALL")
  const [sortKey, setSortKey]       = useState("createdAt")
  const [sortDir, setSortDir]       = useState("desc")
  const [filterOpen, setFilterOpen] = useState(false)
  const filterRef = useRef(null)

  useEffect(() => {
    const handler = (e) => { if (filterRef.current && !filterRef.current.contains(e.target)) setFilterOpen(false) }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  const activeFilters = statusFilter !== "ALL" ? 1 : 0

  const stats = useMemo(() => ({
    total:   data.length,
    agents:  data.filter(u => u.role === "ROLE_AGENT").length,
    clients: data.filter(u => u.role === "ROLE_CLIENT").length,
    owners:  data.filter(u => u.role === "ROLE_OWNER").length,
  }), [data])

  const filtered = useMemo(() => {
    let rows = data
    if (roleTab !== "ALL")      rows = rows.filter(u => u.role === roleTab)
    if (statusFilter !== "ALL") rows = rows.filter(u => u.status === statusFilter)
    if (search.trim()) {
      const q = search.toLowerCase()
      rows = rows.filter(u =>
        `${u.firstName} ${u.lastName}`.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.publicId.toLowerCase().includes(q)
      )
    }
    return [...rows].sort((a, b) => {
      let av = a[sortKey] ?? "", bv = b[sortKey] ?? ""
      if (typeof av === "string") { av = av.toLowerCase(); bv = bv.toLowerCase() }
      return sortDir === "asc" ? (av > bv ? 1 : -1) : (av < bv ? 1 : -1)
    })
  }, [data, roleTab, search, statusFilter, sortKey, sortDir])

  const toggleSort = (key) => {
    if (sortKey === key) setSortDir(d => d === "asc" ? "desc" : "asc")
    else { setSortKey(key); setSortDir("asc") }
  }

  const toggleSuspend = (id) =>
    setData(prev => prev.map(u => u.id === id
      ? { ...u, status: u.status === "SUSPENDED" ? "ACTIVE" : "SUSPENDED" }
      : u
    ))

  const deleteUser = (id) => setData(prev => prev.filter(u => u.id !== id))

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>

      {/* Stat cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "1rem" }}>
        {[
          { label: "Total Users", value: stats.total,   color: "var(--color-primary)" },
          { label: "Agents",      value: stats.agents,  color: "#1D4ED8" },
          { label: "Clients",     value: stats.clients, color: "#6D28D9" },
          { label: "Owners",      value: stats.owners,  color: "#C2410C" },
        ].map(s => (
          <div key={s.label} style={cardStyle}>
            <p style={cardLabelStyle}>{s.label}</p>
            <p style={{ margin: "0.25rem 0 0", fontSize: "1.75rem", fontWeight: 700, color: s.color }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Role tabs */}
      <div style={{ display: "flex", gap: "0.25rem", borderBottom: "1px solid var(--color-border)", overflowX: "auto" }}>
        {ROLE_TABS.map(tab => (
          <button
            key={tab.key}
            onClick={() => setRoleTab(tab.key)}
            style={{
              padding: "0.6rem 1rem",
              background: "none",
              border: "none",
              borderBottom: roleTab === tab.key ? "2px solid var(--color-primary)" : "2px solid transparent",
              color: roleTab === tab.key ? "var(--color-primary)" : "var(--color-text-muted)",
              fontWeight: roleTab === tab.key ? 600 : 400,
              fontSize: "0.875rem",
              cursor: "pointer",
              whiteSpace: "nowrap",
              fontFamily: "inherit",
              marginBottom: "-1px",
              transition: "color 0.15s",
            }}
          >
            {tab.label}
            <span style={{ marginLeft: "0.4rem", fontSize: "0.75rem", color: "var(--color-text-subtle)" }}>
              {tab.key === "ALL" ? data.length : data.filter(u => u.role === tab.key).length}
            </span>
          </button>
        ))}
      </div>

      {/* Toolbar */}
      <div style={{ ...cardStyle, display: "flex", gap: "0.75rem", alignItems: "center", flexWrap: "wrap" }}>
        <div style={searchBoxStyle}>
          <Search size={15} style={{ color: "var(--color-text-muted)", flexShrink: 0 }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search name, email, ID…" style={searchInputStyle} />
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
                  {["ALL", "ACTIVE", "PENDING", "SUSPENDED"].map(s => (
                    <button key={s} onClick={() => setStatus(s)} style={pillStyle(statusFilter === s)}>
                      {s === "ALL" ? "All" : STATUS_STYLES[s].label}
                    </button>
                  ))}
                </div>
              </div>
              {activeFilters > 0 && (
                <button onClick={() => setStatus("ALL")} style={clearBtnStyle}>Clear all filters</button>
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
                  { key: "firstName", label: "User"      },
                  { key: "role",      label: "Role"      },
                  { key: "phone",     label: "Phone"     },
                  { key: "companyId", label: "Company"   },
                  { key: "status",    label: "Status"    },
                  { key: "createdAt", label: "Joined"    },
                  { key: null,        label: "Actions"   },
                ].map(col => (
                  <th key={col.label} onClick={() => col.key && toggleSort(col.key)} style={thStyle(!!col.key)}>
                    {col.label}{col.key && sortKey === col.key && <span style={{ marginLeft: 4 }}>{sortDir === "asc" ? "↑" : "↓"}</span>}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={7} style={{ padding: "3rem", textAlign: "center", color: "var(--color-text-muted)" }}>No users found</td></tr>
              ) : filtered.map((u, i) => {
                const rs = ROLE_STYLES[u.role]
                const ss = STATUS_STYLES[u.status] ?? STATUS_STYLES.ACTIVE
                return (
                  <tr key={u.id} style={{ borderBottom: "1px solid var(--color-border)", backgroundColor: i % 2 !== 0 ? "var(--color-bg-subtle)" : "transparent" }}>
                    <td style={tdStyle}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.65rem" }}>
                        <div style={{ width: "34px", height: "34px", borderRadius: "50%", backgroundColor: avatarColor(u.id), color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.75rem", fontWeight: 700, flexShrink: 0 }}>
                          {initials(u)}
                        </div>
                        <div>
                          <p style={{ margin: 0, fontWeight: 500, color: "var(--color-text)" }}>{u.firstName} {u.lastName}</p>
                          <p style={{ margin: 0, fontSize: "0.75rem", color: "var(--color-text-muted)" }}>{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td style={tdStyle}>
                      <span style={{ backgroundColor: rs.bg, color: rs.color, borderRadius: "999px", padding: "0.2rem 0.65rem", fontSize: "0.75rem", fontWeight: 600, whiteSpace: "nowrap" }}>{rs.label}</span>
                    </td>
                    <td style={tdStyle}>{u.phone}</td>
                    <td style={tdStyle}>{u.companyId ? `#${u.companyId}` : "—"}</td>
                    <td style={tdStyle}>
                      <span style={{ backgroundColor: ss.bg, color: ss.color, borderRadius: "999px", padding: "0.2rem 0.65rem", fontSize: "0.75rem", fontWeight: 600, whiteSpace: "nowrap" }}>{ss.label}</span>
                    </td>
                    <td style={{ ...tdStyle, whiteSpace: "nowrap" }}>{fmtDate(u.createdAt)}</td>
                    <td style={{ ...tdStyle, whiteSpace: "nowrap" }}>
                      <div style={{ display: "flex", gap: "0.4rem" }}>
                        <button
                          onClick={() => toggleSuspend(u.id)}
                          title={u.status === "SUSPENDED" ? "Reactivate" : "Suspend"}
                          style={actionBtn(u.status === "SUSPENDED" ? "#15803D" : "#C2410C")}
                        >
                          {u.status === "SUSPENDED" ? <ShieldCheck size={14} /> : <ShieldOff size={14} />}
                        </button>
                        <button onClick={() => deleteUser(u.id)} title="Delete" style={actionBtn("#B91C1C")}>
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        <div style={{ padding: "0.75rem 1rem", borderTop: "1px solid var(--color-border)", fontSize: "0.8125rem", color: "var(--color-text-muted)" }}>
          Showing {filtered.length} of {data.length} users
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
const filterPanelStyle = { position: "absolute", top: "calc(100% + 8px)", left: 0, backgroundColor: "var(--color-surface)", border: "1px solid var(--color-border)", borderRadius: "10px", boxShadow: "0 8px 24px #0000001a", zIndex: 50, padding: "1rem", minWidth: "220px", display: "flex", flexDirection: "column", gap: "1rem" }
const filterGroupLabel = { margin: "0 0 0.5rem", fontSize: "0.75rem", fontWeight: 600, color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }
const pillGroupStyle   = { display: "flex", flexWrap: "wrap", gap: "0.35rem" }
const pillStyle = (active) => ({ padding: "0.3rem 0.7rem", borderRadius: "999px", border: "1px solid", fontSize: "0.75rem", fontWeight: 500, cursor: "pointer", fontFamily: "inherit", borderColor: active ? "var(--color-primary)" : "var(--color-border)", backgroundColor: active ? "var(--color-primary)" : "transparent", color: active ? "#fff" : "var(--color-text-muted)", transition: "all 0.15s" })
const clearBtnStyle    = { background: "none", border: "none", cursor: "pointer", fontSize: "0.8125rem", color: "var(--color-primary)", textAlign: "left", padding: 0, fontFamily: "inherit" }
const thStyle = (sortable) => ({ padding: "0.75rem 1rem", textAlign: "left", fontWeight: 600, fontSize: "0.75rem", color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: "0.04em", whiteSpace: "nowrap", cursor: sortable ? "pointer" : "default", userSelect: "none" })
const tdStyle          = { padding: "0.75rem 1rem", color: "var(--color-text-muted)", verticalAlign: "middle" }
const actionBtn = (color) => ({ display: "flex", alignItems: "center", justifyContent: "center", width: "28px", height: "28px", borderRadius: "6px", border: `1px solid ${color}20`, backgroundColor: `${color}10`, color, cursor: "pointer" })
