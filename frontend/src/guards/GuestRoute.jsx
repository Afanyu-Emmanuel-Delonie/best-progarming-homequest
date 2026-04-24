import { Navigate, Outlet } from "react-router-dom"
import { useSelector } from "react-redux"
import { decodeToken } from "../store/slices/authSlice"

const ROLE_HOME = {
  ROLE_ADMIN:    "/admin",
  ROLE_AGENT:    "/agent",
  ROLE_OWNER:    "/owner",
  ROLE_CUSTOMER: "/client",
}

export default function GuestRoute() {
  const token = useSelector(s => s.auth.token)
  const role  = token ? decodeToken(token)?.role : null
  return token ? <Navigate to={ROLE_HOME[role] ?? "/"} replace /> : <Outlet />
}
