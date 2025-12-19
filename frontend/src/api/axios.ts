import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5001/api/v1";

/**
 * Axios instance with default configuration
 * Credentials included for cookie-based auth
 */
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Request interceptor for debugging
 */
axiosInstance.interceptors.request.use(
  (config) => {
    console.log(`[${config.method?.toUpperCase()}] ${config.url}`);
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Response interceptor for error handling
 */
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("Axios error:", {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });
    
    if (error.response?.status === 401) {
      // Unauthorized - redirect to login
      window.location.href = "/auth/login";
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;

