import { useState } from "react"
import { User, Lock, Bell, Settings2, Save, Eye, EyeOff } from "lucide-react"

const TABS = [
  { key: "profile",       label: "Profile",       icon: User      },
  { key: "security",      label: "Security",      icon: Lock      },
  { key: "notifications", label: "Notifications", icon: Bell      },
  { key: "system",        label: "System",        icon: Settings2 },
]

export default function AdminSettings() {
  const [activeTab, setActiveTab] = useState("profile")

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>

      {/* Tab nav */}
      <div style={{ display: "flex", gap: "0.25rem", borderBottom: "1px solid var(--color-border)" }}>
        {TABS.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            style={{
              display: "flex", alignItems: "center", gap: "0.4rem",
              padding: "0.65rem 1rem",
              background: "none", border: "none",
              borderBottom: activeTab === key ? "2px solid var(--color-primary)" : "2px solid transparent",
              color: activeTab === key ? "var(--color-primary)" : "var(--color-text-muted)",
              fontWeight: activeTab === key ? 600 : 400,
              fontSize: "0.875rem", cursor: "pointer",
              fontFamily: "inherit", marginBottom: "-1px",
              whiteSpace: "nowrap", transition: "color 0.15s",
            }}
          >
            <Icon size={15} />
            {label}
          </button>
        ))}
      </div>

      {activeTab === "profile"       && <ProfileTab />}
      {activeTab === "security"      && <SecurityTab />}
      {activeTab === "notifications" && <NotificationsTab />}
      {activeTab === "system"        && <SystemTab />}
    </div>
  )
}

// ── Profile ────────────────────────────────────────────────────────────────
function ProfileTab() {
  const [form, setForm] = useState({ firstName: "Admin", lastName: "User", email: "admin@homequest.com", phone: "+1 555-0000", timezone: "America/New_York" })
  const set = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }))

  return (
    <Section title="Profile Information" description="Update your personal details and contact information.">
      <div style={avatarRowStyle}>
        <div style={{ width: "72px", height: "72px", borderRadius: "50%", backgroundColor: "var(--color-primary)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem", fontWeight: 700, flexShrink: 0 }}>
          {form.firstName[0]}{form.lastName[0]}
        </div>
        <div>
          <p style={{ margin: 0, fontWeight: 600, color: "var(--color-text)" }}>{form.firstName} {form.lastName}</p>
          <p style={{ margin: "2px 0 0.5rem", fontSize: "0.8125rem", color: "var(--color-text-muted)" }}>Administrator</p>
          <button style={outlineBtnStyle}>Change photo</button>
        </div>
      </div>

      <div style={gridStyle}>
        <Field label="First Name"  value={form.firstName} onChange={set("firstName")} />
        <Field label="Last Name"   value={form.lastName}  onChange={set("lastName")}  />
        <Field label="Email"       value={form.email}     onChange={set("email")}     type="email" span />
        <Field label="Phone"       value={form.phone}     onChange={set("phone")}     />
        <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
          <label style={labelStyle}>Timezone</label>
          <select value={form.timezone} onChange={set("timezone")} style={inputStyle}>
            <option value="America/New_York">America/New_York (EST)</option>
            <option value="America/Chicago">America/Chicago (CST)</option>
            <option value="America/Los_Angeles">America/Los_Angeles (PST)</option>
            <option value="Europe/London">Europe/London (GMT)</option>
            <option value="Europe/Paris">Europe/Paris (CET)</option>
            <option value="Asia/Dubai">Asia/Dubai (GST)</option>
          </select>
        </div>
      </div>

      <SaveBtn />
    </Section>
  )
}

// ── Security ───────────────────────────────────────────────────────────────
function SecurityTab() {
  const [form, setForm]       = useState({ current: "", newPwd: "", confirm: "" })
  const [show, setShow]       = useState({ current: false, newPwd: false, confirm: false })
  const [twoFa, setTwoFa]     = useState(false)
  const set = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }))
  const toggle = (k) => setShow(p => ({ ...p, [k]: !p[k] }))

  return (
    <>
      <Section title="Change Password" description="Use a strong password of at least 8 characters.">
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem", maxWidth: "420px" }}>
          {[
            { key: "current", label: "Current Password"  },
            { key: "newPwd",  label: "New Password"      },
            { key: "confirm", label: "Confirm Password"  },
          ].map(({ key, label }) => (
            <div key={key} style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
              <label style={labelStyle}>{label}</label>
              <div style={{ position: "relative" }}>
                <input
                  type={show[key] ? "text" : "password"}
                  value={form[key]}
                  onChange={set(key)}
                  style={{ ...inputStyle, paddingRight: "2.5rem" }}
                  placeholder="••••••••"
                />
                <button onClick={() => toggle(key)} style={{ position: "absolute", right: "0.65rem", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "var(--color-text-muted)", display: "flex" }}>
                  {show[key] ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>
          ))}
        </div>
        <SaveBtn label="Update Password" />
      </Section>

      <Section title="Two-Factor Authentication" description="Add an extra layer of security to your account.">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1rem", backgroundColor: "var(--color-bg-muted)", borderRadius: "8px", border: "1px solid var(--color-border)" }}>
          <div>
            <p style={{ margin: 0, fontWeight: 500, color: "var(--color-text)", fontSize: "0.875rem" }}>Authenticator App</p>
            <p style={{ margin: "2px 0 0", fontSize: "0.8125rem", color: "var(--color-text-muted)" }}>
              {twoFa ? "2FA is enabled on your account." : "Protect your account with an authenticator app."}
            </p>
          </div>
          <Toggle value={twoFa} onChange={setTwoFa} />
        </div>
      </Section>

      <Section title="Active Sessions" description="Manage devices currently logged into your account.">
        {[
          { device: "Chrome on Windows", location: "New York, US",    time: "Now — current session",  current: true  },
          { device: "Safari on iPhone",  location: "Los Angeles, US", time: "2 hours ago",             current: false },
          { device: "Firefox on macOS",  location: "Chicago, US",     time: "Yesterday at 3:42 PM",    current: false },
        ].map((s, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.85rem 1rem", backgroundColor: "var(--color-bg-muted)", borderRadius: "8px", border: "1px solid var(--color-border)", marginBottom: "0.5rem" }}>
            <div>
              <p style={{ margin: 0, fontWeight: 500, color: "var(--color-text)", fontSize: "0.875rem" }}>
                {s.device}
                {s.current && <span style={{ marginLeft: "0.5rem", backgroundColor: "#F0FDF4", color: "#15803D", borderRadius: "999px", fontSize: "11px", padding: "1px 8px", fontWeight: 600 }}>Current</span>}
              </p>
              <p style={{ margin: "2px 0 0", fontSize: "0.75rem", color: "var(--color-text-muted)" }}>{s.location} · {s.time}</p>
            </div>
            {!s.current && <button style={{ ...outlineBtnStyle, color: "var(--color-error)", borderColor: "var(--color-error)" }}>Revoke</button>}
          </div>
        ))}
      </Section>
    </>
  )
}

// ── Notifications ──────────────────────────────────────────────────────────
function NotificationsTab() {
  const [prefs, setPrefs] = useState({
    newApplication: true,  newApplicationEmail: true,
    transactionUpdate: true, transactionEmail: false,
    newUser: false,        newUserEmail: true,
    documentUploaded: true, documentEmail: false,
    systemAlerts: true,    systemEmail: true,
  })
  const toggle = (k) => setPrefs(p => ({ ...p, [k]: !p[k] }))

  const rows = [
    { label: "New Application",    desc: "When a buyer submits a bid",          inApp: "newApplication",   email: "newApplicationEmail"   },
    { label: "Transaction Update", desc: "Status changes on transactions",       inApp: "transactionUpdate",email: "transactionEmail"      },
    { label: "New User Registered",desc: "When a new user joins the platform",   inApp: "newUser",          email: "newUserEmail"          },
    { label: "Document Uploaded",  desc: "When a document is submitted",         inApp: "documentUploaded", email: "documentEmail"         },
    { label: "System Alerts",      desc: "Critical system and security alerts",  inApp: "systemAlerts",     email: "systemEmail"           },
  ]

  return (
    <Section title="Notification Preferences" description="Choose how and when you receive notifications.">
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.875rem" }}>
        <thead>
          <tr style={{ borderBottom: "1px solid var(--color-border)" }}>
            <th style={{ ...thStyle(false), paddingLeft: 0 }}>Event</th>
            <th style={{ ...thStyle(false), textAlign: "center", width: "100px" }}>In-App</th>
            <th style={{ ...thStyle(false), textAlign: "center", width: "100px" }}>Email</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(row => (
            <tr key={row.label} style={{ borderBottom: "1px solid var(--color-border)" }}>
              <td style={{ padding: "0.85rem 0" }}>
                <p style={{ margin: 0, fontWeight: 500, color: "var(--color-text)" }}>{row.label}</p>
                <p style={{ margin: "2px 0 0", fontSize: "0.75rem", color: "var(--color-text-muted)" }}>{row.desc}</p>
              </td>
              <td style={{ textAlign: "center" }}><Toggle value={prefs[row.inApp]} onChange={() => toggle(row.inApp)} /></td>
              <td style={{ textAlign: "center" }}><Toggle value={prefs[row.email]} onChange={() => toggle(row.email)} /></td>
            </tr>
          ))}
        </tbody>
      </table>
      <SaveBtn label="Save Preferences" />
    </Section>
  )
}

// ── System ─────────────────────────────────────────────────────────────────
function SystemTab() {
  const [config, setConfig] = useState({
    siteName: "HomeQuest Admin",
    apiUrl: "http://localhost:8080",
    currency: "USD",
    dateFormat: "MM/DD/YYYY",
    defaultCommissionRate: "3",
    maintenanceMode: false,
  })
  const set = (k) => (e) => setConfig(p => ({ ...p, [k]: e.target.value }))

  return (
    <>
      <Section title="General Configuration" description="Core platform settings.">
        <div style={gridStyle}>
          <Field label="Site Name"    value={config.siteName} onChange={set("siteName")} span />
          <Field label="API Base URL" value={config.apiUrl}   onChange={set("apiUrl")}   span />
          <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
            <label style={labelStyle}>Currency</label>
            <select value={config.currency} onChange={set("currency")} style={inputStyle}>
              <option value="USD">USD — US Dollar</option>
              <option value="EUR">EUR — Euro</option>
              <option value="GBP">GBP — British Pound</option>
              <option value="AED">AED — UAE Dirham</option>
            </select>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
            <label style={labelStyle}>Date Format</label>
            <select value={config.dateFormat} onChange={set("dateFormat")} style={inputStyle}>
              <option value="MM/DD/YYYY">MM/DD/YYYY</option>
              <option value="DD/MM/YYYY">DD/MM/YYYY</option>
              <option value="YYYY-MM-DD">YYYY-MM-DD</option>
            </select>
          </div>
          <Field label="Default Commission Rate (%)" value={config.defaultCommissionRate} onChange={set("defaultCommissionRate")} type="number" />
        </div>
        <SaveBtn />
      </Section>

      <Section title="Maintenance Mode" description="When enabled, the platform will be inaccessible to non-admin users.">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1rem", backgroundColor: config.maintenanceMode ? "#FEF2F2" : "var(--color-bg-muted)", borderRadius: "8px", border: `1px solid ${config.maintenanceMode ? "#FECACA" : "var(--color-border)"}`, transition: "all 0.2s" }}>
          <div>
            <p style={{ margin: 0, fontWeight: 500, color: config.maintenanceMode ? "#B91C1C" : "var(--color-text)", fontSize: "0.875rem" }}>
              {config.maintenanceMode ? "Maintenance mode is ON" : "Maintenance mode is OFF"}
            </p>
            <p style={{ margin: "2px 0 0", fontSize: "0.8125rem", color: "var(--color-text-muted)" }}>
              {config.maintenanceMode ? "Only admins can access the platform." : "Platform is live and accessible to all users."}
            </p>
          </div>
          <Toggle value={config.maintenanceMode} onChange={(v) => setConfig(p => ({ ...p, maintenanceMode: v }))} />
        </div>
      </Section>
    </>
  )
}

// ── Shared components ──────────────────────────────────────────────────────
function Section({ title, description, children }) {
  return (
    <div style={{ backgroundColor: "var(--color-surface)", borderRadius: "10px", border: "1px solid var(--color-border)", padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      <div>
        <p style={{ margin: 0, fontWeight: 600, fontSize: "1rem", color: "var(--color-text)" }}>{title}</p>
        {description && <p style={{ margin: "4px 0 0", fontSize: "0.8125rem", color: "var(--color-text-muted)" }}>{description}</p>}
      </div>
      {children}
    </div>
  )
}

function Field({ label, value, onChange, type = "text", span = false }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem", gridColumn: span ? "1 / -1" : undefined }}>
      <label style={labelStyle}>{label}</label>
      <input type={type} value={value} onChange={onChange} style={inputStyle} />
    </div>
  )
}

function Toggle({ value, onChange }) {
  return (
    <button
      onClick={() => onChange(!value)}
      style={{
        width: "44px", height: "24px", borderRadius: "999px", border: "none", cursor: "pointer",
        backgroundColor: value ? "var(--color-primary)" : "var(--color-border)",
        position: "relative", transition: "background 0.2s", flexShrink: 0,
      }}
    >
      <span style={{
        position: "absolute", top: "3px",
        left: value ? "23px" : "3px",
        width: "18px", height: "18px", borderRadius: "50%",
        backgroundColor: "#fff", transition: "left 0.2s",
        boxShadow: "0 1px 3px #0000003a",
      }} />
    </button>
  )
}

function SaveBtn({ label = "Save Changes" }) {
  return (
    <div>
      <button style={{ display: "flex", alignItems: "center", gap: "0.4rem", padding: "0.55rem 1.25rem", backgroundColor: "var(--color-primary)", color: "#fff", border: "none", borderRadius: "8px", fontWeight: 600, fontSize: "0.875rem", cursor: "pointer", fontFamily: "inherit" }}>
        <Save size={15} />
        {label}
      </button>
    </div>
  )
}

const labelStyle    = { fontSize: "0.8125rem", fontWeight: 500, color: "var(--color-text-muted)" }
const inputStyle    = { padding: "0.5rem 0.75rem", borderRadius: "8px", border: "1px solid var(--color-border)", fontSize: "0.875rem", color: "var(--color-text)", backgroundColor: "var(--color-bg-muted)", outline: "none", fontFamily: "inherit", width: "100%" }
const gridStyle     = { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }
const avatarRowStyle = { display: "flex", alignItems: "center", gap: "1rem" }
const outlineBtnStyle = { padding: "0.3rem 0.75rem", borderRadius: "6px", border: "1px solid var(--color-border)", background: "none", cursor: "pointer", fontSize: "0.8125rem", color: "var(--color-text-muted)", fontFamily: "inherit" }
const thStyle = () => ({ padding: "0.6rem 1rem 0.6rem 0", textAlign: "left", fontWeight: 600, fontSize: "0.75rem", color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: "0.04em", userSelect: "none" })
