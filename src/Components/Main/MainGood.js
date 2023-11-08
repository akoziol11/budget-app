import React from "react";
import { Navigate } from "react-router-dom";
import NavigationBar from "../NavigationBar/NavigationBar.js";
import { checkUser } from "../Authentication/AuthService";

const MainGood = () => {
  return (
    <div>
      <NavigationBar />
      {/* If the user is logged in, show home page, else redirect to login page */}
      {checkUser() ? (
        <h1>
          Welcome to Budget Buddy!
        </h1>
      ) : (
        <Navigate to="/auth" replace />
      )}
    </div>
  );
};

export default MainGood;
