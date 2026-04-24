import {
  LayoutDashboard,
  Users,
  Building2,
  FileText,
  ArrowLeftRight,
  ClipboardList,
  Settings,
  Home,
  DollarSign,
  UserCircle,
  Search,
  Heart,
  FolderOpen,
  UserCheck,
} from "lucide-react"
import { createElement } from "react"

const icon = (Component) => createElement(Component, { size: 18 })

export const ADMIN_NAV = [
  { label: "Dashboard",    href: "/admin",                icon: icon(LayoutDashboard), end: true },
  { label: "Users",        href: "/admin/users",          icon: icon(Users) },
  { label: "Clients",      href: "/admin/clients",        icon: icon(UserCheck) },
  { label: "Properties",   href: "/admin/properties",     icon: icon(Building2) },
  { label: "Applications", href: "/admin/applications",   icon: icon(ClipboardList) },
  { label: "Transactions", href: "/admin/transactions",   icon: icon(ArrowLeftRight) },
  { label: "Documents",    href: "/admin/documents",      icon: icon(FileText) },
  { label: "Settings",     href: "/admin/settings",       icon: icon(Settings) },
]

export const CLIENT_NAV = [
  { label: "Dashboard",    href: "/client",               icon: icon(LayoutDashboard), end: true },
  { label: "Applications", href: "/client/applications",  icon: icon(ClipboardList) },
  { label: "Documents",    href: "/client/documents",     icon: icon(FolderOpen) },
  { label: "Saved",        href: "/client/saved",         icon: icon(Heart) },
  { label: "Browse",       href: "/properties",           icon: icon(Search) },
]

export const OWNER_NAV = [
  { label: "Dashboard",    href: "/owner",                icon: icon(LayoutDashboard), end: true },
  { label: "My Properties",href: "/owner/properties",     icon: icon(Building2) },
  { label: "Transactions", href: "/owner/transactions",   icon: icon(ArrowLeftRight) },
  { label: "Documents",    href: "/owner/documents",      icon: icon(FolderOpen) },
]

export const AGENT_NAV = [
  { label: "Dashboard",    href: "/agent",                icon: icon(LayoutDashboard), end: true },
  { label: "My Listings",  href: "/agent/listings",       icon: icon(Home),            end: true },
  { label: "My Clients",   href: "/agent/clients",        icon: icon(UserCheck) },
  { label: "Applications", href: "/agent/applications",   icon: icon(ClipboardList) },
  { label: "Transactions", href: "/agent/transactions",   icon: icon(ArrowLeftRight) },
  { label: "Documents",    href: "/agent/documents",      icon: icon(FolderOpen) },
  { label: "Commissions",  href: "/agent/commissions",    icon: icon(DollarSign) },
  { label: "Profile",      href: "/agent/profile",        icon: icon(UserCircle) },
]

export const PAGE_TITLES = {
  "/client":               "Dashboard",
  "/client/applications":  "My Applications",
  "/client/documents":     "My Documents",
  "/client/saved":         "Saved Properties",
  "/owner":                "Dashboard",
  "/owner/properties":     "My Properties",
  "/owner/transactions":   "Transactions",
  "/owner/documents":      "My Documents",
  "/admin":                "Dashboard",
  "/admin/clients":       "Clients",
  "/admin/users":          "Users",
  "/admin/properties":     "Properties",
  "/admin/applications":   "Applications",
  "/admin/transactions":   "Transactions",
  "/admin/documents":      "Documents",
  "/admin/settings":       "Settings",
  "/agent/clients":       "My Clients",
  "/agent":                "Dashboard",
  "/agent/listings":       "My Listings",
  "/agent/applications":   "Applications",
  "/agent/transactions":   "Transactions",
  "/agent/documents":      "Documents",
  "/agent/commissions":    "Commissions",
  "/agent/profile":        "My Profile",
}
