import client from "./client"

export const documentsApi = {
  getAll:          ()              => client.get("/documents").then(r => r.data),
  getMy:           ()              => client.get("/documents/my").then(r => r.data),
  getByProperty:   (propertyId)   => client.get(`/documents/property/${propertyId}`).then(r => r.data),
  getByUploader:   (publicId)     => client.get(`/documents/uploader/${publicId}`).then(r => r.data),
  getByApplication:(applicationId)=> client.get(`/documents/application/${applicationId}`).then(r => r.data),
  upload:          (data)         => client.post("/documents",         data).then(r => r.data),
  request:         (data)         => client.post("/documents/request",  data).then(r => r.data),
  getMyRequested:  ()             => client.get("/documents/requested/me").then(r => r.data),
  verify:          (id)           => client.patch(`/documents/${id}/verify`).then(r => r.data),
  reject:          (id)           => client.patch(`/documents/${id}/reject`).then(r => r.data),
  remove:          (id)           => client.delete(`/documents/${id}`).then(r => r.data),
}
