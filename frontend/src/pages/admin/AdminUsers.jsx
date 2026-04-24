import { useState, useMemo, useEffect } from "react"
import { Eye, ShieldCheck, ShieldOff, Trash2, Loader2, UserPlus, X } from "lucide-react"
import DataTable from "../../components/shared/DataTable"
import { StatCard, Toolbar, FilterGroup, Pill, ClearBtn, Badge, ActionsMenu } from "../../components/shared/AdminUI"
import DetailsDrawer, { drawerPrimaryBtn, drawerOutlineBtn } from "../../components/shared/DetailsDrawer"
import { fmtDate } from "../../utils/formatters"
import { ROLE_STYLES, USER_STATUS as STATUS_STYLES, ROLE_TABS, avatarColor, initials, PAGE_SIZE } from "../../constants/enums"
import { useFilterPanel } from "../../hooks/useFilterPanel"
import { useTableData } from "../../hooks/useTableData"
import { usersApi } from "../../api/users.api"
import { authApi } from "../../api/auth.api"
import { toast } from "react-toastify"

const EMPTY_FORM = { firstName: "", lastName: "", email: "", password: "", role: "ROLE_AGENT", licenseNumber: "", companyId: "" }

function Field({ label, error, children }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
      <label style={{ fontSize: "0.72rem", fontWeight: 600, color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: "0.04em" }}>{label}</label>
      {children}
      {error && <span style={{ fontSize: "0.72rem", color: "#B91C1C" }}>{error}</span>}
    </div>
  )
}

const inp = { padding: "0.55rem 0.85rem", borderRadius: "8px", border: "1px solid var(--color-border)", backgroundColor: "var(--color-bg-muted)", fontSize: "0.875rem", color: "var(--color-text)", outline: "none", fontFamily: "inherit", width: "100%", boxSizing: "border-box" }

function AddUserModal({ onClose, onCreated }) {
  const [form, setForm]     = useState(EMPTY_FORM)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const set = (k, v) => { setForm(f => ({ ...f, [k]: v })); setErrors(e => ({ ...e, [k]: "" })) }

  const validate = () => {
    const e = {}
    if (!form.firstName.trim()) e.firstName = "Required"
    if (!form.lastName.trim())  e.lastName  = "Required"
    if (!form.email.trim())     e.email     = "Required"
    if (!form.password || form.password.length < 8) e.password = "Min 8 characters"
    if (form.role === "ROLE_AGENT" && !form.licenseNumber.trim()) e.licenseNumber = "Required for agents"
    return e
  }

  const handleSubmit = async () => {
    const e = validate()
    if (Object.keys(e).length) { setErrors(e); return }
    setLoading(true)
    try {
      const payload = {
        firstName: form.firstName, lastName: form.lastName,
        email: form.email, password: form.password, role: form.role,
        ...(form.role === "ROLE_AGENT" && { licenseNumber: form.licenseNumber, companyId: Number(form.companyId) || 1 }),
      }
      const data = await authApi.register(payload)
      toast.success("User created successfully")
      onCreated(data)
    } catch (err) {
      toast.error(err.message ?? "Failed to create user")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, backgroundColor: "#00000050", zIndex: 80 }} />
      <div style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: "min(500px, calc(100vw - 2rem))", backgroundColor: "var(--color-surface)", borderRadius: "16px", boxShadow: "0 24px 64px #00000030", zIndex: 90, overflow: "hidden" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1.25rem 1.5rem", borderBottom: "1px solid var(--color-border)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.65rem" }}>
            <div style={{ width: 36, height: 36, borderRadius: "9px", backgroundColor: "#FF4F0015", color: "var(--color-primary)", display: "flex", alignItems: "center", justifyContent: "center" }}><UserPlus size={17} /></div>
            <div>
              <p style={{ margin: 0, fontWeight: 700, fontSize: "0.9375rem", color: "var(--color-text)" }}>Add User</p>
              <p style={{ margin: 0, fontSize: "0.75rem", color: "var(--color-text-muted)" }}>Create a new user account</p>
            </div>
          </div>
          <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: "7px", border: "1px solid var(--color-border)", background: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--color-text-muted)" }}><X size={15} /></button>
        </div>
        <div style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1rem", maxHeight: "70vh", overflowY: "auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
            <Field label="First Name" error={errors.firstName}><input style={inp} value={form.firstName} onChange={e => set("firstName", e.target.value)} placeholder="Jean" /></Field>
            <Field label="Last Name"  error={errors.lastName}><input style={inp} value={form.lastName}  onChange={e => set("lastName",  e.target.value)} placeholder="Habimana" /></Field>
          </div>
          <Field label="Email" error={errors.email}><input style={inp} type="email" value={form.email} onChange={e => set("email", e.target.value)} placeholder="jean@example.com" /></Field>
          <Field label="Password" error={errors.password}><input style={inp} type="password" value={form.password} onChange={e => set("password", e.target.value)} placeholder="Min 8 characters" /></Field>
          <Field label="Role">
            <select style={inp} value={form.role} onChange={e => set("role", e.target.value)}>
              <option value="ROLE_ADMIN">Admin</option>
              <option value="ROLE_AGENT">Agent</option>
              <option value="ROLE_OWNER">Owner</option>
              <option value="ROLE_CUSTOMER">Customer</option>
            </select>
          </Field>
          {form.role === "ROLE_AGENT" && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
              <Field label="License No." error={errors.licenseNumber}><input style={inp} value={form.licenseNumber} onChange={e => set("licenseNumber", e.target.value)} placeholder="LIC-001" /></Field>
              <Field label="Company ID"><input style={inp} type="number" value={form.companyId} onChange={e => set("companyId", e.target.value)} placeholder="1" /></Field>
            </div>
          )}
        </div>
        <div style={{ display: "flex", gap: "0.65rem", justifyContent: "flex-end", padding: "1rem 1.5rem", borderTop: "1px solid var(--color-border)" }}>
          <button onClick={onClose} style={{ padding: "0.55rem 1.1rem", borderRadius: "9px", border: "1px solid var(--color-border)", background: "none", color: "var(--color-text-muted)", fontWeight: 500, fontSize: "0.8375rem", cursor: "pointer", fontFamily: "inherit" }}>Cancel</button>
          <button onClick={handleSubmit} disabled={loading} style={{ display: "flex", alignItems: "center", gap: "0.4rem", padding: "0.55rem 1.25rem", borderRadius: "9px", border: "none", backgroundColor: "var(--color-primary)", color: "#fff", fontWeight: 600, fontSize: "0.8375rem", cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.75 : 1, fontFamily: "inherit" }}>
            {loading && <Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} />}
            {loading ? "Creating…" : "Create User"}
          </button>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
      </div>
    </>
  )
}

export default function AdminUsers() {
  const [data, setData]           = useState([])
  const [loading, setLoading]     = useState(true)
  const [showAdd, setShowAdd]     = useState(false)
  const [roleTab, setRoleTab]     = useState("ALL")
  const [search, setSearch]       = useState("")
  const [statusFilter, setStatus] = useState("ALL")
  const [selected, setSelected]   = useState(null)
  const { filterRef, filterOpen, setFilterOpen } = useFilterPanel()

  const load = () => {
    setLoading(true)
    usersApi.getAll()
      .then(res => setData(Array.isArray(res) ? res : res.content ?? []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const activeFilters = statusFilter !== "ALL" ? 1 : 0

  const stats = useMemo(() => ({
    total:     data.length,
    agents:    data.filter(u => u.role === "ROLE_AGENT").length,
    customers: data.filter(u => u.role === "ROLE_CUSTOMER").length,
    owners:    data.filter(u => u.role === "ROLE_OWNER").length,
  }), [data])

  const filters = { search, roleTab, statusFilter }
  const filterFn = (u, { search, roleTab, statusFilter }) => {
    if (roleTab      !== "ALL" && u.role   !== roleTab)      return false
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
      setData(prev => prev.map(x => x.id === id ? { ...x, status: x.status === "SUSPENDED" ? "ACTIVE" : "SUSPENDED" } : x))
      setSelected(s => s?.id === id ? { ...s, status: s.status === "SUSPENDED" ? "ACTIVE" : "SUSPENDED" } : s)
    } catch {}
  }

  const deleteUser = async (id) => {
    try {
      await usersApi.remove(id)
      setData(prev => prev.filter(u => u.id !== id))
      setSelected(s => s?.id === id ? null : s)
    } catch {}
  }

  const userCard = (u) => {
    const rs = ROLE_STYLES[u.role] ?? { bg: "#F5F5F5", color: "#737373", label: u.role }
    const ss = STATUS_STYLES[u.status] ?? STATUS_STYLES.ACTIVE
    const uid = u.id ?? 0
    return (
      <div style={{ backgroundColor: "var(--color-surface)", border: "1px solid var(--color-border)", borderRadius: "14px", overflow: "hidden" }}>
        <div style={{ height: 4, backgroundColor: avatarColor(uid) }} />
        <div style={{ padding: "1rem" }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem", marginBottom: "0.75rem" }}>
            <div style={{ width: 44, height: 44, borderRadius: "50%", backgroundColor: avatarColor(uid), color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.875rem", fontWeight: 700, flexShrink: 0 }}>
              {u.firstName ? initials(u) : (u.username ?? "?")[0].toUpperCase()}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ margin: 0, fontWeight: 700, fontSize: "0.9375rem", color: "var(--color-text)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {u.firstName ? `${u.firstName} ${u.lastName}` : u.username}
              </p>
              <p style={{ margin: "2px 0 0", fontSize: "0.75rem", color: "var(--color-text-muted)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{u.email}</p>
            </div>
            <ActionsMenu items={[
              { label: "View Details", icon: <Eye size={14} />, onClick: () => setSelected(u) },
              { label: u.status === "SUSPENDED" ? "Reactivate" : "Suspend", icon: u.status === "SUSPENDED" ? <ShieldCheck size={14} /> : <ShieldOff size={14} />, color: u.status === "SUSPENDED" ? "#15803D" : "#C2410C", onClick: () => toggleSuspend(u.id), dividerBefore: true },
              { label: "Delete", icon: <Trash2 size={14} />, color: "#B91C1C", onClick: () => deleteUser(u.id), dividerBefore: true },
            ]} />
          </div>
          <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
            <Badge bg={rs.bg} color={rs.color} label={rs.label} />
            <Badge bg={ss.bg} color={ss.color} label={ss.label} />
          </div>
        </div>
      </div>
    )
  }

  const columns = [
    { key: "firstName", label: "User", render: (_, u) => (
      <div style={{ display: "flex", alignItems: "center", gap: "0.65rem" }}>
        <div style={{ width: 34, height: 34, borderRadius: "50%", backgroundColor: avatarColor(u.id ?? 0), color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.75rem", fontWeight: 700, flexShrink: 0 }}>
          {u.firstName ? initials(u) : (u.username ?? "?")[0].toUpperCase()}
        </div>
        <div>
          <p style={{ margin: 0, fontWeight: 500, color: "var(--color-text)" }}>{u.firstName ? `${u.firstName} ${u.lastName}` : u.username}</p>
          <p style={{ margin: 0, fontSize: "0.75rem", color: "var(--color-text-muted)" }}>{u.email}</p>
        </div>
      </div>
    )},
    { key: "role",      label: "Role",   render: (v) => { const r = ROLE_STYLES[v] ?? { bg: "#F5F5F5", color: "#737373", label: v }; return <Badge {...r} /> } },
    { key: "status",    label: "Status", render: (v) => { const s = STATUS_STYLES[v] ?? STATUS_STYLES.ACTIVE; return <Badge {...s} /> } },
    { key: "createdAt", label: "Joined", render: (v) => v ? fmtDate(v) : "—" },
    { key: null, label: "Actions", render: (_, u) => (
      <ActionsMenu items={[
        { label: "View Details", icon: <Eye size={14} />, onClick: () => setSelected(u) },
        { label: u.status === "SUSPENDED" ? "Reactivate" : "Suspend", icon: u.status === "SUSPENDED" ? <ShieldCheck size={14} /> : <ShieldOff size={14} />, color: u.status === "SUSPENDED" ? "#15803D" : "#C2410C", onClick: () => toggleSuspend(u.id), dividerBefore: true },
        { label: "Delete", icon: <Trash2 size={14} />, color: "#B91C1C", onClick: () => deleteUser(u.id), dividerBefore: true },
      ]} />
    )},
  ]

  const sel   = selected
  const selRs = sel ? (ROLE_STYLES[sel.role] ?? { bg: "#F5F5F5", color: "#737373", label: sel.role }) : null
  const selSs = sel ? (STATUS_STYLES[sel.status] ?? STATUS_STYLES.ACTIVE) : null

  if (loading) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "60vh", gap: "0.75rem", color: "var(--color-text-muted)" }}>
      <Loader2 size={20} style={{ animation: "spin 1s linear infinite" }} /> Loading users…
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>

      {/* Header with Add button */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.75rem" }}>
        <p style={{ margin: 0, fontWeight: 700, fontSize: "1.1rem", color: "var(--color-text)" }}>Users</p>
        <button onClick={() => setShowAdd(true)} style={{ display: "flex", alignItems: "center", gap: "0.45rem", padding: "0.6rem 1.1rem", borderRadius: "9px", border: "none", backgroundColor: "var(--color-primary)", color: "#fff", fontWeight: 600, fontSize: "0.8375rem", cursor: "pointer", fontFamily: "inherit" }}>
          <UserPlus size={15} /> Add User
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "1rem" }}>
        <StatCard label="Total Users" value={stats.total}     color="var(--color-primary)" />
        <StatCard label="Agents"      value={stats.agents}    color="#1D4ED8" />
        <StatCard label="Customers"   value={stats.customers} color="#6D28D9" />
        <StatCard label="Owners"      value={stats.owners}    color="#C2410C" />
      </div>

      <div style={{ display: "flex", gap: "0.25rem", borderBottom: "1px solid var(--color-border)" }}>
        {ROLE_TABS.map(tab => (
          <button key={tab.key} onClick={() => setRoleTab(tab.key)} style={{ padding: "0.6rem 1rem", background: "none", border: "none", borderBottom: roleTab === tab.key ? "2px solid var(--color-primary)" : "2px solid transparent", color: roleTab === tab.key ? "var(--color-primary)" : "var(--color-text-muted)", fontWeight: roleTab === tab.key ? 600 : 400, fontSize: "0.875rem", cursor: "pointer", whiteSpace: "nowrap", fontFamily: "inherit", marginBottom: "-1px" }}>
            {tab.label}
            <span style={{ marginLeft: "0.4rem", fontSize: "0.75rem", color: "var(--color-text-subtle)" }}>
              {tab.key === "ALL" ? data.length : data.filter(u => u.role === tab.key).length}
            </span>
          </button>
        ))}
      </div>

      <Toolbar search={search} onSearch={setSearch} placeholder="Search name, email…" filterRef={filterRef} filterOpen={filterOpen} setFilterOpen={setFilterOpen} activeFilters={activeFilters}>
        <FilterGroup label="Status">
          {["ALL","ACTIVE","PENDING","SUSPENDED"].map(s => <Pill key={s} active={statusFilter === s} onClick={() => setStatus(s)}>{s === "ALL" ? "All" : STATUS_STYLES[s]?.label ?? s}</Pill>)}
        </FilterGroup>
        {activeFilters > 0 && <ClearBtn onClick={() => setStatus("ALL")} />}
      </Toolbar>

      <DataTable columns={columns} rows={pageRows} total={filtered.length} emptyMsg="No users found"
        sortKey={sortKey} sortDir={sortDir} onSort={handleSort}
        page={page} totalPages={totalPages} totalElements={filtered.length}
        pageSize={PAGE_SIZE} onPageChange={setPage} cardRender={userCard} />

      <DetailsDrawer
        open={!!sel} onClose={() => setSelected(null)}
        title={sel ? (sel.firstName ? `${sel.firstName} ${sel.lastName}` : sel.username) : ""}
        subtitle={sel?.email}
        sections={sel ? [
          { heading: "Account", rows: [
            { label: "Role",      value: selRs && <Badge bg={selRs.bg} color={selRs.color} label={selRs.label} /> },
            { label: "Status",    value: selSs && <Badge bg={selSs.bg} color={selSs.color} label={selSs.label} /> },
            { label: "Public ID", value: sel.publicId },
            { label: "Joined",    value: sel.createdAt ? fmtDate(sel.createdAt) : "—" },
          ]},
          { heading: "Contact", rows: [{ label: "Email", value: sel.email }]},
        ] : []}
        footer={sel && <>
          <button onClick={() => toggleSuspend(sel.id)} style={sel.status === "SUSPENDED" ? drawerPrimaryBtn("#15803D") : drawerOutlineBtn("#C2410C")}>
            {sel.status === "SUSPENDED" ? <><ShieldCheck size={14} /> Reactivate</> : <><ShieldOff size={14} /> Suspend</>}
          </button>
          <button onClick={() => deleteUser(sel.id)} style={drawerOutlineBtn("#B91C1C")}><Trash2 size={14} /> Delete</button>
        </>}
      />

      {showAdd && (
        <AddUserModal
          onClose={() => setShowAdd(false)}
          onCreated={(user) => { setData(prev => [user, ...prev]); setShowAdd(false) }}
        />
      )}
    </div>
  )
}
