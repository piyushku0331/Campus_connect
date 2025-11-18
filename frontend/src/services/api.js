import axios from 'axios';
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});
// JWT token handling
api.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
// JWT token refresh handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        // Refresh token is handled via httpOnly cookie, no need to send it
        const refreshResponse = await axios.post(`${API_BASE_URL}/auth/refresh-token`, {}, {
          withCredentials: true
        });
        const newToken = refreshResponse.data.data.session?.access_token;
        if (newToken) {
          sessionStorage.setItem('accessToken', newToken);
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        sessionStorage.removeItem('accessToken');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    console.error('API Error Response:', error.response?.status, error.response?.data);
    if (error.response?.status >= 500) {
      console.error('Server error:', error.response.data);
    } else if (error.response?.status === 400) {
      console.error('Request URL:', error.config.url);
      console.error('Request method:', error.config.method);
      console.error('Request data:', error.config.data);
      console.error('Response status:', error.response.status);
      console.error('Client error details:', JSON.stringify(error.response.data, null, 2));
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
    return api.post('/auth/signup', { email, password, name: formData.name, age: formData.age, department: formData.department, semester: formData.semester });
  },
  signIn: (email, password) => api.post('/auth/signin', { email, password }),
  signOut: () => api.post('/auth/signout'),
  sendOTP: (email, type) => api.post('/auth/send-otp', { email, type }),
  verifyOTP: (email, otp) => api.post('/auth/verify-otp', { email, otp }),
  getCurrentUser: () => api.get('/auth/current-user'),
  refreshToken: (refreshToken) => api.post('/auth/refresh-token', { refresh_token: refreshToken }),
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
  uploadResource: (resourceData) => {
    if (resourceData instanceof FormData) {
      return api.post('/resources', resourceData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    }
    return api.post('/resources', resourceData);
  },
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
  getUsers: (page = 1, limit = 50) => api.get(`/users?page=${page}&limit=${limit}`),
  getProfile: () => api.get('/users/profile'),
  updateProfile: (profileData) => {
    if (profileData instanceof FormData) {
      return api.put('/users/profile', profileData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    }
    return api.put('/users/profile', profileData);
  },
  togglePrivacy: (isPublic) => api.patch('/users/privacy', { isPublic }),
  getUserById: (id) => api.get(`/users/${id}`),
  searchUsers: (query, major, year, age) => {
    const params = new URLSearchParams();
    if (query) params.append('query', query);
    if (major) params.append('major', major);
    if (year) params.append('year', year);
    if (age) params.append('age', age);
    return api.get(`/users/search?${params}`);
  },
  getAlumni: () => api.get('/users/alumni'),
};
export const newsAPI = {
  getEducationalNews: () => api.get('/news/educational'),
};
export const blogAPI = {
  getBlogs: (params = '') => api.get(`/blogs${params}`),
  getBlogById: (id) => api.get(`/blogs/${id}`),
  createBlog: (blogData) => api.post('/blogs', blogData),
  updateBlog: (id, blogData) => api.put(`/blogs/${id}`, blogData),
  deleteBlog: (id) => api.delete(`/blogs/${id}`),
  getUserBlogs: (params = '') => api.get(`/blogs/user/my-posts${params}`),
  toggleLike: (id) => api.post(`/blogs/${id}/like`),
  addComment: (id) => api.post(`/blogs/${id}/comment`),
  getTags: () => api.get('/blogs/tags'),
};
export const postsAPI = {
  getFeed: () => api.get('/posts/feed'),
  getCreatorPosts: (creatorId) => api.get(`/posts/creator/${creatorId}`),
  getPost: (postId) => api.get(`/posts/${postId}`),
  createPost: (formData) => api.post('/posts', formData),
  updatePost: (postId, postData) => api.put(`/posts/${postId}`, postData),
  deletePost: (postId) => api.delete(`/posts/${postId}`),
  toggleLike: (postId) => api.post(`/posts/${postId}/like`),
  addComment: (postId) => api.post(`/posts/${postId}/comment`),
  getTrendingPosts: () => api.get('/posts/trending'),
  searchPosts: (params) => api.get(`/posts/search?${params}`),
};
export const noticesAPI = {
  getNotices: (page = 1, limit = 10) => api.get(`/notices?page=${page}&limit=${limit}`),
  getNoticeById: (id) => api.get(`/notices/${id}`),
  createNotice: (noticeData) => api.post('/notices', noticeData),
  updateNotice: (id, noticeData) => api.put(`/notices/${id}`, noticeData),
  deleteNotice: (id) => api.delete(`/notices/${id}`),
};
export const creatorsAPI = {
  applyForCreator: (applicationData) => api.post('/creators/apply', applicationData),
  getCreatorProfile: () => api.get('/creators/profile/me'),
  updateCreatorProfile: (profileData) => api.put('/creators/profile/me', profileData),
  getPublicCreatorProfile: (creatorId) => api.get(`/creators/${creatorId}`),
  toggleFollow: (creatorId) => api.post(`/creators/${creatorId}/follow`),
  getSuggestedCreators: () => api.get('/creators/suggested'),
};
export const conversationsAPI = {
  getConversations: () => api.get('/conversations'),
  getConversation: (conversationId) => api.get(`/conversations/${conversationId}`),
  createConversation: (participantId) => api.post('/conversations', { participantId }),
  sendMessage: (conversationId, text) => api.post(`/conversations/${conversationId}/messages`, { text }),
};
export const lostItemsAPI = {
  getLostItems: (params = {}) => {
    const queryParams = new URLSearchParams();
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
        queryParams.append(key, params[key]);
      }
    });
    return api.get(`/lost-items?${queryParams}`);
  },
  reportItem: (itemData) => {
    if (itemData instanceof FormData) {
      return api.post('/lost-items', itemData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    }
    return api.post('/lost-items', itemData);
  },
  updateItemStatus: (id, status) => api.put(`/lost-items/${id}/status`, { status }),
  claimItem: (id) => api.put(`/lost-items/${id}/claim`),
  deleteItem: (id) => api.delete(`/lost-items/${id}`),
};

export const adminAPI = {
  getAnalytics: () => api.get('/admin/analytics'),
  getContentForModeration: (type = 'all', page = 1, limit = 20) => api.get(`/admin/content/moderation?type=${type}&page=${page}&limit=${limit}`),
  moderateContent: (id, contentType, action) => api.post('/admin/content/moderate', { id, contentType, action }),
  getPendingEvents: (page = 1, limit = 10) => api.get(`/admin/events/pending?page=${page}&limit=${limit}`),
  approveEvent: (id) => api.put(`/admin/events/${id}/approve`),
  rejectEvent: (id) => api.put(`/admin/events/${id}/reject`),
};
export default api;
