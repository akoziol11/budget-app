import React from "react";
import { Link } from "react-router-dom";
import AuthLogin from "./AuthLogin"

const AuthModule = () => {
  return (
    <div>
      <AuthLogin />
      <p>Don't have an account? <Link to="/register">Register here</Link></p>
    </div>
  );
};

export default AuthModule;
