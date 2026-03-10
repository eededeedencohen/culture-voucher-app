import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE,
});

api.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  if (user?.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth
export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  getMe: () => api.get('/auth/me'),
};

// Vouchers
export const voucherAPI = {
  getAll: () => api.get('/vouchers'),
  create: (data) => api.post('/vouchers', data),
  assign: (id, studentId) => api.post(`/vouchers/${id}/assign`, { studentId }),
  generateBarcode: (id) => api.post(`/vouchers/${id}/generate-barcode`),
  scan: (barcode) => api.post('/vouchers/scan', { barcode }),
  redeem: (id) => api.post(`/vouchers/${id}/redeem`),
  getStats: () => api.get('/vouchers/stats'),
  getHistory: () => api.get('/vouchers/history'),
};

// Settings
export const settingsAPI = {
  get: () => api.get('/settings'),
  update: (data) => api.put('/settings', data),
};

// Users
export const userAPI = {
  getStudents: () => api.get('/users/students'),
  getBusinesses: () => api.get('/users/businesses'),
  getStudentVouchers: (id) => api.get(`/users/students/${id}/vouchers`),
  updateProfile: (data) => api.put('/users/profile', data),
};

export default api;
