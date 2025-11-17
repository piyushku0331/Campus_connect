import React, { useState, useEffect, createContext } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  AuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
  };
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const getCurrentUser = async () => {
      const accessToken = sessionStorage.getItem('accessToken');
      if (accessToken) {
        try {
          const response = await authAPI.getCurrentUser();
          setUser(response.data.user);
        } catch (error) {
          console.error('Failed to get current user:', error);
          sessionStorage.removeItem('accessToken');
          setUser(null);
          // Redirect to login if token is invalid
          if (window.location.pathname !== '/login' && window.location.pathname !== '/signup') {
            navigate('/login', { replace: true });
          }
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    };
    getCurrentUser();
  }, [navigate]);
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
      // Successful sign in; do not log sensitive tokens or user data

      if (response.data && response.data.data && response.data.data.user && response.data.data.session) {
        const userData = response.data.data.user;
        const accessToken = response.data.data.session.access_token;

        // Store access token in sessionStorage (in memory)
        sessionStorage.setItem('accessToken', accessToken);
        setUser(userData);
        // User logged in successfully

        return { data: response.data, error: null };
      } else {
        console.error('Invalid response data for JWT auth');
        return { data: null, error: 'Invalid response data' };
      }
    } catch (error) {
      console.error('SignIn error');
      return { data: null, error: error.response?.data?.error || error.message };
    }
  };
  const signOut = async () => {
    try {
      await authAPI.signOut();
    } catch (error) {
      console.error('Sign out error:', error);
    } finally {
      // Clear tokens and user data
      sessionStorage.removeItem('accessToken');
      setUser(null);
      // Redirect to login after logout
      navigate('/login', { replace: true });
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
        // OTP verified and user logged in
        return { data: response.data, error: null };
      } else {
        console.error('Frontend: Invalid OTP verification response structure:', response.data);
        return { data: null, error: 'Invalid response data' };
      }
    } catch (error) {
      console.error('Frontend: OTP verification error');
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
