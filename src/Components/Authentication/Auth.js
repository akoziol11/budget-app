import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { checkUser } from "./AuthService.js";
import AuthLogin from "./AuthLogin.js"

const AuthModule = () => {
  const navigate = useNavigate();

  // redirect authenticated (logged in) users to the home page
  useEffect(() => {
    if (checkUser()) {
      alert("You are already logged in");
      navigate("/");
    }
  }, [navigate]);


  // Login screen with link to register
  return (
    <div>
      <h1> Welcome to Budget Buddy! </h1>
      <AuthLogin />
      <p>Don't have an account? <Link to="/auth/register">Register here</Link></p>
    </div>
  );
};

export default AuthModule;
