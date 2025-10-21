import axios from 'axios';
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshResponse = await api.post('/refresh-token');
        const newToken = refreshResponse.data.data.session?.access_token;
        if (newToken) {
          localStorage.setItem('authToken', newToken);
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        localStorage.removeItem('authToken');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    if (error.response?.status >= 500) {
      console.error('Server error:', error.response.data);
    } else if (error.response?.status === 400) {
      console.error('Client error:', error.response.data);
    }
    return Promise.reject(error);
  }
);
export const authAPI = {
  signUp: (email, password, formData) => {
    if (formData instanceof FormData) {
      return api.post('/auth/signup', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    }
    return api.post('/auth/signup', { email, password });
  },
  signIn: (email, password) => api.post('/auth/signin', { email, password }),
  signOut: () => api.post('/auth/signout'),
  sendOTP: (email, type) => api.post('/auth/send-otp', { email, type }),
  verifyOTP: (email, token, type) => api.post('/auth/verify-otp', { email, token, type }),
  getCurrentUser: () => api.get('/auth/current-user'),
  refreshToken: () => api.post('/auth/refresh-token'),
};
export const gamificationAPI = {
  getUserPoints: () => api.get('/gamification/points'),
  getPointsHistory: (page = 1, limit = 20) => api.get(`/gamification/points/history?page=${page}&limit=${limit}`),
  getLeaderboard: (limit = 50) => api.get(`/gamification/leaderboard?limit=${limit}`),
  getUserRank: () => api.get('/gamification/rank'),
  getUserAchievements: () => api.get('/gamification/achievements'),
  getAvailableAchievements: () => api.get('/gamification/achievements/available'),
  getActiveChallenges: () => api.get('/gamification/challenges'),
  getUserChallenges: () => api.get('/gamification/challenges/user'),
};
export const eventsAPI = {
  getEvents: (page = 1, limit = 10, upcoming = false) => api.get(`/events?page=${page}&limit=${limit}&upcoming=${upcoming}`),
  getEventById: (id) => api.get(`/events/${id}`),
  createEvent: (eventData) => api.post('/events', eventData),
  updateEvent: (id, eventData) => api.put(`/events/${id}`, eventData),
  deleteEvent: (id) => api.delete(`/events/${id}`),
  rsvpEvent: (id, status) => api.post(`/events/${id}/rsvp`, { status }),
  getUserEvents: () => api.get('/events/user'),
};
export const connectionsAPI = {
  getConnections: () => api.get('/connections'),
  sendConnectionRequest: (receiverId) => api.post('/connections', { receiver_id: receiverId }),
  acceptConnectionRequest: (id) => api.put(`/connections/${id}/accept`),
  rejectConnectionRequest: (id) => api.put(`/connections/${id}/reject`),
  removeConnection: (id) => api.delete(`/connections/${id}`),
  getConnectionRequests: () => api.get('/connections/requests'),
};
export const resourcesAPI = {
  getResources: (page = 1, limit = 10, search, tag) => {
    const params = new URLSearchParams({ page, limit });
    if (search) params.append('search', search);
    if (tag) params.append('tag', tag);
    return api.get(`/resources?${params}`);
  },
  getResourceById: (id) => api.get(`/resources/${id}`),
  uploadResource: (resourceData) => api.post('/resources', resourceData),
  updateResource: (id, resourceData) => api.put(`/resources/${id}`, resourceData),
  deleteResource: (id) => api.delete(`/resources/${id}`),
  searchResources: (query, tag) => {
    const params = new URLSearchParams();
    if (query) params.append('query', query);
    if (tag) params.append('tag', tag);
    return api.get(`/resources/search?${params}`);
  },
  getUserResources: () => api.get('/resources/user'),
  incrementDownloadCount: (id) => api.post(`/resources/${id}/download`),
};
export const usersAPI = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (profileData) => api.put('/users/profile', profileData),
  getUserById: (id) => api.get(`/users/${id}`),
  searchUsers: (query, major, year, age) => {
    const params = new URLSearchParams();
    if (query) params.append('query', query);
    if (major) params.append('major', major);
    if (year) params.append('year', year);
    if (age) params.append('age', age);
    return api.get(`/users/search?${params}`);
  },
};
export default api;
