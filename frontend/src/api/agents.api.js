import client from "./client"

export const agentsApi = {
  getTop:      (limit = 8) => client.get("/agents/top", { params: { limit } }).then((r) => r.data),
  getAllActive: ()          => client.get("/agents/all").then((r) => r.data),
}
