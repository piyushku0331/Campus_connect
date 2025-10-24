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
      // For hardcoded auth, always set the mock user if "logged in"
      const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
      if (isLoggedIn) {
        const mockUser = {
          id: '507f1f77bcf86cd799439011',
          email: 'piyush1093.be23@chitkara.edu.in',
          name: 'Piyush',
          avatar_url: null,
          age: 20,
          department: 'Computer Science',
          semester: 'BE23'
        };
        setUser(mockUser);
      } else {
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

      // For hardcoded auth, just check if login was successful
      if (response.data && response.data.data && response.data.data.user) {
        const userData = response.data.data.user;

        // Set login flag in localStorage
        localStorage.setItem('isLoggedIn', 'true');
        setUser(userData);
        console.log('User logged in successfully with hardcoded auth'); // Debug log

        return { data: response.data, error: null };
      } else {
        console.error('Invalid response data for hardcoded auth'); // Debug log
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
      // For hardcoded auth, just remove login flag
      localStorage.removeItem('isLoggedIn');
      setUser(null);
    }
    return { error: null };
  };
  // Commented out OTP verification for hardcoded auth
  /*
  const verifyOtp = async (email, token) => {
    try {
      const response = await authAPI.verifyOTP(email, token, 'email');
      return { data: response.data, error: null };
    } catch (error) {
      return { data: null, error: error.response?.data?.error || error.message };
    }
  };
  */
  const value = {
    user,
    loading,
    signUp,
    signIn,
    signOut,
    // verifyOtp, // Commented out for hardcoded auth
  };
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext };
