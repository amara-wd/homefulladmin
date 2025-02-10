import React from "react";
import { Navigate } from "react-router-dom";

interface PrivateRouteProps {
  element: React.ComponentType<any>;
  path: string;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ element: Component, ...rest }) => {
  const isAuthenticated = localStorage.getItem("token"); // Check if the user is authenticated

  return isAuthenticated ? <Component {...rest} /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
