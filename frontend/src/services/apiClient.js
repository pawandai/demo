import axios from "axios";
import { useAuthStore } from "../stores/authStore";

// Fix 1: Make sure API_BASE_URL doesn't have double slashes
const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8000/api";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    console.log(
      `API Request: ${config.method.toUpperCase()} ${config.baseURL}${
        config.url
      }`,
      config.data
    );
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
    }
    return Promise.reject(error);
  }
);

// API service functions
export const termsApi = {
  getByLanguage: (language) => apiClient.get(`/terms/${language}`),
  getAll: () => apiClient.get("/terms"),
  create: (data) => apiClient.post("/terms", data),
  update: (id, data) => apiClient.put(`/terms/${id}`, data),
  delete: (id) => apiClient.delete(`/terms/${id}`),
};

export const productsApi = {
  getAll: (params) => apiClient.get("/products", { params }),
  getById: (id) => apiClient.get(`/products/${id}`),
  getCategories: () => apiClient.get("/products/categories"),
  create: (data) => apiClient.post("/products", data),
  bulkCreate: (data) => apiClient.post("/products/bulk", data),
  update: (id, data) => apiClient.put(`/products/${id}`, data),
  delete: (id) => apiClient.delete(`/products/${id}`),
};

export const customersApi = {
  getAll: (params) => apiClient.get("/customers", { params }),
  getById: (id) => apiClient.get(`/customers/${id}`),
  create: (data) => apiClient.post("/customers", data),
  update: (id, data) => apiClient.put(`/customers/${id}`, data),
  delete: (id) => apiClient.delete(`/customers/${id}`),
  getStats: (id) => apiClient.get(`/customers/${id}/stats`),
};

export const invoicesApi = {
  getAll: (params) => apiClient.get("/invoices", { params }),
  getById: (id) => apiClient.get(`/invoices/${id}`),
  create: (data) => apiClient.post("/invoices", data),
  update: (id, data) => apiClient.put(`/invoices/${id}`, data),
  delete: (id) => apiClient.delete(`/invoices/${id}`),
  markAsPaid: (id) => apiClient.patch(`/invoices/${id}/paid`),
  send: (id) => apiClient.post(`/invoices/${id}/send`),
};

export const usersApi = {
  getAll: (params) => apiClient.get("/users", { params }),
  getById: (id) => apiClient.get(`/users/${id}`),
  update: (id, data) => apiClient.put(`/users/${id}`, data),
  delete: (id) => apiClient.delete(`/users/${id}`),
  getStats: (id) => apiClient.get(`/users/${id}/stats`),
};

export const authApi = {
  login: (credentials) => apiClient.post("/auth/login", credentials),
  register: (userData) => apiClient.post("/auth/register", userData),
  profile: () => apiClient.get("/auth/profile"),
  updateProfile: (data) => apiClient.put("/auth/profile", data),
};
