import {
  LayoutDashboard,
  Users,
  Building2,
  FileText,
  ArrowLeftRight,
  ClipboardList,
  Settings,
} from "lucide-react"
import { createElement } from "react"

const icon = (Component) => createElement(Component, { size: 18 })

export const ADMIN_NAV = [
  { label: "Dashboard",    href: "/admin",                icon: icon(LayoutDashboard) },
  { label: "Users",        href: "/admin/users",          icon: icon(Users) },
  { label: "Properties",   href: "/admin/properties",     icon: icon(Building2) },
  { label: "Applications", href: "/admin/applications",   icon: icon(ClipboardList) },
  { label: "Transactions", href: "/admin/transactions",   icon: icon(ArrowLeftRight) },
  { label: "Documents",    href: "/admin/documents",      icon: icon(FileText) },
  { label: "Settings",     href: "/admin/settings",       icon: icon(Settings) },
]

export const PAGE_TITLES = {
  "/admin":                "Dashboard",
  "/admin/users":          "Users",
  "/admin/properties":     "Properties",
  "/admin/applications":   "Applications",
  "/admin/transactions":   "Transactions",
  "/admin/documents":      "Documents",
  "/admin/settings":       "Settings",
}
