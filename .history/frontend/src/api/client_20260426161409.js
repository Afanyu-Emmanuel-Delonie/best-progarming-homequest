import axios from "axios";
import { store } from "../store";
import { logout } from "../store/slices/authSlice";
import { toast } from "react-toastify";

const client = axios.create({
  baseURL:
    (import.meta.env.VITE_API_URL ?? "http://localhost:8080") + "/api/v1",
  headers: { "Content-Type": "application/json" },
  timeout: 15000,
});

// Attach Bearer token from Redux store on every request
client.interceptors.request.use((config) => {
  const token = store.getState().auth.token;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Global response error handling
client.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err.response?.status;

    if (status === 401) {
      store.dispatch(logout());
      window.location.href = "/login";
    }

    // Skip toast for silent requests (expected not-found lookups)
    const isSilent = err.config?.headers?.["X-Silent-Request"] === "true";
    if (!isSilent) {
      const message =
        err.response?.data?.message ||
        err.response?.data?.error ||
        (err.code === "ERR_NETWORK"
          ? "Cannot reach server. Please check your connection."
          : null) ||
        err.message ||
        "Something went wrong";

      toast.error(message);
    }

    return Promise.reject(err);
  },
);

export default client;
