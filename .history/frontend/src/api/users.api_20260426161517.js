import client from "./client";

export const usersApi = {
  getAll: (params) => client.get("/users", { params }).then((r) => r.data),
  getById: (id) => client.get(`/users/${id}`).then((r) => r.data),
  remove: (id) => client.delete(`/users/${id}`).then((r) => r.data),
  suspend: (id) => client.patch(`/users/${id}/suspend`).then((r) => r.data),
  activate: (id) => client.patch(`/users/${id}/activate`).then((r) => r.data),
  // Profile lookups by publicId (silent = no toast on 404)
  getAgentByPublicId: (pid) =>
    client
      .get(`/agents/by-public-id/${pid}`, {
        headers: { "X-Silent-Request": "true" },
      })
      .then((r) => r.data)
      .catch(() => null),
  getOwnerByPublicId: (pid) =>
    client
      .get(`/owners/by-public-id/${pid}`, {
        headers: { "X-Silent-Request": "true" },
      })
      .then((r) => r.data)
      .catch(() => null),
  getClientByPublicId: (pid) =>
    client
      .get(`/clients/by-public-id/${pid}`, {
        headers: { "X-Silent-Request": "true" },
      })
      .then((r) => r.data)
      .catch(() => null),
};

export const clientsApi = {
  getAll: () => client.get("/clients").then((r) => r.data),
  getByCompany: (companyId) =>
    client
      .get("/clients/by-company", { params: { companyId } })
      .then((r) => r.data),
};

// Resolve a publicId to "First Last" — tries agent, then owner, then client
export async function resolvePublicId(pid) {
  if (!pid) return "—";
  const profile =
    (await usersApi.getAgentByPublicId(pid)) ??
    (await usersApi.getOwnerByPublicId(pid)) ??
    (await usersApi.getClientByPublicId(pid));
  if (!profile) return pid.slice(0, 8) + "…";
  return `${profile.firstName} ${profile.lastName}`;
}
