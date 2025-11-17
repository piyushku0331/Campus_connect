// Authentication context for Campus Connect - manages global auth state
import React, { useState, useEffect, createContext } from 'react';
import PropTypes from 'prop-types'; // Prop validation for React components
import { useNavigate } from 'react-router-dom'; // Navigation hook for redirects
import { authAPI } from '../services/api'; // API service functions for auth

// Create React context for authentication state management
const AuthContext = createContext();

// Authentication provider component - wraps app and provides auth state
export const AuthProvider = ({ children }) => {
  // Prop validation for children
  AuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
  };

  // Navigation hook for programmatic routing
  const navigate = useNavigate();

  // Authentication state management
  const [user, setUser] = useState(null); // Current authenticated user data
  const [loading, setLoading] = useState(true); // Loading state during auth checks

  // Effect to check authentication status on app load/mount
  useEffect(() => {
    const getCurrentUser = async () => {
      // Check for stored access token
      const accessToken = sessionStorage.getItem('accessToken');
      if (accessToken) {
        try {
          // Validate token and fetch current user data
          const response = await authAPI.getCurrentUser();
          setUser(response.data.user);
        } catch (error) {
          console.error('Failed to get current user:', error);
          // Clear invalid token and reset user state
          sessionStorage.removeItem('accessToken');
          setUser(null);
          // Redirect to login if not already on auth pages
          if (window.location.pathname !== '/login' && window.location.pathname !== '/signup') {
            navigate('/login');
          }
        }
      } else {
        // No token found, user is not authenticated
        setUser(null);
      }
      // Authentication check complete
      setLoading(false);
    };

    // Execute authentication check
    getCurrentUser();
  }, [navigate]); // Re-run if navigation changes
  const signUp = async (email, password, formData) => {
    try {
      const response = await authAPI.signUp(email, password, formData);
      return { data: response.data, error: null };
    } catch (error) {
      return { data: null, error: error.response?.data?.error || error.message };
    }
  };
  // Sign in method - authenticates user and stores session data
  const signIn = async (email, password) => {
    try {
      // Call authentication API
      const response = await authAPI.signIn(email, password);

      // Validate response structure and extract user/token data
      if (response.data && response.data.data && response.data.data.user && response.data.data.session) {
        const userData = response.data.data.user;
        const accessToken = response.data.data.session.access_token;

        // Store access token securely in session storage
        sessionStorage.setItem('accessToken', accessToken);
        // Update local user state
        setUser(userData);

        return { data: response.data, error: null };
      } else {
        console.error('Invalid response data for JWT auth');
        return { data: null, error: 'Invalid response data' };
      }
    } catch (error) {
      console.error('SignIn error:', error);
      // Return error message from API or generic error
      return { data: null, error: error.response?.data?.error || error.message };
    }
  };

  // Sign out method - clears session and redirects to login
  const signOut = async () => {
    try {
      // Call sign out API to invalidate server-side session
      await authAPI.signOut();
    } catch (error) {
      console.error('Sign out error:', error);
    } finally {
      // Always clear local session data regardless of API call success
      sessionStorage.removeItem('accessToken');
      setUser(null);
      // Redirect to login page
      navigate('/login');
    }
    return { error: null };
  };
  const verifyOtp = async (email, token) => {
    try {
      const response = await authAPI.verifyOTP(email, token);
      if (response.data && response.data.data && response.data.data.user && response.data.data.session) {
        const userData = response.data.data.user;
        const accessToken = response.data.data.session.access_token;
        sessionStorage.setItem('accessToken', accessToken);
        setUser(userData);
        return { data: response.data, error: null };
      } else {
        console.error('Frontend: Invalid OTP verification response structure:', response.data);
        return { data: null, error: 'Invalid response data' };
      }
    } catch (error) {
      console.error('Frontend: OTP verification error:', error);
      console.error('Frontend: Error response:', error.response);
      console.error('Frontend: Error status:', error.response?.status);
      console.error('Frontend: Error data:', error.response?.data);
      return { data: null, error: error.response?.data?.error || error.message };
    }
  };
// Context value object - exposes auth state and methods to consuming components
  const value = {
    user,      // Current authenticated user data
    loading,   // Authentication loading state
    signUp,    // User registration method
    signIn,    // User login method
    signOut,   // User logout method
    verifyOtp, // OTP verification method
  };

  // Provide authentication context to child components
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext };
