import { Navigate, Outlet } from "react-router-dom"
import { useSelector } from "react-redux"
import { decodeToken } from "../store/slices/authSlice"

export default function RoleGuard({ roles }) {
  const token = useSelector(s => s.auth.token)
  const role  = token ? decodeToken(token)?.role : null
  return roles.includes(role) ? <Outlet /> : <Navigate to="/login" replace />
}
