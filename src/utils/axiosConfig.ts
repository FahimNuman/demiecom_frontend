import axios from "axios";
import { AxiosResponse } from "axios";
import { AxiosError } from "axios";
import { AxiosRequestConfig } from "axios";

// Create an Axios instance
const AxiosClient = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL, // Use Vite environment variables for API URL
  headers: {
    "Content-Type": "application/json",
  },
});

// Intercept the request to add the Authorization token from localStorage
AxiosClient.interceptors.request.use(
  async (config: AxiosRequestConfig) => {
    const accessToken = localStorage.getItem("token");

    if (accessToken) {
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

export default AxiosClient;
