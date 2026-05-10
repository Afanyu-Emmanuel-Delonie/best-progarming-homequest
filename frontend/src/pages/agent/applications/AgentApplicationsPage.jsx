import { useState, useMemo, useEffect } from "react"
import { Eye, CheckCircle, XCircle, Loader2, Check, X } from "lucide-react"
import DataTable from "../../../components/shared/DataTable"
import { StatCard, Toolbar, FilterGroup, Pill, ClearBtn, Badge, ActionsMenu } from "../../../components/shared/AdminUI"
import DetailsDrawer, { drawerPrimaryBtn } from "../../../components/shared/DetailsDrawer"
import { fmtCurrency, fmtCurrencyFull, fmtDate } from "../../../utils/formatters"
import { APPLICATION_STATUS as STATUS_STYLES, FUNDING_LABELS, PAGE_SIZE } from "../../../constants/enums"
import { useFilterPanel } from "../../../hooks/useFilterPanel"
import { useTableData } from "../../../hooks/useTableData"
import { applicationsApi } from "../../../api/applications.api"
import { transactionsApi } from "../../../api/transactions.api"
import { toast } from "react-toastify"

// ── Complete Transaction Modal ──────────────────────────────────────────────
function CompleteTransactionModal({ application, onClose, onCompleted }) {
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")

  const transactionId = application.transactionId
  const saleAmount = Number(application.offerAmount)

  const submit = async () => {
    if (!transactionId) {
      setError("This application is not linked to a transaction yet.")
      return
    }

    setSubmitting(true)
    setError("")
    try {
      await transactionsApi.updateStatus(transactionId, "COMPLETED")
      toast.success("Transaction completed")
      onCompleted(application.id)
      onClose()
    } catch (e) {
      setError(e.message ?? "Failed to complete transaction")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0,0,0,0.5)",
        zIndex: 100,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem",
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: "#fff",
          borderRadius: "16px",
          width: "100%",
          maxWidth: 460,
          padding: "1.75rem",
          position: "relative",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "1rem",
            right: "1rem",
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "var(--color-text-muted)",
            display: "flex",
          }}
        >
          <X size={18} />
        </button>

        <div style={{ display: "flex", alignItems: "center", gap: "0.65rem", marginBottom: "1.25rem" }}>
          <div style={{ width: 38, height: 38, borderRadius: "9px", backgroundColor: "#F0FDF4", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Check size={18} style={{ color: "#15803D" }} />
          </div>
          <div>
            <p style={{ margin: 0, fontWeight: 700, fontSize: "1rem", color: "var(--color-text)" }}>Complete Transaction</p>
            <p style={{ margin: 0, fontSize: "0.75rem", color: "var(--color-text-muted)" }}>
              Application #{application.id} · Transaction #{transactionId ?? "—"}
            </p>
          </div>
        </div>

        <div style={{ backgroundColor: "var(--color-bg-muted)", borderRadius: "10px", padding: "0.875rem 1rem", marginBottom: "1.25rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          {[
            { label: "Transaction", value: transactionId ? `#${transactionId}` : "Not linked" },
            { label: "Buyer", value: application.buyerFullName },
            { label: "Offer Amount", value: fmtCurrencyFull(saleAmount) },
            { label: "Status", value: "Pending" },
          ].map((r) => (
            <div key={r.label} style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8375rem" }}>
              <span style={{ color: "var(--color-text-muted)" }}>{r.label}</span>
              <span style={{ fontWeight: 600, color: "var(--color-text)" }}>{r.value}</span>
            </div>
          ))}
        </div>

        {error && <p style={{ margin: 0, fontSize: "0.8rem", color: "#B91C1C" }}>{error}</p>}

        <button
          onClick={submit}
          disabled={submitting}
          style={{
            marginTop: "1.25rem",
            width: "100%",
            padding: "0.75rem",
            borderRadius: "10px",
            border: "none",
            backgroundColor: "#15803D",
            color: "#fff",
            fontWeight: 700,
            fontSize: "0.9rem",
            cursor: submitting ? "not-allowed" : "pointer",
            fontFamily: "inherit",
            opacity: submitting ? 0.7 : 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.5rem",
          }}
        >
          {submitting && <Loader2 size={15} style={{ animation: "spin 1s linear infinite" }} />}
          {submitting ? "Processing..." : "Confirm & Complete Transaction"}
          <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
        </button>
      </div>
    </div>
  )
}

// ── Main Page ───────────────────────────────────────────────────────────────
export default function AgentApplicationsPage() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatus] = useState("ALL")
  const [selected, setSelected] = useState(null)
  const [completing, setCompleting] = useState(null)
  const { filterRef, filterOpen, setFilterOpen } = useFilterPanel()

  useEffect(() => {
    Promise.all([
      applicationsApi.getMyListings({ page: 0, size: 100 }),
      transactionsApi.getMyListings(),
      transactionsApi.getMySales(),
    ])
      .then(([res, listingTx, sellingTx]) => {
        const allTransactions = [...(listingTx ?? []), ...(sellingTx ?? [])]
        const byPropertyId = new Map()

        allTransactions.forEach((tx) => {
          if (!tx?.propertyId) return
          const current = byPropertyId.get(tx.propertyId)
          if (!current || (current.status !== "PENDING" && tx.status === "PENDING")) {
            byPropertyId.set(tx.propertyId, tx)
          }
        })

        const rows = (res.content ?? res ?? []).map((app) => {
          const tx = byPropertyId.get(app.propertyId)
          return tx
            ? { ...app, transactionId: tx.id, transactionStatus: tx.status }
            : app
        })

        setData(rows)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const stats = useMemo(
    () => ({
      total: data.length,
      pending: data.filter((a) => a.status === "PENDING").length,
      accepted: data.filter((a) => a.status === "ACCEPTED").length,
      rejected: data.filter((a) => a.status === "REJECTED").length,
    }),
    [data]
  )

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

  const syncSelected = (id, updater) => setSelected((s) => (s?.id === id ? updater(s) : s))

  const accept = async (id) => {
    try {
      const updated = await applicationsApi.accept(id)
      setData((prev) => prev.map((a) => (a.id === id ? { ...a, ...updated } : a)))
      syncSelected(id, (s) => ({ ...s, ...updated }))
      toast.success("Application accepted and pending transaction created")
    } catch {}
  }

  const reject = async (id) => {
    try {
      const updated = await applicationsApi.reject(id)
      setData((prev) => prev.map((a) => (a.id === id ? { ...a, ...updated } : a)))
      syncSelected(id, (s) => ({ ...s, ...updated }))
      toast.success("Application rejected")
    } catch {}
  }

  const handleCompleted = (applicationId) => {
    setData((prev) => prev.map((a) => (a.id === applicationId ? { ...a, transactionStatus: "COMPLETED" } : a)))
    syncSelected(applicationId, (s) => ({ ...s, transactionStatus: "COMPLETED" }))
  }

  const columns = [
    { key: "propertyId", label: "Property", render: (v) => <span style={{ fontWeight: 500, color: "var(--color-primary)" }}>#{v}</span> },
    { key: "buyerFullName", label: "Buyer", render: (v, row) => <><p style={{ margin: 0, fontWeight: 500, color: "var(--color-text)" }}>{v}</p><p style={{ margin: 0, fontSize: "0.75rem", color: "var(--color-text-muted)" }}>{row.buyerPhone}</p></> },
    { key: "offerAmount", label: "Offer", render: (v) => <span style={{ fontWeight: 600, color: "var(--color-text)" }}>{fmtCurrency(Number(v))}</span> },
    { key: "status", label: "Status", render: (v) => { const s = STATUS_STYLES[v]; return s ? <Badge {...s} /> : v } },
    { key: "createdAt", label: "Received", render: (v) => (v ? fmtDate(v) : "—") },
    {
      key: null,
      label: "Actions",
      render: (_, row) => (
        <ActionsMenu
          items={[
            { label: "View Details", icon: <Eye size={14} />, onClick: () => setSelected(row) },
            ...(row.status === "PENDING"
              ? [
                  { label: "Accept", icon: <CheckCircle size={14} />, color: "#15803D", onClick: () => accept(row.id), dividerBefore: true },
                  { label: "Reject", icon: <XCircle size={14} />, color: "#B91C1C", onClick: () => reject(row.id) },
                ]
              : []),
            ...(row.status === "ACCEPTED" && row.transactionStatus !== "COMPLETED"
              ? [
                  { label: "Complete Transaction", icon: <Check size={14} />, color: "#15803D", onClick: () => setCompleting(row), dividerBefore: true },
                ]
              : []),
          ]}
        />
      ),
    },
  ]

  const sel = selected
  const selSt = sel ? STATUS_STYLES[sel.status] : null

  if (loading)
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "60vh", gap: "0.75rem", color: "var(--color-text-muted)" }}>
        <Loader2 size={20} style={{ animation: "spin 1s linear infinite" }} /> Loading applications...
        <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
      </div>
    )

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      <p style={{ margin: 0, fontWeight: 700, fontSize: "1.1rem", color: "var(--color-text)" }}>Applications</p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "1rem" }}>
        <StatCard label="Total" value={stats.total} color="var(--color-primary)" />
        <StatCard label="Pending" value={stats.pending} color="#C2410C" />
        <StatCard label="Accepted" value={stats.accepted} color="#15803D" />
        <StatCard label="Rejected" value={stats.rejected} color="#B91C1C" />
      </div>

      <Toolbar
        search={search}
        onSearch={setSearch}
        placeholder="Search buyer, property ID..."
        filterRef={filterRef}
        filterOpen={filterOpen}
        setFilterOpen={setFilterOpen}
        activeFilters={statusFilter !== "ALL" ? 1 : 0}
      >
        <FilterGroup label="Status">
          {["ALL", "PENDING", "ACCEPTED", "REJECTED", "WITHDRAWN", "EXPIRED"].map((s) => (
            <Pill key={s} active={statusFilter === s} onClick={() => setStatus(s)}>
              {s === "ALL" ? "All" : STATUS_STYLES[s]?.label ?? s}
            </Pill>
          ))}
        </FilterGroup>
        {statusFilter !== "ALL" && <ClearBtn onClick={() => setStatus("ALL")} />}
      </Toolbar>

      <DataTable
        columns={columns}
        rows={pageRows}
        total={filtered.length}
        emptyMsg="No applications found"
        sortKey={sortKey}
        sortDir={sortDir}
        onSort={handleSort}
        page={page}
        totalPages={totalPages}
        totalElements={filtered.length}
        pageSize={PAGE_SIZE}
        onPageChange={setPage}
      />

      <DetailsDrawer
        open={!!sel}
        onClose={() => setSelected(null)}
        title={sel?.buyerFullName}
        subtitle={`Application #${sel?.id} · Property #${sel?.propertyId}`}
        sections={
          sel
            ? [
                {
                  heading: "Offer",
                  rows: [
                    { label: "Offer Amount", value: fmtCurrencyFull(Number(sel.offerAmount)) },
                    { label: "Deposit", value: fmtCurrencyFull(Number(sel.depositAmount)) },
                    { label: "Funding", value: FUNDING_LABELS[sel.fundingSource] ?? sel.fundingSource },
                    { label: "Status", value: selSt && <Badge bg={selSt.bg} color={selSt.color} label={selSt.label} /> },
                    { label: "Transaction", value: sel.transactionId ? `#${sel.transactionId}` : "—" },
                    { label: "Transaction Status", value: sel.transactionStatus ?? "PENDING" },
                  ],
                },
                {
                  heading: "Dates",
                  rows: [
                    { label: "Received", value: sel.createdAt ? fmtDate(sel.createdAt) : "—" },
                    { label: "Closing Date", value: sel.proposedClosingDate ? fmtDate(sel.proposedClosingDate) : "—" },
                    { label: "Expires", value: sel.offerExpirationDate ? fmtDate(sel.offerExpirationDate) : "—" },
                  ],
                },
                {
                  heading: "Buyer",
                  rows: [
                    { label: "Name", value: sel.buyerFullName },
                    { label: "Phone", value: sel.buyerPhone },
                  ],
                },
              ]
            : []
        }
        footer={
          sel && (
            <>
              {sel.status === "PENDING" && (
                <>
                  <button onClick={() => accept(sel.id)} style={drawerPrimaryBtn("#15803D")}>
                    <CheckCircle size={14} /> Accept
                  </button>
                  <button onClick={() => reject(sel.id)} style={drawerPrimaryBtn("#B91C1C")}>
                    <XCircle size={14} /> Reject
                  </button>
                </>
              )}
              {sel.status === "ACCEPTED" && sel.transactionStatus !== "COMPLETED" && (
                <button onClick={() => { setCompleting(sel); setSelected(null) }} style={drawerPrimaryBtn("#15803D")}>
                  <Check size={14} /> Complete Transaction
                </button>
              )}
            </>
          )
        }
      />

      {completing && (
        <CompleteTransactionModal
          application={completing}
          onClose={() => setCompleting(null)}
          onCompleted={handleCompleted}
        />
      )}
    </div>
  )
}
