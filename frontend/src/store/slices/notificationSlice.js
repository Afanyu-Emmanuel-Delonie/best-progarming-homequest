import { createSlice } from "@reduxjs/toolkit"

const notificationSlice = createSlice({
  name: "notifications",
  initialState: {
    events: [],
    unread: 0,
  },
  reducers: {
    addEvent(state, { payload }) {
      state.events.unshift(payload)
      state.unread += 1
    },
    markAllRead(state) {
      state.unread = 0
    },
    clearAll(state) {
      state.events = []
      state.unread = 0
    },
  },
})

export const { addEvent, markAllRead, clearAll } = notificationSlice.actions
export default notificationSlice.reducer
