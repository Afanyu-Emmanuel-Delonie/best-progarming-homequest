import { useSelector, useDispatch } from "react-redux"
import { logout } from "../store/slices/authSlice"

export function useAuth() {
  const dispatch = useDispatch()
  const { user, token, role } = useSelector((s) => s.auth)
  return {
    user,
    token,
    role,
    isAuthenticated: !!token,
    signOut: () => dispatch(logout()),
  }
}
