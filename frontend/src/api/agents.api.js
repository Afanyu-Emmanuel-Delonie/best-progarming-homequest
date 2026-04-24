import client from "./client"

export const agentsApi = {
  /** Public landing: active agents ranked by listing count */
  getTop: (limit = 8) => client.get("/agents/top", { params: { limit } }).then((r) => r.data),
}
