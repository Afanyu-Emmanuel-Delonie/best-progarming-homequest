import { createSlice } from "@reduxjs/toolkit"

const documentSlice = createSlice({
  name: "documents",
  initialState: { items: [], loading: false },
  reducers: {
    setDocuments(state, { payload }) { state.items   = payload },
    setLoading  (state, { payload }) { state.loading = payload },
    upsertDocument(state, { payload }) {
      const idx = state.items.findIndex(d => d.id === payload.id)
      idx >= 0 ? (state.items[idx] = payload) : state.items.unshift(payload)
    },
  },
})

export const { setDocuments, setLoading, upsertDocument } = documentSlice.actions
export default documentSlice.reducer
