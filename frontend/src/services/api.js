import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;

// Movie API functions
export const movieApi = {
  getAll: (page = 1, limit = 10) =>
    api.get(`/movies?page=${page}&limit=${limit}`),

  getById: (id) =>
    api.get(`/movies/${id}`),

  search: (query, page = 1, limit = 10) =>
    api.get(`/movies/search?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}`),

  getSorted: (sortBy, order = 'desc', page = 1, limit = 10) =>
    api.get(`/movies/sorted?sortBy=${sortBy}&order=${order}&page=${page}&limit=${limit}`),

  create: (movieData) =>
    api.post('/movies', movieData),

  update: (id, movieData) =>
    api.put(`/movies/${id}`, movieData),

  delete: (id) =>
    api.delete(`/movies/${id}`)
};

// Auth API functions
export const authApi = {
  login: (credentials) =>
    api.post('/auth/login', credentials),

  register: (userData) =>
    api.post('/auth/register', userData),

  getMe: () =>
    api.get('/auth/me'),

  logout: () =>
    api.get('/auth/logout')
};
