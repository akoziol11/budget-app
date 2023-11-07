import React from "react";
import { Navigate } from "react-router-dom";
import { checkUser } from "../Components/Authentication/AuthService.js";



const ProtectedRoute = ({ element: Component, ...rest }) => {
  return checkUser() ? <Component /> : <Navigate to="/auth" replace />;
};

export default ProtectedRoute;
