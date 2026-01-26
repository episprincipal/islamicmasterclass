import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "https://imc-api-tk-157114594912.us-central1.run.app",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("imc_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
