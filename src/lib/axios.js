import axios from "axios";

const ROUTER = import.meta.env.VITE_API || "http://localhost:5500";

const api = axios.create({
  baseURL: ROUTER,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Call this after receiving a sessionId from the gateway.
 * Prefixes all API calls with /workspace/:sessionId so the router
 * can proxy them to the correct sandbox container.
 */
export function setSessionBaseURL(sessionId) {
  api.defaults.baseURL = `${ROUTER}/workspace/${sessionId}`;
}

// Request interceptor — attach auth token, etc.
api.interceptors.request.use(
  (config) => {
    // You can add auth headers here, e.g.:
    // const token = getToken();
    // if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor — centralised error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response?.status, error.message);
    return Promise.reject(error);
  },
);

export default api;
