import { useState, useMemo, useEffect } from "react"
import { CheckCircle, XCircle, RotateCcw, Eye, Loader2, Plus, X } from "lucide-react"
import DataTable from "../../components/shared/DataTable"
import { StatCard, Toolbar, FilterGroup, Pill, ClearBtn, Badge, ActionsMenu } from "../../components/shared/AdminUI"
import DetailsDrawer, { drawerPrimaryBtn, drawerOutlineBtn } from "../../components/shared/DetailsDrawer"
import { fmtCurrency, fmtCurrencyFull, fmtDate } from "../../utils/formatters"
import { APPLICATION_STATUS as STATUS_STYLES, FUNDING_LABELS, PAGE_SIZE } from "../../constants/enums"
import { useFilterPanel } from "../../hooks/useFilterPanel"
import { useTableData } from "../../hooks/useTableData"
import { applicationsApi } from "../../api/applications.api"
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

const EMPTY = { propertyId: "", buyerFullName: "", buyerNationalId: "", buyerPhone: "", offerAmount: "", depositAmount: "", fundingSource: "CASH", proposedClosingDate: "", offerExpirationDate: "", specialConditions: "" }

function AddApplicationModal({ onClose, onCreated }) {
  const [form, setForm]       = useState(EMPTY)
  const [errors, setErrors]   = useState({})
  const [loading, setLoading] = useState(false)
  const set = (k, v) => { setForm(f => ({ ...f, [k]: v })); setErrors(e => ({ ...e, [k]: "" })) }

  const validate = () => {
    const e = {}
    if (!form.propertyId)                                          e.propertyId      = "Required"
    if (!form.buyerFullName.trim())                                e.buyerFullName   = "Required"
    if (!form.buyerNationalId.trim())                              e.buyerNationalId = "Required"
    if (!form.buyerPhone.trim())                                   e.buyerPhone      = "Required"
    if (!form.offerAmount   || isNaN(Number(form.offerAmount)))   e.offerAmount     = "Required"
    if (!form.depositAmount || isNaN(Number(form.depositAmount))) e.depositAmount   = "Required"
    if (!form.proposedClosingDate)                                 e.proposedClosingDate = "Required"
    if (!form.offerExpirationDate)                                 e.offerExpirationDate = "Required"
    return e
  }

  const handleSubmit = async () => {
    const e = validate()
    if (Object.keys(e).length) { setErrors(e); return }
    setLoading(true)
    try {
      const created = await applicationsApi.submit({
        propertyId:          Number(form.propertyId),
        buyerFullName:       form.buyerFullName,
        buyerNationalId:     form.buyerNationalId,
        buyerPhone:          form.buyerPhone,
        offerAmount:         Number(form.offerAmount),
        depositAmount:       Number(form.depositAmount),
        fundingSource:       form.fundingSource,
        proposedClosingDate: form.proposedClosingDate,
        offerExpirationDate: form.offerExpirationDate,
        specialConditions:   form.specialConditions || null,
      })
      toast.success("Application submitted")
      onCreated(created)
    } catch (err) {
      toast.error(err.message ?? "Failed to submit application")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, backgroundColor: "#00000050", zIndex: 80 }} />
      <div style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: "min(560px, calc(100vw - 2rem))", maxHeight: "90vh", backgroundColor: "var(--color-surface)", borderRadius: "16px", boxShadow: "0 24px 64px #00000030", zIndex: 90, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1.25rem 1.5rem", borderBottom: "1px solid var(--color-border)", flexShrink: 0 }}>
          <p style={{ margin: 0, fontWeight: 700, fontSize: "0.9375rem", color: "var(--color-text)" }}>New Application</p>
          <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: "7px", border: "1px solid var(--color-border)", background: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--color-text-muted)" }}><X size={15} /></button>
        </div>
        <div style={{ padding: "1.5rem", overflowY: "auto", display: "flex", flexDirection: "column", gap: "1rem" }}>
          <Field label="Property ID" error={errors.propertyId}>
            <input style={inp} type="number" value={form.propertyId} onChange={e => set("propertyId", e.target.value)} placeholder="1" />
          </Field>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
            <Field label="Buyer Full Name" error={errors.buyerFullName}>
              <input style={inp} value={form.buyerFullName} onChange={e => set("buyerFullName", e.target.value)} placeholder="Jean Habimana" />
            </Field>
            <Field label="Buyer Phone" error={errors.buyerPhone}>
              <input style={inp} value={form.buyerPhone} onChange={e => set("buyerPhone", e.target.value)} placeholder="+250 7XX XXX XXX" />
            </Field>
          </div>
          <Field label="National ID / Passport" error={errors.buyerNationalId}>
            <input style={inp} value={form.buyerNationalId} onChange={e => set("buyerNationalId", e.target.value)} placeholder="1199880012345678" />
          </Field>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
            <Field label="Offer Amount (RWF)" error={errors.offerAmount}>
              <input style={inp} type="number" value={form.offerAmount} onChange={e => set("offerAmount", e.target.value)} placeholder="120000" />
            </Field>
            <Field label="Deposit Amount (RWF)" error={errors.depositAmount}>
              <input style={inp} type="number" value={form.depositAmount} onChange={e => set("depositAmount", e.target.value)} placeholder="12000" />
            </Field>
          </div>
          <Field label="Funding Source">
            <select style={inp} value={form.fundingSource} onChange={e => set("fundingSource", e.target.value)}>
              <option value="CASH">Cash</option>
              <option value="BANK_MORTGAGE">Bank Mortgage</option>
              <option value="PAYMENT_PLAN">Payment Plan</option>
            </select>
          </Field>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
            <Field label="Proposed Closing Date" error={errors.proposedClosingDate}>
              <input style={inp} type="date" value={form.proposedClosingDate} onChange={e => set("proposedClosingDate", e.target.value)} />
            </Field>
            <Field label="Offer Expiration Date" error={errors.offerExpirationDate}>
              <input style={inp} type="date" value={form.offerExpirationDate} onChange={e => set("offerExpirationDate", e.target.value)} />
            </Field>
          </div>
          <Field label="Special Conditions (optional)">
            <textarea style={{ ...inp, resize: "vertical", minHeight: 60 }} value={form.specialConditions} onChange={e => set("specialConditions", e.target.value)} placeholder="Any special terms…" />
          </Field>
        </div>
        <div style={{ display: "flex", gap: "0.65rem", justifyContent: "flex-end", padding: "1rem 1.5rem", borderTop: "1px solid var(--color-border)", flexShrink: 0 }}>
          <button onClick={onClose} style={{ padding: "0.55rem 1.1rem", borderRadius: "9px", border: "1px solid var(--color-border)", background: "none", color: "var(--color-text-muted)", fontWeight: 500, fontSize: "0.8375rem", cursor: "pointer", fontFamily: "inherit" }}>Cancel</button>
          <button onClick={handleSubmit} disabled={loading} style={{ display: "flex", alignItems: "center", gap: "0.4rem", padding: "0.55rem 1.25rem", borderRadius: "9px", border: "none", backgroundColor: "var(--color-primary)", color: "#fff", fontWeight: 600, fontSize: "0.8375rem", cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.75 : 1, fontFamily: "inherit" }}>
            {loading && <Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} />}
            {loading ? "Submitting…" : "Submit Application"}
          </button>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
      </div>
    </>
  )
}

export default function AdminApplications() {
  const [data, setData]             = useState([])
  const [loading, setLoading]       = useState(true)
  const [showAdd, setShowAdd]       = useState(false)
  const [search, setSearch]         = useState("")
  const [statusFilter, setStatus]   = useState("ALL")
  const [fundingFilter, setFunding] = useState("ALL")
  const [selected, setSelected]     = useState(null)
  const { filterRef, filterOpen, setFilterOpen } = useFilterPanel()

  useEffect(() => {
    applicationsApi.getAll({ page: 0, size: 100 })
      .then(res => setData(res.content ?? res ?? []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

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
      if (!(a.buyerFullName ?? "").toLowerCase().includes(q) && !String(a.propertyId).includes(q) && !String(a.id).includes(q)) return false
    }
    return true
  }

  const { filtered, pageRows, sortKey, sortDir, handleSort, page, setPage, totalPages } =
    useTableData(data, filterFn, filters)

  const syncSelected = (id, status) => setSelected(s => s?.id === id ? { ...s, status } : s)

  const accept = async (id) => {
    try { await applicationsApi.accept(id); setData(p => p.map(a => a.id === id ? { ...a, status: "ACCEPTED" } : a)); syncSelected(id, "ACCEPTED") } catch {}
  }
  const reject = async (id) => {
    try { await applicationsApi.reject(id); setData(p => p.map(a => a.id === id ? { ...a, status: "REJECTED" } : a)); syncSelected(id, "REJECTED") } catch {}
  }
  const withdraw = async (id) => {
    try { await applicationsApi.withdraw(id); setData(p => p.map(a => a.id === id ? { ...a, status: "WITHDRAWN" } : a)); syncSelected(id, "WITHDRAWN") } catch {}
  }

  const columns = [
    { key: "buyerFullName", label: "Buyer", render: (v, row) => (
      <><p style={{ margin: 0, fontWeight: 500, color: "var(--color-text)" }}>{v}</p><p style={{ margin: 0, fontSize: "0.75rem", color: "var(--color-text-muted)" }}>{row.buyerPhone}</p></>
    )},
    { key: "propertyId",  label: "Property",  render: (v) => <span style={{ fontWeight: 500, color: "var(--color-primary)" }}>#{v}</span> },
    { key: "offerAmount", label: "Offer",     render: (v) => <span style={{ fontWeight: 600, color: "var(--color-text)" }}>{fmtCurrency(Number(v))}</span> },
    { key: "status",      label: "Status",    render: (v) => { const s = STATUS_STYLES[v]; return s ? <Badge {...s} /> : v } },
    { key: "createdAt",   label: "Submitted", render: (v) => v ? fmtDate(v) : "—" },
    { key: null, label: "Actions", render: (_, row) => (
      <ActionsMenu items={[
        { label: "View Details", icon: <Eye size={14} />, onClick: () => setSelected(row) },
        ...(row.status === "PENDING" ? [
          { label: "Accept",   icon: <CheckCircle size={14} />, color: "#15803D", onClick: () => accept(row.id),   dividerBefore: true },
          { label: "Reject",   icon: <XCircle size={14} />,    color: "#B91C1C", onClick: () => reject(row.id)   },
        ] : []),
        ...(row.status === "ACCEPTED" ? [
          { label: "Withdraw", icon: <RotateCcw size={14} />,  color: "#737373", onClick: () => withdraw(row.id), dividerBefore: true },
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

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.75rem" }}>
        <p style={{ margin: 0, fontWeight: 700, fontSize: "1.1rem", color: "var(--color-text)" }}>Applications</p>
        <button onClick={() => setShowAdd(true)} style={{ display: "flex", alignItems: "center", gap: "0.45rem", padding: "0.6rem 1.1rem", borderRadius: "9px", border: "none", backgroundColor: "var(--color-primary)", color: "#fff", fontWeight: 600, fontSize: "0.8375rem", cursor: "pointer", fontFamily: "inherit" }}>
          <Plus size={15} /> New Application
        </button>
      </div>

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
          {["ALL","PENDING","ACCEPTED","REJECTED","WITHDRAWN","EXPIRED"].map(s => <Pill key={s} active={statusFilter === s} onClick={() => setStatus(s)}>{s === "ALL" ? "All" : STATUS_STYLES[s]?.label ?? s}</Pill>)}
        </FilterGroup>
        <FilterGroup label="Funding Source">
          {["ALL","CASH","BANK_MORTGAGE","PAYMENT_PLAN"].map(f => <Pill key={f} active={fundingFilter === f} onClick={() => setFunding(f)}>{f === "ALL" ? "All" : FUNDING_LABELS[f] ?? f}</Pill>)}
        </FilterGroup>
        {activeFilters > 0 && <ClearBtn onClick={() => { setStatus("ALL"); setFunding("ALL") }} />}
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
            { label: "Offer Amount",   value: fmtCurrencyFull(Number(sel.offerAmount))   },
            { label: "Deposit",        value: fmtCurrencyFull(Number(sel.depositAmount)) },
            { label: "Funding Source", value: FUNDING_LABELS[sel.fundingSource] ?? sel.fundingSource },
            { label: "Status",         value: selSt && <Badge bg={selSt.bg} color={selSt.color} label={selSt.label} /> },
          ]},
          { heading: "Dates", rows: [
            { label: "Submitted",    value: sel.createdAt           ? fmtDate(sel.createdAt)           : "—" },
            { label: "Closing Date", value: sel.proposedClosingDate ? fmtDate(sel.proposedClosingDate) : "—" },
            { label: "Offer Expires",value: sel.offerExpirationDate ? fmtDate(sel.offerExpirationDate) : "—" },
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

      {showAdd && (
        <AddApplicationModal
          onClose={() => setShowAdd(false)}
          onCreated={(a) => { setData(prev => [a, ...prev]); setShowAdd(false) }}
        />
      )}
    </div>
  )
}
