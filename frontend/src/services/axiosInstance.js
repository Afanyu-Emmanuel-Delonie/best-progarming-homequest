const BASE = import.meta.env.VITE_API_URL ?? "http://localhost:8080"

const getToken = () => localStorage.getItem("token")

const request = (method, url, body) => {
  const token = getToken()
  return fetch(`${BASE}${url}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  }).then(async r => {
    const data = await r.json().catch(() => ({}))
    if (!r.ok) throw data
    return { data }
  })
}

const api = {
  get:   (url)        => request("GET",   url),
  post:  (url, body)  => request("POST",  url, body),
  patch: (url, body)  => request("PATCH", url, body),
}

export default api
