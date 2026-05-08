import client from "./client"

export const ownerApi = {
  getAll:  ()         => client.get("/owners").then(r => r.data),
  getMy:   ()         => client.get("/owners/me").then(r => r.data),
  getById: (id)       => client.get(`/owners/${id}`).then(r => r.data),
  update:  (id, data) => client.put(`/owners/${id}`, data).then(r => r.data),
}
