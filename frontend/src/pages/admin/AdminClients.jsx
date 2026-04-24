import { useState, useMemo, useEffect } from "react"
import { Eye, ShieldCheck, ShieldOff, Trash2, Loader2 } from "lucide-react"
import DataTable from "../../components/shared/DataTable"
import { StatCard, Toolbar, FilterGroup, Pill, ClearBtn, Badge, ActionsMenu } from "../../components/shared/AdminUI"
import DetailsDrawer, { drawerPrimaryBtn, drawerOutlineBtn } from "../../components/shared/DetailsDrawer"
import { fmtDate } from "../../utils/formatters"
import { USER_STATUS as STATUS_STYLES, avatarColor, initials, PAGE_SIZE } from "../../constants/enums"
import { useFilterPanel } from "../../hooks/useFilterPanel"
import { useTableData } from "../../hooks/useTableData"
import { clientsApi } from "../../api/users.api"
import { usersApi } from "../../api/users.api"
import { applicationsApi } from "../../api/applications.api"
import { toast } from "react-toastify"

// Merge client profiles (firstName, lastName, phone) onto auth user records
function mergeProfiles(users, profiles) {
  return users.map(u => {
    const p = profiles.find(c => c.userPublicId === u.publicId)
    return p
      ? { ...u, firstName: p.firstName, lastName: p.lastName, phone: p.phone, profileId: p.id }
      : u
  })
}

export default function AdminClients() {
  const [data, setData]           = useState([])
  const [loading, setLoading]     = useState(true)
  const [search, setSearch]       = useState("")
  const [statusFilter, setStatus] = useState("ALL")
  const [selected, setSelected]   = useState(null)
  const [selApps, setSelApps]     = useState([])
  const [appsLoading, setAppsLoading] = useState(false)
  const { filterRef, filterOpen, setFilterOpen } = useFilterPanel()

  useEffect(() => {
    Promise.all([
      usersApi.getAll(),
      clientsApi.getAll(),
    ]).then(([users, profiles]) => {
      const customers = (Array.isArray(users) ? users : users.content ?? [])
        .filter(u => u.role === "ROLE_CUSTOMER")
      setData(mergeProfiles(customers, profiles))
    }).catch(() => {}).finally(() => setLoading(false))
  }, [])

  // Load applications when a client is selected
  useEffect(() => {
    if (!selected) { setSelApps([]); return }
    setAppsLoading(true)
    applicationsApi.getAll({ page: 0, size: 100 })
      .then(res => {
        const all = res.content ?? res ?? []
        // match by buyerPublicId if available, otherwise show nothing
        setSelApps(all.filter(a => a.buyerPublicId === selected.publicId || a.clientId === selected.profileId))
      })
      .catch(() => setSelApps([]))
      .finally(() => setAppsLoading(false))
  }, [selected])

  const activeFilters = statusFilter !== "ALL" ? 1 : 0

  const stats = useMemo(() => ({
    total:     data.length,
    active:    data.filter(u => u.status === "ACTIVE").length,
    suspended: data.filter(u => u.status === "SUSPENDED").length,
    pending:   data.filter(u => u.status === "PENDING").length,
  }), [data])

  const filters = { search, statusFilter }
  const filterFn = (u, { search, statusFilter }) => {
    if (statusFilter !== "ALL" && u.status !== statusFilter) return false
    if (search.trim()) {
      const q = search.toLowerCase()
      const name = `${u.firstName ?? u.username ?? ""} ${u.lastName ?? ""}`.toLowerCase()
      if (!name.includes(q) && !(u.email ?? "").toLowerCase().includes(q)) return false
    }
    return true
  }

  const { filtered, pageRows, sortKey, sortDir, handleSort, page, setPage, totalPages } =
    useTableData(data, filterFn, filters)

  const toggleSuspend = async (id) => {
    const u = data.find(x => x.id === id)
    try {
      if (u.status === "SUSPENDED") await usersApi.activate(id)
      else await usersApi.suspend(id)
      const next = u.status === "SUSPENDED" ? "ACTIVE" : "SUSPENDED"
      setData(prev => prev.map(x => x.id === id ? { ...x, status: next } : x))
      setSelected(s => s?.id === id ? { ...s, status: next } : s)
      toast.success(next === "ACTIVE" ? "Client reactivated" : "Client suspended")
    } catch {}
  }

  const deleteClient = async (id) => {
    try {
      await usersApi.remove(id)
      setData(prev => prev.filter(u => u.id !== id))
      setSelected(s => s?.id === id ? null : s)
      toast.success("Client deleted")
    } catch {}
  }

  const displayName = (u) => u.firstName ? `${u.firstName} ${u.lastName}` : u.username

  const columns = [
    { key: "firstName", label: "Client", render: (_, u) => (
      <div style={{ display: "flex", alignItems: "center", gap: "0.65rem" }}>
        <div style={{ width: 34, height: 34, borderRadius: "50%", backgroundColor: avatarColor(u.id ?? 0), color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.75rem", fontWeight: 700, flexShrink: 0 }}>
          {u.firstName ? initials(u) : (u.username ?? "?")[0].toUpperCase()}
        </div>
        <div>
          <p style={{ margin: 0, fontWeight: 500, color: "var(--color-text)" }}>{displayName(u)}</p>
          <p style={{ margin: 0, fontSize: "0.75rem", color: "var(--color-text-muted)" }}>{u.email}</p>
        </div>
      </div>
    )},
    { key: "phone",     label: "Phone",   render: (v) => v ?? "—" },
    { key: "status",    label: "Status",  render: (v) => { const s = STATUS_STYLES[v] ?? STATUS_STYLES.ACTIVE; return <Badge {...s} /> } },
    { key: "createdAt", label: "Joined",  render: (v) => v ? fmtDate(v) : "—" },
    { key: null, label: "Actions", render: (_, u) => (
      <ActionsMenu items={[
        { label: "View Details", icon: <Eye size={14} />, onClick: () => setSelected(u) },
        { label: u.status === "SUSPENDED" ? "Reactivate" : "Suspend", icon: u.status === "SUSPENDED" ? <ShieldCheck size={14} /> : <ShieldOff size={14} />, color: u.status === "SUSPENDED" ? "#15803D" : "#C2410C", onClick: () => toggleSuspend(u.id), dividerBefore: true },
        { label: "Delete", icon: <Trash2 size={14} />, color: "#B91C1C", onClick: () => deleteClient(u.id), dividerBefore: true },
      ]} />
    )},
  ]

  const sel   = selected
  const selSs = sel ? (STATUS_STYLES[sel.status] ?? STATUS_STYLES.ACTIVE) : null

  if (loading) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "60vh", gap: "0.75rem", color: "var(--color-text-muted)" }}>
      <Loader2 size={20} style={{ animation: "spin 1s linear infinite" }} /> Loading clients…
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>

      <p style={{ margin: 0, fontWeight: 700, fontSize: "1.1rem", color: "var(--color-text)" }}>Clients</p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "1rem" }}>
        <StatCard label="Total Clients" value={stats.total}     color="var(--color-primary)" />
        <StatCard label="Active"        value={stats.active}    color="#15803D" />
        <StatCard label="Pending"       value={stats.pending}   color="#C2410C" />
        <StatCard label="Suspended"     value={stats.suspended} color="#B91C1C" />
      </div>

      <Toolbar search={search} onSearch={setSearch} placeholder="Search name, email…" filterRef={filterRef} filterOpen={filterOpen} setFilterOpen={setFilterOpen} activeFilters={activeFilters}>
        <FilterGroup label="Status">
          {["ALL", "ACTIVE", "PENDING", "SUSPENDED"].map(s => (
            <Pill key={s} active={statusFilter === s} onClick={() => setStatus(s)}>
              {s === "ALL" ? "All" : STATUS_STYLES[s]?.label ?? s}
            </Pill>
          ))}
        </FilterGroup>
        {activeFilters > 0 && <ClearBtn onClick={() => setStatus("ALL")} />}
      </Toolbar>

      <DataTable columns={columns} rows={pageRows} total={filtered.length} emptyMsg="No clients found"
        sortKey={sortKey} sortDir={sortDir} onSort={handleSort}
        page={page} totalPages={totalPages} totalElements={filtered.length}
        pageSize={PAGE_SIZE} onPageChange={setPage} />

      <DetailsDrawer
        open={!!sel} onClose={() => setSelected(null)}
        title={sel ? displayName(sel) : ""}
        subtitle={sel?.email}
        profile={sel ? [
          { label: "Status",       value: selSs?.label ?? "—",                    color: selSs?.color },
          { label: "Applications", value: appsLoading ? "…" : String(selApps.length), color: "var(--color-primary)" },
        ] : []}
        sections={sel ? [
          { heading: "Account", rows: [
            { label: "Status",    value: selSs && <Badge bg={selSs.bg} color={selSs.color} label={selSs.label} /> },
            { label: "Public ID", value: sel.publicId },
            { label: "Joined",    value: sel.createdAt ? fmtDate(sel.createdAt) : "—" },
          ]},
          { heading: "Contact", rows: [
            { label: "Email", value: sel.email },
            { label: "Phone", value: sel.phone ?? "—" },
          ]},
          ...(selApps.length > 0 ? [{
            heading: "Recent Applications",
            rows: selApps.slice(0, 5).map(a => ({
              label: `#${a.id} · Property #${a.propertyId}`,
              value: a.status,
            })),
          }] : []),
        ] : []}
        footer={sel && <>
          <button onClick={() => toggleSuspend(sel.id)} style={sel.status === "SUSPENDED" ? drawerPrimaryBtn("#15803D") : drawerOutlineBtn("#C2410C")}>
            {sel.status === "SUSPENDED" ? <><ShieldCheck size={14} /> Reactivate</> : <><ShieldOff size={14} /> Suspend</>}
          </button>
          <button onClick={() => deleteClient(sel.id)} style={drawerOutlineBtn("#B91C1C")}><Trash2 size={14} /> Delete</button>
        </>}
      />
    </div>
  )
}
