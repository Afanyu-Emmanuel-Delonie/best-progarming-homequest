import client from "./client"

export const locationApi = {
  getTree:     ()       => client.get("/locations/tree").then(r => r.data),
  getByCode:   (code)   => client.get(`/locations/${code}`).then(r => r.data),
  getChildren: (code)   => client.get(`/locations/${code}/children`).then(r => r.data),
  getByType:   (type)   => client.get(`/locations/type/${type}`).then(r => r.data),
  create:      (data)   => client.post("/locations", data).then(r => r.data),
}
