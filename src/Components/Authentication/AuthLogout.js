import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { logoutUser } from "./AuthService";
import "../../nav-style.css"; // Import the CSS file for navigation styles

const AuthLogout = () => {
  const navigate = useNavigate();

  // Log out user and bring them back to /auth (login) page
  const handleLogout = () => {
    logoutUser().then(() => {
      alert("You have been successfully logged out");
      navigate("/auth");
    });
  };

  return (
    <Link to="/auth" className="navigation" onClick={handleLogout}>
      Logout
    </Link>
  );
};

export default AuthLogout;
