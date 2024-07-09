
import React from 'react';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; // Correct import for named export

const PrivateRoute = ({ component: Component, role, ...rest }) => {
  // Check if a token is present in localStorage
  const token = sessionStorage.getItem('token');

  if (!token) {
    // Redirect to login if no token is found
    return <Navigate to="/" />;
  }
  
  // Render the component if token is present and optionally authorized
  return <Component {...rest} />;
};

export default PrivateRoute;
