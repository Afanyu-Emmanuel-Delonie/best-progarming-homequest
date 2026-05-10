import client from "./client"

export const propertiesApi = {
  getAll:           (params)     => client.get("/properties",              { params }).then(r => r.data),
  getById:          (id)         => client.get(`/properties/${id}`).then(r => r.data),
  create:           (data)       => client.post("/properties",             data).then(r => r.data),
  update:           (id, data)   => client.put(`/properties/${id}`,        data).then(r => r.data),
  remove:           (id)         => client.delete(`/properties/${id}`).then(r => r.data),
  updateStatus:     (id, status) => client.patch(`/properties/${id}/status`, null, { params: { status } }).then(r => r.data),
  assignBuyer:      (id, buyerPublicId) => client.patch(`/properties/${id}/buyer`, null, { params: { buyerPublicId } }).then(r => r.data),
  getMyListings:    (params)     => client.get("/properties/my/listings",  { params }).then(r => r.data),
  getMySales:       (params)     => client.get("/properties/my/sales",     { params }).then(r => r.data),
  getMyOwned:       (params)     => client.get("/properties/my/owned",     { params }).then(r => r.data),
  getMyPurchases:   (params)     => client.get("/properties/my/buying",    { params }).then(r => r.data),
}
