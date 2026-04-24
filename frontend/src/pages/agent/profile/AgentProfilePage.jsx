import { useState, useEffect } from "react"
import { User, Phone, Mail, Building2, FileText, Save, Loader2 } from "lucide-react"
import { useSelector } from "react-redux"
import { StatCard } from "../../../components/shared/AdminUI"
import { fmtCurrency, fmtDate } from "../../../utils/formatters"
import { avatarColor } from "../../../constants/enums"
import { usersApi } from "../../../api/users.api"
import { propertiesApi } from "../../../api/properties.api"
import { transactionsApi } from "../../../api/transactions.api"
import client from "../../../api/client"
import { toast } from "react-toastify"

export default function AgentProfilePage() {
  const authUser = useSelector(s => s.auth.user)

  const [profile,  setProfile]  = useState(null)
  const [loading,  setLoading]  = useState(true)
  const [saving,   setSaving]   = useState(false)
  const [form,     setForm]     = useState({ firstName: "", lastName: "", phone: "", licenseNumber: "" })
  const [stats,    setStats]    = useState({ listings: 0, deals: 0, earned: 0 })

  useEffect(() => {
    if (!authUser?.publicId) { setLoading(false); return }
    Promise.all([
      usersApi.getAgentByPublicId(authUser.publicId),
      propertiesApi.getMyListings({ page: 0, size: 1 }),
      transactionsApi.getMyCommissions(),
    ]).then(([agent, listRes, comms]) => {
      if (agent) {
        setProfile(agent)
        setForm({ firstName: agent.firstName ?? "", lastName: agent.lastName ?? "", phone: agent.phone ?? "", licenseNumber: agent.licenseNumber ?? "" })
      }
      const totalListings = listRes?.totalElements ?? listRes?.content?.length ?? 0
      const paid = (Array.isArray(comms) ? comms : []).filter(c => c.status === "PAID")
      setStats({
        listings: totalListings,
        deals:    paid.length,
        earned:   paid.reduce((s, c) => s + Number(c.amount ?? 0), 0),
      })
    }).catch(() => {}).finally(() => setLoading(false))
  }, [authUser?.publicId])

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSave = async () => {
    setSaving(true)
    try {
      await client.put("/agents/me", form)
      setProfile(p => ({ ...p, ...form }))
      toast.success("Profile updated")
    } catch {
      // error handled by interceptor
    } finally {
      setSaving(false)
    }
  }

  const initials = form.firstName && form.lastName
    ? `${form.firstName[0]}${form.lastName[0]}`.toUpperCase()
    : (authUser?.username?.[0] ?? "?").toUpperCase()
  const color = avatarColor(profile?.id ?? 0)

  if (loading) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "60vh", gap: "0.75rem", color: "var(--color-text-muted)" }}>
      <Loader2 size={20} style={{ animation: "spin 1s linear infinite" }} /> Loading profile…
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "1rem" }}>
        <StatCard label="Listings"     value={stats.listings}          color="#1D4ED8" />
        <StatCard label="Deals Closed" value={stats.deals}             color="#FF4F00" />
        <StatCard label="Total Earned" value={fmtCurrency(stats.earned)} color="#15803D" />
        <StatCard label="Member Since" value={authUser?.createdAt ? fmtDate(authUser.createdAt) : "—"} color="#6D28D9" />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,320px)", gap: "1.5rem", alignItems: "start" }} className="dash-grid">

        <div style={{ backgroundColor: "var(--color-surface)", borderRadius: "14px", border: "1px solid var(--color-border)", overflow: "hidden" }}>
          <div style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid var(--color-border)" }}>
            <p style={{ margin: 0, fontWeight: 700, fontSize: "0.9375rem", color: "var(--color-text)" }}>Profile Information</p>
            <p style={{ margin: "2px 0 0", fontSize: "0.75rem", color: "var(--color-text-muted)" }}>Update your personal details</p>
          </div>
          <div style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <Field label="First Name" icon={<User size={14} />}     value={form.firstName}     onChange={v => set("firstName", v)}     placeholder="Sarah" />
              <Field label="Last Name"  icon={<User size={14} />}     value={form.lastName}      onChange={v => set("lastName", v)}      placeholder="Johnson" />
            </div>
            <Field label="Email"        icon={<Mail size={14} />}     value={authUser?.email ?? ""} onChange={() => {}} placeholder="sarah@example.com" type="email" disabled />
            <Field label="Phone"        icon={<Phone size={14} />}    value={form.phone}         onChange={v => set("phone", v)}         placeholder="+250 7XX XXX XXX" />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <Field label="License No." icon={<FileText size={14} />}  value={form.licenseNumber} onChange={v => set("licenseNumber", v)} placeholder="LIC-001" />
              <Field label="Company ID"  icon={<Building2 size={14} />} value={profile?.companyId ? String(profile.companyId) : "—"} onChange={() => {}} placeholder="1" disabled />
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button
                onClick={handleSave} disabled={saving}
                style={{ display: "flex", alignItems: "center", gap: "0.45rem", padding: "0.6rem 1.25rem", borderRadius: "9px", border: "none", backgroundColor: "var(--color-primary)", color: "#fff", fontWeight: 600, fontSize: "0.875rem", cursor: saving ? "not-allowed" : "pointer", opacity: saving ? 0.75 : 1, fontFamily: "inherit" }}
              >
                {saving ? <Loader2 size={15} style={{ animation: "spin 1s linear infinite" }} /> : <Save size={15} />}
                {saving ? "Saving…" : "Save Changes"}
              </button>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div style={{ backgroundColor: "var(--color-surface)", borderRadius: "14px", border: "1px solid var(--color-border)", padding: "1.5rem", display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem", textAlign: "center" }}>
            <div style={{ width: 80, height: 80, borderRadius: "50%", backgroundColor: color, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem", fontWeight: 800, boxShadow: `0 0 0 4px ${color}22` }}>
              {initials}
            </div>
            <div>
              <p style={{ margin: 0, fontWeight: 700, fontSize: "1.1rem", color: "var(--color-text)" }}>{form.firstName} {form.lastName}</p>
              <p style={{ margin: "2px 0 0", fontSize: "0.8rem", color: "var(--color-text-muted)" }}>{authUser?.email}</p>
            </div>
            <span style={{ backgroundColor: "#EFF6FF", color: "#1D4ED8", borderRadius: "999px", padding: "0.25rem 0.85rem", fontSize: "0.75rem", fontWeight: 600 }}>Agent</span>
          </div>

          <div style={{ backgroundColor: "var(--color-surface)", borderRadius: "14px", border: "1px solid var(--color-border)", overflow: "hidden" }}>
            {[
              { label: "Public ID",    value: authUser?.publicId ?? "—" },
              { label: "License",      value: form.licenseNumber || "—" },
              { label: "Company",      value: profile?.companyId ? `#${profile.companyId}` : "—" },
              { label: "Member Since", value: authUser?.createdAt ? fmtDate(authUser.createdAt) : "—" },
            ].map((row, i, arr) => (
              <div key={row.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.75rem 1.25rem", borderBottom: i < arr.length - 1 ? "1px solid var(--color-border)" : "none", backgroundColor: i % 2 !== 0 ? "var(--color-bg-subtle)" : "transparent" }}>
                <span style={{ fontSize: "0.8rem", color: "var(--color-text-muted)" }}>{row.label}</span>
                <span style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--color-text)" }}>{row.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )
}

function Field({ label, icon, value, onChange, placeholder, type = "text", disabled }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
      <label style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: "0.04em" }}>{label}</label>
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.55rem 0.85rem", borderRadius: "8px", border: "1px solid var(--color-border)", backgroundColor: disabled ? "var(--color-bg-muted)" : "var(--color-surface)" }}>
        <span style={{ color: "var(--color-text-muted)", flexShrink: 0 }}>{icon}</span>
        <input
          type={type} value={value} onChange={e => onChange(e.target.value)}
          placeholder={placeholder} disabled={disabled}
          style={{ border: "none", background: "none", outline: "none", fontSize: "0.875rem", color: "var(--color-text)", width: "100%", fontFamily: "inherit" }}
        />
      </div>
    </div>
  )
}
