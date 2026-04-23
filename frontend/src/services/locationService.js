import api from "./axiosInstance"

export const locationService = {
  getProvinces:          ()     => api.get("/locations/type/PROVINCE").then(r => r.data),
  getChildren:           (code) => api.get(`/locations/${code}/children`).then(r => r.data),
}
