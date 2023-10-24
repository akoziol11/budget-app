import React from "react";
import { Link } from "react-router-dom";
import AuthLogin from "./AuthLogin"

const AuthModule = () => {
  return (
    <div>
      <Link to="/register">
        <button>Register</button>
      </Link>
      <br />
      <br />
      <AuthLogin />
    </div>
  );
};

export default AuthModule;
