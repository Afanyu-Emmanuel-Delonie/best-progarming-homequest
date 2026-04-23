"use client"

import { usePathname } from "next/navigation"
import { useState, useRef, useEffect } from "react"
import { Menu, Search, Bell, ChevronDown, Settings, LogOut, User, X, Check } from "lucide-react"
import Link from "next/link"
import { useSidebar } from "./SidebarContext"
import { PAGE_TITLES, MOCK_NOTIFICATIONS, NOTIF_TYPE_COLORS, Notification } from "@/constants/dashboard"
import "@/app/header.css"

export default function Header({ fullName, role }: { fullName: string; role: string }) {
  const pathname = usePathname()
  const { toggle } = useSidebar()
  const title = PAGE_TITLES[pathname] ?? "Dashboard"

  const [searchOpen, setSearchOpen]       = useState(false)
  const [searchQuery, setSearchQuery]     = useState("")
  const [notifOpen, setNotifOpen]         = useState(false)
  const [profileOpen, setProfileOpen]     = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS)

  const searchRef  = useRef<HTMLDivElement>(null)
  const notifRef   = useRef<HTMLDivElement>(null)
  const profileRef = useRef<HTMLDivElement>(null)

  const unread  = notifications.filter((n) => !n.read).length
  const initials = fullName.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (notifRef.current   && !notifRef.current.contains(e.target as Node))   setNotifOpen(false)
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setProfileOpen(false)
      if (searchRef.current  && !searchRef.current.contains(e.target as Node))  { setSearchOpen(false); setSearchQuery("") }
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  const markAllRead = () => setNotifications((p) => p.map((n) => ({ ...n, read: true })))
  const markRead = (id: string) => setNotifications((p) => p.map((n) => n.id === id ? { ...n, read: true } : n))

  return (
    <header className="hdr-root">

      {/* LEFT */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
        <button className="hdr-icon-btn" onClick={toggle} aria-label="Toggle sidebar">
          <Menu size={20} />
        </button>
        <h2 style={{ margin: 0, fontWeight: 700, color: "var(--color-text-primary)" }}>
          {title}
        </h2>
      </div>

      {/* RIGHT */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>

        {/* Search desktop */}
        <div className="hdr-search-desktop">
          <Search size={15} style={{ color: "var(--color-text-muted)", flexShrink: 0 }} />
          <input className="hdr-search-input" placeholder="Search…" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
        </div>

        {/* Search mobile */}
        <div ref={searchRef} className="hdr-search-mobile" style={{ position: "relative" }}>
          {searchOpen ? (
            <div className="hdr-search-mobile-open">
              <Search size={15} style={{ color: "var(--color-text-muted)", flexShrink: 0 }} />
              <input autoFocus className="hdr-search-input" style={{ width: "140px" }} placeholder="Search…" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
              <button className="hdr-icon-btn" style={{ padding: "0.1rem" }} onClick={() => { setSearchOpen(false); setSearchQuery("") }}>
                <X size={14} />
              </button>
            </div>
          ) : (
            <button className="hdr-icon-btn md:hidden" onClick={() => setSearchOpen(true)} aria-label="Open search">
              <Search size={19} />
            </button>
          )}
        </div>

        {/* Notifications */}
        <div ref={notifRef} style={{ position: "relative" }}>
          <button className="hdr-icon-btn" onClick={() => { setNotifOpen((v) => !v); setProfileOpen(false) }} aria-label="Notifications">
            <Bell size={19} />
            {unread > 0 && <span className="hdr-badge">{unread}</span>}
          </button>

          {notifOpen && (
            <div className="hdr-dropdown" style={{ width: "340px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.85rem 1rem 0.6rem", borderBottom: "1px solid var(--color-border)" }}>
                <span style={{ fontWeight: 600, fontSize: "var(--text-sm)", color: "var(--color-text-primary)" }}>
                  Notifications
                  {unread > 0 && <span style={{ marginLeft: "0.5rem", background: "var(--color-primary)", color: "#fff", borderRadius: "999px", fontSize: "11px", padding: "1px 7px", fontWeight: 700 }}>{unread}</span>}
                </span>
                {unread > 0 && (
                  <button onClick={markAllRead} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "12px", color: "var(--color-primary)", display: "flex", alignItems: "center", gap: "4px", fontWeight: 500 }}>
                    <Check size={12} /> Mark all read
                  </button>
                )}
              </div>
              <div style={{ maxHeight: "300px", overflowY: "auto" }}>
                {notifications.map((n) => (
                  <div key={n.id} className="hdr-notif-item" style={{ opacity: n.read ? 0.6 : 1 }} onClick={() => markRead(n.id)}>
                    <span className="hdr-notif-dot" style={{ background: n.read ? "transparent" : NOTIF_TYPE_COLORS[n.type] }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ margin: 0, fontSize: "var(--text-sm)", fontWeight: n.read ? 400 : 600, color: "var(--color-text-primary)" }}>{n.title}</p>
                      <p style={{ margin: "2px 0 0", fontSize: "12px", color: "var(--color-text-muted)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{n.message}</p>
                    </div>
                    <span style={{ fontSize: "11px", color: "var(--color-text-muted)", flexShrink: 0, alignSelf: "flex-start", marginTop: "2px" }}>{n.time}</span>
                  </div>
                ))}
              </div>
              <div style={{ padding: "0.6rem 1rem", borderTop: "1px solid var(--color-border)" }}>
                <Link href="/notifications" onClick={() => setNotifOpen(false)} style={{ display: "block", width: "100%", textAlign: "center", fontSize: "var(--text-sm)", color: "var(--color-primary)", fontWeight: 500, padding: "0.25rem", textDecoration: "none" }}>
                  View all notifications
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Divider */}
        <div style={{ width: "1px", height: "28px", background: "var(--color-border)", margin: "0 0.35rem" }} />

        {/* Profile */}
        <div ref={profileRef} style={{ position: "relative" }}>
          <button className="hdr-profile-btn" onClick={() => { setProfileOpen((v) => !v); setNotifOpen(false) }} aria-label="Profile menu">
            <div className="hdr-avatar">{initials}</div>
            <div className="hidden md:block" style={{ textAlign: "left" }}>
              <p style={{ margin: 0, fontSize: "var(--text-sm)", fontWeight: 600, color: "var(--color-text-primary)", lineHeight: 1.2 }}>{fullName}</p>
              <p style={{ margin: 0, fontSize: "11px", color: "var(--color-text-muted)", textTransform: "capitalize", lineHeight: 1.2 }}>{role.replace("_", " ")}</p>
            </div>
            <ChevronDown size={14} className="hidden md:block" style={{ color: "var(--color-text-muted)", transform: profileOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s", marginLeft: "2px" }} />
          </button>

          {profileOpen && (
            <div className="hdr-dropdown" style={{ minWidth: "200px" }}>
              <div style={{ padding: "0.85rem 1rem 0.65rem" }}>
                <p style={{ margin: 0, fontSize: "var(--text-sm)", fontWeight: 600, color: "var(--color-text-primary)" }}>{fullName}</p>
                <p style={{ margin: "2px 0 0", fontSize: "12px", color: "var(--color-text-muted)" }}>{role.replace("_", " ")}</p>
              </div>
              <div className="hdr-divider" />
              <button className="hdr-menu-item"><User size={15} /><a href="/profile" style={{ textDecoration: "none", color: "inherit" }}>My Profile</a></button>
              <button className="hdr-menu-item"><Settings size={15} /> Settings</button>
              <div className="hdr-divider" />
              <button className="hdr-menu-item danger"><LogOut size={15} /> Sign Out</button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
