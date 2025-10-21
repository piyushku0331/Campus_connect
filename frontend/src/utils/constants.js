export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
export const TOKEN_KEY = 'campus_connect_token';
export const REFRESH_TOKEN_KEY = 'campus_connect_refresh_token';
export const USER_ROLES = {
  STUDENT: 'student',
  ADMIN: 'admin'
};
export const EVENT_STATUS = {
  UPCOMING: 'upcoming',
  ONGOING: 'ongoing',
  COMPLETED: 'completed'
};
export const CONNECTION_STATUS = {
  PENDING: 'pending',
  ACCEPTED: 'accepted',
  REJECTED: 'rejected'
};
export const RSVP_STATUS = {
  ATTENDING: 'attending',
  INTERESTED: 'interested',
  NOT_ATTENDING: 'not_attending'
};
export const PAGINATION_DEFAULTS = {
  PAGE: 1,
  LIMIT: 10,
  MAX_LIMIT: 100
};
export const FILE_UPLOAD_LIMITS = {
  MAX_SIZE: 10 * 1024 * 1024, 
  ALLOWED_TYPES: ['pdf', 'doc', 'docx', 'txt', 'jpg', 'jpeg', 'png']
};
export const VALIDATION_RULES = {
  PASSWORD_MIN_LENGTH: 8,
  NAME_MAX_LENGTH: 255,
  BIO_MAX_LENGTH: 500,
  DESCRIPTION_MAX_LENGTH: 1000
};
export const TOAST_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info'
};
export const STORAGE_KEYS = {
  USER: 'campus_connect_user',
  THEME: 'campus_connect_theme',
  LANGUAGE: 'campus_connect_language'
};
