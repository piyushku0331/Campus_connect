import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { authAPI } from '../services/api';
import { AuthContext } from './AuthContext';
export const AuthProvider = ({ children }) => {
  AuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
  };
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const getCurrentUser = async () => {
      const token = localStorage.getItem('authToken');
      if (token) {
        try {
          const response = await authAPI.getCurrentUser();
          setUser(response.data.user);
        } catch (error) {
          console.error('Error getting current user:', error);
          localStorage.removeItem('authToken');
        }
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
      const token = response.data.data.session?.access_token;
      if (token) {
        localStorage.setItem('authToken', token);
        setUser(response.data.data.user);
      }
      return { data: response.data, error: null };
    } catch (error) {
      return { data: null, error: error.response?.data?.error || error.message };
    }
  };
  const signOut = async () => {
    try {
      await authAPI.signOut();
      localStorage.removeItem('authToken');
      setUser(null);
      return { error: null };
    } catch (error) {
      localStorage.removeItem('authToken');
      setUser(null);
      return { error: error.response?.data?.error || error.message };
    }
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
