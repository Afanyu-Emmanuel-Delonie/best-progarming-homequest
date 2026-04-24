import { useState, useEffect } from "react"
import { User, Lock, Bell, Settings2, Save, Eye, EyeOff } from "lucide-react"

const MOBILE_BP = 768
function useIsMobile() {
  const [m, setM] = useState(window.innerWidth < MOBILE_BP)
  useEffect(() => {
    const h = () => setM(window.innerWidth < MOBILE_BP)
    window.addEventListener("resize", h)
    return () => window.removeEventListener("resize", h)
  }, [])
  return m
}

const NAV = [
  { id: "profile",       label: "Profile",        icon: User      },
  { id: "security",      label: "Security",        icon: Lock      },
  { id: "notifications", label: "Notifications",   icon: Bell      },
  { id: "system",        label: "System",          icon: Settings2 },
]

export default function AdminSettings() {
  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" })

  const isMobile = useIsMobile()

  return (
    <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", gap: isMobile ? "1rem" : "2rem", alignItems: "flex-start" }}>

      {/* Nav — sticky sidebar on desktop, horizontal tabs on mobile */}
      {isMobile ? (
        <div style={{ display: "flex", gap: "0.25rem", overflowX: "auto", borderBottom: "1px solid var(--color-border)", paddingBottom: "0", width: "100%" }}>
          {NAV.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => scrollTo(id)}
              style={{ display: "flex", alignItems: "center", gap: "0.4rem", padding: "0.6rem 0.85rem", border: "none", borderBottom: "2px solid transparent", background: "none", cursor: "pointer", fontSize: "0.8125rem", color: "var(--color-text-muted)", fontFamily: "inherit", whiteSpace: "nowrap", flexShrink: 0 }}
            >
              <Icon size={14} />{label}
            </button>
          ))}
        </div>
      ) : (
        <div style={{ width: "200px", flexShrink: 0, position: "sticky", top: "1.5rem" }}>
          <div style={{ backgroundColor: "var(--color-surface)", border: "1px solid var(--color-border)", borderRadius: "10px", padding: "0.5rem", display: "flex", flexDirection: "column", gap: "2px" }}>
            {NAV.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => scrollTo(id)}
                style={{ display: "flex", alignItems: "center", gap: "0.6rem", padding: "0.6rem 0.75rem", borderRadius: "7px", border: "none", background: "none", cursor: "pointer", fontSize: "0.875rem", color: "var(--color-text-muted)", fontFamily: "inherit", textAlign: "left", transition: "background 0.15s, color 0.15s", width: "100%" }}
                onMouseEnter={e => { e.currentTarget.style.backgroundColor = "var(--color-bg-muted)"; e.currentTarget.style.color = "var(--color-text)" }}
                onMouseLeave={e => { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.color = "var(--color-text-muted)" }}
              >
                <Icon size={15} style={{ flexShrink: 0 }} />
                {label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* All sections */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "1.5rem", minWidth: 0, width: "100%" }}>
        <ProfileSection />
        <SecuritySection />
        <NotificationsSection />
        <SystemSection />
      </div>
    </div>
  )
}

// ── Profile ────────────────────────────────────────────────────────────────
function ProfileSection() {
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", phone: "", timezone: "Africa/Kigali" })
  const set = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }))

  useEffect(() => {
    import("../../api/users.api").then(({ usersApi }) => {
      // Load from Redux store instead of API since auth service has the data
      const stored = JSON.parse(localStorage.getItem("auth") || "null")
      if (stored?.user) {
        const u = stored.user
        setForm(f => ({
          ...f,
          firstName: u.firstName ?? u.username ?? "",
          lastName:  u.lastName  ?? "",
          email:     u.email     ?? "",
        }))
      }
    })
  }, [])

  return (
    <Section id="profile" title="Profile" description="Update your personal details and contact information.">
      <div style={{ display: "flex", alignItems: "center", gap: "1.25rem", paddingBottom: "1.25rem", borderBottom: "1px solid var(--color-border)" }}>
        <div style={{ width: "72px", height: "72px", borderRadius: "50%", backgroundColor: "var(--color-primary)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem", fontWeight: 700, flexShrink: 0 }}>
          {form.firstName[0]}{form.lastName[0]}
        </div>
        <div>
          <p style={{ margin: 0, fontWeight: 600, fontSize: "1rem", color: "var(--color-text)" }}>{form.firstName} {form.lastName}</p>
          <p style={{ margin: "2px 0 0.6rem", fontSize: "0.8125rem", color: "var(--color-text-muted)" }}>Administrator</p>
          <button style={outlineBtnStyle}>Change photo</button>
        </div>
      </div>

      <div style={grid2}>
        <Field label="First Name" value={form.firstName} onChange={set("firstName")} />
        <Field label="Last Name"  value={form.lastName}  onChange={set("lastName")}  />
        <Field label="Email"      value={form.email}     onChange={set("email")}     type="email" span />
        <Field label="Phone"      value={form.phone}     onChange={set("phone")}     />
        <div style={fieldWrap}>
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
function SecuritySection() {
  const [form, setForm] = useState({ current: "", newPwd: "", confirm: "" })
  const [show, setShow] = useState({ current: false, newPwd: false, confirm: false })
  const [twoFa, setTwoFa] = useState(false)
  const set    = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }))
  const toggle = (k) => setShow(p => ({ ...p, [k]: !p[k] }))

  return (
    <Section id="security" title="Security" description="Manage your password, 2FA, and active sessions.">

      {/* Two columns: password left, 2FA + sessions right */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem" }}>

        {/* Password */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <p style={subHeading}>Change Password</p>
          {[
            { key: "current", label: "Current Password" },
            { key: "newPwd",  label: "New Password"     },
            { key: "confirm", label: "Confirm Password" },
          ].map(({ key, label }) => (
            <div key={key} style={fieldWrap}>
              <label style={labelStyle}>{label}</label>
              <div style={{ position: "relative" }}>
                <input type={show[key] ? "text" : "password"} value={form[key]} onChange={set(key)} placeholder="••••••••" style={{ ...inputStyle, paddingRight: "2.5rem" }} />
                <button onClick={() => toggle(key)} style={{ position: "absolute", right: "0.65rem", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "var(--color-text-muted)", display: "flex" }}>
                  {show[key] ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>
          ))}
          <SaveBtn label="Update Password" />
        </div>

        {/* 2FA + Sessions */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          <div>
            <p style={subHeading}>Two-Factor Authentication</p>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.85rem 1rem", backgroundColor: "var(--color-bg-muted)", borderRadius: "8px", border: "1px solid var(--color-border)" }}>
              <div>
                <p style={{ margin: 0, fontWeight: 500, fontSize: "0.875rem", color: "var(--color-text)" }}>Authenticator App</p>
                <p style={{ margin: "2px 0 0", fontSize: "0.75rem", color: "var(--color-text-muted)" }}>{twoFa ? "2FA is enabled." : "Not enabled."}</p>
              </div>
              <Toggle value={twoFa} onChange={setTwoFa} />
            </div>
          </div>

          <div>
            <p style={subHeading}>Active Sessions</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {[
                { device: "Chrome · Windows",  location: "New York, US",    time: "Now",              current: true  },
                { device: "Safari · iPhone",   location: "Los Angeles, US", time: "2 hours ago",      current: false },
                { device: "Firefox · macOS",   location: "Chicago, US",     time: "Yesterday 3:42 PM",current: false },
              ].map((s, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.7rem 0.85rem", backgroundColor: "var(--color-bg-muted)", borderRadius: "8px", border: "1px solid var(--color-border)" }}>
                  <div>
                    <p style={{ margin: 0, fontWeight: 500, fontSize: "0.8125rem", color: "var(--color-text)" }}>
                      {s.device}
                      {s.current && <span style={{ marginLeft: "0.4rem", backgroundColor: "#F0FDF4", color: "#15803D", borderRadius: "999px", fontSize: "11px", padding: "1px 7px", fontWeight: 600 }}>Current</span>}
                    </p>
                    <p style={{ margin: "1px 0 0", fontSize: "0.75rem", color: "var(--color-text-muted)" }}>{s.location} · {s.time}</p>
                  </div>
                  {!s.current && <button style={{ ...outlineBtnStyle, color: "var(--color-error)", borderColor: "var(--color-error)" }}>Revoke</button>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Section>
  )
}

// ── Notifications ──────────────────────────────────────────────────────────
function NotificationsSection() {
  const [prefs, setPrefs] = useState({
    newApplication: true,  newApplicationEmail: true,
    transactionUpdate: true, transactionEmail: false,
    newUser: false,        newUserEmail: true,
    documentUploaded: true, documentEmail: false,
    systemAlerts: true,    systemEmail: true,
  })
  const toggle = (k) => setPrefs(p => ({ ...p, [k]: !p[k] }))

  const rows = [
    { label: "New Application",     desc: "When a buyer submits a bid",         inApp: "newApplication",    email: "newApplicationEmail"  },
    { label: "Transaction Update",  desc: "Status changes on transactions",      inApp: "transactionUpdate", email: "transactionEmail"     },
    { label: "New User Registered", desc: "When a new user joins the platform",  inApp: "newUser",           email: "newUserEmail"         },
    { label: "Document Uploaded",   desc: "When a document is submitted",        inApp: "documentUploaded",  email: "documentEmail"        },
    { label: "System Alerts",       desc: "Critical system and security alerts", inApp: "systemAlerts",      email: "systemEmail"          },
  ]

  return (
    <Section id="notifications" title="Notifications" description="Choose how and when you receive notifications.">
      <div style={{ border: "1px solid var(--color-border)", borderRadius: "8px", overflow: "hidden" }}>
        <NotifHeader />
        {rows.map((row, i) => (
          <NotifRow key={row.label} row={row} prefs={prefs} toggle={toggle} last={i === rows.length - 1} />
        ))}
      </div>
      <SaveBtn label="Save Preferences" />
    </Section>
  )
}

// ── System ─────────────────────────────────────────────────────────────────
function SystemSection() {
  const [config, setConfig] = useState({ siteName: "HomeQuest Admin", apiUrl: "http://localhost:8080", currency: "USD", dateFormat: "MM/DD/YYYY", defaultCommissionRate: "3", maintenanceMode: false })
  const set = (k) => (e) => setConfig(p => ({ ...p, [k]: e.target.value }))

  return (
    <Section id="system" title="System" description="Core platform configuration and maintenance controls.">
      <div style={grid2}>
        <Field label="Site Name"    value={config.siteName} onChange={set("siteName")} span />
        <Field label="API Base URL" value={config.apiUrl}   onChange={set("apiUrl")}   span />
        <div style={fieldWrap}>
          <label style={labelStyle}>Currency</label>
          <select value={config.currency} onChange={set("currency")} style={inputStyle}>
            <option value="USD">USD — US Dollar</option>
            <option value="EUR">EUR — Euro</option>
            <option value="GBP">GBP — British Pound</option>
            <option value="AED">AED — UAE Dirham</option>
          </select>
        </div>
        <div style={fieldWrap}>
          <label style={labelStyle}>Date Format</label>
          <select value={config.dateFormat} onChange={set("dateFormat")} style={inputStyle}>
            <option value="MM/DD/YYYY">MM/DD/YYYY</option>
            <option value="DD/MM/YYYY">DD/MM/YYYY</option>
            <option value="YYYY-MM-DD">YYYY-MM-DD</option>
          </select>
        </div>
        <Field label="Default Commission Rate (%)" value={config.defaultCommissionRate} onChange={set("defaultCommissionRate")} type="number" />
      </div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1rem 1.25rem", backgroundColor: config.maintenanceMode ? "#FEF2F2" : "var(--color-bg-muted)", borderRadius: "8px", border: `1px solid ${config.maintenanceMode ? "#FECACA" : "var(--color-border)"}`, transition: "all 0.2s" }}>
        <div>
          <p style={{ margin: 0, fontWeight: 600, fontSize: "0.875rem", color: config.maintenanceMode ? "#B91C1C" : "var(--color-text)" }}>
            Maintenance Mode
            <span style={{ marginLeft: "0.5rem", fontSize: "0.75rem", fontWeight: 500, color: config.maintenanceMode ? "#B91C1C" : "var(--color-text-muted)" }}>
              {config.maintenanceMode ? "ON" : "OFF"}
            </span>
          </p>
          <p style={{ margin: "2px 0 0", fontSize: "0.8125rem", color: "var(--color-text-muted)" }}>
            {config.maintenanceMode ? "Only admins can access the platform." : "Platform is live and accessible to all users."}
          </p>
        </div>
        <Toggle value={config.maintenanceMode} onChange={(v) => setConfig(p => ({ ...p, maintenanceMode: v }))} />
      </div>

      <SaveBtn />
    </Section>
  )
}

// ── Shared ─────────────────────────────────────────────────────────────────
function Section({ id, title, description, children }) {
  return (
    <div id={id} style={{ backgroundColor: "var(--color-surface)", border: "1px solid var(--color-border)", borderRadius: "10px", overflow: "hidden" }}>
      <div style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid var(--color-border)", backgroundColor: "var(--color-bg-muted)" }}>
        <p style={{ margin: 0, fontWeight: 700, fontSize: "0.9375rem", color: "var(--color-text)" }}>{title}</p>
        {description && <p style={{ margin: "3px 0 0", fontSize: "0.8125rem", color: "var(--color-text-muted)" }}>{description}</p>}
      </div>
      <div style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1.25rem" }}>
        {children}
      </div>
    </div>
  )
}

function Field({ label, value, onChange, type = "text", span = false }) {
  return (
    <div style={{ ...fieldWrap, gridColumn: span ? "1 / -1" : undefined }}>
      <label style={labelStyle}>{label}</label>
      <input type={type} value={value} onChange={onChange} style={inputStyle} />
    </div>
  )
}

function Toggle({ value, onChange }) {
  return (
    <button onClick={() => onChange(!value)} style={{ width: "44px", height: "24px", borderRadius: "999px", border: "none", cursor: "pointer", backgroundColor: value ? "var(--color-primary)" : "var(--color-border)", position: "relative", transition: "background 0.2s", flexShrink: 0 }}>
      <span style={{ position: "absolute", top: "3px", left: value ? "23px" : "3px", width: "18px", height: "18px", borderRadius: "50%", backgroundColor: "#fff", transition: "left 0.2s", boxShadow: "0 1px 3px #0000003a" }} />
    </button>
  )
}

function SaveBtn({ label = "Save Changes" }) {
  return (
    <div>
      <button style={{ display: "flex", alignItems: "center", gap: "0.4rem", padding: "0.55rem 1.25rem", backgroundColor: "var(--color-primary)", color: "#fff", border: "none", borderRadius: "8px", fontWeight: 600, fontSize: "0.875rem", cursor: "pointer", fontFamily: "inherit" }}>
        <Save size={15} />{label}
      </button>
    </div>
  )
}

const labelStyle    = { fontSize: "0.8125rem", fontWeight: 500, color: "var(--color-text-muted)" }
const inputStyle    = { padding: "0.5rem 0.75rem", borderRadius: "8px", border: "1px solid var(--color-border)", fontSize: "0.875rem", color: "var(--color-text)", backgroundColor: "var(--color-bg-muted)", outline: "none", fontFamily: "inherit", width: "100%", boxSizing: "border-box" }
const fieldWrap     = { display: "flex", flexDirection: "column", gap: "0.35rem" }
const grid2         = { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1rem" }
const outlineBtnStyle = { padding: "0.3rem 0.75rem", borderRadius: "6px", border: "1px solid var(--color-border)", background: "none", cursor: "pointer", fontSize: "0.8125rem", color: "var(--color-text-muted)", fontFamily: "inherit" }
const subHeading    = { margin: "0 0 0.75rem", fontWeight: 600, fontSize: "0.875rem", color: "var(--color-text)" }
const colHead       = { fontSize: "0.75rem", fontWeight: 600, color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: "0.04em" }

function NotifHeader() {
  const isMobile = useIsMobile()
  if (isMobile) return null
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 100px 100px", backgroundColor: "var(--color-bg-muted)", padding: "0.6rem 1rem", borderBottom: "1px solid var(--color-border)" }}>
      <span style={colHead}>Event</span>
      <span style={{ ...colHead, textAlign: "center" }}>In-App</span>
      <span style={{ ...colHead, textAlign: "center" }}>Email</span>
    </div>
  )
}

function NotifRow({ row, prefs, toggle, last }) {
  const isMobile = useIsMobile()

  if (isMobile) {
    return (
      <div style={{ padding: "0.85rem 1rem", borderBottom: last ? "none" : "1px solid var(--color-border)" }}>
        <p style={{ margin: "0 0 0.5rem", fontWeight: 500, fontSize: "0.875rem", color: "var(--color-text)" }}>{row.label}</p>
        <p style={{ margin: "0 0 0.75rem", fontSize: "0.75rem", color: "var(--color-text-muted)" }}>{row.desc}</p>
        <div style={{ display: "flex", gap: "1.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Toggle value={prefs[row.inApp]} onChange={() => toggle(row.inApp)} />
            <span style={{ fontSize: "0.75rem", color: "var(--color-text-muted)" }}>In-App</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Toggle value={prefs[row.email]} onChange={() => toggle(row.email)} />
            <span style={{ fontSize: "0.75rem", color: "var(--color-text-muted)" }}>Email</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 100px 100px", padding: "0.85rem 1rem", borderBottom: last ? "none" : "1px solid var(--color-border)", alignItems: "center" }}>
      <div>
        <p style={{ margin: 0, fontWeight: 500, fontSize: "0.875rem", color: "var(--color-text)" }}>{row.label}</p>
        <p style={{ margin: "2px 0 0", fontSize: "0.75rem", color: "var(--color-text-muted)" }}>{row.desc}</p>
      </div>
      <div style={{ display: "flex", justifyContent: "center" }}><Toggle value={prefs[row.inApp]} onChange={() => toggle(row.inApp)} /></div>
      <div style={{ display: "flex", justifyContent: "center" }}><Toggle value={prefs[row.email]} onChange={() => toggle(row.email)} /></div>
    </div>
  )
}
