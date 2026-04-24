import client from "./client"

export const authApi = {
  login:    (data) => client.post("/auth/login",    data).then(r => r.data),
  register: (data) => client.post("/auth/register", data).then(r => r.data),
}
