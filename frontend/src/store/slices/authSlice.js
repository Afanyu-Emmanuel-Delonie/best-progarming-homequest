import { createSlice } from "@reduxjs/toolkit"

// Decode JWT payload without a library
export function decodeToken(token) {
  try {
    const payload = token.split(".")[1]
    return JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/")))
  } catch {
    return null
  }
}

function isExpired(token) {
  const decoded = decodeToken(token)
  if (!decoded?.exp) return true
  return decoded.exp * 1000 < Date.now()
}

const stored = JSON.parse(localStorage.getItem("auth") || "null")
// Discard stored auth if token is expired
const validStored = stored?.token && !isExpired(stored.token) ? stored : null

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user:  validStored?.user  ?? null,
    token: validStored?.token ?? null,
    role:  validStored?.token ? (decodeToken(validStored.token)?.role ?? null) : null,
  },
  reducers: {
    setCredentials(state, { payload }) {
      const decoded = decodeToken(payload.token)
      state.user  = payload.user
      state.token = payload.token
      // Always read role from the JWT, not from the response body
      state.role  = decoded?.role ?? payload.role ?? null
      localStorage.setItem("auth", JSON.stringify({ user: payload.user, token: payload.token }))
    },
    logout(state) {
      state.user  = null
      state.token = null
      state.role  = null
      localStorage.removeItem("auth")
    },
  },
})

export const { setCredentials, logout } = authSlice.actions
export default authSlice.reducer
