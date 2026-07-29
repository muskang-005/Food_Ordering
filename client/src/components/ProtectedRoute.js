// src/components/ProtectedRoute.js
import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ component: Component, role, ...rest }) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (role && user.userType !== role) {
    return <Navigate to="/" />;
  }

  return <Component {...rest} />;
};

export default ProtectedRoute;
