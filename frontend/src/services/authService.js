const BASE = import.meta.env.VITE_API_URL ?? "http://localhost:8080"

const post = (url, body) =>
  fetch(`${BASE}${url}`, {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body:    JSON.stringify(body),
  }).then(async (r) => {
    const data = await r.json()
    if (!r.ok) throw new Error(data.message ?? "Request failed")
    return data
  })

export const authService = {
  login:    (body) => post("/auth/login",    body),
  register: (body) => post("/auth/register", body),
}
