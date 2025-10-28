import axios from "axios";
import { normalizeAxiosError } from "./normalizeAxiosError";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://api.example.com",
  timeout: 15000,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

const PUBLIC_ENDPOINTS = [
  "/user/login",
  "/user/register",
  "/public",
  "/forgot-password",
];

api.interceptors.request.use(
  (config) => {
    const isPublic =
      config.url && PUBLIC_ENDPOINTS.some((url) => config.url.startsWith(url));

    if (!isPublic) {
      const token = localStorage.getItem("accessToken");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      // ✅ Cookies automatically sent because withCredentials=true
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (res) => res,
  (error) => {
    const e = normalizeAxiosError(error);

    return Promise.reject(e); // <- reject Error, not plain object
  }
);

export default api;
