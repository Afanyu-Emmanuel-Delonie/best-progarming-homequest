import client from "./client"

export const transactionsApi = {
  getById:          (id)         => client.get(`/transactions/${id}`).then(r => r.data),
  create:           (data)       => client.post("/transactions",            data).then(r => r.data),
  updateStatus:     (id, status) => client.patch(`/transactions/${id}/status`, null, { params: { status } }).then(r => r.data),
  getMyListings:    ()           => client.get("/transactions/my/listings").then(r => r.data),
  getMySales:       ()           => client.get("/transactions/my/sales").then(r => r.data),
  getMyOwner:       ()           => client.get("/transactions/my/owner").then(r => r.data),
  getMyPurchases:   ()           => client.get("/transactions/my/purchases").then(r => r.data),
  getMyCommissions: ()           => client.get("/transactions/my/commissions").then(r => r.data),
  getByCompany:     (companyId)  => client.get(`/transactions/company/${companyId}`).then(r => r.data),
}
