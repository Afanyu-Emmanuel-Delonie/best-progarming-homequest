import client from "./client"

export const dashboardApi = {
  admin:   ()   => client.get("/dashboard/admin").then(r => r.data),
  agent:   ()   => client.get("/dashboard/agent").then(r => r.data),
  company: (id) => client.get(`/dashboard/company/${id}`).then(r => r.data),
  owner:   ()   => client.get("/dashboard/owner").then(r => r.data),
  client:  ()   => client.get("/dashboard/client").then(r => r.data),
}
