import { createSlice } from "@reduxjs/toolkit"

const stored = JSON.parse(localStorage.getItem("auth") || "null")

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user:  stored?.user  ?? null,
    token: stored?.token ?? null,
    role:  stored?.role  ?? null,
  },
  reducers: {
    setCredentials(state, { payload }) {
      state.user  = payload.user
      state.token = payload.token
      state.role  = payload.role
      localStorage.setItem("auth", JSON.stringify(payload))
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
