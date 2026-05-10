import { createSlice } from "@reduxjs/toolkit"

const transactionSlice = createSlice({
  name: "transactions",
  initialState: { items: [], loading: false },
  reducers: {
    setTransactions(state, { payload }) { state.items   = payload },
    setLoading     (state, { payload }) { state.loading = payload },
    upsertTransaction(state, { payload }) {
      const idx = state.items.findIndex(t => t.id === payload.id)
      idx >= 0 ? (state.items[idx] = payload) : state.items.unshift(payload)
    },
  },
})

export const { setTransactions, setLoading, upsertTransaction } = transactionSlice.actions
export default transactionSlice.reducer
