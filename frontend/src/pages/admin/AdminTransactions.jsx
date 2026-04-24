import { useState, useMemo, useEffect } from "react"
import { CheckCircle, XCircle, Eye, Loader2, Plus, X } from "lucide-react"
import DataTable from "../../components/shared/DataTable"
import { StatCard, Toolbar, FilterGroup, Pill, ClearBtn, Badge, ActionsMenu } from "../../components/shared/AdminUI"
import DetailsDrawer, { drawerPrimaryBtn } from "../../components/shared/DetailsDrawer"
import { fmtCurrency, fmtCurrencyFull, fmtPct, fmtDate } from "../../utils/formatters"
import { TRANSACTION_STATUS as STATUS_STYLES, PAGE_SIZE } from "../../constants/enums"
import { useFilterPanel } from "../../hooks/useFilterPanel"
import { useTableData } from "../../hooks/useTableData"
import { transactionsApi } from "../../api/transactions.api"
import { resolvePublicId } from "../../api/users.api"
import { toast } from "react-toastify"

const inp = { padding: "0.55rem 0.85rem", borderRadius: "8px", border: "1px solid var(--color-border)", backgroundColor: "var(--color-bg-muted)", fontSize: "0.875rem", color: "var(--color-text)", outline: "none", fontFamily: "inherit", width: "100%", boxSizing: "border-box" }

function Field({ label, error, children }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
      <label style={{ fontSize: "0.72rem", fontWeight: 600, color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: "0.04em" }}>{label}</label>
      {children}
      {error && <span style={{ fontSize: "0.72rem", color: "#B91C1C" }}>{error}</span>}
    </div>
  )
}

const EMPTY_TX = { propertyId: "", sellingAgentPublicId: "", ownerPublicId: "", buyerPublicId: "", companyId: "1", saleAmount: "", commissionRate: "0.05", type: "SALE" }

function AddTransactionModal({ onClose, onCreated }) {
  const [form, setForm]       = useState(EMPTY_TX)
  const [errors, setErrors]   = useState({})
  const [loading, setLoading] = useState(false)
  const set = (k, v) => { setForm(f => ({ ...f, [k]: v })); setErrors(e => ({ ...e, [k]: "" })) }

  const validate = () => {
    const e = {}
    if (!form.propertyId)              e.propertyId           = "Required"
    if (!form.sellingAgentPublicId.trim()) e.sellingAgentPublicId = "Required"
    if (!form.ownerPublicId.trim())    e.ownerPublicId        = "Required"
    if (!form.buyerPublicId.trim())    e.buyerPublicId        = "Required"
    if (!form.saleAmount || isNaN(Number(form.saleAmount))) e.saleAmount = "Required"
    return e
  }

  const handleSubmit = async () => {
    const e = validate()
    if (Object.keys(e).length) { setErrors(e); return }
    setLoading(true)
    try {
      const created = await transactionsApi.create({
        propertyId:          Number(form.propertyId),
        sellingAgentPublicId: form.sellingAgentPublicId,
        ownerPublicId:       form.ownerPublicId,
        buyerPublicId:       form.buyerPublicId,
        companyId:           Number(form.companyId) || 1,
        saleAmount:          Number(form.saleAmount),
        commissionRate:      Number(form.commissionRate),
        type:                form.type,
      })
      toast.success("Transaction created")
      onCreated(created)
    } catch (err) {
      toast.error(err.message ?? "Failed to create transaction")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, backgroundColor: "#00000050", zIndex: 80 }} />
      <div style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: "min(560px, calc(100vw - 2rem))", maxHeight: "90vh", backgroundColor: "var(--color-surface)", borderRadius: "16px", boxShadow: "0 24px 64px #00000030", zIndex: 90, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1.25rem 1.5rem", borderBottom: "1px solid var(--color-border)", flexShrink: 0 }}>
          <p style={{ margin: 0, fontWeight: 700, fontSize: "0.9375rem", color: "var(--color-text)" }}>New Transaction</p>
          <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: "7px", border: "1px solid var(--color-border)", background: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--color-text-muted)" }}><X size={15} /></button>
        </div>
        <div style={{ padding: "1.5rem", overflowY: "auto", display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
            <Field label="Property ID" error={errors.propertyId}>
              <input style={inp} type="number" value={form.propertyId} onChange={e => set("propertyId", e.target.value)} placeholder="1" />
            </Field>
            <Field label="Type">
              <select style={inp} value={form.type} onChange={e => set("type", e.target.value)}>
                <option value="SALE">Sale</option>
                <option value="RENT">Rent</option>
              </select>
            </Field>
          </div>
          <Field label="Sale Amount (RWF)" error={errors.saleAmount}>
            <input style={inp} type="number" value={form.saleAmount} onChange={e => set("saleAmount", e.target.value)} placeholder="120000" />
          </Field>
          <Field label="Commission Rate (e.g. 0.05 = 5%)">
            <input style={inp} type="number" step="0.01" value={form.commissionRate} onChange={e => set("commissionRate", e.target.value)} placeholder="0.05" />
          </Field>
          <Field label="Selling Agent Public ID" error={errors.sellingAgentPublicId}>
            <input style={inp} value={form.sellingAgentPublicId} onChange={e => set("sellingAgentPublicId", e.target.value)} placeholder="uuid" />
          </Field>
          <Field label="Owner Public ID" error={errors.ownerPublicId}>
            <input style={inp} value={form.ownerPublicId} onChange={e => set("ownerPublicId", e.target.value)} placeholder="uuid" />
          </Field>
          <Field label="Buyer Public ID" error={errors.buyerPublicId}>
            <input style={inp} value={form.buyerPublicId} onChange={e => set("buyerPublicId", e.target.value)} placeholder="uuid" />
          </Field>
          <Field label="Company ID">
            <input style={inp} type="number" value={form.companyId} onChange={e => set("companyId", e.target.value)} placeholder="1" />
          </Field>
        </div>
        <div style={{ display: "flex", gap: "0.65rem", justifyContent: "flex-end", padding: "1rem 1.5rem", borderTop: "1px solid var(--color-border)", flexShrink: 0 }}>
          <button onClick={onClose} style={{ padding: "0.55rem 1.1rem", borderRadius: "9px", border: "1px solid var(--color-border)", background: "none", color: "var(--color-text-muted)", fontWeight: 500, fontSize: "0.8375rem", cursor: "pointer", fontFamily: "inherit" }}>Cancel</button>
          <button onClick={handleSubmit} disabled={loading} style={{ display: "flex", alignItems: "center", gap: "0.4rem", padding: "0.55rem 1.25rem", borderRadius: "9px", border: "none", backgroundColor: "var(--color-primary)", color: "#fff", fontWeight: 600, fontSize: "0.8375rem", cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.75 : 1, fontFamily: "inherit" }}>
            {loading && <Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} />}
            {loading ? "Creating…" : "Create Transaction"}
          </button>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
      </div>
    </>
  )
}

export default function AdminTransactions() {
  const [data, setData]           = useState([])
  const [loading, setLoading]     = useState(true)
  const [showAdd, setShowAdd]     = useState(false)
  const [names, setNames]         = useState({})
  const [search, setSearch]       = useState("")
  const [statusFilter, setStatus] = useState("ALL")
  const [typeFilter, setType]     = useState("ALL")
  const [selected, setSelected]   = useState(null)
  const { filterRef, filterOpen, setFilterOpen } = useFilterPanel()

  useEffect(() => {
    transactionsApi.getByCompany(1)
      .then(res => {
        const rows = Array.isArray(res) ? res : res.content ?? []
        setData(rows)
        const ids = [...new Set(rows.flatMap(t => [
          t.listingAgentPublicId, t.sellingAgentPublicId, t.ownerPublicId, t.buyerPublicId
        ].filter(Boolean)))]
        Promise.all(ids.map(id => resolvePublicId(id).then(name => [id, name])))
          .then(pairs => setNames(Object.fromEntries(pairs)))
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const activeFilters = (statusFilter !== "ALL" ? 1 : 0) + (typeFilter !== "ALL" ? 1 : 0)

  const stats = useMemo(() => ({
    total:     data.length,
    pending:   data.filter(t => t.status === "PENDING").length,
    completed: data.filter(t => t.status === "COMPLETED").length,
    revenue:   fmtCurrency(data.filter(t => t.status === "COMPLETED").reduce((s, t) => s + Number(t.saleAmount ?? 0), 0)),
  }), [data])

  const filters = { search, statusFilter, typeFilter }
  const filterFn = (t, { search, statusFilter, typeFilter }) => {
    if (statusFilter !== "ALL" && t.status !== statusFilter) return false
    if (typeFilter   !== "ALL" && t.type   !== typeFilter)   return false
    if (search.trim()) {
      const q = search.toLowerCase()
      if (!String(t.id).includes(q) && !String(t.propertyId).includes(q)) return false
    }
    return true
  }

  const { filtered, pageRows, sortKey, sortDir, handleSort, page, setPage, totalPages } =
    useTableData(data, filterFn, filters)

  const syncSelected = (id, status) => setSelected(s => s?.id === id ? { ...s, status } : s)

  const complete = async (id) => {
    try { await transactionsApi.updateStatus(id, "COMPLETED"); setData(p => p.map(t => t.id === id ? { ...t, status: "COMPLETED" } : t)); syncSelected(id, "COMPLETED") } catch {}
  }
  const cancel = async (id) => {
    try { await transactionsApi.updateStatus(id, "CANCELLED"); setData(p => p.map(t => t.id === id ? { ...t, status: "CANCELLED" } : t)); syncSelected(id, "CANCELLED") } catch {}
  }

  const columns = [
    { key: "propertyId",      label: "Property",   render: (v) => <span style={{ fontWeight: 600, color: "var(--color-primary)" }}>#{v}</span> },
    { key: "type",            label: "Type",       render: (v) => <Badge bg={v === "SALE" ? "#EFF6FF" : "#F5F3FF"} color={v === "SALE" ? "#1D4ED8" : "#6D28D9"} label={v} /> },
    { key: "saleAmount",      label: "Amount",     render: (v) => <span style={{ fontWeight: 600, color: "var(--color-text)" }}>{fmtCurrency(Number(v))}</span> },
    { key: "totalCommission", label: "Commission", render: (v) => fmtCurrency(Number(v)) },
    { key: "status",          label: "Status",     render: (v) => { const s = STATUS_STYLES[v]; return s ? <Badge {...s} /> : v } },
    { key: "createdAt",       label: "Date",       render: (v) => v ? fmtDate(v) : "—" },
    { key: null, label: "Actions", render: (_, row) => (
      <ActionsMenu items={[
        { label: "View Details", icon: <Eye size={14} />, onClick: () => setSelected(row) },
        ...(row.status === "PENDING" ? [
          { label: "Complete", icon: <CheckCircle size={14} />, color: "#15803D", onClick: () => complete(row.id), dividerBefore: true },
          { label: "Cancel",   icon: <XCircle size={14} />,    color: "#B91C1C", onClick: () => cancel(row.id)   },
        ] : []),
      ]} />
    )},
  ]

  const sel   = selected
  const selSt = sel ? STATUS_STYLES[sel.status] : null

  if (loading) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "60vh", gap: "0.75rem", color: "var(--color-text-muted)" }}>
      <Loader2 size={20} style={{ animation: "spin 1s linear infinite" }} /> Loading transactions…
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.75rem" }}>
        <p style={{ margin: 0, fontWeight: 700, fontSize: "1.1rem", color: "var(--color-text)" }}>Transactions</p>
        <button onClick={() => setShowAdd(true)} style={{ display: "flex", alignItems: "center", gap: "0.45rem", padding: "0.6rem 1.1rem", borderRadius: "9px", border: "none", backgroundColor: "var(--color-primary)", color: "#fff", fontWeight: 600, fontSize: "0.8375rem", cursor: "pointer", fontFamily: "inherit" }}>
          <Plus size={15} /> New Transaction
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "1rem" }}>
        <StatCard label="Total"     value={stats.total}     color="var(--color-primary)" />
        <StatCard label="Pending"   value={stats.pending}   color="#C2410C" />
        <StatCard label="Completed" value={stats.completed} color="#15803D" />
        <StatCard label="Revenue"   value={stats.revenue}   color="var(--color-primary)" />
      </div>

      <Toolbar search={search} onSearch={setSearch} placeholder="Search ID, property…" filterRef={filterRef} filterOpen={filterOpen} setFilterOpen={setFilterOpen} activeFilters={activeFilters}>
        <FilterGroup label="Status">
          {["ALL","PENDING","COMPLETED","CANCELLED"].map(s => <Pill key={s} active={statusFilter === s} onClick={() => setStatus(s)}>{s === "ALL" ? "All" : STATUS_STYLES[s]?.label ?? s}</Pill>)}
        </FilterGroup>
        <FilterGroup label="Type">
          {["ALL","SALE","RENT"].map(t => <Pill key={t} active={typeFilter === t} onClick={() => setType(t)}>{t === "ALL" ? "All" : t.charAt(0) + t.slice(1).toLowerCase()}</Pill>)}
        </FilterGroup>
        {activeFilters > 0 && <ClearBtn onClick={() => { setStatus("ALL"); setType("ALL") }} />}
      </Toolbar>

      <DataTable columns={columns} rows={pageRows} total={filtered.length} emptyMsg="No transactions found"
        sortKey={sortKey} sortDir={sortDir} onSort={handleSort}
        page={page} totalPages={totalPages} totalElements={filtered.length} pageSize={PAGE_SIZE} onPageChange={setPage} />

      <DetailsDrawer
        open={!!sel} onClose={() => setSelected(null)}
        title={`Transaction #${sel?.id}`}
        subtitle={`Property #${sel?.propertyId} · ${sel?.type}`}
        sections={sel ? [
          { heading: "Overview", rows: [
            { label: "Sale Amount",      value: fmtCurrencyFull(Number(sel.saleAmount))      },
            { label: "Commission Rate",  value: sel.commissionRate ? fmtPct(Number(sel.commissionRate)) : "—" },
            { label: "Total Commission", value: fmtCurrencyFull(Number(sel.totalCommission)) },
            { label: "Status",           value: selSt && <Badge bg={selSt.bg} color={selSt.color} label={selSt.label} /> },
            { label: "Date",             value: sel.createdAt ? fmtDate(sel.createdAt) : "—" },
          ]},
          { heading: "Commission Breakdown", rows: [
            { label: "Company Fee",   value: fmtCurrencyFull(Number(sel.companyCommission))      },
            { label: "Listing Agent", value: fmtCurrencyFull(Number(sel.listingAgentCommission)) },
            { label: "Selling Agent", value: fmtCurrencyFull(Number(sel.sellingAgentCommission)) },
          ]},
          { heading: "Parties", rows: [
            { label: "Listing Agent", value: names[sel.listingAgentPublicId] ?? sel.listingAgentPublicId ?? "—" },
            { label: "Selling Agent", value: names[sel.sellingAgentPublicId] ?? sel.sellingAgentPublicId ?? "—" },
            { label: "Owner",         value: names[sel.ownerPublicId]        ?? sel.ownerPublicId        ?? "—" },
            { label: "Buyer",         value: names[sel.buyerPublicId]        ?? sel.buyerPublicId        ?? "—" },
          ]},
        ] : []}
        footer={sel?.status === "PENDING" && <>
          <button onClick={() => complete(sel.id)} style={drawerPrimaryBtn("#15803D")}><CheckCircle size={14} /> Complete</button>
          <button onClick={() => cancel(sel.id)}   style={drawerPrimaryBtn("#B91C1C")}><XCircle size={14} /> Cancel</button>
        </>}
      />

      {showAdd && (
        <AddTransactionModal
          onClose={() => setShowAdd(false)}
          onCreated={(t) => { setData(prev => [t, ...prev]); setShowAdd(false) }}
        />
      )}
    </div>
  )
}
