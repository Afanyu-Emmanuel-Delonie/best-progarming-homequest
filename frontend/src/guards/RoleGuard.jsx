import { Navigate, Outlet } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"

export default function RoleGuard({ roles }) {
  const { role } = useAuth()
  return roles.includes(role) ? <Outlet /> : <Navigate to="/unauthorized" replace />
}
