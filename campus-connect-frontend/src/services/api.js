const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return token ? { 'x-auth-token': token } : {};
};

const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || `HTTP error! status: ${response.status}`);
  }
  return response.json();
};

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

  getCurrentUser: () => fetch(`${API_BASE_URL}/auth/me`, {
    headers: getAuthHeaders()
  }).then(handleResponse),

  logout: () => fetch(`${API_BASE_URL}/auth/logout`, {
    method: 'POST'
  }).then(handleResponse)
};

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

export const placementsAPI = {
  getPlacements: () => fetch(`${API_BASE_URL}/placements`).then(handleResponse),
  getPlacement: (id) => fetch(`${API_BASE_URL}/placements/${id}`).then(handleResponse),
  createPlacement: (placementData) => fetch(`${API_BASE_URL}/placements`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
    body: JSON.stringify(placementData)
  }).then(handleResponse)
};

export const noticesAPI = {
  getNotices: () => fetch(`${API_BASE_URL}/notices`).then(handleResponse),
  getNotice: (id) => fetch(`${API_BASE_URL}/notices/${id}`).then(handleResponse),
  createNotice: (formData) => fetch(`${API_BASE_URL}/notices`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: formData
  }).then(handleResponse)
};

export const materialsAPI = {
  getMaterials: () => fetch(`${API_BASE_URL}/materials`).then(handleResponse),
  getMaterial: (id) => fetch(`${API_BASE_URL}/materials/${id}`).then(handleResponse),
  createMaterial: (materialData) => fetch(`${API_BASE_URL}/materials`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
    body: JSON.stringify(materialData)
  }).then(handleResponse)
};

export const lostItemsAPI = {
  getLostItems: () => fetch(`${API_BASE_URL}/lost-items`).then(handleResponse),
  getLostItem: (id) => fetch(`${API_BASE_URL}/lost-items/${id}`).then(handleResponse),
  createLostItem: (formData) => fetch(`${API_BASE_URL}/lost-items`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: formData
  }).then(handleResponse)
};

export const helplineAPI = {
  getHelplineContacts: () => fetch(`${API_BASE_URL}/helpline`).then(handleResponse),
  createHelplineContact: (contactData) => fetch(`${API_BASE_URL}/helpline`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
    body: JSON.stringify(contactData)
  }).then(handleResponse)
};

export const postsAPI = {
  getPosts: () => fetch(`${API_BASE_URL}/posts`).then(handleResponse),
  getPost: (id) => fetch(`${API_BASE_URL}/posts/${id}`).then(handleResponse),
  createPost: (postData) => fetch(`${API_BASE_URL}/posts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
    body: JSON.stringify(postData)
  }).then(handleResponse)
};

export const profilesAPI = {
  getProfile: (id) => fetch(`${API_BASE_URL}/profiles/${id}`).then(handleResponse),
  updateProfile: (id, profileData) => {
    const isFormData = profileData instanceof FormData;
    return fetch(`${API_BASE_URL}/profiles`, {
      method: 'PUT',
      headers: isFormData ? getAuthHeaders() : { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: isFormData ? profileData : JSON.stringify(profileData)
    }).then(handleResponse);
  }
};

export const analyticsAPI = {
  getAnalytics: () => fetch(`${API_BASE_URL}/analytics`, {
    headers: getAuthHeaders()
  }).then(handleResponse)
};

export const connectionsAPI = {
  getConnections: () => fetch(`${API_BASE_URL}/connections`, {
    headers: getAuthHeaders()
  }).then(handleResponse),

  getPendingRequests: () => fetch(`${API_BASE_URL}/connections/pending`, {
    headers: getAuthHeaders()
  }).then(handleResponse),

  getSentRequests: () => fetch(`${API_BASE_URL}/connections/sent`, {
    headers: getAuthHeaders()
  }).then(handleResponse),

  getDiscoverUsers: () => fetch(`${API_BASE_URL}/connections/discover`, {
    headers: getAuthHeaders()
  }).then(handleResponse),

  sendConnectionRequest: (receiverId) => fetch(`${API_BASE_URL}/connections/request`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
    body: JSON.stringify({ receiverId })
  }).then(handleResponse),

  acceptConnection: (connectionId) => fetch(`${API_BASE_URL}/connections/${connectionId}/accept`, {
    method: 'PUT',
    headers: getAuthHeaders()
  }).then(handleResponse),

  declineConnection: (connectionId) => fetch(`${API_BASE_URL}/connections/${connectionId}/decline`, {
    method: 'PUT',
    headers: getAuthHeaders()
  }).then(handleResponse),

  withdrawRequest: (connectionId) => fetch(`${API_BASE_URL}/connections/${connectionId}/withdraw`, {
    method: 'DELETE',
    headers: getAuthHeaders()
  }).then(handleResponse)
};

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