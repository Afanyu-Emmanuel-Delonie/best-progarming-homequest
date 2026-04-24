import { NavLink, useNavigate } from "react-router-dom"
import { Home, LogOut } from "lucide-react"
import { useDispatch } from "react-redux"
import { logout } from "../../store/slices/authSlice"
import { ADMIN_NAV } from "../../constants/nav"

export default function Sidebar({ collapsed, nav }) {
  const dispatch  = useDispatch()
  const navigate  = useNavigate()
  const navItems  = nav ?? ADMIN_NAV
  const signOut   = () => { dispatch(logout()); navigate("/login") }
  const w = collapsed ? "64px" : "240px"

  return (
    <aside
      style={{
        backgroundColor: "var(--color-sidebar-bg)",
        width: w,
        minWidth: w,
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        transition: "width 0.2s ease, min-width 0.2s ease",
        overflow: "hidden",
        flexShrink: 0,
      }}
    >
      {/* Logo */}
      <div
        style={{
          height: "64px",
          display: "flex",
          alignItems: "center",
          gap: "0.75rem",
          padding: "0 1rem",
          borderBottom: "1px solid #ffffff1a",
          overflow: "hidden",
        }}
      >
        <Home size={20} style={{ color: "var(--color-primary)", flexShrink: 0 }} />
        {!collapsed && (
          <span
            style={{
              color: "#fff",
              fontWeight: 700,
              fontSize: "1rem",
              letterSpacing: "0.06em",
              whiteSpace: "nowrap",
            }}
          >
            HomeQuest
          </span>
        )}
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: "0.75rem 0.5rem", display: "flex", flexDirection: "column", gap: "2px" }}>
        {navItems.map((item) => (
          <NavLink
            key={item.href}
            to={item.href}
            end={item.end ?? false}
            title={collapsed ? item.label : undefined}
            style={({ isActive }) => ({
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              padding: collapsed ? "0.65rem" : "0.6rem 0.75rem",
              justifyContent: collapsed ? "center" : "flex-start",
              borderRadius: "6px",
              borderLeft: isActive ? "3px solid var(--color-primary)" : "3px solid transparent",
              backgroundColor: isActive ? "#ffffff14" : "transparent",
              color: isActive ? "#fff" : "var(--color-sidebar-text)",
              fontSize: "0.875rem",
              textDecoration: "none",
              whiteSpace: "nowrap",
              overflow: "hidden",
              transition: "background 0.15s, color 0.15s",
            })}
            className="sidebar-link"
          >
            <span style={{ flexShrink: 0 }}>{item.icon}</span>
            {!collapsed && <span>{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Sign out */}
      <div style={{ padding: "0.75rem 0.5rem", borderTop: "1px solid #ffffff1a" }}>
        <button
          onClick={signOut}
          title={collapsed ? "Sign out" : undefined}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            padding: collapsed ? "0.65rem" : "0.6rem 0.75rem",
            justifyContent: collapsed ? "center" : "flex-start",
            width: "100%",
            background: "none",
            border: "none",
            cursor: "pointer",
            borderRadius: "6px",
            color: "var(--color-sidebar-text)",
            fontSize: "0.875rem",
            whiteSpace: "nowrap",
            transition: "background 0.15s, color 0.15s",
          }}
          className="sidebar-link"
        >
          <LogOut size={18} style={{ flexShrink: 0 }} />
          {!collapsed && <span>Sign out</span>}
        </button>
      </div>
    </aside>
  )
}
