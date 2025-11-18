import React from 'react';
import PropTypes from 'prop-types';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};
  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role === 'admin') {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return children;
};
export default ProtectedRoute;
