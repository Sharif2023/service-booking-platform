import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (email, password, full_name, phone) =>
    api.post('/auth/register', { email, password, full_name, phone }),
  login: (email, password) => api.post('/auth/login', { email, password }),
  updateProfile: (data) => api.put('/auth/profile', data),
};

export const servicesAPI = {
  getAll: () => api.get('/services'),
  getById: (id) => api.get(`/services/${id}`),
  create: (service) => api.post('/services', service),
  update: (id, service) => api.put(`/services/${id}`, service),
  delete: (id) => api.delete(`/services/${id}`),
};

export const bookingsAPI = {
  createSession: (data) => api.post('/bookings/create-session', data),
  getSessionStatus: (sessionId) => api.get(`/bookings/session-status/${sessionId}`),
  getMyBookings: () => api.get('/bookings'),
  cancelBooking: (id) => api.patch(`/bookings/${id}/cancel`),
};

export const adminAPI = {
  getBookings: () => api.get('/admin/bookings'),
  updateBookingStatus: (id, status) => api.patch(`/admin/bookings/${id}/status`, { status }),
  getAnalytics: () => api.get('/admin/analytics'),
};

export default api;
