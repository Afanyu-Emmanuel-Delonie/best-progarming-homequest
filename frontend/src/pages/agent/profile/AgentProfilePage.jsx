import { useState } from "react"
import { User, Phone, Mail, Building2, FileText, Save } from "lucide-react"
import { StatCard } from "../../../components/shared/AdminUI"
import { fmtCurrency, fmtDate } from "../../../utils/formatters"
import { avatarColor } from "../../../constants/enums"

const AGENT = {
  id: 1, publicId: "usr-001", firstName: "Sarah", lastName: "Johnson",
  email: "sarah.j@email.com", phone: "+1 555-0101",
  licenseNumber: "LIC-001", companyId: 1,
  createdAt: "2025-01-15T09:00:00",
  properties: 12, transactions: 9, earned: 184500,
}

export default function AgentProfilePage() {
  const [form, setForm] = useState({
    firstName:     AGENT.firstName,
    lastName:      AGENT.lastName,
    email:         AGENT.email,
    phone:         AGENT.phone,
    licenseNumber: AGENT.licenseNumber,
  })
  const [saved, setSaved] = useState(false)

  const set = (k, v) => { setForm(f => ({ ...f, [k]: v })); setSaved(false) }

  const initials = `${form.firstName[0]}${form.lastName[0]}`.toUpperCase()
  const color    = avatarColor(AGENT.id)

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "1rem" }}>
        <StatCard label="Listings"     value={AGENT.properties}          color="#1D4ED8" />
        <StatCard label="Deals Closed" value={AGENT.transactions}        color="#FF4F00" />
        <StatCard label="Total Earned" value={fmtCurrency(AGENT.earned)} color="#15803D" />
        <StatCard label="Member Since" value={fmtDate(AGENT.createdAt)}  color="#6D28D9" />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,320px)", gap: "1.5rem", alignItems: "start" }} className="dash-grid">

        {/* Edit form */}
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
            <Field label="Email"          icon={<Mail size={14} />}      value={form.email}         onChange={v => set("email", v)}         placeholder="sarah@example.com" type="email" />
            <Field label="Phone"          icon={<Phone size={14} />}     value={form.phone}         onChange={v => set("phone", v)}         placeholder="+250 7XX XXX XXX" />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <Field label="License No."  icon={<FileText size={14} />}  value={form.licenseNumber} onChange={v => set("licenseNumber", v)} placeholder="LIC-001" />
              <Field label="Company ID"   icon={<Building2 size={14} />} value={String(AGENT.companyId)} onChange={() => {}} placeholder="1" disabled />
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button
                onClick={() => setSaved(true)}
                style={{ display: "flex", alignItems: "center", gap: "0.45rem", padding: "0.6rem 1.25rem", borderRadius: "9px", border: "none", backgroundColor: saved ? "#15803D" : "var(--color-primary)", color: "#fff", fontWeight: 600, fontSize: "0.875rem", cursor: "pointer", fontFamily: "inherit", transition: "background 0.2s" }}
              >
                <Save size={15} /> {saved ? "Saved!" : "Save Changes"}
              </button>
            </div>
          </div>
        </div>

        {/* Avatar + account info */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div style={{ backgroundColor: "var(--color-surface)", borderRadius: "14px", border: "1px solid var(--color-border)", padding: "1.5rem", display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem", textAlign: "center" }}>
            <div style={{ width: 80, height: 80, borderRadius: "50%", backgroundColor: color, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem", fontWeight: 800, boxShadow: `0 0 0 4px ${color}22` }}>
              {initials}
            </div>
            <div>
              <p style={{ margin: 0, fontWeight: 700, fontSize: "1.1rem", color: "var(--color-text)" }}>{form.firstName} {form.lastName}</p>
              <p style={{ margin: "2px 0 0", fontSize: "0.8rem", color: "var(--color-text-muted)" }}>{form.email}</p>
            </div>
            <span style={{ backgroundColor: "#EFF6FF", color: "#1D4ED8", borderRadius: "999px", padding: "0.25rem 0.85rem", fontSize: "0.75rem", fontWeight: 600 }}>Agent</span>
          </div>

          <div style={{ backgroundColor: "var(--color-surface)", borderRadius: "14px", border: "1px solid var(--color-border)", overflow: "hidden" }}>
            {[
              { label: "Public ID",      value: AGENT.publicId },
              { label: "License",        value: form.licenseNumber },
              { label: "Company",        value: `#${AGENT.companyId}` },
              { label: "Member Since",   value: fmtDate(AGENT.createdAt) },
            ].map((row, i, arr) => (
              <div key={row.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.75rem 1.25rem", borderBottom: i < arr.length - 1 ? "1px solid var(--color-border)" : "none", backgroundColor: i % 2 !== 0 ? "var(--color-bg-subtle)" : "transparent" }}>
                <span style={{ fontSize: "0.8rem", color: "var(--color-text-muted)" }}>{row.label}</span>
                <span style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--color-text)" }}>{row.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
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
