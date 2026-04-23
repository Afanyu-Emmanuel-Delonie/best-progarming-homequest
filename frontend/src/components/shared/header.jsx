import { useState, useRef, useEffect } from "react"
import { useLocation } from "react-router-dom"
import { Menu, Bell, ChevronDown, LogOut, User, Settings, Check, Home } from "lucide-react"
import { PAGE_TITLES } from "../../constants/nav"

export default function Header({ fullName, role, onToggleSidebar, profileHref = "/admin/profile", settingsHref = "/admin/settings" }) {
  const { pathname } = useLocation()
  const title = PAGE_TITLES[pathname] ?? "Dashboard"

  const [notifOpen, setNotifOpen]     = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [notifications, setNotifications] = useState([
    { id: "1", title: "New application submitted", message: "A buyer placed a bid on 12 Oak St.", time: "2m ago", read: false },
    { id: "2", title: "Transaction completed",      message: "Sale of 45 Maple Ave finalised.",  time: "1h ago", read: false },
    { id: "3", title: "New agent registered",       message: "John Doe joined as an agent.",     time: "3h ago", read: true  },
  ])

  const notifRef   = useRef(null)
  const profileRef = useRef(null)

  const unread   = notifications.filter((n) => !n.read).length
  const initials = fullName ? fullName.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase() : "?"

  useEffect(() => {
    const handler = (e) => {
      if (notifRef.current   && !notifRef.current.contains(e.target))   setNotifOpen(false)
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false)
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  const markAllRead = () => setNotifications((p) => p.map((n) => ({ ...n, read: true })))
  const markRead    = (id) => setNotifications((p) => p.map((n) => n.id === id ? { ...n, read: true } : n))

  return (
    <header style={{
      height: "64px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "0 1.25rem",
      backgroundColor: "var(--color-surface)",
      borderBottom: "1px solid var(--color-border)",
      position: "sticky",
      top: 0,
      zIndex: 30,
      gap: "1rem",
    }}>

      {/* LEFT */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
        <button onClick={onToggleSidebar} style={iconBtnStyle} aria-label="Toggle sidebar">
          <Menu size={20} />
        </button>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <div style={{ width: 28, height: 28, borderRadius: "7px", backgroundColor: "var(--color-primary)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <Home size={14} color="#fff" />
          </div>
          <span style={{ fontWeight: 700, fontSize: "0.9375rem", color: "var(--color-text)" }}>{title}</span>
        </div>
      </div>

      {/* RIGHT */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>

        {/* Notifications */}
        <div ref={notifRef} style={{ position: "relative" }}>
          <button
            onClick={() => { setNotifOpen((v) => !v); setProfileOpen(false) }}
            style={{ ...iconBtnStyle, position: "relative" }}
            aria-label="Notifications"
          >
            <Bell size={19} />
            {unread > 0 && (
              <span style={{
                position: "absolute", top: "4px", right: "4px",
                width: "8px", height: "8px", borderRadius: "50%",
                backgroundColor: "var(--color-primary)",
              }} />
            )}
          </button>

          {notifOpen && (
            <div style={dropdownStyle({ width: "320px" })}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.75rem 1rem 0.5rem", borderBottom: "1px solid var(--color-border)" }}>
                <span style={{ fontWeight: 600, fontSize: "0.875rem", color: "var(--color-text)" }}>
                  Notifications {unread > 0 && <span style={badgeStyle}>{unread}</span>}
                </span>
                {unread > 0 && (
                  <button onClick={markAllRead} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "12px", color: "var(--color-primary)", display: "flex", alignItems: "center", gap: "4px", fontWeight: 500 }}>
                    <Check size={12} /> Mark all read
                  </button>
                )}
              </div>
              <div style={{ maxHeight: "260px", overflowY: "auto" }}>
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    onClick={() => markRead(n.id)}
                    style={{ display: "flex", gap: "0.75rem", padding: "0.65rem 1rem", cursor: "pointer", opacity: n.read ? 0.55 : 1, borderBottom: "1px solid var(--color-border)" }}
                  >
                    <span style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: n.read ? "transparent" : "var(--color-primary)", flexShrink: 0, marginTop: "5px" }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ margin: 0, fontSize: "0.8125rem", fontWeight: n.read ? 400 : 600, color: "var(--color-text)" }}>{n.title}</p>
                      <p style={{ margin: "2px 0 0", fontSize: "0.75rem", color: "var(--color-text-muted)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{n.message}</p>
                    </div>
                    <span style={{ fontSize: "0.6875rem", color: "var(--color-text-subtle)", flexShrink: 0 }}>{n.time}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Divider */}
        <div style={{ width: "1px", height: "28px", background: "var(--color-border)", margin: "0 0.35rem" }} />

        {/* Profile */}
        <div ref={profileRef} style={{ position: "relative" }}>
          <button
            onClick={() => { setProfileOpen((v) => !v); setNotifOpen(false) }}
            style={{ display: "flex", alignItems: "center", gap: "0.5rem", background: "none", border: "none", cursor: "pointer", padding: "0.35rem 0.5rem", borderRadius: "8px" }}
            aria-label="Profile menu"
          >
            <div style={{
              width: "32px", height: "32px", borderRadius: "50%",
              backgroundColor: "var(--color-primary)",
              color: "#fff", display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "0.75rem", fontWeight: 700, flexShrink: 0,
            }}>
              {initials}
            </div>
            <div className="header-profile-text" style={{ textAlign: "left", lineHeight: 1.25 }}>
              <p style={{ margin: 0, fontSize: "0.8125rem", fontWeight: 600, color: "var(--color-text)", whiteSpace: "nowrap" }}>{fullName}</p>
              <p style={{ margin: 0, fontSize: "0.6875rem", color: "var(--color-text-muted)", textTransform: "capitalize" }}>{role?.replace("_", " ").toLowerCase()}</p>
            </div>
            <ChevronDown className="header-profile-text" size={14} style={{ color: "var(--color-text-muted)", transform: profileOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
          </button>

          {profileOpen && (
            <div style={dropdownStyle({ minWidth: "180px" })}>
              <a href={profileHref}  style={menuItemStyle}><User size={14} /> My Profile</a>
              <a href={settingsHref} style={menuItemStyle}><Settings size={14} /> Settings</a>
              <div style={{ height: "1px", background: "var(--color-border)", margin: "0.25rem 0" }} />
              <button onClick={() => {/* dispatch logout */}} style={{ ...menuItemStyle, width: "100%", border: "none", cursor: "pointer", color: "var(--color-error)" }}>
                <LogOut size={14} /> Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

const iconBtnStyle = {
  display: "flex", alignItems: "center", justifyContent: "center",
  width: "36px", height: "36px", borderRadius: "8px",
  background: "none", border: "none", cursor: "pointer",
  color: "var(--color-text-muted)",
}

const dropdownStyle = (extra = {}) => ({
  position: "absolute", top: "calc(100% + 8px)", right: 0,
  backgroundColor: "var(--color-surface)",
  border: "1px solid var(--color-border)",
  borderRadius: "10px",
  boxShadow: "0 8px 24px #0000001a",
  zIndex: 50,
  overflow: "hidden",
  ...extra,
})

const badgeStyle = {
  marginLeft: "0.4rem",
  background: "var(--color-primary)",
  color: "#fff",
  borderRadius: "999px",
  fontSize: "11px",
  padding: "1px 6px",
  fontWeight: 700,
}

const menuItemStyle = {
  display: "flex", alignItems: "center", gap: "0.5rem",
  padding: "0.55rem 1rem",
  fontSize: "0.8125rem",
  color: "var(--color-text)",
  textDecoration: "none",
  background: "none",
  width: "100%",
  textAlign: "left",
  whiteSpace: "nowrap",
}
