import React, { useState, useEffect, createContext } from 'react';
import PropTypes from 'prop-types';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  AuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
  };
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const getCurrentUser = async () => {
      const token = localStorage.getItem('authToken');
      const refreshToken = localStorage.getItem('refreshToken');
      console.log('Tokens from localStorage on app load:', { token: token ? token.substring(0, 20) + '...' : null, refreshToken: refreshToken ? refreshToken.substring(0, 20) + '...' : null }); // Debug log
      if (token) {
        try {
          const response = await authAPI.getCurrentUser();
          console.log('Current user response:', response.data); // Debug log
          const userData = response.data.user || response.data;
          if (userData && typeof userData === 'object') {
            setUser(userData);
            console.log('User set from token on app load:', userData); // Debug log
          } else {
            console.error('Invalid user data from API - not an object');
            localStorage.removeItem('authToken');
            localStorage.removeItem('refreshToken');
            setUser(null);
          }
        } catch (error) {
          console.error('Error getting current user on app load:', error);
          // If token is invalid, try to refresh if we have a refresh token
          if (refreshToken && error.response?.status === 401) {
            console.log('Attempting to refresh token on app load'); // Debug log
            try {
              const refreshResponse = await authAPI.refreshToken(refreshToken);
              const newToken = refreshResponse.data.data.session?.access_token;
              const newRefreshToken = refreshResponse.data.data.session?.refresh_token;
              if (newToken) {
                localStorage.setItem('authToken', newToken);
                if (newRefreshToken) {
                  localStorage.setItem('refreshToken', newRefreshToken);
                }
                // Retry getting current user with new token
                const retryResponse = await authAPI.getCurrentUser();
                const userData = retryResponse.data.user || retryResponse.data;
                if (userData && typeof userData === 'object') {
                  setUser(userData);
                  console.log('User set after token refresh on app load:', userData); // Debug log
                } else {
                  localStorage.removeItem('authToken');
                  localStorage.removeItem('refreshToken');
                  setUser(null);
                }
              } else {
                localStorage.removeItem('authToken');
                localStorage.removeItem('refreshToken');
                setUser(null);
              }
            } catch (refreshError) {
              console.error('Failed to refresh token on app load:', refreshError);
              localStorage.removeItem('authToken');
              localStorage.removeItem('refreshToken');
              setUser(null);
            }
          } else {
            localStorage.removeItem('authToken');
            localStorage.removeItem('refreshToken');
            setUser(null);
          }
        }
      } else {
        console.log('No token found on app load, setting user to null'); // Debug log
        setUser(null);
      }
      setLoading(false);
    };
    getCurrentUser();
  }, []);
  const signUp = async (email, password, formData) => {
    try {
      const response = await authAPI.signUp(email, password, formData);
      return { data: response.data, error: null };
    } catch (error) {
      return { data: null, error: error.response?.data?.error || error.message };
    }
  };
  const signIn = async (email, password) => {
    try {
      const response = await authAPI.signIn(email, password);
      console.log('SignIn response:', response.data); // Debug log

      // Handle different possible response structures
      let token = null;
      let refreshToken = null;
      let userData = null;

      if (response.data.token) {
        token = response.data.token;
        userData = response.data.user;
      } else if (response.data.data) {
        if (response.data.data.session) {
          token = response.data.data.session.access_token;
          refreshToken = response.data.data.session.refresh_token;
          userData = response.data.data.user;
        } else {
          token = response.data.data.token;
          userData = response.data.data.user;
        }
      } else if (response.data.access_token) {
        token = response.data.access_token;
        refreshToken = response.data.refresh_token;
        userData = response.data.user;
      }

      console.log('Extracted token:', token); // Debug log
      console.log('Extracted userData:', userData); // Debug log

      if (token && userData) {
        // Clear any existing tokens first
        localStorage.removeItem('authToken');
        localStorage.removeItem('refreshToken');
        // Set new tokens
        localStorage.setItem('authToken', token);
        if (refreshToken) {
          localStorage.setItem('refreshToken', refreshToken);
        }
        console.log('Tokens saved to localStorage:', { token: localStorage.getItem('authToken') ? 'present' : 'null', refreshToken: localStorage.getItem('refreshToken') ? 'present' : 'null' }); // Debug log
        setUser(userData);
        console.log('User state set successfully'); // Debug log

        return { data: response.data, error: null };
      } else {
        console.error('Invalid response data - missing token or user:', { token, userData }); // Debug log
        return { data: null, error: 'Invalid response data' };
      }
    } catch (error) {
      console.error('SignIn error:', error); // Debug log
      return { data: null, error: error.response?.data?.error || error.message };
    }
  };
  const signOut = async () => {
    try {
      await authAPI.signOut();
    } catch (error) {
      console.error('Sign out error:', error);
    } finally {
      // Always clear local state regardless of API call success
      localStorage.removeItem('authToken');
      localStorage.removeItem('refreshToken');
      setUser(null);
    }
    return { error: null };
  };
  const verifyOtp = async (email, token) => {
    try {
      const response = await authAPI.verifyOTP(email, token, 'email');
      return { data: response.data, error: null };
    } catch (error) {
      return { data: null, error: error.response?.data?.error || error.message };
    }
  };
  const value = {
    user,
    loading,
    signUp,
    signIn,
    signOut,
    verifyOtp,
  };
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext };
