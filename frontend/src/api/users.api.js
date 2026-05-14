import client from "./client";

export const usersApi = {
  getAll: (params) => client.get("/users", { params }).then((r) => r.data),
  getById: (id) => client.get(`/users/${id}`).then((r) => r.data),
  getByPublicId: (pid) => client.get(`/users/by-public-id/${pid}`).then((r) => r.data),
  remove: (id) => client.delete(`/users/${id}`).then((r) => r.data),
  suspend: (id) => client.patch(`/users/${id}/suspend`).then((r) => r.data),
  activate: (id) => client.patch(`/users/${id}/activate`).then((r) => r.data),
  // Profile lookups by publicId (silent = no toast on missing profile)
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

// Resolve a publicId to a display name using the base user record first.
export async function resolvePublicId(pid) {
  if (!pid) return "—";
  try {
    const user = await usersApi.getByPublicId(pid);
    const role = user?.role;
    const profile =
      role === "ROLE_AGENT"
        ? await usersApi.getAgentByPublicId(pid)
        : role === "ROLE_OWNER"
          ? await usersApi.getOwnerByPublicId(pid)
          : role === "ROLE_CUSTOMER"
            ? await usersApi.getClientByPublicId(pid)
            : null;

    if (profile?.firstName || profile?.lastName) {
      return `${profile.firstName ?? ""} ${profile.lastName ?? ""}`.trim();
    }
    if (user?.username) return user.username;
  } catch {
    // fall through to short ID below
  }
  return `${pid.slice(0, 8)}…`;
}
