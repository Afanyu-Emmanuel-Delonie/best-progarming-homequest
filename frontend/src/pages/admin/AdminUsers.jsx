import { useState, useMemo } from "react"
import { Eye, ShieldCheck, ShieldOff, Trash2 } from "lucide-react"
import DataTable from "../../components/shared/DataTable"
import { StatCard, Toolbar, FilterGroup, Pill, ClearBtn, Badge, ActionsMenu } from "../../components/shared/AdminUI"
import DetailsDrawer, { drawerPrimaryBtn, drawerOutlineBtn } from "../../components/shared/DetailsDrawer"
import { fmtCurrency, fmtDate } from "../../utils/formatters"
import { ROLE_STYLES, USER_STATUS as STATUS_STYLES, ROLE_TABS, avatarColor, initials, PAGE_SIZE } from "../../constants/enums"
import { useFilterPanel } from "../../hooks/useFilterPanel"
import { useTableData } from "../../hooks/useTableData"

const MOCK = [
  { id: 1,  publicId: "usr-001", firstName: "Sarah",  lastName: "Johnson",   email: "sarah.j@email.com",  phone: "+1 555-0101", role: "ROLE_AGENT",         status: "ACTIVE",    companyId: 1,    licenseNumber: "LIC-001", createdAt: "2025-01-15T09:00:00", properties: 12, transactions: 9,  earned: 184500  },
  { id: 2,  publicId: "usr-002", firstName: "Marcus", lastName: "Lee",       email: "marcus.l@email.com", phone: "+1 555-0202", role: "ROLE_CLIENT",        status: "ACTIVE",    companyId: null, licenseNumber: null,      createdAt: "2025-02-20T10:00:00", properties: 0,  transactions: 2,  spent:  620000  },
  { id: 3,  publicId: "usr-003", firstName: "Priya",  lastName: "Patel",     email: "priya.p@email.com",  phone: "+1 555-0303", role: "ROLE_OWNER",         status: "ACTIVE",    companyId: null, licenseNumber: null,      createdAt: "2025-03-05T11:00:00", properties: 4,  transactions: 3,  earned: 1250000 },
  { id: 4,  publicId: "usr-004", firstName: "David",  lastName: "Okafor",    email: "david.o@email.com",  phone: "+1 555-0404", role: "ROLE_AGENT",         status: "SUSPENDED", companyId: 1,    licenseNumber: "LIC-004", createdAt: "2025-01-28T08:00:00", properties: 3,  transactions: 1,  earned: 22000   },
  { id: 5,  publicId: "usr-005", firstName: "Emma",   lastName: "Wilson",    email: "emma.w@email.com",   phone: "+1 555-0505", role: "ROLE_COMPANY_ADMIN", status: "ACTIVE",    companyId: 2,    licenseNumber: "LIC-005", createdAt: "2024-12-01T09:00:00", properties: 0,  transactions: 0,  earned: 0       },
  { id: 6,  publicId: "usr-006", firstName: "James",  lastName: "Nguyen",    email: "james.n@email.com",  phone: "+1 555-0606", role: "ROLE_CLIENT",        status: "ACTIVE",    companyId: null, licenseNumber: null,      createdAt: "2025-04-10T14:00:00", properties: 0,  transactions: 1,  spent:  310000  },
  { id: 7,  publicId: "usr-007", firstName: "Aisha",  lastName: "Malik",     email: "aisha.m@email.com",  phone: "+1 555-0707", role: "ROLE_AGENT",         status: "PENDING",   companyId: 2,    licenseNumber: "LIC-007", createdAt: "2025-07-01T10:00:00", properties: 1,  transactions: 0,  earned: 0       },
  { id: 8,  publicId: "usr-008", firstName: "Carlos", lastName: "Rivera",    email: "carlos.r@email.com", phone: "+1 555-0808", role: "ROLE_OWNER",         status: "ACTIVE",    companyId: null, licenseNumber: null,      createdAt: "2025-05-18T09:00:00", properties: 6,  transactions: 5,  earned: 2100000 },
  { id: 9,  publicId: "usr-009", firstName: "Fatima", lastName: "Al-Hassan", email: "fatima.a@email.com", phone: "+1 555-0909", role: "ROLE_MANAGER",       status: "ACTIVE",    companyId: 1,    licenseNumber: "LIC-009", createdAt: "2025-02-14T11:00:00", properties: 0,  transactions: 0,  earned: 0       },
  { id: 10, publicId: "usr-010", firstName: "Tom",    lastName: "Bradley",   email: "tom.b@email.com",    phone: "+1 555-1010", role: "ROLE_CLIENT",        status: "ACTIVE",    companyId: null, licenseNumber: null,      createdAt: "2025-06-22T08:00:00", properties: 0,  transactions: 3,  spent:  895000  },
  { id: 11, publicId: "usr-011", firstName: "Nina",   lastName: "Rossi",     email: "nina.r@email.com",   phone: "+1 555-1111", role: "ROLE_AGENT",         status: "ACTIVE",    companyId: 2,    licenseNumber: "LIC-011", createdAt: "2025-03-30T13:00:00", properties: 7,  transactions: 6,  earned: 97400   },
  { id: 12, publicId: "usr-012", firstName: "Omar",   lastName: "Hassan",    email: "omar.h@email.com",   phone: "+1 555-1212", role: "ROLE_OWNER",         status: "ACTIVE",    companyId: null, licenseNumber: null,      createdAt: "2025-04-05T10:00:00", properties: 2,  transactions: 2,  earned: 780000  },
  { id: 13, publicId: "usr-013", firstName: "Lily",   lastName: "Chen",      email: "lily.c@email.com",   phone: "+1 555-1313", role: "ROLE_COMPANY_ADMIN", status: "ACTIVE",    companyId: 1,    licenseNumber: "LIC-013", createdAt: "2024-11-20T09:00:00", properties: 0,  transactions: 0,  earned: 0       },
  { id: 14, publicId: "usr-014", firstName: "Andre",  lastName: "Dupont",    email: "andre.d@email.com",  phone: "+1 555-1414", role: "ROLE_CLIENT",        status: "SUSPENDED", companyId: null, licenseNumber: null,      createdAt: "2025-05-01T12:00:00", properties: 0,  transactions: 1,  spent:  450000  },
  { id: 15, publicId: "usr-015", firstName: "Zara",   lastName: "Khan",      email: "zara.k@email.com",   phone: "+1 555-1515", role: "ROLE_AGENT",         status: "ACTIVE",    companyId: 2,    licenseNumber: "LIC-015", createdAt: "2025-06-10T08:00:00", properties: 5,  transactions: 4,  earned: 61200   },
]

function buildProfile(u) {
  if (u.role === "ROLE_AGENT") return [
    { label: "Listings",     value: u.properties  ?? 0, color: "#1D4ED8" },
    { label: "Transactions", value: u.transactions ?? 0, color: "var(--color-text)" },
    { label: "Earned",       value: fmtCurrency(u.earned ?? 0), color: "#15803D", sub: "total commissions" },
  ]
  if (u.role === "ROLE_OWNER") return [
    { label: "Properties",   value: u.properties  ?? 0, color: "#C2410C" },
    { label: "Transactions", value: u.transactions ?? 0, color: "var(--color-text)" },
    { label: "Earned",       value: fmtCurrency(u.earned ?? 0), color: "#15803D", sub: "from sales" },
  ]
  if (u.role === "ROLE_CLIENT") return [
    { label: "Purchases",   value: u.transactions ?? 0, color: "#6D28D9" },
    { label: "Total Spent", value: fmtCurrency(u.spent ?? 0), color: u.spent ? "#C2410C" : "var(--color-text-muted)", sub: u.spent ? "across all purchases" : "no purchases yet" },
  ]
  return null
}

function Stat({ label, value, span }) {
  return (
    <div style={span ? { gridColumn: "span 2" } : {}}>
      <p style={{ margin: 0, fontSize: "0.65rem", fontWeight: 600, color: "var(--color-text-subtle)", textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</p>
      <p style={{ margin: "2px 0 0", fontSize: "0.8125rem", fontWeight: 700, color: "var(--color-text)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{value}</p>
    </div>
  )
}

export default function AdminUsers() {
  const [data, setData]           = useState(MOCK)
  const [roleTab, setRoleTab]     = useState("ALL")
  const [search, setSearch]       = useState("")
  const [statusFilter, setStatus] = useState("ALL")
  const [selected, setSelected]   = useState(null)
  const { filterRef, filterOpen, setFilterOpen } = useFilterPanel()

  const activeFilters = statusFilter !== "ALL" ? 1 : 0

  const stats = useMemo(() => ({
    total:   data.length,
    agents:  data.filter(u => u.role === "ROLE_AGENT").length,
    clients: data.filter(u => u.role === "ROLE_CLIENT").length,
    owners:  data.filter(u => u.role === "ROLE_OWNER").length,
  }), [data])

  const filters = { search, roleTab, statusFilter }
  const filterFn = (u, { search, roleTab, statusFilter }) => {
    if (roleTab      !== "ALL" && u.role   !== roleTab)      return false
    if (statusFilter !== "ALL" && u.status !== statusFilter) return false
    if (search.trim()) {
      const q = search.toLowerCase()
      if (!`${u.firstName} ${u.lastName}`.toLowerCase().includes(q) && !u.email.toLowerCase().includes(q)) return false
    }
    return true
  }

  const { filtered, pageRows, sortKey, sortDir, handleSort, page, setPage, totalPages } =
    useTableData(data, filterFn, filters)

  const toggleSuspend = (id) => {
    setData(prev => prev.map(u => u.id === id ? { ...u, status: u.status === "SUSPENDED" ? "ACTIVE" : "SUSPENDED" } : u))
    setSelected(s => s?.id === id ? { ...s, status: s.status === "SUSPENDED" ? "ACTIVE" : "SUSPENDED" } : s)
  }
  const deleteUser = (id) => { setData(prev => prev.filter(u => u.id !== id)); setSelected(s => s?.id === id ? null : s) }

  const userCard = (u) => {
    const rs = ROLE_STYLES[u.role]
    const ss = STATUS_STYLES[u.status] ?? STATUS_STYLES.ACTIVE
    return (
      <div style={{ backgroundColor: "var(--color-surface)", border: "1px solid var(--color-border)", borderRadius: "14px", overflow: "hidden", boxShadow: "0 1px 4px #0000000a" }}>
        <div style={{ height: 4, backgroundColor: avatarColor(u.id) }} />
        <div style={{ padding: "1rem" }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem", marginBottom: "0.875rem" }}>
            <div style={{ width: 46, height: 46, borderRadius: "50%", backgroundColor: avatarColor(u.id), color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.875rem", fontWeight: 700, flexShrink: 0, boxShadow: `0 0 0 3px ${avatarColor(u.id)}22` }}>
              {initials(u)}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ margin: 0, fontWeight: 700, fontSize: "0.9375rem", color: "var(--color-text)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{u.firstName} {u.lastName}</p>
              <p style={{ margin: "2px 0 0", fontSize: "0.75rem", color: "var(--color-text-muted)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{u.email}</p>
            </div>
            <ActionsMenu items={[
              { label: "View Details", icon: <Eye size={14} />, onClick: () => setSelected(u) },
              { label: u.status === "SUSPENDED" ? "Reactivate" : "Suspend",
                icon: u.status === "SUSPENDED" ? <ShieldCheck size={14} /> : <ShieldOff size={14} />,
                color: u.status === "SUSPENDED" ? "#15803D" : "#C2410C", onClick: () => toggleSuspend(u.id), dividerBefore: true },
              { label: "Delete", icon: <Trash2 size={14} />, color: "#B91C1C", onClick: () => deleteUser(u.id), dividerBefore: true },
            ]} />
          </div>
          <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap", marginBottom: "0.875rem" }}>
            <Badge bg={rs.bg} color={rs.color} label={rs.label} />
            <Badge bg={ss.bg} color={ss.color} label={ss.label} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.5rem", padding: "0.75rem", backgroundColor: "var(--color-bg-muted)", borderRadius: "10px" }}>
            {u.role === "ROLE_CLIENT" ? (
              <>
                <Stat label="Purchases" value={u.transactions ?? 0} />
                <Stat label="Spent" value={fmtCurrency(u.spent ?? 0)} span />
              </>
            ) : u.role === "ROLE_AGENT" || u.role === "ROLE_OWNER" ? (
              <>
                <Stat label={u.role === "ROLE_AGENT" ? "Listings" : "Properties"} value={u.properties ?? 0} />
                <Stat label="Deals" value={u.transactions ?? 0} />
                <Stat label="Earned" value={fmtCurrency(u.earned ?? 0)} />
              </>
            ) : (
              <>
                <Stat label="Joined" value={fmtDate(u.createdAt)} span />
                {u.companyId && <Stat label="Company" value={`#${u.companyId}`} />}
              </>
            )}
          </div>
          <p style={{ margin: "0.75rem 0 0", fontSize: "0.75rem", color: "var(--color-text-subtle)" }}>📞 {u.phone}</p>
        </div>
      </div>
    )
  }

  const columns = [
    { key: "firstName", label: "User", render: (_, u) => (
      <div style={{ display: "flex", alignItems: "center", gap: "0.65rem" }}>
        <div style={{ width: 34, height: 34, borderRadius: "50%", backgroundColor: avatarColor(u.id), color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.75rem", fontWeight: 700, flexShrink: 0 }}>{initials(u)}</div>
        <div>
          <p style={{ margin: 0, fontWeight: 500, color: "var(--color-text)" }}>{u.firstName} {u.lastName}</p>
          <p style={{ margin: 0, fontSize: "0.75rem", color: "var(--color-text-muted)" }}>{u.email}</p>
        </div>
      </div>
    )},
    { key: "role",      label: "Role",    render: (v) => { const r = ROLE_STYLES[v]; return <Badge {...r} /> } },
    { key: "status",    label: "Status",  render: (v) => { const s = STATUS_STYLES[v] ?? STATUS_STYLES.ACTIVE; return <Badge {...s} /> } },
    { key: "createdAt", label: "Joined",  render: (v) => fmtDate(v) },
    { key: null,        label: "Actions", render: (_, u) => (
      <ActionsMenu items={[
        { label: "View Details", icon: <Eye size={14} />, onClick: () => setSelected(u) },
        { label: u.status === "SUSPENDED" ? "Reactivate" : "Suspend",
          icon: u.status === "SUSPENDED" ? <ShieldCheck size={14} /> : <ShieldOff size={14} />,
          color: u.status === "SUSPENDED" ? "#15803D" : "#C2410C", onClick: () => toggleSuspend(u.id), dividerBefore: true },
        { label: "Delete", icon: <Trash2 size={14} />, color: "#B91C1C", onClick: () => deleteUser(u.id), dividerBefore: true },
      ]} />
    )},
  ]

  const sel   = selected
  const selRs = sel ? ROLE_STYLES[sel.role] : null
  const selSs = sel ? STATUS_STYLES[sel.status] ?? STATUS_STYLES.ACTIVE : null

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "1rem" }}>
        <StatCard label="Total Users" value={stats.total}   color="var(--color-primary)" />
        <StatCard label="Agents"      value={stats.agents}  color="#1D4ED8" />
        <StatCard label="Clients"     value={stats.clients} color="#6D28D9" />
        <StatCard label="Owners"      value={stats.owners}  color="#C2410C" />
      </div>

      <div style={{ display: "flex", gap: "0.25rem", borderBottom: "1px solid var(--color-border)" }}>
        {ROLE_TABS.map(tab => (
          <button key={tab.key} onClick={() => setRoleTab(tab.key)} style={{ padding: "0.6rem 1rem", background: "none", border: "none", borderBottom: roleTab === tab.key ? "2px solid var(--color-primary)" : "2px solid transparent", color: roleTab === tab.key ? "var(--color-primary)" : "var(--color-text-muted)", fontWeight: roleTab === tab.key ? 600 : 400, fontSize: "0.875rem", cursor: "pointer", whiteSpace: "nowrap", fontFamily: "inherit", marginBottom: "-1px", transition: "color 0.15s" }}>
            {tab.label}
            <span style={{ marginLeft: "0.4rem", fontSize: "0.75rem", color: "var(--color-text-subtle)" }}>
              {tab.key === "ALL" ? data.length : data.filter(u => u.role === tab.key).length}
            </span>
          </button>
        ))}
      </div>

      <Toolbar search={search} onSearch={setSearch} placeholder="Search name, email…" filterRef={filterRef} filterOpen={filterOpen} setFilterOpen={setFilterOpen} activeFilters={activeFilters}>
        <FilterGroup label="Status">
          {["ALL","ACTIVE","PENDING","SUSPENDED"].map(s => <Pill key={s} active={statusFilter === s} onClick={() => setStatus(s)}>{s === "ALL" ? "All" : STATUS_STYLES[s].label}</Pill>)}
        </FilterGroup>
        {activeFilters > 0 && <ClearBtn onClick={() => setStatus("ALL")} />}
      </Toolbar>

      <DataTable
        columns={columns}
        rows={pageRows}
        total={filtered.length}
        emptyMsg="No users found"
        sortKey={sortKey} sortDir={sortDir} onSort={handleSort}
        page={page} totalPages={totalPages} totalElements={filtered.length}
        pageSize={PAGE_SIZE} onPageChange={setPage}
        cardRender={userCard}
      />

      <DetailsDrawer
        open={!!sel}
        onClose={() => setSelected(null)}
        title={sel ? `${sel.firstName} ${sel.lastName}` : ""}
        subtitle={sel?.email}
        icon={sel && <div style={{ width: "22px", height: "22px", borderRadius: "50%", backgroundColor: avatarColor(sel.id), color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.65rem", fontWeight: 700 }}>{initials(sel)}</div>}
        profile={sel ? buildProfile(sel) : null}
        sections={sel ? [
          { heading: "Account", rows: [
            { label: "Role",       value: selRs && <Badge bg={selRs.bg} color={selRs.color} label={selRs.label} /> },
            { label: "Status",     value: selSs && <Badge bg={selSs.bg} color={selSs.color} label={selSs.label} /> },
            { label: "Public ID",  value: sel.publicId },
            { label: "Joined",     value: fmtDate(sel.createdAt) },
          ]},
          { heading: "Contact", rows: [
            { label: "Email", value: sel.email },
            { label: "Phone", value: sel.phone },
          ]},
          { heading: "Professional", rows: [
            { label: "Company",        value: sel.companyId     ? `#${sel.companyId}` : "—" },
            { label: "License Number", value: sel.licenseNumber ?? "—" },
          ]},
        ] : []}
        footer={sel && <>
          <button onClick={() => toggleSuspend(sel.id)} style={sel.status === "SUSPENDED" ? drawerPrimaryBtn("#15803D") : drawerOutlineBtn("#C2410C")}>
            {sel.status === "SUSPENDED" ? <><ShieldCheck size={14} /> Reactivate</> : <><ShieldOff size={14} /> Suspend</>}
          </button>
          <button onClick={() => deleteUser(sel.id)} style={drawerOutlineBtn("#B91C1C")}>
            <Trash2 size={14} /> Delete
          </button>
        </>}
      />
    </div>
  )
}
