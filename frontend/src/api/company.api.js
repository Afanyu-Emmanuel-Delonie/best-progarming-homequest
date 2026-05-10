import client from "./client"

export const companyApi = {
  getMy:    ()           => client.get("/companies/my").then(r => r.data),
  getById:  (id)         => client.get(`/companies/${id}`).then(r => r.data),
  update:   (id, data)   => client.put(`/companies/${id}`, data).then(r => r.data),
  getAgents:(id)         => client.get(`/companies/${id}/agents`).then(r => r.data),
}
