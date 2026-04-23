import api from "./axiosInstance"

const applicationService = {
  getById:        (id)         => api.get(`/applications/${id}`).then(r => r.data),
  getByProperty:  (propertyId) => api.get(`/applications/property/${propertyId}`).then(r => r.data),
  getMy:          ()           => api.get("/applications/my").then(r => r.data),
  submit:         (data)       => api.post("/applications", data).then(r => r.data),
  accept:         (id)         => api.patch(`/applications/${id}/accept`).then(r => r.data),
  reject:         (id)         => api.patch(`/applications/${id}/reject`).then(r => r.data),
  withdraw:       (id)         => api.patch(`/applications/${id}/withdraw`).then(r => r.data),
}

export default applicationService
