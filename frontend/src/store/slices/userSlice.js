import { createSlice } from "@reduxjs/toolkit"

const userSlice = createSlice({
  name: "users",
  initialState: { items: [], loading: false },
  reducers: {
    setUsers (state, { payload }) { state.items   = payload },
    setLoading(state, { payload }) { state.loading = payload },
    upsertUser(state, { payload }) {
      const idx = state.items.findIndex(u => u.id === payload.id)
      idx >= 0 ? (state.items[idx] = payload) : state.items.unshift(payload)
    },
    removeUser(state, { payload: id }) {
      state.items = state.items.filter(u => u.id !== id)
    },
  },
})

export const { setUsers, setLoading, upsertUser, removeUser } = userSlice.actions
export default userSlice.reducer
