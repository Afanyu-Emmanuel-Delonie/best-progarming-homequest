import client from "./client"

export const locationApi = {
  getProvinces: ()     => client.get("/locations/type/PROVINCE").then(r => r.data),
  getChildren:  (code) => client.get(`/locations/${code}/children`).then(r => r.data),
}
