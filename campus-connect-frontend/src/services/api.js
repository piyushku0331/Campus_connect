// API service for Campus Connect
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return token ? { 'x-auth-token': token } : {};
};

// Helper function to handle API responses
const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || `HTTP error! status: ${response.status}`);
  }
  return response.json();
};

// Auth API
export const authAPI = {
  login: (credentials) => fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials)
  }).then(handleResponse),

  register: (userData) => fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData)
  }).then(handleResponse),

  verifyOtp: (otpData) => fetch(`${API_BASE_URL}/auth/verify-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(otpData)
  }).then(handleResponse),

  logout: () => fetch(`${API_BASE_URL}/auth/logout`, {
    method: 'POST'
  }).then(handleResponse)
};

// Events API
export const eventsAPI = {
  getEvents: () => fetch(`${API_BASE_URL}/events`).then(handleResponse),
  getEvent: (id) => fetch(`${API_BASE_URL}/events/${id}`).then(handleResponse),
  createEvent: (eventData) => fetch(`${API_BASE_URL}/events`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
    body: JSON.stringify(eventData)
  }).then(handleResponse),
  updateEvent: (id, eventData) => fetch(`${API_BASE_URL}/events/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
    body: JSON.stringify(eventData)
  }).then(handleResponse),
  deleteEvent: (id) => fetch(`${API_BASE_URL}/events/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders()
  }).then(handleResponse)
};

// Placements API
export const placementsAPI = {
  getPlacements: () => fetch(`${API_BASE_URL}/placements`).then(handleResponse),
  getPlacement: (id) => fetch(`${API_BASE_URL}/placements/${id}`).then(handleResponse),
  createPlacement: (placementData) => fetch(`${API_BASE_URL}/placements`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
    body: JSON.stringify(placementData)
  }).then(handleResponse)
};

// Notices API
export const noticesAPI = {
  getNotices: () => fetch(`${API_BASE_URL}/notices`).then(handleResponse),
  getNotice: (id) => fetch(`${API_BASE_URL}/notices/${id}`).then(handleResponse),
  createNotice: (formData) => fetch(`${API_BASE_URL}/notices`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: formData
  }).then(handleResponse)
};

// Study Materials API
export const materialsAPI = {
  getMaterials: () => fetch(`${API_BASE_URL}/materials`).then(handleResponse),
  getMaterial: (id) => fetch(`${API_BASE_URL}/materials/${id}`).then(handleResponse),
  createMaterial: (materialData) => fetch(`${API_BASE_URL}/materials`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
    body: JSON.stringify(materialData)
  }).then(handleResponse)
};

// Lost Items API
export const lostItemsAPI = {
  getLostItems: () => fetch(`${API_BASE_URL}/lost-items`).then(handleResponse),
  getLostItem: (id) => fetch(`${API_BASE_URL}/lost-items/${id}`).then(handleResponse),
  createLostItem: (itemData) => fetch(`${API_BASE_URL}/lost-items`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
    body: JSON.stringify(itemData)
  }).then(handleResponse)
};

// Helpline API
export const helplineAPI = {
  getHelplineContacts: () => fetch(`${API_BASE_URL}/helpline`).then(handleResponse),
  createHelplineContact: (contactData) => fetch(`${API_BASE_URL}/helpline`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
    body: JSON.stringify(contactData)
  }).then(handleResponse)
};

// Posts API (Community)
export const postsAPI = {
  getPosts: () => fetch(`${API_BASE_URL}/posts`).then(handleResponse),
  getPost: (id) => fetch(`${API_BASE_URL}/posts/${id}`).then(handleResponse),
  createPost: (postData) => fetch(`${API_BASE_URL}/posts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
    body: JSON.stringify(postData)
  }).then(handleResponse)
};

// Profiles API
export const profilesAPI = {
  getProfile: (id) => fetch(`${API_BASE_URL}/profiles/${id}`).then(handleResponse),
  updateProfile: (id, profileData) => fetch(`${API_BASE_URL}/profiles/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
    body: JSON.stringify(profileData)
  }).then(handleResponse)
};

// Analytics API
export const analyticsAPI = {
  getAnalytics: () => fetch(`${API_BASE_URL}/analytics`, {
    headers: getAuthHeaders()
  }).then(handleResponse)
};

// Password Reset API
export const passwordResetAPI = {
  forgotPassword: (email) => fetch(`${API_BASE_URL}/auth/forgot-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email })
  }).then(handleResponse),

  resetPassword: (token, newPassword) => fetch(`${API_BASE_URL}/auth/reset-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token, newPassword })
  }).then(handleResponse)
};