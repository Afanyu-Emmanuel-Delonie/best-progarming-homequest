import { useMemo, useState, useCallback } from "react"
import { useSelector } from "react-redux"
import {
  BarChart3, Building2, Download, FileText,
  Loader2, UserCheck, Users, CheckCircle2, Clock,
  FileDown, TrendingUp,
} from "lucide-react"
import { toast } from "react-toastify"
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from "recharts"
import { reportsApi } from "../../api/reports.api"
import KpiCard from "../../components/shared/KpiCard"

// ── Shared style constants (matches the rest of the app) ─────────────────────
const T  = { margin: 0, fontWeight: 700, fontSize: "0.9375rem", color: "var(--color-text)" }
const S  = { margin: "2px 0 0", fontSize: "0.75rem", color: "var(--color-text-muted)" }
const TD = { padding: "0.75rem 1.25rem", color: "var(--color-text-muted)", verticalAlign: "middle" }

const card = {
  backgroundColor: "var(--color-surface)",
  border: "1px solid var(--color-border)",
  borderRadius: "14px",
}

// ── Role config ───────────────────────────────────────────────────────────────
const ROLE_META = {
  ROLE_ADMIN:    { title: "Admin Reports",  subtitle: "Export system-wide data for users, clients, and company operations." },
  ROLE_AGENT:    { title: "Agent Reports",  subtitle: "Download your listings, commissions, and performance data as CSV." },
  ROLE_OWNER:    { title: "Owner Reports",  subtitle: "Export your property, transaction, and ownership activity." },
  ROLE_CUSTOMER: { title: "Client Reports", subtitle: "Download your applications, purchases, and account history." },
}

// ── Chart tooltip ─────────────────────────────────────────────────────────────
function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div style={{ ...card, padding: "0.6rem 0.9rem", boxShadow: "0 4px 16px #00000015", fontSize: "0.8rem" }}>
      <p style={{ margin: 0, fontWeight: 700, color: "var(--color-text)" }}>{label}</p>
      <p style={{ margin: "2px 0 0", color: "var(--color-primary)", fontWeight: 600 }}>
        {payload[0].value} export{payload[0].value !== 1 ? "s" : ""}
      </p>
    </div>
  )
}

// ── Export card ───────────────────────────────────────────────────────────────
function ExportCard({ icon, title, description, meta, actionLabel, onClick, loading, accent = "var(--color-primary)" }) {
  return (
    <div style={{ ...card, padding: "1.25rem 1.5rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: "0.85rem" }}>
        <div style={{
          width: 40, height: 40, borderRadius: "10px", flexShrink: 0,
          backgroundColor: `${accent}15`, color: accent,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          {icon}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ margin: 0, fontWeight: 700, fontSize: "0.9rem", color: "var(--color-text)", fontFamily: "Manrope, sans-serif" }}>
            {title}
          </p>
          <p style={{ margin: "0.2rem 0 0", fontSize: "0.8rem", color: "var(--color-text-muted)", lineHeight: 1.55 }}>
            {description}
          </p>
        </div>
      </div>

      {meta && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem", paddingTop: "0.1rem" }}>
          {meta.map((m) => (
            <span key={m} style={{
              fontSize: "0.7rem", fontWeight: 600,
              color: "var(--color-text-muted)", backgroundColor: "var(--color-bg-muted)",
              borderRadius: "6px", padding: "2px 8px",
              border: "1px solid var(--color-border)",
            }}>
              {m}
            </span>
          ))}
        </div>
      )}

      <button
        type="button"
        onClick={onClick}
        disabled={loading}
        style={{
          display: "inline-flex", alignItems: "center", gap: "0.45rem",
          padding: "0.55rem 1rem", borderRadius: "9px", border: "none",
          backgroundColor: accent, color: "#fff",
          fontWeight: 600, fontSize: "0.8375rem",
          cursor: loading ? "not-allowed" : "pointer",
          opacity: loading ? 0.75 : 1, fontFamily: "inherit",
          alignSelf: "flex-start",
        }}
      >
        {loading
          ? <Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} />
          : <Download size={14} />}
        {loading ? "Preparing…" : actionLabel}
      </button>
    </div>
  )
}

// ── Company export card (with ID input) ───────────────────────────────────────
function CompanyExportCard({ loading, onDownload }) {
  const [companyId, setCompanyId] = useState("")
  const accent = "#1D4ED8"

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        const id = Number(companyId)
        if (!id) { toast.error("Enter a valid company ID"); return }
        onDownload(id)
      }}
      style={{ ...card, padding: "1.25rem 1.5rem", display: "flex", flexDirection: "column", gap: "1rem" }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", gap: "0.85rem" }}>
        <div style={{
          width: 40, height: 40, borderRadius: "10px", flexShrink: 0,
          backgroundColor: `${accent}15`, color: accent,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <Building2 size={18} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ margin: 0, fontWeight: 700, fontSize: "0.9rem", color: "var(--color-text)", fontFamily: "Manrope, sans-serif" }}>
            Company Report
          </p>
          <p style={{ margin: "0.2rem 0 0", fontSize: "0.8rem", color: "var(--color-text-muted)", lineHeight: 1.55 }}>
            Export a full operational report for any company by ID.
          </p>
        </div>
      </div>

      <div>
        <label style={{
          display: "block", fontSize: "0.72rem", fontWeight: 600,
          color: "var(--color-text-muted)", textTransform: "uppercase",
          letterSpacing: "0.04em", marginBottom: "0.4rem",
        }}>
          Company ID
        </label>
        <input
          type="number"
          min="1"
          value={companyId}
          onChange={(e) => setCompanyId(e.target.value)}
          placeholder="e.g. 1"
          style={{
            width: "100%", padding: "0.55rem 0.85rem",
            borderRadius: "8px", border: "1px solid var(--color-border)",
            backgroundColor: "var(--color-bg-muted)", color: "var(--color-text)",
            fontFamily: "inherit", fontSize: "0.875rem", outline: "none",
          }}
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        style={{
          display: "inline-flex", alignItems: "center", gap: "0.45rem",
          padding: "0.55rem 1rem", borderRadius: "9px", border: "none",
          backgroundColor: accent, color: "#fff",
          fontWeight: 600, fontSize: "0.8375rem",
          cursor: loading ? "not-allowed" : "pointer",
          opacity: loading ? 0.75 : 1, fontFamily: "inherit",
          alignSelf: "flex-start",
        }}
      >
        {loading
          ? <Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} />
          : <Download size={14} />}
        {loading ? "Preparing…" : "Download Company"}
      </button>
    </form>
  )
}

// ── Download log table ────────────────────────────────────────────────────────
function DownloadLog({ entries }) {
  if (entries.length === 0) return null
  return (
    <div style={{ ...card, overflow: "hidden" }}>
      <div style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid var(--color-border)" }}>
        <p style={T}>Download History</p>
        <p style={S}>Exports completed this session</p>
      </div>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.8375rem" }}>
          <thead>
            <tr style={{ backgroundColor: "var(--color-bg-muted)", borderBottom: "1px solid var(--color-border)" }}>
              {["Report", "Time", "Status"].map((h) => (
                <th key={h} style={{ padding: "0.65rem 1.25rem", textAlign: "left", fontWeight: 600, fontSize: "0.72rem", color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: "0.04em", whiteSpace: "nowrap" }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {entries.map((e, i) => (
              <tr key={i} style={{ borderBottom: i < entries.length - 1 ? "1px solid var(--color-border)" : "none", backgroundColor: i % 2 !== 0 ? "var(--color-bg-subtle)" : "transparent" }}>
                <td style={TD}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                    <FileDown size={14} color="var(--color-text-subtle)" />
                    <span style={{ fontWeight: 500, color: "var(--color-text)" }}>{e.label}</span>
                  </div>
                </td>
                <td style={{ ...TD, whiteSpace: "nowrap" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
                    <Clock size={12} /> {e.time}
                  </div>
                </td>
                <td style={TD}>
                  <span style={{ backgroundColor: "#F0FDF4", color: "#15803D", borderRadius: "999px", padding: "2px 10px", fontSize: "0.72rem", fontWeight: 600, display: "inline-flex", alignItems: "center", gap: "0.3rem" }}>
                    <CheckCircle2 size={11} /> Downloaded
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ── Bar chart: exports per hour ───────────────────────────────────────────────
function ExportsBarChart({ entries }) {
  const data = useMemo(() => {
    const counts = {}
    entries.forEach(({ time }) => {
      counts[time] = (counts[time] ?? 0) + 1
    })
    return Object.entries(counts).map(([time, count]) => ({ time, count })).reverse()
  }, [entries])

  return (
    <div style={{ ...card, padding: "1.25rem 1.5rem" }}>
      <p style={{ ...T, marginBottom: "0.25rem" }}>Export Activity</p>
      <p style={{ ...S, marginBottom: "1.25rem" }}>Downloads by time this session</p>
      {data.length === 0 ? (
        <div style={{ height: 140, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <p style={{ color: "var(--color-text-subtle)", fontSize: "0.8rem" }}>No exports yet — download a report to see activity</p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={160}>
          <BarChart data={data} barSize={28}>
            <XAxis dataKey="time" tick={{ fontSize: 11, fill: "var(--color-text-muted)" }} axisLine={false} tickLine={false} />
            <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: "var(--color-text-muted)" }} axisLine={false} tickLine={false} width={24} />
            <Tooltip content={<ChartTooltip />} cursor={{ fill: "#FF4F0008" }} />
            <Bar dataKey="count" fill="#FF4F00" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}

// ── Pie chart: report type breakdown ─────────────────────────────────────────
const PIE_COLORS = ["#FF4F00", "#1D4ED8", "#15803D", "#6D28D9", "#0891B2", "#C2410C"]

function ReportTypePieChart({ entries }) {
  const data = useMemo(() => {
    const counts = {}
    entries.forEach(({ label }) => {
      counts[label] = (counts[label] ?? 0) + 1
    })
    return Object.entries(counts).map(([name, value]) => ({ name, value }))
  }, [entries])

  return (
    <div style={{ ...card, padding: "1.25rem 1.5rem" }}>
      <p style={{ ...T, marginBottom: "0.25rem" }}>By Report Type</p>
      <p style={{ ...S, marginBottom: "1rem" }}>Breakdown of exports this session</p>
      {data.length === 0 ? (
        <div style={{ height: 160, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <p style={{ color: "var(--color-text-subtle)", fontSize: "0.8rem" }}>No data yet</p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={180}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="45%"
              innerRadius={48}
              outerRadius={72}
              paddingAngle={3}
              dataKey="value"
            >
              {data.map((_, i) => (
                <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(v, name) => [`${v} export${v !== 1 ? "s" : ""}`, name]}
              contentStyle={{ borderRadius: 10, border: "1px solid var(--color-border)", fontSize: "0.8rem" }}
            />
            <Legend
              iconType="circle"
              iconSize={8}
              wrapperStyle={{ fontSize: "0.75rem", color: "var(--color-text-muted)" }}
            />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function ReportsPage() {
  const authUser = useSelector((s) => s.auth.user)
  const role     = useSelector((s) => s.auth.role)

  const [loadingKey, setLoadingKey] = useState(null)
  const [log, setLog]               = useState([])
  const [activeKpi, setActiveKpi]   = useState(0)

  const { title, subtitle } = ROLE_META[role] ?? { title: "Reports", subtitle: "Download your account exports." }

  const download = useCallback(async (key, label, fn) => {
    setLoadingKey(key)
    try {
      await fn()
      const time = new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
      setLog((prev) => [{ label, time }, ...prev].slice(0, 20))
      toast.success("Report downloaded")
    } catch {
      toast.error("Download failed — try again")
    } finally {
      setLoadingKey(null)
    }
  }, [])

  // ── KPIs ──────────────────────────────────────────────────────────────────
  const availableCount = role === "ROLE_ADMIN" ? 3 : 1
  const uniqueTypes    = useMemo(() => new Set(log.map((e) => e.label)).size, [log])

  const kpis = [
    { label: "Session Downloads", value: String(log.length),    sub: "this session",        up: log.length > 0,  icon: <Download size={18} />,   accent: "#FF4F00" },
    { label: "Reports Available", value: String(availableCount), sub: "ready to export",    up: true,            icon: <FileText size={18} />,   accent: "#1D4ED8" },
    { label: "Export Format",     value: "CSV",                  sub: "comma-separated",    up: true,            icon: <FileDown size={18} />,   accent: "#15803D" },
    { label: "Report Types Used", value: String(uniqueTypes),    sub: "distinct exports",   up: uniqueTypes > 0, icon: <TrendingUp size={18} />, accent: "#6D28D9" },
  ]

  // ── Export card definitions ───────────────────────────────────────────────
  const adminCards = useMemo(() => [
    {
      key: "users", icon: <Users size={18} />, accent: "#FF4F00",
      title: "Users Report",
      description: "Full user register with roles, status, and account timestamps.",
      meta: ["All roles", "Status", "Created date"],
      actionLabel: "Download Users",
      onClick: () => download("users", "Users Report", () => reportsApi.downloadUsers()),
    },
    {
      key: "clients", icon: <UserCheck size={18} />, accent: "#6D28D9",
      title: "Clients Report",
      description: "Client account profiles and related activity records.",
      meta: ["Profiles", "Applications", "Activity"],
      actionLabel: "Download Clients",
      onClick: () => download("clients", "Clients Report", () => reportsApi.downloadClients()),
    },
  ], [download])

  const accountCard = useMemo(() => {
    if (role === "ROLE_AGENT") return {
      key: "agent", icon: <BarChart3 size={18} />, accent: "#1D4ED8",
      title: "Agent Account Report",
      description: "Listings, applications, commissions, and performance metrics for your account.",
      meta: ["Listings", "Applications", "Commissions", "KPIs"],
      actionLabel: "Download My Report",
      onClick: () => download("agent", "Agent Account Report", () => reportsApi.downloadAgent(authUser?.publicId)),
    }
    if (role === "ROLE_OWNER") return {
      key: "owner", icon: <FileText size={18} />, accent: "#15803D",
      title: "Owner Account Report",
      description: "Property, transaction, and ownership activity for your account.",
      meta: ["Properties", "Transactions", "Ownership"],
      actionLabel: "Download My Report",
      onClick: () => download("owner", "Owner Account Report", () => reportsApi.downloadOwner(authUser?.publicId)),
    }
    if (role === "ROLE_CUSTOMER") return {
      key: "client", icon: <FileText size={18} />, accent: "#0891B2",
      title: "Client Account Report",
      description: "Your applications, purchases, and full account history.",
      meta: ["Applications", "Purchases", "History"],
      actionLabel: "Download My Report",
      onClick: () => download("client", "Client Account Report", () => reportsApi.downloadClient(authUser?.publicId)),
    }
    return null
  }, [role, authUser, download])

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>

      {/* Page header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.75rem", flexWrap: "wrap" }}>
        <div>
          <p style={{ margin: 0, fontWeight: 700, fontSize: "1.1rem", color: "var(--color-text)" }}>{title}</p>
          <p style={{ margin: "2px 0 0", fontSize: "0.75rem", color: "var(--color-text-muted)" }}>{subtitle}</p>
        </div>
        <span style={{
          fontSize: "0.72rem", fontWeight: 600,
          color: "var(--color-text-muted)", backgroundColor: "var(--color-bg-muted)",
          border: "1px solid var(--color-border)", borderRadius: "999px",
          padding: "0.3rem 0.85rem",
        }}>
          CSV · {availableCount} export{availableCount !== 1 ? "s" : ""} available
        </span>
      </div>

      {/* KPI row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
        {kpis.map((k, i) => (
          <KpiCard key={k.label} {...k} active={activeKpi === i} onClick={() => setActiveKpi(i)} />
        ))}
      </div>

      {/* Charts row */}
      <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,320px)", gap: "1rem", alignItems: "start" }} className="dash-grid">
        <ExportsBarChart entries={log} />
        <ReportTypePieChart entries={log} />
      </div>

      {/* Available exports */}
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.65rem", marginBottom: "1rem" }}>
          <p style={{ margin: 0, fontWeight: 700, fontSize: "0.875rem", color: "var(--color-text)", fontFamily: "Manrope, sans-serif" }}>
            Available Exports
          </p>
          <div style={{ flex: 1, height: 1, backgroundColor: "var(--color-border)" }} />
        </div>

        {role === "ROLE_ADMIN" && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1rem" }}>
            {adminCards.map((c) => (
              <ExportCard key={c.key} {...c} loading={loadingKey === c.key} />
            ))}
            <CompanyExportCard
              loading={loadingKey === "company"}
              onDownload={(id) => download("company", `Company #${id} Report`, () => reportsApi.downloadCompany(id))}
            />
          </div>
        )}

        {role !== "ROLE_ADMIN" && accountCard && (
          <div style={{ maxWidth: 480 }}>
            <ExportCard {...accountCard} loading={loadingKey === accountCard.key} />
          </div>
        )}
      </div>

      {/* Download history table */}
      <DownloadLog entries={log} />

      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )
}
