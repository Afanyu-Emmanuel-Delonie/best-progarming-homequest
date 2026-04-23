"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Users, CreditCard, ShoppingBag, Dumbbell, MessageSquare, QrCode, LogOut } from "lucide-react"
import { useSidebar } from "./SidebarContext"
import { NAV_ITEMS } from "@/constants/dashboard"

type Role = "ADMIN" | "SALES_AGENT" | "COACH" | "NUTRITIONIST" | "CLIENT"

export default function Sidebar({ role }: { role: Role }) {
  const pathname = usePathname()
  const { collapsed, isMobile } = useSidebar()
  const links = NAV_ITEMS[role] ?? []

  // On mobile: hidden when collapsed, overlay when open
  // On desktop: shrinks to icon-only when collapsed
  const mobileHidden = isMobile && collapsed

  return (
    <>
      {/* Mobile overlay backdrop */}
      {isMobile && !collapsed && (
        <div
          style={{ position: "fixed", inset: 0, backgroundColor: "#00000080", zIndex: 40 }}
          onClick={() => {}}
        />
      )}
      <aside
        style={{
          backgroundColor: "var(--color-sidebar-bg)",
          width: collapsed ? (isMobile ? "0px" : "64px") : "240px",
          minWidth: collapsed ? (isMobile ? "0px" : "64px") : "240px",
          transition: "width 0.2s ease, min-width 0.2s ease",
          overflow: "hidden",
          position: isMobile ? "fixed" : "relative",
          top: isMobile ? 0 : undefined,
          left: isMobile ? 0 : undefined,
          height: isMobile ? "100vh" : "100%",
          zIndex: isMobile ? 50 : undefined,
        }}
        className="flex flex-col"
      >
      {/* Logo */}
      <div
        className="flex items-center px-4 py-5"
        style={{ borderBottom: "1px solid #ffffff1a", gap: "0.75rem", overflow: "hidden", height: "64px" }}
      >
        <Dumbbell size={22} style={{ color: "#FFF", flexShrink: 0 }} />
        {!collapsed && (
          <span style={{ color: "#FFF", fontFamily: "var(--font-title)", fontSize: "var(--text-lg)", letterSpacing: "0.08em", whiteSpace: "nowrap" }}>
            GYMPRO
          </span>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-4 space-y-1">
        {links.map((item) => {
          const isActive = pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              title={collapsed ? item.label : undefined}
              style={{
                backgroundColor: isActive ? "#ffffff18" : "transparent",
                color: isActive ? "#fff" : "var(--color-sidebar-text)",
                borderRadius: "var(--radius-md)",
                fontSize: "var(--text-base)",
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                padding: collapsed ? "0.65rem" : "0.6rem 0.75rem",
                justifyContent: collapsed ? "center" : "flex-start",
                whiteSpace: "nowrap",
                overflow: "hidden",
                borderLeft: isActive ? "3px solid var(--color-primary)" : "3px solid transparent",
              }}
              className="font-normal transition-all hover:bg-white/10 hover:text-white"
            >
              <span style={{ flexShrink: 0 }}>{item.icon}</span>
              {!collapsed && <span>{item.label}</span>}
            </Link>
          )
        })}
      </nav>

      {/* Sign out */}
      <div className="px-2 py-4" style={{ borderTop: "1px solid #ffffff1a" }}>
        <form action="/api/auth/signout" method="POST">
          <button
            type="submit"
            title={collapsed ? "Sign out" : undefined}
            style={{
              color: "var(--color-text-muted)",
              fontSize: "var(--text-base)",
              justifyContent: collapsed ? "center" : "flex-start",
              width: "100%",
              background: "none",
              border: "none",
              cursor: "pointer",
              borderRadius: "var(--radius-md)",
            }}
            className="hover:bg-white/10 hover:text-white transition-colors"
          >
            <LogOut size={20} style={{ flexShrink: 0 }} />
            {!collapsed && <span>Sign out</span>}
          </button>
        </form>
      </div>
    </aside>
    </>
  )
}
