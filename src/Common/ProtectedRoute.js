import React from "react";
import { Navigate } from "react-router-dom";
import { checkUser } from "../Components/Authentication/AuthService.js";



const ProtectedRoute = ({ element: Component, ...rest }) => {
  // If user is logged in, load the component, else redirect to "/auth" (login) page
  return checkUser() ? <Component /> : <Navigate to="/auth" replace />;
};

export default ProtectedRoute;
