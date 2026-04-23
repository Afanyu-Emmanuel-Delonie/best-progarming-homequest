import { useState, useEffect } from "react"
import { Outlet } from "react-router-dom"
import Sidebar from "../components/shared/Sidebar"
import Header  from "../components/shared/header"
import { AGENT_NAV } from "../constants/nav"

const MOBILE_BP = 768

export default function AgentLayout() {
  const [collapsed, setCollapsed] = useState(false)
  const [isMobile, setIsMobile]   = useState(window.innerWidth < MOBILE_BP)

  useEffect(() => {
    const onResize = () => {
      const mobile = window.innerWidth < MOBILE_BP
      setIsMobile(mobile)
      setCollapsed(mobile)
    }
    window.addEventListener("resize", onResize)
    return () => window.removeEventListener("resize", onResize)
  }, [])

  const toggle = () => setCollapsed(v => !v)

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden", backgroundColor: "var(--color-bg-muted)" }}>

      {isMobile && !collapsed && (
        <div onClick={toggle} style={{ position: "fixed", inset: 0, backgroundColor: "#00000060", zIndex: 40 }} />
      )}

      <div style={{
        position: isMobile ? "fixed" : "relative",
        top: 0, left: 0, height: "100vh",
        zIndex: isMobile ? 50 : undefined,
        transform: isMobile && collapsed ? "translateX(-100%)" : "translateX(0)",
        transition: "transform 0.2s ease",
      }}>
        <Sidebar collapsed={!isMobile && collapsed} nav={AGENT_NAV} />
      </div>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <Header fullName="Sarah Johnson" role="ROLE_AGENT" onToggleSidebar={toggle} profileHref="/agent/profile" settingsHref="/agent/profile" />
        <main style={{ flex: 1, overflowY: "auto", overflowX: "hidden", padding: "1.5rem", minWidth: 0 }}>
          <Outlet />
        </main>
      </div>
    </div>
  )
}
