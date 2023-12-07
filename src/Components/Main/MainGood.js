import React from "react";
import { Navigate } from "react-router-dom";
import NavigationBar from "../NavigationBar/NavigationBar.js";
import { checkUser } from "../Authentication/AuthService";
import "../../home-styles.css"

const MainGood = () => {
  return (
    <div>
      <NavigationBar />
      {checkUser() ? (
        <div>
          <h1>Welcome to Pocket Pal!</h1>
          <p>
            Begin by selecting the "Plan" tab to start planning your monthly budget. You can adjust your budget anytime on the "Plan" page.
          </p>
          <p>
            You can view and track your budget on the "Track" page.
          </p>
        </div>
      ) : (
        <Navigate to="/auth" replace />
      )}
    </div>
  );
};

export default MainGood;
