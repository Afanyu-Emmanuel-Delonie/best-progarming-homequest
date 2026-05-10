import client from "./client"

export const dashboardApi = {
  getAgent:   ()          => client.get("/dashboard/agent").then(r => r.data),
  getCompany: (companyId) => client.get(`/dashboard/company/${companyId}`).then(r => r.data),
}
