import { useEffect, useState, useMemo, useCallback } from "react"
import { useSelector } from "react-redux"
import {
  Download, Loader2, TrendingUp, Home, FileText,
  DollarSign, ClipboardList, BarChart3, CheckCircle,
} from "lucide-react"
import { toast } from "react-toastify"
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from "recharts"
import { reportsApi }    from "../../api/reports.api"
import { dashboardApi }  from "../../api/dashboard.api"
import { propertiesApi } from "../../api/properties.api"
import { applicationsApi } from "../../api/applications.api"
import { transactionsApi } from "../../api/transactions.api"
import { fmtCurrency }   from "../../utils/formatters"
import KpiCard           from "../../components/shared/KpiCard"

// ── Style constants ───────────────────────────────────────────────────────────
const T  = { margin: 0, fontWeight: 700, fontSize: "0.9375rem", color: "var(--color-text)" }
const S  = { margin: "2px 0 0", fontSize: "0.75rem", color: "var(--color-text-muted)" }

const card = {
  backgroundColor: "var(--color-surface)",
  border: "1px solid var(--color-border)",
  borderRadius: "14px",
}

const MONTH_NAMES = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]
const PIE_COLORS  = ["#FF4F00","#1D4ED8","#15803D","#6D28D9","#0891B2","#C2410C","#F59E0B"]

// ── Shared chart tooltip ──────────────────────────────────────────────────────
function ChartTip({ active, payload, label, isCurrency }) {
  if (!active || !payload?.length) return null
  return (
    <div style={{ ...card, padding: "0.6rem 0.9rem", boxShadow: "0 4px 16px #00000015", fontSize: "0.8rem" }}>
      <p style={{ margin: 0, fontWeight: 700, color: "var(--color-text)" }}>{label}</p>
      {payload.map((p) => (
        <p key={p.dataKey} style={{ margin: "2px 0 0", color: p.color ?? "var(--color-primary)", fontWeight: 600 }}>
          {isCurrency ? fmtCurrency(p.value) : p.value} {p.name && p.name !== p.dataKey ? p.name : ""}
        </p>
      ))}
    </div>
  )
}

// ── Monthly bar chart ─────────────────────────────────────────────────────────
function MonthlyBarChart({ data, title, subtitle, dataKey, isCurrency }) {
  return (
    <div style={{ ...card, padding: "1.25rem 1.5rem" }}>
      <p style={T}>{title}</p>
      <p style={{ ...S, marginBottom: "1.25rem" }}>{subtitle}</p>
      {!data?.length ? (
        <div style={{ height: 160, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <p style={{ color: "var(--color-text-subtle)", fontSize: "0.8rem" }}>No data yet</p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={160}>
          <BarChart data={data} barSize={24}>
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: "var(--color-text-muted)" }} axisLine={false} tickLine={false} />
            <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: "var(--color-text-muted)" }} axisLine={false} tickLine={false} width={isCurrency ? 48 : 28}
              tickFormatter={isCurrency ? (v) => `${(v/1000).toFixed(0)}K` : undefined} />
            <Tooltip content={<ChartTip isCurrency={isCurrency} />} cursor={{ fill: "#FF4F0008" }} />
            <Bar dataKey={dataKey} fill="#FF4F00" radius={[5, 5, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}

// ── Pie / donut chart ─────────────────────────────────────────────────────────
function DonutChart({ data, title, subtitle }) {
  return (
    <div style={{ ...card, padding: "1.25rem 1.5rem" }}>
      <p style={T}>{title}</p>
      <p style={{ ...S, marginBottom: "0.75rem" }}>{subtitle}</p>
      {!data?.length ? (
        <div style={{ height: 180, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <p style={{ color: "var(--color-text-subtle)", fontSize: "0.8rem" }}>No data yet</p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={190}>
          <PieChart>
            <Pie data={data} cx="50%" cy="42%" innerRadius={46} outerRadius={70} paddingAngle={3} dataKey="value">
              {data.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
            </Pie>
            <Tooltip formatter={(v, name) => [v, name]} contentStyle={{ borderRadius: 10, border: "1px solid var(--color-border)", fontSize: "0.78rem" }} />
            <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: "0.73rem", color: "var(--color-text-muted)" }} />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}

// ── Role meta ─────────────────────────────────────────────────────────────────
const ROLE_META = {
  ROLE_ADMIN:    { title: "Admin Reports",  subtitle: "System-wide overview — properties, transactions, commissions, and agents." },
  ROLE_AGENT:    { title: "Agent Reports",  subtitle: "Your listings, applications, commissions, and monthly performance." },
  ROLE_OWNER:    { title: "Owner Reports",  subtitle: "Your property portfolio, transactions, and ownership activity." },
  ROLE_CUSTOMER: { title: "Client Reports", subtitle: "Your applications, purchases, and account history." },
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function ReportsPage() {
  const authUser = useSelector((s) => s.auth.user)
  const role     = useSelector((s) => s.auth.role)

  const [loading,     setLoading]     = useState(true)
  const [exporting,   setExporting]   = useState(false)
  const [activeKpi,   setActiveKpi]   = useState(0)

  // raw data per role
  const [agentDash,   setAgentDash]   = useState(null)   // ROLE_AGENT
  const [companyDash, setCompanyDash] = useState(null)   // ROLE_ADMIN
  const [properties,  setProperties]  = useState([])     // ROLE_OWNER / ROLE_CUSTOMER
  const [applications,setApplications]= useState([])     // ROLE_OWNER / ROLE_CUSTOMER
  const [transactions,setTransactions]= useState([])     // ROLE_OWNER / ROLE_CUSTOMER

  const { title, subtitle } = ROLE_META[role] ?? { title: "Reports", subtitle: "" }

  // ── Fetch on mount ────────────────────────────────────────────────────────
  useEffect(() => {
    setLoading(true)
    const load = async () => {
      try {
        if (role === "ROLE_AGENT") {
          const d = await dashboardApi.getAgent()
          setAgentDash(d)
        } else if (role === "ROLE_ADMIN") {
          const d = await dashboardApi.getDefaultCompany()
          setCompanyDash(d)
        } else if (role === "ROLE_OWNER") {
          const [p, t] = await Promise.all([
            propertiesApi.getMyOwned({ page: 0, size: 100 }),
            transactionsApi.getMyOwner(),
          ])
          setProperties(p.content ?? p ?? [])
          setTransactions(Array.isArray(t) ? t : t.content ?? [])
        } else if (role === "ROLE_CUSTOMER") {
          const [a, p, t] = await Promise.all([
            applicationsApi.getMy({ page: 0, size: 100 }),
            propertiesApi.getMyPurchases({ page: 0, size: 100 }),
            transactionsApi.getMyPurchases(),
          ])
          setApplications(a.content ?? a ?? [])
          setProperties(p.content ?? p ?? [])
          setTransactions(Array.isArray(t) ? t : t.content ?? [])
        }
      } catch {
        toast.error("Failed to load report data")
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [role])

  // ── Unified download ──────────────────────────────────────────────────────
  const handleDownload = useCallback(async () => {
    setExporting(true)
    try {
      if (role === "ROLE_ADMIN")    await reportsApi.downloadUsers()
      else if (role === "ROLE_AGENT")    await reportsApi.downloadAgent(authUser?.publicId)
      else if (role === "ROLE_OWNER")    await reportsApi.downloadOwner(authUser?.publicId)
      else if (role === "ROLE_CUSTOMER") await reportsApi.downloadClient(authUser?.publicId)
      toast.success("Report downloaded")
    } catch {
      toast.error("Download failed — try again")
    } finally {
      setExporting(false)
    }
  }, [role, authUser])

  // ── Derived KPIs ──────────────────────────────────────────────────────────
  const kpis = useMemo(() => {
    if (role === "ROLE_AGENT" && agentDash) return [
      { label: "Total Listings",    value: String(agentDash.totalListings),    sub: `${agentDash.activeListings} active`,          up: true,  icon: <Home size={18} />,         accent: "#1D4ED8" },
      { label: "Commission Earned", value: fmtCurrency(agentDash.totalCommissionEarned), sub: `${agentDash.totalSalesClosed} deals closed`, up: true, icon: <DollarSign size={18} />, accent: "#15803D" },
      { label: "Pending Apps",      value: String(agentDash.pendingApplicationsOnMyListings), sub: "awaiting review", up: false, icon: <ClipboardList size={18} />, accent: "#C2410C" },
      { label: "Sold Listings",     value: String(agentDash.soldListings),     sub: "all time",                                    up: true,  icon: <TrendingUp size={18} />,   accent: "#FF4F00" },
    ]
    if (role === "ROLE_ADMIN" && companyDash) return [
      { label: "Total Properties",  value: String(companyDash.totalProperties),  sub: `${companyDash.availableProperties} available`, up: true, icon: <Home size={18} />,         accent: "#1D4ED8" },
      { label: "Total Revenue",     value: fmtCurrency(companyDash.totalRevenue), sub: `${companyDash.totalCompletedSales} completed`, up: true, icon: <DollarSign size={18} />,   accent: "#15803D" },
      { label: "Commission Earned", value: fmtCurrency(companyDash.totalCommissionEarned), sub: "all time",                          up: true, icon: <BarChart3 size={18} />,    accent: "#FF4F00" },
      { label: "Pending Apps",      value: String(companyDash.pendingApplications), sub: "awaiting review",                          up: false, icon: <ClipboardList size={18} />, accent: "#C2410C" },
    ]
    if (role === "ROLE_OWNER") {
      const completed = transactions.filter(t => t.status === "COMPLETED")
      const revenue   = completed.reduce((s, t) => s + Number(t.saleAmount ?? 0), 0)
      return [
        { label: "My Properties",   value: String(properties.length),  sub: `${properties.filter(p => p.status === "AVAILABLE").length} available`, up: true, icon: <Home size={18} />,         accent: "#1D4ED8" },
        { label: "Revenue Earned",  value: fmtCurrency(revenue),       sub: `${completed.length} completed sales`,                                   up: true, icon: <DollarSign size={18} />,   accent: "#15803D" },
        { label: "Transactions",    value: String(transactions.length), sub: "total",                                                                 up: true, icon: <TrendingUp size={18} />,   accent: "#FF4F00" },
        { label: "Under Offer",     value: String(properties.filter(p => p.status === "UNDER_OFFER").length), sub: "properties",                     up: true, icon: <FileText size={18} />,     accent: "#6D28D9" },
      ]
    }
    if (role === "ROLE_CUSTOMER") {
      const accepted = applications.filter(a => a.status === "ACCEPTED").length
      const totalBid = applications.reduce((s, a) => s + Number(a.offerAmount ?? 0), 0)
      return [
        { label: "Applications",    value: String(applications.length), sub: "submitted",                    up: true,  icon: <ClipboardList size={18} />, accent: "#1D4ED8" },
        { label: "Accepted",        value: String(accepted),            sub: "all time",                     up: true,  icon: <CheckCircle size={18} />,   accent: "#15803D" },
        { label: "Total Bid Value", value: fmtCurrency(totalBid),       sub: "across all bids",              up: true,  icon: <DollarSign size={18} />,    accent: "#FF4F00" },
        { label: "Purchases",       value: String(properties.length),   sub: "completed",                    up: true,  icon: <Home size={18} />,          accent: "#6D28D9" },
      ]
    }
    return []
  }, [role, agentDash, companyDash, properties, applications, transactions])

  // ── Chart data ────────────────────────────────────────────────────────────
  const monthlyBarData = useMemo(() => {
    if (role === "ROLE_AGENT" && agentDash?.monthlyCommissionTrend) {
      return agentDash.monthlyCommissionTrend.map(p => ({
        month: MONTH_NAMES[p.month - 1],
        commission: Number(p.commissionEarned),
        sales: p.salesCount,
      }))
    }
    if (role === "ROLE_ADMIN" && companyDash?.monthlySalesTrend) {
      return companyDash.monthlySalesTrend.map(p => ({
        month: MONTH_NAMES[p.month - 1],
        revenue: Number(p.totalAmount),
        sales: p.count,
      }))
    }
    return []
  }, [role, agentDash, companyDash])

  const pieData1 = useMemo(() => {
    if (role === "ROLE_AGENT" && agentDash?.listingsByStatus) {
      return Object.entries(agentDash.listingsByStatus).map(([name, value]) => ({ name, value: Number(value) }))
    }
    if (role === "ROLE_ADMIN" && companyDash?.propertiesByStatus) {
      return Object.entries(companyDash.propertiesByStatus).map(([name, value]) => ({ name, value: Number(value) }))
    }
    if (role === "ROLE_OWNER" && properties.length) {
      const counts = {}
      properties.forEach(p => { counts[p.status] = (counts[p.status] ?? 0) + 1 })
      return Object.entries(counts).map(([name, value]) => ({ name, value }))
    }
    if (role === "ROLE_CUSTOMER" && applications.length) {
      const counts = {}
      applications.forEach(a => { counts[a.status] = (counts[a.status] ?? 0) + 1 })
      return Object.entries(counts).map(([name, value]) => ({ name, value }))
    }
    return []
  }, [role, agentDash, companyDash, properties, applications])

  const pieData2 = useMemo(() => {
    if (role === "ROLE_ADMIN" && companyDash?.propertiesByType) {
      return Object.entries(companyDash.propertiesByType).map(([name, value]) => ({ name, value: Number(value) }))
    }
    if (role === "ROLE_ADMIN" && companyDash?.applicationsByFundingSource) {
      return Object.entries(companyDash.applicationsByFundingSource).map(([name, value]) => ({ name, value: Number(value) }))
    }
    return []
  }, [role, companyDash])

  // ── Loading ───────────────────────────────────────────────────────────────
  if (loading) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "60vh", gap: "0.75rem", color: "var(--color-text-muted)" }}>
      <Loader2 size={20} style={{ animation: "spin 1s linear infinite" }} /> Loading report data…
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )

  const barKey      = role === "ROLE_AGENT" ? "commission" : "revenue"
  const barCurrency = true
  const pie1Title   = role === "ROLE_CUSTOMER" ? "Applications by Status" : "Properties by Status"
  const pie1Sub     = role === "ROLE_CUSTOMER" ? "Breakdown of your bids" : "Current portfolio breakdown"

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.75rem", flexWrap: "wrap" }}>
        <div>
          <p style={{ margin: 0, fontWeight: 700, fontSize: "1.1rem", color: "var(--color-text)" }}>{title}</p>
          <p style={{ margin: "2px 0 0", fontSize: "0.75rem", color: "var(--color-text-muted)" }}>{subtitle}</p>
        </div>
        <button
          onClick={handleDownload}
          disabled={exporting}
          style={{
            display: "flex", alignItems: "center", gap: "0.45rem",
            padding: "0.6rem 1.1rem", borderRadius: "9px", border: "none",
            backgroundColor: "var(--color-primary)", color: "#fff",
            fontWeight: 600, fontSize: "0.8375rem",
            cursor: exporting ? "not-allowed" : "pointer",
            opacity: exporting ? 0.75 : 1, fontFamily: "inherit",
          }}
        >
          {exporting
            ? <Loader2 size={15} style={{ animation: "spin 1s linear infinite" }} />
            : <Download size={15} />}
          {exporting ? "Preparing…" : "Download Report"}
        </button>
      </div>

      {/* KPIs */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
        {kpis.map((k, i) => (
          <KpiCard key={k.label} {...k} active={activeKpi === i} onClick={() => setActiveKpi(i)} />
        ))}
      </div>

      {/* Charts row 1 — monthly trend + pie 1 */}
      {(monthlyBarData.length > 0 || pieData1.length > 0) && (
        <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,300px)", gap: "1rem", alignItems: "start" }} className="dash-grid">
          {monthlyBarData.length > 0 && (
            <MonthlyBarChart
              data={monthlyBarData}
              title={role === "ROLE_AGENT" ? "Monthly Commission" : "Monthly Revenue"}
              subtitle="Last 12 months"
              dataKey={barKey}
              isCurrency={barCurrency}
            />
          )}
          {pieData1.length > 0 && (
            <DonutChart data={pieData1} title={pie1Title} subtitle={pie1Sub} />
          )}
        </div>
      )}

      {/* Charts row 2 — admin only: sales count trend + property type */}
      {role === "ROLE_ADMIN" && (
        <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,300px)", gap: "1rem", alignItems: "start" }} className="dash-grid">
          {monthlyBarData.length > 0 && (
            <MonthlyBarChart
              data={monthlyBarData}
              title="Monthly Sales Count"
              subtitle="Completed transactions per month"
              dataKey="sales"
              isCurrency={false}
            />
          )}
          {pieData2.length > 0 && (
            <DonutChart data={pieData2} title="Properties by Type" subtitle="Portfolio type breakdown" />
          )}
        </div>
      )}

      {/* Admin extra: funding source + city breakdown */}
      {role === "ROLE_ADMIN" && companyDash && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1rem" }}>
          {companyDash.applicationsByFundingSource && Object.keys(companyDash.applicationsByFundingSource).length > 0 && (
            <DonutChart
              data={Object.entries(companyDash.applicationsByFundingSource).map(([name, value]) => ({ name, value: Number(value) }))}
              title="Applications by Funding"
              subtitle="How buyers are financing"
            />
          )}
          {companyDash.propertiesByCity && Object.keys(companyDash.propertiesByCity).length > 0 && (
            <DonutChart
              data={Object.entries(companyDash.propertiesByCity).map(([name, value]) => ({ name, value: Number(value) }))}
              title="Properties by City"
              subtitle="Geographic distribution"
            />
          )}
        </div>
      )}

      {/* Agent extra: sales count trend */}
      {role === "ROLE_AGENT" && monthlyBarData.length > 0 && (
        <MonthlyBarChart
          data={monthlyBarData}
          title="Monthly Sales Closed"
          subtitle="Deals completed per month"
          dataKey="sales"
          isCurrency={false}
        />
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )
}
