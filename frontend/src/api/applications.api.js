import client from "./client"

export const applicationsApi = {
  getAll:          (params)     => client.get("/applications",                    { params }).then(r => r.data),
  getById:         (id)         => client.get(`/applications/${id}`).then(r => r.data),
  getMy:           (params)     => client.get("/applications/my",                 { params }).then(r => r.data),
  getMyListings:   (params)     => client.get("/applications/my-listings",        { params }).then(r => r.data),
  getByProperty:   (id, params) => client.get(`/applications/property/${id}`,     { params }).then(r => r.data),
  submit:          (data)       => client.post("/applications",                   data).then(r => r.data),
  accept:          (id)         => client.patch(`/applications/${id}/accept`).then(r => r.data),
  reject:          (id)         => client.patch(`/applications/${id}/reject`).then(r => r.data),
  withdraw:        (id)         => client.patch(`/applications/${id}/withdraw`).then(r => r.data),
}
