import client from "./client"

export const ownerApi = {
  getMy:   ()         => client.get("/owners/my").then(r => r.data),
  getById: (id)       => client.get(`/owners/${id}`).then(r => r.data),
  update:  (id, data) => client.put(`/owners/${id}`, data).then(r => r.data),
}
